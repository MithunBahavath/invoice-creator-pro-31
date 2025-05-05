
const express = require('express');
const router = express.Router();
const Buyer = require('../models/Buyer');

// Get all buyers
router.get('/', async (req, res) => {
  try {
    const buyers = await Buyer.find();
    res.json(buyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single buyer
router.get('/:gstin', async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ gstin: req.params.gstin });
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    res.json(buyer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create buyer
router.post('/', async (req, res) => {
  const buyer = new Buyer(req.body);
  try {
    const newBuyer = await buyer.save();
    res.status(201).json(newBuyer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update buyer
router.put('/:gstin', async (req, res) => {
  try {
    const updatedBuyer = await Buyer.findOneAndUpdate(
      { gstin: req.params.gstin },
      req.body,
      { new: true }
    );
    if (!updatedBuyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    res.json(updatedBuyer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete buyer
router.delete('/:gstin', async (req, res) => {
  try {
    const buyer = await Buyer.findOneAndDelete({ gstin: req.params.gstin });
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    res.json({ message: 'Buyer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
