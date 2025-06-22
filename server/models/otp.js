const mongoose = require('mongoose');

// Defining OTP schema for temporary storage
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // OTP expires after 5 minutes (300 seconds)
  }
}, {
  timestamps: true
});

// Index for faster queries
otpSchema.index({ email: 1 });

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(email, otp) {
  try {
    const otpRecord = await this.findOne({ email: email.toLowerCase(), otp });
    return otpRecord !== null;
  } catch (error) {
    throw new Error('OTP verification failed');
  }
};

//  Manual clean up (Mongo handles expiry automatically)
otpSchema.statics.cleanExpiredOTPs = async function() {
  try {
    const result = await this.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) }
    });
    console.log(`Cleaned ${result.deletedCount} expired OTP records`);
    return result;
  } catch (error) {
    console.error('Error cleaning expired OTPs:', error);
  }
};

module.exports = mongoose.model('OTP', otpSchema);
