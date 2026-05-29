const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE PROJECT
router.post('/', (req, res) => {
  const { name, owner_id } = req.body;

  const result = db
    .prepare('INSERT INTO projects (name, owner_id) VALUES (?, ?)')
    .run(name, owner_id);

  res.json({ id: result.lastInsertRowid });
});

// GET PROJECTS
router.get('/:ownerId', (req, res) => {
  const projects = db
    .prepare('SELECT * FROM projects WHERE owner_id = ?')
    .all(req.params.ownerId);

  res.json(projects);
});

module.exports = router;