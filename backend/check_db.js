require('dotenv').config();
const { pool } = require('./db');

async function check() {
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Tables:', res.rows.map(r => r.table_name));
    
    if (res.rows.some(r => r.table_name === 'facilities')) {
      const countRes = await pool.query('SELECT COUNT(*) FROM facilities');
      console.log('Facility Count:', countRes.rows[0].count);
    } else {
      console.log('Table "facilities" does NOT exist.');
    }
  } catch (e) {
    console.error('Check Error:', e.message);
  } finally {
    process.exit();
  }
}

check();
