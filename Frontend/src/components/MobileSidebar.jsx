import { useEffect } from 'react';
import ReactDOM from 'react-dom';
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
            setTimeout(() => openReviewModal(), 100);
        }
    };

    const sidebarContent = (
        <AnimatePresence>
            {isOpen && (
                <div id="mobile-sidebar-portal" className="fixed inset-0 z-[10000]">
                    {/* Overlay - Fixed to Viewport */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[10001]"
                    />

                    {/* Sidebar - Fixed to Viewport */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "spring", damping: 35, stiffness: 400 }}
                        className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] h-[100dvh] bg-white z-[10002] shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)] flex flex-col border-r border-slate-100"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 bg-white border-b border-slate-50 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                                    <FaHeartbeat size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-display font-bold text-xl text-slate-900 tracking-tight leading-none mb-1">SOBER</span>
                                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest leading-none">Medical Center</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-90"
                                aria-label="Close menu"
                            >
                                <HiX size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-5 space-y-2 overscroll-contain">
                            {/* Main Nav Section */}
                            <div className="space-y-1">
                                <p className="px-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Navigation</p>
                                {[...NAV_LINKS, { name: 'Contact', path: '/contact' }].map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={onClose}
                                        className={`flex items-center justify-between px-4 py-4 rounded-2xl text-[15px] font-bold transition-all ${location.pathname === link.path
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                            : 'text-slate-600 hover:bg-slate-50 active:bg-slate-100'
                                            }`}
                                    >
                                        {link.name}
                                        <FaChevronRight size={12} className={location.pathname === link.path ? 'text-white' : 'text-slate-300'} />
                                    </Link>
                                ))}
                            </div>

                            <div className="py-6">
                                <div className="h-px bg-slate-100 w-full" />
                            </div>

                            {/* User Section */}
                            <div className="space-y-1">
                                <p className="px-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile & Actions</p>
                                {user ? (
                                    <>
                                        {user.role !== 'admin' && (
                                            <Link
                                                to="/my-appointments"
                                                onClick={onClose}
                                                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] font-bold text-slate-700 hover:bg-slate-50 transition-all active:bg-slate-100"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                                                    <FaCalendarCheck size={18} />
                                                </div>
                                                My Appointments
                                            </Link>
                                        )}
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin-dashboard"
                                                onClick={onClose}
                                                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] font-bold text-red-700 bg-red-50/50 hover:bg-red-50 transition-all border border-red-100/50"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                                    <FaUserShield size={18} />
                                                </div>
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLeaveReview}
                                            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] font-bold text-slate-700 hover:bg-slate-50 transition-all active:bg-slate-100"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                                <FaStar size={18} />
                                            </div>
                                            Write a Review
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] font-bold text-red-600 hover:bg-red-50 transition-all mt-4 border border-transparent hover:border-red-100"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                                                <FaSignOutAlt size={18} />
                                            </div>
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center animate-pulse">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 font-display">Welcome to SOBER</p>
                                        <p className="text-[11px] text-slate-500 font-bold leading-relaxed">Sign in from the header to manage your appointments.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer / Emergency - Always visible at bottom */}
                        <div className="p-6 bg-slate-50/80 border-t border-slate-100 space-y-3 flex-shrink-0">
                            <a
                                href="tel:9751055190"
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border-2 border-red-200 bg-white text-red-600 text-[13px] font-black uppercase tracking-wider hover:bg-red-50 transition-all active:scale-95"
                            >
                                <FiPhone size={18} />
                                Helpline: 97510 55190
                            </a>
                            <Link
                                to="/appointment"
                                onClick={onClose}
                                className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-primary-600 text-white font-black text-[15px] uppercase tracking-wider shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95"
                            >
                                <FaCalendarCheck size={20} />
                                Book Visit
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return ReactDOM.createPortal(sidebarContent, document.body);
};

export default MobileSidebar;
