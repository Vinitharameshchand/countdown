/**
 * Calculates the Equated Monthly Installment (EMI) for a fixed-rate loan.
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} tenureMonths - Total number of monthly payments
 * @returns {number} - Calculated EMI rounded to 2 decimal places
 */
function calculateEMI(principal, annualRate, tenureMonths) {
  const r = (annualRate / 100) / 12;
  const n = tenureMonths;
  if (r === 0) return Math.round((principal / n) * 100) / 100;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi * 100) / 100;
}

/**
 * Generates an amortization schedule.
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} months - Total number of months
 * @returns {Array} - Array of objects containing month, principalPaid, interestPaid, and remainingBalance
 */
function amortizationSchedule(principal, annualRate, months) {
  let balance = principal;
  const monthlyRate = (annualRate / 100) / 12;
  const emi = calculateEMI(principal, annualRate, months);
  const schedule = [];

  for (let i = 1; i <= months && balance > 0.01; i++) {
    const interest = balance * monthlyRate;
    let principalPaid = emi - interest;
    
    if (balance < principalPaid) {
      principalPaid = balance;
    }
    
    balance -= principalPaid;
    schedule.push({
      month: i,
      principalPaid: Math.round(principalPaid * 100) / 100,
      interestPaid: Math.round(interest * 100) / 100,
      remainingBalance: Math.round(Math.max(0, balance) * 100) / 100,
    });
  }
  return schedule;
}

/**
 * Simulates extra payments on a loan.
 * @param {number} principal - Current remaining balance
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} originalTenure - Original tenure in months (for base EMI calc)
 * @param {number} extraPayment - Extra amount paid monthly
 * @returns {object} - New payoff months and total interest
 */
function simulateExtraPayment(principal, annualRate, originalTenure, extraPayment) {
  let balance = principal;
  const monthlyRate = (annualRate / 100) / 12;
  const baseEmi = calculateEMI(principal, annualRate, originalTenure);
  let month = 0;
  let totalInterest = 0;

  while (balance > 0.01) {
    month++;
    const interest = balance * monthlyRate;
    let payment = baseEmi + extraPayment;
    
    if (payment > balance + interest) {
      payment = balance + interest;
    }
    
    balance -= (payment - interest);
    totalInterest += interest;
    if (month > 1000) break; // Safety break
  }

  return {
    payoffMonths: month,
    interestTotal: Math.round(totalInterest * 100) / 100,
  };
}

module.exports = {
  calculateEMI,
  amortizationSchedule,
  simulateExtraPayment,
};
