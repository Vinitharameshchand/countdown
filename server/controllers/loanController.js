// ========================================
// LOAN CONTROLLER
// ========================================
// Handles loan management operations:
// - Create new loans (calculate EMI automatically)
// - Track loan payments (EMI)
// - Separate interest and principal portions
// - Simulate payoff scenarios
// All functions are protected by authMiddleware

const Loan = require('../models/Loan');                   // Loan database model
const EmiPayment = require('../models/EmiPayment');      // Payment history model
const loanService = require('../services/loanService');  // Loan calculation service

// ========================================
// CREATE LOAN
// ========================================
// Route: POST /api/loan/create
// Purpose: Create a new loan with automatic EMI calculation
// Request body: { loanAmount, interestRate, tenureMonths, startDate }
// Response: { _id, userId, loanAmount, interestRate, emi, remainingBalance, ... }
exports.createLoan = async (req, res) => {
  try {
    // Step 1: Extract loan details from request body
    const { loanAmount, interestRate, tenureMonths, startDate } = req.body;
    const userId = req.user.userId;

    // Step 2: Calculate EMI (Equated Monthly Installment)
    // This calls the loanService to compute monthly payment amount
    // Formula: EMI = P × [R(1+R)^N] / [(1+R)^N - 1]
    const emi = loanService.calculateEMI(loanAmount, interestRate, tenureMonths);

    // Step 3: Create new Loan document
    const loan = new Loan({
      userId,                              // Associate loan with user
      loanAmount,                          // Total principal borrowed
      interestRate,                        // Annual interest rate (%)
      tenureMonths,                        // Total number of months
      emi,                                 // Calculated monthly payment
      remainingBalance: loanAmount,        // Initially = loanAmount, decreases with payments
      startDate                            // Loan start date
    });

    // Step 4: Save loan to MongoDB
    await loan.save();

    // Step 5: Send new loan to frontend
    // Frontend will update Dashboard to show loan in list
    res.status(201).json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ========================================
// GET ALL LOANS
// ========================================
// Route: GET /api/loan
// Purpose: Retrieve all loans for authenticated user
// Query: Filtered by userId
// Response: Array of loan documents
exports.getLoans = async (req, res) => {
  try {
    // Step 1: Query database for all loans belonging to this user
    const loans = await Loan.find({ userId: req.user.userId });

    // Step 2: Send all loans to frontend
    // Frontend uses this to populate Loans page and Dashboard
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ========================================
// GET LOAN BY ID
// ========================================
// Route: GET /api/loan/:loanId
// Purpose: Retrieve specific loan details
// URL param: loanId
// Response: Single loan document or error message
exports.getLoanById = async (req, res) => {
  try {
    // Step 1: Find loan by ID, ensuring it belongs to authenticated user
    const loan = await Loan.findOne({
      _id: req.params.loanId,             // Match by loan ID
      userId: req.user.userId             // Security: verify ownership
    });

    // Step 2: Check if loan exists
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Step 3: Send loan details to frontend
    res.json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ========================================
// PAY EMI (Equated Monthly Installment)
// ========================================
// Route: POST /api/loan/:loanId/pay-emi
// Purpose: Record an EMI payment and update loan balance
// Request body: { amountPaid, date }
// Response: { loan, payment, interestPaid }
// Logic: Separates payment into interest and principal portions
exports.payEmi = async (req, res) => {
  try {
    // Step 1: Extract payment details from request body
    const { amountPaid, date } = req.body;

    // Step 2: Find the loan (verify ownership)
    const loan = await Loan.findOne({
      _id: req.params.loanId,             // Match by loan ID
      userId: req.user.userId             // Security check
    });

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Step 3: Calculate interest portion of this payment
    // Interest = Remaining Balance × (Annual Rate / 100 / 12)
    const monthlyRate = loan.interestRate / 100 / 12;
    const interest = loan.remainingBalance * monthlyRate;

    // Step 4: Calculate principal portion of this payment
    // Principal = Total Payment - Interest
    // (This is the part that actually reduces the loan balance)
    const principalPaid = amountPaid - interest;

    // Step 5: Update loan remaining balance
    // Remove principal portion from balance (interest goes to bank, not balance)
    loan.remainingBalance -= principalPaid;

    // Ensure balance doesn't go negative
    if (loan.remainingBalance < 0) loan.remainingBalance = 0;

    // Step 6: Save updated loan to MongoDB
    await loan.save();

    // Step 7: Create payment history record
    // This allows tracking all past payments for the loan
    const payment = new EmiPayment({
      loanId: loan._id,                   // Link to loan
      amountPaid,                         // Total amount paid
      date,                               // Payment date
      status: 'paid'                      // Payment status
    });

    // Step 8: Save payment record to MongoDB
    await payment.save();

    // Step 9: Send response with updated loan info and payment details
    // Frontend uses this to update ui and recalculate dashboard
    res.json({
      loan,                               // Updated loan with new balance
      payment,                            // Payment record
      interestPaid: Math.round(interest * 100) / 100  // Interest portion
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ========================================
// GET PAYMENT HISTORY
// ========================================
// Route: GET /api/loan/:loanId/payments
// Purpose: Retrieve all EMI payments made for a specific loan
// URL param: loanId
// Response: Array of payment records (sorted by date, newest first)
exports.getPaymentHistory = async (req, res) => {
  try {
    // Step 1: Find all payment records for this loan
    const payments = await EmiPayment
      .find({ loanId: req.params.loanId })  // Match by loanId
      .sort({ date: -1 });                  // Sort newest first

    // Step 2: Send payment history to frontend
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ========================================
// SIMULATE LOAN PAYOFF
// ========================================
// Route: POST /api/loan/:loanId/simulate
// Purpose: Show impact of extra monthly payments or salary changes
// Request body: { extraMonthlyPayment }
// Response: { loanId, standardPayoffMonths, optimizedPayoffMonths, monthsSaved, interestTotal }
// This is the star feature: helps users see how extra payments speed up payoff
exports.simulateLoan = async (req, res) => {
  try {
    // Step 1: Extract extra payment amount from request
    const { extraMonthlyPayment } = req.body;

    // Step 2: Find the loan (verify ownership)
    const loan = await Loan.findOne({
      _id: req.params.loanId,             // Match by loan ID
      userId: req.user.userId             // Security check
    });

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Step 3: Store standard timeline for comparison
    // This is the original payoff period without extra payments
    const standardTimeline = loan.tenureMonths;

    // Step 4: Run simulation with extra payment amount
    // This calculates a new payoff schedule with additional monthly payment
    const simulation = loanService.simulateExtraPayment(
      loan.remainingBalance,                    // Current balance
      loan.interestRate,                        // Interest rate
      loan.tenureMonths,                        // Original tenure
      parseFloat(extraMonthlyPayment) || 0      // Extra monthly payment
    );

    // Step 5: Prepare response with comparison data
    res.json({
      loanId: loan._id,                                  // Loan ID
      extraMonthlyPayment,                               // Extra payment being tested
      standardPayoffMonths: loan.tenureMonths,          // Original payoff time
      optimizedPayoffMonths: simulation.payoffMonths,   // New payoff time with extra payments
      interestTotal: simulation.interestTotal,           // Total interest in new scenario
      monthsSaved: Math.max(0, loan.tenureMonths - simulation.payoffMonths)  // Months saved
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
