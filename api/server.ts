import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { config } from 'dotenv';
import { connectDB } from './database';
import router from './router';
import { fileURLToPath } from 'url';

config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,admin-token');
  next();
});

app.use(express.static(path.join(__dirname, '..', 'dist')));

interface AdminLoginRequest extends Request {
  body: {
    password: string;
  };
}

app.post('/api/admin/login', (req: AdminLoginRequest, res: Response): Promise<void> | undefined => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminPassword || !adminToken) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  if (password === adminPassword) {
    res.json({ token: adminToken });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.use('/api', router);

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

export default app;
