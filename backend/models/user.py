from sqlalchemy import Column, String, Enum
from sqlalchemy.orm import relationship
import enum
import uuid
from database import Base

class RoleEnum(str, enum.Enum):
    Admin = "Admin"
    User = "User"

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.User)

    tasks_assigned = relationship("Task", back_populates="assignee")
