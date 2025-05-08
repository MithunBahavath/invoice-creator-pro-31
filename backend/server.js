
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const invoiceRoutes = require('./routes/invoiceRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const cylinderRoutes = require('./routes/cylinderRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Check if MongoDB URI is properly configured
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('ERROR: MongoDB connection string is not configured in .env file!');
  process.exit(1);
}

// Connect to MongoDB with improved error handling
mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Please check your MongoDB credentials and network connection.');
    console.error('URI format should be: mongodb+srv://username:password@cluster-url/database?options');
  });

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Status route to check API health
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env: {
      nodeEnv: process.env.NODE_ENV,
      mongoDbConfigured: Boolean(mongoURI),
      database: mongoose.connection.name || 'not connected'
    }
  });
});

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/cylinders', cylinderRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Invoice API is running - connected to MongoDB Atlas');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    error: 'Server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});
