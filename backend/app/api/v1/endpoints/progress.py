import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.progress import UserProgress
from app.schemas.progress import (
    ProgressToggleRequest,
    ProgressSyncRequest,
    ProgressSummaryResponse,
    ProgressStats,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/progress", tags=["Progress Tracking"])
bearer_scheme = HTTPBearer(auto_error=False)


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Extract authenticated user if Bearer token is provided, or return None for guests.
    """
    if not credentials or not credentials.credentials:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
        if not payload:
            return None
        user_id = payload.get("sub")
        if not user_id:
            return None
        return db.query(User).filter(User.id == user_id, User.is_active == True).first()
    except Exception as e:
        logger.debug(f"Optional token validation skipped: {e}")
        return None


def calculate_progress_summary(db: Session, user_id: Optional[str], guest_id: str) -> ProgressSummaryResponse:
    """
    Compute progress arrays and aggregated summary metrics.
    """
    query = db.query(UserProgress).filter(UserProgress.completed == True)
    if user_id:
        query = query.filter(UserProgress.user_id == user_id)
    else:
        query = query.filter(
            (UserProgress.guest_id == guest_id) | (UserProgress.guest_id == "guest_default")
        )

    records: List[UserProgress] = query.order_by(UserProgress.updated_at.desc()).all()

    # Deduplicate in case guest session migrated
    seen = set()
    unique_records: List[UserProgress] = []
    for r in records:
        key = (r.category, r.topic_id)
        if key not in seen:
            seen.add(key)
            unique_records.append(r)

    dsa_ids: List[str] = []
    aiml_ids: List[str] = []
    sd_ids: List[str] = []
    core_cs_os_ids: List[str] = []
    core_cs_cn_ids: List[str] = []
    core_cs_dbms_ids: List[str] = []
    core_cs_arch_ids: List[str] = []
    core_cs_oop_ids: List[str] = []

    dsa_easy = 0
    dsa_medium = 0
    dsa_hard = 0

    for r in unique_records:
        if r.category == "dsa":
            dsa_ids.append(r.topic_id)
            if r.difficulty == "Easy":
                dsa_easy += 1
            elif r.difficulty == "Medium":
                dsa_medium += 1
            elif r.difficulty == "Hard":
                dsa_hard += 1
            else:
                dsa_easy += 1
        elif r.category == "aiml":
            aiml_ids.append(r.topic_id)
        elif r.category == "system_design":
            sd_ids.append(r.topic_id)
        elif r.category in ("core_cs_os", "cs_os", "os"):
            core_cs_os_ids.append(r.topic_id)
        elif r.category in ("core_cs_cn", "cs_cn", "cn", "computer_networks"):
            core_cs_cn_ids.append(r.topic_id)
        elif r.category in ("core_cs_dbms", "cs_dbms", "dbms"):
            core_cs_dbms_ids.append(r.topic_id)
        elif r.category in ("core_cs_arch", "cs_arch", "arch", "modern_computer_architecture"):
            core_cs_arch_ids.append(r.topic_id)
        elif r.category in ("core_cs_oop", "cs_oop", "oop", "oops"):
            core_cs_oop_ids.append(r.topic_id)

    total_core_cs = (
        len(core_cs_os_ids)
        + len(core_cs_cn_ids)
        + len(core_cs_dbms_ids)
        + len(core_cs_arch_ids)
        + len(core_cs_oop_ids)
    )

    total_completed = len(unique_records)
    # Scaled readiness score: baseline 70 + up to 28 additional points based on solved count
    computed_readiness = min(98, 70 + int(total_completed * 0.8))

    # Update user record if logged in
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user and user.readiness_score != computed_readiness:
            user.readiness_score = computed_readiness
            db.commit()

    return ProgressSummaryResponse(
        dsa=dsa_ids,
        aiml=aiml_ids,
        system_design=sd_ids,
        core_cs_os=core_cs_os_ids,
        core_cs_cn=core_cs_cn_ids,
        core_cs_dbms=core_cs_dbms_ids,
        core_cs_arch=core_cs_arch_ids,
        core_cs_oop=core_cs_oop_ids,
        stats=ProgressStats(
            total_completed=total_completed,
            dsa_total=len(dsa_ids),
            dsa_easy=dsa_easy,
            dsa_medium=dsa_medium,
            dsa_hard=dsa_hard,
            aiml_total=len(aiml_ids),
            system_design_total=len(sd_ids),
            core_cs_total=total_core_cs,
            core_cs_os_total=len(core_cs_os_ids),
            core_cs_cn_total=len(core_cs_cn_ids),
            core_cs_dbms_total=len(core_cs_dbms_ids),
            core_cs_arch_total=len(core_cs_arch_ids),
            core_cs_oop_total=len(core_cs_oop_ids),
            readiness_score=computed_readiness,
        ),
    )


@router.get("", response_model=ProgressSummaryResponse, summary="Get full topic & question progress")
def get_user_progress(
    guest_id: str = Query("guest_default", description="Guest identifier for unauthenticated candidates"),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve all solved DSA questions and completed AI/ML and System Design topics
    along with aggregated progress metrics.
    """
    user_id = current_user.id if current_user else None
    return calculate_progress_summary(db, user_id=user_id, guest_id=guest_id)


@router.post("/toggle", summary="Toggle completion status of any topic or question")
def toggle_progress_item(
    req: ProgressToggleRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Mark or unmark a question (DSA) or topic (AI/ML, System Design) as completed.
    Persists atomically to PostgreSQL database and recalculates metrics.
    """
    user_id = current_user.id if current_user else None
    guest_id = req.guest_id or "guest_default"
    now = datetime.now(timezone.utc)

    # Search for existing record
    query = db.query(UserProgress).filter(
        UserProgress.category == req.category,
        UserProgress.topic_id == req.item_id,
    )
    if user_id:
        existing = query.filter(UserProgress.user_id == user_id).first()
    else:
        existing = query.filter(
            (UserProgress.guest_id == guest_id) | (UserProgress.guest_id == "guest_default")
        ).first()

    if existing:
        existing.completed = req.completed
        existing.updated_at = now
        if req.title:
            existing.title = req.title
        if req.difficulty:
            existing.difficulty = req.difficulty
        if req.completed:
            existing.completed_at = now
    else:
        new_record = UserProgress(
            id=str(uuid.uuid4()),
            user_id=user_id,
            guest_id=guest_id if not user_id else None,
            category=req.category,
            topic_id=req.item_id,
            title=req.title or f"{req.category} milestone {req.item_id}",
            difficulty=req.difficulty,
            completed=req.completed,
            completed_at=now if req.completed else None,
            updated_at=now,
        )
        db.add(new_record)

    db.commit()

    summary = calculate_progress_summary(db, user_id=user_id, guest_id=guest_id)
    return {
        "success": True,
        "category": req.category,
        "item_id": req.item_id,
        "completed": req.completed,
        "summary": summary,
    }


@router.post("/sync", summary="Batch synchronize progress from local storage")
def sync_local_progress(
    req: ProgressSyncRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Bulk synchronize completed topics and problems from browser localStorage
    into PostgreSQL database.
    """
    user_id = current_user.id if current_user else None
    guest_id = req.guest_id or "guest_default"
    now = datetime.now(timezone.utc)

    items_to_sync = []
    for dsa_id in (req.dsa_solved_ids or []):
        items_to_sync.append(("dsa", str(dsa_id), f"Problem {dsa_id}"))
    for aiml_id in (req.aiml_completed_ids or []):
        items_to_sync.append(("aiml", str(aiml_id), f"AI/ML Topic {aiml_id}"))
    for sd_id in (req.system_design_completed_ids or []):
        items_to_sync.append(("system_design", str(sd_id), f"System Design Topic {sd_id}"))
    for os_id in (req.core_cs_os_completed_ids or []):
        items_to_sync.append(("core_cs_os", str(os_id), f"OS Topic {os_id}"))
    for cn_id in (req.core_cs_cn_completed_ids or []):
        items_to_sync.append(("core_cs_cn", str(cn_id), f"Networks Topic {cn_id}"))
    for dbms_id in (req.core_cs_dbms_completed_ids or []):
        items_to_sync.append(("core_cs_dbms", str(dbms_id), f"DBMS Topic {dbms_id}"))
    for arch_id in (req.core_cs_arch_completed_ids or []):
        items_to_sync.append(("core_cs_arch", str(arch_id), f"Architecture Topic {arch_id}"))
    for oop_id in (req.core_cs_oop_completed_ids or []):
        items_to_sync.append(("core_cs_oop", str(oop_id), f"OOP Topic {oop_id}"))

    for category, topic_id, fallback_title in items_to_sync:
        query = db.query(UserProgress).filter(
            UserProgress.category == category,
            UserProgress.topic_id == topic_id,
        )
        if user_id:
            existing = query.filter(UserProgress.user_id == user_id).first()
        else:
            existing = query.filter(UserProgress.guest_id == guest_id).first()

        if existing:
            if not existing.completed:
                existing.completed = True
                existing.updated_at = now
        else:
            new_record = UserProgress(
                id=str(uuid.uuid4()),
                user_id=user_id,
                guest_id=guest_id if not user_id else None,
                category=category,
                topic_id=topic_id,
                title=fallback_title,
                completed=True,
                completed_at=now,
                updated_at=now,
            )
            db.add(new_record)

    db.commit()
    summary = calculate_progress_summary(db, user_id=user_id, guest_id=guest_id)
    return {
        "success": True,
        "synced_count": len(items_to_sync),
        "summary": summary,
    }
