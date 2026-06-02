from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import Schema
import models
import services.task_service as task_service
import services.user_service as user_service
import services.auth_service as auth_service

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.post("/", response_model=Schema.TaskResponse, dependencies=[Depends(auth_service.get_current_admin_user)])
def create_task(task: Schema.TaskCreate, db: Session = Depends(get_db)):
    return task_service.create_task(db, task)

@router.get("/", response_model=List[Schema.TaskResponse], dependencies=[Depends(auth_service.get_current_admin_user)])
def get_all_tasks(db: Session = Depends(get_db)):
    return task_service.get_tasks(db)

@router.post("/{task_id}/assign", response_model=Schema.TaskResponse, dependencies=[Depends(auth_service.get_current_admin_user)])
def assign_task(task_id: str, user_id: str, db: Session = Depends(get_db)):
    task = task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return task_service.assign_task(db, task, user.id)

@router.get("/mine", response_model=List[Schema.TaskResponse])
def get_my_tasks(current_user: models.User = Depends(auth_service.get_current_user), db: Session = Depends(get_db)):
    return task_service.get_my_tasks(db, current_user.id)

@router.patch("/{task_id}/status", response_model=Schema.TaskResponse)
def update_task_status(task_id: str, status_data: Schema.TaskUpdateStatus, current_user: models.User = Depends(auth_service.get_current_user), db: Session = Depends(get_db)):
    task = task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.assigned_to != current_user.id and current_user.role != models.RoleEnum.Admin:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
    
    return task_service.update_task_status(db, task, status_data.status)
