# Mental Health Dashboards Implementation Guide

## Overview

This implementation provides two complementary dashboards for a mental health care platform:

1. **Client Dashboard** - For patients/clients to manage their health journey
2. **Mental Health Professional Dashboard** - For therapists/counselors to review and manage client care

---

## 🏥 Client Dashboard

**Route:** `/client-dashboard`  
**Accessible to:** Users with `role: 'client'`

### Features:

#### 1. **Admission Status Display**
- Shows current admission status with visual indicator:
  - ✅ **Admitted** (Green) - Client has been approved
  - ⏳ **Pending** (Amber) - Waiting for professional review
  - ❌ **Rejected** (Red) - Application not approved
- Status is set by mental health professionals

#### 2. **Overview Tab**
Shows key statistics:
- **Documents Submitted** - Total number of documents uploaded
- **Documents Reviewed** - Number that have been reviewed by professionals
- **Review Rate** - Percentage of documents reviewed

#### 3. **Documents Tab**
- Upload documents (assessments, charts, reports, etc.)
- View all submitted documents with their status
- Add descriptions to each document
- Track which documents have been reviewed/responded to
- See submission dates

#### 4. **Document Upload Modal**
- Select document type (assessment, chart, report, other)
- Add description
- Upload file
- Real-time feedback on upload success

### How to Use:
1. Login with a client account (role: client)
2. You'll be automatically redirected to `/client-dashboard`
3. View your admission status in the prominent status card
4. Click the "Upload Document" button to submit documents for professional review
5. Monitor your progress in the Overview tab

---

## 👨‍⚕️ Mental Health Professional Dashboard

**Route:** `/mental-health-dashboard`  
**Accessible to:** Users with `role: 'mentor'`

### Features:

#### 1. **Overview Statistics**
- **Total Clients** - Number of clients assigned
- **Pending Reviews** - Documents awaiting professional response
- **Response Rate** - Percentage of clients you're actively engaging with

#### 2. **Clients Tab**
- View all assigned clients
- Search clients by name or email
- See number of documents each client has submitted
- Track last submission date
- **Set Admission Status** button to approve/reject clients

#### 3. **Pending Documents Tab**
- View all documents waiting for review
- Organized with client information
- Quick action "Review" button for each document
- Badge showing document type (assessment, chart, etc.)
- Color-coded by status

#### 4. **Document Review Panel**
When you click "Review" on a document:
- View client name and document type
- See document description
- Preview or download the document file
- Write detailed feedback/recommendations
- Submit response to client

#### 5. **Admission Status Panel**
When you click "Set Status" on a client:
- Select status: Pending, Admitted, or Rejected
- Add detailed notes/recommendations
- Provide clinical feedback to the client

### Workflow Example:
1. Login as a mental health professional (role: mentor)
2. You'll see the Mental Health Professional Dashboard
3. Go to "Pending Documents" tab to see documents awaiting review
4. Click "Review" on a document
5. Read the description and view the client's submission
6. Write your professional response/feedback
7. Click "Send Response"
8. Go to "Clients" tab to manage admission status
9. Click "Set Status" on a client to admit/reject/mark as pending

---

## 🗄️ Database Schema

### New Tables

#### `client_documents`
```sql
- id (PRIMARY KEY)
- client_id (FOREIGN KEY → users)
- file_url
- document_type (assessment, chart, report, other)
- description
- status (submitted, reviewed, responded)
- created_at
- updated_at
```

#### `document_responses`
```sql
- id (PRIMARY KEY)
- document_id (FOREIGN KEY → client_documents)
- professional_id (FOREIGN KEY → users)
- response_text
- created_at
```

#### `admission_status`
```sql
- id (PRIMARY KEY)
- client_id (UNIQUE FOREIGN KEY → users)
- status (pending, admitted, rejected)
- notes
- updated_at
```

---

## 🔄 API Endpoints

### Mental Health Routes (`/api/mental-health`)

