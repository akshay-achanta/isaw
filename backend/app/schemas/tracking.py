from pydantic import BaseModel
from typing import Optional
from datetime import date

class DailyTrackingLogBase(BaseModel):
    item_type: str
    item_id: int
    date: date
    status: str
    notes: Optional[str] = None

class DailyTrackingLogCreate(DailyTrackingLogBase):
    pass

class DailyTrackingLogUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class DailyTrackingLogOut(DailyTrackingLogBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
