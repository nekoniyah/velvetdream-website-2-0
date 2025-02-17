import express from "express";
import { adminAuth } from "./middleware/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { CompanyPost, ContactMessage, Project, User } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();


// Projects routes
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.post("/admin/projects", adminAuth, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Company posts routes
router.get("/posts", async (req, res) => {
  try {
    const posts = await CompanyPost.find().sort({ created_at: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.post("/admin/posts", adminAuth, async (req, res) => {
  try {
    const post = new CompanyPost(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Contact routes
router.post("/contact", async (req, res) => {
  try {
    const message = new ContactMessage(req.body);
    await message.save();
    res.status(200).json({
      message: "Message received successfully",
      id: message._id,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

router.get("/admin/messages", adminAuth, async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ created_at: -1 })
      .limit(10);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// User registration
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    bcrypt.hash(password.toString(), 8, async (err, hash) => {
      if (err) throw err;

      const user = new User({
        username,
        password: hash,
        email,
      });

      await user.save();
      res.status(201).json({ message: "User created successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (
      !user ||
      !(await bcrypt.compare(password.toString(), user.password.toString()))
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Comments routes
router.post("/posts/:postId/comments", async (req, res) => {
  try {
    const { content, userId, username } = req.body;
    const comment = new Comment({
      postId: req.params.postId,
      userId,
      content,
      username,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
  }
});

router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      created_at: -1,
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

export default router;