from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import Schema
import services.user_service as user_service
import services.auth_service as auth_service

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/", response_model=Schema.UserResponse, dependencies=[Depends(auth_service.get_current_admin_user)])
def create_user(user: Schema.UserCreate, db: Session = Depends(get_db)):
    db_user = user_service.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    return user_service.create_user(db, user)

@router.get("/", response_model=List[Schema.UserResponse], dependencies=[Depends(auth_service.get_current_admin_user)])
def get_users(db: Session = Depends(get_db)):
    return user_service.get_users(db)
