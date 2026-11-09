import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

interface TestCaseItem {
  input: string;
  expected_output: string;
}

interface TestPayload {
  language: string;
  code: string;
  test_cases: TestCaseItem[];
  timeoutSeconds?: number;
}

export async function POST(req: Request) {
  try {
    const body: TestPayload = await req.json();
    const { language = "python", code = "", test_cases = [], timeoutSeconds = 5 } = body;

    // 1. Try FastAPI backend sandbox test endpoint first
    try {
      const backendController = new AbortController();
      const backendTimeout = setTimeout(
        () => backendController.abort(),
        (timeoutSeconds * test_cases.length + 3) * 1000
      );

      const backendRes = await fetch(`${BACKEND_URL}/api/v1/compile/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          test_cases,
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
      // Backend not running: proceed with local runner
    }

    // 2. Local runner: invoke /api/sandbox/run for each test case
    const results = [];
    let allPassed = true;
    let totalRuntime = 0;

    // Use internal URL or loopback
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    for (let i = 0; i < test_cases.length; i++) {
      const tc = test_cases[i];
      const runRes = await fetch(`${baseUrl}/api/sandbox/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          stdin: tc.input,
          timeoutSeconds,
        }),
      });

      if (!runRes.ok) {
        allPassed = false;
        results.push({
          test_case: i + 1,
          passed: false,
          input: tc.input,
          expected_output: tc.expected_output,
          actual_output: "",
          runtime_ms: 0,
          error: "Sandbox execution failure",
        });
        continue;
      }

      const execData = await runRes.json();
      totalRuntime += execData.execution_time_ms || 0;

      const actualTrimmed = (execData.stdout || "").trim();
      const expectedTrimmed = (tc.expected_output || "").trim();

      const passed =
        execData.status === "success" &&
        (actualTrimmed === expectedTrimmed || actualTrimmed.endsWith(expectedTrimmed));

      if (!passed) {
        allPassed = false;
      }

      results.push({
        test_case: i + 1,
        passed,
        input: tc.input,
        expected_output: tc.expected_output,
        actual_output: actualTrimmed,
        runtime_ms: execData.execution_time_ms || 0,
        error: execData.stderr || (passed ? null : `Expected: '${expectedTrimmed}', Got: '${actualTrimmed}'`),
      });
    }

    const passedCount = results.filter((r) => r.passed).length;

    return NextResponse.json({
      all_passed: allPassed,
      passed_count: passedCount,
      total_count: test_cases.length,
      total_runtime_ms: totalRuntime,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        all_passed: false,
        passed_count: 0,
        total_count: 0,
        total_runtime_ms: 0,
        results: [],
        error: `Test Runner Exception: ${err.message || String(err)}`,
      },
      { status: 500 }
    );
  }
}

