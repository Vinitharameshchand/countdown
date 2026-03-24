import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Receipt, Tag } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import './FinancePages.css';

const Expenses = () => {
  const { expenses, api, fetchData } = useFinance();
  const [formData, setFormData] = useState({
    amount: '',
    category: 'General',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Food', 'Rent', 'Utilities', 'Travel', 'Entertainment', 'Shopping', 'Healthcare', 'General'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expense', formData);
      setFormData({ amount: '', category: 'General', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      console.error('Error adding expense', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expense/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting expense', err);
    }
  };

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1 className="serif">Expense Tracker</h1>
        <p className="subtitle">Track every penny and optimize your spending.</p>
      </header>

      <div className="finance-layout">
        {/* Add Form */}
        <section className="form-section glass-card">
          <h3><Plus size={20} /> Add New Expense</h3>
          <form onSubmit={handleSubmit} className="styled-form">
            <div className="input-group">
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="styled-select"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
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
            <button type="submit" className="btn-primary">Add Expense</button>
          </form>
        </section>

        {/* List */}
        <section className="list-section glass-card">
          <h3>History</h3>
          <div className="finance-list">
            {expenses.length > 0 ? expenses.map((item) => (
              <motion.div 
                key={item._id} 
                className="list-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="item-info">
                  <div className="icon-box expense"><Receipt size={18} /></div>
                  <div>
                    <div className="item-title">{item.category}</div>
                    <div className="item-date">{new Date(item.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="item-actions">
                    <div className="item-amount negative">-${item.amount.toLocaleString()}</div>
                    <button onClick={() => handleDelete(item._id)} className="delete-btn">
                        <Trash2 size={16} />
                    </button>
                </div>
              </motion.div>
            )) : (
              <div className="placeholder-text">No expenses recorded yet.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Expenses;
