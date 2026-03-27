from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .tracking import DailyTrackingLogOut

class HabitBase(BaseModel):
    title: str
    description: Optional[str] = None

class HabitCreate(HabitBase):
    pass

class HabitOut(HabitBase):
    id: int
    streak: int
    created_at: datetime
    logs: List[DailyTrackingLogOut] = []

    class Config:
        from_attributes = True
