import React from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaAward, FaStethoscope, FaArrowRight, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DOCTOR_IMG = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400";

const DOCTORS = [
    {
        name: 'Dr. A. Sharma',
        qualification: 'MD (Psychiatry)',
        role: 'Medical Director',
        experience: '20+ Years',
        specialization: 'Addiction Medicine & Dual Diagnosis',
        bio: 'Leading our clinical team with two decades of experience in treating complex physiological addiction and psychiatric comorbidities.'
    },
    {
        name: 'Dr. R. Kumar',
        qualification: 'MBBS, DPM',
        role: 'Consultant Psychiatrist',
        experience: '12+ Years',
        specialization: 'Detoxification Protocols',
        bio: 'Specializing in evidence-based neuro-stabilization and medically supervised detoxification pathways.'
    },
    {
        name: 'Ms. Priya Menon',
        qualification: 'M.Sc (Clinical Psychology)',
        role: 'Lead Psychologist',
        experience: '10+ Years',
        specialization: 'CBT & Family Systems',
        bio: 'Expert in cognitive behavioral therapies and restructuring the family support ecosystem during the healing process.'
    },
    {
        name: 'Mr. K. Suresh',
        qualification: 'MSW (Medical & Psychiatry)',
        role: 'Senior Counselor',
        experience: '8+ Years',
        specialization: 'Rehabilitation & Aftercare',
        bio: 'Dedicated to social reintegration and building resilient long-term sobriety foundations through active aftercare.'
    }
];

const FadeInView = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

const Doctors = () => {
    return (
        <div className="bg-white min-h-screen selection:bg-primary-100">
            {/* --- HEADER --- */}
            <section className="pb-20 bg-[#FAF9F6] border-b border-surface-100 mt-8">
                <div className="container-custom">
                    <FadeInView className="max-w-3xl">
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-[0.25em] block mb-6">Our Medical Board</span>
                        <h1 className="text-5xl lg:text-7xl font-semibold text-surface-900 mb-8 tracking-tight font-display text-balance">
                            Guided by clinical <br />
                            <span className="text-primary-800 italic">excellence.</span>
                        </h1>
                        <p className="text-xl text-surface-600 font-normal leading-relaxed text-balance">
                            Our team of board-certified psychiatrists, psychologists, and clinical counselors bring over 50 years of combined experience to your recovery.
                        </p>
                    </FadeInView>
                </div>
            </section>

            {/* --- DOCTOR GRID --- */}
            <section className="py-32 bg-white">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-32">
                        {DOCTORS.map((doc, idx) => (
                            <FadeInView key={idx} delay={idx * 0.1}>
                                <div className="group">
                                    <div className="relative aspect-[3/4] mb-8 overflow-hidden rounded-sm">
                                        <img
                                            src={DOCTOR_IMG}
                                            alt={doc.name}
                                            className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/40 to-transparent opacity-60" />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-semibold text-surface-900 tracking-tight">{doc.name}</h3>
                                            <p className="text-primary-600 font-bold text-[10px] uppercase tracking-[0.2em]">{doc.role}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-4 border-y border-surface-100 py-3">
                                            <div className="flex items-center gap-2 text-surface-400 text-[10px] font-bold uppercase tracking-widest">
                                                <FaAward className="text-primary-200" />
                                                {doc.qualification}
                                            </div>
                                            <div className="flex items-center gap-2 text-surface-400 text-[10px] font-bold uppercase tracking-widest">
                                                <FaStethoscope className="text-primary-200" />
                                                {doc.experience} Experience
                                            </div>
                                        </div>
                                        <p className="text-surface-500 text-sm leading-relaxed font-normal">
                                            {doc.bio}
                                        </p>
                                    </div>
                                </div>
                            </FadeInView>
                        ))}
                    </div>

                    {/* STAFF RATIO STRIP */}
                    <FadeInView className="bg-[#FAF9F6] p-16 text-center rounded-sm">
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-[0.25em] block mb-4">Round-the-clock Care</span>
                        <h3 className="text-3xl font-semibold text-surface-900 mb-8 tracking-tight">24/7 Nursing & Support Ecosystem</h3>
                        <p className="text-surface-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
                            Beyond our core medical board, our facility is staffed by registered nurses and empathetic support staff who ensure a safe, supportive environment every hour of the day.
                        </p>
                        <div className="inline-flex items-center gap-6 px-10 py-5 bg-white border border-surface-100 rounded-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                                <span className="text-sm font-bold text-surface-700 tracking-tight">1:4 Staff-to-Patient Ratio</span>
                            </div>
                            <div className="w-px h-4 bg-surface-200" />
                            <span className="text-sm font-bold text-surface-700 tracking-tight text-primary-600">Secure Environment</span>
                        </div>
                    </FadeInView>
                </div>
            </section>

            {/* --- CONTACT CTA --- */}
            <section className="py-24 bg-surface-900 text-white">
                <div className="container-custom flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="lg:max-w-xl">
                        <h3 className="text-3xl font-semibold mb-4 tracking-tight">Speak with a clinical specialist.</h3>
                        <p className="text-white/40 text-lg">Confidential guidance is just a phone call away. Available 24/7.</p>
                    </div>
                    <div className="flex gap-6">
                        <a href="tel:9010474614" className="px-10 py-5 bg-white text-surface-900 font-bold text-lg rounded-sm hover:bg-primary-50 transition-all flex items-center gap-3">
                            <FaPhoneAlt size={16} className="text-primary-600" />
                            Connect Now
                        </a>
                        <Link to="/appointment" className="px-10 py-5 bg-white/10 border border-white/10 text-white font-bold text-lg rounded-sm hover:bg-white/20 transition-all flex items-center gap-3">
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Doctors;
