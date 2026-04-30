import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loansAPI } from '../services/api';
import WidgetComponent from '../components/WidgetComponent';
import { LogOut, Plus, BarChart3 } from 'lucide-react';

/**
 * MAIN DASHBOARD PAGE
 * Shows the lock screen widget and overview
 */

const DashboardPage = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await loansAPI.getDashboard();
            setDashboard({ ...response.data.dashboard, user });
            setError('');
        } catch (err) {
            console.error('Error fetching dashboard:', err);
            setError(err.response?.data?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleAddLoan = () => {
        navigate('/loans/add');
    };

    const handleViewLoans = () => {
        navigate('/loans');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
            {/* HEADER */}
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">
                            ⏳ Countdown
                        </h1>
                        <p className="text-white/60 mt-1">
                            Welcome back, <span className="font-semibold">{user?.name}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* WIDGET SECTION */}
                <div className="mb-8">
                    <p className="text-white/60 text-sm mb-4 font-medium">Your Financial Status</p>
                    <WidgetComponent dashboard={dashboard} isLoading={loading} />
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddLoan}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Plus size={20} />
                        Add Loan
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleViewLoans}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <BarChart3 size={20} />
                        View Loans
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchDashboard}
                        className="bg-slate-700/50 hover:bg-slate-700 border border-white/20 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                        🔄
                        Refresh
                    </motion.button>
                </div>

                {/* INSIGHTS SECTION */}
                {dashboard?.insights && dashboard.insights.length > 0 && (
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
                        <h2 className="text-xl font-bold text-white mb-4">💡 Financial Insights</h2>
                        <div className="space-y-3">
                            {dashboard.insights.map((insight, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`
                    p-4 rounded-xl border
                    ${insight.type === 'danger' ? 'bg-red-500/10 border-red-500/30 text-red-300' : ''}
                    ${insight.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : ''}
                    ${insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : ''}
                    ${insight.type === 'milestone' ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : ''}
                    ${insight.type === 'info' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : ''}
                  `}
                                >
                                    <h3 className="font-semibold mb-1">{insight.title}</h3>
                                    <p className="text-sm opacity-80">{insight.message}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* METRICS GRID */}
                {dashboard?.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                            <p className="text-white/60 text-xs font-medium mb-2">Total Loans</p>
                            <p className="text-2xl font-bold text-white">{dashboard.metrics.loanCount}</p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                            <p className="text-white/60 text-xs font-medium mb-2">Avg Interest</p>
                            <p className="text-2xl font-bold text-white">
                                {dashboard.metrics.averageInterestRate.toFixed(2)}%
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                            <p className="text-white/60 text-xs font-medium mb-2">Shortest Payoff</p>
                            <p className="text-2xl font-bold text-white">
                                {dashboard.metrics.shortestPayoffMonths}m
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                            <p className="text-white/60 text-xs font-medium mb-2">Longest Payoff</p>
                            <p className="text-2xl font-bold text-white">
                                {dashboard.metrics.longestPayoffMonths}m
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
