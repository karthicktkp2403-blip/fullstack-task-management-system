import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

from urllib.parse import quote_plus

load_dotenv()

# Database configuration for SQLite
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", "database", "task_db.sqlite").replace("\\", "/")
SQLITE_URL = f"sqlite:///{DB_PATH}"

# connect_args={"check_same_thread": False} is needed for SQLite in FastAPI
engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False}, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
