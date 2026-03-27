from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date as dt_date
from ..core.database import get_db
from ..models.models import DailyTrackingLog, User, Habit
from ..schemas.tracking import DailyTrackingLogCreate, DailyTrackingLogUpdate, DailyTrackingLogOut
from .dependencies import get_current_user

router = APIRouter(prefix="/tracking", tags=["tracking"])

@router.get("/", response_model=List[DailyTrackingLogOut])
def get_daily_logs(
    target_date: Optional[dt_date] = Query(None),
    item_type: Optional[str] = Query(None),
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    query = db.query(DailyTrackingLog).filter(DailyTrackingLog.user_id == current_user.id)
    if target_date:
        query = query.filter(DailyTrackingLog.date == target_date)
    if item_type:
        query = query.filter(DailyTrackingLog.item_type == item_type)
    return query.all()

@router.post("/", response_model=DailyTrackingLogOut)
def upsert_daily_log(
    log_data: DailyTrackingLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if log already exists for this item on this date
    existing_log = db.query(DailyTrackingLog).filter(
        DailyTrackingLog.user_id == current_user.id,
        DailyTrackingLog.item_type == log_data.item_type,
        DailyTrackingLog.item_id == log_data.item_id,
        DailyTrackingLog.date == log_data.date
    ).first()

    if existing_log:
        if log_data.item_type == "Habit" and existing_log.status != log_data.status:
            habit = db.query(Habit).filter(Habit.id == log_data.item_id).first()
            if habit:
                if log_data.status == "Completed":
                    habit.streak += 1
                elif existing_log.status == "Completed" and log_data.status != "Completed":
                    habit.streak = max(0, habit.streak - 1)
        
        existing_log.status = log_data.status
        if log_data.notes is not None:
            existing_log.notes = log_data.notes
        db.commit()
        db.refresh(existing_log)
        return existing_log
    else:
        new_log = DailyTrackingLog(
            user_id=current_user.id,
            **log_data.dict()
        )
        if log_data.item_type == "Habit" and log_data.status == "Completed":
            habit = db.query(Habit).filter(Habit.id == log_data.item_id).first()
            if habit:
                habit.streak += 1

        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return new_log
