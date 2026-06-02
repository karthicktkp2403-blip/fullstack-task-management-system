from pydantic import BaseModel
from models import RoleEnum

class UserCreate(BaseModel):
    username: str
    password: str
    role: RoleEnum = RoleEnum.User

class UserResponse(BaseModel):
    id: str
    username: str
    role: RoleEnum

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
