/**
 * CORE FINANCIAL LOGIC SERVICE
 * Handles all debt calculations, EMI, countdown, and financial metrics
 */

/**
 * Calculate EMI (Equated Monthly Installment)
 * Formula: EMI = (P * r * (1 + r)^n) / ((1 + r)^n - 1)
 *
 * @param {number} principal - Loan amount
 * @param {number} annualInterestRate - Annual interest rate (%)
 * @param {number} loanTenureMonths - Total loan tenure in months
 * @returns {number} Monthly EMI amount
 */
function calculateEMI(principal, annualInterestRate, loanTenureMonths) {
    if (principal <= 0 || annualInterestRate < 0 || loanTenureMonths <= 0) {
        throw new Error('Invalid loan parameters');
    }

    const monthlyRate = annualInterestRate / 100 / 12;

    // If no interest, simply divide principal by months
    if (monthlyRate === 0) {
        return principal / loanTenureMonths;
    }

    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths);
    const denominator = Math.pow(1 + monthlyRate, loanTenureMonths) - 1;

    return numerator / denominator;
}

/**
 * Generate complete amortization schedule
 * Shows remaining balance for each payment
 *
 * @param {number} principal - Initial loan amount
 * @param {number} annualInterestRate - Annual interest rate (%)
 * @param {number} loanTenureMonths - Total loan tenure in months
 * @param {number} extraPayment - Extra monthly payment (optional)
 * @returns {Array} Array of payment details for each month
 */
function generateAmortizationSchedule(
    principal,
    annualInterestRate,
    loanTenureMonths,
    extraPayment = 0
) {
    const monthlyRate = annualInterestRate / 100 / 12;
    const emi = calculateEMI(principal, annualInterestRate, loanTenureMonths);
    const totalPayment = emi + extraPayment;

    const schedule = [];
    let remainingBalance = principal;
    let totalInterestPaid = 0;
    let month = 0;

    while (remainingBalance > 0 && month < loanTenureMonths * 2) {
        // Safety check to prevent infinite loops
        month++;

        const interestForMonth = remainingBalance * monthlyRate;
        const principalPayment = Math.min(totalPayment - interestForMonth, remainingBalance);

        remainingBalance = Math.max(0, remainingBalance - principalPayment);
        totalInterestPaid += interestForMonth;

        schedule.push({
            month,
            payment: Math.min(totalPayment, principalPayment + interestForMonth),
            principal: principalPayment,
            interest: interestForMonth,
            remainingBalance,
        });

        if (remainingBalance <= 0) break;
    }

    return {
        schedule,
        totalMonthsPaid: month,
        totalInterestPaid,
        totalAmountPaid: principal + totalInterestPaid,
    };
}

/**
 * Calculate Debt Ratio
 * Formula: Debt Ratio = Total Monthly EMI / Monthly Income
 *
 * @param {number} totalMonthlyEMI - Total EMI from all loans
 * @param {number} monthlyIncome - User's monthly income
 * @returns {Object} Ratio percentage and safety status
 */
function calculateDebtRatio(totalMonthlyEMI, monthlyIncome) {
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
        ratio: Math.round(ratio * 100) / 100, // Two decimals
        percentage: `${Math.round(ratio)}%`,
        status,
        color,
        message: {
            safe: '✅ Safe: You have good financial headroom',
            caution: '⚠️ Caution: Monitor your debt carefully',
            risk: '🔴 Risk: High debt burden - consider action',
        }[status],
    };
}

/**
 * Calculate countdown to debt freedom
 * Returns years, months, and days until all debt is paid
 *
 * @param {number} totalMonthsRemaining - Total months until payoff
 * @returns {Object} Breakdown of years, months, and days
 */
