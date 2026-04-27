const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all videos
router.get('/', async (req, res) => {
  const { lang } = req.query;
  try {
    let query = 'SELECT * FROM videos';
    let params = [];
    
    if (lang) {
      query += ' WHERE language = $1';
      params.push(lang);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.warn('Database not available, using mock videos.');
    const mockVideos = [
      { id: 1, title: 'Safe Practices for Youth', description: 'Learn about protection and safe choices.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', language: 'en' },
      { id: 2, title: 'Uburyo bwo kwirinda SIDA', description: 'Ubumenyi ku bijyanye no kwirinda.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', language: 'rw' },
      { id: 3, title: 'Afya ya Jamii', description: 'Maelezo kuhusu kinga na afya.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', language: 'sw' }
    ];
    
    let filtered = mockVideos;
    if (lang) {
      filtered = mockVideos.filter(v => v.language === lang);
    }
    res.json(filtered);
  }
});

// Add new video
router.post('/', async (req, res) => {
  const { title, description, url, language } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO videos (title, description, url, language) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, url, language]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update video
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, url, language } = req.body;
  try {
    const result = await db.query(
      'UPDATE videos SET title=$1, description=$2, url=$3, language=$4 WHERE id=$5 RETURNING *',
      [title, description, url, language, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete video
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM videos WHERE id = $1', [id]);
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
