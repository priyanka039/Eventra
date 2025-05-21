// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password, // In a production app, you should hash this password
      role
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if password matches (in production, you'd use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if role matches
    if (user.role !== role) {
      return res.status(401).json({ error: 'Invalid user role' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;

// // routes/userRoutes.js
// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser } = require('../controllers/userController');
// const { verifyToken } = require('../middleware/authMiddleware');

// // Public Routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// // Protected Example Route
// router.get('/profile', verifyToken, (req, res) => {
//   res.json({ message: `Welcome, user ${req.user.id}`, role: req.user.role });
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// router.post('/register', userController.registerUser);
// router.post('/login', userController.loginUser);
// router.get('/', userController.getAllUsers);

// module.exports = router;
