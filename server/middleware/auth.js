const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    console.log('\n=== Auth Middleware ===')
    console.log('Headers:', req.headers)

    // 1) Check if token exists
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      console.log('No token provided')
      return res.status(401).json({
        success: false,
        message: 'You are not logged in. Please log in to get access.'
      })
    }

    // 2) Verify token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined')
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('Token decoded:', decoded)

      // 3) Check if user still exists
      const user = await User.findById(decoded.id)
      if (!user) {
        console.log('User not found:', decoded.id)
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.'
        })
      }

      // 4) Grant access to protected route
      req.user = user
      console.log('User authenticated:', user._id)
      next()
    } catch (error) {
      console.error('Token verification error:', error)
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your token has expired. Please log in again.'
        })
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.'
      })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error authenticating user',
      error: error.message
    })
  }
}

module.exports = {
  protect
} 