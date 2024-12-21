// src/controllers/exchangeRateController.js
const ExchangeRate = require('../models/ExchangeRate');

exports.getExchangeRate = async (req, res) => {
  try {
    let rate = await ExchangeRate.findOne({});
    if (!rate) {
      rate = await ExchangeRate.create({ dinarToDollar: 0.33, dollarToDinar: 3.0 });
    }
    res.json(rate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.updateExchangeRate = async (req, res) => {
  const { dinarToDollar, dollarToDinar } = req.body;
  try {
    let rate = await ExchangeRate.findOne({});
    if (!rate) {
      rate = await ExchangeRate.create({ dinarToDollar, dollarToDinar });
    } else {
      rate.dinarToDollar = dinarToDollar;
      rate.dollarToDinar = dollarToDinar;
      await rate.save();
    }
    res.json(rate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};
