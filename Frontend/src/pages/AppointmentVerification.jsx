import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    FaCheckCircle, FaCalendarAlt, FaUserMd, FaUser, FaIdCard,
    FaClock, FaExclamationTriangle, FaWalking, FaMapMarkerAlt, FaPhoneAlt
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const AppointmentVerification = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkingIn, setCheckingIn] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/appointments/verify/${id}`);
                if (res.data.success) {
                    setAppointment(res.data.data);
                }
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Verification system error. Link may be invalid.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleCheckIn = async () => {
        setCheckingIn(true);
        try {
            const res = await axios.put(`http://localhost:5000/api/appointments/checkin/${id}`);
            if (res.data.success) {
                toast.success("Arrival recorded successfully.");
                setAppointment(prev => ({ ...prev, checkedIn: true }));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Check-in protocol failure.");
        } finally {
            setCheckingIn(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-2 border-slate-100 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 text-slate-900">
            <div className="max-w-md w-full bg-white border border-slate-200 p-12 text-center shadow-sm">
                <FaExclamationTriangle className="text-slate-300 text-6xl mx-auto mb-8" />
                <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-4">Verification Error</h2>
                <p className="text-xs text-slate-500 mb-10 font-medium leading-relaxed">{error}</p>
                <Link to="/" className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-8 py-3 hover:bg-black transition-all">Back to Portal</Link>
            </div>
        </div>
    );

    const statusConfig = {
        Confirmed: { color: "text-teal-800", bg: "bg-teal-50/50", border: "border-teal-200" },
        'No-show': { color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200" },
        Pending: { color: "text-amber-800", bg: "bg-amber-50/50", border: "border-amber-200" }
    };
    const config = statusConfig[appointment.status] || statusConfig.Pending;

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-16 px-4 flex items-center justify-center font-sans">
            <Toaster />
            <div className="max-w-3xl w-full bg-white border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">

                {/* ADMIN HEADER */}
                <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                        <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-1">SOBER Verification Gateway</h1>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Internal Clinical Data Retrieval</p>
                    </div>
                    <div className="text-right font-mono">
                        <span className="text-[8px] font-black text-slate-300 uppercase block mb-1">AUTH_REF</span>
                        <span className="text-xs font-black text-slate-900">{appointment.appointmentId || '000-000'}</span>
                    </div>
                </div>

                {/* PATIENT IDENTITY HEADER */}
                <div className="p-10 md:p-14 pb-0">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-12 border-b border-slate-100">
                        <div className="flex items-center gap-8">
                            <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center text-3xl font-black">
                                {appointment.fullName ? appointment.fullName.charAt(0) : 'P'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-3 border-b-2 border-slate-100 pb-1">{appointment.fullName}</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{appointment.age} Years • {appointment.gender}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Current Status</span>
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-5 py-2 border ${config.bg} ${config.color} ${config.border}`}>
                                {appointment.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* CLINICAL DATA BLOCKS */}
                <div className="p-10 md:p-14 space-y-16">
                    {/* Segment 1: Contact & IDs */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                        <Field label="System Phone" value={appointment.phone} />
                        <Field label="Registered Email" value={appointment.email} />
                        <Field label="Gvt ID Ref" value={appointment.govtId} />
                        <div className="col-span-full">
                            <Field label="Residential Address" value={appointment.address ? `${appointment.address.city}, ${appointment.address.state}` : 'N/A'} />
                        </div>
                    </div>

                    {/* Segment 2: Clinical Instruction */}
                    <div className="p-10 bg-slate-50 border-l-[4px] border-slate-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <Field label="Assigned Consultant" value={appointment.preferredDoctor} />
                            <Field label="Time Slot Allocated" value={appointment.preferredTimeSlot} />
                            <div className="col-span-full">
                                <Field label="Clinical Observations" value={appointment.primaryConcern} highlight />
                            </div>
                            <div className="col-span-full pt-6 border-t border-slate-200">
                                <Field label="Patient Submitted History" value={appointment.currentMedications || 'No pharmacological history provided'} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* STAFF PROTOCOL ACTIONS */}
                <div className="p-10 md:px-14 pb-14 text-center">
                    {appointment.status === 'Confirmed' && !appointment.checkedIn ? (
                        <button
                            onClick={handleCheckIn}
                            disabled={checkingIn}
                            className="w-full bg-slate-900 text-white py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-black transition-all active:scale-[0.99] flex items-center justify-center gap-4 border border-slate-900"
                        >
                            {checkingIn ? 'COMMUNICATING...' : (
                                <><FaWalking /> RECORD PATIENT ARRIVAL</>
                            )}
                        </button>
                    ) : appointment.checkedIn ? (
                        <div className="w-full bg-teal-50 text-teal-800 py-6 border border-teal-200 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                                <FaCheckCircle size={16} /> CLIENT_VERIFIED_CHECKED_IN
                            </p>
                        </div>
                    ) : (
                        <div className="w-full bg-slate-100 text-slate-400 py-6 border border-slate-200 text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest tracking-[0.2em] opacity-60">NO PROTOCOL ACTIONS PERMITTED</p>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t border-slate-100 bg-[#FAFAFA] text-center flex flex-col items-center gap-4">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]">Institutional Clinical Data Node • Madurai</p>
                    <div className="flex items-center gap-8">
                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-900"><FaPhoneAlt className="text-slate-300" /> 97510 55190</span>
                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-900"><FaMapMarkerAlt className="text-slate-300" /> MADURAI-03</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, value, highlight }) => (
    <div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
        <p className={`text-[13px] font-bold ${highlight ? 'text-teal-900 italic underline underline-offset-4 decoration-teal-100' : 'text-slate-800'}`}>{value || '---'}</p>
    </div>
);

export default AppointmentVerification;
