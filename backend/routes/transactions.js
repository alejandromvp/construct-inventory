const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionsByProduct
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getTransactions)
  .post(protect, createTransaction);

router.get('/product/:productId', protect, getTransactionsByProduct);

module.exports = router;