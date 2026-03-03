const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const rideController = require('../controllers/rideController');

// @desc Request new ride
router.post('/', protect, rideController.createRide);

// @desc Get ride history
router.get('/history', protect, rideController.getRideHistory);

module.exports = router;

module.exports = router;
