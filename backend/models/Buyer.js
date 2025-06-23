
const mongoose = require('mongoose');

const BuyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  gstin: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  stateCode: { type: String, required: true },
  buyerType: { 
    type: String, 
    enum: ['bottle', 'cylinder'], 
    required: true,
    default: 'bottle'
  }
}, { timestamps: true });

module.exports = mongoose.model('Buyer', BuyerSchema);
