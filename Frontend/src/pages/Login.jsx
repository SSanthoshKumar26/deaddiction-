import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiAlertCircle, FiEye, FiEyeOff, FiArrowLeft, FiKey, FiCheckCircle } from 'react-icons/fi';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { triggerLoading } = useLoading();

    // View State: 'login' | 'forgot_email' | 'forgot_reset'
    const [view, setView] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Login Form State
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    // Forgot Password State
    const [resetEmail, setResetEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (data.success) {
                login(data.data);
                triggerLoading(1500); // Show full page loader for 1.5s

                // Premium Redirect: Admin goes to Dashboard, Patient goes to Home
                setTimeout(() => {
                    if (data.data.role === 'admin') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/');
                    }
                }, 500); // Small delay to let loader appear first
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!resetEmail) return setError('Please enter your email address.');

        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/forgotpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
            });
            const data = await res.json();

            if (res.ok) {
                setView('forgot_reset');
            } else {
                setError(data.message || 'Failed to send OTP.');
            }
        } catch (err) {
            setError('Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword || !confirmPassword) return setError('All fields are required.');
        if (newPassword !== confirmPassword) return setError('Passwords do not match.');
        if (newPassword.length < 6) return setError('Password must be at least 6 characters.');

        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/resetpassword', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail, otp, password: newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                setView('login');
                setLoginData({ ...loginData, email: resetEmail }); // Pre-fill login email
            } else {
                setError(data.message || 'Failed to reset password.');
            }
        } catch (err) {
            setError('Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // Animation Variants
    const slideVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4 font-sans text-surface-800">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto min-h-[600px] border border-surface-100">

                {/* Left Side: Dynamic Forms */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white">
                    <AnimatePresence mode='wait'>

                        {/* VIEW 1: LOGIN */}
                        {view === 'login' && (
                            <motion.div
                                key="login"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="max-w-sm mx-auto w-full"
                            >
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-primary-900 mb-2 font-display tracking-tight">Welcome Back</h2>
                                    <p className="text-surface-500 text-sm font-medium">Please enter your details to sign in.</p>
                                </div>

                                <form onSubmit={handleLoginSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-2" htmlFor="email">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                                                <FiMail className="text-surface-400 text-lg" />
                                            </div>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                value={loginData.email}
                                                onChange={handleLoginChange}
                                                className="block w-full pl-11 pr-4 py-3.5 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-surface-800 bg-surface-50/50 focus:bg-white placeholder-surface-400 text-sm font-medium"
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-2" htmlFor="password">Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                                                <FiLock className="text-surface-400 text-lg" />
                                            </div>
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={loginData.password}
                                                onChange={handleLoginChange}
                                                className="block w-full pl-11 pr-11 py-3.5 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-surface-800 bg-surface-50/50 focus:bg-white placeholder-surface-400 text-sm font-medium"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-surface-400 hover:text-primary-600 transition-colors focus:outline-none"
                                            >
                                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg">
                                            <FiAlertCircle className="flex-shrink-0 mr-2" /> {error}
                                        </motion.div>
                                    )}

                                    <div className="flex justify-end">
                                        <Link
                                            to="/forgot-password"
                                            className="text-xs font-bold text-primary-600 hover:text-primary-800 hover:underline transition-all"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white font-bold shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide uppercase"
                                    >
                                        {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</span> : <span className="flex items-center">Sign In <FiArrowRight className="ml-2" /></span>}
                                    </button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-surface-100 text-center">
                                    <p className="text-surface-500 text-sm font-medium">
                                        Don't have an account?{' '}
                                        <Link to="/signup" className="font-bold text-primary-700 hover:text-primary-800 transition-colors ml-1">Create Account</Link>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* VIEW 2: FORGOT PASSWORD - EMAIL */}
                        {view === 'forgot_email' && (
                            <motion.div
                                key="forgot_email"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="max-w-sm mx-auto w-full"
                            >
                                <button onClick={() => setView('login')} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 transition-colors text-sm font-bold mb-6 group">
                                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Login
                                </button>

                                <div className="mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 text-xl shadow-sm">
                                        <FiKey />
                                    </div>
                                    <h2 className="text-2xl font-bold text-primary-900 mb-2 font-display">Forgot Password?</h2>
                                    <p className="text-surface-500 text-sm font-medium leading-relaxed">Enter your email address to receive a secure OTP code for password reset.</p>
                                </div>

                                <form onSubmit={handleSendOTP} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-2" htmlFor="resetEmail">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                                                <FiMail className="text-surface-400 text-lg" />
                                            </div>
                                            <input
                                                id="resetEmail"
                                                type="email"
                                                required
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 border border-surface-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-surface-800 bg-surface-50/50 focus:bg-white placeholder-surface-400 text-sm font-medium"
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg">
                                            <FiAlertCircle className="flex-shrink-0 mr-2" /> {error}
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide uppercase"
                                    >
                                        {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</span> : 'Send OTP Code'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* VIEW 3: FORGOT PASSWORD - RESET */}
                        {view === 'forgot_reset' && (
                            <motion.div
                                key="forgot_reset"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="max-w-sm mx-auto w-full"
                            >
                                <button onClick={() => setView('forgot_email')} className="flex items-center gap-2 text-surface-500 hover:text-surface-800 transition-colors text-sm font-bold mb-6 group">
                                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Change Email
                                </button>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-primary-900 mb-2 font-display">Secure Reset</h2>
                                    <p className="text-surface-500 text-sm font-medium">OTP sent to <span className="font-bold text-surface-800">{resetEmail}</span></p>
                                </div>

                                <form onSubmit={handleResetSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-2">OTP Code</label>
                                        <input
                                            type="text"
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="block w-full px-4 py-3.5 border border-surface-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-surface-800 bg-surface-50/50 focus:bg-white text-center font-mono font-bold text-lg tracking-[0.2em]"
                                            placeholder="------"
                                            maxLength={6}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-2">New Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-green-500">
                                                <FiLock className="text-surface-400 text-lg" />
                                            </div>
                                            <input
                                                type="text" // Shown as text initially so user sees what they type or leave as password? Let's generic password
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 border border-surface-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-surface-800 bg-surface-50/50 focus:bg-white placeholder-surface-400 text-sm font-medium"
                                                placeholder="New password (min 6 chars)"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-2">Confirm Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-green-500">
                                                <FiCheckCircle className="text-surface-400 text-lg" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 border border-surface-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-surface-800 bg-surface-50/50 focus:bg-white placeholder-surface-400 text-sm font-medium"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg">
                                            <FiAlertCircle className="flex-shrink-0 mr-2" /> {error}
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white font-bold shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide uppercase"
                                    >
                                        {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Reseting...</span> : 'Set New Password'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Right Side: Image / Decoration */}
                <div className="hidden md:block w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-surface-900 z-10 opacity-95"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551601651-2a8dc88c1e29?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50"></div>

                    {/* Floating Design Elements */}
                    <div className="absolute top-10 right-10 w-20 h-20 border border-white/10 rounded-full z-20"></div>
                    <div className="absolute bottom-20 left-10 w-32 h-32 border-2 border-white/5 rounded-full z-20"></div>

                    <div className="relative z-30 h-full flex flex-col justify-center px-16 text-white">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-md"
                        >
                            {view === 'login' ? (
                                <>
                                    <h3 className="text-4xl font-display font-bold leading-tight mb-4 tracking-tight">
                                        Your Healing <br /><span className="text-primary-200">Journey Continues</span>
                                    </h3>
                                    <p className="text-primary-100 text-lg leading-relaxed opacity-90 border-l-2 border-primary-400 pl-6">
                                        Access your personalized dashboard, track progress, and connect with your care team securely.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-4xl font-display font-bold leading-tight mb-4 tracking-tight">
                                        Secure Account <br /><span className="text-blue-200">Recovery</span>
                                    </h3>
                                    <p className="text-primary-100 text-lg leading-relaxed opacity-90 border-l-2 border-blue-400 pl-6">
                                        We use industry-standard encryption and verification to ensure your medical data remains safe during password resets.
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
