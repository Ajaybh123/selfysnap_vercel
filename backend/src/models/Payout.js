const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payoutSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'REJECTED'], default: 'PENDING' },
  date: { type: Date, default: Date.now },
  // Add commission and other fields as needed
  commission: { type: Number, default: 0 },
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
});

module.exports = mongoose.model('Payout', payoutSchema);
