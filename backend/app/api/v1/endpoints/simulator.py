import json
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.interview import SimulatorSubmission
from app.schemas.simulator import SimulatorSubmissionCreate, SimulatorSubmissionResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/simulator", tags=["Role Hiring Simulator"])


@router.post("/submit", response_model=SimulatorSubmissionResponse)
def submit_simulator_assessment(
    req: SimulatorSubmissionCreate,
    db: Session = Depends(get_db),
):
    """
    Persist a completed role-based hiring simulator assessment or interview session.
    """
    try:
        sections_str = json.dumps(req.sections) if isinstance(req.sections, dict) else "{}"
        submission = SimulatorSubmission(
            guest_id=req.guest_id or "guest_default",
            role_id=req.role_id,
            role_title=req.role_title,
            score=req.score,
            total_marks=req.total_marks,
            verdict=req.verdict,
            sections_json=sections_str,
            time_spent_seconds=req.time_spent_seconds,
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)

        return SimulatorSubmissionResponse(
            id=submission.id,
            role_id=submission.role_id,
            role_title=submission.role_title,
            score=submission.score,
            total_marks=submission.total_marks,
            verdict=submission.verdict,
            sections=req.sections,
            time_spent_seconds=submission.time_spent_seconds,
            created_at=submission.created_at.isoformat() if submission.created_at else "",
        )
    except Exception as exc:
        logger.error(f"Failed to record simulator submission: {exc}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to record simulator assessment submission.",
        )


@router.get("/history", response_model=List[SimulatorSubmissionResponse])
def get_simulator_history(
    guest_id: str = Query("guest_default", description="Guest tracking ID"),
    role_id: Optional[str] = Query(None, description="Optional role filter"),
    db: Session = Depends(get_db),
):
    """
    Retrieve historical simulator assessment attempts for a candidate.
    """
    query = db.query(SimulatorSubmission).filter(SimulatorSubmission.guest_id == guest_id)
    if role_id:
        query = query.filter(SimulatorSubmission.role_id == role_id)

    submissions = query.order_by(SimulatorSubmission.created_at.desc()).limit(20).all()

    results = []
    for sub in submissions:
        try:
            sections_dict = json.loads(sub.sections_json) if sub.sections_json else {}
        except Exception:
            sections_dict = {}

        results.append(
            SimulatorSubmissionResponse(
                id=sub.id,
                role_id=sub.role_id,
                role_title=sub.role_title,
                score=sub.score,
                total_marks=sub.total_marks,
                verdict=sub.verdict,
                sections=sections_dict,
                time_spent_seconds=sub.time_spent_seconds,
                created_at=sub.created_at.isoformat() if sub.created_at else "",
            )
        )
    return results

