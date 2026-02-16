import React from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaHeartbeat, FaBrain, FaUsers, FaPrescriptionBottle, FaCheck, FaArrowRight, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PROGRAMS = [
    {
        title: "Alcoholism",
        icon: <FaPrescriptionBottle />,
        description: "A medically supervised program focused on safe physiological withdrawal and the restoration of neurological stability.",
        features: [
            "24/7 Medical Detoxification",
            "Withdrawal Management",
            "Liver Function Recovery",
            "CBT & Relapse Control"
        ]
    },
    {
        title: "Drug Dependency",
        icon: <FaUserMd />,
        description: "Specialized detoxification for opioid, stimulant, and prescription medication addictions using modern clinical protocols.",
        features: [
            "Medically Assisted Tapering",
            "Biometric Monitoring",
            "Neuro-Stabilization",
            "Narcotics Support Groups"
        ]
    },
    {
        title: "Dual Diagnosis",
        icon: <FaHeartbeat />,
        description: "Simultaneous stabilization for patients facing addiction alongside mental health comorbidities like OCD or Depression.",
        features: [
            "Integrated Psychiatric Care",
            "Medication Stewardship",
            "Trauma-Informed Therapy",
            "Holistic Stabilization"
        ]
    },
    {
        title: "Psychiatric Care",
        icon: <FaBrain />,
        description: "Expert inpatient treatment for a wide range of mental health conditions within a secure, non-judgmental environment.",
        features: [
            "Schizophrenia Management",
            "Bipolar Stabilization",
            "Severe Clinical Depression",
            "Suicide Prevention Protocol"
        ]
    },
    {
        title: "Family Systems",
        icon: <FaUsers />,
        description: "Healing the relationship ecosystem is essential for long-term sobriety. We provide education and therapy for loved ones.",
        features: [
            "Codependency Counseling",
            "Boundary Setting Workshops",
            "Effective Communication",
            "Home Transition Planning"
        ]
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

const Programs = () => {
    return (
        <div className="bg-white min-h-screen selection:bg-primary-100">
            {/* --- HEADER --- */}
            <section className="pb-20 bg-[#FAF9F6] border-b border-surface-100 mt-8">
                <div className="container-custom">
                    <FadeInView className="max-w-3xl">
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-[0.25em] block mb-6">Clinical Care Pathways</span>
                        <h1 className="text-5xl lg:text-7xl font-semibold text-surface-900 mb-8 tracking-tight font-display">
                            Evidence-based <br />
                            <span className="text-primary-800 italic">healing programs.</span>
                        </h1>
                        <p className="text-xl text-surface-600 font-normal leading-relaxed text-balance">
                            Our treatment models integrate the latest psychiatric advancements with deep empathetic support, ensuring a continuum of care tailored to each unique human journey.
                        </p>
                    </FadeInView>
                </div>
            </section>

            {/* --- PROGRAM GRID --- */}
            <section className="py-32 bg-white">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-surface-100 mb-24">
                        {PROGRAMS.map((program, idx) => (
                            <FadeInView key={idx} className="p-12 border-r border-b border-surface-100 group hover:bg-[#FAF9F6] transition-all duration-700">
                                <div className="w-12 h-12 text-primary-600 mb-10 flex items-center justify-start border-b border-primary-100 pb-2">
                                    <div className="opacity-70 group-hover:opacity-100 transition-opacity text-2xl">
                                        {program.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-semibold text-surface-900 mb-6 tracking-tight">{program.title}</h3>
                                <p className="text-surface-500 leading-relaxed text-[15px] font-normal mb-10">
                                    {program.description}
                                </p>

                                <div className="bg-white/50 border border-surface-100 rounded-sm p-6 mb-10">
                                    <ul className="space-y-3">
                                        {program.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-3 text-surface-600 text-xs font-medium uppercase tracking-wider">
                                                <FaCheck className="text-primary-300 mt-0.5 flex-shrink-0" size={10} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    to="/appointment"
                                    className="inline-flex items-center gap-3 text-surface-900 font-bold text-[9px] uppercase tracking-[0.25em] opacity-30 group-hover:opacity-100 transition-all"
                                >
                                    Review Protocol <FaArrowRight size={10} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </FadeInView>
                        ))}
                    </div>

                    {/* COUNSELOR CONTACT */}
                    <FadeInView delay={0.3} className="max-w-5xl mx-auto bg-surface-900 rounded-sm overflow-hidden text-white flex flex-col lg:flex-row items-center">
                        <div className="p-12 lg:p-20 lg:w-2/3 border-b lg:border-b-0 lg:border-r border-white/10">
                            <h2 className="text-3xl font-semibold mb-6 tracking-tight">Not sure where to begin?</h2>
                            <p className="text-white/50 text-lg leading-relaxed mb-10">
                                Every recovery journey is unique. Our intake coordinators are available for a confidential assessment to help you determine the most effective medical pathway for your situation.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <a href="tel:9751055190" className="px-10 py-5 bg-white text-surface-900 font-bold text-lg rounded-sm hover:bg-primary-50 transition-all flex items-center justify-center gap-4">
                                    <FaPhoneAlt size={16} className="text-primary-600" />
                                    <span>Call Counselors</span>
                                </a>
                                <Link to="/contact" className="px-10 py-5 bg-transparent border border-white/20 text-white font-bold text-lg rounded-sm hover:bg-white/10 transition-all flex items-center justify-center">
                                    Inquire Privately
                                </Link>
                            </div>
                        </div>
                        <div className="p-12 lg:p-20 lg:w-1/3 flex flex-col items-center justify-center text-center">
                            <div className="mb-6">
                                <div className="text-4xl font-bold text-primary-300 mb-1">24/7</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Clinical Support</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary-300 mb-1">100%</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Confidentiality</div>
                            </div>
                        </div>
                    </FadeInView>
                </div>
            </section>
        </div>
    );
};

export default Programs;
