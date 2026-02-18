const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword, sendVerificationOtp, updateProfile, deleteUser, verifyOldPassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// ... existing code ...

// @route   DELETE /api/auth/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/users/:id', protect, admin, deleteUser);

// @route   POST /api/auth/verify-password
// @desc    Verify current password before update
// @access  Private
router.post('/verify-password', protect, verifyOldPassword);

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/send-verification-otp
// @desc    Send Verification OTP
// @access  Public
router.post('/send-verification-otp', sendVerificationOtp);

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

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

module.exports = router;