function calculateCountdown(totalMonthsRemaining) {
    const years = Math.floor(totalMonthsRemaining / 12);
    const months = Math.floor(totalMonthsRemaining % 12);
    const days = Math.floor((totalMonthsRemaining % 1) * 30); // Approximate days

    return {
        years,
        months,
        days,
        totalMonths: totalMonthsRemaining,
        formatted: `${years}y ${months}m ${days}d`,
        shortFormat: years > 0 ? `${years}y ${months}m` : `${months}m ${days}d`,
    };
}

/**
 * Calculate remaining payoff date
 *
 * @param {number} totalMonthsRemaining - Months until payoff
 * @returns {Object} Payoff date information
 */
function calculatePayoffDate(totalMonthsRemaining) {
    const today = new Date();
    const payoffDate = new Date(today.getFullYear(), today.getMonth() + totalMonthsRemaining, today.getDate());

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

/**
 * Simulate extra one-time payment impact
 *
 * @param {Object} loan - Loan details
 * @param {number} oneTimePayment - Extra payment amount
 * @returns {Object} Simulation results showing savings
 */
function simulateExtraOneTimePayment(loan, oneTimePayment) {
    // Original schedule
    const original = generateAmortizationSchedule(
        loan.principal,
        loan.annualInterestRate,
        loan.loanTenureMonths
    );

    // With extra payment
    const modified = generateAmortizationSchedule(
        loan.principal - oneTimePayment,
        loan.annualInterestRate,
        loan.loanTenureMonths
    );

    const monthsSaved = original.totalMonthsPaid - modified.totalMonthsPaid;
    const interestSaved = original.totalInterestPaid - modified.totalInterestPaid;

    return {
        originalMonths: original.totalMonthsPaid,
        newMonths: modified.totalMonthsPaid,
        monthsSaved: Math.max(0, monthsSaved),
        originalInterest: original.totalInterestPaid,
        newInterest: modified.totalInterestPaid,
        interestSaved: Math.max(0, interestSaved),
        payoffDate: calculatePayoffDate(modified.totalMonthsPaid),
    };
}

/**
 * Simulate increased monthly EMI impact
 *
 * @param {Object} loan - Loan details
 * @param {number} extraMonthlyPayment - Extra monthly payment
 * @returns {Object} Simulation results
 */
function simulateExtraMonthlyPayment(loan, extraMonthlyPayment) {
    const original = generateAmortizationSchedule(
        loan.principal,
        loan.annualInterestRate,
        loan.loanTenureMonths
    );

    const modified = generateAmortizationSchedule(
        loan.principal,
        loan.annualInterestRate,
        loan.loanTenureMonths,
        extraMonthlyPayment
    );

    const monthsSaved = original.totalMonthsPaid - modified.totalMonthsPaid;
    const interestSaved = original.totalInterestPaid - modified.totalInterestPaid;

    return {
        originalMonths: original.totalMonthsPaid,
        newMonths: modified.totalMonthsPaid,
        monthsSaved: Math.max(0, monthsSaved),
        originalInterest: original.totalInterestPaid,
        newInterest: modified.totalInterestPaid,
        interestSaved: Math.max(0, interestSaved),
        totalExtraPayment: extraMonthlyPayment * modified.totalMonthsPaid,
        payoffDate: calculatePayoffDate(modified.totalMonthsPaid),
    };
}

/**
 * Generate actionable financial insights
 * Rule-based decision engine
 *
 * @param {Array} loans - Array of all user loans
 * @param {number} monthlyIncome - User's monthly income
 * @returns {Array} Array of insight objects with priority
 */
function generateInsights(loans, monthlyIncome) {
    const insights = [];

    if (!loans || loans.length === 0) {
        return [
            {
                type: 'info',
                title: 'Get Started',
                message: 'Add your first loan to start your debt freedom journey',
                priority: 1,
            },
        ];
    }

    // Calculate totals
    const totalEMI = loans.reduce((sum, loan) => sum + (loan.emi || 0), 0);
    const totalBalance = loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0);
    const debtRatio = calculateDebtRatio(totalEMI, monthlyIncome);

    // HIGH PRIORITY: Risk Zone
    if (debtRatio.ratio > 50) {
        insights.push({
            type: 'danger',
            title: '🔴 Immediate Action Needed',
            message: `Your debt ratio is ${debtRatio.percentage}. Consider reducing expenses or increasing income.`,
            priority: 1,
            action: 'Reduce EMI',
        });
    }

    // MEDIUM-HIGH: Caution Zone
    if (debtRatio.ratio > 30 && debtRatio.ratio <= 50) {
        insights.push({
            type: 'warning',
            title: '⚠️ Monitor Your Debt',
            message: `Debt ratio at ${debtRatio.percentage}. Be cautious with new expenses.`,
            priority: 2,
            action: 'Review Budget',
        });
    }

    // Highest Interest Loan
    const highestInterestLoan = loans.reduce((prev, current) =>
        (prev.annualInterestRate || 0) > (current.annualInterestRate || 0) ? prev : current
    );

    if (highestInterestLoan && highestInterestLoan.annualInterestRate > 10) {
        insights.push({
            type: 'info',
            title: '💡 Focus Strategy',
            message: `"${highestInterestLoan.name}" has ${highestInterestLoan.annualInterestRate}% interest. Pay this first to save money.`,
            priority: 2,
            action: 'Focus on High Interest',
        });
    }

    // Savings Opportunity
    const potentialSavingPerMonth = Math.min(monthlyIncome * 0.1, 10000); // 10% income or 10k
    if (potentialSavingPerMonth > 0) {
        const simulation = loans[0]
            ? simulateExtraMonthlyPayment(loans[0], potentialSavingPerMonth)
            : null;

        if (simulation && simulation.monthsSaved > 0) {
            insights.push({
                type: 'success',
                title: '💰 Savings Opportunity',
                message: `Add ₹${Math.round(potentialSavingPerMonth)}/month to save ${simulation.monthsSaved} months & ₹${Math.round(simulation.interestSaved)} in interest.`,
                priority: 3,
                action: 'Increase Payment',
            });
        }
    }

    // Debt-Free Timeline
    if (loans.length > 0) {
        const months = loans.reduce((sum, loan) => sum + (loan.remainingMonths || 0), 0) / loans.length;
        const countdown = calculateCountdown(months);

        insights.push({
            type: 'milestone',
            title: '🎯 Debt Freedom Timeline',
            message: `${countdown.formatted} until you're completely debt free!`,
            priority: 4,
            action: 'Stay Focused',
        });
    }

    return insights.sort((a, b) => a.priority - b.priority);
}

