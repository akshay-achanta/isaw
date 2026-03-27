from pydantic import BaseModel
from typing import Optional, List
from datetime import time, date
from .tracking import DailyTrackingLogOut

class ScheduleBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: time
    end_time: time
    category: Optional[str] = None # Work, Learning, Health, Personal
    day_of_week: Optional[int] = None
    schedule_date: Optional[date] = None

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleOut(ScheduleBase):
    id: int
    logs: List[DailyTrackingLogOut] = []

    class Config:
        from_attributes = True
