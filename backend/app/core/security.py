from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import hashlib
import bcrypt
import jwt
from app.core.config import settings

PASSWORD_HASH_PREFIX = "$bcrypt-sha256$"


def _password_bytes(password: str) -> bytes:
    """Hash the full password before bcrypt applies its 72-byte limit."""
    return hashlib.sha256(password.encode("utf-8")).digest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against the hashed password.
    """
    try:
        if hashed_password.startswith(PASSWORD_HASH_PREFIX):
            hashed_password = hashed_password[len(PASSWORD_HASH_PREFIX) :]
            password = _password_bytes(plain_password)
        else:
            password = plain_password.encode("utf-8")
            if len(password) > 72:
                return False
        return bcrypt.checkpw(password, hashed_password.encode("utf-8"))
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt.
    """
    hashed = bcrypt.hashpw(_password_bytes(password), bcrypt.gensalt()).decode("utf-8")
    return f"{PASSWORD_HASH_PREFIX}{hashed}"


def create_access_token(
    subject: str | Any,
    claims: Optional[Dict[str, Any]] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Generate an encoded JWT access token.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }

    if claims:
        to_encode.update(claims)

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a JWT access token.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except jwt.PyJWTError:
        return None
