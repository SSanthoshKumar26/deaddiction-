import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiCheckCircle, FiAlertCircle, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import API_BASE_URL from '../api/config';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateForm = () => {
        const pass = formData.password;
        const confirmPass = formData.confirmPassword;

        if (pass !== confirmPass) {
            setError('Passwords do not match. Please ensure both fields are identical.');
            return false;
        }
        if (pass.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (!/^\d{10}$/.test(formData.mobile)) {
            setError('Please enter a valid 10-digit mobile number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const trimmedData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                mobile: formData.mobile.trim(),
                password: formData.password.trim()
            };

            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(trimmedData),
            });

            const data = await response.json();

            if (data.success) {
                // Success leads to Login page (Professional flow)
                navigate('/login');
                // Optional: A small silent toast here could be useful to know why they are redirected, 
                // but minimizing it as per "silent" preference, or use a soft success message on login page (advanced).
                // For now, simple redirect.
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Signup Error:', err);
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-card overflow-hidden flex flex-col md:flex-row min-h-[650px]">

                {/* Left Side: Image */}
                <div className="hidden md:block w-5/12 relative bg-secondary-900">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary-900/90 to-primary-900/60"></div>

                    <div className="relative z-10 h-full flex flex-col justify-center px-10 text-white">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-3xl font-display font-bold leading-tight mb-4 tracking-tight">
                                Join Our <br />
                                <span className="text-primary-300">Supportive Community</span>
                            </h3>
                            <p className="text-secondary-100 text-base leading-relaxed mb-8">
                                "The first step towards getting somewhere is to decide you are not going to stay where you are."
                            </p>

                            <div className="space-y-4 border-t border-white/10 pt-8">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <FiCheckCircle className="text-secondary-300 text-sm" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Secure Data</h4>
                                        <p className="text-xs text-white/70">HIPAA Compliant Standard</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <FiUser className="text-secondary-300 text-sm" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Personalized Care</h4>
                                        <p className="text-xs text-white/70">Tailored recovery paths</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12 lg:px-16 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-lg mx-auto w-full"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-3xl font-bold text-surface-900 font-display">Sign Up</h2>
                            <span className="text-[10px] font-bold px-3 py-1 bg-primary-50 text-primary-700 rounded-full uppercase tracking-wider">New Patient</span>
                        </div>

                        <p className="text-surface-600 mb-8 text-sm">Fill in your details to create your secure account.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-1" htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FiUser className="text-surface-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-surface-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all outline-none bg-surface-50/30"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-1" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FiMail className="text-surface-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                        spellCheck="false"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-surface-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all outline-none bg-surface-50/30"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-1" htmlFor="mobile">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FiPhone className="text-surface-400" />
                                    </div>
                                    <input
                                        id="mobile"
                                        name="mobile"
                                        type="tel"
                                        required
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-surface-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all outline-none bg-surface-50/30"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-1" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <FiLock className="text-surface-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-8 py-2.5 border border-surface-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all outline-none bg-surface-50/30"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-surface-400 hover:text-surface-600 transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-xs font-bold text-surface-700 uppercase tracking-wide mb-1" htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <FiCheckCircle className="text-surface-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-surface-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all outline-none bg-surface-50/30"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex items-center p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg"
                                >
                                    <FiAlertCircle className="flex-shrink-0 mr-2" />
                                    <span className="font-medium">{error}</span>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full group flex justify-center py-3.5 px-4 rounded-xl text-white font-bold shadow-lg shadow-secondary-500/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] ${loading ? 'bg-secondary-400 cursor-not-allowed' : 'bg-secondary-600 hover:bg-secondary-700 hover:shadow-secondary-600/30'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Sign Up Now <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-surface-100 text-center">
                            <p className="text-surface-500 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="font-bold text-primary-700 hover:text-primary-800 transition-colors ml-1">
                                    Sign in securely
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
