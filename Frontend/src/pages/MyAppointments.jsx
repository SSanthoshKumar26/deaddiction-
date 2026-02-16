import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaUserMd, FaCheckCircle, FaTimesCircle, FaClock, FaIdCard, FaChevronRight, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { SkeletonCard } from '../components/SkeletonLoader';

const MyAppointments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchAppointments = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get('http://localhost:5000/api/appointments/my', config);
                if (res.data.success) {
                    setAppointments(res.data.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load your appointments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [user, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-surface-50 py-16 md:py-24 px-4 font-sans text-surface-900">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Skeleton */}
                <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-surface-200 pb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-[2px] bg-primary-600"></div>
                            <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">Patient Portal</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-surface-900">My Appointments</h1>
                    </div>
                </div>
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-surface-50 py-16 md:py-24 px-4 font-sans text-surface-900">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-surface-200 pb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-[2px] bg-primary-600"></div>
                            <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">Patient Portal</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-surface-900">My Appointments</h1>
                        <p className="text-surface-600 text-sm font-medium mt-2">Manage and track your pharmaceutical and psychiatric consultation records.</p>
                    </div>
                    <Link to="/appointment" className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20">
                        <FaPlus size={10} /> Book Consultation
                    </Link>
                </div>

                {appointments.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-surface-200 p-16 text-center shadow-subtle">
                        <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-6 text-surface-300">
                            <FaCalendarAlt size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 mb-2">No Records Found</h3>
                        <p className="text-surface-500 mb-8 text-sm max-w-xs mx-auto">You haven't scheduled any consultations yet.</p>
                        <Link to="/appointment" className="inline-flex items-center justify-center px-10 py-4 bg-primary-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/10">
                            Book Now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {appointments.map((apt, index) => (
                            <AppointmentCard key={apt._id} apt={apt} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const AppointmentCard = ({ apt, index }) => {
    const navigate = useNavigate();
    const statusMap = {
        Pending: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: FaClock },
        Confirmed: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: FaCheckCircle },
        Completed: { color: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-200', icon: FaCheckCircle },
        Rejected: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: FaTimesCircle }
    };

    const config = statusMap[apt.status] || statusMap.Pending;
    const StatusIcon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
                if (apt.status === 'Pending') {
                    toast.error("Appointment is under review. Your digital slip will be generated once confirmed.");
                    return;
                }
                navigate(`/appointment/confirmation/${apt._id}`);
            }}
            className={`bg-white rounded-2xl border border-surface-200 p-8 md:p-10 transition-all shadow-subtle relative group ${apt.status === 'Pending' ? 'cursor-not-allowed grayscale-[0.3]' : 'hover:border-primary-400 cursor-pointer hover:shadow-card'}`}
        >
            <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                    {/* Top row: Status and ID */}
                    <div className="flex flex-wrap items-center gap-5 mb-8">
                        <div className={`flex items-center gap-2 px-4 py-1.5 ${config.bg} ${config.color} rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${config.border}`}>
                            <StatusIcon size={10} />
                            {apt.status}
                        </div>
                        <div className="text-[10px] font-black text-surface-400 font-mono tracking-widest flex items-center gap-2">
                            <FaIdCard size={12} className="opacity-50" />
                            {apt.appointmentId || 'REF: PENDING'}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="mb-10">
                        <h3 className="text-xl md:text-2xl font-extrabold text-surface-900 mb-2 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{apt.fullName}</h3>
                        <p className="text-primary-600 text-sm font-black uppercase tracking-widest">
                            {apt.primaryConcern || 'General Psychiatric Consultation'}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-surface-100">
                        <InfoSection label="Appt Date" value={new Date(apt.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} icon={FaCalendarAlt} />
                        <InfoSection label="Time Slot" value={apt.preferredTimeSlot || 'PENDING'} icon={FaClock} />
                        <InfoSection label="Specialist" value={apt.preferredDoctor || 'Clinical Team'} icon={FaUserMd} />
                    </div>
                </div>

                {/* Right side move to bottom on mobile */}
                {apt.status !== 'Pending' && (
                    <div className="flex items-center md:items-end md:pl-10 border-t md:border-t-0 md:border-l border-surface-100 pt-8 md:pt-0">
                        <div className="w-full flex items-center justify-between md:justify-end gap-4 group/btn">
                            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">View Record</span>
                            <div className="w-12 h-12 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-subtle group-hover:shadow-lg group-hover:shadow-primary-600/20">
                                <FaChevronRight size={14} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const InfoSection = ({ label, value, icon: Icon }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-surface-400 uppercase tracking-widest">
            <Icon size={12} className="text-primary-400" />
            {label}
        </div>
        <p className="text-[15px] font-extrabold text-surface-900 uppercase">{value}</p>
    </div>
);

export default MyAppointments;
