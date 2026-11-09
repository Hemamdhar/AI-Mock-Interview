import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import Base, get_db
from app.models.interview import SimulatorSubmission


def test_simulator_submit_and_history(client=None):
    from tests.test_auth import client, TestingSessionLocal, engine, Base

    Base.metadata.create_all(bind=engine)

    payload = {
        "role_id": "ai-engineer",
        "role_title": "AI Engineer",
        "score": 86,
        "total_marks": 100,
        "verdict": "Strong Hire",
        "sections": {
            "aptitude": {"score": 14, "total": 15},
            "domain_mcq": {"score": 26, "total": 30},
            "coding": {"passed": 2, "total": 2},
        },
        "time_spent_seconds": 1840,
        "guest_id": "test_guest_123",
    }

    res = client.post("/api/simulator/submit", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["role_id"] == "ai-engineer"
    assert data["score"] == 86
    assert data["verdict"] == "Strong Hire"

    history_res = client.get("/api/simulator/history?guest_id=test_guest_123")
    assert history_res.status_code == 200
    history_data = history_res.json()
    assert len(history_data) == 1
    assert history_data[0]["role_id"] == "ai-engineer"
