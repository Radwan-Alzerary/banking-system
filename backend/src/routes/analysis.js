const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Endpoint for filtered transactions
router.get('/chart', async (req, res) => {
  const { startDate, endDate, currency, searchTerm, filterType } = req.query;

  const filters = {};

  // Filter by date range
  if (startDate || endDate) {
    filters.date = {};
    if (startDate) {
      filters.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filters.date.$lte = new Date(endDate);
    }
  }

  // Filter by currency
  if (currency && currency !== 'both') {
    filters.fromCurrency = currency === 'IQD' ? 'dinar' : 'dollar';
  }

  // Filter by search term (e.g., customer name, note)
  if (searchTerm) {
    filters.$or = [
      { note: { $regex: searchTerm, $options: 'i' } },
      { 'customerId.name': { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Filter by type
  if (filterType && filterType !== 'all') {
    filters.type = filterType;
  }

  try {
    const transactions = await Transaction.find(filters).populate('customerId', 'name');
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get filtered transactions
router.get('/chart-data', async (req, res) => {
    const { startDate, endDate, currency } = req.query;
  
    const filters = {};
  
    // Filter by date range
    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.$gte = new Date(startDate);
      if (endDate) filters.date.$lte = new Date(endDate);
    }
  
    // Filter by currency
    if (currency && currency !== 'both') {
      filters.fromCurrency = currency.toLowerCase() === 'iqd' ? 'dinar' : 'dollar';
    }
  
    try {
      const transactions = await Transaction.find(filters);
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });
  
  // API to fetch transactions with filters
router.get('/', async (req, res) => {
    const { startDate, endDate, currency } = req.query;
  
    const filters = {};
  
    // Filter by date range
    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.$gte = new Date(startDate);
      if (endDate) filters.date.$lte = new Date(endDate);
    }
  
    // Filter by currency
    if (currency && currency !== 'both') {
      filters.fromCurrency = currency.toLowerCase();
    }
  
    try {
      const transactions = await Transaction.find(filters);
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });
  

module.exports = router;
