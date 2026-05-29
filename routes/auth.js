const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET = 'secret123'; // later move to .env

// =======================
// REGISTER
// =======================
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const hash = bcrypt.hashSync(password, 10);

    db.prepare(
      'INSERT INTO users (username, password) VALUES (?, ?)'
    ).run(username, hash);

    res.json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
});

// =======================
// LOGIN
// =======================
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const user = db.prepare(
    'SELECT * FROM users WHERE username = ?'
  ).get(username);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    username: user.username
  });
});

module.exports = router;