const mongoose = require('mongoose');

const ExchangeRateSchema = new mongoose.Schema({
  dinarToDollar: { type: Number, required: true },
  dollarToDinar: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ExchangeRate', ExchangeRateSchema);
