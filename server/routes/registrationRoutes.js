const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const registrationController = require('../controllers/registrationController')

// Log all registration requests
router.use((req, res, next) => {
  console.log('\n=== Registration Route ===')
  console.log(`${req.method} ${req.originalUrl}`)
  console.log('Headers:', req.headers)
  console.log('Body:', req.body)
  next()
})

// Create registration
router.post('/events/:eventId/register', protect, registrationController.createRegistration)

// Get user registrations
router.get('/', protect, registrationController.getUserRegistrations)

// Cancel registration
router.put('/:registrationId/cancel', protect, registrationController.cancelRegistration)

// Submit feedback
router.post('/:registrationId/feedback', protect, registrationController.submitFeedback)

module.exports = router 