from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..core.database import get_db
from ..models.models import Schedule, User
from ..schemas.schedule import ScheduleCreate, ScheduleOut
from .dependencies import get_current_user
from datetime import date

router = APIRouter(prefix="/schedule", tags=["schedule"])

@router.get("/", response_model=List[ScheduleOut])
def get_schedule(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Schedule).filter(Schedule.user_id == current_user.id).all()

@router.post("/", response_model=ScheduleOut)
def create_schedule_item(item: ScheduleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_item = Schedule(**item.dict(), user_id=current_user.id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{item_id}", response_model=ScheduleOut)
def update_schedule_item(item_id: int, item_data: ScheduleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Schedule).filter(Schedule.id == item_id, Schedule.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Schedule item not found")
    item.title = item_data.title
    item.start_time = item_data.start_time
    item.end_time = item_data.end_time
    if item_data.category is not None:
        item.category = item_data.category
    if item_data.schedule_date is not None:
        item.schedule_date = item_data.schedule_date
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_schedule_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Schedule).filter(Schedule.id == item_id, Schedule.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Schedule item not found")
    db.delete(item)
    db.commit()
    return {"message": "Schedule item deleted"}
