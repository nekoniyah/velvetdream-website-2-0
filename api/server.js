const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { MailtrapClient } = require("mailtrap");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize Mailtrap client
const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

// Middleware
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
app.use(express.static(path.join(__dirname, "dist")));

// Handle SPA routing - send all requests to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
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

module.exports = app;
