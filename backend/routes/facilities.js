const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all facilities
router.get('/', async (req, res) => {
  const { type } = req.query;
  try {
    let query = 'SELECT * FROM facilities';
    let params = [];
    if (type) {
      query += ' WHERE type = $1';
      params.push(type);
    }
    query += ' ORDER BY name ASC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Search facilities nearby
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 10, type } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    let typeFilter = type ? 'AND type = $4' : '';
    const query = `
      SELECT *, (
        6371 * acos (
          cos ( radians($1) )
          * cos( radians( latitude ) )
          * cos( radians( longitude ) - radians($2) )
          + sin ( radians($1) )
          * sin( radians( latitude ) )
        )
      ) AS distance
      FROM facilities
      WHERE (
        6371 * acos (
          cos ( radians($1) )
          * cos( radians( latitude ) )
          * cos( radians( longitude ) - radians($2) )
          + sin ( radians($1) )
          * sin( radians( latitude ) )
        )
      ) < $3 ${typeFilter}
      ORDER BY distance;
    `;
    
    let params = [lat, lng, radius];
    if (type) params.push(type);

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.warn('Database not available, using mock data for demo.');
    
    // Mock Data for Demo
    const mockFacilities = [
      { id: 101, name: 'Kigali City Pharmacy', type: 'pharmacy', address: 'KN 2 Ave, Kigali', latitude: -1.9441, longitude: 30.0619, phone: '+250 788 000 000', opening_hours: '24/7' },
      { id: 102, name: 'King Faisal Hospital', type: 'hospital', address: 'KG 544 St, Kigali', latitude: -1.9413, longitude: 30.0934, phone: '+250 252 588 888', opening_hours: '24/7' },
      { id: 103, name: 'Trust Pharmacy', type: 'pharmacy', address: 'Kimironko Road, Kigali', latitude: -1.9350, longitude: 30.1250, phone: '+250 788 333 444', opening_hours: '07:00 - 22:00' },
      { id: 104, name: 'CHUK Hospital', type: 'hospital', address: 'KN 4 Ave, Kigali', latitude: -1.9450, longitude: 30.0600, phone: '+250 252 575 462', opening_hours: '24/7' }
    ];

    let filtered = mockFacilities;
    if (type && type !== 'all') {
      filtered = mockFacilities.filter(f => f.type === type);
    }
    
    res.json(filtered);
  }
});

// Add new facility
router.post('/', async (req, res) => {
  const { name, type, address, latitude, longitude, phone, opening_hours } = req.body;
  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude coordinates' });
    }

    const result = await db.query(
      'INSERT INTO facilities (name, type, address, latitude, longitude, phone, opening_hours) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, type, address, lat, lng, phone, opening_hours]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update facility
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, address, latitude, longitude, phone, opening_hours } = req.body;
  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const result = await db.query(
      'UPDATE facilities SET name=$1, type=$2, address=$3, latitude=$4, longitude=$5, phone=$6, opening_hours=$7 WHERE id=$8 RETURNING *',
      [name, type, address, lat, lng, phone, opening_hours, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete facility
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM facilities WHERE id = $1', [id]);
    res.json({ message: 'Facility deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
