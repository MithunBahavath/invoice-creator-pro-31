
const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
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

// Get all invoices
router.get('/', checkMongoConnection, async (req, res) => {
  try {
    console.log('Fetching all invoices');
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    console.log(`Found ${invoices.length} invoices`);
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single invoice
router.get('/:id', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Fetching invoice with ID: ${req.params.id}`);
    
    // First try finding by MongoDB ObjectId if it looks like one
    let invoice = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      invoice = await Invoice.findById(req.params.id);
    }
    
    // If not found, try finding by the 'id' field
    if (!invoice) {
      invoice = await Invoice.findOne({ id: req.params.id });
    }
    
    if (!invoice) {
      console.log(`Invoice with ID ${req.params.id} not found`);
      return res.status(404).json({ 
        message: 'Invoice not found', 
        requestedId: req.params.id 
      });
    }
    
    console.log('Invoice found');
    res.json(invoice);
  } catch (error) {
    console.error(`Error fetching invoice ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Create invoice
router.post('/', checkMongoConnection, async (req, res) => {
  try {
    console.log('Creating invoice with data:', { 
      id: req.body.id,
      invoiceNo: req.body.invoiceNo,
      buyerName: req.body.buyerName
    });
    
    if (!req.body.id) {
      return res.status(400).json({ message: 'Invoice ID is required' });
    }
    
    const invoice = new Invoice(req.body);
    const newInvoice = await invoice.save();
    
    console.log('Created invoice:', {
      id: newInvoice.id,
      invoiceNo: newInvoice.invoiceNo
    });
    
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate key error', 
        details: 'An invoice with this ID already exists'
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Update invoice
router.put('/:id', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Updating invoice ${req.params.id}`);
    
    // Try finding the invoice
    let invoice = null;
    
    // Try finding by MongoDB ObjectId if it looks like one
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      invoice = await Invoice.findById(req.params.id);
    }
    
    // If not found, try finding by the 'id' field
    if (!invoice) {
      invoice = await Invoice.findOne({ id: req.params.id });
    }
    
    if (!invoice) {
      console.log(`Invoice with ID ${req.params.id} not found for update`);
      return res.status(404).json({ 
        message: 'Invoice not found',
        requestedId: req.params.id
      });
    }
    
    // Update the invoice
    Object.keys(req.body).forEach(key => {
      invoice[key] = req.body[key];
    });
    
    const updatedInvoice = await invoice.save();
    
    console.log('Updated invoice:', {
      id: updatedInvoice.id,
      invoiceNo: updatedInvoice.invoiceNo
    });
    
    res.json(updatedInvoice);
  } catch (error) {
    console.error(`Error updating invoice ${req.params.id}:`, error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.message 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Delete invoice
router.delete('/:id', checkMongoConnection, async (req, res) => {
  try {
    console.log(`Deleting invoice ${req.params.id}`);
    
    let result = null;
    
    // Try deleting by MongoDB ObjectId if it looks like one
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Invoice.findByIdAndDelete(req.params.id);
    }
    
    // If not found, try deleting by the 'id' field
    if (!result) {
      result = await Invoice.findOneAndDelete({ id: req.params.id });
    }
    
    if (!result) {
      console.log(`Invoice with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({ 
        message: 'Invoice not found',
        requestedId: req.params.id
      });
    }
    
    console.log('Deleted invoice:', {
      id: result.id,
      invoiceNo: result.invoiceNo
    });
    
    res.json({ 
      message: 'Invoice deleted', 
      deletedInvoice: {
        id: result.id,
        invoiceNo: result.invoiceNo
      }
    });
  } catch (error) {
    console.error(`Error deleting invoice ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
