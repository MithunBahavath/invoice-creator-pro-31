
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
    const cylinders = await Cylinder.find();
    res.json(cylinders);
  } catch (error) {
    console.error('Error fetching cylinders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single cylinder
router.get('/:id', checkMongoConnection, async (req, res) => {
  try {
    const cylinder = await Cylinder.findOne({ id: req.params.id });
    if (!cylinder) {
      return res.status(404).json({ 
        message: 'Cylinder not found', 
        requestedId: req.params.id 
      });
    }
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
    
    if (!req.body.id) {
      return res.status(400).json({ message: 'Cylinder ID is required' });
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
    
    const updatedCylinder = await Cylinder.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCylinder) {
      return res.status(404).json({ 
        message: 'Cylinder not found',
        requestedId: req.params.id
      });
    }
    
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
    
    const cylinder = await Cylinder.findOneAndDelete({ id: req.params.id });
    if (!cylinder) {
      return res.status(404).json({ 
        message: 'Cylinder not found',
        requestedId: req.params.id
      });
    }
    
    console.log('Deleted cylinder:', cylinder);
    res.json({ message: 'Cylinder deleted', deletedCylinder: cylinder });
  } catch (error) {
    console.error(`Error deleting cylinder ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
