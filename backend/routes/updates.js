const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all updates
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM updates ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.warn('Database error, using mock updates.');
    res.json([
      { id: 1, title: 'Biannual Masterclass Registration Open', content: 'Our next cohort on SRH and Mental Health is now accepting registrations. Join over 500 youth across Rwanda.', created_at: new Date() },
      { id: 2, title: 'New Partner Clinics in Kigali', content: 'We are excited to announce 5 new clinics joining our GPS directory this month.', created_at: new Date() }
    ]);
  }
});

// Add new update
router.post('/', async (req, res) => {
  const { title, content, file_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO updates (title, content, file_url) VALUES ($1, $2, $3) RETURNING *',
      [title, content, file_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update news entry
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, file_url } = req.body;
  try {
    const result = await db.query(
      'UPDATE updates SET title=$1, content=$2, file_url=$3 WHERE id=$4 RETURNING *',
      [title, content, file_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete update
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM updates WHERE id = $1', [id]);
    res.json({ message: 'Update deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