/**
 * Calculate total metrics across all loans
 *
 * @param {Array} loans - Array of loan objects
 * @returns {Object} Aggregated metrics
 */
function calculateTotalMetrics(loans) {
    if (!loans || loans.length === 0) {
        return {
            totalBalance: 0,
            totalEMI: 0,
            averageInterestRate: 0,
            shortestPayoffMonths: 0,
            longestPayoffMonths: 0,
        };
    }

    const totalBalance = loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0);
    const totalEMI = loans.reduce((sum, loan) => sum + (loan.emi || 0), 0);
    const totalInterestRate = loans.reduce((sum, loan) => sum + (loan.annualInterestRate || 0), 0);

    const payoffMonths = loans.map((loan) => loan.remainingMonths || 0);
    const shortestPayoffMonths = Math.min(...payoffMonths);
    const longestPayoffMonths = Math.max(...payoffMonths);

    return {
        totalBalance,
        totalEMI,
        averageInterestRate: totalInterestRate / loans.length,
        shortestPayoffMonths,
        longestPayoffMonths,
        loanCount: loans.length,
    };
}

module.exports = {
    calculateEMI,
    generateAmortizationSchedule,
    calculateDebtRatio,
    calculateCountdown,
    calculatePayoffDate,
    simulateExtraOneTimePayment,
    simulateExtraMonthlyPayment,
    generateInsights,
    calculateTotalMetrics,
};
