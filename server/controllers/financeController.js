const Income = require('../models/Income');
const Expense = require('../models/Expense');

// Income
exports.addIncome = async (req, res) => {
  try {
    const { amount, source, date } = req.body;
    const income = new Income({ userId: req.user.userId, amount, source, date });
    await income.save();
    res.status(201).json(income);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Expense
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, date } = req.body;
    const expense = new Expense({ userId: req.user.userId, amount, category, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteExpense = async (req, res) => {
    try {
      await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
      res.json({ message: 'Expense deleted' });
    } catch (err) {
      res.status(500).send('Server error');
    }
};
