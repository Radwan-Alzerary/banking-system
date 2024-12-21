// src/controllers/backupController.js
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const ExchangeRate = require('../models/ExchangeRate');

exports.backupData = async (req, res) => {
  try {
    const customers = await Customer.find({});
    const transactions = await Transaction.find({});
    const exchangeRate = await ExchangeRate.findOne({});

    const data = {
      customers,
      transactions,
      exchangeRate
    };
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.importData = async (req, res) => {
  const { data } = req.body;
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    await Customer.deleteMany({});
    await Transaction.deleteMany({});
    await ExchangeRate.deleteMany({});

    if (parsed.customers && parsed.customers.length > 0) {
      await Customer.insertMany(parsed.customers);
    }

    if (parsed.transactions && parsed.transactions.length > 0) {
      await Transaction.insertMany(parsed.transactions);
    }

    if (parsed.exchangeRate) {
      await ExchangeRate.create(parsed.exchangeRate);
    }

    res.json({ message: 'Data imported successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data format' });
  }
};
