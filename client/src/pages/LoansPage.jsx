import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loansAPI } from '../services/api';
import { formatCurrency, formatNumber } from '../utils/calculations';
import { Trash2, Edit2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * LOANS LIST PAGE
 * Shows all loans for the user
 */

const LoansPage = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            const response = await loansAPI.getAll();
            setLoans(response.data.loans);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load loans');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (loanId) => {
        if (window.confirm('Are you sure you want to delete this loan?')) {
            try {
                await loansAPI.delete(loanId);
                setLoans(loans.filter((loan) => loan._id !== loanId));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete loan');
            }
        }
    };

    const getStatusColor = (daysRemaining) => {
        const months = daysRemaining / 30;
        if (months <= 6) return 'text-emerald-400';
        if (months <= 24) return 'text-amber-400';
        return 'text-red-400';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white">💳 Your Loans</h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/loans/add')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        + Add Loan
                    </motion.button>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        <p className="text-white mt-4">Loading loans...</p>
                    </div>
                ) : loans.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-white/10">
                        <p className="text-white/60 text-lg mb-4">No loans yet. Start your debt freedom journey!</p>
                        <button
                            onClick={() => navigate('/loans/add')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Add Your First Loan
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {loans.map((loan, idx) => (
                            <motion.div
                                key={loan._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* LEFT SECTION - Loan Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="text-2xl">
                                                {loan.type === 'home' && '🏠'}
                                                {loan.type === 'auto' && '🚗'}
                                                {loan.type === 'education' && '🎓'}
                                                {loan.type === 'personal' && '💳'}
                                                {loan.type === 'credit-card' && '💰'}
                                                {loan.type === 'other' && '📋'}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-lg">{loan.name}</h3>
                                                <p className="text-white/60 text-sm">
                                                    {loan.type.charAt(0).toUpperCase() + loan.type.slice(1)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                            <div>
                                                <p className="text-white/60">EMI</p>
                                                <p className="text-white font-semibold">
                                                    ₹{formatNumber(loan.emi)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-white/60">Balance</p>
                                                <p className="text-white font-semibold">
                                                    ₹{formatNumber(loan.remainingBalance)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-white/60">Interest</p>
                                                <p className="text-white font-semibold">
                                                    {loan.annualInterestRate}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-white/60">Months Left</p>
                                                <p className={`font-semibold ${getStatusColor(loan.remainingMonths * 30)}`}>
                                                    {loan.remainingMonths}m
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT SECTION - Actions */}
                                    <div className="flex gap-2 md:flex-col md:gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/loans/${loan._id}`)}
                                            className="flex-1 md:flex-none bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Edit2 size={16} />
                                            <span className="hidden md:inline">Edit</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDelete(loan._id)}
                                            className="flex-1 md:flex-none bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={16} />
                                            <span className="hidden md:inline">Delete</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* GO BACK BUTTON */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard')}
                    className="mt-8 flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                    <ArrowRight size={20} className="rotate-180" />
                    Back to Dashboard
                </motion.button>
            </div>
        </div>
    );
};

export default LoansPage;
