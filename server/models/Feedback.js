const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  feedbackText: String,
  rating: Number,
});

module.exports = mongoose.model('Feedback', feedbackSchema);
