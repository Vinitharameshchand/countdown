/**
 * LOAN CONTROLLER
 * Handles all loan-related operations
 */

const Loan = require('../models/Loan');
const User = require('../models/User');
const financialService = require('../services/financialService');

/**
 * Get all loans for user
 * GET /loans
 */
exports.getLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.userId }).sort({ createdAt: -1 });

        // Calculate metrics
        const metrics = financialService.calculateTotalMetrics(loans);

        res.status(200).json({
            success: true,
            count: loans.length,
            loans,
            metrics,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching loans',
            error: error.message,
        });
    }
};

/**
 * Get single loan by ID
 * GET /loans/:id
 */
exports.getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Loan not found',
            });
        }

        // Verify ownership
        if (loan.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this loan',
            });
        }

        res.status(200).json({
            success: true,
            loan,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching loan',
            error: error.message,
        });
    }
};

/**
 * Create new loan
 * POST /loans
 */
exports.createLoan = async (req, res) => {
    try {
        const { name, type, principal, remainingBalance, annualInterestRate, loanTenureMonths, remainingMonths, startDate, notes } = req.body;

        // Create loan
        const loan = await Loan.create({
            userId: req.userId,
            name,
            type,
            principal,
            remainingBalance: remainingBalance || principal,
            annualInterestRate,
            loanTenureMonths,
            remainingMonths,
            startDate: startDate || new Date(),
            notes,
        });

        res.status(201).json({
            success: true,
            message: 'Loan created successfully',
            loan,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating loan',
            error: error.message,
        });
    }
};

/**
 * Update loan details
 * PUT /loans/:id
 */
exports.updateLoan = async (req, res) => {
    try {
        let loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Loan not found',
            });
        }

        // Verify ownership
        if (loan.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this loan',
            });
        }

        // Update allowed fields
        const allowedFields = [
            'name',
            'type',
            'principal',
            'remainingBalance',
            'annualInterestRate',
            'loanTenureMonths',
            'remainingMonths',
            'extraMonthlyPayment',
            'notes',
        ];

        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                loan[key] = req.body[key];
            }
        });

        loan.updatedAt = Date.now();
        await loan.save();

        res.status(200).json({
            success: true,
            message: 'Loan updated successfully',
            loan,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating loan',
            error: error.message,
        });
    }
};

/**
 * Delete loan
 * DELETE /loans/:id
 */
exports.deleteLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Loan not found',
            });
        }

        // Verify ownership
        if (loan.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this loan',
            });
        }

        await Loan.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Loan deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting loan',
            error: error.message,
        });
    }
};

/**
 * Make payment towards loan
 * POST /loans/:id/pay
 */
exports.makePayment = async (req, res) => {
    try {
        const { amount, isExtraPayment } = req.body;

        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Loan not found',
            });
        }

        // Verify ownership
        if (loan.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this loan',
            });
        }

        // Process payment
        if (isExtraPayment) {
            loan.addExtraPayment(amount);
        } else {
            // Regular payment reduces remaining months
            loan.remainingMonths = Math.max(0, loan.remainingMonths - 1);
            loan.remainingBalance = Math.max(0, loan.remainingBalance - (loan.emi - loan.annualInterestRate / 12 / 100 * loan.remainingBalance));
        }

        loan.totalInterestPaid = (loan.principal - loan.remainingBalance) * (loan.annualInterestRate / 100);
        loan.updatedAt = Date.now();

        await loan.save();

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            loan,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message,
        });
    }
};

/**
 * Simulate extra payment impact
 * POST /loans/:id/simulate
 */
exports.simulatePayment = async (req, res) => {
    try {
        const { amount, paymentType } = req.body; // paymentType: 'monthly' or 'oneTime'

        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Loan not found',
            });
        }

        // Verify ownership
        if (loan.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this loan',
            });
        }

        let simulation;

        if (paymentType === 'oneTime') {
            simulation = financialService.simulateExtraOneTimePayment(
                {
                    principal: loan.principal,
                    annualInterestRate: loan.annualInterestRate,
                    loanTenureMonths: loan.loanTenureMonths,
                    remainingBalance: loan.remainingBalance,
                    remainingMonths: loan.remainingMonths,
                },
                amount
            );
        } else {
            // Monthly payment
            simulation = financialService.simulateExtraMonthlyPayment(
                {
                    principal: loan.principal,
                    annualInterestRate: loan.annualInterestRate,
                    loanTenureMonths: loan.loanTenureMonths,
                    remainingBalance: loan.remainingBalance,
                    remainingMonths: loan.remainingMonths,
                },
                amount
            );
        }

        res.status(200).json({
            success: true,
            simulation,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error simulating payment',
            error: error.message,
        });
    }
};

/**
 * Get debt ratio and insights
 * GET /loans/analytics/dashboard
 */
exports.getDashboard = async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.userId });
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Calculate all metrics
        const totalEMI = loans.reduce((sum, loan) => sum + (loan.emi || 0), 0);
        const totalBalance = loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0);
        const avgMonthsRemaining = loans.length > 0 ? loans.reduce((sum, loan) => sum + (loan.remainingMonths || 0), 0) / loans.length : 0;

        const debtRatio = financialService.calculateDebtRatio(totalEMI, user.monthlyIncome);
        const countdown = financialService.calculateCountdown(avgMonthsRemaining);
        const payoffDate = financialService.calculatePayoffDate(avgMonthsRemaining);
        const insights = financialService.generateInsights(loans, user.monthlyIncome);
        const metrics = financialService.calculateTotalMetrics(loans);

        res.status(200).json({
            success: true,
            dashboard: {
                loanCount: loans.length,
                totalBalance,
                totalEMI,
                monthlyIncome: user.monthlyIncome,
                debtRatio,
                countdown,
                payoffDate,
                insights,
                metrics,
                loans,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard',
            error: error.message,
        });
    }
};

/**
 * Get amortization schedule for a loan
 * GET /loans/:id/amortization
 */
exports.getAmortizationSchedule = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Loan not found',
            });
        }

        // Verify ownership
        if (loan.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this loan',
            });
        }

        const schedule = financialService.generateAmortizationSchedule(
            loan.principal,
            loan.annualInterestRate,
            loan.loanTenureMonths,
            loan.extraMonthlyPayment || 0
        );

        res.status(200).json({
            success: true,
            loan: {
                id: loan._id,
                name: loan.name,
                emi: loan.emi,
            },
            schedule,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching amortization schedule',
            error: error.message,
        });
    }
};

module.exports = exports;
