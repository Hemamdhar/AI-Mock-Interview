from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class InterviewCreateRequest(BaseModel):
    title: str = "Full-Stack Engineer Mock Interview"
    role: str = "Software Engineer"
    company: str = "Technology Company"
    experience_level: str = "Mid-Level"
    guest_id: Optional[str] = "guest_default"


class InterviewSessionResponse(BaseModel):
    id: str
    title: str
    role: str
    company: str
    experience_level: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TranscriptCreateRequest(BaseModel):
    session_id: str
    round_number: int
    speaker: str  # interviewer | candidate
    text: str


class TranscriptResponse(BaseModel):
    id: str
    session_id: str
    round_number: int
    speaker: str
    text: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InterviewReportCreateRequest(BaseModel):
    session_id: str
    overall_score: int
    verdict: str
    executive_summary: str
    competencies: List[Dict[str, Any]]


class InterviewReportResponse(BaseModel):
    id: str
    session_id: str
    overall_score: int
    verdict: str
    executive_summary: str
    competencies_json: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
