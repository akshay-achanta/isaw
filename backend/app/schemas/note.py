from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NoteBase(BaseModel):
    title: str
    content: str
    color: Optional[str] = "#ffffff"

class NoteCreate(NoteBase):
    pass

class NoteOut(NoteBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
