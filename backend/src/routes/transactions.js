// src/routes/transactions.js
const express = require('express');
const router = express.Router();
const {getTransactions, createTransaction, transferMoney,updateTransaction } = require('../controllers/transactionController');
const Transaction = require('../models/Transaction');
const Customer = require('../models/Customer');
router.get('/', getTransactions); // Add this line

router.post('/', createTransaction);
router.post('/transfer', transferMoney);
// src/routes/transactions.js

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // 1. Find the transaction by its ID
    const transaction = await Transaction.findById(id)
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    // 2. Find the customer associated with this transaction
    const customer = await Customer.findById(transaction.customerId)
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    // 3. Reverse the effect of the transaction on the customer's account

    // For a deposit, subtract the deposited amount from the customer's safe
    if (transaction.type === 'deposit') {
      customer.safes[transaction.fromCurrency].balance -= transaction.amount

    // For a withdrawal, add back the withdrawn amount to the customer's safe
    } else if (transaction.type === 'withdraw') {
      customer.safes[transaction.fromCurrency].balance += transaction.amount

    // For an exchange, reverse the conversion:
    } else if (transaction.type === 'exchange') {
      // Get the current exchange rate from your ExchangeRate model
      const exchangeRate = await ExchangeRate.findOne({})
      if (!exchangeRate) {
        return res.status(400).json({ error: 'Exchange rate not found' })
      }
      // Determine the appropriate rate based on the transaction's fromCurrency
      const rate = transaction.fromCurrency === 'dinar' 
        ? exchangeRate.dinarToDollar 
        : exchangeRate.dollarToDinar
      
      // Calculate the converted amount that was added to the other safe
      const originalConvertedAmount = transaction.fromCurrency === 'dinar' 
        ? transaction.amount * rate 
        : transaction.amount / rate
      
      // Reverse the exchange: remove the converted amount and add back the original amount
      customer.safes[transaction.fromCurrency].balance += transaction.amount
      customer.safes[transaction.toCurrency].balance -= originalConvertedAmount
    }

    // 4. Save the updated customer record
    await customer.save()

    // 5. Delete the transaction record
    await Transaction.findByIdAndDelete(id)

    res.status(200).json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    res.status(500).json({ error: 'Server error while deleting transaction' })
  }
})

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
  router.put('/:id', updateTransaction); // Add this line

module.exports = router;
 