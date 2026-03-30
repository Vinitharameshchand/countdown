// ========================================
// LOAN CALCULATION SERVICE
// ========================================
// Contains complex financial calculations:
// 1. EMI calculation - Monthly payment amount
// 2. Amortization schedule - Payment breakdown month by month
// 3. Simulation - Impact of extra payments
// All calculations use standard financial formulas

// ========================================
// CALCULATE EMI (Equated Monthly Installment)
// ========================================
// Formula: EMI = P × [R(1+R)^N] / [(1+R)^N - 1]
// Where:
//   P = Principal (loan amount)
//   R = Monthly interest rate (annual rate / 100 / 12)
//   N = Number of months (tenure)
// 
// Example: ₹100,000 loan at 10% p.a. for 60 months = ₹2,124.71 EMI
// @param {number} principal - Loan amount
// @param {number} annualRate - Annual interest rate (%)
// @param {number} tenureMonths - Total number of monthly payments
// @returns {number} - Calculated EMI rounded to 2 decimal places
function calculateEMI(principal, annualRate, tenureMonths) {
  // Convert annual rate to monthly decimal
  // Example: 10% annual = 0.00833 monthly
  const r = (annualRate / 100) / 12;
  const n = tenureMonths;

  // Special case: 0% interest (r == 0)
  // If no interest, just divide principal equally across all months
  if (r === 0) return Math.round((principal / n) * 100) / 100;

  // Apply EMI formula
  // Numerator: P × R × (1+R)^N
  // Denominator: (1+R)^N - 1
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  // Round to 2 decimal places for currency
  return Math.round(emi * 100) / 100;
}

// ========================================
// GENERATE AMORTIZATION SCHEDULE
// ========================================
// Creates a month-by-month breakdown showing:
// - How much interest is paid
// - How much principal is paid
// - Remaining balance after payment
// Useful for showing payment history and projections
// @param {number} principal - Loan amount
// @param {number} annualRate - Annual interest rate (%)
// @param {number} months - Total number of months
// @returns {Array} - Array of objects with month details
function amortizationSchedule(principal, annualRate, months) {
  let balance = principal;                           // Start with full loan amount
  const monthlyRate = (annualRate / 100) / 12;      // Convert to monthly rate
  const emi = calculateEMI(principal, annualRate, months);  // Calculate monthly payment
  const schedule = [];

  // Loop through each month until loan is paid off
  for (let i = 1; i <= months && balance > 0.01; i++) {
    // Step 1: Calculate interest for this month
    // Interest = Remaining Balance × Monthly Rate
    const interest = balance * monthlyRate;

    // Step 2: Calculate principal portion
    // Principal = EMI - Interest
    // (The part that actually reduces the loan balance)
    let principalPaid = emi - interest;

    // Step 3: Handle final payment scenario
    // If remaining balance is less than principal portion,
    // adjust so we don't over-pay
    if (balance < principalPaid) {
      principalPaid = balance;
    }

    // Step 4: Update balance for next month
    balance -= principalPaid;

    // Step 5: Record this month's details
    schedule.push({
      month: i,                                       // Month number
      principalPaid: Math.round(principalPaid * 100) / 100,
      interestPaid: Math.round(interest * 100) / 100,
      remainingBalance: Math.round(Math.max(0, balance) * 100) / 100
    });
  }

  return schedule;
}

// ========================================
// SIMULATE EXTRA PAYMENT IMPACT
// ========================================
// Shows how extra monthly payments accelerate loan payoff
// The star feature of Countdown app!
// Example: Regular EMI = ₹2,000, Extra = ₹500 → Pays off 1-2 years earlier
// @param {number} principal - Current remaining balance
// @param {number} annualRate - Annual interest rate (%)
// @param {number} originalTenure - Original tenure (for initial EMI)
// @param {number} extraPayment - Extra monthly payment amount
// @returns {object} - payoffMonths and totalInterest with extra payment
function simulateExtraPayment(principal, annualRate, originalTenure, extraPayment) {
  let balance = principal;                              // Start with remaining balance
  const monthlyRate = (annualRate / 100) / 12;         // Convert to monthly rate
  const baseEmi = calculateEMI(principal, annualRate, originalTenure);  // Original EMI
  let month = 0;                                        // Month counter
  let totalInterest = 0;                                // Running total of interest

  // Loop until loan is paid off
  while (balance > 0.01) {
    month++;

    // Step 1: Calculate interest for this month
    const interest = balance * monthlyRate;

    // Step 2: Calculate total payment (base EMI + extra payment)
    let payment = baseEmi + extraPayment;

    // Step 3: Handle final payment
    // If payment exceeds balance + interest, adjust to exact amount needed
    if (payment > balance + interest) {
      payment = balance + interest;
    }

    // Step 4: Reduce balance by principal portion of payment
    // (Interest portion goes to lender, not reducing balance)
    balance -= (payment - interest);

    // Step 5: Add interest to running total
    totalInterest += interest;

    // Safety break (prevent infinite loops)
    if (month > 1000) break;
  }

  // Return results
  return {
    payoffMonths: month,                              // New payoff time
    interestTotal: Math.round(totalInterest * 100) / 100  // Total interest paid
  };
}

// ========================================
// EXPORT FUNCTIONS
// ========================================
// These functions are used by:
// - loanController.js (for API endpoints)
// - Simulator page (for frontend calculations)
module.exports = {
  calculateEMI,              // Calculate monthly payment
  amortizationSchedule,      // Generate payment schedule
  simulateExtraPayment       // Simulate extra payments
};
