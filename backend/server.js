
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
app.use(cors());
app.use(express.json());

// Check if MongoDB URI is properly configured
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI || mongoURI.includes('<username>') || mongoURI.includes('<password>')) {
  console.error('ERROR: MongoDB connection string is not properly configured!');
  console.error('Please update the .env file with your MongoDB Atlas credentials.');
  console.error('Current value:', mongoURI);
} else {
  // Connect to MongoDB
  mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      console.error('Please check your MongoDB credentials and network connection.');
    });
}

// Status route to check API health
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env: {
      nodeEnv: process.env.NODE_ENV,
      mongoDbConfigured: Boolean(mongoURI) && !mongoURI.includes('<username>') && !mongoURI.includes('<password>')
    }
  });
});

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/cylinders', cylinderRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Invoice API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
