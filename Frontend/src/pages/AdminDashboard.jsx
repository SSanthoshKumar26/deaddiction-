import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiUsers, FiStar, FiLogOut, FiTrendingUp, FiSearch, FiSettings, FiClock,
    FiGrid, FiMenu, FiX, FiCheck, FiXCircle, FiCalendar, FiEye, FiTrash2, FiSmartphone, FiMail,
    FiCheckCircle, FiMinusCircle, FiUserPlus, FiMoreHorizontal, FiDownload, FiFileText, FiImage,
    FiPieChart, FiBarChart2, FiLayers, FiMessageSquare
} from 'react-icons/fi';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Skeleton, { SkeletonStats } from '../components/SkeletonLoader';

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

const SidebarItem = ({ icon, label, active, onClick, mobileOnly = false }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 relative group overflow-hidden ${active
            ? 'text-white bg-white/10 shadow-lg border-r-4 border-blue-500'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
            } ${mobileOnly ? 'md:hidden' : ''}`}
    >
        <span className={`text-xl transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
            {icon}
        </span>
        <span className={`font-semibold tracking-wide text-sm ${active ? 'font-bold' : ''}`}>
            {label}
        </span>
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-500/10 z-[-1]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
    </button>
);

const StatCard = ({ title, value, icon, color, trend }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        amber: "bg-amber-50 text-amber-600 ring-amber-100",
        emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        purple: "bg-purple-50 text-purple-600 ring-purple-100"
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group h-full"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity rounded-bl-3xl`}>
                <div className="text-6xl">{icon}</div>
            </div>

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl shadow-sm ring-1 ${colorClasses[color] || 'bg-slate-50 text-slate-600 ring-slate-100'}`}>
                    {icon}
                </div>
                {trend && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <FiTrendingUp size={10} /> {trend}
                    </span>
                )}
            </div>

            <h3 className="text-3xl font-black text-slate-800 mb-1">{value}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {title}
            </p>
        </motion.div>
    );
};



const StatusBadge = ({ status }) => {
    const styles = {
        Pending: "bg-amber-50 text-amber-600 border-amber-200 ring-amber-500/20",
        Confirmed: "bg-blue-50 text-blue-600 border-blue-200 ring-blue-500/20",
        Completed: "bg-emerald-50 text-emerald-600 border-emerald-200 ring-emerald-500/20",
        Cancelled: "bg-slate-50 text-slate-600 border-slate-200 ring-slate-500/20",
        Rejected: "bg-red-50 text-red-600 border-red-200 ring-red-500/20",
        'No-show': "bg-rose-50 text-rose-600 border-rose-200 ring-rose-500/20",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-1 ${styles[status] || styles.Pending}`}>
            {status}
        </span>
    );
};

