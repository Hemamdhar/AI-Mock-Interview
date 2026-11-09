from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.schemas.user import UserSignup, UserLogin, UserResponse, TokenResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
def signup(user_in: UserSignup, db: Session = Depends(get_db)):
    """
    Create a new candidate account with email, password, and target interview track.
    Returns access token and user profile on success.
    """
    # Check if user with this email already exists
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists.",
        )

    # Hash the user's password securely
    hashed_pwd = get_password_hash(user_in.password)

    # Create new User model instance
    new_user = User(
        name=user_in.name.strip(),
        email=user_in.email.lower().strip(),
        hashed_password=hashed_pwd,
        target_role=user_in.target_role or "fullstack",
        interviews_completed=0,
        readiness_score=70,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Issue JWT access token
    access_token = create_access_token(
        subject=new_user.id,
        claims={"email": new_user.email, "name": new_user.name},
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Log in with email and password",
)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate candidate credentials and issue a JWT access token.
    """
    # Find user by email
    user = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password hash
    if not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive.",
        )

    # Issue JWT access token
    access_token = create_access_token(
        subject=user.id,
        claims={"email": user.email, "name": user.name},
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Retrieve current authenticated candidate's profile and interview progress.
    """
    return UserResponse.model_validate(current_user)


@router.post(
    "/logout",
    summary="Sign out user session",
)
def logout(current_user: User = Depends(get_current_user)):
    """
    Acknowledge sign out for the authenticated session.
    """
    return {"message": "Successfully logged out.", "user_id": current_user.id}
