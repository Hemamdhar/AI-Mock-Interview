import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger(__name__)

# SQLAlchemy Base declarative class
Base = declarative_base()


def create_resilient_engine():
    """
    Attempts to connect to PostgreSQL from settings.database_url.
    If PostgreSQL is unreachable or connection fails, falls back gracefully to SQLite.
    """
    db_url = settings.database_url
    try:
        if "postgresql" in db_url:
            test_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_size=5,
                max_overflow=10,
                connect_args={"connect_timeout": 3},
            )
            # Verify actual connectivity
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Successfully connected to PostgreSQL database.")
            return test_engine
    except Exception as exc:
        logger.warning(
            f"PostgreSQL connection failed ({exc}). Falling back to local SQLite database (interview_ai.db)."
        )

    sqlite_url = "sqlite:///./interview_ai.db"
    return create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False},
    )


# Resilient SQLAlchemy Engine (PostgreSQL with SQLite fallback)
engine = create_resilient_engine()

# SessionLocal factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a SQLAlchemy database session per request,
    ensuring proper cleanup/closing afterwards.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """
    Initialize database schema (create tables if they do not exist).
    """
    try:
        # Import models so Base metadata is populated
        import app.models.user  # noqa: F401
        import app.models.progress  # noqa: F401
        import app.models.interview  # noqa: F401

        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        logger.error(f"Could not automatically create tables on database: {e}.")

