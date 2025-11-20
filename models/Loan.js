const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  loanTitle: {
    type: String,
    required: true,
    trim: true
  },
  loanCompany: {
    type: String,
    required: true,
    trim: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  bankLogo: {
    type: String,
    trim: true
  },
  loanDescription: {
    type: String,
    required: true,
    trim: true
  },
  loanQuote: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Loan', loanSchema);

