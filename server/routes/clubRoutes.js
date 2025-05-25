const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

// Routes
router.post('/', clubController.createClub);
router.get('/', clubController.getAllClubs);
router.get('/:id', clubController.getClubById);
router.put('/:id', clubController.updateClub);
router.delete('/:id', clubController.deleteClub);

module.exports = router;
