const mongoose = require('mongoose');

const emiPaymentSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true, index: true },
  amountPaid: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['paid', 'pending'], default: 'paid' },
});

module.exports = mongoose.model('EmiPayment', emiPaymentSchema);
