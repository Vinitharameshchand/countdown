const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, financeController.addExpense);
router.get('/', auth, financeController.getExpenses);
router.delete('/:id', auth, financeController.deleteExpense);

module.exports = router;
