from sqlalchemy import Column, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum
import uuid
from database import Base

class StatusEnum(str, enum.Enum):
    Pending = "Pending"
    InProgress = "In Progress"
    Completed = "Completed"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String(100), index=True, nullable=False)
    description = Column(String(500))
    status = Column(Enum(StatusEnum), default=StatusEnum.Pending)
    assigned_to = Column(String(36), ForeignKey("users.id"))

    assignee = relationship("User", back_populates="tasks_assigned")
