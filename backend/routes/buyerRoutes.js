
const express = require('express');
const router = express.Router();
const Buyer = require('../models/Buyer');
const mongoose = require('mongoose');

// Check MongoDB connection middleware
const checkMongoConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ 
      message: 'Database connection is not established',
      readyState: mongoose.connection.readyState,
      hint: 'Check your MongoDB connection string in .env file' 
    });
  }
  next();
};

// Get all buyers
router.get('/', checkMongoConnection, async (req, res) => {
  try {
    console.log('Fetching all buyers');
    const buyers = await Buyer.find();
    console.log(`Found ${buyers.length} buyers`);
    res.json(buyers);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single buyer
router.get('/:gstin', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Fetching buyer with GSTIN: ${req.params.gstin}`);
    const buyer = await Buyer.findOne({ gstin: req.params.gstin });
    
    if (!buyer) {
      console.log(`Buyer with GSTIN ${req.params.gstin} not found`);
      return res.status(404).json({ 
        message: 'Buyer not found', 
        requestedGstin: req.params.gstin 
      });
    }
    
    console.log('Buyer found:', buyer);
    res.json(buyer);
  } catch (error) {
    console.error(`Error fetching buyer ${req.params.gstin}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Create buyer
router.post('/', checkMongoConnection, async (req, res) => {
  try {
    console.log('Creating buyer with data:', req.body);
    
    if (!req.body.gstin) {
      return res.status(400).json({ message: 'GSTIN is required' });
    }
    
    if (!req.body.name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const buyer = new Buyer(req.body);
    const newBuyer = await buyer.save();
    
    console.log('Created buyer:', newBuyer);
    res.status(201).json(newBuyer);
  } catch (error) {
    console.error('Error creating buyer:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate key error', 
        details: 'A buyer with this GSTIN already exists'
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Update buyer
router.put('/:gstin', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Updating buyer ${req.params.gstin} with:`, req.body);
    
    const buyer = await Buyer.findOne({ gstin: req.params.gstin });
    
    if (!buyer) {
      console.log(`Buyer with GSTIN ${req.params.gstin} not found for update`);
      return res.status(404).json({ 
        message: 'Buyer not found',
        requestedGstin: req.params.gstin
      });
    }
    
    // Update the buyer
    Object.keys(req.body).forEach(key => {
      buyer[key] = req.body[key];
    });
    
    const updatedBuyer = await buyer.save();
    
    console.log('Updated buyer:', updatedBuyer);
    res.json(updatedBuyer);
  } catch (error) {
    console.error(`Error updating buyer ${req.params.gstin}:`, error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Delete buyer
router.delete('/:gstin', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Deleting buyer ${req.params.gstin}`);
    
    const result = await Buyer.findOneAndDelete({ gstin: req.params.gstin });
    
    if (!result) {
      console.log(`Buyer with GSTIN ${req.params.gstin} not found for deletion`);
      return res.status(404).json({ 
        message: 'Buyer not found',
        requestedGstin: req.params.gstin
      });
    }
    
    console.log('Deleted buyer:', result);
    res.json({ message: 'Buyer deleted', deletedBuyer: result });
  } catch (error) {
    console.error(`Error deleting buyer ${req.params.gstin}:`, error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
