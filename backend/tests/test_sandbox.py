import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.sandbox import IsolatedSandbox

client = TestClient(app)


def test_sandbox_python_success():
    code = "print('Hello from Isolated Sandbox')"
    res = IsolatedSandbox.execute(code=code, language="python")
    assert res.status == "success"
    assert "Hello from Isolated Sandbox" in res.stdout
    assert res.exit_code == 0
    assert res.execution_time_ms >= 0


def test_sandbox_python_math_and_syntax():
    code = "vals = [x * 2 for x in range(5)]\nprint(sum(vals))"
    res = IsolatedSandbox.execute(code=code, language="python")
    assert res.status == "success"
    assert res.stdout.strip() == "20"


def test_sandbox_timeout_interruption():
    code = "import time\nwhile True:\n    time.sleep(0.05)"
    res = IsolatedSandbox.execute(code=code, language="python", timeout_seconds=1)
    assert res.status == "timeout"
    assert res.exit_code == 124
    assert "exceeded" in res.stderr.lower()


def test_sandbox_security_forbidden_token():
    code = "import os\nos.fork()"
    res = IsolatedSandbox.execute(code=code, language="python")
    assert res.status == "security_violation"
    assert res.exit_code == 126
    assert "Security Restriction" in res.stderr


def test_sandbox_test_suite_evaluation():
    code = """
import sys
line = sys.stdin.read().strip()
if line:
    print(int(line) * 2)
"""
    test_cases = [
        {"input": "5", "expected_output": "10"},
        {"input": "12", "expected_output": "24"},
        {"input": "-3", "expected_output": "-6"},
    ]
    suite_res = IsolatedSandbox.execute_test_suite(code=code, language="python", test_cases=test_cases)
    assert suite_res.all_passed is True
    assert suite_res.passed_count == 3
    assert suite_res.total_count == 3
    assert len(suite_res.results) == 3


def test_api_compile_run_endpoint():
    response = client.post(
        "/api/v1/compile/run",
        json={
            "language": "python",
            "code": "print('FastAPI Sandbox Endpoint')",
            "stdin": "",
            "timeout_seconds": 4,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "FastAPI Sandbox Endpoint" in data["stdout"]
    assert data["exit_code"] == 0


def test_api_compile_test_suite_endpoint():
    response = client.post(
        "/api/v1/compile/test",
        json={
            "language": "python",
            "code": "import sys\nprint('ans:' + sys.stdin.read().strip())",
            "test_cases": [
                {"input": "alpha", "expected_output": "ans:alpha"},
                {"input": "beta", "expected_output": "ans:beta"},
            ],
            "timeout_seconds": 3,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["all_passed"] is True
    assert data["passed_count"] == 2
    assert data["total_count"] == 2


def test_sandbox_security_network_socket_blocked():
    code = "import socket\ns = socket.socket()"
    res = IsolatedSandbox.execute(code=code, language="python")
    assert res.status == "security_violation"
    assert res.exit_code == 126
    assert "Security Restriction" in res.stderr


def test_sandbox_security_js_child_process_blocked():
    code = "const { exec } = require('child_process');"
    res = IsolatedSandbox.execute(code=code, language="javascript")
    assert res.status == "security_violation"
    assert res.exit_code == 126
    assert "Security Restriction" in res.stderr

