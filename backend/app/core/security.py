from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
from .config import settings
import bcrypt
import hashlib
import base64

import logging

logger = logging.getLogger(__name__)

# Monkey-patch bcrypt to fix passlib 1.7.4 compatibility with bcrypt 4.0+
# See: https://github.com/pyca/bcrypt/issues/684
if not hasattr(bcrypt, "__about__"):
    bcrypt.__about__ = type('obj', (object,), {'__version__': bcrypt.__version__})

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def _preprocess_password(password: str) -> str:
    """
    Bcrypt has a 72-byte limit. Pre-hashing with SHA-256 hexdigest 
    ensures passwords result in a fixed 64-character string.
    Added manual truncation [:72] as an extra safety buffer.
    """
    if not password:
        print("❌ CRITICAL: Attempted to hash/verify an empty password")
        raise ValueError("Password cannot be empty")
        
    # Standard hexdigest is 64 chars, which fits well within 72 bytes.
    processed = hashlib.sha256(password.encode("utf-8")).hexdigest()
    
    # Final failsafe truncation as requested
    final_input = processed[:72]
    
    print(f"✅ DEBUG: Raw preprocessed length: {len(processed)}")
    print(f"✅ DEBUG: Final Bcrypt input length: {len(final_input)}")
    
    return final_input

print("🚀 SECURITY MODULE LOADED")

def verify_password_v4(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the hashed version."""
    try:
        if not hashed_password:
            print("⚠️ WARNING: Cannot verify against empty hash")
            return False
            
        preprocessed = _preprocess_password(plain_password)
        result = pwd_context.verify(preprocessed, hashed_password)
        print(f"🔑 DEBUG: Password verification result: {result}")
        return result
    except Exception as e:
        print(f"❌ ERROR in verify_password: {str(e)}")
        return False

def get_password_hash_v4(password: str) -> str:
    """Hashes a password with SHA-256 then Bcrypt."""
    try:
        preprocessed = _preprocess_password(password)
        hashed = pwd_context.hash(preprocessed)
        print("✅ DEBUG: Successfully generated password hash.")
        return hashed
    except Exception as e:
        print(f"❌ ERROR in get_password_hash: {str(e)}")
        raise e
