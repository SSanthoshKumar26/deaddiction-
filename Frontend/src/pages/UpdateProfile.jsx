import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiCheckCircle, FiAlertCircle, FiSave, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';
import toast from 'react-hot-toast';

const UpdateProfile = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth(); // login function can act as update user

    // Initialize with empty strings to avoid uncontrolled inputs during loading
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '', // Read-only
                mobile: user.mobile || '',
                oldPassword: ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleVerifyOldPassword = async () => {
        if (!formData.oldPassword) return;
        setVerifying(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ oldPassword: formData.oldPassword }),
            });
            const data = await response.json();
            if (data.success) {
                setIsPasswordVerified(true);
                toast.success('Password verified!');
            } else {
                setError(data.message || 'Incorrect current password');
            }
        } catch (err) {
            setError('Verification failed. Try again.');
        } finally {
            setVerifying(false);
        }
    };

    const validateForm = () => {
        const pass = formData.password.trim();
        const confirmPass = formData.confirmPassword.trim();
        const mobile = formData.mobile.replace(/\s+/g, '').trim();

        if (pass && pass !== confirmPass) {
            setError('New passwords do not match.');
            return false;
        }
        if (pass && pass.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (!/^\d{10}$/.test(mobile)) {
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
            const cleanMobile = (str) => {
                if (!str) return '';
                return str.toString().replace(/\s+/g, '').trim();
            };

            const updateData = {
                name: formData.name.trim(),
                mobile: cleanMobile(formData.mobile)
            };

            if (formData.password.trim()) {
                updateData.password = formData.password.trim();
                updateData.oldPassword = formData.oldPassword; // Include verified old password for final safety
            }

            const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (data.success) {
                // Update local user context
                login(data.data);
                toast.success('Profile updated successfully!');
                // Clear password fields and lock
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '', oldPassword: '' }));
                setIsPasswordVerified(false);
            } else {
                setError(data.message || 'Update failed');
            }
        } catch (err) {
            console.error('Update Error:', err);
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50/20 py-4 px-4 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-5xl w-full bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100 flex flex-col"
            >
                {/* COMPACT HEADER */}
                <div className="bg-primary-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                        >
                            <FiArrowLeft className="text-lg group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black tracking-tight font-display leading-tight">Profile Settings</h1>
                            <p className="text-[10px] text-primary-100 font-bold uppercase tracking-widest opacity-80">Security Control Center</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                        <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-inner">
                            <FiUser className="text-primary-600 text-sm" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{user?.name?.split(' ')[0]}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-visible">
                    <form onSubmit={handleSubmit} className="h-full flex flex-col">
                        {/* COMPACT IDENTITY BANNER */}
                        <div className="px-8 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <FiMail className="text-primary-600 text-sm" />
                                </div>
                                <span className="text-xs font-bold text-slate-700">{formData.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[9px] font-black uppercase tracking-tight">
                                <FiCheckCircle /> Verified
                            </div>
                        </div>

                        <div className="p-8 flex-1">
                            <div className="grid grid-cols-2 gap-x-12 items-start h-full">

                                {/* LEFT: Personal Profile */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-4 w-1 bg-primary-600 rounded-full" />
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Personal Information</h3>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="name">Full Identity Name</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                                                    <FiUser size={14} />
                                                </div>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/5 focus:border-primary-600 transition-all outline-none bg-slate-50/30 text-xs font-bold text-slate-800"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="mobile">Contact Number</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                                                    <FiPhone size={14} />
                                                </div>
                                                <input
                                                    id="mobile"
                                                    name="mobile"
                                                    type="tel"
                                                    required
                                                    value={formData.mobile}
                                                    onChange={handleChange}
                                                    className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/5 focus:border-primary-600 transition-all outline-none bg-slate-50/30 text-xs font-bold text-slate-800"
                                                    placeholder="9876543210"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: Security & Privacy */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-4 w-1 bg-indigo-600 rounded-full" />
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Security & Password</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Current Password Field */}
                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="oldPassword">Current Password</label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1 group">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                        <FiLock size={14} className={`${isPasswordVerified ? 'text-emerald-500' : 'text-slate-400'}`} />
                                                    </div>
                                                    <input
                                                        id="oldPassword"
                                                        name="oldPassword"
                                                        type="password"
                                                        value={formData.oldPassword || ''}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            if (isPasswordVerified) setIsPasswordVerified(false);
                                                        }}
                                                        className={`block w-full pl-10 pr-4 py-2.5 border rounded-xl transition-all outline-none text-xs font-bold ${isPasswordVerified
                                                            ? 'border-emerald-200 bg-emerald-50/30 text-emerald-800'
                                                            : 'border-slate-200 bg-slate-50/30 focus:border-indigo-600 text-slate-800'}`}
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOldPassword}
                                                    disabled={!formData.oldPassword || isPasswordVerified || verifying}
                                                    className={`px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all ${isPasswordVerified
                                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                                        : 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-600 active:scale-95 disabled:opacity-50'
                                                        }`}
                                                >
                                                    {verifying ? '...' : isPasswordVerified ? <FiCheck /> : 'Verify'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* New Password Group */}
                                        <div className={`space-y-4 transition-all duration-500 ${!isPasswordVerified ? 'opacity-20 blur-[1px] pointer-events-none scale-[0.98]' : 'opacity-100 blur-0 scale-100'}`}>
                                            <div className="space-y-1.5">
                                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="password">New Password</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600">
                                                        <FiLock size={14} />
                                                    </div>
                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/5 focus:border-primary-600 transition-all outline-none bg-slate-50/30 text-xs font-bold text-slate-800"
                                                        placeholder="Create New Password"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="confirmPassword">Confirm Password</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600">
                                                        <FiCheckCircle size={14} />
                                                    </div>
                                                    <input
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        type="password"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/5 focus:border-primary-600 transition-all outline-none bg-slate-50/30 text-xs font-bold text-slate-800"
                                                        placeholder="Confirm New Password"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 p-2 mt-4 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg justify-center"
                                >
                                    <FiAlertCircle /> {error}
                                </motion.div>
                            )}
                        </div>

                        {/* COMPACT FOOTER */}
                        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                            <p className="text-[10px] text-slate-400 font-medium">All changes are synchronized with your secure medical record.</p>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center gap-2.5 py-3 px-8 rounded-xl text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg transform active:scale-95 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20'
                                    }`}
                            >
                                {loading ? 'Saving...' : <><FiSave /> Synchronize Now</>}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default UpdateProfile;
