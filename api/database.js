import { Database } from "bun:sqlite";

const db = new Database("velvetdream.db");

// Initialize database tables
db.run(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS project_tags (
    project_id INTEGER,
    tag_id INTEGER,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id),
    PRIMARY KEY (project_id, tag_id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS company_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    author TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export { db };