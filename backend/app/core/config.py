import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    PROJECT_NAME: str = "AI Mock Interview API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # PostgreSQL Database URL
    @property
    def database_url(self) -> str:
        raw_url = os.getenv(
            "DATABASE_URL",
            "postgresql+psycopg2://postgres:postgres@localhost:5432/ai_mock_interview_db",
        )
        # If postgresql:// is provided without driver, convert to postgresql+psycopg2://
        if raw_url.startswith("postgresql://"):
            return raw_url.replace("postgresql://", "postgresql+psycopg2://", 1)
        return raw_url

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # JWT Authentication
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "interview_ai_dev_secret_key_change_in_production",
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )

    # CORS Origins
    @property
    def cors_origins(self) -> List[str]:
        origins_str = os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000",
        )
        return [origin.strip() for origin in origins_str.split(",") if origin.strip()]

    # Groq AI Key (loaded strictly from environment, no hardcoded fallbacks in source)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    def validate_production_security(self):
        """Enforces NIST/OWASP production cryptographic and secrets controls."""
        if self.ENVIRONMENT.lower() == "production":
            if "change_in_production" in self.JWT_SECRET_KEY or len(self.JWT_SECRET_KEY) < 32:
                raise ValueError(
                    "Production Security Violation: Insecure JWT_SECRET_KEY detected. "
                    "A cryptographically strong secret of at least 32 characters must be provided."
                )
            if not self.GROQ_API_KEY:
                raise ValueError(
                    "Production Security Violation: Missing GROQ_API_KEY in environment."
                )


settings = Settings()
settings.validate_production_security()
