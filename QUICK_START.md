# 🚀 Quick Setup Guide - Mental Health Dashboards

## Prerequisites
- Node.js installed
- PostgreSQL database running
- Backend and frontend repositories cloned

## Step-by-Step Setup

### 1. Initialize Database Tables

```bash
cd backend
node init_db.js
```

This creates three new tables:
- `client_documents` - stores documents submitted by clients
- `document_responses` - stores professional feedback
- `admission_status` - tracks admission status

### 2. Start the Backend

```bash
cd backend
npm install  # if not done yet
npm start
```

Backend will run on `http://localhost:5000`

### 3. Start the Frontend

In a new terminal:

```bash
cd frontend
npm install  # if not done yet
npm run dev
```

Frontend will run on `http://localhost:5173` (or next available port)

### 4. Test the System

#### Create a Client Account
1. Navigate to `http://localhost:5173`
2. Go to `/auth`
3. Click "Create Account"
4. Select role: **Client**
5. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
6. Click "Sign Up"
7. ✅ Auto-redirected to **Client Dashboard** (`/client-dashboard`)

#### Create a Mental Health Professional Account
1. Navigate to `/auth`
2. Click "Create Account"
3. Select role: **Mentor** (Mental Health Professional)
4. Fill in:
   - Full Name: `Dr. Jane Smith`
   - Email: `jane@example.com`
   - Password: `password123`
5. Click "Sign Up"
6. ✅ Auto-redirected to **Mental Health Dashboard** (`/mental-health-dashboard`)

## 🎯 Test Workflow

### For Client:
1. Login as client
2. View admission status (should show "Pending")
3. Go to Documents tab
4. Click "Upload Document"
5. Select document type: "Assessment"
6. Add description: "My health assessment"
7. Choose a file
8. Click "Upload"
9. Document appears in list with status "submitted"

### For Mental Health Professional:
1. Login as mentor
2. See the new client in "Clients" tab
3. Go to "Pending Documents" tab
4. See the document uploaded by the client
5. Click "Review"
6. Write feedback: "Thank you for submitting this. Your assessment looks good."
7. Click "Send Response"
8. Go to "Clients" tab
9. Click "Set Status" on the client
10. Change status from "Pending" to "Admitted"
11. Add notes: "Welcome to our program"
12. Click "Save Status"

### Back in Client Dashboard:
1. Refresh the page
2. Admission status changes to "Admitted" ✅
3. Documents tab shows the document is "responded"

## 📱 Browser Access

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api`

## 🔍 Key Routes

### Client Routes
- `/client-dashboard` - Main client dashboard
- `/auth` - Login/Register

### Professional Routes
- `/mental-health-dashboard` - Professional dashboard
- `/auth` - Login/Register

### Admin Routes
- `/admin` - Admin dashboard (existing)
- `/auth` - Login/Register

## 🛠️ Troubleshooting

### "Backend not responding"
```bash
# Check if backend is running
curl http://localhost:5000
# Should show: "HealthConnect API is running..."
```

### "Database error"
```bash
# Reinitialize database
cd backend
node init_db.js
```

### "API endpoints not working"
```bash
# Check .env file has correct DATABASE_URL
# Check VITE_API_URL in frontend .env if custom port
```

### "Can't upload documents"
- Ensure backend is running
- Check file size (should be under 50MB)
- Check browser console for specific errors

## 📊 Features Summary

### Client Dashboard
✅ View admission status (Admitted/Pending/Rejected)  
✅ Upload documents  
✅ Track document status  
✅ View analytics (documents submitted/reviewed)  
✅ Responsive design  

### Mental Health Dashboard
✅ View all clients  
✅ Review pending documents  
✅ Provide detailed feedback  
✅ Set admission status  
✅ View engagement analytics  
✅ Search clients  
✅ Responsive design  

## 🎓 Learning Resources

For detailed information, see:
- `DASHBOARDS_GUIDE.md` - Complete feature documentation
- `backend/routes/mental-health.js` - API endpoint implementation
- `frontend/src/pages/ClientDashboard.jsx` - Client UI code
- `frontend/src/pages/MentalHealthDashboard.jsx` - Professional UI code

## 🚀 Next Steps

After setup, you can:
1. Customize dashboard colors in CSS variables
2. Add more document types
3. Implement file upload to cloud storage
4. Add real-time notifications
5. Create client-professional pairing system
6. Add video consultation features

---

**Need Help?**  
Check the browser console (F12) for error messages  
Verify all services are running  
Check database connection  
Review API responses in Network tab
