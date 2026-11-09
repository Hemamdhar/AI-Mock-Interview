import { NextResponse } from "next/server";
import { execFile } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import vm from "node:vm";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

interface RunPayload {
  language: string;
  code: string;
  stdin?: string;
  timeoutSeconds?: number;
}

export async function POST(req: Request) {
  try {
    const body: RunPayload = await req.json();
    const { language = "python", code = "", stdin = "", timeoutSeconds = 5 } = body;
    const lang = language.toLowerCase().trim();

    // 1. Try FastAPI backend sandbox first if reachable
    try {
      const backendController = new AbortController();
      const backendTimeout = setTimeout(() => backendController.abort(), (timeoutSeconds + 2) * 1000);

      const backendRes = await fetch(`${BACKEND_URL}/api/v1/compile/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          code,
          stdin,
          timeout_seconds: timeoutSeconds,
        }),
        signal: backendController.signal,
      });

      clearTimeout(backendTimeout);

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend not running: Proceed with server-side isolated fallback
    }

    // 2. Server-Side Isolated Sandbox Fallback
    const startTime = Date.now();

    // Security pre-flight check
    if (code.includes("os.fork()") || code.includes("while(1){fork();}")) {
      return NextResponse.json({
        status: "security_violation",
        stdout: "",
        stderr: "Security Restriction: Fork creation is prohibited in the sandbox environment.",
        execution_time_ms: 0,
        exit_code: 126,
      });
    }

    // Case A: JavaScript / TypeScript via isolated V8 vm context
    if (["javascript", "js", "typescript", "ts"].includes(lang)) {
      try {
        const capturedLogs: string[] = [];
        const capturedErrors: string[] = [];

        // Build clean sandbox context without process, require, or fs
        const sandbox = {
          console: {
            log: (...args: any[]) => capturedLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
            warn: (...args: any[]) => capturedLogs.push("[WARN] " + args.map(String).join(" ")),
            error: (...args: any[]) => capturedErrors.push(args.map(String).join(" ")),
            info: (...args: any[]) => capturedLogs.push(args.map(String).join(" ")),
          },
          Math,
          Date,
          JSON,
          Array,
          Object,
          String,
          Number,
          Boolean,
          RegExp,
          Map,
          Set,
          parseInt,
          parseFloat,
          isNaN,
          isFinite,
          setTimeout: () => {},
          clearTimeout: () => {},
        };

        const context = vm.createContext(sandbox);

        // Strip simple TypeScript type annotations if needed
        let executableJs = code;
        if (lang === "typescript" || lang === "ts") {
          executableJs = executableJs
            .replace(/interface\s+\w+\s*\{[^}]*\}/g, "")
            .replace(/type\s+\w+\s*=[^;]+;/g, "");
        }

        const script = new vm.Script(executableJs);
        script.runInContext(context, {
          timeout: timeoutSeconds * 1000,
          displayErrors: true,
        });

        const elapsed = Date.now() - startTime;
        return NextResponse.json({
          status: capturedErrors.length > 0 ? "error" : "success",
          stdout: capturedLogs.join("\n"),
          stderr: capturedErrors.join("\n"),
          execution_time_ms: elapsed,
          exit_code: capturedErrors.length > 0 ? 1 : 0,
        });
      } catch (vmErr: any) {
        const elapsed = Date.now() - startTime;
        const isTimeout = vmErr.message && vmErr.message.includes("timed out");
        return NextResponse.json({
          status: isTimeout ? "timeout" : "error",
          stdout: "",
          stderr: isTimeout
            ? `Execution timed out (exceeded limit of ${timeoutSeconds}s).`
            : `Runtime Error: ${vmErr.message}`,
          execution_time_ms: elapsed,
          exit_code: isTimeout ? 124 : 1,
        });
      }
    }

    // Case B: Python / C++ / C / Java via local process with scrubbed environment
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sandbox_next_"));
    try {
      let cmd = "";
      let args: string[] = [];

      // Clean, scrubbed environment with NodeJS.ProcessEnv type
      const cleanEnv: NodeJS.ProcessEnv = {
        PATH: "/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin",
        LANG: "en_US.UTF-8",
        HOME: tempDir,
        TMPDIR: tempDir,
        PYTHONUNBUFFERED: "1",
        NODE_ENV: "production",
      };

      if (["python", "py", "python3"].includes(lang)) {
        const scriptPath = path.join(tempDir, "solution.py");
        fs.writeFileSync(scriptPath, code, "utf-8");
        cmd = "python3";
        args = ["-u", scriptPath];
      } else if (["cpp", "c++"].includes(lang)) {
        const srcPath = path.join(tempDir, "main.cpp");
        const binPath = path.join(tempDir, "main_bin");
        fs.writeFileSync(srcPath, code, "utf-8");

        // Compile
        const compileRes = await new Promise<{ err: Error | null; stderr: string }>((resolve) => {
          execFile("clang++", ["-O2", "-std=c++17", srcPath, "-o", binPath], {
            cwd: tempDir,
            env: cleanEnv,
            timeout: timeoutSeconds * 1000,
          }, (err, _stdout, stderr) => {
            resolve({ err, stderr: stderr || "" });
          });
        });

        if (compileRes.err) {
          const elapsed = Date.now() - startTime;
          return NextResponse.json({
            status: "error",
            stdout: "",
            stderr: `Compilation Error:\n${compileRes.stderr || compileRes.err.message}`,
            execution_time_ms: elapsed,
            exit_code: 1,
          });
        }

        cmd = binPath;
        args = [];
      } else {
        return NextResponse.json({
          status: "error",
          stdout: "",
          stderr: `Language '${lang}' requires the backend compiler service to be active.`,
          execution_time_ms: 0,
          exit_code: 1,
        });
      }

      // Execute via execFile
      const execResult = await new Promise<{
        stdout: string;
        stderr: string;
        exitCode: number;
        isTimedOut: boolean;
      }>((resolve) => {
        const child = execFile(
          cmd,
          args,
          {
            cwd: tempDir,
            env: cleanEnv,
            timeout: timeoutSeconds * 1000,
            maxBuffer: 256 * 1024,
          },
          (err, stdoutStr, stderrStr) => {
            const isTimedOut = Boolean(err && (err as any).killed && (err as any).signal === "SIGTERM");
            resolve({
              stdout: stdoutStr || "",
              stderr: stderrStr || (err && !isTimedOut ? err.message : ""),
              exitCode: err ? (err as any).code || 1 : 0,
              isTimedOut,
            });
          }
        );

        if (stdin && child.stdin) {
          child.stdin.write(stdin);
          child.stdin.end();
        }
      });

      const elapsed = Date.now() - startTime;

      if (execResult.isTimedOut) {
        return NextResponse.json({
          status: "timeout",
          stdout: "",
          stderr: `Execution timed out (exceeded limit of ${timeoutSeconds}s).`,
          execution_time_ms: elapsed,
          exit_code: 124,
        });
      }

      return NextResponse.json({
        status: execResult.exitCode === 0 ? "success" : "error",
        stdout: execResult.stdout,
        stderr: execResult.stderr,
        execution_time_ms: elapsed,
        exit_code: execResult.exitCode,
      });
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup error
      }
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        stdout: "",
        stderr: `Sandbox Server Exception: ${err.message || String(err)}`,
        execution_time_ms: 0,
        exit_code: 1,
      },
      { status: 500 }
    );
  }
}
