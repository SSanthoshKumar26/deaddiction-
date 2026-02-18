const User = require('../models/User');
const Verification = require('../models/Verification');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @desc    Send Verification OTP
// @route   POST /api/auth/send-verification-otp
// @access  Public
exports.sendVerificationOtp = async (req, res) => {
    try {
        const cleanEmail = (str) => str ? str.toString().replace(/[\u200B-\u200D\uFEFF\u00A0\u202F\u205F\u3000]/g, '').replace(/\s+/g, '').toLowerCase().trim() : '';
        const email = cleanEmail(req.body.email);
        const name = req.body.name || 'User';

        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email address' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing verification documents for this email
        await Verification.deleteMany({ email });

        // Create new verification document
        await Verification.create({
            email,
            otp
        });

        // Send Email
        const { emailVerifyTemplate } = require('../utils/emailTemplates');
        const message = `Your verification code is: ${otp}`;
        const htmlTemplate = emailVerifyTemplate(otp);

        try {
            await sendEmail({
                email: email,
                subject: 'Verify Your Email - SOBER Center',
                message,
                html: htmlTemplate
            });

            res.status(200).json({ success: true, message: 'OTP sent to email' });
        } catch (err) {
            console.error('Email Error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email. Please supply a valid email or try again later.'
            });
        }

    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const cleanEmail = (str) => str ? str.toString().replace(/[\u200B-\u200D\uFEFF\u00A0\u202F\u205F\u3000]/g, '').replace(/\s+/g, '').toLowerCase().trim() : '';
        const cleanPassword = (str) => str ? str.toString().replace(/[\u200B-\u200D\uFEFF\u00A0\u202F\u205F\u3000]/g, '').trim() : '';
        const cleanMobile = (str) => str ? str.toString().replace(/\s+/g, '').trim() : '';
        const cleanOtp = (str) => str ? str.toString().replace(/\D/g, '').trim() : '';

        const email = cleanEmail(req.body.email);
        const password = cleanPassword(req.body.password);
        const mobile = cleanMobile(req.body.mobile);
        const name = req.body.name ? req.body.name.trim() : '';
        const confirmPassword = cleanPassword(req.body.confirmPassword);
        const otp = cleanOtp(req.body.otp);

        if (!name || !email || !mobile || !password || !confirmPassword || !otp) {
            return res.status(400).json({ success: false, message: 'Please provide all fields including OTP' });
        }

        // Defensive check for matching passwords
        if (password.trim() !== confirmPassword.trim()) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        // Verify OTP
        const verificationRecord = await Verification.findOne({ email, otp });
        if (!verificationRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Check availability (again, just in case)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            mobile,
            password,
            isVerified: true
        });

        // Delete verification record
        await Verification.deleteOne({ _id: verificationRecord._id });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    createdAt: user.createdAt
                },
                message: 'Registration successful'
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const cleanEmail = (str) => str ? str.toString().replace(/[\u200B-\u200D\uFEFF\u00A0\u202F\u205F\u3000]/g, '').replace(/\s+/g, '').toLowerCase().trim() : '';
        const cleanPassword = (str) => str ? str.toString().replace(/[\u200B-\u200D\uFEFF\u00A0\u202F\u205F\u3000]/g, '').trim() : '';

        const email = cleanEmail(req.body.email);
        const password = cleanPassword(req.body.password);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.role,
                    token: generateToken(user._id)
                },
                message: 'Login successful'
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const cleanEmail = (str) => str ? str.toString().replace(/[\u200B-\u200D\uFEFF\u00A0\u202F\u205F\u3000]/g, '').replace(/\s+/g, '').toLowerCase().trim() : '';
        const email = cleanEmail(req.body.email);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash and set to resetPasswordToken
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        // Set expire to 10 minutes
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        const { forgotPasswordTemplate } = require('../utils/emailTemplates');

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Your OTP is: ${otp}`;
        const htmlTemplate = forgotPasswordTemplate(otp);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Secure Verification Code - SOBER Center',
                message,
                html: htmlTemplate
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error('❌ Email could not be sent (Brevo API Error):', err.message);

            // For Development: Allow proceeding even if email fails
            res.status(200).json({
                success: true,
                data: 'Email failed (API Error). OTP logged to server console for testing.',
                devOtp: otp
            });
        }
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verifyotp
// @access  Public
exports.verifyOtp = async (req, res) => {
    try {
        const cleanEmail = (str) => str ? str.toString().replace(/[\u200B-\u200D\uFEFF\u00A0\u202F\u205F\u3000]/g, '').replace(/\s+/g, '').toLowerCase().trim() : '';
        const cleanOtp = (str) => str ? str.toString().replace(/\D/g, '').trim() : '';

        const email = cleanEmail(req.body.email);
        const otp = cleanOtp(req.body.otp);

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
        }

        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        res.status(200).json({ success: true, message: 'OTP Verified' });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const cleanEmail = (str) => str ? str.toString().replace(/[\u200B-\u200D\uFEFF\u00A0\u202F\u205F\u3000]/g, '').replace(/\s+/g, '').toLowerCase().trim() : '';
        const cleanOtp = (str) => str ? str.toString().replace(/\D/g, '').trim() : '';
        const cleanPassword = (str) => str ? str.toString().replace(/[\u200B-\u200D\uFEFF\u00A0\u202F\u205F\u3000]/g, '').trim() : '';

        const email = cleanEmail(req.body.email);
        const otp = cleanOtp(req.body.otp);
        const password = cleanPassword(req.body.password);

        if (!email || !otp || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email, OTP and new password' });
        }

        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            data: 'Password reset successful',
        });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.mobile = req.body.mobile || user.mobile;

            if (req.body.password) {
                if (!req.body.oldPassword) {
                    return res.status(400).json({
                        success: false,
                        message: 'Old password is required to set a new password'
                    });
                }

                const isMatch = await user.matchPassword(req.body.oldPassword);
                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: 'Incorrect old password'
                    });
                }
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    mobile: updatedUser.mobile,
                    role: updatedUser.role,
                    token: generateToken(updatedUser._id)
                },
                message: 'Profile updated successfully'
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Verify Old Password
// @route   POST /api/auth/verify-password
// @access  Private
exports.verifyOldPassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await user.matchPassword(req.body.oldPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect old password' });
        }

        res.status(200).json({ success: true, message: 'Password verified' });
    } catch (error) {
        console.error('Verify Old Password Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.deleteOne({ _id: req.params.id });

        res.status(200).json({ success: true, message: 'User removed' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
