
const express = require('express');
const router = express.Router();
const Cylinder = require('../models/Cylinder');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

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
    const cylinders = await Cylinder.find().sort({ updatedAt: -1 });
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
    
    // Basic validation
    if (!req.body.name || req.body.name.trim() === '') {
      return res.status(400).json({ message: 'Cylinder name is required and cannot be empty' });
    }
    
    // Generate a custom ID that's more readable and unique
    const cylinderId = req.body.id || `CYL-${Date.now().toString().slice(-6)}-${uuidv4().slice(0, 4)}`;
    
    // Prepare cylinder data with proper number conversion
    const cylinderData = {
      id: cylinderId,
      name: req.body.name.trim(),
      hsnSac: req.body.hsnSac || '27111900',
      defaultRate: parseFloat(req.body.defaultRate || 0),
      gstRate: parseFloat(req.body.gstRate || 5)
    };
    
    // Create the new document
    const cylinder = new Cylinder(cylinderData);
    
    // Save with explicit error handling
    const newCylinder = await cylinder.save();
    
    console.log('Created cylinder with ID:', newCylinder.id);
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
    
    // Basic validation
    if (req.body.name !== undefined && req.body.name.trim() === '') {
      return res.status(400).json({ message: 'Cylinder name cannot be empty' });
    }
    
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
      
      // If cylinder doesn't exist and we have valid data, create it with the specified ID
      if (req.body.name && req.body.name.trim() !== '') {
        const newCylinder = new Cylinder({
          id: req.params.id,
          name: req.body.name.trim(),
          hsnSac: req.body.hsnSac || '27111900',
          defaultRate: parseFloat(req.body.defaultRate || 0),
          gstRate: parseFloat(req.body.gstRate || 5)
        });
        
        const createdCylinder = await newCylinder.save();
        console.log('Created new cylinder during update:', createdCylinder);
        return res.status(201).json({
          ...createdCylinder.toObject(),
          message: 'Cylinder created as it did not exist'
        });
      }
      
      return res.status(404).json({ 
        message: 'Cylinder not found',
        requestedId: req.params.id
      });
    }
    
    // Update the cylinder with proper number conversion
    if (req.body.name !== undefined) {
      cylinder.name = req.body.name.trim();
    }
    if (req.body.defaultRate !== undefined) {
      cylinder.defaultRate = parseFloat(req.body.defaultRate);
    }
    if (req.body.gstRate !== undefined) {
      cylinder.gstRate = parseFloat(req.body.gstRate);
    }
    if (req.body.hsnSac !== undefined) {
      cylinder.hsnSac = req.body.hsnSac;
    }
    
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
