import mongoose, { Connection, Document, Model, Schema } from 'mongoose';
import seedDatabase from './seed';

// Define interfaces for the models
export interface IProject extends Document {
  title: string;
  description?: string;
  image?: string;
  tags?: string[];
  created_at: Date;
}

export interface ICompanyPost extends Document {
  title: string;
  content?: string;
  author?: string;
  image?: string;
  created_at: Date;
}

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  created_at: Date;
}

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  username: string;
  created_at: Date;
}

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  created_at: Date;
}

let cachedConnection: Connection | null = null;

const connectDB = async (): Promise<Connection> => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    const conn = await mongoose.connect(mongoUri, {dbName:"velvetdream"});
    cachedConnection = conn.connection;
    console.log('MongoDB connected successfully');

    return conn.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Define Schemas
const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: String,
  image: String,
  tags: [String],
  created_at: { type: Date, default: Date.now },
});

const CompanyPostSchema = new Schema<ICompanyPost>({
  title: { type: String, required: true },
  content: String,
  author: String,
  image: String,
  created_at: { type: Date, default: Date.now },
});

const ContactMessageSchema = new Schema<IContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const CommentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: 'CompanyPost', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  username: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

// Create models with TypeScript interfaces
export const Project: Model<IProject> = mongoose.model('Project', ProjectSchema);
export const CompanyPost: Model<ICompanyPost> = mongoose.model('CompanyPost', CompanyPostSchema);
export const ContactMessage: Model<IContactMessage> = mongoose.model('ContactMessage', ContactMessageSchema);
export const Comment: Model<IComment> = mongoose.model('Comment', CommentSchema);
export const User: Model<IUser> = mongoose.model('User', UserSchema);

export { connectDB };
