const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Signup
router.post('/signup', upload.single('profile_picture'), async (req, res) => {
  const { username, email, password, role } = req.body;
  const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;
  
  try {
    const result = await db.query(
      'INSERT INTO users (username, email, password, role, profile_picture) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, profile_picture',
      [username, email, password, role, profile_picture]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query(
      'SELECT id, username, email, role FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
