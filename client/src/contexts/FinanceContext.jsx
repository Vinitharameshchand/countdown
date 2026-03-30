// ========================================
// FINANCE CONTEXT (Global State Management)
// ========================================
// This context manages all financial data for the entire app:
// - Income entries
// - Expense entries
// - Loan data
// 
// Instead of prop drilling, any component can access this data using useFinance()
// All data is automatically fetched when the app loads (if user is authenticated)

// Import React hooks and libraries
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// ========================================
// CREATE CONTEXT
// ========================================
// This creates the context object that will hold the financial data
const FinanceContext = createContext();

// ========================================
// CUSTOM HOOK: useFinance()
// ========================================
// Purpose: Allows components to access finance context data
// Usage: const { incomes, expenses, loans } = useFinance();
// This is much cleaner than useContext(FinanceContext)
export const useFinance = () => useContext(FinanceContext);

// ========================================
// FINANCE PROVIDER COMPONENT
// ========================================
// Wraps the entire app to make financial data available globally
// All components inside this provider can access finance data via useFinance()
export const FinanceProvider = ({ children }) => {
  // ========== STATE MANAGEMENT ==========

  // Array to store all income entries
  // Each income has: { _id, userId, amount, source, date }
  const [incomes, setIncomes] = useState([]);

  // Array to store all expense entries
  // Each expense has: { _id, userId, amount, category, date }
  const [expenses, setExpenses] = useState([]);

  // Array to store all loan entries
  // Each loan has: { _id, userId, loanAmount, interestRate, tenureMonths, emi, remainingBalance, startDate }
  const [loans, setLoans] = useState([]);

  // Loading state to show spinner while fetching data
  const [loading, setLoading] = useState(true);

  // ========== API CONFIGURATION ==========

  // Create axios instance with automatically attached JWT token
  // This axios instance will be used for all API calls
  // Authorization header is automatically added to every request
  const api = axios.create({
    baseURL: 'http://localhost:5001/api',           // Backend API URL
    headers: {
      // Include JWT token from localStorage in every request
      // This ensures the backend knows who the user is
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  // ========== FETCH DATA FUNCTION ==========

  // Purpose: Fetch all financial data from the backend
  // Called on app initialization and whenever state needs to be refreshed
  const fetchData = async () => {
    try {
      // Step 1: Show loading state
      setLoading(true);

      // Step 2: Make parallel API calls for all data
      // Promise.all() waits for all requests to complete
      const [incRes, expRes, loanRes] = await Promise.all([
        api.get('/income'),          // GET all incomes for this user
        api.get('/expense'),         // GET all expenses for this user
        api.get('/loan')             // GET all loans for this user
      ]);

      // Step 3: Update state with fetched data
      setIncomes(incRes.data);       // Store income array
      setExpenses(expRes.data);      // Store expense array
      setLoans(loanRes.data);        // Store loan array

    } catch (err) {
      // Handle any errors (network, auth, etc.)
      console.error('Error fetching finance data', err);
    } finally {
      // Step 4: Hide loading state (whether success or error)
      setLoading(false);
    }
  };

  // ========== SIDE EFFECTS ==========

  // useEffect: Called once when component mounts (component loads for first time)
  useEffect(() => {
    // Step 1: Check if token exists (user is authenticated)
    if (localStorage.getItem('token')) {
      // Step 2: Fetch all financial data from backend
      fetchData();
    }
  }, []);  // Empty dependency array = run only once on mount

  // ========== PROVIDE CONTEXT VALUE ==========

  // Make all data and functions available to child components
  // Any component wrapped by FinanceProvider can access these via useFinance()
  return (
    <FinanceContext.Provider value={{
      incomes,         // All income entries
      expenses,        // All expense entries
      loans,           // All loan entries
      loading,         // Loading state
      fetchData,       // Function to refresh data (use after adding/deleting entries)
      api              // Axios instance for making API calls
    }}>
      {/* All child components have access to the above values */}
      {children}
    </FinanceContext.Provider>
  );
};
