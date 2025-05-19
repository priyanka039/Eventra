const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  amount: Number,
  breakdown: String,
  status: { type: String, enum: ['submitted', 'reviewed', 'approved', 'rejected'], default: 'submitted' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Budget', budgetSchema);
