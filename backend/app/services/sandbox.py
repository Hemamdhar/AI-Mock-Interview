import os
import sys
import time
import shutil
import signal
import tempfile
import subprocess
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict

try:
    import resource
except ImportError:
    resource = None


@dataclass
class ExecutionResult:
    status: str  # "success" | "error" | "timeout" | "security_violation"
    stdout: str
    stderr: str
    execution_time_ms: int
    exit_code: int


@dataclass
class TestCaseResult:
    test_case: int
    passed: bool
    input: str
    expected_output: str
    actual_output: str
    runtime_ms: int
    error: Optional[str] = None


@dataclass
class TestRunResult:
    all_passed: bool
    passed_count: int
    total_count: int
    total_runtime_ms: int
    results: List[TestCaseResult]


class IsolatedSandbox:
    """
    Isolated Code Execution Sandbox.
    Enforces process isolation, resource ceilings (CPU time, memory limits, output caps),
    clean environment scrubbing, and clean process group termination.
    """

    DEFAULT_TIMEOUT_SECONDS = 5
    MAX_TIMEOUT_SECONDS = 15
    DEFAULT_MEMORY_MB = 256
    MAX_OUTPUT_BYTES = 256 * 1024  # 256KB output cap

    # Forbidden patterns in untrusted code for static security filtering (OWASP / MITRE ATT&CK)
    FORBIDDEN_PYTHON_TOKENS = [
        "__import__('os').system",
        "__import__('subprocess')",
        "os.system",
        "subprocess.",
        "shutil.rmtree",
        "ctypes.",
        "os.fork()",
        "socket.socket",
        "urllib.request",
        "http.client",
        "requests.get",
        "requests.post",
        "__subclasses__",
        "os.kill",
        "os.remove",
        "os.rmdir",
    ]

    FORBIDDEN_JS_TOKENS = [
        "child_process",
        "require('child_process')",
        'require("child_process")',
        "require('fs')",
        'require("fs")',
        "require('net')",
        'require("net")',
        "require('http')",
        'require("http")',
        "process.kill",
        "process.exit",
    ]

    @staticmethod
    def set_sandbox_limits(max_cpu_seconds: int = 5, max_memory_mb: int = 256):
        """Sets POSIX resource limits on the spawned child process."""
        if resource is None:
            return

        try:
            # CPU time limit in seconds
            resource.setrlimit(resource.RLIMIT_CPU, (max_cpu_seconds, max_cpu_seconds + 1))
        except (ValueError, OSError):
            pass

        try:
            # Output file creation size limit (2MB)
            max_file_bytes = 2 * 1024 * 1024
            resource.setrlimit(resource.RLIMIT_FSIZE, (max_file_bytes, max_file_bytes))
        except (ValueError, OSError):
            pass

        try:
            # Maximum address space / memory limit
            max_mem_bytes = max_memory_mb * 1024 * 1024
            if hasattr(resource, "RLIMIT_AS"):
                resource.setrlimit(resource.RLIMIT_AS, (max_mem_bytes, max_mem_bytes))
            elif hasattr(resource, "RLIMIT_RSS"):
                resource.setrlimit(resource.RLIMIT_RSS, (max_mem_bytes, max_mem_bytes))
        except (ValueError, OSError):
            pass

        try:
            # Maximum number of child processes/threads (mitigate fork bombs)
            if hasattr(resource, "RLIMIT_NPROC"):
                resource.setrlimit(resource.RLIMIT_NPROC, (32, 32))
        except (ValueError, OSError):
            pass

    @classmethod
    def get_safe_environment(cls, temp_dir: str) -> Dict[str, str]:
        """Returns a sanitized environment stripped of sensitive host environment variables."""
        safe_paths = [
            "/usr/local/bin",
            "/usr/bin",
            "/bin",
            "/opt/homebrew/bin",
        ]
        # Include current Python/Node paths if discovered
        for bin_name in ["python3", "node", "clang++"]:
            loc = shutil.which(bin_name)
            if loc:
                dir_path = os.path.dirname(loc)
                if dir_path not in safe_paths:
                    safe_paths.insert(0, dir_path)

        return {
            "PATH": ":".join(safe_paths),
            "LANG": "en_US.UTF-8",
            "LC_ALL": "en_US.UTF-8",
            "HOME": temp_dir,
            "TMPDIR": temp_dir,
            "PYTHONUNBUFFERED": "1",
            "NODE_ENV": "production",
        }

    @classmethod
    def inspect_code_safety(cls, code: str, language: str) -> Optional[str]:
        """Pre-flight check for dangerous system patterns across Python, JS, and TS."""
        lang = language.lower().strip()
        if lang in ["python", "py", "python3"]:
            for token in cls.FORBIDDEN_PYTHON_TOKENS:
                if token in code:
                    return f"Security Restriction: Forbidden operation detected ('{token}')."

        elif lang in ["javascript", "js", "typescript", "ts", "node"]:
            for token in cls.FORBIDDEN_JS_TOKENS:
                if token in code:
                    return f"Security Restriction: Forbidden operation detected ('{token}')."

        # Check for fork bomb patterns across shell / c / python / js
        if "os.fork()" in code or "while(1){fork();}" in code.replace(" ", "") or ":(){ :|:& };:" in code:
            return "Security Restriction: Fork creation is prohibited in the sandbox environment."

        return None

    @classmethod
    def execute(
        cls,
        code: str,
        language: str,
        stdin: str = "",
        timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS,
        memory_limit_mb: int = DEFAULT_MEMORY_MB,
    ) -> ExecutionResult:
        """
        Executes code inside an isolated temporary directory with resource ceilings
        and returns the captured stdout, stderr, execution time, and exit status.
        """
        lang = language.lower().strip()
        timeout = min(max(1, timeout_seconds), cls.MAX_TIMEOUT_SECONDS)

        # Pre-flight security audit
        violation = cls.inspect_code_safety(code, lang)
        if violation:
            return ExecutionResult(
                status="security_violation",
                stdout="",
                stderr=violation,
                execution_time_ms=0,
                exit_code=126,
            )

        with tempfile.TemporaryDirectory(prefix="sandbox_") as temp_dir:
            safe_env = cls.get_safe_environment(temp_dir)
            start_time = time.perf_counter()

            try:
                # 1. Prepare command based on language
                if lang in ["python", "py", "python3"]:
                    source_file = os.path.join(temp_dir, "solution.py")
                    with open(source_file, "w", encoding="utf-8") as f:
                        f.write(code)

                    python_bin = shutil.which("python3") or sys.executable or "python3"
                    cmd = [python_bin, "-u", source_file]

                elif lang in ["javascript", "js", "node"]:
                    source_file = os.path.join(temp_dir, "solution.js")
                    with open(source_file, "w", encoding="utf-8") as f:
                        f.write(code)

                    node_bin = shutil.which("node") or "node"
                    cmd = [node_bin, source_file]

                elif lang in ["typescript", "ts"]:
                    source_file = os.path.join(temp_dir, "solution.ts")
                    with open(source_file, "w", encoding="utf-8") as f:
                        f.write(code)

                    node_bin = shutil.which("node") or "node"
                    # Node 20+ supports --experimental-strip-types
                    cmd = [node_bin, "--experimental-strip-types", source_file]

                elif lang in ["cpp", "c++"]:
                    source_file = os.path.join(temp_dir, "main.cpp")
                    binary_file = os.path.join(temp_dir, "main_bin")
                    with open(source_file, "w", encoding="utf-8") as f:
                        f.write(code)

                    clangpp_bin = shutil.which("clang++") or shutil.which("g++") or "clang++"
                    compile_cmd = [clangpp_bin, "-O2", "-std=c++17", source_file, "-o", binary_file]

                    compile_proc = subprocess.run(
                        compile_cmd,
                        text=True,
                        capture_output=True,
                        timeout=timeout,
                        cwd=temp_dir,
                        env=safe_env,
                    )

                    if compile_proc.returncode != 0:
                        elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                        return ExecutionResult(
                            status="error",
                            stdout="",
                            stderr=f"Compilation Error:\n{compile_proc.stderr}",
                            execution_time_ms=elapsed_ms,
                            exit_code=compile_proc.returncode,
                        )

                    cmd = [binary_file]

                elif lang in ["c"]:
                    source_file = os.path.join(temp_dir, "main.c")
                    binary_file = os.path.join(temp_dir, "main_bin")
                    with open(source_file, "w", encoding="utf-8") as f:
                        f.write(code)

                    clang_bin = shutil.which("clang") or shutil.which("gcc") or "clang"
                    compile_cmd = [clang_bin, "-O2", source_file, "-o", binary_file]

                    compile_proc = subprocess.run(
                        compile_cmd,
                        text=True,
                        capture_output=True,
                        timeout=timeout,
                        cwd=temp_dir,
                        env=safe_env,
                    )

                    if compile_proc.returncode != 0:
                        elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                        return ExecutionResult(
                            status="error",
                            stdout="",
                            stderr=f"Compilation Error:\n{compile_proc.stderr}",
                            execution_time_ms=elapsed_ms,
                            exit_code=compile_proc.returncode,
                        )

                    cmd = [binary_file]

                elif lang in ["java"]:
                    source_file = os.path.join(temp_dir, "Main.java")
                    with open(source_file, "w", encoding="utf-8") as f:
                        f.write(code)

                    javac_bin = shutil.which("javac") or "javac"
                    compile_proc = subprocess.run(
                        [javac_bin, source_file],
                        text=True,
                        capture_output=True,
                        timeout=timeout,
                        cwd=temp_dir,
                        env=safe_env,
                    )

                    if compile_proc.returncode != 0:
                        elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                        return ExecutionResult(
                            status="error",
                            stdout="",
                            stderr=f"Compilation Error:\n{compile_proc.stderr}",
                            execution_time_ms=elapsed_ms,
                            exit_code=compile_proc.returncode,
                        )

                    java_bin = shutil.which("java") or "java"
                    cmd = [java_bin, "-cp", temp_dir, "Main"]

                else:
                    return ExecutionResult(
                        status="error",
                        stdout="",
                        stderr=f"Language '{language}' is not supported in the sandbox. Supported: python, javascript, typescript, cpp, c, java",
                        execution_time_ms=0,
                        exit_code=1,
                    )

                # 2. Spawn isolated process with process group and resource limits
                def preexec():
                    os.setsid()  # Create distinct process group
                    cls.set_sandbox_limits(max_cpu_seconds=timeout, max_memory_mb=memory_limit_mb)

                proc = subprocess.Popen(
                    cmd,
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    cwd=temp_dir,
                    env=safe_env,
                    preexec_fn=preexec if hasattr(os, "setsid") else None,
                )

                try:
                    stdout, stderr = proc.communicate(input=stdin, timeout=timeout)
                except subprocess.TimeoutExpired:
                    # Terminate entire process group cleanly
                    try:
                        if hasattr(os, "killpg") and hasattr(os, "getpgid"):
                            os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
                        else:
                            proc.kill()
                    except Exception:
                        pass
                    proc.wait()
                    elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                    return ExecutionResult(
                        status="timeout",
                        stdout="",
                        stderr=f"Process exceeded execution limit of {timeout}s (Terminated).",
                        execution_time_ms=elapsed_ms,
                        exit_code=124,
                    )

                # Truncate excessive output
                if len(stdout) > cls.MAX_OUTPUT_BYTES:
                    stdout = stdout[: cls.MAX_OUTPUT_BYTES] + "\n[Output Truncated: Exceeded Max Size]"
                if len(stderr) > cls.MAX_OUTPUT_BYTES:
                    stderr = stderr[: cls.MAX_OUTPUT_BYTES] + "\n[Error Output Truncated]"

                elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                return ExecutionResult(
                    status="success" if proc.returncode == 0 else "error",
                    stdout=stdout,
                    stderr=stderr,
                    execution_time_ms=elapsed_ms,
                    exit_code=proc.returncode,
                )

            except Exception as ex:
                elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                return ExecutionResult(
                    status="error",
                    stdout="",
                    stderr=f"Sandbox Execution Exception: {str(ex)}",
                    execution_time_ms=elapsed_ms,
                    exit_code=1,
                )

    @classmethod
    def execute_test_suite(
        cls,
        code: str,
        language: str,
        test_cases: List[Dict[str, str]],
        timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS,
    ) -> TestRunResult:
        """
        Executes code against a collection of test inputs and compares outputs.
        """
        results: List[TestCaseResult] = []
        all_passed = True
        total_runtime = 0

        for idx, tc in enumerate(test_cases, start=1):
            input_data = tc.get("input", "")
            expected = tc.get("expected_output", "").strip()

            exec_res = cls.execute(
                code=code,
                language=language,
                stdin=input_data,
                timeout_seconds=timeout_seconds,
            )

            actual = exec_res.stdout.strip()
            total_runtime += exec_res.execution_time_ms

            if exec_res.status == "success" and actual == expected:
                passed = True
                error_msg = None
            else:
                passed = False
                all_passed = False
                error_msg = exec_res.stderr if exec_res.stderr else (
                    f"Output mismatch: expected '{expected}', received '{actual}'"
                    if exec_res.status == "success" else f"Execution failed ({exec_res.status})"
                )

            results.append(
                TestCaseResult(
                    test_case=idx,
                    passed=passed,
                    input=input_data,
                    expected_output=expected,
                    actual_output=actual,
                    runtime_ms=exec_res.execution_time_ms,
                    error=error_msg,
                )
            )

        passed_count = sum(1 for r in results if r.passed)
        return TestRunResult(
            all_passed=all_passed,
            passed_count=passed_count,
            total_count=len(test_cases),
            total_runtime_ms=total_runtime,
            results=results,
        )

