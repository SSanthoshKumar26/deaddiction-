import React from 'react';
import { motion } from 'framer-motion';
import { FaWifi, FaTv, FaCoffee, FaTree, FaBed, FaUserNurse, FaCheck } from 'react-icons/fa';

// Assets
const IMAGES = {
    room: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1200",
    reception: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    outdoor: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=800",
    counseling: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
};

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

const Facilities = () => {
    return (
        <div className="bg-white min-h-screen selection:bg-primary-100">
            {/* --- HEADER --- */}
            <section className="pb-20 bg-[#FAF9F6] border-b border-surface-100">
                <div className="container-custom">
                    <FadeInView className="max-w-3xl">
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-[0.25em] block mb-6">Environment & Design</span>
                        <h1 className="text-5xl lg:text-7xl font-semibold text-surface-900 mb-8 tracking-tight font-display">
                            A sanctuary for <br />
                            <span className="text-primary-800 italic">quiet restoration.</span>
                        </h1>
                        <p className="text-xl text-surface-600 font-normal leading-relaxed text-balance">
                            We believe that the environment is a silent therapist. Our facilities are meticulously designed to provide safety, dignity, and a profound sense of calmness.
                        </p>
                    </FadeInView>
                </div>
            </section>

            {/* --- MAIN FEATURE: PRIVATE SUITES --- */}
            <section className="py-32 bg-white">
                <div className="container-custom">
                    <FadeInView className="grid lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7 relative group">
                            <div className="absolute -inset-4 border border-surface-100 rounded-lg -z-10 translate-x-2 translate-y-2" />
                            <img
                                src={IMAGES.room}
                                alt="Private Recovery Suite"
                                className="w-full h-[600px] object-cover rounded-sm shadow-subtle group-hover:brightness-95 transition-all duration-700"
                            />
                        </div>
                        <div className="lg:col-span-5">
                            <span className="text-xs font-bold text-primary-600 uppercase tracking-[0.2em] block mb-6">Accommodation</span>
                            <h2 className="text-4xl lg:text-5xl font-semibold text-surface-900 mb-10 leading-[1.2] tracking-tight">
                                Private suites for <br /> undisturbed healing.
                            </h2>
                            <p className="text-lg text-surface-500 leading-relaxed font-normal mb-10">
                                Each patient is provided with a secure, climate-controlled suite. These spaces are designed to minimize external stressors while maintaining a connection to medical observation.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-surface-100">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-surface-800">
                                        <FaBed className="text-primary-300" />
                                        <span className="text-sm font-bold tracking-tight">Ergonomic Care</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-surface-800">
                                        <FaTv className="text-primary-300" />
                                        <span className="text-sm font-bold tracking-tight">Digital Access</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-surface-800">
                                        <FaUserNurse className="text-primary-300" />
                                        <span className="text-sm font-bold tracking-tight">24/7 Observation</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-surface-800">
                                        <FaWifi className="text-primary-300" />
                                        <span className="text-sm font-bold tracking-tight">Secure Network</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInView>
                </div>
            </section>

            {/* --- SECONDARY FEATURES GRID --- */}
            <section className="py-32 bg-[#FAF9F6]">
                <div className="container-custom">
                    <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                        {[
                            {
                                img: IMAGES.outdoor,
                                title: "Natural Spaces",
                                desc: "Dedicated outdoor areas for morning sunlight, mindfulness practice, and gentle physical activity."
                            },
                            {
                                img: IMAGES.counseling,
                                title: "Discovery Rooms",
                                desc: "Private, acoustically treated rooms specifically designed for clinical therapy and family reunification."
                            },
                            {
                                img: IMAGES.reception,
                                title: "Patient Flow",
                                desc: "Discreet and professional reception management to ensure absolute privacy from the moment of intake."
                            }
                        ].map((item, i) => (
                            <FadeInView key={i} delay={i * 0.1} className="group cursor-default">
                                <div className="aspect-[4/5] overflow-hidden rounded-sm mb-8 filter grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-1000 origin-bottom">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl font-semibold text-surface-900 mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-surface-500 text-[15px] leading-relaxed font-normal">{item.desc}</p>
                            </FadeInView>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- AMENITIES LIST --- */}
            <section className="py-32 bg-white text-center">
                <div className="container-custom">
                    <FadeInView className="max-w-2xl mx-auto mb-20 text-center">
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-[0.25em] block mb-6">Patient Services</span>
                        <h2 className="text-4xl lg:text-5xl font-semibold text-surface-900 tracking-tight">Designed for comfort.</h2>
                    </FadeInView>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: FaCoffee, label: "Nutritional Care" },
                            { icon: FaTree, label: "Therapeutic Garden" },
                            { icon: FaUserNurse, label: "Critical Response" },
                            { icon: FaBed, label: "Hygienic Suites" }
                        ].map((item, i) => (
                            <FadeInView key={i} delay={i * 0.1} className="p-10 border border-surface-100 rounded-sm hover:border-primary-100 transition-colors group">
                                <item.icon className="text-3xl text-surface-300 group-hover:text-primary-600 transition-colors mx-auto mb-6" />
                                <span className="text-[11px] font-bold text-surface-600 uppercase tracking-[0.2em] group-hover:text-surface-900 transition-colors">{item.label}</span>
                            </FadeInView>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Facilities;
