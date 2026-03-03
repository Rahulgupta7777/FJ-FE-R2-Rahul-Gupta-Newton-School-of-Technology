const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Ride = require('../models/Ride');

// @desc Request new ride
router.post('/', protect, async (req, res) => {
  try {
    const { pickup, destination, fare, rideType } = req.body;
    const ride = await Ride.create({
      user: req.user._id,
      pickup,
      destination,
      fare,
      rideType: rideType || 'economy'
    });
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get ride history
router.get('/history', protect, async (req, res) => {
  try {
    const rides = await Ride.find({ $or: [{ user: req.user._id }, { driver: req.user._id }] })
      .populate('driver', 'username')
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
