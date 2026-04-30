import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, Zap } from 'lucide-react';
import { calculateCountdown, formatCurrency } from '../utils/calculations';

/**
 * LOCK SCREEN WIDGET COMPONENT
 * 
 * Mimics iOS/Android lock screen widget appearance
 * Shows countdown, EMI, debt ratio, and insights
 * Minimal, clean design with rounded corners and shadows
 */

const WidgetComponent = ({ dashboard, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 h-64 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <p className="text-white mt-2 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!dashboard || !dashboard.countdown) {
        return (
            <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 h-64 flex items-center justify-center">
                <p className="text-white text-center">No debt data available</p>
            </div>
        );
    }

    const { countdown, debtRatio, totalEMI, monthlyIncome, insights } = dashboard;
    const insight = insights && insights[0];

    // Color mapping for debt ratio
    const ratioColors = {
        green: {
            bg: 'bg-gradient-to-br from-emerald-900/40 to-emerald-800/40',
            border: 'border-emerald-500/30',
            text: 'text-emerald-300',
            badge: 'bg-emerald-500/20',
        },
        yellow: {
            bg: 'bg-gradient-to-br from-amber-900/40 to-amber-800/40',
            border: 'border-amber-500/30',
            text: 'text-amber-300',
            badge: 'bg-amber-500/20',
        },
        red: {
            bg: 'bg-gradient-to-br from-red-900/40 to-red-800/40',
            border: 'border-red-500/30',
            text: 'text-red-300',
            badge: 'bg-red-500/20',
        },
    };

    const colorScheme = ratioColors[debtRatio.color] || ratioColors.green;

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* MAIN WIDGET */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`
          ${colorScheme.bg}
          ${colorScheme.border}
          border
          rounded-3xl
          backdrop-blur-sm
          p-6
          shadow-2xl
          hover:shadow-3xl
          transition-shadow
          duration-300
        `}
            >
                {/* HEADER - TITLE */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-white/60 text-xs font-medium tracking-wider uppercase">
                            ⏳ Debt Free Countdown
                        </p>
                        <h1 className="text-white text-lg font-bold mt-1">Freedom Day</h1>
                    </div>
                    <div className={`
            ${colorScheme.badge}
            px-3 py-1
            rounded-full
            ${colorScheme.text}
            text-xs
            font-semibold
            backdrop-blur-sm
            border
            ${colorScheme.border}
          `}>
                        {debtRatio.status === 'safe' && '✅ Safe'}
                        {debtRatio.status === 'caution' && '⚠️ Caution'}
                        {debtRatio.status === 'risk' && '🔴 Risk'}
                    </div>
                </div>

                {/* MAIN COUNTDOWN - LARGE */}
                <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-5 py-4"
                >
                    <div className="text-center">
                        <div className="text-5xl font-black text-white leading-tight">
                            {countdown.years > 0 ? (
                                <span>{countdown.years}y</span>
                            ) : (
                                <span>{countdown.months}m</span>
                            )}
                        </div>
                        <p className="text-white/50 text-xs mt-1 font-medium">
                            {countdown.formatted}
                        </p>
                    </div>
                </motion.div>

                {/* TWO COLUMN GRID - EMI & RATIO */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* EMI BOX */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                        <p className="text-white/50 text-xs font-medium mb-1">💰 Monthly EMI</p>
                        <p className="text-white text-lg font-bold">
                            {formatCurrency(totalEMI, dashboard.user?.currency || 'INR')}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                            of {formatCurrency(monthlyIncome, dashboard.user?.currency || 'INR')}
                        </p>
                    </div>

                    {/* DEBT RATIO BOX */}
                    <div className={`
            ${colorScheme.bg}
            border
            ${colorScheme.border}
            rounded-2xl
            p-3
            backdrop-blur-sm
          `}>
                        <p className={`${colorScheme.text} text-xs font-medium mb-1`}>
                            📊 Debt Ratio
                        </p>
                        <p className={`${colorScheme.text} text-lg font-bold`}>
                            {debtRatio.percentage}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                            {debtRatio.status === 'safe' && 'Healthy'}
                            {debtRatio.status === 'caution' && 'Monitor'}
                            {debtRatio.status === 'risk' && 'Action Needed'}
                        </p>
                    </div>
                </div>

                {/* INSIGHT / ACTION - BOTTOM */}
                {insight && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm mt-4"
                    >
                        <div className="flex items-start gap-2">
                            <div className="text-lg mt-1">
                                {insight.type === 'danger' && '🔴'}
                                {insight.type === 'warning' && '⚠️'}
                                {insight.type === 'success' && '💚'}
                                {insight.type === 'milestone' && '🎯'}
                                {insight.type === 'info' && 'ℹ️'}
                            </div>
                            <div>
                                <p className="text-white text-xs font-bold leading-tight">
                                    {insight.title}
                                </p>
                                <p className="text-white/60 text-xs mt-1 leading-tight">
                                    {insight.message.split(' ').slice(0, 12).join(' ')}
                                    {insight.message.split(' ').length > 12 ? '...' : ''}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/10">
                    <div className="text-left">
                        <p className="text-white/40 text-xs">Pay off date</p>
                        <p className="text-white text-sm font-semibold">
                            {dashboard.payoffDate?.formatted || 'TBD'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/40 text-xs">
                            {dashboard.loanCount} loan{dashboard.loanCount !== 1 ? 's' : ''}
                        </p>
                        <p className="text-white text-sm font-semibold">
                            {formatCurrency(dashboard.totalBalance, dashboard.user?.currency || 'INR')}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* OPTIONAL: SECOND WIDGET - INSIGHTS CAROUSEL */}
            {insights && insights.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl p-4 backdrop-blur-sm border border-white/10"
                >
                    <p className="text-white/60 text-xs font-medium mb-3">Quick Actions</p>
                    <div className="space-y-2">
                        {insights.slice(0, 2).map((insight, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 text-xs text-white/70 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <span className="text-base">{insight.action?.charAt(0) || '→'}</span>
                                <span className="line-clamp-1">{insight.action || insight.title}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default WidgetComponent;
