import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowLeft, FaEnvelopeOpenText, FaIdCard, FaUserMd, FaCalendarAlt, FaShieldAlt, FaMapMarkerAlt, FaFileContract, FaClock } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import API_BASE_URL from '../api/config';

const AppointmentConfirmation = () => {
    const { appointmentId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchAppointment = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get(`${API_BASE_URL}/api/appointments/${appointmentId}`, config);
                if (res.data.success) {
                    setAppointment(res.data.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load clinical record.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [appointmentId, user, navigate]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50">
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-surface-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                <p className="text-surface-400 font-bold uppercase tracking-widest text-[9px]">Verifying Record...</p>
            </div>
        </div>
    );

    if (!appointment) return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
            <div className="text-center max-w-sm">
                <h2 className="text-2xl font-extrabold text-surface-900 mb-2">Access Denied</h2>
                <p className="text-surface-600 mb-8 text-sm font-medium">This consultation record could not be localized on the secure server.</p>
                <Link to="/my-appointments" className="inline-flex items-center gap-2 text-primary-600 font-black uppercase tracking-widest text-[11px] border-b-2 border-primary-600 pb-1">
                    <FaArrowLeft size={10} /> Back to Dashboard
                </Link>
            </div>
        </div>
    );

    // Protection for pending status
    if (appointment.status === 'Pending') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6 text-surface-900 font-sans">
                <div className="max-w-md w-full bg-white rounded-3xl border border-surface-200 p-12 text-center shadow-subtle border-t-4 border-t-amber-500">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <FaClock size={28} />
                    </div>
                    <h2 className="text-2xl font-extrabold mb-4 uppercase tracking-tight">Under Review</h2>
                    <p className="text-surface-600 text-sm font-semibold leading-relaxed mb-10">
                        Your clinical intake for <span className="font-black text-surface-900">#{appointment.appointmentId || 'DATA-SYNC'}</span> is currently being reviewed by our administrative team.
                        <br /><br />
                        As soon as it is confirmed, your official digital slip will be generated and emailed to you.
                    </p>
                    <Link to="/my-appointments" className="inline-flex items-center gap-3 px-8 py-3 bg-surface-900 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-surface-900/10 active:scale-95 transition-all">
                        <FaArrowLeft size={10} /> Back to My Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 py-16 md:py-24 px-4 font-sans text-surface-900">
            <Toaster />

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] border border-surface-200 shadow-card overflow-hidden"
                >
                    {/* Header Section */}
                    <div className="p-10 md:p-14 border-b border-surface-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <FaCheckCircle size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-surface-900">Appointment Confirmed</h1>
                                <p className="text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                                    <FaIdCard size={12} className="opacity-70" />
                                    Ref ID: {appointment.appointmentId || 'SYSTEM-REf'}
                                </p>
                            </div>
                        </div>
                        <Link to="/my-appointments" className="bg-surface-50 hover:bg-surface-900 hover:text-white text-surface-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all border border-surface-200 shadow-sm">
                            <FaArrowLeft size={10} /> Return to Portal
                        </Link>
                    </div>

                    <div className="p-10 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Summary Details */}
                        <div className="lg:col-span-7 space-y-12">
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-[2px] bg-primary-600"></div>
                                    <h3 className="text-[11px] font-black text-primary-600 uppercase tracking-[0.3em]">Status & Schedule</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <DetailItem label="Consultation Date" value={new Date(appointment.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} icon={FaCalendarAlt} />
                                    <DetailItem label="Assigned Slot" value={appointment.preferredTimeSlot || 'PENDING'} icon={FaClock} />
                                    <DetailItem label="Specialist Unit" value={appointment.preferredDoctor || 'Clinical Specialist'} icon={FaUserMd} />
                                    <DetailItem label="Center Location" value="Nehru Nagar, Madurai" icon={FaMapMarkerAlt} />
                                </div>
                            </div>

                            <div className="relative">
                                <h3 className="text-[11px] font-black text-surface-400 uppercase tracking-[0.2em] mb-6 border-b border-surface-100 pb-3">Institutional Notice</h3>
                                <div className="bg-surface-50 p-8 rounded-2xl border border-surface-100 border-l-4 border-l-primary-600 text-surface-600 text-[13px] font-semibold leading-relaxed">
                                    Your official clinical documents have been securely processed. A mandatory digital slip has been dispatched to your contact point. Please present this document upon arrival.
                                </div>
                            </div>
                        </div>

                        {/* Dispatch Visual */}
                        <div className="lg:col-span-5">
                            <div className="bg-surface-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl shadow-surface-900/10">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white shadow-inner">
                                        <FaEnvelopeOpenText size={22} />
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-4 text-primary-400">Official Dispatch</h4>
                                    <p className="text-sm text-surface-300 leading-relaxed mb-8 font-semibold">
                                        The institutional appointment slip has been sent to:
                                    </p>
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-xl mb-8 break-all font-mono text-[11px] text-primary-300 font-bold tracking-tight">
                                        {appointment.email}
                                    </div>
                                    <div className="space-y-6">
                                        <Protocol text="Present PDF at reception" />
                                        <Protocol text="Carry Govt ID proof" />
                                        <Protocol text="Report 15m early" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform duration-1000">
                                    <FaShieldAlt size={220} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-50 p-8 text-center border-t border-surface-100">
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.4em]">SOBER Psychiatric Center • Institutional Clinical Record</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="space-y-2.5">
        <div className="flex items-center gap-3 text-[10px] font-black text-primary-600 uppercase tracking-widest">
            <Icon size={14} className="text-primary-400" />
            {label}
        </div>
        <p className="text-base font-extrabold text-surface-900 uppercase tracking-tight">{value}</p>
    </div>
);

const Protocol = ({ text }) => (
    <div className="flex items-center gap-4">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        <p className="text-[11px] font-black uppercase tracking-widest text-surface-100">{text}</p>
    </div>
);

export default AppointmentConfirmation;
