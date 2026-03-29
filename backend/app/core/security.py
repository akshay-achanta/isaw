from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from .config import settings
import bcrypt
import hashlib

print("🚀 SECURITY MODULE v5 LOADED - Using bcrypt directly, NO passlib")


def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def _preprocess_password(password: str) -> bytes:
    """
    SHA-256 the password to get a fixed 64-char hex string,
    then encode to bytes. Result is always exactly 64 bytes.
    """
    hex_digest = hashlib.sha256(password.encode("utf-8")).hexdigest()
    result = hex_digest.encode("utf-8")
    print(f"✅ DEBUG: Preprocessed to {len(result)} bytes")
    return result


def get_password_hash(password: str) -> str:
    """Hash password using bcrypt DIRECTLY (no passlib)."""
    preprocessed = _preprocess_password(password)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(preprocessed, salt)
    print(f"✅ DEBUG: Hash generated successfully, length: {len(hashed)}")
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password using bcrypt DIRECTLY (no passlib)."""
    try:
        preprocessed = _preprocess_password(plain_password)
        result = bcrypt.checkpw(preprocessed, hashed_password.encode("utf-8"))
        print(f"🔑 DEBUG: Password verification result: {result}")
        return result
    except Exception as e:
        print(f"❌ ERROR in verify_password: {str(e)}")
        return False
