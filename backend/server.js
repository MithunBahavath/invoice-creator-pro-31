
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

// MongoDB Connection - Using a more robust approach
const connectToMongoDB = async () => {
  try {
    // Check if MongoDB URI is properly configured
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('ERROR: MongoDB connection string is not configured in .env file!');
      process.exit(1);
    }

    // Configure mongoose connection options
    const options = {
      dbName: 'billing',
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, avoid IPv6 issues
    };

    // Connect with robust error handling
    await mongoose.connect(process.env.MONGODB_URI, options);

    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log('📍 Network access: Your IP address has been whitelisted');

    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      // Don't exit the process on transient errors
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected, attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('Please check:');
    console.error('1. Your MongoDB credentials are correct');
    console.error('2. Your IP address is whitelisted in MongoDB Atlas Network Access');
    console.error('3. The MongoDB Atlas cluster is running');
    console.error('4. The connection string format is correct');
    
    // Exit with failure
    process.exit(1);
  }
};

// Try to connect to MongoDB
connectToMongoDB();

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
      mongoDbConfigured: Boolean(process.env.MONGODB_URI),
      database: mongoose.connection.db ? mongoose.connection.db.databaseName : 'not connected',
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
