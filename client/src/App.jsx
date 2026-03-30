// ========================================
// MAIN APP COMPONENT
// ========================================
// This is the main component that:
// 1. Checks if user is authenticated (token exists)
// 2. Shows Auth page if not authenticated
// 3. Shows Dashboard with navigation if authenticated
// All pages are wrapped in Context Providers for global state management

// Import React and routing libraries
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Import page components
import Dashboard from './pages/Dashboard';      // Home page with financial summary
import Simulator from './pages/Simulator';      // Loan simulation page
import Income from './pages/Income';            // Income tracking page
import Expenses from './pages/Expenses';        // Expense tracking page
import Loans from './pages/Loans';              // Loan management page
import Auth from './pages/Auth';                // Login/Signup page
import { LandingPage } from '@landingpage';     // Public landing page

// Import context providers for global state
import { FinanceProvider } from './contexts/FinanceContext';  // Income/expense/loan state
import { CurrencyProvider } from './contexts/CurrencyContext';  // Currency settings

// Import icons from lucide-react for UI
import { LayoutDashboard, Wallet, Receipt, Calculator, User as UserIcon, Zap, Menu, X } from 'lucide-react';

// Import App styles
import './App.css';

// ========================================
// SIDEBAR NAVIGATION COMPONENT
// ========================================
// Shows navigation menu on the left side of the app
// Links to all main pages (Dashboard, Simulator, Income, Expenses, Loans)
const Sidebar = ({ isOpen, onClose }) => (
  <nav className={`sidebar glass-card ${isOpen ? 'open' : ''}`}>
    {/* Close button for mobile */}
    <button className="close-btn" onClick={onClose} aria-label="Close menu">
      <X size={24} />
    </button>

    {/* App logo/title */}
    <div className="logo serif">Countdown</div>

    {/* Navigation links */}
    <ul className="nav-links">
      {/* Dashboard: Financial overview */}
      <li><Link to="/dashboard" onClick={onClose}><LayoutDashboard size={20} /> Dashboard</Link></li>

      {/* Simulator: Test loan payoff scenarios */}
      <li><Link to="/simulator" onClick={onClose}><Zap size={20} /> Simulator</Link></li>

      {/* Income: Track income sources */}
      <li><Link to="/income" onClick={onClose}><Wallet size={20} /> Income</Link></li>

      {/* Expenses: Track spending */}
      <li><Link to="/expenses" onClick={onClose}><Receipt size={20} /> Expenses</Link></li>

      {/* Loans: Manage loans and EMI payments */}
      <li><Link to="/loans" onClick={onClose}><Calculator size={20} /> Loans</Link></li>
    </ul>

    {/* User profile section */}
    <div className="user-section">
      <UserIcon size={20} />
      <span>Alice</span>  {/* TODO: Replace with actual user name from context */}
    </div>
  </nav>
);

// ========================================
// PROTECTED ROUTES WRAPPER
// ========================================
const ProtectedRoutesWrapper = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => (
  <CurrencyProvider>
    <FinanceProvider>
      <div className="app-layout">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Left sidebar with navigation */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main content area */}
        <main className="content">
          {/* Mobile hamburger menu button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Routes>
            {/* Dashboard: Home page showing financial overview */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Simulator: Test "what-if" loan payoff scenarios */}
            <Route path="/simulator" element={<Simulator />} />

            {/* Income: Add and view income entries */}
            <Route path="/income" element={<Income />} />

            {/* Expenses: Add and view expense entries */}
            <Route path="/expenses" element={<Expenses />} />

            {/* Loans: Create loans, track EMI, view details */}
            <Route path="/loans" element={<Loans />} />

            {/* Default: Redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </FinanceProvider>
  </CurrencyProvider>
);

// ========================================
// MAIN APP COMPONENT
// ========================================
function App() {
  // Step 1: Check if user is authenticated
  // JWT token is stored in localStorage after successful login/signup
  const isAuthenticated = !!localStorage.getItem('token');

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Return the Router with routing logic
  return (
    <Router>
      <Routes>
        {/* Landing Page: Public page visible to everyone */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth page: Login or Signup for unauthenticated users */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected routes: Dashboard and app pages */}
        {isAuthenticated && (
          <Route
            path="/*"
            element={
              <ProtectedRoutesWrapper
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            }
          />
        )}

        {/* Redirect unauthenticated users trying to access protected routes to auth */}
        {!isAuthenticated && (
          <Route path="/*" element={<Navigate to="/auth" />} />
        )}
      </Routes>
    </Router>
  );
}

// Export App component for use in main.jsx
export default App;
