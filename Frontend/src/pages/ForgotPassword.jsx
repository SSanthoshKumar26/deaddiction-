import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiCheckCircle, FiArrowLeft, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & Reset
    const [loading, setLoading] = useState(false);

    // User requested state
    const [otpVerified, setOtpVerified] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!email) return toast.error('Please enter your email');

        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/forgotpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('OTP sent successfully to your email!');
                setStep(2);
            } else {
                toast.error(data.message || 'Failed to send OTP. Please check the email.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!otp) return toast.error('Please enter the OTP');

        setLoading(true);
        try {
            // Step 1 of Reset Flow: Verify OTP
            const res = await fetch('http://localhost:5000/api/auth/verifyotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("OTP Verified Successfully");
                setOtpVerified(true); // Frontend State Update: REVEAL PASSWORD FIELDS
            } else {
                toast.error(data.message || 'Invalid or Expired OTP');
                setOtpVerified(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to verify OTP');
            setOtpVerified(false);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!otpVerified) {
            return toast.error("Session expired. Please verify OTP again.");
        }

        if (!password || !confirmPassword) {
            return toast.error('Please fill in all fields');
        }

        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            // Step 2 of Reset Flow: Set New Password
            const res = await fetch('http://localhost:5000/api/auth/resetpassword', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Password reset successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error(data.message || 'Failed to reset password. Session may have expired.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
                >
                    <div className="p-10">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-600 text-white mb-6 shadow-lg shadow-blue-500/30">
                                {step === 1 ? <FiMail size={32} /> : <FiShield size={32} />}
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                                {step === 1 ? 'Reset Password' : (otpVerified ? 'Set New Password' : 'Verify Identity')}
                            </h2>
                            <p className="text-slate-500 font-medium mt-3">
                                {step === 1
                                    ? 'Enter your email to receive a secure code.'
                                    : (otpVerified
                                        ? 'Identity verified. Create your new password.'
                                        : `Enter the 6-digit code sent to ${email}`)
                                }
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* STEP 1: EMAIL */}
                            {step === 1 && (
                                <motion.form
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleSendOTP}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiMail className="text-slate-400" size={20} />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-700 placeholder:text-slate-400"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            'Send Code'
                                        )}
                                    </button>
                                </motion.form>
                            )}

                            {/* STEP 2: OTP & RESET (Combined dynamic view) */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* OTP Input - ALWAYS VISIBLE in Step 2 */}
                                    <form onSubmit={!otpVerified ? handleVerifyOTP : (e) => e.preventDefault()}>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                            Security Code
                                            {otpVerified && <span className="text-green-500 ml-2 font-bold">(Verified)</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                disabled={otpVerified}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                className={`block w-full px-4 py-4 bg-slate-50 border rounded-xl transition-all text-center font-mono text-3xl font-bold tracking-[0.5em] placeholder:text-slate-300 ${otpVerified
                                                        ? 'border-green-500 text-slate-400 bg-green-50/50'
                                                        : 'border-slate-200 text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500'
                                                    }`}
                                                placeholder="------"
                                                maxLength={6}
                                            />
                                            {otpVerified && (
                                                <div className="absolute inset-y-0 right-4 flex items-center text-green-500">
                                                    <FiCheckCircle size={24} />
                                                </div>
                                            )}
                                        </div>

                                        {!otpVerified && (
                                            <>
                                                <p className="text-xs text-center text-slate-400 mt-3 font-medium">Please check your spam folder or wait 10 mins</p>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                                >
                                                    {loading ? (
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    ) : (
                                                        'Verify Code'
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </form>

                                    {/* PASSWORD FIELDS - DYNAMICALLY REVEALED */}
                                    {otpVerified && (
                                        <motion.form
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ duration: 0.5 }}
                                            onSubmit={handleResetPassword}
                                            className="space-y-5 pt-4 border-t border-slate-100"
                                        >
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <FiLock className="text-slate-400" size={20} />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-700"
                                                        placeholder="Min. 6 characters"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <FiCheckCircle className="text-slate-400" size={20} />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-700"
                                                        placeholder="Re-enter password"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                            >
                                                {loading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    'Reset Password'
                                                )}
                                            </button>
                                        </motion.form>
                                    )}

                                    {!otpVerified && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            Change Email
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-slate-50 px-10 py-5 border-t border-slate-100 flex justify-center">
                        <Link
                            to="/login"
                            className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2"
                        >
                            <FiArrowLeft /> Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
