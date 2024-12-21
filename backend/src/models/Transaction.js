// src/models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'exchange'], required: true },
  amount: { type: Number, required: true },
  fromCurrency: { type: String, enum: ['dinar', 'dollar'], required: true },
  toCurrency: { type: String, enum: ['dinar', 'dollar'] },
  note: { type: String, default: null }, // Add this field
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
