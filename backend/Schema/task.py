from pydantic import BaseModel
from typing import Optional
from models import StatusEnum

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None

class TaskUpdateStatus(BaseModel):
    status: StatusEnum

class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: StatusEnum
    assigned_to: Optional[str]

    class Config:
        from_attributes = True
