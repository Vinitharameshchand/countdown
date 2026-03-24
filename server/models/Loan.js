const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  loanAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  emi: { type: Number, required: true },
  remainingBalance: { type: Number, required: true },
  startDate: { type: Date, required: true },
});

module.exports = mongoose.model('Loan', loanSchema);
