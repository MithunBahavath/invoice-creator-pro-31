
const express = require('express');
const router = express.Router();
const Cylinder = require('../models/Cylinder');

// Get all cylinders
router.get('/', async (req, res) => {
  try {
    const cylinders = await Cylinder.find();
    res.json(cylinders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single cylinder
router.get('/:id', async (req, res) => {
  try {
    const cylinder = await Cylinder.findOne({ id: req.params.id });
    if (!cylinder) {
      return res.status(404).json({ message: 'Cylinder not found' });
    }
    res.json(cylinder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create cylinder
router.post('/', async (req, res) => {
  const cylinder = new Cylinder(req.body);
  try {
    const newCylinder = await cylinder.save();
    res.status(201).json(newCylinder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update cylinder
router.put('/:id', async (req, res) => {
  try {
    const updatedCylinder = await Cylinder.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedCylinder) {
      return res.status(404).json({ message: 'Cylinder not found' });
    }
    res.json(updatedCylinder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete cylinder
router.delete('/:id', async (req, res) => {
  try {
    const cylinder = await Cylinder.findOneAndDelete({ id: req.params.id });
    if (!cylinder) {
      return res.status(404).json({ message: 'Cylinder not found' });
    }
    res.json({ message: 'Cylinder deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
