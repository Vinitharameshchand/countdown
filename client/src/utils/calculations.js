/**
 * CORE BUSINESS LOGIC UTILITIES
 * Mirrors backend logic for client-side calculations
 */

export function calculateEMI(principal, annualInterestRate, loanTenureMonths) {
    if (principal <= 0 || annualInterestRate < 0 || loanTenureMonths <= 0) {
        throw new Error('Invalid loan parameters');
    }

    const monthlyRate = annualInterestRate / 100 / 12;

    if (monthlyRate === 0) {
        return principal / loanTenureMonths;
    }

    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths);
    const denominator = Math.pow(1 + monthlyRate, loanTenureMonths) - 1;

    return numerator / denominator;
}

export function calculateDebtRatio(totalMonthlyEMI, monthlyIncome) {
    if (monthlyIncome <= 0) {
        throw new Error('Monthly income must be positive');
    }

    const ratio = (totalMonthlyEMI / monthlyIncome) * 100;

    let status = 'safe';
    let color = 'green';

    if (ratio > 50) {
        status = 'risk';
        color = 'red';
    } else if (ratio > 30) {
        status = 'caution';
        color = 'yellow';
    }

    return {
        ratio: Math.round(ratio * 100) / 100,
        percentage: `${Math.round(ratio)}%`,
        status,
        color,
        message: {
            safe: '✅ Safe: Good financial headroom',
            caution: '⚠️ Caution: Monitor your debt',
            risk: '🔴 Risk: High debt burden',
        }[status],
    };
}

export function calculateCountdown(totalMonthsRemaining) {
    const years = Math.floor(totalMonthsRemaining / 12);
    const months = Math.floor(totalMonthsRemaining % 12);
    const days = Math.floor((totalMonthsRemaining % 1) * 30);

    return {
        years,
        months,
        days,
        totalMonths: totalMonthsRemaining,
        formatted: `${years}y ${months}m ${days}d`,
        shortFormat: years > 0 ? `${years}y ${months}m` : `${months}m ${days}d`,
    };
}

export function calculatePayoffDate(totalMonthsRemaining) {
    const today = new Date();
    const payoffDate = new Date(
        today.getFullYear(),
        today.getMonth() + totalMonthsRemaining,
        today.getDate()
    );

    return {
        date: payoffDate,
        formatted: payoffDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        timestamp: payoffDate.getTime(),
    };
}

export function formatCurrency(amount, currency = 'INR') {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    });
    return formatter.format(amount);
}

export function formatNumber(num) {
    return Math.round(num).toLocaleString('en-IN');
}
