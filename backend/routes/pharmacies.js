const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all pharmacies
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pharmacies ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Search pharmacies nearby (Basic implementation using lat/lng bounding box or distance)
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 5 } = req.query; // radius in km
  
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    // Simple Haversine formula for distance calculation in SQL
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
      FROM pharmacies
      WHERE (
        6371 * acos (
          cos ( radians($1) )
          * cos( radians( latitude ) )
          * cos( radians( longitude ) - radians($2) )
          + sin ( radians($1) )
          * sin( radians( latitude ) )
        )
      ) < $3
      ORDER BY distance;
    `;
    const result = await db.query(query, [lat, lng, radius]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
