import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '@/constants/config';

interface Income {
  _id: string;
  userId: string;
  amount: number;
  source: string;
  date: string;
}

interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
}

interface Loan {
  _id: string;
  userId: string;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  emi: number;
  remainingBalance: number;
  startDate: string;
}

interface FinanceContextType {
  incomes: Income[];
  expenses: Expense[];
  loans: Loan[];
  loading: boolean;
  fetchData: () => Promise<void>;
  api: any;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: CONFIG.API_BASE_URL,
  });

  // Interceptor to add token to requests
  api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync(CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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
    const checkAuthAndFetch = async () => {
      const token = await SecureStore.getItemAsync(CONFIG.TOKEN_KEY);
      if (token) {
        fetchData();
      } else {
        setLoading(false);
      }
    };
    checkAuthAndFetch();
  }, []);

  return (
    <FinanceContext.Provider value={{
      incomes,
      expenses,
      loans,
      loading,
      fetchData,
      api
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
