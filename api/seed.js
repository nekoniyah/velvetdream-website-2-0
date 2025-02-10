import { Project, CompanyPost } from "./database.js";

const initialProjects = [
  {
    title: "Beast: Shapes of Gods",
    description:
      "BSOG (Beast: Shapes of Gods) is a TCG (Trading Card Game) inspired by League of Legends and MTG (Magic: The Gathering). Fight with your favorite heroes and spells in a fast-paced game.",
    image: "bsog.png",
    tags: ["TCG", "Card Game", "Strategy"],
  },
  {
    title: "Blatant: Fight with skill",
    description:
      "Blatant is a board game where you must use your resources to enhance your pawns and reach the enemy base to win the game. Cast unique cards to surprise your enemies, capture other enemy pawns, manage your resources, etc. This is played between 2 and 4 players.",
    image: "blatant.png",
    tags: ["Board Game", "Strategy"],
  },
  {
    title: "Coming soon...",
    description: "We are working on new projects. Stay tuned!",
    image: "1.png",
    tags: ["New Project"],
  },
];

const initialPosts = [
  {
    title: "Welcome to VelvetDream!",
    content:
      "We're excited to launch our new community hub. Stay tuned for updates about our projects and join the discussion!",
    author: "VelvetDream Team",
    image: "1.png",
  },
  {
    title: "Development Update: Latest Progress",
    content:
      "Check out our latest development progress on our upcoming projects. We can't wait to share more details with you!",
    author: "Development Team",
    image: "1.png",
  },
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Project.deleteMany({});
    await CompanyPost.deleteMany({});

    // Insert new data
    await Project.insertMany(initialProjects);
    await CompanyPost.insertMany(initialPosts);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export default seedDatabase;
