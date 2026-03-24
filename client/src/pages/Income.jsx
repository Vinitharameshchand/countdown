import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Wallet, Calendar, DollarSign } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import './FinancePages.css';

const Income = () => {
  const { incomes, api, fetchData } = useFinance();
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/income', formData);
      setFormData({ amount: '', source: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      console.error('Error adding income', err);
    }
  };

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1 className="serif">Income Tracker</h1>
        <p className="subtitle">Manage and monitor your revenue streams.</p>
      </header>

      <div className="finance-layout">
        {/* Add Form */}
        <section className="form-section glass-card">
          <h3><Plus size={20} /> Add New Income</h3>
          <form onSubmit={handleSubmit} className="styled-form">
            <div className="input-group">
              <label>Source</label>
              <input 
                type="text" 
                placeholder="e.g. Salary, Freelance" 
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label>Amount ($)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label>Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Add Income</button>
          </form>
        </section>

        {/* List */}
        <section className="list-section glass-card">
          <h3>History</h3>
          <div className="finance-list">
            {incomes.length > 0 ? incomes.map((item) => (
              <motion.div 
                key={item._id} 
                className="list-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="item-info">
                  <div className="icon-box"><Wallet size={18} /></div>
                  <div>
                    <div className="item-title">{item.source}</div>
                    <div className="item-date">{new Date(item.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="item-amount positive">+${item.amount.toLocaleString()}</div>
              </motion.div>
            )) : (
              <div className="placeholder-text">No income recorded yet.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Income;
