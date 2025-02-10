// import Database from "better-sqlite3";
import pkg from "sqlite3";
const { Database } = pkg;
import seedDatabase from "./seed.js";
import fs from "fs";
import path from "path";
// const db = new Database(path.join(process.cwd(), "velvetdream.db"), {
//   fileMustExist: false,
// });

if (!fs.existsSync("./velvetdream.db")) {
  fs.writeFileSync("./velvetdream.db", "");
}

const db = new Database("./velvetdream.db");

db.configure("busyTimeout", 3000);
db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");
});

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS project_tags (
    project_id INTEGER,
    tag_id INTEGER,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id),
    PRIMARY KEY (project_id, tag_id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS company_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    author TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

(async () => {
  await seedDatabase();
})();

export { db };
