
const mongoose = require('mongoose');

const CylinderSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  hsnSac: { 
    type: String, 
    required: true,
    default: '27111900',
    trim: true
  },
  defaultRate: { 
    type: Number, 
    required: true,
    min: 0
  },
  gstRate: { 
    type: Number, 
    required: true,
    default: 5,
    min: 0,
    max: 100
  },
  petBottlesRate: {
    type: Number,
    default: 0,
    min: 0
  }
}, { 
  timestamps: true,
  // Add this to make the returned data cleaner by excluding MongoDB-specific fields
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Ensure all numeric fields are properly cast to numbers
CylinderSchema.pre('save', function(next) {
  if (this.defaultRate) this.defaultRate = Number(this.defaultRate);
  if (this.gstRate) this.gstRate = Number(this.gstRate);
  if (this.petBottlesRate) this.petBottlesRate = Number(this.petBottlesRate);
  next();
});

module.exports = mongoose.model('Cylinder', CylinderSchema);
