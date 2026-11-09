import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.services.sandbox import IsolatedSandbox

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/compile", tags=["Compiler"])


class RunCodeRequest(BaseModel):
    language: str = Field(..., description="Programming language: python, javascript, typescript, cpp, c, java")
    code: str = Field(..., description="Source code to execute")
    stdin: Optional[str] = Field(default="", description="Standard input for the execution")
    timeout_seconds: Optional[int] = Field(default=5, description="Timeout ceiling in seconds")
    memory_limit_mb: Optional[int] = Field(default=256, description="Memory ceiling in megabytes")


class RunCodeResponse(BaseModel):
    status: str = Field(..., description="Status: success, error, timeout, security_violation")
    stdout: str = Field(default="", description="Standard output")
    stderr: str = Field(default="", description="Standard error")
    execution_time_ms: int = Field(default=0, description="Execution time in milliseconds")
    exit_code: int = Field(default=0, description="Process exit code")


class TestCaseItem(BaseModel):
    input: str = Field(default="", description="Input fed into stdin")
    expected_output: str = Field(default="", description="Expected stdout")


class RunTestSuiteRequest(BaseModel):
    language: str = Field(..., description="Programming language")
    code: str = Field(..., description="Candidate code implementation")
    test_cases: List[TestCaseItem] = Field(..., description="List of test cases to verify")
    timeout_seconds: Optional[int] = Field(default=5, description="Timeout ceiling per test case")


class TestCaseResultItem(BaseModel):
    test_case: int
    passed: bool
    input: str
    expected_output: str
    actual_output: str
    runtime_ms: int
    error: Optional[str] = None


class RunTestSuiteResponse(BaseModel):
    all_passed: bool
    passed_count: int
    total_count: int
    total_runtime_ms: int
    results: List[TestCaseResultItem]


@router.post("/run", response_model=RunCodeResponse)
def run_code(payload: RunCodeRequest):
    """
    Executes source code in an isolated sandboxed environment with strict resource limits,
    environment scrubbing, process group termination, and output ceilings.
    """
    result = IsolatedSandbox.execute(
        code=payload.code,
        language=payload.language,
        stdin=payload.stdin or "",
        timeout_seconds=payload.timeout_seconds or 5,
        memory_limit_mb=payload.memory_limit_mb or 256,
    )

    return RunCodeResponse(
        status=result.status,
        stdout=result.stdout,
        stderr=result.stderr,
        execution_time_ms=result.execution_time_ms,
        exit_code=result.exit_code,
    )


@router.post("/test", response_model=RunTestSuiteResponse)
def run_test_suite(payload: RunTestSuiteRequest):
    """
    Executes candidate code against an automated test suite, measuring per-test-case
    correctness, runtime in ms, and diffs.
    """
    cases = [{"input": tc.input, "expected_output": tc.expected_output} for tc in payload.test_cases]
    test_run = IsolatedSandbox.execute_test_suite(
        code=payload.code,
        language=payload.language,
        test_cases=cases,
        timeout_seconds=payload.timeout_seconds or 5,
    )

    return RunTestSuiteResponse(
        all_passed=test_run.all_passed,
        passed_count=test_run.passed_count,
        total_count=test_run.total_count,
        total_runtime_ms=test_run.total_runtime_ms,
        results=[
            TestCaseResultItem(
                test_case=r.test_case,
                passed=r.passed,
                input=r.input,
                expected_output=r.expected_output,
                actual_output=r.actual_output,
                runtime_ms=r.runtime_ms,
                error=r.error,
            )
            for r in test_run.results
        ],
    )
