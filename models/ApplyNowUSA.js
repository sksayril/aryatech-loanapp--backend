const mongoose = require('mongoose');

const applyNowUSASchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Ensure only one document exists for USA
applyNowUSASchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({ isActive: true });
  }
  return settings;
};

module.exports = mongoose.model('ApplyNowUSA', applyNowUSASchema);

