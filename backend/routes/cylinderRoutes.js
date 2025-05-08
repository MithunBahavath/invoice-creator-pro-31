
const express = require('express');
const router = express.Router();
const Cylinder = require('../models/Cylinder');
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

// Get all cylinders
router.get('/', checkMongoConnection, async (req, res) => {
  try {
    console.log('Fetching all cylinders');
    const cylinders = await Cylinder.find();
    console.log(`Found ${cylinders.length} cylinders`);
    res.json(cylinders);
  } catch (error) {
    console.error('Error fetching cylinders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single cylinder
router.get('/:id', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Fetching cylinder with ID: ${req.params.id}`);
    
    // First try finding by MongoDB ObjectId if it looks like one
    let cylinder = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      cylinder = await Cylinder.findById(req.params.id);
    }
    
    // If not found, try finding by the 'id' field
    if (!cylinder) {
      cylinder = await Cylinder.findOne({ id: req.params.id });
    }
    
    if (!cylinder) {
      console.log(`Cylinder with ID ${req.params.id} not found`);
      return res.status(404).json({ 
        message: 'Cylinder not found', 
        requestedId: req.params.id 
      });
    }
    
    console.log('Cylinder found:', cylinder);
    res.json(cylinder);
  } catch (error) {
    console.error(`Error fetching cylinder ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Create cylinder
router.post('/', checkMongoConnection, async (req, res) => {
  try {
    console.log('Creating cylinder with data:', req.body);
    
    // Generate a custom ID if not provided
    if (!req.body.id) {
      req.body.id = `CYL-${Date.now()}`;
      console.log('Generated ID for new cylinder:', req.body.id);
    }
    
    const cylinder = new Cylinder(req.body);
    const newCylinder = await cylinder.save();
    
    console.log('Created cylinder:', newCylinder);
    res.status(201).json(newCylinder);
  } catch (error) {
    console.error('Error creating cylinder:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate key error', 
        details: 'A cylinder with this ID already exists'
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Update cylinder
router.put('/:id', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Updating cylinder ${req.params.id} with:`, req.body);
    
    // First try to find the cylinder
    let cylinder = null;
    
    // Try finding by MongoDB ObjectId if it looks like one
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      cylinder = await Cylinder.findById(req.params.id);
    }
    
    // If not found, try finding by the 'id' field
    if (!cylinder) {
      cylinder = await Cylinder.findOne({ id: req.params.id });
    }
    
    if (!cylinder) {
      console.log(`Cylinder with ID ${req.params.id} not found for update`);
      return res.status(404).json({ 
        message: 'Cylinder not found',
        requestedId: req.params.id
      });
    }
    
    // Update the cylinder
    Object.keys(req.body).forEach(key => {
      cylinder[key] = req.body[key];
    });
    
    const updatedCylinder = await cylinder.save();
    
    console.log('Updated cylinder:', updatedCylinder);
    res.json(updatedCylinder);
  } catch (error) {
    console.error(`Error updating cylinder ${req.params.id}:`, error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Delete cylinder
router.delete('/:id', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Deleting cylinder ${req.params.id}`);
    
    let result = null;
    
    // Try deleting by MongoDB ObjectId if it looks like one
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Cylinder.findByIdAndDelete(req.params.id);
    }
    
    // If not found, try deleting by the 'id' field
    if (!result) {
      result = await Cylinder.findOneAndDelete({ id: req.params.id });
    }
    
    if (!result) {
      console.log(`Cylinder with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({ 
        message: 'Cylinder not found',
        requestedId: req.params.id
      });
    }
    
    console.log('Deleted cylinder:', result);
    res.json({ message: 'Cylinder deleted', deletedCylinder: result });
  } catch (error) {
    console.error(`Error deleting cylinder ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
