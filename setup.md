# 📋 Fullstack Task Management System - Setup & Database Guide

This repository contains a fullstack **Task Management System** built with **FastAPI (Backend)**, **React + Vite (Frontend)**, and **SQLAlchemy + SQLite (Database)**.

---

## 🏛️ Project Architecture

```mermaid
graph TD
    A[React Frontend: Port 5173] -->|HTTP API Requests| B[FastAPI Backend: Port 8001]
    B -->|SQLAlchemy ORM| C[(SQLite Database: task_db.sqlite)]
    B -.->|Optional Production Migration| D[(MySQL/PostgreSQL Database)]
```

* **Frontend:** React, React Router DOM, TailwindCSS, Axios, Lucide React icons.
* **Backend:** FastAPI, Python, SQLAlchemy ORM, Uvicorn server, JWT Authentication (`PyJWT`, `passlib`).
* **Database:** SQLite (default for development/testing), MySQL (ready using script).

---

## 💾 Database Setup (SQLite & MySQL)

By default, the application is configured to use **SQLite** for development and local testing. This requires **zero database installation**.

### 1. SQLite Setup (Development Default)
- **Automatic Initialization:** The database is initialized automatically the first time you run the backend server. The backend creates a file at `database/task_db.sqlite` and populates the schema automatically.
- **Auto-Seeded Admin User:** The application checks for an Admin user on startup. If not found, it automatically creates the default Admin account:
  - **Username:** `admin`
  - **Password:** `admin123`
- **Resetting the Database:** If you ever need to start fresh, simply delete the `database/task_db.sqlite` file and restart the backend. The tables and default admin will be recreated.

### 2. MySQL Setup (Production Alternative)
If you wish to switch to MySQL:
1. Locate the initialization script at `database/create_database.sql`.
2. Run this script in your MySQL instance to create the database (`task_db`), define the tables (`users`, `tasks`), and seed the default admin account.
3. Update [backend/.env](file:///d:/Fullstacktask/backend/.env) to include your MySQL connection URL:
   ```env
   DATABASE_URL="mysql+pymysql://username:password@localhost:3306/task_db"
   ```
4. Update the DB engine initialization in [backend/database.py](file:///d:/Fullstacktask/backend/database.py) to read from this URL.

---

## ⚙️ Installation & Running Guide

### 1. Backend Setup

Prerequisites: **Python 3.8+**

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a Python virtual environment:**
   * **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **macOS/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory (you can copy the provided `.env.example` file):
   * File path: [backend/.env](file:///d:/Fullstacktask/backend/.env)
   * Content:
     ```env
     SECRET_KEY="4b29c13e2add78fee412ae1d00ef02429539424ed9ed454f68c7ecb680086d9f"
     ```

5. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload --port 8001
   ```
   The backend API will run at `http://localhost:8001`. You can view the interactive documentation (Swagger UI) at `http://localhost:8001/docs`.

---

### 2. Frontend Setup

Prerequisites: **Node.js (v16+) & npm**

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `frontend/` directory:
   * File path: [frontend/.env](file:///d:/Fullstacktask/frontend/.env)
   * Content:
     ```env
     VITE_API_URL="http://localhost:8001/api"
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend application will be hosted at `http://localhost:5173`.

---

## 🔑 Default Accounts

Once both applications are running, you can log in using these default credentials:

* **Admin Role (Full Control):**
  * **Username:** `admin`
  * **Password:** `admin123`
  * **Capabilities:** Create new users, create new tasks, and assign tasks to users.

* **User Role (Worker):**
  * **Username:** Create a user account via the Admin dashboard.
  * **Capabilities:** Log in to view your assigned tasks and change their statuses (Pending, In Progress, Completed).

---

## 🛠️ Main Features Included
- **User Authentication:** JWT-based user login and authorization routing.
- **Admin Dashboard:** Access controls to manage team members and allocate tasks.
- **User Dashboard:** A simple interface for employees to view tasks and log their status updates.
- **Task Status Management:** Dynamic updates for task tracking.
