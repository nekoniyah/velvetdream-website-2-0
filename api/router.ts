import express, { Request, Response } from 'express';
import { adminAuth } from './middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  CompanyPost,
  ContactMessage,
  Project,
  User,
  Comment,
  IProject,
  ICompanyPost,
  IContactMessage,
  IUser,
  IComment,
} from './database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

interface JwtPayload {
  userId: string;
}

// Projects routes
router.get('/projects', async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/admin/projects', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const project = new Project(req.body as IProject);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.delete('/admin/projects/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Company posts routes
router.get('/posts', async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await CompanyPost.find().sort({ created_at: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/admin/posts', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const post = new CompanyPost(req.body as ICompanyPost);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.delete('/admin/posts/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await CompanyPost.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Contact routes
router.post('/contact', async (req: Request, res: Response): Promise<void> => {
  try {
    const message = new ContactMessage(req.body as IContactMessage);
    await message.save();
    res.status(200).json({
      message: 'Message received successfully',
      id: message._id,
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

router.get('/admin/messages', adminAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const messages = await ContactMessage.find().sort({ created_at: -1 }).limit(10);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// User registration
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email } = req.body as IUser;
    bcrypt.hash(password.toString(), 8, async (err, hash) => {
      if (err) throw err;

      const user = new User({
        username,
        password: hash,
        email,
      });

      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// User login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body as Pick<IUser, 'username' | 'password'>;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password.toString(), user.password.toString()))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string);
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Comments routes
router.post('/posts/:postId/comments', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No authorization token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const { content, username } = req.body as Pick<IComment, 'content' | 'username'>;
    const comment = new Comment({
      postId: req.params.postId,
      userId: decoded.userId,
      content,
      username,
      created_at: new Date(),
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

router.get('/posts/:postId/comments', async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      created_at: -1,
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

export default router;
