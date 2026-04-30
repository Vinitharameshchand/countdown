import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * HOME PAGE
 * Landing page with introduction
 */

const HomePage = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('authToken');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
            {/* ANIMATED BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
            </div>

            <div className="relative z-10">
                {/* HEADER */}
                <nav className="flex justify-between items-center p-6 md:p-8 max-w-6xl mx-auto">
                    <h1 className="text-2xl font-black text-white">⏳ Countdown</h1>
                    <div className="flex gap-4">
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Dashboard
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-white/60 hover:text-white px-6 py-2 transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </nav>

                {/* HERO SECTION */}
                <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-black text-white mb-6"
                    >
                        Know Your Path to <span className="text-emerald-400">Debt Freedom</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-white/60 mb-8 max-w-2xl mx-auto"
                    >
                        Countdown is your lock-screen first financial companion. Get instant insights on your debt countdown, EMI burden, and financial health status.
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all shadow-lg"
                    >
                        {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
                    </motion.button>
                </div>

                {/* FEATURES SECTION */}
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <h3 className="text-3xl font-bold text-white text-center mb-12">
                        Powerful Features
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: '⏳',
                                title: 'Debt Countdown',
                                desc: 'Know exactly when you\'ll be debt free',
                            },
                            {
                                icon: '📊',
                                title: 'Debt Ratio',
                                desc: 'Color-coded safety indicator',
                            },
                            {
                                icon: '💰',
                                title: 'EMI Calculator',
                                desc: 'Precise monthly payment calculations',
                            },
                            {
                                icon: '🎯',
                                title: 'Smart Insights',
                                desc: 'AI-powered financial recommendations',
                            },
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/30 transition-colors"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h4 className="text-white font-bold mb-2">{feature.title}</h4>
                                <p className="text-white/60 text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
