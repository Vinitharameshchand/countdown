import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Loans from './pages/Loans';
import Auth from './pages/Auth';
import { FinanceProvider } from './contexts/FinanceContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { LayoutDashboard, Wallet, Receipt, Calculator, User as UserIcon, Zap } from 'lucide-react';
import './App.css';

const Sidebar = () => (
  <nav className="sidebar glass-card">
    <div className="logo serif">Countdown</div>
    <ul className="nav-links">
      <li><Link to="/"><LayoutDashboard size={20} /> Dashboard</Link></li>
      <li><Link to="/simulator"><Zap size={20} /> Simulator</Link></li>
      <li><Link to="/income"><Wallet size={20} /> Income</Link></li>
      <li><Link to="/expenses"><Receipt size={20} /> Expenses</Link></li>
      <li><Link to="/loans"><Calculator size={20} /> Loans</Link></li>
    </ul>
    <div className="user-section">
      <UserIcon size={20} />
      <span>Alice</span>
    </div>
  </nav>
);

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <CurrencyProvider>
      <FinanceProvider>
        <Router>
          <div className="app-layout">
            <Sidebar />
            <main className="content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/simulator" element={<Simulator />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/loans" element={<Loans />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </FinanceProvider>
    </CurrencyProvider>
  );
}

export default App;
