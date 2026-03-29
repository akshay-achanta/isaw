from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from ..core.database import get_db
from ..core.security import create_access_token, get_password_hash, verify_password
from ..core.config import settings
from ..models.models import User
from ..schemas.user import UserCreate, UserOut, Token
from .dependencies import get_current_user
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
import logging

logger = logging.getLogger(__name__)

class GoogleAuth(BaseModel):
    email: str
    full_name: str
    google_id: str

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=UserOut)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Creates a new user account with SHA-256 pre-hashing + Bcrypt."""
    try:
        # Check if email exists before attempting creation
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Email already registered"
            )
        
        hashed_password = get_password_hash(user.password)
        
        new_user = User(
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            goals=user.goals
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(f"✅ Successfully created user: {user.email}")
        return new_user
        
    except IntegrityError as e:
        db.rollback()
        logger.warning(f"⚠️ Signup failed: Duplicate email {user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    except HTTPException as e:
        # Re-raise HTTPExceptions from logic above
        raise e
    except Exception as e:
        db.rollback()
        logger.error(f"❌ SIGNUP CRITICAL ERROR: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred during signup"
        )

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == form_data.username).first()
        
        if not user:
            logger.debug(f"🔍 Login failed: User with email {form_data.username} not found.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        logger.debug(f"👤 User found: {user.email}. Proceeding to password verification...")
            
        # Password verification triggers bcrypt
        is_verified = verify_password(form_data.password, user.hashed_password)
        
        if not is_verified:
            logger.debug(f"❌ Login failed: Incorrect password for user {user.email}.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        logger.info(f"✅ Login successful for user: {user.email}")
            
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user.email, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login error: {str(e)}"
        )

@router.post("/google", response_model=Token)
def google_login(auth_data: GoogleAuth, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == auth_data.email).first()
    if not user:
        user = User(
            email=auth_data.email,
            full_name=auth_data.full_name,
            auth_provider="google",
            google_id=auth_data.google_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.delete("/account")
def delete_account(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.delete(current_user)
    db.commit()
    return {"message": "Account successfully deleted"}
