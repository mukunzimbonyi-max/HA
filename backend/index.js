const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Route
app.get('/', (req, res) => {
  res.send('HealthConnect API is running...');
});

const facilityRoutes = require('./routes/facilities');
const videoRoutes = require('./routes/videos');
const aiRoutes = require('./routes/ai');
const updateRoutes = require('./routes/updates');
const psychologistRoutes = require('./routes/psychologists');
const authRoutes = require('./routes/auth');
const cohortRoutes = require('./routes/cohorts');
const paymentRoutes = require('./routes/payments');
const mentalHealthRoutes = require('./routes/mental-health');
const contactRoutes = require('./routes/contact');

const adminRoutes = require('./routes/admin');

// API Routes
app.use('/api/facilities', facilityRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/psychologists', psychologistRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cohorts', cohortRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/mental-health', mentalHealthRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
