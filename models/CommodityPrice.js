const mongoose = require('mongoose');

const commodityPriceSchema = new mongoose.Schema({
  commodityType: {
    type: String,
    required: true,
    enum: ['Silver', 'INR', 'Petrol', 'Diesel', 'LP Gas'],
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: 'per unit',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique combination of commodityType, state, and city
commodityPriceSchema.index({ commodityType: 1, state: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('CommodityPrice', commodityPriceSchema);

