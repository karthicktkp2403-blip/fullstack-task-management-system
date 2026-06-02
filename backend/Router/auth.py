from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import Schema
import services.user_service as user_service
import services.auth_service as auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login")
def login(user_data: Schema.UserCreate, db: Session = Depends(get_db)):
    user = user_service.get_user_by_username(db, user_data.username)
    if not user or not auth_service.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    role_value = user.role.value if hasattr(user.role, 'value') else user.role
    access_token = auth_service.create_access_token(data={"sub": user.username, "role": role_value})
    return {"access_token": access_token, "token_type": "bearer"}
