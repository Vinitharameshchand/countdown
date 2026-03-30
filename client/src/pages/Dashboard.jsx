// ========================================
// DASHBOARD PAGE (Home Page)
// ========================================
// This is the main page users see after login.
// Displays financial overview:
// - Total income, expenses, loans
// - Health score (loan-to-income ratio)
// - Active loans summary
// - Option to download financial report
// - Currency selector

// Import icons from lucide-react
import { TrendingUp, TrendingDown, CreditCard, Activity, Download, Globe } from 'lucide-react';

// Import contexts for accessing financial data
import { useFinance } from '../contexts/FinanceContext';     // Get income, expenses, loans
import { useCurrency } from '../contexts/CurrencyContext';    // Get currency symbol

// Import service for report generation
import { generateFinancialReport } from '../services/reportService';

// Import component styles
import './Dashboard.css';

// ========================================
// SUMMARY CARD COMPONENT
// ========================================
// Reusable card component for displaying financial metrics
// Shows: Title, Amount, Icon, Color, Trend percentage
// Props:
//   - title: Card title (e.g., "Monthly Income")
//   - amount: Number to display
//   - icon: Icon component to show
//   - color: Color for the icon box
//   - trend: Percentage change from last month (optional)
//   - symbol: Currency symbol (e.g., "$", "₹")
const SummaryCard = ({ title, amount, icon: Icon, color, trend, symbol }) => (
  <div className="summary-card glass-card">
    {/* Card header with icon and title */}
    <div className="card-header">
      {/* Icon box with background color */}
      <div className="icon-box" style={{ background: `${color}20`, color }}>
        <Icon size={24} />
      </div>
      {/* Card title */}
      <span className="card-title">{title}</span>
    </div>

    {/* Card body with main content */}
    <div className="card-body">
      {/* Display amount in currency format */}
      <h2 className="amount">
        {symbol}{amount.toLocaleString()}
      </h2>

      {/* Show trend if provided (percentage change) */}
      {trend && (
        <div className={`trend ${trend > 0 ? 'up' : 'down'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </div>
      )}
    </div>
  </div>
);

// ========================================
// DASHBOARD COMPONENT (Main)
// ========================================
const Dashboard = () => {
  // Step 1: Get financial data from FinanceContext
  // useFinance() provides: incomes, expenses, loans (all arrays)
  const { incomes, expenses, loans } = useFinance();

  // Step 2: Get currency information from CurrencyContext
  // useCurrency() provides: currency object, all available currencies, changeCurrency function
  const { currency, currencies, changeCurrency } = useCurrency();

  // ========== CALCULATIONS ==========

  // Calculate total income from all income entries
  // reduce() sums all amounts: [500, 1500, 200] → 2200
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate total expenses from all expense entries
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate total remaining loan balance across all loans
  // This decreases as the user makes EMI payments
  const totalLoanBalance = loans.reduce((acc, curr) => acc + curr.remainingBalance, 0);

  // Calculate total monthly EMI obligation
  // This is the sum of all fixed monthly payments
  const totalEMI = loans.reduce((acc, curr) => acc + curr.emi, 0);

  // ========== REPORT DOWNLOAD ==========

  // Function to handle report download button click
  // Generates and downloads a PDF with all financial data
  const handleDownloadReport = () => {
    generateFinancialReport(incomes, expenses, loans);
  };

  // ========== HEALTH SCORE CALCULATION ==========

  // Purpose: Calculate financial health score (0-100)
  // Formula: 100 - (50% × EMI burden) - (30% × expense burden)
  // Score interpretation:
  //   80-100: Excellent (low debt, controlled spending)
  //   60-79: Good (moderate debt)
  //   40-59: Fair (high debt, needs attention)
  //   0-39: Poor (very high debt)
  const calculateHealthScore = () => {
    // Return 0 if no income (can't calculate ratio)
    if (totalIncome <= 0) return 0;

    // Start with perfect score
    let score = 100;

    // Deduct 50% of score based on EMI burden
    // If EMI = 50% of income, subtract 25 points
    score -= (50 * totalEMI / (totalIncome || 1));

    // Deduct 30% of score based on expense burden
    // If expenses = 50% of income, subtract 15 points
    score -= (30 * totalExpense / (totalIncome || 1));

    // Return score clamped between 0 and 100
    return Math.max(0, Math.round(score));
  };

  // Calculate health score
  const healthScore = calculateHealthScore();

  // ========== RENDER ==========

  return (
    <div className="dashboard-container">
      {/* PAGE HEADER */}
      <header className="page-header flex-between">
        {/* Left side: Title and subtitle */}
        <div>
          <h1 className="serif">Financial Overview</h1>
          <p className="subtitle">Track your path to becoming debt-free.</p>
        </div>

        {/* Right side: Currency selector and download button */}
        <div className="header-actions">
          {/* Currency selector dropdown */}
          <div className="currency-selector">
            <Globe size={18} />
            <select
              value={currency.code}
              onChange={(e) => changeCurrency(e.target.value)}
            >
              {/* Show all available currencies */}
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
          </div>

          {/* Download report button */}
          <button
            className="btn-secondary flex-center gap-2"
            onClick={handleDownloadReport}
          >
            <Download size={18} /> Report
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS GRID */}
      {/* Displays 4 key metrics in card format */}
      <div className="summary-grid">
        {/* Card 1: Total Monthly Income */}
        <SummaryCard
          title="Monthly Income"
          amount={totalIncome || 5000}      // Show default if no data
          icon={TrendingUp}                  // Green up arrow
          color="#10b981"                    // Green color
          trend={12}                         // 12% increase from last month
          symbol={currency.symbol}
        />

        {/* Card 2: Total Spending */}
        <SummaryCard
          title="Total Spending"
          amount={totalExpense || 1200}      // Show default if no data
          icon={TrendingDown}                // Red down arrow
          color="#ef4444"                    // Red color
          trend={-5}                         // 5% decrease from last month
          symbol={currency.symbol}
        />

        {/* Card 3: Total Debt Outstanding */}
        <SummaryCard
          title="Debt Portfolio"
          amount={totalLoanBalance || 45000}  // Show default if no data
          icon={CreditCard}                   // Credit card icon
          color="#3b82f6"                     // Blue color
          symbol={currency.symbol}
        />

        {/* Card 4: Health Score Gauge */}
        <div className="health-card glass-card">
          {/* Circular chart showing health score as percentage */}
          <div className="health-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              {/* Background circle */}
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />

              {/* Animated progress circle (filled based on score) */}
              <path
                className="circle"
                strokeDasharray={`${healthScore}, 100`}  // Draw score% of circle
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />

              {/* Score percentage in center */}
              <text x="18" y="20.35" className="percentage">{healthScore}</text>
            </svg>
          </div>

          {/* Health score label and status */}
          <div className="health-info">
            <h3>Loan Health Score</h3>
            {/* Show status based on score */}
            <p>
              {healthScore > 70 ? 'Excellent' : healthScore > 40 ? 'Good' : 'Needs Attention'}
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS AND SUMMARIES */}
      <div className="main-charts-grid">
        {/* Left: Income vs Expense chart */}
        <div className="chart-container glass-card">
          <h3 className="chart-title">Income vs Expenses</h3>
          <div className="placeholder-chart">
            {/* TODO: Replace with Chart.js implementation */}
            <Activity size={48} className="placeholder-icon" />
            <p>Charts loading...</p>
          </div>
        </div>

        {/* Right: Active Loans Summary */}
        <div className="loan-list-summary glass-card">
          <h3 className="chart-title">Active Loans</h3>

          {/* Loop through all loans and display summary */}
          <div className="loan-items">
            {loans.length > 0 ? (
              loans.map(loan => (
                <div key={loan._id} className="loan-item">
                  {/* Loan type (placeholder) */}
                  <span>Student Loan</span>
                  {/* Current loan balance */}
                  <strong>{currency.symbol}{loan.remainingBalance.toLocaleString()}</strong>
                </div>
              ))
            ) : (
              // Show message if no loans
              <div className="loan-item placeholder">No loans added yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export Dashboard component for use in App.jsx
export default Dashboard;
