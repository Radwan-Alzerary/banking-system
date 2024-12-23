// src/controllers/customerController.js
const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      avatar,
      safes = {}
    } = req.body;

    // Safely extract balances or default to 0
    const dinarBalance =
      safes.dinar && safes.dinar.balance != null
        ? parseFloat(safes.dinar.balance)
        : 0;

    const dollarBalance =
      safes.dollar && safes.dollar.balance != null
        ? parseFloat(safes.dollar.balance)
        : 0;

    // Create new customer in MongoDB
    const newCustomer = await Customer.create({
      name,
      email,
      phone,
      address,
      avatar,
      safes: {
        // Force 'dinar' as currency
        dinar: {
          currency: 'dinar',
          balance: isNaN(dinarBalance) ? 0 : dinarBalance,
        },
        // Force 'dollar' as currency
        dollar: {
          currency: 'dollar',
          balance: isNaN(dollarBalance) ? 0 : dollarBalance,
        },
      },
    });

    // Return the doc, mapping _id to id
    return res.json({
      ...newCustomer._doc,
      id: newCustomer._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});
    const formatted = customers.map(c => ({ ...c._doc, id: c._id }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    console.log(customer)
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    return res.json({ ...customer._doc, id: customer._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, avatar } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, avatar },
      { new: true }
    );
    if (!updatedCustomer) return res.status(404).json({ error: 'Customer not found' });
    return res.json({ ...updatedCustomer._doc, id: updatedCustomer._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Customer not found' });
    return res.json({ message: 'Customer deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};
