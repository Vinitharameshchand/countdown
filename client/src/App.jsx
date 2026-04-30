import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LoansPage from './pages/LoansPage';
import AddEditLoanPage from './pages/AddEditLoanPage';

/**
 * MAIN APP COMPONENT
 * Routing configuration
 */

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/loans"
                    element={
                        <PrivateRoute>
                            <LoansPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/loans/add"
                    element={
                        <PrivateRoute>
                            <AddEditLoanPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/loans/:loanId"
                    element={
                        <PrivateRoute>
                            <AddEditLoanPage />
                        </PrivateRoute>
                    }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
