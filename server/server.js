const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Add auth middleware import
const { protect } = require('./middleware/auth');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import models
require('./models/Event');
require('./models/Feedback');
require('./models/RSVP');
require('./models/Budget');
require('./models/Registration');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log('\n=== New Request ===');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  console.log('Params:', JSON.stringify(req.params, null, 2));
  next();
});

// Response logging middleware
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function(data) {
    console.log('\n=== Response ===');
    console.log('Status:', res.statusCode);
    console.log('Data:', data);
    return oldSend.apply(res, arguments);
  };
  next();
});

// Test route (basic)
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is running...',
    timestamp: new Date().toISOString()
  });
});

// JWT Test Routes (add before other routes)
app.get('/api/test/jwt-config', (req, res) => {
  res.json({
    success: true,
    message: 'JWT Configuration Check',
    jwtSecretExists: !!process.env.JWT_SECRET,
    jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not Set'
  });
});

app.get('/api/test/protected', protect, (req, res) => {
  res.json({
    success: true,
    message: 'JWT is working correctly!',
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name
    },
    timestamp: new Date().toISOString()
  });
});

// Main API Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/feedback', feedbackRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\n=== Server Error ===');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  
  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Handle mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  console.log('\n=== 404 Not Found ===');
  console.log(`${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});



const PORT = process.env.PORT || 5273;

app.listen(PORT, () => {
  console.log(`\n=== Server Started ===`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Connected' : 'Not Set'}`);
  console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not Set'}`);
  console.log(`CORS Origin: http://localhost:5173`);
  console.log('\n=== Available Test Routes ===');
  console.log('GET  / - Basic API test');
  console.log('GET  /api/test/jwt-config - Check JWT configuration');
  console.log('GET  /api/test/protected - Test JWT protection (requires auth)');
});



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./db');
// const userRoutes = require('./routes/userRoutes');
// const eventRoutes = require('./routes/eventRoutes');
// const rsvpRoutes = require('./routes/rsvpRoutes');
// const registrationRoutes = require('./routes/registrationRoutes');
// const feedbackRoutes = require('./routes/feedbackRoutes');

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// // Import models
// require('./models/Event');
// require('./models/Feedback');
// require('./models/RSVP');
// require('./models/Budget');
// require('./models/Registration');

// const app = express();

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

// // Body parser middleware with size limit
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Request logging middleware
// app.use((req, res, next) => {
//   console.log('\n=== New Request ===');
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   console.log('Headers:', JSON.stringify(req.headers, null, 2));
//   console.log('Body:', JSON.stringify(req.body, null, 2));
//   console.log('Query:', JSON.stringify(req.query, null, 2));
//   console.log('Params:', JSON.stringify(req.params, null, 2));
//   next();
// });

// // Response logging middleware
// app.use((req, res, next) => {
//   const oldSend = res.send;
//   res.send = function(data) {
//     console.log('\n=== Response ===');
//     console.log('Status:', res.statusCode);
//     console.log('Data:', data);
//     return oldSend.apply(res, arguments);
//   };
//   next();
// });

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/rsvp', rsvpRoutes);
// app.use('/api/registrations', registrationRoutes);
// app.use('/api/feedback', feedbackRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('\n=== Server Error ===');
//   console.error('Error:', err);
//   console.error('Stack:', err.stack);
  
//   // Handle mongoose validation errors
//   if (err.name === 'ValidationError') {
//     return res.status(400).json({
//       success: false,
//       message: 'Validation Error',
//       errors: Object.values(err.errors).map(e => e.message)
//     });
//   }
  
//   // Handle mongoose cast errors (invalid ObjectId)
//   if (err.name === 'CastError') {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid ID format'
//     });
//   }
  
//   // Handle JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid token'
//     });
//   }
  
//   // Default error response
//   res.status(500).json({
//     success: false,
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   console.log('\n=== 404 Not Found ===');
//   console.log(`${req.method} ${req.url}`);
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// // Test route
// app.get('/', (req, res) => {
//   res.json({ 
//     success: true,
//     message: 'API is running...',
//     timestamp: new Date().toISOString()
//   });
// });

// const PORT = process.env.PORT || 5273;

// app.listen(PORT, () => {
//   console.log(`\n=== Server Started ===`);
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
//   console.log(`CORS Origin: http://localhost:5173`);
// });
