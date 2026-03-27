from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .tracking import DailyTrackingLogOut

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[int] = 1
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskOut(TaskBase):
    id: int
    created_at: datetime
    logs: List[DailyTrackingLogOut] = []

    class Config:
        from_attributes = True
