
const mongoose = require('mongoose');

const CylinderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hsnSac: { type: String, required: true },
  defaultRate: { type: Number, required: true },
  gstRate: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Cylinder', CylinderSchema);
