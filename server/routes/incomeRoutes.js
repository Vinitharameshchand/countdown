const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, financeController.addIncome);
router.get('/', auth, financeController.getIncomes);

module.exports = router;
