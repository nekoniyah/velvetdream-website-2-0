import { db } from "./database.js";

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

// Function to seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    db.prepare("DELETE FROM project_tags").run();
    db.prepare("DELETE FROM tags").run();
    db.prepare("DELETE FROM projects").run();

    // Add each project
    for (const project of initialProjects) {
      // Insert project
      const result = db
        .prepare(
          `
        INSERT INTO projects (title, description, image)
        VALUES (?, ?, ?)
      `
        )
        .run(project.title, project.description, project.image);

      const projectId = result.lastInsertRowid;

      // Add tags
      for (const tagName of project.tags) {
        // Insert tag if it doesn't exist
        db.prepare(
          `
          INSERT OR IGNORE INTO tags (name)
          VALUES (?)
        `
        ).run(tagName);

        // Link project with tag
        db.prepare(
          `
          INSERT INTO project_tags (project_id, tag_id)
          VALUES (?, (SELECT id FROM tags WHERE name = ?))
        `
        ).run(projectId, tagName);
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seeding
export default seedDatabase;
