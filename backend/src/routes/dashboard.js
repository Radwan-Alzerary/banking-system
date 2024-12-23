// src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const ExchangeRate = require('../models/ExchangeRate');

router.get('/', async (req, res) => {
  try {
    // Fetch total customers
    const totalCustomers = await Customer.countDocuments();

    // Fetch total balances
    const customers = await Customer.find();
    const totalDinarBalance = customers.reduce((sum, customer) => sum + customer.safes.dinar.balance, 0);
    const totalDollarBalance = customers.reduce((sum, customer) => sum + customer.safes.dollar.balance, 0);

    // Fetch exchange rate
    const exchangeRate = await ExchangeRate.findOne({});
    const exchangeRateValue = exchangeRate ? exchangeRate.dollarToDinar : 3.0;

    // Fetch transactions from the last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const recentTransactions = await Transaction.find({ date: { $gte: lastMonth } }).sort({ date: -1 }).limit(10);

    res.json({
      totalCustomers,
      totalDinarBalance,
      totalDollarBalance,
      exchangeRateValue,
      recentTransactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});


router.get('/monthly-totals', async (req, res) => {
    try {
      const monthlyTotals = await Transaction.aggregate([
        {
          $group: {
            _id: { $month: "$date" },
            total: { $sum: "$amount" }
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);
  
      // Map to an array with month names
      const months = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو",
        "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر",
        "نوفمبر", "ديسمبر"
      ];
  
      const data = Array(12).fill(0).map((_, index) => ({
        name: months[index],
        total: 0
      }));
  
      monthlyTotals.forEach((entry) => {
        data[entry._id - 1].total = entry.total;
      });
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch monthly totals' });
    }
  });
module.exports = router;
