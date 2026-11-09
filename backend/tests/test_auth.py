import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db

# Create an isolated test SQLite in-memory engine to run automated tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_signup_successful():
    response = client.post(
        "/api/auth/signup",
        json={
            "name": "Elena Rostova",
            "email": "elena.rostova@techmail.io",
            "password": "MasterAI#2026",
            "target_role": "backend",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "elena.rostova@techmail.io"
    assert data["user"]["name"] == "Elena Rostova"
    assert data["user"]["target_role"] == "backend"


def test_signup_duplicate_email():
    payload = {
        "name": "Elena Rostova",
        "email": "duplicate@techmail.io",
        "password": "MasterAI#2026",
        "target_role": "fullstack",
    }
    res1 = client.post("/api/auth/signup", json=payload)
    assert res1.status_code == 201

    # Attempt duplicate signup
    res2 = client.post("/api/auth/signup", json=payload)
    assert res2.status_code == 409
    assert "already exists" in res2.json()["detail"]


def test_login_successful_and_me_endpoint():
    # 1. Sign up
    client.post(
        "/api/auth/signup",
        json={
            "name": "Alex Mercer",
            "email": "alex.mercer@interviewai.dev",
            "password": "DemoPass#2026",
            "target_role": "fullstack",
        },
    )

    # 2. Log in
    login_res = client.post(
        "/api/auth/login",
        json={
            "email": "alex.mercer@interviewai.dev",
            "password": "DemoPass#2026",
        },
    )
    assert login_res.status_code == 200
    login_data = login_res.json()
    token = login_data["access_token"]
    assert token is not None

    # 3. Access /api/auth/me with Bearer token
    me_res = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "alex.mercer@interviewai.dev"
    assert me_data["name"] == "Alex Mercer"


def test_login_invalid_password():
    client.post(
        "/api/auth/signup",
        json={
            "name": "Alex Mercer",
            "email": "alex@interviewai.dev",
            "password": "CorrectPassword123",
        },
    )

    login_res = client.post(
        "/api/auth/login",
        json={
            "email": "alex@interviewai.dev",
            "password": "WrongPassword123",
        },
    )
    assert login_res.status_code == 401
    assert "Invalid email or password" in login_res.json()["detail"]
