const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all psychologists
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM psychologists ORDER BY is_online DESC, name ASC');
    res.json(result.rows);
  } catch (err) {
    console.warn('Database error, using mock psychologists.');
    res.json([
      { 
        id: 1, 
        name: 'Dr. Keza Aline', 
        specialty: 'Reproductive Health Specialist', 
        bio: 'Over 10 years experience in youth SRH counseling.',
        image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200',
        availability: 'Mon - Fri, 9:00 - 17:00',
        is_online: true
      },
      { 
        id: 2, 
        name: 'Mr. Mugisha Jean', 
        specialty: 'Clinical Psychologist', 
        bio: 'Specializing in trauma and adolescent mental health.',
        image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200',
        availability: 'Sat - Sun, 10:00 - 14:00',
        is_online: false
      }
    ]);
  }
});

// Post a message to a psychologist
router.post('/chat', async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO private_chats (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *',
      [sender_id, receiver_id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get chat history for a user and psychologist
router.get('/chat/:sender_id/:receiver_id', async (req, res) => {
  const { sender_id, receiver_id } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM private_chats WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at ASC',
      [sender_id, receiver_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;
