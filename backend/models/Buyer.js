
const mongoose = require('mongoose');

const BuyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  gstin: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  stateCode: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Buyer', BuyerSchema);
