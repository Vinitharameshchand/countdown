const Loan = require('../models/Loan');
const EmiPayment = require('../models/EmiPayment');
const loanService = require('../services/loanService');

exports.createLoan = async (req, res) => {
  try {
    const { loanAmount, interestRate, tenureMonths, startDate } = req.body;
    const userId = req.user.userId;

    const emi = loanService.calculateEMI(loanAmount, interestRate, tenureMonths);

    const loan = new Loan({
      userId,
      loanAmount,
      interestRate,
      tenureMonths,
      emi,
      remainingBalance: loanAmount,
      startDate,
    });

    await loan.save();
    res.status(201).json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.userId });
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.loanId, userId: req.user.userId });
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.payEmi = async (req, res) => {
  try {
    const { amountPaid, date } = req.body;
    const loan = await Loan.findOne({ _id: req.params.loanId, userId: req.user.userId });

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const monthlyRate = loan.interestRate / 100 / 12;
    const interest = loan.remainingBalance * monthlyRate;
    const principalPaid = amountPaid - interest;

    loan.remainingBalance -= principalPaid;
    if (loan.remainingBalance < 0) loan.remainingBalance = 0;

    await loan.save();

    const payment = new EmiPayment({
      loanId: loan._id,
      amountPaid,
      date,
      status: 'paid',
    });

    await payment.save();

    res.json({ loan, payment, interestPaid: Math.round(interest * 100) / 100 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await EmiPayment.find({ loanId: req.params.loanId }).sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.simulateLoan = async (req, res) => {
  try {
    const { extraMonthlyPayment } = req.body;
    const loan = await Loan.findOne({ _id: req.params.loanId, userId: req.user.userId });

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const standardTimeline = loan.tenureMonths; // Simplified for now
    const simulation = loanService.simulateExtraPayment(
      loan.remainingBalance,
      loan.interestRate,
      loan.tenureMonths,
      parseFloat(extraMonthlyPayment) || 0
    );

    res.json({
      loanId: loan._id,
      extraMonthlyPayment,
      standardPayoffMonths: loan.tenureMonths,
      optimizedPayoffMonths: simulation.payoffMonths,
      interestTotal: simulation.interestTotal,
      monthsSaved: Math.max(0, loan.tenureMonths - simulation.payoffMonths)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
