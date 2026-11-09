from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# Base User Schema with shared fields
class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120, examples=["Elena Rostova"])
    email: EmailStr = Field(..., examples=["elena@example.com"])
    target_role: Optional[str] = Field(
        default="fullstack",
        max_length=100,
        examples=["fullstack", "backend", "frontend", "system_design", "ai_ml", "product_manager"],
    )


# Request schema for user signup / registration
class UserSignup(UserBase):
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Password must be at least 8 characters long",
        examples=["MasterAI#2026"],
    )


# Request schema for user login
class UserLogin(BaseModel):
    email: EmailStr = Field(..., examples=["elena@example.com"])
    password: str = Field(..., min_length=1, examples=["MasterAI#2026"])


# Public response schema for user profile
class UserResponse(UserBase):
    id: str
    avatar_url: Optional[str] = None
    is_active: bool = True
    interviews_completed: int = 0
    readiness_score: int = 70
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Authentication token response schema
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
