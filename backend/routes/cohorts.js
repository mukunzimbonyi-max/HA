const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Get all cohorts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cohorts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching cohorts:', err);
    // Fallback mock data
    res.json([
      { id: 1, name: 'SRH Empowerment Cohort 1', description: 'Comprehensive SRH education for youth across Rwanda. Focus on rights and healthy choices.', start_date: '2024-06-01', status: 'open' },
      { id: 2, name: 'Mental Health Resilience', description: 'Building emotional strength and community support systems in a safe space.', start_date: '2024-07-15', status: 'open' },
      { id: 3, name: 'Healthy Relationships', description: 'Navigating boundaries, consent, and effective communication with experts.', start_date: '2024-08-20', status: 'open' }
    ]);
  }
});

// Create a cohort (Admin only in real world, but open for now)
router.post('/', async (req, res) => {
  const { name, description, start_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cohorts (name, description, start_date) VALUES ($1, $2, $3) RETURNING *',
      [name, description, start_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating cohort:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
