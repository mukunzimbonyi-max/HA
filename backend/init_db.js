const { pool } = require('./db');

const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log('Initializing database tables...');
    
    // Create Medical Facilities table (formerly pharmacies)
    await client.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'pharmacy', -- 'pharmacy' or 'hospital'
        address TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        phone VARCHAR(50),
        opening_hours TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Videos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        thumbnail TEXT,
        category VARCHAR(100),
        language VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Updates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS updates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        file_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'client',
        profile_picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Psychologists table
    await client.query(`
      CREATE TABLE IF NOT EXISTS psychologists (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty TEXT,
        bio TEXT,
        image_url TEXT,
        availability TEXT,
        is_online BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Private Chats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS private_chats (
        id SERIAL PRIMARY KEY,
        sender_id TEXT, -- User ID (could be session or random for now)
        receiver_id INTEGER REFERENCES psychologists(id),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Cohorts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cohorts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

if (require.main === module) {
  initDb().then(() => process.exit());
}

module.exports = initDb;
