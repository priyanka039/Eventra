const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  club: String,
  imageUrl: String, // URL for the event image
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['idea', 'pending', 'approved', 'live'], default: 'idea' },
  SOP: String, // File URL
  startDate: Date,
  endDate: Date,
  rolesAssigned: [{ userId: mongoose.Schema.Types.ObjectId, role: String }],
  budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
  feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
  rsvpList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RSVP' }],
});

module.exports = mongoose.model('Event', eventSchema);
