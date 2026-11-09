from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class ProgressToggleRequest(BaseModel):
    category: str = Field(..., description="Category: dsa, aiml, system_design, core_cs_os, core_cs_cn, core_cs_dbms, core_cs_arch, core_cs_oop")
    item_id: str = Field(..., description="ID of the question or topic, e.g. '1', 'ml_1', 'os-intro'")
    completed: bool = Field(True, description="True if marked complete, False if uncompleted")
    title: Optional[str] = Field(None, description="Title of the topic or problem")
    difficulty: Optional[str] = Field(None, description="Difficulty if applicable (Easy, Medium, Hard)")
    guest_id: Optional[str] = Field("guest_default", description="Guest identifier if not logged in")


class ProgressSyncRequest(BaseModel):
    guest_id: Optional[str] = Field("guest_default", description="Guest identifier if not logged in")
    dsa_solved_ids: Optional[List[str]] = Field(default_factory=list)
    aiml_completed_ids: Optional[List[str]] = Field(default_factory=list)
    system_design_completed_ids: Optional[List[str]] = Field(default_factory=list)
    core_cs_os_completed_ids: Optional[List[str]] = Field(default_factory=list)
    core_cs_cn_completed_ids: Optional[List[str]] = Field(default_factory=list)
    core_cs_dbms_completed_ids: Optional[List[str]] = Field(default_factory=list)
    core_cs_arch_completed_ids: Optional[List[str]] = Field(default_factory=list)
    core_cs_oop_completed_ids: Optional[List[str]] = Field(default_factory=list)


class ProgressItemResponse(BaseModel):
    id: str
    category: str
    topic_id: str
    title: Optional[str] = None
    difficulty: Optional[str] = None
    completed: bool
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProgressStats(BaseModel):
    total_completed: int = 0
    dsa_total: int = 0
    dsa_easy: int = 0
    dsa_medium: int = 0
    dsa_hard: int = 0
    aiml_total: int = 0
    system_design_total: int = 0
    core_cs_total: int = 0
    core_cs_os_total: int = 0
    core_cs_cn_total: int = 0
    core_cs_dbms_total: int = 0
    core_cs_arch_total: int = 0
    core_cs_oop_total: int = 0
    readiness_score: int = 70


class ProgressSummaryResponse(BaseModel):
    dsa: List[str] = Field(default_factory=list)
    aiml: List[str] = Field(default_factory=list)
    system_design: List[str] = Field(default_factory=list)
    core_cs_os: List[str] = Field(default_factory=list)
    core_cs_cn: List[str] = Field(default_factory=list)
    core_cs_dbms: List[str] = Field(default_factory=list)
    core_cs_arch: List[str] = Field(default_factory=list)
    core_cs_oop: List[str] = Field(default_factory=list)
    stats: ProgressStats
