// src/routes/backup.js
const express = require('express');
const router = express.Router();
const { backupData, importData } = require('../controllers/backupController');

router.get('/', backupData);
router.post('/', importData);

module.exports = router;
