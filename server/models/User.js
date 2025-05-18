const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['student', 'president', 'finance', 'management'] },
  interests: [String],
});

module.exports = mongoose.model('User', userSchema);