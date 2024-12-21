// src/routes/customers.js
const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');

router.get('/', getCustomers);
router.post('/', createCustomer);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
