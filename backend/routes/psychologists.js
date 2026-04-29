const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all psychologists (Mentors)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, username as name, 'Mentor' as specialty, 'Professional Mentor ready to assist you.' as bio, profile_picture as image_url, true as is_online, 'Available' as availability 
      FROM users 
      WHERE role = 'mentor' 
      ORDER BY username ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
