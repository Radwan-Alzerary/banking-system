const express = require('express');
const router = express.Router();
const ExchangeRate = require('../models/ExchangeRate');

// Get current exchange rates
router.get('/', async (req, res) => {
  try {
    const exchangeRate = await ExchangeRate.findOne();
    if (!exchangeRate) {
      // If no exchange rate is found, create a default one
      const defaultRate = await ExchangeRate.create({ dinarToDollar: 0.33, dollarToDinar: 3.0 });
      return res.json(defaultRate);
    }
    res.json(exchangeRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
});

// Update exchange rates
router.put('/', async (req, res) => {
  const { dinarToDollar, dollarToDinar } = req.body;

  if (!dinarToDollar || !dollarToDinar) {
    return res.status(400).json({ error: 'Both exchange rates are required' });
  }

  try {
    let exchangeRate = await ExchangeRate.findOne();
    if (!exchangeRate) {
      // If no exchange rate exists, create a new one
      exchangeRate = await ExchangeRate.create({ dinarToDollar, dollarToDinar });
    } else {
      // Update the existing exchange rate
      exchangeRate.dinarToDollar = dinarToDollar;
      exchangeRate.dollarToDinar = dollarToDinar;
      await exchangeRate.save();
    }

    res.json(exchangeRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update exchange rate' });
  }
});

module.exports = router;
