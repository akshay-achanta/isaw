-- ============================================
-- ISAW Personal AI Tracker - PostgreSQL Schema
-- Run this on Railway PostgreSQL to initialize tables
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR,
    full_name VARCHAR,
    auth_provider VARCHAR DEFAULT 'email',
    google_id VARCHAR UNIQUE,
    goals TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);
CREATE INDEX IF NOT EXISTS ix_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS ix_users_id ON users(id);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    streak INTEGER DEFAULT 0,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_habits_id ON habits(id);

-- Daily Tracking Logs
CREATE TABLE IF NOT EXISTS daily_tracking_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    item_type VARCHAR,
    item_id INTEGER,
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR DEFAULT 'Pending',
    notes TEXT
);

CREATE INDEX IF NOT EXISTS ix_daily_tracking_logs_id ON daily_tracking_logs(id);
CREATE INDEX IF NOT EXISTS ix_daily_tracking_logs_item_type ON daily_tracking_logs(item_type);
CREATE INDEX IF NOT EXISTS ix_daily_tracking_logs_item_id ON daily_tracking_logs(item_id);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    category VARCHAR,
    user_id INTEGER REFERENCES users(id),
    day_of_week INTEGER,
    schedule_date DATE,
    description TEXT
);

CREATE INDEX IF NOT EXISTS ix_schedules_id ON schedules(id);

-- Learning Logs
CREATE TABLE IF NOT EXISTS learning_logs (
    id SERIAL PRIMARY KEY,
    topic VARCHAR NOT NULL,
    duration INTEGER NOT NULL,
    category VARCHAR,
    notes TEXT,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_learning_logs_id ON learning_logs(id);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 1,
    due_date TIMESTAMP,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_tasks_id ON tasks(id);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    content TEXT NOT NULL,
    color VARCHAR DEFAULT '#ffffff',
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_notes_id ON notes(id);
