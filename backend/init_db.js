const { pool } = require('./db');

const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log('Initializing database with new schema and seed data...');
    
    const sql = `
-- 1. User Accounts
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'client',
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Medical Facilities (Pharmacies & Hospitals)
CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'pharmacy',
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(50),
    opening_hours TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Educational Videos
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

-- 4. Platform Updates
CREATE TABLE IF NOT EXISTS updates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Psychologists & Experts
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

-- 6. Private Consultations (Chats)
CREATE TABLE IF NOT EXISTS private_chats (
    id SERIAL PRIMARY KEY,
    sender_id TEXT,
    receiver_id INTEGER REFERENCES psychologists(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Masterclass Cohorts
CREATE TABLE IF NOT EXISTS cohorts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Cohort Applications (Student Enrollment & Payments)
CREATE TABLE IF NOT EXISTS cohort_applications (
    id SERIAL PRIMARY KEY,
    cohort_id INTEGER REFERENCES cohorts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    motivation TEXT,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid'
    application_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Client Documents (Charts, Assessments, etc.)
CREATE TABLE IF NOT EXISTS client_documents (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    document_type VARCHAR(100), -- 'chart', 'assessment', 'report', etc.
    description TEXT,
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'reviewed', 'responded'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Document Responses (Feedback from Mental Health Professionals)
CREATE TABLE IF NOT EXISTS document_responses (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES client_documents(id) ON DELETE CASCADE,
    professional_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    response_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Client-Mentor Chats
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Client Admission Status
CREATE TABLE IF NOT EXISTS admission_status (
    id SERIAL PRIMARY KEY,
    client_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'admitted', 'pending', 'rejected'
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INITIAL SEED DATA
-- ==========================================

-- Reset cohorts and insert with specific IDs (4, 5, 6) to match the app's internal logic
TRUNCATE cohorts CASCADE;
INSERT INTO cohorts (id, name, description, start_date, status) VALUES 
(4, 'SRH Empowerment Cohort 1', 'Comprehensive SRH education for youth across Rwanda.', '2024-06-01', 'open'),
(5, 'Mental Health Resilience', 'Building emotional strength and community support.', '2024-07-15', 'open'),
(6, 'Healthy Relationships', 'Navigating boundaries, consent, and communication.', '2024-08-20', 'open');

-- Sync the ID sequence
SELECT setval('cohorts_id_seq', 6);

-- Reset Psychologists
TRUNCATE psychologists CASCADE;
-- Seed Psychologists
INSERT INTO psychologists (name, specialty, bio, image_url, availability, is_online) VALUES 
('Dr. Uwase Marie', 'Reproductive Health Specialist', 'Expert in adolescent SRH services with over 12 years of clinical experience.', 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=300&h=300', 'Mon - Fri, 08:00 - 17:00', true),
('Jean Pierre Nkurunziza', 'Clinical Psychologist', 'Specialized in youth mental wellness and trauma-informed care.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300', 'Tue - Sat, 10:00 - 19:00', true);

-- Seed Admin User (Jeremie)
INSERT INTO users (username, email, password, role) 
VALUES ('Jeremie', '22300970niyogisubizojeremie@gmail.com', '123456', 'admin')
ON CONFLICT (email) DO NOTHING;
    `;

    await client.query(sql);
    console.log('Database initialized successfully.');
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
