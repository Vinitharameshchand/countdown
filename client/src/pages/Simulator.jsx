import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Play, ArrowRight, Zap, Calendar } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import './Simulator.css';

const Simulator = () => {
  const { loans, api } = useFinance();
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [extraPayment, setExtraPayment] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loans.length > 0 && !selectedLoan) {
      setSelectedLoan(loans[0]);
    }
  }, [loans]);

  const handleSimulate = async () => {
    if (!selectedLoan) return;
    setLoading(true);
    try {
      const res = await api.post(`/loan/${selectedLoan._id}/simulate`, {
        extraMonthlyPayment: extraPayment
      });
      setResult(res.data);
    } catch (err) {
      console.error('Simulation failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulator-container">
      <header className="page-header">
        <h1 className="serif">Loan Simulator</h1>
        <p className="subtitle">See how extra payments accelerate your freedom.</p>
      </header>

      <div className="simulator-grid">
        {/* Controls */}
        <div className="simulator-controls glass-card">
          <div className="control-group">
            <label>Select Loan</label>
            <select 
              value={selectedLoan?._id || ''} 
              onChange={(e) => setSelectedLoan(loans.find(l => l._id === e.target.value))}
              className="styled-select"
            >
              {loans.map(loan => (
                <option key={loan._id} value={loan._id}>
                  ${loan.loanAmount.toLocaleString()} Loan ({loan.interestRate}%)
                </option>
              ))}
              {loans.length === 0 && <option>No active loans found</option>}
            </select>
          </div>

          <div className="control-group">
            <div className="label-row">
              <label>Extra Monthly Payment</label>
              <span className="value-display">${extraPayment}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="50" 
              value={extraPayment} 
              onChange={(e) => setExtraPayment(parseInt(e.target.value))}
              className="styled-range"
            />
          </div>

          <button 
            className="btn-primary flex-center gap-2" 
            onClick={handleSimulate}
            disabled={loading || !selectedLoan}
          >
            <Play size={18} fill="white" /> {loading ? 'Computing...' : 'Run Simulation'}
          </button>
        </div>

        {/* Results Area */}
        <div className="simulator-results">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="results-card glass-card"
            >
              <div className="results-header">
                <Zap size={32} color="var(--accent-primary)" />
                <h3>Simulation Results</h3>
              </div>
              
              <div className="metric-compare">
                <div className="metric-box">
                  <span className="label">Original Payoff</span>
                  <div className="value">{result.standardPayoffMonths} Months</div>
                </div>
                <ArrowRight className="arrow" size={24} />
                <div className="metric-box optimized">
                  <span className="label">Optimized Payoff</span>
                  <div className="value">{result.optimizedPayoffMonths} Months</div>
                </div>
              </div>

              <div className="savings-highlight">
                <div className="savings-item">
                  <Calendar size={20} />
                  <span>Time Saved: <strong>{result.monthsSaved} Months</strong></span>
                </div>
              </div>
              
              <p className="insight-text">
                By paying an extra <strong>${result.extraMonthlyPayment}</strong>, you will become debt-free 
                <strong> {Math.floor(result.monthsSaved / 12)} years</strong> faster!
              </p>
            </motion.div>
          ) : (
            <div className="placeholder-results glass-card flex-center">
              <div className="text-center">
                <Settings size={48} className="spin" />
                <p>Adjust parameters and run simulation to see impact.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;
