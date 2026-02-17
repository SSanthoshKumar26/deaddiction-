import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { FaHeartbeat, FaSignOutAlt, FaCalendarCheck, FaLock, FaUserShield, FaStar, FaChevronRight } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'About', path: '/about' },
];

const MobileSidebar = ({ isOpen, onClose, openReviewModal }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // --- Side Effects ---
    // Update body overflow to prevent background scrolling when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Also add a class to root if needed, but body is usually enough
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on route change
    useEffect(() => {
        if (isOpen) onClose();
    }, [location.pathname]);

    // --- Handlers ---
    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
    };

    const handleLeaveReview = () => {
        onClose();
        if (openReviewModal) {
            openReviewModal();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay - Fixed to Viewport */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]"
                    />

                    {/* Sidebar - Fixed to Viewport */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 left-0 bottom-0 w-[300px] sm:w-[320px] h-[100vh] bg-white/95 backdrop-blur-2xl z-[9999] shadow-2xl flex flex-col border-r border-white/20"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                                    <FaHeartbeat size={20} />
                                </div>
                                <div>
                                    <span className="font-display font-bold text-xl text-slate-800 tracking-tight block leading-none">SOBER</span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Medical Center</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                aria-label="Close menu"
                            >
                                <HiX size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                            {/* Main Nav */}
                            {[...NAV_LINKS, { name: 'Contact', path: '/contact' }].map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={onClose}
                                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${location.pathname === link.path
                                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {link.name}
                                    <FaChevronRight size={12} className={`transition-transform duration-300 ${location.pathname === link.path ? 'translate-x-0 text-primary-500' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-slate-400'}`} />
                                </Link>
                            ))}

                            {/* Actions Separator */}
                            <div className="py-4">
                                <div className="h-px bg-slate-100 w-full" />
                            </div>

                            {user && (
                                <button
                                    onClick={handleLeaveReview}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-all group text-left"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                        <FaStar size={14} />
                                    </div>
                                    Write a Review
                                </button>
                            )}

                            {/* User Section */}
                            {user ? (
                                <div className="mt-2 space-y-1">
                                    <div className="px-4 py-2 mt-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</p>
                                    </div>
                                    {user.role !== 'admin' && (
                                        <Link
                                            to="/my-appointments"
                                            onClick={onClose}
                                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-all group text-left"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 group-hover:bg-primary-100 transition-colors">
                                                <FaCalendarCheck size={14} />
                                            </div>
                                            My Appointments
                                        </Link>
                                    )}
                                    {user.role === 'admin' && (
                                        <Link
                                            to="/admin-dashboard"
                                            onClick={onClose}
                                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 transition-all group text-left"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                                                <FaUserShield size={14} />
                                            </div>
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all group text-left"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                                            <FaSignOutAlt size={14} />
                                        </div>
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <Link
                                        to="/login"
                                        onClick={onClose}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
                                    >
                                        <FaLock size={14} />
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Footer / Emergency */}
                        <div className="p-4 bg-slate-50/50 border-t border-slate-100 backdrop-blur-sm">
                            <a
                                href="tel:9751055190"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-100 bg-red-50/50 text-red-600 text-xs font-bold uppercase tracking-wide hover:bg-red-50 transition-colors mb-3"
                            >
                                <FiPhone size={14} />
                                24/7 Helpline: 97510 55190
                            </a>
                            <Link
                                to="/appointment"
                                onClick={onClose}
                                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all"
                            >
                                <FaCalendarCheck size={16} />
                                Book Appointment
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileSidebar;
