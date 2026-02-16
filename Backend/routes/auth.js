const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/forgotpassword
// @desc    Forgot Password
// @access  Public
router.post('/forgotpassword', forgotPassword);

// @route   POST /api/auth/verifyotp
// @desc    Verify OTP
// @access  Public
router.post('/verifyotp', verifyOtp);

// @route   PUT /api/auth/resetpassword
// @desc    Reset Password
// @access  Public
router.put('/resetpassword', resetPassword);

module.exports = router;
