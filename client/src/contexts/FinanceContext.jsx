import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incRes, expRes, loanRes] = await Promise.all([
        api.get('/income'),
        api.get('/expense'),
        api.get('/loan')
      ]);
      setIncomes(incRes.data);
      setExpenses(expRes.data);
      setLoans(loanRes.data);
    } catch (err) {
      console.error('Error fetching finance data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchData();
    }
  }, []);

  return (
    <FinanceContext.Provider value={{ incomes, expenses, loans, loading, fetchData, api }}>
      {children}
    </FinanceContext.Provider>
  );
};
