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

// Submit application
router.post('/apply', async (req, res) => {
  const { cohort_id, user_id, full_name, email, motivation } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cohort_applications (cohort_id, user_id, full_name, email, motivation) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [cohort_id, user_id, full_name, email, motivation]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({ error: err.message || 'Database error' });
  }
});

// Get all applications (Admin)
router.get('/applications', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ca.*, ca.application_status as status, c.name as cohort_name 
      FROM cohort_applications ca 
      JOIN cohorts c ON ca.cohort_id = c.id 
      ORDER BY ca.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update application status (Admin)
router.put('/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE cohort_applications SET application_status = COALESCE($1, application_status), payment_status = COALESCE($2, payment_status) WHERE id = $3 RETURNING *',
      [status, payment_status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating application:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Approve application
router.post('/applications/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE cohort_applications SET application_status = \'approved\', payment_status = \'paid\' WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error approving application:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Reject application
router.post('/applications/:id/reject', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE cohort_applications SET application_status = \'rejected\' WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error rejecting application:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
