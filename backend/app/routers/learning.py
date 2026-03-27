from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..core.database import get_db
from ..models.models import LearningLog, User
from ..schemas.learning import LearningLogCreate, LearningLogOut
from .dependencies import get_current_user
from datetime import datetime, date

router = APIRouter(prefix="/learning", tags=["learning"])

@router.get("/", response_model=List[LearningLogOut])
def get_learning_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(LearningLog).filter(LearningLog.user_id == current_user.id).all()

@router.post("/", response_model=LearningLogOut)
def create_learning_log(
    log: LearningLogCreate, 
    target_date: Optional[date] = Query(None),
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    new_log = LearningLog(**log.dict(), user_id=current_user.id)
    if target_date:
        new_log.created_at = datetime.combine(target_date, datetime.min.time())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@router.put("/{log_id}", response_model=LearningLogOut)
def update_learning_log(log_id: int, log_data: LearningLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    log = db.query(LearningLog).filter(LearningLog.id == log_id, LearningLog.user_id == current_user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Learning log not found")
    log.topic = log_data.topic
    log.duration = log_data.duration
    if log_data.category is not None:
        log.category = log_data.category
    db.commit()
    db.refresh(log)
    return log

@router.get("/stats")
def get_learning_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = db.query(LearningLog).filter(LearningLog.user_id == current_user.id).all()
    total_minutes = sum(log.duration for log in logs)
    return {"total_minutes": total_minutes, "log_count": len(logs)}

@router.delete("/{log_id}")
def delete_learning_log(log_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    log = db.query(LearningLog).filter(LearningLog.id == log_id, LearningLog.user_id == current_user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Learning log not found")
    db.delete(log)
    db.commit()
    return {"message": "Learning log deleted"}
