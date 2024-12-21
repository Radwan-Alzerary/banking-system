// src/routes/exchangeRate.js
const express = require('express');
const router = express.Router();
const { getExchangeRate, updateExchangeRate } = require('../controllers/exchangeRateController');

router.get('/', getExchangeRate);
router.put('/', updateExchangeRate);

module.exports = router;
