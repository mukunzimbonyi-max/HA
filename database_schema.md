# Application Database Schema

This document outlines the current PostgreSQL database schema for the Health Assistance platform, including the new Chat features for real-time mentor-client communication.

## Tables

### 1. `users`
Core table for all user accounts including admins, mentors, and clients.
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR 255, UNIQUE)
- `email` (VARCHAR 255, UNIQUE)
- `password` (TEXT)
- `role` (VARCHAR 50) - 'client', 'mentor', 'admin'
- `profile_picture` (TEXT)
- `created_at` (TIMESTAMP)

### 2. `facilities`
GPS directory of pharmacies and hospitals.
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR 255)
- `type` (VARCHAR 50)
- `address` (TEXT)
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)
- `phone` (VARCHAR 50)
- `opening_hours` (TEXT)

### 3. `videos`
Educational video content.
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR 255)
- `url` (TEXT)
- `language` (VARCHAR 10)

### 4. `chats` (NEW)
Real-time messaging between clients and mentors.
- `id` (SERIAL PRIMARY KEY)
- `sender_id` (INTEGER REFERENCES users(id))
- `receiver_id` (INTEGER REFERENCES users(id))
- `message` (TEXT)
- `is_read` (BOOLEAN)
- `created_at` (TIMESTAMP)

### 5. `client_documents`
Medical charts, assessments, and reports submitted by clients.
- `id` (SERIAL PRIMARY KEY)
- `client_id` (INTEGER REFERENCES users(id))
- `file_url` (TEXT)
- `document_type` (VARCHAR 100)
- `description` (TEXT)
- `status` (VARCHAR 50)

### 6. `document_responses`
Feedback left by mentors on client documents.
- `id` (SERIAL PRIMARY KEY)
- `document_id` (INTEGER REFERENCES client_documents(id))
- `professional_id` (INTEGER REFERENCES users(id))
- `response_text` (TEXT)

### 7. `admission_status`
Overall mental health program admission status for clients.
- `id` (SERIAL PRIMARY KEY)
- `client_id` (INTEGER REFERENCES users(id))
- `status` (VARCHAR 50)
- `notes` (TEXT)

---

> Run `node init_db.js` in the `backend` directory if you ever need to reset the database to a clean state.
