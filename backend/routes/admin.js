const express = require('express');
const router = express.Router();
const db = require('../db');

// Ensure 'status' column exists in 'users' table
const ensureStatusColumn = async () => {
  try {
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'`);
  } catch (err) {
    console.error('Error adding status column:', err);
  }
};
ensureStatusColumn();

// GET all users
router.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, role, profile_picture, created_at, status FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE a user
router.delete('/users/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// SUSPEND/ACTIVATE a user
router.put('/users/:id/suspend', async (req, res) => {
  const { status } = req.body; // 'suspended' or 'active'
  try {
    await db.query('UPDATE users SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ message: `User ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await db.query('SELECT COUNT(*) FROM users');
    const roles = await db.query('SELECT role, COUNT(*) FROM users GROUP BY role');
    const recentSignups = await db.query(`SELECT DATE(created_at) as date, COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days' GROUP BY DATE(created_at) ORDER BY date`);
    const statusQuery = await db.query('SELECT status, COUNT(*) FROM users GROUP BY status');

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      roles: roles.rows,
      recentSignups: recentSignups.rows,
      statuses: statusQuery.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
