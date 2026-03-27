from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .tracking import DailyTrackingLogOut

class LearningLogBase(BaseModel):
    topic: str
    duration: int
    category: Optional[str] = None
    notes: Optional[str] = None

class LearningLogCreate(LearningLogBase):
    pass

class LearningLogOut(LearningLogBase):
    id: int
    created_at: datetime
    logs: List[DailyTrackingLogOut] = []

    class Config:
        from_attributes = True
