
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

// Get all cylinder buyers
router.get('/', checkMongoConnection, async (req, res) => {
  try {
    console.log('Fetching all cylinder buyers');
    const buyers = await Buyer.find({ buyerType: 'cylinder' });
    console.log(`Found ${buyers.length} cylinder buyers`);
    res.json(buyers);
  } catch (error) {
    console.error('Error fetching cylinder buyers:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single cylinder buyer
router.get('/:gstin', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Fetching cylinder buyer with GSTIN: ${req.params.gstin}`);
    
    let buyer = null;
    
    if (req.params.gstin.match(/^[0-9a-fA-F]{24}$/)) {
      buyer = await Buyer.findOne({ _id: req.params.gstin, buyerType: 'cylinder' });
    }
    
    if (!buyer) {
      buyer = await Buyer.findOne({ gstin: req.params.gstin, buyerType: 'cylinder' });
    }
    
    if (!buyer) {
      console.log(`Cylinder buyer with GSTIN ${req.params.gstin} not found`);
      return res.status(404).json({ 
        message: 'Cylinder buyer not found', 
        requestedGstin: req.params.gstin 
      });
    }
    
    console.log('Cylinder buyer found:', buyer);
    res.json(buyer);
  } catch (error) {
    console.error(`Error fetching cylinder buyer ${req.params.gstin}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Create cylinder buyer
router.post('/', checkMongoConnection, async (req, res) => {
  try {
    console.log('Creating cylinder buyer with data:', req.body);
    
    if (!req.body.gstin || !req.body.gstin.trim()) {
      return res.status(400).json({ message: 'GSTIN is required and cannot be empty' });
    }
    
    if (!req.body.name || !req.body.name.trim()) {
      return res.status(400).json({ message: 'Name is required and cannot be empty' });
    }
    
    const buyerData = {
      gstin: req.body.gstin,
      name: req.body.name,
      address: req.body.address || '',
      state: req.body.state || 'Tamil Nadu',
      stateCode: req.body.stateCode || '33',
      buyerType: 'cylinder'
    };
    
    const buyer = new Buyer(buyerData);
    const newBuyer = await buyer.save();
    
    console.log('Created cylinder buyer:', newBuyer);
    res.status(201).json(newBuyer);
  } catch (error) {
    console.error('Error creating cylinder buyer:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate key error', 
        details: 'A cylinder buyer with this GSTIN already exists'
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Update cylinder buyer
router.put('/:gstin', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Updating cylinder buyer ${req.params.gstin} with:`, req.body);
    
    let buyer = null;
    
    if (req.params.gstin.match(/^[0-9a-fA-F]{24}$/)) {
      buyer = await Buyer.findOne({ _id: req.params.gstin, buyerType: 'cylinder' });
    }
    
    if (!buyer) {
      buyer = await Buyer.findOne({ gstin: req.params.gstin, buyerType: 'cylinder' });
    }
    
    if (!buyer) {
      console.log(`Cylinder buyer with GSTIN ${req.params.gstin} not found for update`);
      
      if (req.body.name && req.body.name.trim() !== '' && req.body.gstin && req.body.gstin.trim() !== '') {
        const newBuyer = new Buyer({
          gstin: req.body.gstin || req.params.gstin,
          name: req.body.name,
          address: req.body.address || '',
          state: req.body.state || 'Tamil Nadu',
          stateCode: req.body.stateCode || '33',
          buyerType: 'cylinder'
        });
        
        const createdBuyer = await newBuyer.save();
        return res.status(201).json({
          ...createdBuyer.toObject(),
          message: 'Cylinder buyer created as it did not exist'
        });
      }
      
      return res.status(404).json({ 
        message: 'Cylinder buyer not found',
        requestedGstin: req.params.gstin
      });
    }
    
    if (req.body.name !== undefined) buyer.name = req.body.name;
    if (req.body.address !== undefined) buyer.address = req.body.address;
    if (req.body.state !== undefined) buyer.state = req.body.state;
    if (req.body.stateCode !== undefined) buyer.stateCode = req.body.stateCode;
    if (req.body.gstin !== undefined) buyer.gstin = req.body.gstin;
    
    const updatedBuyer = await buyer.save();
    
    console.log('Updated cylinder buyer:', updatedBuyer);
    res.json(updatedBuyer);
  } catch (error) {
    console.error(`Error updating cylinder buyer ${req.params.gstin}:`, error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Delete cylinder buyer
router.delete('/:gstin', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Deleting cylinder buyer ${req.params.gstin}`);
    
    let result = null;
    
    if (req.params.gstin.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Buyer.findOneAndDelete({ _id: req.params.gstin, buyerType: 'cylinder' });
    }
    
    if (!result) {
      result = await Buyer.findOneAndDelete({ gstin: req.params.gstin, buyerType: 'cylinder' });
    }
    
    if (!result) {
      console.log(`Cylinder buyer with GSTIN ${req.params.gstin} not found for deletion`);
      return res.status(404).json({ 
        message: 'Cylinder buyer not found',
        requestedGstin: req.params.gstin
      });
    }
    
    console.log('Deleted cylinder buyer:', result);
    res.json({ message: 'Cylinder buyer deleted', deletedBuyer: result });
  } catch (error) {
    console.error(`Error deleting cylinder buyer ${req.params.gstin}:`, error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
