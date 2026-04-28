const express = require('express');
const router = express.Router();
const db = require('../db');

// Create or update client's admission status
router.post('/admission-status', async (req, res) => {
  const { client_id, status, notes } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO admission_status (client_id, status, notes, updated_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (client_id) DO UPDATE SET
       status = $2, notes = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [client_id, status, notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get admission status for a client
router.get('/admission-status/:client_id', async (req, res) => {
  const { client_id } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM admission_status WHERE client_id = $1',
      [client_id]
    );
    if (result.rows.length === 0) {
      return res.json({ status: 'pending', notes: '' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Upload document/chart from client
router.post('/submit-document', async (req, res) => {
  const { client_id, file_url, document_type, description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO client_documents (client_id, file_url, document_type, description, status)
       VALUES ($1, $2, $3, $4, 'submitted')
       RETURNING *`,
      [client_id, file_url, document_type, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all documents for a professional to review
router.get('/documents/pending', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT cd.*, u.username, u.email 
       FROM client_documents cd
       JOIN users u ON cd.client_id = u.id
       WHERE cd.status = 'submitted'
       ORDER BY cd.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get documents for a specific client
router.get('/documents/client/:client_id', async (req, res) => {
  const { client_id } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM client_documents 
       WHERE client_id = $1
       ORDER BY created_at DESC`,
      [client_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add response/feedback to a document
router.post('/document-response', async (req, res) => {
  const { document_id, professional_id, response_text, status } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO document_responses (document_id, professional_id, response_text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [document_id, professional_id, response_text]
    );

    // Update document status
    await db.query(
      'UPDATE client_documents SET status = $1 WHERE id = $2',
      [status, document_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get responses for a document
router.get('/document-responses/:document_id', async (req, res) => {
  const { document_id } = req.params;
  try {
    const result = await db.query(
      `SELECT dr.*, u.username 
       FROM document_responses dr
       LEFT JOIN users u ON dr.professional_id = u.id
       WHERE dr.document_id = $1
       ORDER BY dr.created_at DESC`,
      [document_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get analytics for a client
router.get('/analytics/:client_id', async (req, res) => {
  const { client_id } = req.params;
  try {
    const documents = await db.query(
      'SELECT COUNT(*) as total_submitted FROM client_documents WHERE client_id = $1',
      [client_id]
    );
    
    const responses = await db.query(
      `SELECT COUNT(DISTINCT cd.id) as total_reviewed 
       FROM document_responses dr
       JOIN client_documents cd ON dr.document_id = cd.id
       WHERE cd.client_id = $1`,
      [client_id]
    );

    const admissionStatus = await db.query(
      'SELECT status FROM admission_status WHERE client_id = $1',
      [client_id]
    );

    res.json({
      documents_submitted: parseInt(documents.rows[0]?.total_submitted || 0),
      documents_reviewed: parseInt(responses.rows[0]?.total_reviewed || 0),
      admission_status: admissionStatus.rows[0]?.status || 'pending'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all clients for a mental health professional
router.get('/clients', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT u.id, u.username, u.email, u.profile_picture, 
              COUNT(cd.id) as documents_count,
              MAX(cd.created_at) as last_submission
       FROM users u
       LEFT JOIN client_documents cd ON u.id = cd.client_id
       WHERE u.role = 'client'
       GROUP BY u.id, u.username, u.email, u.profile_picture
       ORDER BY last_submission DESC NULLS LAST`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all mentors
router.get('/mentors', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, username, email, profile_picture FROM users WHERE role = 'mentor'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get chats between two users
router.get('/chats/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM chats 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [user1, user2]
    );
    // Mark as read
    await db.query(
      `UPDATE chats SET is_read = true WHERE sender_id = $2 AND receiver_id = $1`,
      [user1, user2]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Send a chat message
router.post('/chats', async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO chats (sender_id, receiver_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [sender_id, receiver_id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
