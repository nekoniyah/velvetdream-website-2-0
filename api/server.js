import express from "express";
import path, { join } from "path";
import { config } from "dotenv";
import { MailtrapClient } from "mailtrap";
import { fileURLToPath } from "url";

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

// Serve static files from the Svelte build directory
app.use(express.static(join(__dirname, "..", "dist")));

// Handle SPA routing - send all requests to index.html
app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "..", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
