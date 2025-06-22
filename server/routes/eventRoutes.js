const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const eventController = require('../controllers/eventController');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes - require authentication
router.post('/', protect, eventController.createEvent);
router.put('/:id', protect, eventController.updateEvent);
router.delete('/:id', protect, authorize('president', 'management'), eventController.deleteEvent);


module.exports = router;
