import mongoose from "mongoose";
import seedDatabase from "./seed.js";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/velvetdream"
    );
    console.log("MongoDB connected successfully");

    // Run seeding after successful connection
    await seedDatabase();
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// Define Schemas
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  tags: [String],
  created_at: { type: Date, default: Date.now },
});

const CompanyPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  author: String,
  image: String,
  created_at: { type: Date, default: Date.now },
});

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

// Create models
export const Project = mongoose.model("Project", ProjectSchema);
export const CompanyPost = mongoose.model("CompanyPost", CompanyPostSchema);
export const ContactMessage = mongoose.model(
  "ContactMessage",
  ContactMessageSchema
);

export { connectDB };
