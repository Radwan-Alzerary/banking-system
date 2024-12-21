// src/routes/transactions.js
const express = require('express');
const router = express.Router();
const {getTransactions, createTransaction, transferMoney } = require('../controllers/transactionController');
const Transaction = require('../models/Transaction');
router.get('/', getTransactions); // Add this line

router.post('/', createTransaction);
router.post('/transfer', transferMoney);
// src/routes/transactions.js
router.get('/customer/:customerId', async (req, res) => {
    try {
      const { customerId } = req.params;
      const transactions = await Transaction.find({ customerId }).sort({ date: -1 }); // Sorted by date
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });
  
module.exports = router;
 