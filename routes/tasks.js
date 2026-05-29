const express = require("express");
const router = express.Router();
const db = require("../db");

/* =========================
   GET TASKS
========================= */
router.get("/:projectId", (req, res) => {
  const tasks = db
    .prepare("SELECT * FROM tasks WHERE project_id = ?")
    .all(req.params.projectId);

  res.json(tasks);
});

/* =========================
   CREATE TASK
========================= */
router.post("/", (req, res) => {
  const { title, project_id } = req.body;

  const result = db
    .prepare(
      "INSERT INTO tasks (title, status, project_id) VALUES (?, ?, ?)"
    )
    .run(title, "todo", project_id);

  req.io.emit("task-updated");

  res.json({ id: result.lastInsertRowid });
});

/* =========================
   UPDATE STATUS (DRAG & DROP)
========================= */
router.patch("/:id/status", (req, res) => {
  const { status } = req.body;

  db.prepare("UPDATE tasks SET status = ? WHERE id = ?").run(
    status,
    req.params.id
  );

  req.io.emit("task-updated");

  res.json({ message: "Updated" });
});

module.exports = router;