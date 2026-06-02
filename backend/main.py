from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal, Base
import models
from services import auth_service
from Router import auth_router, user_router, task_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Management API")

@app.on_event("startup")
def create_default_admin():
    db = SessionLocal()
    try:
        admin = db.query(models.User).filter(models.User.role == models.RoleEnum.Admin).first()
        if not admin:
            hashed_password = auth_service.get_password_hash("admin123")
            default_admin = models.User(
                username="admin", 
                hashed_password=hashed_password, 
                role=models.RoleEnum.Admin
            )
            db.add(default_admin)
            db.commit()
            print("Default admin created: admin / admin123")
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(task_router)

@app.get("/")
def health_check():
    return {"status": "ok"}
