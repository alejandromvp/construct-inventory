const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['entry', 'exit'],
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    required: true
  },
  reference: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
//coments
module.exports = mongoose.model('Transaction', TransactionSchema);