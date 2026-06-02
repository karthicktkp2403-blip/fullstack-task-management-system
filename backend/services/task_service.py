from sqlalchemy.orm import Session
from models import Task, StatusEnum
from Schema import TaskCreate

def get_task(db: Session, task_id: str):
    return db.query(Task).filter(Task.id == task_id).first()

def get_tasks(db: Session):
    return db.query(Task).all()

def get_my_tasks(db: Session, user_id: str):
    return db.query(Task).filter(Task.assigned_to == user_id).all()

def create_task(db: Session, task: TaskCreate):
    new_task = Task(title=task.title, description=task.description, assigned_to=task.assigned_to)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

def assign_task(db: Session, task: Task, user_id: str):
    task.assigned_to = user_id
    db.commit()
    db.refresh(task)
    return task

def update_task_status(db: Session, task: Task, status: StatusEnum):
    task.status = status
    db.commit()
    db.refresh(task)
    return task
