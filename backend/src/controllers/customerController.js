// src/controllers/customerController.js
const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, avatar } = req.body;
    const newCustomer = await Customer.create({ name, email, phone, address, avatar });
    return res.json({ ...newCustomer._doc, id: newCustomer._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
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
