from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class SimulatorSubmissionCreate(BaseModel):
    role_id: str = Field(..., description="Unique role identifier")
    role_title: str = Field(..., description="Role display title")
    score: int = Field(default=0, ge=0, le=100, description="Overall score 0-100")
    total_marks: int = Field(default=100, ge=1, description="Total marks possible")
    verdict: str = Field(default="Hire", description="Hiring verdict")
    sections: Dict[str, Any] = Field(default_factory=dict, description="Section-by-section breakdown")
    time_spent_seconds: int = Field(default=0, ge=0, description="Time spent in seconds")
    guest_id: Optional[str] = Field(default="guest_default", description="Guest tracking ID")


class SimulatorSubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    role_id: str
    role_title: str
    score: int
    total_marks: int
    verdict: str
    sections: Dict[str, Any]
    time_spent_seconds: int
    created_at: str
