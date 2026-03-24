import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, CreditCard, Activity } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import './Dashboard.css';

const SummaryCard = ({ title, amount, icon: Icon, color, trend }) => (
  <div className="summary-card glass-card">
    <div className="card-header">
      <div className="icon-box" style={{ background: `${color}20`, color }}>
        <Icon size={24} />
      </div>
      <span className="card-title">{title}</span>
    </div>
    <div className="card-body">
      <h2 className="amount">${amount.toLocaleString()}</h2>
      {trend && (
        <div className={`trend ${trend > 0 ? 'up' : 'down'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const { incomes, expenses, loans } = useFinance();

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalLoanBalance = loans.reduce((acc, curr) => acc + curr.remainingBalance, 0);
  const totalEMI = loans.reduce((acc, curr) => acc + curr.emi, 0);

  // Simple Health Score Logic as per README
  const calculateHealthScore = () => {
    if (totalIncome <= 0) return 0;
    let score = 100;
    score -= (50 * totalEMI / (totalIncome || 1));
    score -= (30 * totalExpense / (totalIncome || 1));
    return Math.max(0, Math.round(score));
  };

  const healthScore = calculateHealthScore();

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1 className="serif">Financial Overview</h1>
        <p className="subtitle">Track your path to becoming debt-free.</p>
      </header>

      <div className="summary-grid">
        <SummaryCard 
          title="Total Monthly Income" 
          amount={totalIncome || 5000} 
          icon={TrendingUp} 
          color="#10b981" 
          trend={12}
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={totalExpense || 1200} 
          icon={TrendingDown} 
          color="#ef4444" 
          trend={-5}
        />
        <SummaryCard 
          title="Total Debt" 
          amount={totalLoanBalance || 45000} 
          icon={CreditCard} 
          color="#3b82f6" 
        />
        <div className="health-card glass-card">
          <div className="health-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" strokeDasharray={`${healthScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <text x="18" y="20.35" className="percentage">{healthScore}</text>
            </svg>
          </div>
          <div className="health-info">
            <h3>Loan Health Score</h3>
            <p>{healthScore > 70 ? 'Excellent' : healthScore > 40 ? 'Good' : 'Needs Attention'}</p>
          </div>
        </div>
      </div>

      <div className="main-charts-grid">
        <div className="chart-container glass-card">
          <h3 className="chart-title">Income vs Expenses</h3>
          <div className="placeholder-chart">
             {/* Chart.js will go here */}
             <Activity size={48} className="placeholder-icon" />
             <p>Charts loading...</p>
          </div>
        </div>
        <div className="loan-list-summary glass-card">
          <h3 className="chart-title">Active Loans</h3>
          <div className="loan-items">
            {loans.length > 0 ? loans.map(loan => (
                <div key={loan._id} className="loan-item">
                    <span>Student Loan</span>
                    <strong>${loan.remainingBalance.toLocaleString()}</strong>
                </div>
            )) : (
                <div className="loan-item placeholder">No loans added yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
