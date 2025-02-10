import express from "express";
import path, { join } from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { db } from "./database.js";
import { adminAuth } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Load environment variables
config();

// Initialize Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// Serve static files from the Svelte build directory
app.use(express.static(join(__dirname, "..", "dist")));

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ token: process.env.ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

let router = express.Router();

// Projects routes
router.get("/projects", (req, res) => {
  try {
    const projects = db
      .prepare(
        `
      SELECT p.*, GROUP_CONCAT(t.name) as tags
      FROM projects p
      LEFT JOIN project_tags pt ON p.id = pt.project_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
    `
      )
      .all();

    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.post("/admin/projects", adminAuth, (req, res) => {
  try {
    const { title, description, image, tags } = req.body;

    const result = db
      .prepare(
        `
      INSERT INTO projects (title, description, image)
      VALUES (?, ?, ?)
    `
      )
      .run(title, description, image);

    if (tags && tags.length > 0) {
      for (const tag of tags) {
        // Insert tag if it doesn't exist
        const tagResult = db
          .prepare(
            `
          INSERT OR IGNORE INTO tags (name)
          VALUES (?)
        `
          )
          .run(tag);

        // Link project with tag
        db.prepare(
          `
          INSERT INTO project_tags (project_id, tag_id)
          VALUES (?, (SELECT id FROM tags WHERE name = ?))
        `
        ).run(result.lastInsertRowid, tag);
      }
    }

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Company posts routes
router.get("/posts", (req, res) => {
  try {
    const posts = db
      .prepare("SELECT * FROM company_posts ORDER BY created_at DESC")
      .all();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.post("/admin/posts", adminAuth, (req, res) => {
  try {
    const { title, content, author, image } = req.body;

    const result = db
      .prepare(
        `
      INSERT INTO company_posts (title, content, author, image)
      VALUES (?, ?, ?, ?)
    `
      )
      .run(title, content, author, image);

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }

  router.get("/messages", async (req, res) => {
    try {
      const messages = db
        .prepare(
          `
        SELECT * FROM contact_messages 
        ORDER BY created_at DESC 
        LIMIT 10
      `
        )
        .all();

      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
});

// Tags routes
router.get("/tags", (req, res) => {
  try {
    const tags = db.prepare("SELECT * FROM tags").all();
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const result = db
      .prepare(
        `
      INSERT INTO contact_messages (name, email, message)
      VALUES (?, ?, ?)
    `
      )
      .run(name, email, message);

    res.status(200).json({
      message: "Message received successfully",
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

router.get("/admin/messages", adminAuth, async (req, res) => {
  try {
    const messages = db
      .prepare(
        `
      SELECT * FROM contact_messages 
      ORDER BY created_at DESC 
      LIMIT 10
    `
      )
      .all();

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.use("/api", router);

app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "..", "dist", "index.html"));
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
