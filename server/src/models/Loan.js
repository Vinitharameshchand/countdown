/**
 * LOAN MODEL
 * Stores individual loan information
 */

const mongoose = require('mongoose');
const financialService = require('../services/financialService');

const loanSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Loan must belong to a user'],
        },
        name: {
            type: String,
            required: [true, 'Please provide a loan name'],
            trim: true,
            maxlength: [100, 'Loan name cannot exceed 100 characters'],
        },
        type: {
            type: String,
            enum: ['personal', 'home', 'auto', 'education', 'credit-card', 'other'],
            default: 'personal',
        },
        principal: {
            type: Number,
            required: [true, 'Please provide principal amount'],
            min: [1, 'Principal must be positive'],
        },
        remainingBalance: {
            type: Number,
            required: [true, 'Please provide remaining balance'],
            min: [0, 'Remaining balance cannot be negative'],
        },
        annualInterestRate: {
            type: Number,
            required: [true, 'Please provide annual interest rate'],
            min: [0, 'Interest rate cannot be negative'],
            max: [100, 'Interest rate cannot exceed 100%'],
        },
        loanTenureMonths: {
            type: Number,
            required: [true, 'Please provide loan tenure in months'],
            min: [1, 'Tenure must be at least 1 month'],
        },
        remainingMonths: {
            type: Number,
            required: [true, 'Please provide remaining months'],
            min: [1, 'Remaining months must be at least 1'],
        },
        emi: {
            type: Number,
            required: [true, 'Please provide EMI amount'],
            min: [0, 'EMI cannot be negative'],
        },
        startDate: {
            type: Date,
            required: [true, 'Please provide start date'],
        },
        expectedPayoffDate: {
            type: Date,
            required: [true, 'Please provide expected payoff date'],
        },
        extraMonthlyPayment: {
            type: Number,
            default: 0,
            min: [0, 'Extra payment cannot be negative'],
        },
        totalInterestPaid: {
            type: Number,
            default: 0,
        },
        totalInterestRemaining: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Calculate EMI and remaining details before saving
loanSchema.pre('save', function (next) {
    try {
        // Calculate EMI if not provided or if parameters changed
        this.emi = financialService.calculateEMI(
            this.principal,
            this.annualInterestRate,
            this.loanTenureMonths
        );

        // Calculate total interest remaining
        const totalPayment = this.emi * this.remainingMonths;
        this.totalInterestRemaining = totalPayment - this.remainingBalance;

        // Set expected payoff date
        const today = new Date();
        this.expectedPayoffDate = new Date(today.getFullYear(), today.getMonth() + this.remainingMonths, today.getDate());

        next();
    } catch (error) {
        next(error);
    }
});

// Virtual for debt freedom countdown
loanSchema.virtual('countdown').get(function () {
    if (!this.remainingMonths) return null;
    return financialService.calculateCountdown(this.remainingMonths);
});

// Method to update with extra payment
loanSchema.methods.addExtraPayment = function (amount) {
    this.remainingBalance = Math.max(0, this.remainingBalance - amount);
    this.totalInterestPaid += amount; // Simplified
};

// Method to simulate payment
loanSchema.methods.simulatePayment = function (extraMonthlyPayment = 0) {
    return financialService.simulateExtraMonthlyPayment(
        {
            principal: this.principal,
            annualInterestRate: this.annualInterestRate,
            loanTenureMonths: this.loanTenureMonths,
            remainingBalance: this.remainingBalance,
            remainingMonths: this.remainingMonths,
        },
        extraMonthlyPayment
    );
};

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
