import { db } from "./database.js";

export const addProject = async (project) => {
  const { title, description, image, tags } = project;

  return db.transaction(() => {
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
        db.prepare(
          `
          INSERT OR IGNORE INTO tags (name)
          VALUES (?)
        `
        ).run(tag);

        db.prepare(
          `
          INSERT INTO project_tags (project_id, tag_id)
          VALUES (?, (SELECT id FROM tags WHERE name = ?))
        `
        ).run(result.lastInsertRowid, tag);
      }
    }

    return result.lastInsertRowid;
  })();
};

export const getProjects = () => {
  return db
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
};
