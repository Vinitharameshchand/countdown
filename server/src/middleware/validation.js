/**
 * VALIDATION MIDDLEWARE
 * Input validation and error handling
 */

const { body, validationResult } = require('express-validator');

// Validation middleware to check for errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array(),
        });
    }
    next();
};

// Validation rules
const validateSignup = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('monthlyIncome').isFloat({ min: 1 }).withMessage('Monthly income must be a positive number'),
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const validateLoan = [
    body('name').trim().notEmpty().withMessage('Loan name is required'),
    body('principal').isFloat({ min: 1 }).withMessage('Principal must be positive'),
    body('remainingBalance').isFloat({ min: 0 }).withMessage('Remaining balance must be non-negative'),
    body('annualInterestRate').isFloat({ min: 0, max: 100 }).withMessage('Interest rate must be between 0 and 100'),
    body('loanTenureMonths').isInt({ min: 1 }).withMessage('Tenure must be at least 1 month'),
    body('remainingMonths').isInt({ min: 1 }).withMessage('Remaining months must be at least 1'),
];

const validateExtraPayment = [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
];

module.exports = {
    handleValidationErrors,
    validateSignup,
    validateLogin,
    validateLoan,
    validateExtraPayment,
};
