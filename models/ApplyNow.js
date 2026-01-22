const mongoose = require('mongoose');

const applyNowSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure only one document exists
applyNowSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({ isActive: true });
  }
  return settings;
};

module.exports = mongoose.model('ApplyNow', applyNowSchema);
