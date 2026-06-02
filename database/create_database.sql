CREATE DATABASE IF NOT EXISTS task_db;
USE task_db;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'User') DEFAULT 'User'
);
CREATE INDEX ix_users_id ON users (id);
CREATE INDEX ix_users_username ON users (username);

-- -----------------------------------------------------
-- Table `tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    assigned_to CHAR(36),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);
CREATE INDEX ix_tasks_id ON tasks (id);
CREATE INDEX ix_tasks_title ON tasks (title);

-- -----------------------------------------------------
-- Default Admin User (username: admin / password: admin123)
-- -----------------------------------------------------
INSERT INTO users (id, username, hashed_password, role)
VALUES (
    'b18e4a7e-619b-4c29-89e4-70275fa64bd7',
    'admin',
    '$2b$12$B2kmocgD2ehpsX3m.JafrusKLDVcnSnMTLYUd5RRn2.N7kPB2J6VO',
    'Admin'
) ON DUPLICATE KEY UPDATE username = username;
