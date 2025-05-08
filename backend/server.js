
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
mongoose.connect(mongoURI, {
  dbName: 'billing', // Explicitly set the database name to 'billing'
  // Add these options for more reliable connections
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log('📍 Network access: Your IP address has been whitelisted');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Please check your MongoDB credentials and network connection.');
    console.error('URI format should be: mongodb+srv://username:password@cluster-url/database?options');
    console.error('Make sure your IP address is whitelisted in MongoDB Atlas Network Access settings.');
  });

// Add detailed logging middleware
app.use((req, res, next) => {
  const requestTime = new Date().toISOString();
  console.log(`${req.method} ${req.path} - ${requestTime}`);
  
  // Log request body for POST/PUT requests
  if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
    if (req.path.includes('/api/')) {
      const bodyPreview = JSON.stringify(req.body).substring(0, 200);
      console.log(`Request body: ${bodyPreview}${bodyPreview.length >= 200 ? '...' : ''}`);
    }
  }
  
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
      database: mongoose.connection.name || 'not connected',
      ipAddress: req.ip || 'unknown'
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
