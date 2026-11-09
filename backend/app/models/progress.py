import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Index
from app.core.database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(
        String,
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
    )
    user_id = Column(String, nullable=True, index=True)
    guest_id = Column(String(100), default="guest_default", nullable=True, index=True)
    category = Column(String(50), nullable=False, index=True)  # "dsa", "aiml", "system_design"
    topic_id = Column(String(100), nullable=False, index=True)  # e.g. "1", "ml_1", "sd_fund_1"
    title = Column(String(255), nullable=True)
    difficulty = Column(String(50), nullable=True)  # "Easy", "Medium", "Hard"
    completed = Column(Boolean, default=True, nullable=False)
    completed_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=True,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=True,
    )

    __table_args__ = (
        Index("user_progress_user_id_category_idx", "user_id", "category"),
        Index("user_progress_guest_id_category_idx", "guest_id", "category"),
        Index("user_progress_category_topic_id_idx", "category", "topic_id"),
    )

    def __repr__(self) -> str:
        return f"<UserProgress(id={self.id}, user_id={self.user_id}, category={self.category}, topic_id={self.topic_id}, completed={self.completed})>"
