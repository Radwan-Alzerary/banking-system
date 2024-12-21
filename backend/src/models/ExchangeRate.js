// src/models/ExchangeRate.js
const mongoose = require('mongoose');

const ExchangeRateSchema = new mongoose.Schema({
  dinarToDollar: { type: Number, default: 0.33 },
  dollarToDinar: { type: Number, default: 3.00 },
}, { timestamps: true });

// You might only keep one document in the collection, or use a specific approach.
// For simplicity, we'll always load the first document found or create a default one.
module.exports = mongoose.model('ExchangeRate', ExchangeRateSchema);
