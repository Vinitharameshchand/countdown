const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, loanController.createLoan);
router.get('/', auth, loanController.getLoans);
router.get('/:loanId', auth, loanController.getLoanById);
router.post('/:loanId/pay', auth, loanController.payEmi);
router.get('/:loanId/emi', auth, loanController.getPaymentHistory);
router.post('/:loanId/simulate', auth, loanController.simulateLoan);

module.exports = router;
