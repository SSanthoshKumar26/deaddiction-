import React from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaHandHoldingHeart, FaUserShield, FaPhoneAlt, FaQuoteLeft, FaCheck } from 'react-icons/fa';

// Assets
const HERO_IMG = "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=2000";

// Motion Component for Consistency
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

const About = () => {
    return (
        <div className="bg-white min-h-screen selection:bg-primary-100">
            {/* --- HERO SECTION --- */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-surface-900">
                <div className="absolute inset-0 z-0">
                    <img src={HERO_IMG} alt="Healing Environment" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40 to-transparent" />
                </div>

                <div className="container-custom relative z-10 text-center">
                    <FadeInView>
                        <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.25em] uppercase text-primary-200 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
                            About Our Legacy
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-semibold text-white mb-8 tracking-tight font-display">
                            A sanctuary built on <br />
                            <span className="text-primary-300 italic">integrity and care.</span>
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto font-normal leading-relaxed">
                            Since our inception, SOBER has been dedicated to reclaiming lives from the cycle of addiction through clinical excellence.
                        </p>
                    </FadeInView>
                </div>
            </section>

            {/* --- CORE PHILOSOPHY --- */}
            <section className="py-32 bg-white">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-12 gap-24 items-start">
                        <div className="lg:col-span-7">
                            <FadeInView>
                                <span className="text-xs font-bold text-primary-600 uppercase tracking-[0.2em] block mb-6">Our Mission</span>
                                <h2 className="text-4xl lg:text-5xl font-semibold text-surface-900 mb-10 leading-[1.2] tracking-tight">
                                    Normalizing recovery as a <br /> journey toward wholeness.
                                </h2>
                                <div className="space-y-8 text-lg text-surface-600 leading-relaxed font-normal max-w-2xl">
                                    <p>
                                        At SOBER, our philosophy is simple: addiction is not a character flaw, but a complex medical condition that deserves the same clinical rigor as any other illness. We provide a professionally managed, high-security environment in Chennai where recovery is the only focus.
                                    </p>
                                    <p>
                                        Under the guidance of senior medical leadership, we integrate psychiatric stabilization with long-term behavioral therapy. Our goal is to empower individuals to regain control of their own stories.
                                    </p>
                                </div>

                                <div className="mt-16 grid sm:grid-cols-2 gap-12 pt-12 border-t border-surface-100">
                                    {[
                                        { title: "Empowerment", desc: "Helping patients discover their own agency and strength." },
                                        { title: "Clinical Rigor", desc: "Evidence-based medicine at the core of every protocol." }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <h4 className="font-bold text-surface-900 mb-3 uppercase text-[11px] tracking-[0.2em]">{item.title}</h4>
                                            <p className="text-surface-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </FadeInView>
                        </div>

                        <div className="lg:col-span-5">
                            <FadeInView delay={0.3} className="space-y-8">
                                {[
                                    {
                                        icon: FaHeartbeat,
                                        title: "Compassionate Care",
                                        desc: "Treating every individual with absolute dignity, regardless of their past.",
                                        color: "text-primary-600",
                                        bg: "bg-primary-50"
                                    },
                                    {
                                        icon: FaHandHoldingHeart,
                                        title: "Holistic Healing",
                                        desc: "Addressing the physical, neurological, and social dimensions of recovery.",
                                        color: "text-primary-600",
                                        bg: "bg-primary-50"
                                    },
                                    {
                                        icon: FaUserShield,
                                        title: "Ethical Integrity",
                                        desc: "Strict adherence to medical ethics and 100% patient confidentiality.",
                                        color: "text-primary-600",
                                        bg: "bg-primary-50"
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="group flex gap-8 p-10 bg-[#FAF9F6] rounded-sm border border-surface-100 hover:bg-white hover:shadow-subtle transition-all duration-500">
                                        <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300`}>
                                            <item.icon size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-surface-900 mb-2 tracking-tight">{item.title}</h3>
                                            <p className="text-surface-500 text-sm leading-relaxed font-normal">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </FadeInView>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- DIRECTOR'S MESSAGE --- */}
            <section className="py-32 bg-[#FAF9F6] relative overflow-hidden">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                        <FadeInView>
                            <div className="w-16 h-16 border border-primary-200 rounded-full flex items-center justify-center text-primary-600 mb-12">
                                <FaQuoteLeft size={24} />
                            </div>
                        </FadeInView>

                        <FadeInView delay={0.2}>
                            <h2 className="text-3xl md:text-5xl font-medium leading-[1.4] text-surface-900 italic opacity-95 tracking-tight text-balance mb-16 max-w-3xl">
                                "Recovery is not just about stopping the habit. It's about creating a new life where it is easier to not return to it."
                            </h2>

                            <div className="inline-flex flex-col items-center">
                                <div className="h-0.5 w-12 bg-primary-600 mb-6"></div>
                                <p className="text-sm font-bold text-surface-900 uppercase tracking-[0.3em] mb-1">Medical Director</p>
                                <p className="text-[10px] text-surface-400 font-bold uppercase tracking-[0.1em]">SOBER Psychiatric Center</p>
                            </div>
                        </FadeInView>
                    </div>
                </div>
            </section>

            {/* --- ADMISSIONS STRIP --- */}
            <section className="py-24 bg-surface-900 text-white relative">
                <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-12">
                    <FadeInView className="max-w-xl">
                        <h3 className="text-3xl font-semibold mb-4 tracking-tight">Ready to speak with a professional?</h3>
                        <p className="text-white/50 text-lg">We provide 24/7 support for families seeking guidance or immediate admissions.</p>
                    </FadeInView>
                    <FadeInView delay={0.2} className="flex gap-6">
                        <a href="tel:9751055190" className="px-10 py-5 bg-white text-surface-900 font-bold text-lg rounded-sm hover:bg-primary-50 transition-all flex items-center gap-3">
                            <FaPhoneAlt size={16} className="text-primary-600" />
                            97510 55190
                        </a>
                    </FadeInView>
                </div>
            </section>
        </div>
    );
};

export default About;