// ----------------------------------------------------------------------
// MAIN ADMIN DASHBOARD
// ----------------------------------------------------------------------

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Data
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({
        total: 0, pending: 0, confirmed: 0, today: 0,
        approvedToday: 0, checkedIn: 0, noShow: 0, activeDoctors: 0
    });

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const reportRef = useRef(null);

    const handleDeleteReview = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.delete(`http://localhost:5000/api/reviews/${id}`, config);
            if (res.data.success) {
                toast.success("Review deleted");
                setReviews(reviews.filter(r => r._id !== id));
            }
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    // Initial Fetch
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchAllData();
    }, [user, navigate]);

    const fetchAllData = async () => {
        setDataLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const [aptRes, userRes, reviewRes] = await Promise.all([
                axios.get('http://localhost:5000/api/appointments/admin/all', config),
                axios.get('http://localhost:5000/api/admin/users', config),
                axios.get('http://localhost:5000/api/reviews', config)
            ]);

            if (aptRes.data.success) {
                setAppointments(aptRes.data.data);
                calculateStats(aptRes.data.data);
            }

            if (userRes.data.success) {
                setPatients(userRes.data.data);
            }

            if (reviewRes.data.success) {
                setReviews(reviewRes.data.data);
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to sync data");
        } finally {
            setDataLoading(false);
        }
    };

    const calculateStats = (data) => {
        const todayStr = new Date().toDateString();
        setStats({
            total: data.length,
            pending: data.filter(a => a.status === 'Pending').length,
            confirmed: data.filter(a => a.status === 'Confirmed').length,
            today: data.filter(a => new Date(a.preferredDate).toDateString() === todayStr).length,
            approvedToday: data.filter(a => a.confirmedAt && new Date(a.confirmedAt).toDateString() === todayStr).length,
            checkedIn: data.filter(a => a.checkedIn).length,
            noShow: data.filter(a => a.status === 'No-show').length,
            activeDoctors: new Set(data.filter(a => new Date(a.preferredDate).toDateString() === todayStr).map(a => a.preferredDoctor)).size
        });
    };

    // Actions
    const handleStatusUpdate = async (id, action) => {
        if (!window.confirm(`Confirm action: ${action.toUpperCase()}?`)) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/appointments/admin/${action}/${id}`, {}, config);
            toast.success(`Success: Appointment ${action}`);
            fetchAllData();
            setSelectedAppointment(null);
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("WARNING: Delete this record permanently?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/appointments/admin/${id}`, config);
            toast.success("Record deleted");
            fetchAllData();
            setSelectedAppointment(null);
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    // Export Functions
    const downloadFullReport = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for more columns

        // Title and Header
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42);
        doc.text("SOBER PSYCHIATRIC CENTER - MASTER APPOINTMENT REGISTRY", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated by Administrator: ${user.name} | Timestamp: ${new Date().toLocaleString()}`, 14, 28);
        doc.line(14, 32, 283, 32); // Horizontal line

        // Define Columns
        const tableColumn = ["REF ID", "PATIENT IDENTITY", "DEMOGRAPHICS", "CONTACT DETAILS", "APPOINTMENT SCHEDULE", "CLINICAL CONCERN", "ASSIGNED SPECIALIST", "CURRENT STATUS"];

        // Map Data
        const tableRows = appointments.map(apt => [
            apt.appointmentId || apt._id.substring(0, 8).toUpperCase(),
            apt.fullName,
            `${apt.age || 'N/A'} Yrs / ${apt.gender || 'N/A'}`,
            `${apt.phone}\n${apt.email}`,
            `${new Date(apt.preferredDate).toLocaleDateString()}\n${apt.preferredTimeSlot || 'Soft Booking'}`,
            apt.primaryConcern || 'General Inquiry',
            apt.preferredDoctor || 'Pending Assignment',
            apt.status.toUpperCase()
        ]);

        // Generate Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: {
                fillColor: [15, 23, 42],
                textColor: 255,
                fontSize: 8,
                fontStyle: 'bold',
                halign: 'center',
                valign: 'middle',
                minCellHeight: 12
            },
            bodyStyles: {
                fontSize: 8,
                textColor: [51, 65, 85],
                valign: 'middle'
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: {
                0: { cellWidth: 25, fontStyle: 'bold' }, // Ref
                1: { cellWidth: 35, fontStyle: 'bold' }, // Name
                2: { cellWidth: 25 }, // Age/Sex
                3: { cellWidth: 50 }, // Contact
                4: { cellWidth: 35 }, // Schedule
                5: { cellWidth: 40 }, // Concern
                6: { cellWidth: 35 }, // Doctor
                7: { cellWidth: 25, fontStyle: 'bold', halign: 'center' } // Status
            },
            margin: { top: 40 },
            didDrawPage: (data) => {
                // Footer
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text('CONFIDENTIAL MEDICAL RECORD - FOR INTERNAL USE ONLY', 14, doc.internal.pageSize.height - 10);
                doc.text(`Page ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
            }
        });

        doc.save(`SOBER_Master_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success("Detailed report downloaded successfully");
    };

    const downloadIndividualReport = (apt) => {
        const doc = new jsPDF('p', 'mm', 'a4');

        // Header
        doc.setFillColor(15, 23, 42); // Dark Blue Header
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("SOBER PSYCHIATRIC CENTER", 105, 18, { align: "center" });
        doc.setFontSize(10);
        doc.text("Center of Excellence in De-addiction & Mental Health", 105, 26, { align: "center" });

        // Document Title
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(16);
        doc.text("OFFICIAL APPOINTMENT RECEIPT", 105, 55, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(20, 60, 190, 60);

        // Grid Content
        const startY = 70;
        const lineHeight = 12;

        doc.setFontSize(11);

        // Left Column (Labels)
        doc.setFont("helvetica", "bold");
        doc.text("Reference ID:", 20, startY);
        doc.text("Patient Name:", 20, startY + lineHeight);
        doc.text("Contact No:", 20, startY + lineHeight * 2);
        doc.text("Gender / Age:", 20, startY + lineHeight * 3);
        doc.text("Preferred Date:", 20, startY + lineHeight * 4);
        doc.text("Preferred Time:", 20, startY + lineHeight * 5);
        doc.text("Assigned Doctor:", 20, startY + lineHeight * 6);
        doc.text("Clinical Status:", 20, startY + lineHeight * 7);

        // Right Column (Values)
        doc.setFont("helvetica", "normal");
        doc.text(apt.appointmentId || apt._id.substring(0, 8).toUpperCase(), 80, startY);
        doc.text(apt.fullName, 80, startY + lineHeight);
        doc.text(apt.phone, 80, startY + lineHeight * 2);
        doc.text(`${apt.gender || 'N/A'} / ${apt.age || 'N/A'}`, 80, startY + lineHeight * 3);
        doc.text(new Date(apt.preferredDate).toLocaleDateString(), 80, startY + lineHeight * 4);
        doc.text(apt.preferredTimeSlot || 'Unspecified', 80, startY + lineHeight * 5);
        doc.text(apt.preferredDoctor || 'Pending Assignment', 80, startY + lineHeight * 6);

        // Status Logic for PDF Badge
        let statusR = 245, statusG = 158, statusB = 11; // Default Amber
        if (apt.status === 'Confirmed') { statusR = 16; statusG = 185; statusB = 129; } // Emerald
        else if (apt.status === 'Rejected') { statusR = 239; statusG = 68; statusB = 68; } // Red
        else if (apt.status === 'Completed') { statusR = 59; statusG = 130; statusB = 246; } // Blue

        doc.setFillColor(statusR, statusG, statusB);
        // Draw centered badge
        doc.roundedRect(80, startY + lineHeight * 7 - 4, 30, 6, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(apt.status.toUpperCase(), 95, startY + lineHeight * 7, { align: 'center' });

        // Reset
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");

        // Description Box
        doc.setFont("helvetica", "bold");
        doc.text("Primary Concern / Notes:", 20, startY + lineHeight * 9);
        doc.setFont("helvetica", "normal");
        doc.rect(20, startY + lineHeight * 9 + 5, 170, 30);
        doc.text(doc.splitTextToSize(apt.primaryConcern || "No specific details provided.", 160), 25, startY + lineHeight * 9 + 15);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("This is a computer-generated document. No signature is required.", 105, 280, { align: "center" });
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: "center" });

        doc.save(`Receipt_${apt.appointmentId || apt._id}.pdf`);
        toast.success("Receipt downloaded successfully");
    };

    const downloadReceipt = async (format) => {
        if (!selectedAppointment || !reportRef.current) return;
        setIsDownloading(true);
        const toastId = toast.loading("Generating receipt...");

        try {
            const element = reportRef.current;
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
            const imgData = canvas.toDataURL('image/png');

            if (format === 'pdf') {
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Receipt_${selectedAppointment.appointmentId}.pdf`);
            } else {
                const link = document.createElement('a');
                link.download = `Receipt_${selectedAppointment.appointmentId}.png`;
                link.href = imgData;
                link.click();
            }
            toast.success("Receipt downloaded", { id: toastId });
        } catch (e) {
            toast.error("Export failed", { id: toastId });
        } finally {
            setIsDownloading(false);
        }
    };

    // Filter Logic
    const filteredAppointments = appointments.filter(a =>
        a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.appointmentId && a.appointmentId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredReviews = reviews.filter(r =>
        (r.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden">
            <Toaster position="top-right" />

            {/* MOBILE OVERLAY */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* NEW GLASSY SIDEBAR */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="fixed md:sticky top-0 left-0 z-50 w-72 h-screen flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Background & Glass Effect */}
                        <div className="absolute inset-0 bg-[#0f172a] z-0"></div>

                        {/* Content Container */}
                        <div className="relative z-10 flex flex-col h-full">

                            {/* Brand Header */}
                            <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-md">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/40 text-white font-black text-xl z-10 relative">
                                            S
                                        </div>
                                        <div className="absolute inset-0 bg-blue-400 blur-md opacity-40"></div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-black tracking-tight text-white leading-none">
                                            SOBER<span className="text-blue-400">.</span>
                                        </h1>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-1.5 opacity-80">
                                            Admin Panel
                                        </p>
                                    </div>
                                </div>
                                {/* MOBILE CLOSE BUTTON */}
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="md:hidden p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all active:scale-90"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 overflow-y-auto py-8 space-y-1.5 px-4 custom-scrollbar">
                                <div className="px-4 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Management
                                </div>
                                <SidebarItem
                                    icon={<FiGrid />}
                                    label="Overview"
                                    active={activeTab === 'overview'}
                                    onClick={() => { setActiveTab('overview'); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                                />
                                <SidebarItem
                                    icon={<FiCalendar />}
                                    label="Appointments"
                                    active={activeTab === 'appointments'}
                                    onClick={() => { setActiveTab('appointments'); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                                />
                                <SidebarItem
                                    icon={<FiUsers />}
                                    label="Patient Records"
                                    active={activeTab === 'patients'}
                                    onClick={() => { setActiveTab('patients'); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                                />
                                <SidebarItem
                                    icon={<FiMessageSquare />}
                                    label="User Reviews"
                                    active={activeTab === 'reviews'}
                                    onClick={() => { setActiveTab('reviews'); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                                />

                                <div className="px-4 mb-4 mt-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    System
                                </div>
                            </nav>

                            {/* User Profile */}
                            <div className="p-5 border-t border-white/5 bg-black/20 backdrop-blur-sm m-4 rounded-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center font-bold text-sm shadow-inner ring-2 ring-white/10 text-white">
                                        {user?.name?.charAt(0) || 'A'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm text-white truncate leading-tight">{user?.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { logout(); navigate('/'); }}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-slate-300 hover:text-white border border-white/5 hover:border-white/10 hover:shadow-lg"
                                >
                                    <FiLogOut size={14} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col relative h-full overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 backdrop-blur-md bg-white/90">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 md:p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors flex-shrink-0"
                        >
                            <FiMenu size={20} />
                        </button>
                        <div className="truncate">
                            <h2 className="text-base md:text-xl font-black text-slate-800 truncate">
                                {activeTab === 'overview' && 'Executive Dashboard'}
                                {activeTab === 'appointments' && 'Bookings'}
                                {activeTab === 'patients' && 'Directory'}
                                {activeTab === 'reviews' && 'Reviews'}
                            </h2>
                            <p className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block group">
                            <FiSearch className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Quick search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    {dataLoading ? (
                        <div className="space-y-8 animate-pulse">
                            {/* Stats Skeleton */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                <SkeletonStats />
                                <SkeletonStats />
                                <SkeletonStats />
                                <SkeletonStats />
                            </div>

                            {/* Charts Skeleton */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-96">
                                    <Skeleton className="w-1/3 h-8 mb-6 rounded-lg" />
                                    <Skeleton className="w-full h-full rounded-none" />
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-96">
                                    <Skeleton className="w-1/3 h-8 mb-6 rounded-lg" />
                                    <div className="flex justify-center items-center h-full">
                                        <Skeleton className="w-48 h-48 rounded-full" variant="circular" />
                                    </div>
                                </div>
                            </div>

                            {/* Table Skeleton */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between">
                                    <Skeleton className="w-32 h-6" />
                                    <Skeleton className="w-20 h-4" />
                                </div>
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex gap-4">
                                            <Skeleton className="w-full h-12" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8 pb-20"
                        >
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <>
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                        <StatCard title="Total Registry" value={stats.total} icon={<FiLayers />} color="blue" />
                                        <StatCard title="Pending Review" value={stats.pending} icon={<FiClock />} color="amber" />
                                        <StatCard title="Confirmed Cases" value={stats.confirmed} icon={<FiCheckCircle />} color="emerald" />
                                        <StatCard title="Today's Traffic" value={stats.today} icon={<FiTrendingUp />} color="purple" />
                                    </div>

                                    {/* Charts Section - Now in Overview */}
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Area Chart */}
                                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-96 flex flex-col">
                                                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                                    <FiTrendingUp className="text-blue-500" /> Appointment Trends
                                                </h3>
                                                <div className="flex-1 min-h-0">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={[...Array(7)].map((_, i) => ({
                                                            name: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
                                                            value: appointments.filter(a => new Date(a.createdAt).toDateString() === new Date(Date.now() - (6 - i) * 86400000).toDateString()).length
                                                        }))}>
                                                            <defs>
                                                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                                            <Tooltip
                                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                                itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                                            />
                                                            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>

                                            {/* Pie Chart */}
                                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-96 flex flex-col">
                                                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                                    <FiPieChart className="text-purple-500" /> Status Distribution
                                                </h3>
                                                <div className="flex-1 min-h-0 relative">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={[
                                                                    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
                                                                    { name: 'Confirmed', value: stats.confirmed, color: '#10B981' },
                                                                    { name: 'Rejected', value: appointments.filter(a => a.status === 'Rejected').length, color: '#EF4444' },
                                                                    { name: 'No-show', value: stats.noShow, color: '#F43F5E' },
                                                                ].filter(d => d.value > 0)}
                                                                innerRadius={80}
                                                                outerRadius={110}
                                                                paddingAngle={5}
                                                                dataKey="value"
                                                            >
                                                                {[{ name: 'Pending', value: stats.pending, color: '#F59E0B' },
                                                                { name: 'Confirmed', value: stats.confirmed, color: '#10B981' },
                                                                { name: 'Rejected', value: appointments.filter(a => a.status === 'Rejected').length, color: '#EF4444' },
                                                                { name: 'No-show', value: stats.noShow, color: '#F43F5E' },
                                                                ].filter(d => d.value > 0).map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip />
                                                            <Legend verticalAlign="bottom" height={36} />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                    {/* Center Total */}
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-10">
                                                        <div className="text-center">
                                                            <div className="text-5xl font-black text-slate-800">{stats.total}</div>
                                                            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mt-2">Total</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activity / Master Table Lite */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                            <h3 className="font-bold text-slate-800 text-lg">Recent Appointments</h3>
                                            <button onClick={() => setActiveTab('appointments')} className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">
                                                View All
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-4">Patient</th>
                                                        <th className="px-6 py-4">Date</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {filteredAppointments.slice(0, 5).map(apt => (
                                                        <tr key={apt._id} className="hover:bg-slate-50/50">
                                                            <td className="px-6 py-4 font-bold text-slate-700">{apt.fullName}</td>
                                                            <td className="px-6 py-4 text-sm text-slate-500">{new Date(apt.preferredDate).toLocaleDateString()}</td>
                                                            <td className="px-6 py-4"><StatusBadge status={apt.status} /></td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button onClick={() => setSelectedAppointment(apt)} className="text-blue-600 hover:text-blue-800 text-sm font-bold">View</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* APPOINTMENTS TAB */}
                            {activeTab === 'appointments' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-lg font-bold text-slate-800">Master Record</h3>
                                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{appointments.length} Total</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={downloadFullReport}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/20"
                                            >
                                                <FiDownload size={16} /> Download CSV / PDF (All)
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                    <th className="px-6 py-4">Ref ID</th>
                                                    <th className="px-6 py-4">Patient Profile</th>
                                                    <th className="px-6 py-4">Schedule</th>
                                                    <th className="px-6 py-4">Type</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {filteredAppointments.length > 0 ? (
                                                    filteredAppointments.map((apt) => (
                                                        <tr key={apt._id} className="group hover:bg-blue-50/10 transition-colors">
                                                            <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400 select-all">
                                                                {apt.appointmentId || apt._id.substring(0, 8).toUpperCase()}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                                                                        {apt.fullName.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-sm text-slate-800">{apt.fullName}</p>
                                                                        <p className="text-xs text-slate-400">{apt.phone}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-sm font-medium text-slate-700">
                                                                    {new Date(apt.preferredDate).toLocaleDateString()}
                                                                </div>
                                                                <div className="text-xs text-slate-400 font-bold">{apt.preferredTimeSlot || 'Any Time'}</div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                                    {apt.primaryConcern}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <StatusBadge status={apt.status} />
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => setSelectedAppointment(apt)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-colors" title="View Details">
                                                                        <FiEye size={16} />
                                                                    </button>

                                                                    {/* ACTION LOGIC */}
                                                                    {apt.status === 'Pending' && (
                                                                        <>
                                                                            <button onClick={() => handleStatusUpdate(apt._id, 'confirm')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Confirm Appointment">
                                                                                <FiCheck size={16} />
                                                                            </button>
                                                                            <button onClick={() => handleStatusUpdate(apt._id, 'reject')} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors" title="Reject Appointment">
                                                                                <FiXCircle size={16} />
                                                                            </button>
                                                                        </>
                                                                    )}

                                                                    {apt.status === 'Confirmed' && (
                                                                        <button onClick={() => handleStatusUpdate(apt._id, 'pending')} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors" title="Revert to Pending">
                                                                            <FiMinusCircle size={16} />
                                                                        </button>
                                                                    )}

                                                                    <button onClick={() => downloadIndividualReport(apt)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Download Individual Receipt">
                                                                        <FiDownload size={16} />
                                                                    </button>

                                                                    <button onClick={() => handleDelete(apt._id)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors" title="Delete Record">
                                                                        <FiTrash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">No records found matching your search.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* PATIENTS TAB - Similar Table Structure */}
                            {activeTab === 'patients' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-6 border-b border-slate-100">
                                        <h3 className="text-lg font-bold text-slate-800">Registered Patient Directory</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                    <th className="px-6 py-4">User</th>
                                                    <th className="px-6 py-4">Contact</th>
                                                    <th className="px-6 py-4">Role</th>
                                                    <th className="px-6 py-4">Joined Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {filteredPatients.map((p) => (
                                                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-xs">{p.name.charAt(0)}</div>
                                                            {p.name}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{p.email}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${p.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                                                {p.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredReviews.length > 0 ? (
                                        filteredReviews.map((review) => (
                                            <motion.div
                                                key={review._id}
                                                layout
                                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                                {review.user?.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-800 text-sm">{review.user?.name || 'Deleted User'}</h4>
                                                                <p className="text-[10px] text-slate-400 font-mono">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteReview(review._id)}
                                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="Delete Review"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="flex text-amber-400 mb-3 gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FiStar key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                                        ))}
                                                    </div>
                                                    <p className="text-slate-600 text-sm italic leading-relaxed">
                                                        "{review.comment}"
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center text-slate-400 italic">
                                            No reviews found in the system.
                                        </div>
                                    )}
                                </div>
                            )}</motion.div>
                    )}
                </div>
            </main>

            {/* MODAL FOR VIEWING DETAILS */}
            <AnimatePresence>
                {selectedAppointment && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedAppointment(null)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                            className="bg-white w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] md:rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
                        >
                            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-slate-800">Clinical Case Record</h3>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-tighter">REF: {selectedAppointment.appointmentId || selectedAppointment._id}</p>
                                </div>
                                <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar" ref={reportRef}>
                                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                                    {/* Sidebar Info */}
                                    <div className="lg:w-1/3 flex flex-col gap-6">
                                        <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full" />
                                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-black mb-5 shadow-2xl shadow-blue-600/30 group-hover:scale-105 transition-transform duration-500">
                                                {selectedAppointment.fullName.charAt(0)}
                                            </div>
                                            <h4 className="text-xl font-black text-slate-800 leading-tight">{selectedAppointment.fullName}</h4>
                                            <p className="text-xs font-bold text-slate-400 mt-2 tracking-widest uppercase">{selectedAppointment.phone}</p>
                                            <div className="mt-6 scale-110">
                                                <StatusBadge status={selectedAppointment.status} />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <button onClick={() => downloadIndividualReport(selectedAppointment)} className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95">
                                                <FiDownload size={16} /> Export Receipt
                                            </button>
                                        </div>
                                    </div>

                                    {/* Detailed Info */}
                                    <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 selection:bg-blue-100">
                                        <div className="col-span-full">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="h-0.5 flex-1 bg-slate-100" />
                                                <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Schedule Information</h5>
                                                <div className="h-0.5 flex-1 bg-slate-100" />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appointment Date</label>
                                            <p className="text-sm font-bold text-slate-800 flex items-center gap-2"><FiCalendar className="text-blue-500" /> {new Date(selectedAppointment.preferredDate).toDateString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</label>
                                            <p className="text-sm font-bold text-slate-800 flex items-center gap-2"><FiClock className="text-blue-500" /> {selectedAppointment.preferredTimeSlot || 'Standard'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Physician</label>
                                            <p className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-block border border-blue-100">{selectedAppointment.preferredDoctor || 'Pending Assignment'}</p>
                                        </div>
                                        <div className="col-span-full space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Concern</label>
                                            <p className="text-sm font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed italic">"{selectedAppointment.primaryConcern}"</p>
                                        </div>

                                        <div className="col-span-full mt-4">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="h-0.5 flex-1 bg-slate-100" />
                                                <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Patient Profile</h5>
                                                <div className="h-0.5 flex-1 bg-slate-100" />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age / Gender</label>
                                            <p className="text-sm font-bold text-slate-800">{selectedAppointment.age || 'N/A'} yrs • {selectedAppointment.gender}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupation</label>
                                            <p className="text-sm font-bold text-slate-800">{selectedAppointment.occupation || 'Private'}</p>
                                        </div>
                                        <div className="col-span-full space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</label>
                                            {selectedAppointment.emergencyContactName ? (
                                                <p className="text-sm font-bold text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-center gap-3">
                                                    <FiSmartphone /> {selectedAppointment.emergencyContactName} ({selectedAppointment.emergencyContactPhone})
                                                </p>
                                            ) : (
                                                <p className="text-sm font-bold text-slate-400 italic">No emergency details provided.</p>
                                            )}
                                        </div>
                                        <div className="col-span-full space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical History</label>
                                            <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedAppointment.familyPsychiatricHistory || 'No clinical history reported.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
