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

// src/controllers/transactionController.js

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, amount, fromCurrency, toCurrency, note } = req.body;
  
  // Validate the new transaction type.
  if (!['deposit', 'withdraw', 'exchange'].includes(type)) {
    return res.status(400).json({ error: 'Invalid transaction type' });
  }

  try {
    // Find the original transaction and its associated customer.
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const customer = await Customer.findById(transaction.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // ================================================
    // 1. Reverse the original transaction’s effect
    // ================================================
    if (transaction.type === 'deposit') {
      // A deposit originally added funds so remove them.
      customer.safes[transaction.fromCurrency].balance -= transaction.amount;
    } else if (transaction.type === 'withdraw') {
      // A withdrawal originally removed funds so add them back.
      customer.safes[transaction.fromCurrency].balance += transaction.amount;
    } else if (transaction.type === 'exchange') {
      // For an exchange, reverse both sides.
      const exchangeRate = await ExchangeRate.findOne({});
      if (!exchangeRate) {
        return res.status(400).json({ error: 'Exchange rate not found' });
      }
      // Use the same conversion logic that was used when the transaction was created.
      const rate =
        transaction.fromCurrency === 'dinar'
          ? exchangeRate.dinarToDollar
          : exchangeRate.dollarToDinar;
      const originalConvertedAmount =
        transaction.fromCurrency === 'dinar'
          ? transaction.amount * rate
          : transaction.amount / rate;
      customer.safes[transaction.fromCurrency].balance += transaction.amount;
      customer.safes[transaction.toCurrency].balance -= originalConvertedAmount;
    }

    // Save the customer changes after reversal.
    await customer.save();

    // ===========================================================
    // 2. Check if the new transaction can be applied
    // ===========================================================
    // For withdrawals and exchanges, we need to ensure sufficient funds.
    if ((type === 'withdraw' || type === 'exchange') &&
        customer.safes[fromCurrency].balance < amount) {
      
      // If there aren’t enough funds, reapply the original transaction to avoid leaving the account in an inconsistent state.
      if (transaction.type === 'deposit') {
        customer.safes[transaction.fromCurrency].balance += transaction.amount;
      } else if (transaction.type === 'withdraw') {
        customer.safes[transaction.fromCurrency].balance -= transaction.amount;
      } else if (transaction.type === 'exchange') {
        const exchangeRate = await ExchangeRate.findOne({});
        if (!exchangeRate) {
          return res.status(400).json({ error: 'Exchange rate not found' });
        }
        const rate =
          transaction.fromCurrency === 'dinar'
            ? exchangeRate.dinarToDollar
            : exchangeRate.dollarToDinar;
        const originalConvertedAmount =
          transaction.fromCurrency === 'dinar'
            ? transaction.amount * rate
            : transaction.amount / rate;
        customer.safes[transaction.fromCurrency].balance -= transaction.amount;
        customer.safes[transaction.toCurrency].balance += originalConvertedAmount;
      }
      await customer.save();
      return res.status(400).json({ error: 'Insufficient funds for new transaction' });
    }

    // ================================================
    // 3. Apply the new transaction's effect
    // ================================================
    if (type === 'deposit') {
      // Add the new deposit amount.
      customer.safes[fromCurrency].balance += amount;
    } else if (type === 'withdraw') {
      // Subtract the withdrawal amount.
      customer.safes[fromCurrency].balance -= amount;
    } else if (type === 'exchange') {
      const exchangeRate = await ExchangeRate.findOne({});
      if (!exchangeRate) {
        return res.status(400).json({ error: 'Exchange rate not found' });
      }
      // Convert the new amount using the current exchange rate.
      const convertedAmount =
        fromCurrency === 'dinar'
          ? amount * exchangeRate.dinarToDollar
          : amount * exchangeRate.dollarToDinar;
      customer.safes[fromCurrency].balance -= amount;
      customer.safes[toCurrency].balance += convertedAmount;
    }

    // Save the customer's updated balances.
    await customer.save();

    // ================================================
    // 4. Update the transaction record with new values
    // ================================================
    transaction.type = type;
    transaction.amount = amount;
    transaction.fromCurrency = fromCurrency;
    transaction.toCurrency = toCurrency;
    transaction.note = note;
    await transaction.save();

    res.json(transaction);
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
