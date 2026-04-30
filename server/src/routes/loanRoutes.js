/**
 * LOAN ROUTES
 * /api/loans/*
 */

const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { auth } = require('../middleware/auth');
const { validateLoan, validateExtraPayment, handleValidationErrors } = require('../middleware/validation');

// All loan routes require authentication
router.use(auth);

// Loan CRUD operations
router.get('/', loanController.getLoans);
router.post('/', validateLoan, handleValidationErrors, loanController.createLoan);
router.get('/:id', loanController.getLoanById);
router.put('/:id', loanController.updateLoan);
router.delete('/:id', loanController.deleteLoan);

// Payment and simulation
router.post('/:id/pay', validateExtraPayment, handleValidationErrors, loanController.makePayment);
router.post('/:id/simulate', loanController.simulatePayment);
router.get('/:id/amortization', loanController.getAmortizationSchedule);

// Dashboard and analytics
router.get('/analytics/dashboard', loanController.getDashboard);

module.exports = router;
