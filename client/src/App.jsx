// ========================================
// MAIN APP COMPONENT
// ========================================
// This is the main component that:
// 1. Checks if user is authenticated (token exists)
// 2. Shows Auth page if not authenticated
// 3. Shows Dashboard with navigation if authenticated
// All pages are wrapped in Context Providers for global state management

// Import React and routing libraries
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Import page components
import Dashboard from './pages/Dashboard';      // Home page with financial summary
import Simulator from './pages/Simulator';      // Loan simulation page
import Income from './pages/Income';            // Income tracking page
import Expenses from './pages/Expenses';        // Expense tracking page
import Loans from './pages/Loans';              // Loan management page
import Auth from './pages/Auth';                // Login/Signup page

// Import context providers for global state
import { FinanceProvider } from './contexts/FinanceContext';  // Income/expense/loan state
import { CurrencyProvider } from './contexts/CurrencyContext';  // Currency settings

// Import icons from lucide-react for UI
import { LayoutDashboard, Wallet, Receipt, Calculator, User as UserIcon, Zap } from 'lucide-react';

// Import App styles
import './App.css';

// ========================================
// SIDEBAR NAVIGATION COMPONENT
// ========================================
// Shows navigation menu on the left side of the app
// Links to all main pages (Dashboard, Simulator, Income, Expenses, Loans)
const Sidebar = () => (
  <nav className="sidebar glass-card">
    {/* App logo/title */}
    <div className="logo serif">Countdown</div>

    {/* Navigation links */}
    <ul className="nav-links">
      {/* Dashboard: Financial overview */}
      <li><Link to="/"><LayoutDashboard size={20} /> Dashboard</Link></li>

      {/* Simulator: Test loan payoff scenarios */}
      <li><Link to="/simulator"><Zap size={20} /> Simulator</Link></li>

      {/* Income: Track income sources */}
      <li><Link to="/income"><Wallet size={20} /> Income</Link></li>

      {/* Expenses: Track spending */}
      <li><Link to="/expenses"><Receipt size={20} /> Expenses</Link></li>

      {/* Loans: Manage loans and EMI payments */}
      <li><Link to="/loans"><Calculator size={20} /> Loans</Link></li>
    </ul>

    {/* User profile section */}
    <div className="user-section">
      <UserIcon size={20} />
      <span>Alice</span>  {/* TODO: Replace with actual user name from context */}
    </div>
  </nav>
);

// ========================================
// MAIN APP COMPONENT
// ========================================
function App() {
  // Step 1: Check if user is authenticated
  // JWT token is stored in localStorage after successful login/signup
  const isAuthenticated = !!localStorage.getItem('token');

  // Step 2: If user is NOT authenticated, show ONLY the Auth page
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          {/* Auth page: Login or Signup */}
          <Route path="/auth" element={<Auth />} />

          {/* Redirect any other route to /auth */}
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Router>
    );
  }

  // Step 3: If user IS authenticated, show the main app with all pages
  // Wrap everything in providers for global state management
  return (
    <CurrencyProvider>
      {/* CurrencyProvider: Manages currency selection (USD, INR, etc.) */}

      <FinanceProvider>
        {/* FinanceProvider: Manages income, expense, and loan data fetched from server */}

        <Router>
          {/* Router: Enables navigation between pages */}

          <div className="app-layout">
            {/* Left sidebar with navigation */}
            <Sidebar />

            {/* Main content area */}
            <main className="content">
              <Routes>
                {/* Route to each page */}

                {/* Dashboard: Home page showing financial overview */}
                <Route path="/" element={<Dashboard />} />

                {/* Simulator: Test "what-if" loan payoff scenarios */}
                <Route path="/simulator" element={<Simulator />} />

                {/* Income: Add and view income entries */}
                <Route path="/income" element={<Income />} />

                {/* Expenses: Add and view expense entries */}
                <Route path="/expenses" element={<Expenses />} />

                {/* Loans: Create loans, track EMI, view details */}
                <Route path="/loans" element={<Loans />} />

                {/* Default: Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </FinanceProvider>
    </CurrencyProvider>
  );
}

// Export App component for use in main.jsx
export default App;
