// src/controllers/transactionController.js
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const ExchangeRate = require('../models/ExchangeRate');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({}).populate('customerId', 'name email');
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.createTransaction = async (req, res) => {
  const { customerId, type, amount, fromCurrency, toCurrency, note } = req.body;
  console.log(req.body)
  if (!['deposit', 'withdraw', 'exchange'].includes(type)) {
    return res.status(400).json({ error: 'Invalid transaction type' });
  }

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const exchangeRate = await ExchangeRate.findOne({});
    if (!exchangeRate) {
      // Create a default one if it doesn't exist
      await ExchangeRate.create({ dinarToDollar: 0.33, dollarToDinar: 3.0 });
    }

    // Perform the transaction logic
    if (type === 'deposit') {
      customer.safes[fromCurrency].balance += amount;
    } else if (type === 'withdraw') {
      // if (customer.safes[fromCurrency].balance < amount) {
      //   return res.status(400).json({ error: 'Insufficient funds' });
      // }
      customer.safes[fromCurrency].balance -= amount;
    } else if (type === 'exchange') {
      // if (customer.safes[fromCurrency].balance < amount) {
      //   return res.status(400).json({ error: 'Insufficient funds' });
      // }
      customer.safes[fromCurrency].balance -= amount;
      const rate = fromCurrency === 'dinar' ? exchangeRate.dinarToDollar : exchangeRate.dollarToDinar;
      customer.safes[toCurrency].balance += fromCurrency === 'dinar' ? (amount / rate) : (amount * rate)
    }

    await customer.save();

    const newTransaction = await Transaction.create({
      customerId,
      type,
      amount,
      fromCurrency,
      toCurrency,
      note, // Save the note
    });

    res.json({ ...newTransaction._doc, id: newTransaction._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.transferMoney = async (req, res) => {
  const { fromCustomerId, toCustomerId, amount, currency } = req.body;

  try {
    const fromCustomer = await Customer.findById(fromCustomerId);
    const toCustomer = await Customer.findById(toCustomerId);

    if (!fromCustomer || !toCustomer) {
      return res.status(404).json({ error: 'One or both customers not found' });
    }

    if (fromCustomer.safes[currency].balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds in fromCustomer account' });
    }

    // Withdraw from fromCustomer
    fromCustomer.safes[currency].balance -= amount;
    await fromCustomer.save();
    const withdrawTransaction = await Transaction.create({
      customerId: fromCustomerId,
      type: 'withdraw',
      amount,
      fromCurrency: currency
    });

    // Deposit to toCustomer
    toCustomer.safes[currency].balance += amount;
    await toCustomer.save();
    const depositTransaction = await Transaction.create({
      customerId: toCustomerId,
      type: 'deposit',
      amount,
      fromCurrency: currency
    });

    res.json({ message: 'Transfer completed', withdrawTransaction, depositTransaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};
