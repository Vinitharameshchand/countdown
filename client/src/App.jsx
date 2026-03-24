import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { FinanceProvider } from './contexts/FinanceContext';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
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
  return (
    <FinanceProvider>
      <Router>
        <div className="app-layout">
          <Sidebar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/income" element={<div className="container">Income Page (Coming Soon)</div>} />
              <Route path="/expenses" element={<div className="container">Expenses Page (Coming Soon)</div>} />
              <Route path="/loans" element={<div className="container">Loans Page (Coming Soon)</div>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;
