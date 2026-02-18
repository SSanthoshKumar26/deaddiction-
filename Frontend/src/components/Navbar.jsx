import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt2, HiX } from 'react-icons/hi';
import { FaHeartbeat, FaSignOutAlt, FaCalendarCheck, FaLock, FaUserShield, FaStar, FaChevronRight, FaUser } from 'react-icons/fa';
import { FiChevronDown, FiMessageSquare, FiMail, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Clinical Navbar - V6
 * 
 * Features:
 * - Apollo/Fortis Level Minimal UI
 * - Refined Typography & Spacing
 * - Modern Active States with Underlines
 * - Glassmorphic Scrolled State
 * - Preserved Mobile Responsiveness
 */

const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'About', path: '/about' },
];

const Navbar = ({ openReviewModal, onOpenSidebar }) => {
    // --- States ---
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // --- Hooks & Refs ---
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navRef = useRef(null);
    const profileRef = useRef(null);
    const contactRef = useRef(null);

    // --- Dynamic Height Calculation ---
    useEffect(() => {
        const updateHeight = () => {
            if (navRef.current) {
                const height = navRef.current.offsetHeight;
                document.documentElement.style.setProperty('--navbar-height', `${height}px`);
            }
        };
        updateHeight();
        const resizeObserver = new ResizeObserver(() => updateHeight());
        if (navRef.current) resizeObserver.observe(navRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // --- Side Effects ---
    useEffect(() => {
        setIsProfileOpen(false);
        setIsContactOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
            if (contactRef.current && !contactRef.current.contains(e.target)) {
                setIsContactOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Handlers ---
    const handleLogout = useCallback(() => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    }, [logout, navigate]);

    const handleLeaveReview = useCallback(() => {
        setIsContactOpen(false);
        if (openReviewModal) {
            openReviewModal();
        }
    }, [openReviewModal]);

    const toggleContact = () => setIsContactOpen(!isContactOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

    // --- Animation Variants ---

    const dropdownVariants = {
        closed: { opacity: 0, y: 10, scale: 0.95, pointerEvents: 'none' },
        open: { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', transition: { type: 'spring', damping: 20, stiffness: 300 } }
    };

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ease-in-out border-b border-gray-100/50 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-primary-900/5'
                : 'bg-white shadow-sm'
                }`}
        >
            {/* 1. Emergency Top Bar - Reduced Height */}
            <div className="bg-red-600 text-white relative z-[101]">
                <div className="container-custom">
                    <div className="flex justify-center items-center py-1 px-4">
                        <a
                            href="tel:9751055190"
                            className="flex items-center gap-2 hover:text-white/90 transition-all text-[10px] md:text-xs font-semibold tracking-wide group"
                        >
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                            </span>
                            <span className="uppercase">24/7 EMERGENCY HELPLINE:</span>
                            <span className="font-bold border-l border-white/30 pl-2 ml-1">97510 55190</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="container-custom">
                <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-1.5' : 'py-2 lg:py-3'}`}>

                    {/* LEFT: Hamburger + Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onOpenSidebar}
                            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-surface-50 text-surface-700 border border-surface-200 hover:bg-surface-100 transition-all font-bold"
                            aria-label="Open menu"
                        >
                            <HiMenuAlt2 size={22} />
                        </button>

                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                                <FaHeartbeat size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-semibold text-lg tracking-tight text-surface-900 leading-none">
                                    SOBER
                                </span>
                                <span className="hidden xs:block text-[8px] text-surface-500 uppercase tracking-widest font-bold mt-0.5">
                                    Psychiatric Center
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* CENTER: Desktop Navigation - Reduced Gap & Rectangular Modern Links */}
                    <div className="hidden lg:flex items-center gap-4 xl:gap-5 h-full">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`
                                    relative px-3.5 py-1.5 text-sm font-bold transition-all duration-300 rounded-t-lg border-b-2
                                    ${location.pathname === link.path
                                        ? 'text-primary-600 bg-primary-50/80 border-primary-600'
                                        : 'text-gray-600 border-transparent hover:text-primary-600 hover:bg-surface-50'}
                                `}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="activeNavRect"
                                        className="absolute inset-0 bg-primary-50/10 rounded-t-lg -z-10"
                                    />
                                )}
                            </Link>
                        ))}

                        <div
                            className="relative h-full flex items-center"
                            ref={contactRef}
                        >
                            <button
                                onClick={toggleContact}
                                className={`
                                    flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-bold transition-all duration-300 rounded-t-lg border-b-2
                                    ${location.pathname === '/contact' || isContactOpen
                                        ? 'text-primary-600 bg-primary-50/80 border-primary-600'
                                        : 'text-gray-600 border-transparent hover:text-primary-600 hover:bg-surface-50'}
                                `}
                            >
                                Contact
                                <FiChevronDown size={14} className={`transition-transform duration-300 ${isContactOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isContactOpen && (
                                    <motion.div
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        variants={dropdownVariants}
                                        className="absolute top-full right-0 w-56 z-[1050] pt-2 pointer-events-auto"
                                    >
                                        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-1.5 shadow-primary-600/5">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsContactOpen(false);
                                                    navigate('/contact');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-primary-50/50 hover:text-primary-600 transition-all group rounded-lg mx-1.5 text-left"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                                                    <FiMail size={18} />
                                                </div>
                                                Contact Us
                                            </button>
                                            {user && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLeaveReview();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-primary-50/50 hover:text-primary-600 transition-all group border-t border-gray-50 rounded-lg mx-1.5 mt-0.5 text-left"
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                                                        <FiMessageSquare size={18} />
                                                    </div>
                                                    Write a Review
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="flex items-center gap-4 lg:gap-5 h-full">
                        {user ? (
                            <div
                                className="relative hidden md:flex items-center h-full"
                                ref={profileRef}
                            >
                                <button
                                    onClick={toggleProfile}
                                    className={`
                                        group flex items-center gap-2 focus:outline-none pl-1 py-1 rounded-full transition-all border border-transparent
                                        ${isProfileOpen ? 'bg-surface-50' : 'hover:bg-surface-50'}
                                    `}
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-sm transition-all">
                                        <span className="font-bold text-xs">{user.name?.[0].toUpperCase()}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 ml-1 hidden lg:flex">
                                        <span className="text-gray-500 text-sm">Welcome,</span>
                                        <span className="font-semibold text-sm text-surface-900 truncate max-w-[100px]">
                                            {user.name && user.name.split(' ')[0]}
                                        </span>
                                        <FiChevronDown size={12} className={`text-gray-400 transition-transform duration-300 ml-0.5 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial="closed"
                                            animate="open"
                                            exit="closed"
                                            variants={dropdownVariants}
                                            className="absolute top-full right-0 w-64 z-[1050] pt-2 pointer-events-auto"
                                        >
                                            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden shadow-primary-600/5">
                                                <div className="px-5 py-4 border-b border-gray-50 bg-surface-50/50">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                                    <p className="text-[11px] text-gray-500 truncate font-medium lowercase normal-case mt-0.5">{user.email?.toLowerCase()}</p>
                                                </div>
                                                <div className="p-1.5 pt-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsProfileOpen(false);
                                                            navigate('/update-profile');
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-gray-700 hover:bg-primary-50/50 hover:text-primary-600 rounded-lg transition-all group text-left"
                                                    >
                                                        <div className="w-9 h-9 rounded-lg bg-surface-50 flex items-center justify-center text-surface-400 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                                                            <FaUser size={16} />
                                                        </div>
                                                        Update Profile
                                                    </button>
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsProfileOpen(false);
                                                                navigate('/my-appointments');
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-gray-700 hover:bg-primary-50/50 hover:text-primary-600 rounded-lg transition-all group text-left"
                                                        >
                                                            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                                                                <FaCalendarCheck size={16} />
                                                            </div>
                                                            My Appointments
                                                        </button>
                                                    )}
                                                    {user.role === 'admin' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsProfileOpen(false);
                                                                navigate('/admin-dashboard');
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all group text-left"
                                                        >
                                                            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                                <FaUserShield size={16} />
                                                            </div>
                                                            Admin Dashboard
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleLogout();
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all group text-left shadow-sm mt-1"
                                                    >
                                                        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-white group-hover:text-red-600 transition-all shadow-sm">
                                                            <FaSignOutAlt size={16} />
                                                        </div>
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 hover:bg-surface-50 rounded-full"
                            >
                                <FaLock size={12} />
                                SIGN IN
                            </Link>
                        )}

                        {/* MOBILE SIGN IN BUTTON */}
                        {!user && (
                            <Link
                                to="/login"
                                className="lg:hidden flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-xl font-black text-[9px] xs:text-[10px] tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                            >
                                SIGN IN
                            </Link>
                        )}

                        {/* Book Appointment Button - Modernized */}
                        <Link
                            to="/appointment"
                            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <FaCalendarCheck size={16} />
                            <span>Book Appointment</span>
                        </Link>
                    </div>
                </div>
            </div>

        </nav>
    );
};

export default Navbar;