const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/send-otp
router.post('/send-otp', authController.sendOtp);

// @route   POST api/auth/verify-otp
router.post('/verify-otp', authController.verifyOtp);

// @route   POST api/auth/login
router.post('/login', authController.login);

// @route   POST api/auth/register
router.post('/register', authController.register);

module.exports = router;

module.exports = router;