#### Admission Status
```
POST /admission-status
  { client_id, status, notes }
  
GET /admission-status/:client_id
```

#### Document Management
```
POST /submit-document
  { client_id, file_url, document_type, description }
  
GET /documents/pending

GET /documents/client/:client_id

POST /document-response
  { document_id, professional_id, response_text, status }
  
GET /document-responses/:document_id
```

#### Analytics
```
GET /analytics/:client_id
  Returns: { documents_submitted, documents_reviewed, admission_status }

GET /clients
  Returns: All clients with document counts and last submission date
```

---

## 🚀 Setup Instructions

### 1. Initialize Database
Run the database initialization to create new tables:
```bash
cd backend
node init_db.js
```

This will create:
- `client_documents` table
- `document_responses` table
- `admission_status` table

### 2. Start Backend
```bash
cd backend
npm start
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Test the System

#### Create a Client Account:
1. Go to `/auth`
2. Click "Create Account"
3. Select role: **Client**
4. Fill in credentials
5. You'll be redirected to Client Dashboard

#### Create a Mental Health Professional Account:
1. Go to `/auth`
2. Click "Create Account"
3. Select role: **Mentor**
4. Fill in credentials
5. You'll be redirected to Mental Health Professional Dashboard

---

## 💡 Key Features

### For Clients:
- 📤 **Easy Document Upload** - Simple interface to submit assessments, charts, and reports
- 📊 **Progress Tracking** - See how many documents have been reviewed
- 🎯 **Status Visibility** - Know your admission status at a glance
- 📝 **Detailed History** - Track all submitted documents and their status

### For Mental Health Professionals:
- 👥 **Client Management** - Centralized view of all assigned clients
- 📋 **Pending Reviews** - Never miss a document needing review
- 💬 **Direct Feedback** - Respond to documents with clinical recommendations
- ✅ **Decision Making** - Approve, reject, or mark applications as pending
- 📊 **Analytics** - Track your engagement and response rates

---

## 🎨 UI/UX Highlights

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Support** - Uses CSS variables for theme switching
- **Smooth Animations** - Framer Motion for engaging interactions
- **Status Indicators** - Color-coded status for quick recognition
- **Accessible Modals** - Clean panels for focused interactions
- **Real-time Updates** - Fetch latest data when needed

---

## 🔐 Authentication Flow

1. Users register/login at `/auth`
2. Choose role: Client, Mentor, or Admin
3. Auth API validates credentials
4. User data stored in localStorage
5. App redirects based on role:
   - `admin` → `/admin`
   - `mentor` → `/mental-health-dashboard`
   - `client` → `/client-dashboard`
   - others → `/home`

---

## 📱 Mobile Responsiveness

Both dashboards are fully responsive:
- Grid layouts adapt to screen size
- Modals work on all screen sizes
- Touch-friendly buttons and interactions
- Readable text at all breakpoints

---

## 🚀 Future Enhancements

Potential features to add:
- Video consultations between clients and professionals
- Real-time notifications for new documents
- File upload with progress tracking
- Document templates for clients
- Scheduling system for appointments
- Multi-language support for professional notes
- Export/download client reports
- Integration with medical imaging systems
- Telemedicine video calls

---

## ❓ Troubleshooting

### Dashboard not loading?
- Check if user is logged in: `localStorage.getItem('user')`
- Verify user role matches route (client → client-dashboard, mentor → mental-health-dashboard)
- Check browser console for API errors

### Documents not uploading?
- Ensure backend is running on port 5000
- Check VITE_API_URL environment variable in frontend
- Verify file size is within limits

### Database errors?
- Run `node init_db.js` to initialize tables
- Check database connection string in `.env`
- Verify PostgreSQL is running

---

## 📞 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify backend is running: `http://localhost:5000`
3. Check database tables were created: `node backend/init_db.js`
4. Review API endpoints in `backend/routes/mental-health.js`

---

**Version:** 1.0  
**Last Updated:** 2024
