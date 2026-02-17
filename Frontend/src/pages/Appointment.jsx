import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPhone, FaHeartbeat, FaCalendarCheck, FaArrowRight, FaArrowLeft, FaCheck, FaShieldAlt, FaNotesMedical, FaHome, FaUsers } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInYears, isFuture } from 'date-fns';
import API_BASE_URL from '../api/config';

const Appointment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Helpers for custom calendar header
    const years = Array.from({ length: 121 }, (_, i) => new Date().getFullYear() - i);
    const futureYears = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [formData, setFormData] = useState(() => {
        const savedData = sessionStorage.getItem('appointmentForm');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            // Re-calculate age if DOB exists to ensure clinical accuracy on refresh
            if (parsed.dateOfBirth) {
                // native differenceInYears requires Date objects
                parsed.age = differenceInYears(new Date(), new Date(parsed.dateOfBirth)).toString();
            }
            return parsed;
        }
        return {
            // Step 1: Identity
            fullName: user?.name || '',
            gender: '',
            dateOfBirth: '',
            age: '',
            bloodGroup: '',
            height: '',
            weight: '',
            govtId: '',
            maritalStatus: '',
            occupation: '',
            education: '',

            // Step 2: Contact
            phone: user?.mobile || '',
            secondaryPhone: '',
            whatsapp: '',
            email: user?.email || '',
            street: '',
            city: '',
            state: '',
            pincode: '',

            // Step 3: Emergency & Family
            fatherName: '',
            motherName: '',
            spouseName: '',
            guardianName: '',
            guardianPhone: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            familyMembersCount: '',
            familyMedicalHistory: '',
            familyPsychiatricHistory: '',

            // Step 4: Clinical
            primaryConcern: '',
            durationOfIssue: '',
            previousTreatment: '',
            currentMedications: '',
            allergies: '',
            suicidalThoughts: '',
            selfHarmHistory: '',
            substanceUseType: '',
            substanceUseFrequency: '',
            substanceLastConsumption: '',
            smokingHabit: '',
            medicalConditions: '',
            insuranceDetails: '',

            // Step 5: Preferences
            preferredDoctor: '',
            preferredDate: '',
            preferredTimeSlot: '',
            appointmentType: 'Consultation',
            mode: 'In-Person',
            message: ''
        };
    });

    useEffect(() => {
        sessionStorage.setItem('appointmentForm', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        if (!user) {
            toast.error("Please login to book an appointment");
            navigate('/login');
        }
    }, [user, navigate]);

    const calculateAge = (dob) => {
        if (!dob) return '';
        const age = differenceInYears(new Date(), new Date(dob));
        return age >= 0 ? age.toString() : '';
    };

    const handleDateChange = (date) => {
        if (date && isFuture(date)) {
            toast.error("Date of Birth cannot be in the future");
            return;
        }

        const age = calculateAge(date);
        setFormData({
            ...formData,
            dateOfBirth: date ? format(date, 'yyyy-MM-dd') : '',
            age: age
        });
    };

    const handlePreferredDateChange = (date) => {
        setFormData({
            ...formData,
            preferredDate: date ? format(date, 'yyyy-MM-dd') : ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Define fields that should only contain numbers
        const numericFields = ['phone', 'pincode', 'emergencyContactPhone', 'age'];
        const clinicalNumericFields = ['height', 'weight'];

        // Define fields that should only contain alphabets and spaces
        const alphabeticFields = ['fullName', 'fatherName', 'motherName', 'emergencyContactName', 'city', 'occupation'];

        if (numericFields.includes(name)) {
            // Only allow whole numbers
            let sanitizedValue = value.replace(/[^0-9]/g, '');

            // Length limits for specific fields
            if (name === 'phone' || name === 'emergencyContactPhone') sanitizedValue = sanitizedValue.slice(0, 10);
            if (name === 'pincode') sanitizedValue = sanitizedValue.slice(0, 6);

            setFormData({ ...formData, [name]: sanitizedValue });
            return;
        }

        if (clinicalNumericFields.includes(name)) {
            // Allow numbers and a single decimal point for clinical metrics
            const sanitizedValue = value.replace(/[^0-9.]/g, '')
                .replace(/(\..*)\./g, '$1'); // Only allow one dot
            setFormData({ ...formData, [name]: sanitizedValue });
            return;
        }

        if (alphabeticFields.includes(name)) {
            // Only allow alphabets and spaces
            const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
            setFormData({ ...formData, [name]: sanitizedValue });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const validateStep = (currentStep) => {
        switch (currentStep) {
            case 1:
                if (!formData.fullName || !formData.dateOfBirth || !formData.gender) return "Name, DOB, and Gender are required.";
                return null;
            case 2:
                if (!formData.phone || !formData.email || !formData.city) return "Phone, Email, and City are required.";
                return null;
            case 3:
                // Relaxed validation for emergency contacts, but good to have
                return null;
            case 4:
                if (!formData.primaryConcern) return "Please specify your primary concern.";
                return null;
            case 5:
                if (!formData.preferredDate) return "Please select a preferred date.";
                return null;
            default:
                return null;
        }
    };

    const handleNext = () => {
        const error = validateStep(step);
        if (error) {
            toast.error(error);
            return;
        }
        setStep((prev) => prev + 1);
        window.scrollTo(0, 0);
    };

    const handlePrev = () => {
        setStep((prev) => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateStep(5);
        if (error) {
            toast.error(error);
            return;
        }

        setLoading(true);
        try {
            const token = user.token; // Access token from user object
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            // Structure payload to match backend schema
            const payload = {
                ...formData,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                },
                emergencyContact: {
                    name: formData.emergencyContactName,
                    phone: formData.emergencyContactPhone
                },
                substanceUse: {
                    type: formData.substanceUseType,
                    frequency: formData.substanceUseFrequency,
                    lastConsumption: formData.substanceLastConsumption
                }
            };

            const res = await axios.post(`${API_BASE_URL}/api/appointments/book`, payload, config);

            if (res.data.success) {
                sessionStorage.removeItem('appointmentForm');
                toast.success("Appointment request submitted successfully!");
                // Clear form or redirect
                setTimeout(() => {
                    navigate('/my-appointments');
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to submit appointment.");
        } finally {
            setLoading(false);
        }
    };

    const variants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const steps = [
        { id: 1, label: "Identity", icon: FaUser },
        { id: 2, label: "Contact", icon: FaPhone },
        { id: 3, label: "Family", icon: FaUsers },
        { id: 4, label: "Clinical", icon: FaHeartbeat },
        { id: 5, label: "Preferences", icon: FaCalendarCheck },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans selection:bg-blue-100 py-6 md:py-8 animate-fade-in relative">
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <Toaster position="top-center" reverseOrder={false} />

            {/* Main Application Canvas */}
            <div className="w-full max-w-[1340px] px-4 md:px-8 relative z-10 transition-all">
                <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] lg:h-[700px]">

                    {/* Left Sidebar: Medical Intake Guide */}
                    <aside className="lg:w-[380px] bg-[#0f172a] text-white p-10 flex flex-col rounded-[2.5rem] shadow-2xl relative overflow-hidden shrink-0 border border-white/5">
                        {/* Professional Glow Effect */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 blur-[100px]" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px]" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-12">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-600/20">
                                    <FaNotesMedical size={24} />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
                                    Patient Intake
                                    <span className="block text-blue-400 font-medium text-lg mt-1">Hospital Services</span>
                                </h2>
                            </div>

                            <nav className="flex-1 space-y-1">
                                {steps.map((s) => (
                                    <div key={s.id} className="relative py-2.5">
                                        {/* Progress Linkage */}
                                        {s.id < steps.length && (
                                            <div className="absolute left-[18px] top-[42px] w-[2px] h-6 bg-slate-800" />
                                        )}

                                        <div className={`flex items-center gap-4 transition-all duration-500 ${step === s.id ? 'opacity-100' : 'opacity-40'}`}>
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold z-10 transition-all border
                                                ${step === s.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30' :
                                                    step > s.id ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                                                {step > s.id ? <FaCheck size={12} /> : s.id}
                                            </div>
                                            <div>
                                                <h4 className={`text-xs font-bold tracking-wider uppercase ${step === s.id ? 'text-white' : 'text-slate-400'}`}>{s.label}</h4>
                                                {step === s.id && <p className="text-[10px] text-blue-400 font-medium mt-0.5">Current Section</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </nav>

                            <div className="mt-8 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-3 text-slate-400 mb-2">
                                    <FaShieldAlt className="text-blue-500" size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Medical Grade Security</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Your data is protected under hospital-standard encryption protocols.</p>
                            </div>
                        </div>
                    </aside>

                    {/* Right Panel: Clinical Form Interface */}
                    <main className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden">
                        <header className="h-20 px-10 flex items-center justify-between border-b border-slate-100 relative z-20 bg-white shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-blue-600' : 'w-4 bg-slate-200'}`} />
                                    ))}
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 tracking-tight">Step {step}: {steps.find(s => s.id === step).label}</h3>
                            </div>

                            <div className="hidden md:flex items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                    Registration ID: {user?.id?.substring(0, 8) || 'NEW-PATIENT'}
                                </span>
                            </div>
                        </header>

                        {/* Interactive Data Canvas */}
                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                            <div className="flex-1 overflow-hidden relative flex flex-col justify-center bg-slate-50/10">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 px-10">
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Full Name (As per identification) *</label>
                                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 focus:outline-none placeholder:text-slate-300 transition-all shadow-sm" placeholder="e.g. John Doe" />
                                                </div>

                                                <div className="relative">
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Date of Birth *</label>
                                                    <DatePicker
                                                        selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                                                        onChange={handleDateChange}
                                                        maxDate={new Date()}
                                                        dateFormat="dd/MM/yyyy"
                                                        placeholderText="DD/MM/YYYY"
                                                        renderCustomHeader={({
                                                            date,
                                                            changeYear,
                                                            changeMonth,
                                                            decreaseMonth,
                                                            increaseMonth,
                                                            prevMonthButtonDisabled,
                                                            nextMonthButtonDisabled,
                                                        }) => (
                                                            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-t-2xl">
                                                                <button
                                                                    onClick={decreaseMonth}
                                                                    disabled={prevMonthButtonDisabled}
                                                                    type="button"
                                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600 disabled:opacity-20"
                                                                >
                                                                    <FaArrowLeft size={10} />
                                                                </button>

                                                                <div className="flex gap-2">
                                                                    <select
                                                                        value={date.getFullYear()}
                                                                        onChange={({ target: { value } }) => changeYear(value)}
                                                                        className="bg-slate-50 border-none text-[11px] font-bold text-slate-700 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-200 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                                                                    >
                                                                        {years.map((option) => (
                                                                            <option key={option} value={option}>
                                                                                {option}
                                                                            </option>
                                                                        ))}
                                                                    </select>

                                                                    <select
                                                                        value={months[date.getMonth()]}
                                                                        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                                                        className="bg-slate-50 border-none text-[11px] font-bold text-slate-700 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-200 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                                                                    >
                                                                        {months.map((option) => (
                                                                            <option key={option} value={option}>
                                                                                {option}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                <button
                                                                    onClick={increaseMonth}
                                                                    disabled={nextMonthButtonDisabled}
                                                                    type="button"
                                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600 disabled:opacity-20"
                                                                >
                                                                    <FaArrowRight size={10} />
                                                                </button>
                                                            </div>
                                                        )}
                                                        popperPlacement="bottom-start"
                                                        popperClassName="premium-popper"
                                                        className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 focus:outline-none transition-all shadow-sm"
                                                        calendarClassName="premium-calendar"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Gender *</label>
                                                    <select name="gender" value={formData.gender} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 focus:outline-none transition-all shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1rem] bg-[right_1.2rem_center] bg-no-repeat">
                                                        <option value="" disabled hidden>Select Gender</option>
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Calculated Age</label>
                                                    <div className="form-input-premium w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-500 cursor-not-allowed shadow-none flex items-center h-[58px]">
                                                        {formData.age ? `Age: ${formData.age} years` : 'Enter DOB first'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Occupation</label>
                                                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" placeholder="e.g. Software Engineer" />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Height (cm)</label>
                                                    <input type="text" name="height" value={formData.height} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" placeholder="e.g. 175" />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Weight (kg)</label>
                                                    <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" placeholder="e.g. 70" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8 px-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Phone Number *</label>
                                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" placeholder="+91" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Email address *</label>
                                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" placeholder="e.g. name@example.com" />
                                                </div>
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Residential Address (Street/Building)</label>
                                                    <input type="text" name="street" value={formData.street} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" placeholder="House no, Street name" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">City *</label>
                                                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Pincode / Zip Code</label>
                                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div key="step3" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8 px-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Father's Name</label>
                                                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Mother's Name</label>
                                                    <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" />
                                                </div>
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Emergency Contact Details</label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" placeholder="Contact Name" />
                                                        <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" placeholder="Contact Phone" />
                                                    </div>
                                                </div>
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Family Medical History (Psychiatric/Other)</label>
                                                    <textarea name="familyPsychiatricHistory" value={formData.familyPsychiatricHistory} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 h-24 resize-none shadow-sm" placeholder="Please describe any history of psychiatric or medical conditions in your family..." />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 4 && (
                                        <motion.div key="step4" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8 px-10">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Primary Reason for Visit *</label>
                                                    <input type="text" name="primaryConcern" value={formData.primaryConcern} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" placeholder="e.g. Anxiety, Depression, Specific treatment" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 mb-2.5">Substance Use (If any)</label>
                                                        <select name="substanceUseType" value={formData.substanceUseType} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1rem] bg-[right_1.2rem_center] bg-no-repeat">
                                                            <option value="" disabled hidden>None / Not Disclosed</option>
                                                            <option>Alcohol</option>
                                                            <option>Tobacco</option>
                                                            <option>Narcotics</option>
                                                            <option>Prescription Drugs</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 mb-2.5">Duration of Concern</label>
                                                        <input type="text" name="durationOfIssue" value={formData.durationOfIssue} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900" placeholder="e.g. 6 months, 1 year" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Current Medications</label>
                                                    <textarea name="currentMedications" value={formData.currentMedications} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 h-24 resize-none shadow-sm" placeholder="List any medications you are currently taking..." />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 5 && (
                                        <motion.div key="step5" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8 px-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Preferred Specialist</label>
                                                    <select name="preferredDoctor" value={formData.preferredDoctor} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1rem] bg-[right_1.2rem_center] bg-no-repeat">
                                                        <option value="" disabled hidden>Choose Specialist</option>
                                                        <option>Dr. A. Anand Kumar (Senior Physician)</option>
                                                        <option>Dr. S. Meena (Clinical Specialist)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Type of Appointment</label>
                                                    <select name="appointmentType" value={formData.appointmentType} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1rem] bg-[right_1.2rem_center] bg-no-repeat">
                                                        <option value="" disabled hidden>Select Admission Type</option>
                                                        <option>General Consultation</option>
                                                        <option>Follow-up Visit</option>
                                                        <option>Diagnostic Review</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Preferred Date *</label>
                                                    <div className="relative">
                                                        <DatePicker
                                                            selected={formData.preferredDate ? new Date(formData.preferredDate) : null}
                                                            onChange={handlePreferredDateChange}
                                                            dateFormat="dd/MM/yyyy"
                                                            placeholderText="Choose Date"
                                                            renderCustomHeader={({
                                                                date,
                                                                changeYear,
                                                                changeMonth,
                                                                decreaseMonth,
                                                                increaseMonth,
                                                                prevMonthButtonDisabled,
                                                                nextMonthButtonDisabled,
                                                            }) => (
                                                                <div className="flex items-center justify-between px-3 py-2 bg-white rounded-t-2xl">
                                                                    <button
                                                                        onClick={decreaseMonth}
                                                                        disabled={prevMonthButtonDisabled}
                                                                        type="button"
                                                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600 disabled:opacity-20"
                                                                    >
                                                                        <FaArrowLeft size={10} />
                                                                    </button>

                                                                    <div className="flex gap-2">
                                                                        <select
                                                                            value={date.getFullYear()}
                                                                            onChange={({ target: { value } }) => changeYear(value)}
                                                                            className="bg-slate-50 border-none text-[11px] font-bold text-slate-700 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-200 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                                                                        >
                                                                            {futureYears.map((option) => (
                                                                                <option key={option} value={option}>{option}</option>
                                                                            ))}
                                                                        </select>
                                                                        <select
                                                                            value={months[date.getMonth()]}
                                                                            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                                                            className="bg-slate-50 border-none text-[11px] font-bold text-slate-700 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-200 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                                                                        >
                                                                            {months.map((option) => (
                                                                                <option key={option} value={option}>{option}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>

                                                                    <button
                                                                        onClick={increaseMonth}
                                                                        disabled={nextMonthButtonDisabled}
                                                                        type="button"
                                                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600 disabled:opacity-20"
                                                                    >
                                                                        <FaArrowRight size={10} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            popperPlacement="bottom-start"
                                                            popperClassName="premium-popper"
                                                            className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 focus:outline-none transition-all shadow-sm"
                                                            calendarClassName="premium-calendar"
                                                            minDate={new Date()}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2.5">Time Slot</label>
                                                    <select name="preferredTimeSlot" value={formData.preferredTimeSlot} onChange={handleChange} className="form-input-premium w-full bg-slate-50/30 border border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1rem] bg-[right_1.2rem_center] bg-no-repeat">
                                                        <option value="" disabled hidden>Select Time Slot</option>
                                                        <option>Morning (09:00 AM - 01:00 PM)</option>
                                                        <option>Evening (04:00 PM - 08:00 PM)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-7 rounded-2xl mt-12 border border-slate-200 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -mr-10 -mt-10" />
                                                <p className="text-xs font-medium text-slate-500 leading-relaxed text-center">
                                                    By submitting this form, you acknowledge that the information provided is accurate to the best of your knowledge. Your privacy is protected under our clinical data protection policies.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <footer className="h-24 px-10 border-t border-slate-100 flex items-center justify-between bg-white relative z-20">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className={`group flex items-center gap-2.5 text-xs font-bold transition-all ${step === 1 ? 'opacity-0 invisible' : 'text-slate-500 hover:text-blue-600'}`}
                                >
                                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                    Previous
                                </button>

                                <button
                                    onClick={step === 5 ? undefined : handleNext}
                                    type={step === 5 ? "submit" : "button"}
                                    disabled={loading}
                                    className={`px-10 h-14 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-3
                                                ${loading ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-600/20'}`}
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {step === 5 ? 'Confirm Appointment' : 'Continue'}
                                            <FaArrowRight size={14} />
                                        </>
                                    )}
                                </button>
                            </footer>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

// Premium Styling Refinements
const styles = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(0.4);
        cursor: pointer;
    }
    .form-input-premium {
        transition: all 0.2s ease-in-out;
    }
    .form-input-premium:focus {
        background-color: white !important;
        border-color: #2563eb !important;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
    }
    textarea:focus {
        background-color: white !important;
        border-color: #2563eb !important;
    }
    /* Simple Scrollbar for Form Area if needed */
    .form-scroll::-webkit-scrollbar {
        width: 4px;
    }
    .form-scroll::-webkit-scrollbar-track {
        background: transparent;
    }
    .form-scroll::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
    }
    
    /* DatePicker Premium Styling */
    .react-datepicker-wrapper {
        width: 100%;
    }
    .premium-calendar {
        border-radius: 1.25rem !important;
        border: 1px solid #f1f5f9 !important;
        box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15) !important;
        font-family: inherit !important;
        background-color: white !important;
        padding: 0.25rem !important;
        animation: scaleIn 0.2s ease-out forwards;
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
    }
    .premium-popper {
        z-index: 9999 !important;
        margin-top: 5px !important;
    }
    .react-datepicker-popper {
        z-index: 9999 !important;
    }
    .react-datepicker__header {
        background-color: white !important;
        border-bottom: none !important;
        padding-top: 0 !important;
    }
    .react-datepicker__day-name {
        font-size: 0.55rem !important;
        font-weight: 800 !important;
        color: #94a3b8 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        width: 2rem !important;
        line-height: 2rem !important;
    }
    .react-datepicker__day {
        width: 2rem !important;
        line-height: 2rem !important;
        font-size: 0.75rem !important;
        font-weight: 600 !important;
        color: #334155 !important;
        border-radius: 0.5rem !important;
        transition: all 0.2s ease !important;
    }
    .react-datepicker__day:hover {
        background-color: #eff6ff !important;
        color: #2563eb !important;
    }
    .react-datepicker__day--selected {
        background-color: #2563eb !important;
        color: white !important;
        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2) !important;
    }
    .react-datepicker__day--outside-month {
        color: #e2e8f0 !important;
    }
    .react-datepicker__day--keyboard-selected {
        background-color: transparent !important;
        color: #2563eb !important;
        border: 1px solid #2563eb !important;
    }
    .react-datepicker__triangle {
        display: none !important;
    }
`;

export default Appointment;
