// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
const morgan = require("morgan");

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

app.use('/api/customers', require('./routes/customers'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/exchange-rate', require('./routes/exchangeRate'));
app.use('/api/backup', require('./routes/backup'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/analysis', require('./routes/analysis'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
