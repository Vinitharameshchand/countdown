import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loansAPI } from '../services/api';
import { calculateEMI } from '../utils/calculations';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
 * ADD/EDIT LOAN PAGE
 */

const AddEditLoanPage = () => {
    const { loanId } = useParams();
    const navigate = useNavigate();
    const isEditing = !!loanId;

    const [formData, setFormData] = useState({
        name: '',
        type: 'personal',
        principal: '',
        remainingBalance: '',
        annualInterestRate: '',
        loanTenureMonths: '',
        remainingMonths: '',
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const [calculatedEMI, setCalculatedEMI] = useState(0);
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing) {
            fetchLoan();
        }
    }, [loanId]);

    // Calculate EMI when key values change
    useEffect(() => {
        if (
            formData.principal &&
            formData.annualInterestRate !== '' &&
            formData.loanTenureMonths
        ) {
            try {
                const emi = calculateEMI(
                    parseFloat(formData.principal),
                    parseFloat(formData.annualInterestRate),
                    parseInt(formData.loanTenureMonths)
                );
                setCalculatedEMI(emi);
            } catch (err) {
                console.error('EMI calculation error:', err);
            }
        }
    }, [formData.principal, formData.annualInterestRate, formData.loanTenureMonths]);

    const fetchLoan = async () => {
        try {
            const response = await loansAPI.getById(loanId);
            const loan = response.data.loan;
            setFormData({
                name: loan.name,
                type: loan.type,
                principal: loan.principal,
                remainingBalance: loan.remainingBalance,
                annualInterestRate: loan.annualInterestRate,
                loanTenureMonths: loan.loanTenureMonths,
                remainingMonths: loan.remainingMonths,
                startDate: new Date(loan.startDate).toISOString().split('T')[0],
                notes: loan.notes || '',
            });
            setCalculatedEMI(loan.emi);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load loan');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const data = {
                ...formData,
                principal: parseFloat(formData.principal),
                remainingBalance: parseFloat(formData.remainingBalance),
                annualInterestRate: parseFloat(formData.annualInterestRate),
                loanTenureMonths: parseInt(formData.loanTenureMonths),
                remainingMonths: parseInt(formData.remainingMonths),
                startDate: new Date(formData.startDate),
            };

            if (isEditing) {
                await loansAPI.update(loanId, data);
            } else {
                await loansAPI.create(data);
            }

            navigate('/loans');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save loan');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-white mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/loans')}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </motion.button>
                    <h1 className="text-3xl font-black text-white">
                        {isEditing ? 'Edit Loan' : 'Add New Loan'}
                    </h1>
                </div>

                {/* FORM CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
                >
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ROW 1: Name and Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Loan Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Home Loan, Car Loan"
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Loan Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                                >
                                    <option value="personal">Personal</option>
                                    <option value="home">Home</option>
                                    <option value="auto">Auto</option>
                                    <option value="education">Education</option>
                                    <option value="credit-card">Credit Card</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* ROW 2: Principal and Interest */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Principal Amount (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="principal"
                                    value={formData.principal}
                                    onChange={handleChange}
                                    placeholder="500000"
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Annual Interest Rate (%) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="annualInterestRate"
                                    value={formData.annualInterestRate}
                                    onChange={handleChange}
                                    placeholder="8.5"
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* ROW 3: Tenure and Remaining Months */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Total Loan Tenure (months) *
                                </label>
                                <input
                                    type="number"
                                    name="loanTenureMonths"
                                    value={formData.loanTenureMonths}
                                    onChange={handleChange}
                                    placeholder="60"
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Remaining Months *
                                </label>
                                <input
                                    type="number"
                                    name="remainingMonths"
                                    value={formData.remainingMonths}
                                    onChange={handleChange}
                                    placeholder="48"
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* ROW 4: Remaining Balance */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Remaining Balance (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="remainingBalance"
                                    value={formData.remainingBalance}
                                    onChange={handleChange}
                                    placeholder="400000"
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* CALCULATED EMI - DISPLAY */}
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                            <p className="text-emerald-300 text-sm font-medium mb-1">Calculated Monthly EMI</p>
                            <p className="text-emerald-400 text-3xl font-bold">
                                ₹{calculatedEMI.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* NOTES */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Add any additional notes about this loan..."
                                rows="3"
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors resize-none"
                            />
                        </div>

                        {/* BUTTONS */}
                        <div className="flex gap-4 pt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Saving...' : isEditing ? 'Update Loan' : 'Add Loan'}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => navigate('/loans')}
                                className="flex-1 bg-slate-700/50 hover:bg-slate-700 border border-white/20 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AddEditLoanPage;
