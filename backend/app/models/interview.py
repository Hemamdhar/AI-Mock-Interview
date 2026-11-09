import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, Index
from app.core.database import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(
        String,
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )
    user_id = Column(String, nullable=True, index=True)
    guest_id = Column(String(100), default="guest_default", nullable=True, index=True)
    title = Column(String(255), nullable=False)
    role = Column(String(100), default="Software Engineer", nullable=False)
    company = Column(String(100), default="Technology Company", nullable=False)
    experience_level = Column(String(50), default="Mid-Level", nullable=False)
    status = Column(String(50), default="active", nullable=False)  # active, completed, aborted

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        Index("interview_sessions_user_id_idx", "user_id"),
        Index("interview_sessions_guest_id_idx", "guest_id"),
    )

    def __repr__(self) -> str:
        return f"<InterviewSession(id={self.id}, title={self.title}, status={self.status})>"


class InterviewTranscript(Base):
    __tablename__ = "interview_transcripts"

    id = Column(
        String,
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )
    session_id = Column(String, nullable=False, index=True)
    round_number = Column(Integer, default=1, nullable=False)
    speaker = Column(String(50), nullable=False)  # interviewer, candidate
    text = Column(Text, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        Index("interview_transcripts_session_id_idx", "session_id"),
    )

    def __repr__(self) -> str:
        return f"<InterviewTranscript(id={self.id}, session_id={self.session_id}, speaker={self.speaker})>"


class InterviewReport(Base):
    __tablename__ = "interview_reports"

    id = Column(
        String,
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )
    session_id = Column(String, unique=True, nullable=False, index=True)
    overall_score = Column(Integer, default=75, nullable=False)
    verdict = Column(String(100), default="Strong Hire", nullable=False)
    executive_summary = Column(Text, nullable=False)
    competencies_json = Column(Text, nullable=False)  # JSON serialized competency breakdown

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<InterviewReport(id={self.id}, session_id={self.session_id}, score={self.overall_score})>"


class SimulatorSubmission(Base):
    __tablename__ = "simulator_submissions"

    id = Column(
        String,
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )
    user_id = Column(String, nullable=True, index=True)
    guest_id = Column(String(100), default="guest_default", nullable=True, index=True)
    role_id = Column(String(100), nullable=False, index=True)
    role_title = Column(String(255), nullable=False)
    score = Column(Integer, default=0, nullable=False)
    total_marks = Column(Integer, default=100, nullable=False)
    verdict = Column(String(50), default="Hire", nullable=False)
    sections_json = Column(Text, default="{}", nullable=False)
    time_spent_seconds = Column(Integer, default=0, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        Index("simulator_submissions_guest_id_idx", "guest_id"),
        Index("simulator_submissions_role_id_idx", "role_id"),
    )

    def __repr__(self) -> str:
        return f"<SimulatorSubmission(id={self.id}, role={self.role_title}, score={self.score})>"

