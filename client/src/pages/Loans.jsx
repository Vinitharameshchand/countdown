import React, { useState } from 'react';
import { Plus, Calculator, Calendar, Percent, Landmark, Trash2 } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { useCurrency } from '../contexts/CurrencyContext';
import './Loans.css';

const Loans = () => {
  const { loans, api, fetchData } = useFinance();
  const { currency } = useCurrency();
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    tenureMonths: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/loan', formData);
      setFormData({ loanAmount: '', interestRate: '', tenureMonths: '', startDate: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      console.error('Error adding loan', err);
    }
  };

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1 className="serif">Debt Manager</h1>
        <p className="subtitle">Consolidate and track your active loans.</p>
      </header>

      <div className="finance-layout">
        {/* Add Form */}
        <section className="form-section glass-card">
          <h3><Landmark size={20} /> New Loan Details</h3>
          <form onSubmit={handleSubmit} className="styled-form">
            <div className="input-group">
              <label>Principal Amount ($)</label>
              <input
                type="number"
                value={formData.loanAmount}
                onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                placeholder="50000"
                required
              />
            </div>
            <div className="grid-2">
              <div className="input-group">
                <label>Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  placeholder="8.5"
                  required
                />
              </div>
              <div className="input-group">
                <label>Tenure (Months)</label>
                <input
                  type="number"
                  value={formData.tenureMonths}
                  onChange={(e) => setFormData({ ...formData, tenureMonths: e.target.value })}
                  placeholder="60"
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Add Loan</button>
          </form>
        </section>

        {/* Loan Cards */}
        <section className="loans-list">
          <h3>Active Portfolios</h3>
          <div className="loans-grid">
            {loans.map((loan) => (
              <motion.div
                key={loan._id}
                className="loan-card glass-card"
                whileHover={{ scale: 1.02 }}
              >
                <div className="loan-card-header">
                  <div className="loan-title">
                    <Landmark size={20} color="var(--accent-primary)" />
                    <span>Standard Loan</span>
                  </div>
                  <div className="loan-emi">EMI: {currency.symbol}{loan.emi.toLocaleString()}</div>
                </div>

                <div className="loan-metrics">
                  <div className="metric">
                    <span className="label">Remaining</span>
                    <div className="value">{currency.symbol}{loan.remainingBalance.toLocaleString()}</div>
                  </div>
                  <div className="metric">
                    <span className="label">Progress</span>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${((loan.loanAmount - loan.remainingBalance) / loan.loanAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="loan-footer">
                  <span>{loan.interestRate}% Interest</span>
                  <span>{loan.tenureMonths} Months Left</span>
                </div>
              </motion.div>
            ))}
            {loans.length === 0 && <div className="placeholder-text">No loans added. Start by adding one in the form on the left.</div>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Loans;
