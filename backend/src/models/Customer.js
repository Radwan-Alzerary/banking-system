// src/models/Customer.js
const mongoose = require('mongoose');

const SafeSchema = new mongoose.Schema({
  currency: { type: String, enum: ['dinar', 'dollar'], required: true },
  balance: { type: Number, default: 0 },
});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  avatar: { type: String },
  safes: {
    dinar: { currency: { type: String, default: 'dinar' }, balance: { type: Number, default: 0 } },
    dollar: { currency: { type: String, default: 'dollar' }, balance: { type: Number, default: 0 } },
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
