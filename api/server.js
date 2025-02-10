import express from "express";
import path, { join } from "path";
import { config } from "dotenv";
import { MailtrapClient } from "mailtrap";
import { fileURLToPath } from "url";
import { db } from "./database.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Load environment variables
config();

// Initialize Express app
const app = express();

// Initialize Mailtrap client
const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

// Add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the Svelte build directory
app.use("/", express.static(join(__dirname, "..", "dist")));

// API Routes
app.post("/api/mail", async (req, res) => {
  try {
    const formData = req.body;

    const sender = {
      email: `hello@velvetdream.eu`,
      name: `${formData.name}`,
    };

    const recipients = [
      {
        email: "contact.velvetdream@gmail.com",
      },
    ];

    await client.send({
      from: sender,
      to: recipients,
      subject: `Message from ${formData.name}`,
      text: `Name: ${formData.name} \nEmail: ${formData.email} \nMessage: ${formData.message}`,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Projects routes
app.get("/api/projects", (req, res) => {
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

app.post("/api/projects", (req, res) => {
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
app.get("/api/posts", (req, res) => {
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

app.post("/api/posts", (req, res) => {
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
});

// Tags routes
app.get("/api/tags", (req, res) => {
  try {
    const tags = db.prepare("SELECT * FROM tags").all();
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
