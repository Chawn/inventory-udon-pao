-- ระบบจัดการ Inventory เครื่องจักร อบจ.อุดรธานี
-- Database Schema for SQLite

-- ตาราง Users (Admin)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Projects (โครงการ)
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  latitude REAL,
  longitude REAL,
  start_date DATE,
  end_date DATE,
  status TEXT CHECK(status IN ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')) DEFAULT 'PLANNING',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Machinery (เครื่องจักร)
CREATE TABLE IF NOT EXISTS machinery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- ประเภท เช่น รถแบคโฮ, รถบด, รถทำถนน
  brand TEXT,
  model TEXT,
  year INTEGER,
  status TEXT CHECK(status IN ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE')) DEFAULT 'AVAILABLE',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Teams (ทีม)
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง Employees (พนักงาน)
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  position TEXT,
  phone TEXT,
  team_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
);

-- ตาราง MachineryAssignments (การมอบหมายเครื่องจักร)
CREATE TABLE IF NOT EXISTS machinery_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  machinery_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  assigned_date DATE NOT NULL,
  return_date DATE,
  status TEXT CHECK(status IN ('ASSIGNED', 'RETURNED', 'CANCELLED')) DEFAULT 'ASSIGNED',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (machinery_id) REFERENCES machinery(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index สำหรับการค้นหาที่เร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_machinery_status ON machinery(status);
CREATE INDEX IF NOT EXISTS idx_machinery_type ON machinery(type);
CREATE INDEX IF NOT EXISTS idx_employees_team ON employees(team_id);
CREATE INDEX IF NOT EXISTS idx_assignments_machinery ON machinery_assignments(machinery_id);
CREATE INDEX IF NOT EXISTS idx_assignments_project ON machinery_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON machinery_assignments(status);
