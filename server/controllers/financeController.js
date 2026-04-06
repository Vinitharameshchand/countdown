// ========================================
// FINANCE CONTROLLER
// ========================================
// Handles income and expense operations.
// All functions are protected by authMiddleware (JWT verification).
// All operations are filtered by userId to ensure data isolation.

const Income = require('../models/Income');   // Income database model
const Expense = require('../models/Expense');  // Expense database model

// ============= INCOME FUNCTIONS =============

// ========================================
// ADD INCOME
// ========================================
// Route: POST /api/income/add
// Purpose: Create a new income entry for authenticated user
// Request body: { amount, source, date }
// Response: { _id, userId, amount, source, date }
exports.addIncome = async (req, res) => {
  try {
    // Step 1: Extract income details from request body
    const { amount, source, date } = req.body;
    // Note: userId is extracted from JWT token by authMiddleware (req.user.userId)

    // Step 2: Create new Income document
    const income = new Income({
      userId: req.user.userId,     // Associate income with authenticated user
      amount,                       // Income amount
      source,                       // Income source (salary, freelance, etc.)
      date                          // Date of income
    });

    // Step 3: Save income to MongoDB
    await income.save();

    // Step 4: Send saved income back to frontend
    // Frontend uses this to update local state and re-render Dashboard
    res.status(201).json(income);
  } catch (err) {
    console.error('Income Error:', err.message);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// ========================================
// GET INCOMES
// ========================================
// Route: GET /api/income
// Purpose: Retrieve all income entries for authenticated user
// Query: Filtered by userId, sorted by date (newest first)
// Response: Array of income documents
exports.getIncomes = async (req, res) => {
  try {
    // Step 1: Query database for all incomes belonging to this user
    const incomes = await Income
      .find({ userId: req.user.userId })    // Filter by userId for security
      .sort({ date: -1 });                  // Sort by date descending (newest first)

    // Step 2: Send array of incomes to frontend
    res.json(incomes);
  } catch (err) {
    console.error('Fetch Income Error:', err.message);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// ============= EXPENSE FUNCTIONS =============

// ========================================
// ADD EXPENSE
// ========================================
// Route: POST /api/expense/add
// Purpose: Create a new expense entry for authenticated user
// Request body: { amount, category, date }
// Response: { _id, userId, amount, category, date }
exports.addExpense = async (req, res) => {
  try {
    // Step 1: Extract expense details from request body
    const { amount, category, date } = req.body;
    // Note: userId is extracted from JWT token by authMiddleware

    // Step 2: Create new Expense document
    const expense = new Expense({
      userId: req.user.userId,     // Associate expense with authenticated user
      amount,                       // Expense amount
      category,                     // Expense category (food, transport, etc.)
      date                          // Date of expense
    });

    // Step 3: Save expense to MongoDB
    await expense.save();

    // Step 4: Send saved expense back to frontend
    // Frontend uses this to update state and refresh Dashboard
    res.status(201).json(expense);
  } catch (err) {
    console.error('Expense Add Error:', err.message);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// ========================================
// GET EXPENSES
// ========================================
// Route: GET /api/expense
// Purpose: Retrieve all expense entries for authenticated user
// Query: Filtered by userId, sorted by date (newest first)
// Response: Array of expense documents
exports.getExpenses = async (req, res) => {
  try {
    // Step 1: Query database for all expenses belonging to this user
    const expenses = await Expense
      .find({ userId: req.user.userId })    // Filter by userId for security
      .sort({ date: -1 });                  // Sort by date descending (newest first)

    // Step 2: Send array of expenses to frontend
    res.json(expenses);
  } catch (err) {
    console.error('Fetch Expense Error:', err.message);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// ========================================
// DELETE EXPENSE
// ========================================
// Route: DELETE /api/expense/:id
// Purpose: Remove an expense entry (user can only delete their own expenses)
// URL param: id (expense document ID)
// Response: { message: 'Expense deleted' }
exports.deleteExpense = async (req, res) => {
  try {
    // Step 1: Delete expense by ID, ensuring it belongs to authenticated user
    // findOneAndDelete() prevents user from deleting another user's expenses
    await Expense.findOneAndDelete({
      _id: req.params.id,              // Match expense by ID
      userId: req.user.userId          // Verify ownership (security check)
    });

    // Step 2: Send confirmation to frontend
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    // Handle any database errors
    res.status(500).send('Server error');
  }
};
