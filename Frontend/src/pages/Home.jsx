import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FaUserMd, FaHospital, FaPhoneAlt, FaCheck, FaArrowRight, FaBrain, FaLeaf,
    FaHandsHelping, FaQuoteLeft, FaStar, FaWhatsapp, FaCalendarCheck, FaHeart,
    FaShieldAlt, FaUsers, FaHeartbeat, FaChartLine, FaAward, FaHandHoldingHeart
} from 'react-icons/fa';
import CountUp from '../components/CountUp';
import ReviewSection from '../components/ReviewSection';


// --- Modern Font Classes ---
const modernFonts = {
    display: "font-display font-bold tracking-tight",
    heading: "font-sans font-bold",
    body: "font-sans font-normal",
    accent: "font-sans font-semibold"
};

// --- Updated Assets with better contrast ---
const HERO_IMAGES = [
    {
        src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000",
        alt: "Professional Medical Consultation",
        overlay: "linear-gradient(112deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.78) 100%)"
    },
    {
        src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=2000",
        alt: "Recovery Therapy Session",
        overlay: "linear-gradient(112deg, rgba(30,64,175,0.85) 0%, rgba(15,23,42,0.85) 100%)"
    },
    {
        src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000",
        alt: "Medical Care Environment",
        overlay: "linear-gradient(112deg, rgba(124,58,237,0.85) 0%, rgba(30,64,175,0.85) 100%)"
    }
];

const QUOTES = [
    "Recovery is a journey, not a destination.",
    "Healing begins when you choose yourself.",
    "Every sunrise is a new chapter.",
    "Your past does not determine your future."
];

// --- Modern Animation Components ---
const StaggerChildren = ({ children, stagger = 0.1, className = "" }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
            visible: {
                transition: {
                    staggerChildren: stagger
                }
            }
        }}
        className={className}
    >
        {children}
    </motion.div>
);

const FadeUp = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

const ScaleIn = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

// --- Updated Fixed Sidebar (Better Text Visibility) ---
const FixedSidebar = () => (
    <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 pl-2"
    >
        {[
            {
                href: "https://wa.me/919751055190",
                icon: FaWhatsapp,
                label: "Chat Now",
                bg: "bg-green-600",
                border: "border-green-700"
            },
            {
                to: "/appointment",
                icon: FaCalendarCheck,
                label: "Book Appointment",
                bg: "bg-blue-600",
                border: "border-blue-700"
            }
        ].map((item, idx) => (
            <motion.div
                key={idx}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {item.href ? (
                    <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            group w-14 hover:w-56 h-14 ${item.bg} text-white
                            rounded-r-full shadow-lg border-l-0 ${item.border} border
                            flex items-center overflow-hidden
                            transition-all duration-500 ease-in-out
                        `}
                    >
                        <div className="w-14 h-14 flex items-center justify-center shrink-0 z-10 transition-transform duration-300 group-hover:scale-110">
                            <item.icon size={22} />
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap px-4 text-sm font-bold transition-all duration-500 delay-100">
                            {item.label}
                        </span>
                    </a>
                ) : (
                    <Link
                        to={item.to}
                        className={`
                            group w-14 hover:w-64 h-14 ${item.bg} text-white
                            rounded-r-full shadow-lg border-l-0 ${item.border} border
                            flex items-center overflow-hidden
                            transition-all duration-500 ease-in-out
                        `}
                    >
                        <div className="w-14 h-14 flex items-center justify-center shrink-0 z-10 transition-transform duration-300 group-hover:scale-110">
                            <item.icon size={20} />
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap px-4 text-sm font-bold transition-all duration-500 delay-100">
                            {item.label}
                        </span>
                    </Link>
                )}
            </motion.div>
        ))}
    </motion.div>
);

// ... (Restored Hero Slider omitted as it's unchanged) ...
// ... (Professional Hero Section omitted as it's unchanged) ...
// ... (Quotes Section omitted as it's unchanged) ...
// ... (Stats Section omitted as it's unchanged) ...



// --- Restored Hero Slider (kept exactly as requested) ---
const HeroImageSlider = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={HERO_IMAGES[index].src}
                        alt={HERO_IMAGES[index].alt}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Simple Clean Indicators */}
            <div className="absolute bottom-6 left-6 flex gap-2 z-20">
                {HERO_IMAGES.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Professional Hero Section (Strict Alignment & Hygiene) ---
const ProfessionalHeroSection = () => {
    return (
        <section className="relative w-full overflow-hidden bg-white">
            {/* Subtle Professional Background Image */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.035] grayscale"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            {/* Soft Gradient Overlay for depth */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/0 via-white/40 to-white pointer-events-none"></div>

            {/* Structural spacing to clear navbar perfectly */}
            <div className="pb-20 lg:pb-28 relative z-10">
                <div className="container-custom relative">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                        {/* LEFT COLUMN - Hierarchy & Clarity */}
                        <div className="max-w-2xl order-2 lg:order-1 flex flex-col items-start text-left">

                            {/* Static, Professional Label */}
                            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded bg-slate-50/80 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                Licensed Psychiatric & De-Addiction Center
                            </div>

                            {/* Priority Headline */}
                            <h1 className="font-display font-bold text-5xl lg:text-[5rem] text-slate-900 leading-[1.1] mb-6 tracking-tight -ml-1">
                                Evidence-Based <br />
                                <span className="text-blue-700">
                                    Recovery Care
                                </span>
                            </h1>

                            {/* Readable Subheadline */}
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-lg font-normal">
                                We combine advanced addiction medicine with compassionate therapy to build a sustainable foundation for your future.
                            </p>

                            {/* High Contrast Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
                                <Link
                                    to="/appointment"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-base font-semibold rounded-lg transition-colors min-w-[180px] shadow-sm"
                                >
                                    Book Consultation
                                </Link>

                                <a
                                    href="tel:9751055190"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-900 border border-slate-300 hover:bg-slate-50 font-semibold rounded-lg transition-colors min-w-[180px]"
                                >
                                    <span className="flex items-center gap-2">
                                        <FaPhoneAlt className="text-slate-900" size={14} />
                                        <span>24/7 Helpline</span>
                                    </span>
                                </a>
                            </div>

                            {/* Clean Trust Signals - Static */}
                            <div className="border-t border-slate-100 pt-8 w-full">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Accredited Excellence</p>
                                <div className="flex flex-wrap gap-8 items-center">
                                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                                        <FaHospital size={20} className="text-slate-400" />
                                        <span>ISO 9001 Certified</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                                        <FaShieldAlt size={20} className="text-slate-400" />
                                        <span>HIPAA Compliant</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                                        <FaUserMd size={20} className="text-slate-400" />
                                        <span>Licensed Doctors</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - The Slider (Clean Frame) */}
                        <div className="order-1 lg:order-2 w-full h-full relative">
                            {/* Simple solid frame without decoration */}
                            <div className="relative rounded-2xl p-2 bg-white/40 backdrop-blur-sm border border-slate-100 shadow-2xl">
                                <HeroImageSlider />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Professional Quotes Section ---
const QuotesSection = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % QUOTES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-16 bg-slate-50 border-b border-slate-200">
            <div className="container-custom max-w-4xl mx-auto text-center">
                <div className="relative h-32 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center"
                        >
                            <FaQuoteLeft className="text-blue-200 text-3xl mb-4" />
                            <h3 className="text-2xl md:text-3xl font-serif text-slate-800 leading-relaxed italic">
                                "{QUOTES[index]}"
                            </h3>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

// --- Professional Stats Section ---
const StatsSection = () => (
    <section className="py-20 bg-white border-b border-slate-100">
        <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                {[
                    { label: "Years of Excellence", val: 15, suffix: "+", icon: FaAward },
                    { label: "Lives Transformed", val: 5000, suffix: "+", icon: FaHeartbeat },
                    { label: "Expert Team", val: 50, suffix: "+", icon: FaUsers },
                    { label: "Success Rate", val: 95, suffix: "%", icon: FaChartLine }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center group">
                        <stat.icon className="text-blue-600 text-3xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="text-5xl font-bold text-slate-900 mb-2 tracking-tight">
                            <CountUp end={stat.val} suffix={stat.suffix} duration={2.5} />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-t border-slate-100 pt-4 mt-2 w-full max-w-[120px]">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// --- Professional Expertise Card (Rounded & Minimal) ---
const ExpertiseCard = ({ title, desc, icon: Icon, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
        className="group relative bg-white p-10 rounded-2xl hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col items-start text-left h-full"
    >
        {/* Subtle professional accent */}
        <div className="w-12 h-1 bg-blue-600 mb-8 rounded-full group-hover:w-20 transition-all duration-500" />

        <div className="mb-6 w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
            <Icon size={24} />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-4 font-display">
            {title}
        </h3>

        <p className="text-slate-600 leading-relaxed text-sm font-normal">
            {desc}
        </p>
    </motion.div>
);

// --- Professional Testimonial Card ---
const TestimonialCard = ({ quote, author, role }) => (
    <div className="bg-white p-8 border border-slate-200 h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <div className="flex gap-1 mb-6 text-yellow-500 text-xs">
            {[...Array(5)].map((_, i) => <FaStar key={i} />)}
        </div>
        <p className="text-slate-700 text-lg italic leading-relaxed mb-8 flex-grow font-serif">
            "{quote}"
        </p>
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm">
                {author[0]}
            </div>
            <div>
                <p className="text-slate-900 font-bold text-sm">{author}</p>
                <p className="text-slate-500 text-xs uppercase tracking-wide">{role}</p>
            </div>
        </div>
    </div>
);

// --- Professional Who We Are Section ---
const WhoWeAreSection = () => (
    <section className="py-24 bg-white border-b border-slate-100 overflow-hidden">
        <div className="container-custom lg:pl-24">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Image Section - Slides in from LEFT */}
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative order-2 lg:order-1"
                >
                    <div className="relative z-10 p-2 bg-white shadow-xl rounded-2xl border border-slate-100">
                        <img
                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200"
                            alt="Modern Recovery Center"
                            className="w-full h-[500px] object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                    {/* Minimal architectural element */}
                    <div className="absolute top-8 -left-8 w-2/3 h-2/3 bg-slate-50 -z-10 rounded-2xl border border-slate-100" />
                </motion.div>

                {/* Content Section - Slides in from RIGHT */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="order-1 lg:order-2"
                >
                    <div className="inline-block px-3 py-1 mb-6 border-l-4 border-blue-600 bg-slate-50">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-2">
                            Institutional Philosophy
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Beyond Treatment.<br />
                        <span className="text-blue-700">A Journey to Wholeness.</span>
                    </h2>

                    <p className="text-slate-600 text-lg leading-relaxed mb-10 max-w-xl font-normal">
                        We believe recovery is about rediscovering purpose, rebuilding relationships, and reclaiming life.
                        Our evidence-based approach combines clinical excellence with compassionate, patient-centered care.
                    </p>

                    <div className="space-y-6 mb-12">
                        {[
                            { title: "Holistic Restoration", desc: "Integration of physiological and psychological health", icon: FaHeartbeat },
                            { title: "Personalized Care", desc: "Bespoke treatment plans adapted to individual needs", icon: FaUserMd },
                            { title: "Inclusive Therapy", desc: "Comprehensive support systems for families and caregivers", icon: FaUsers },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + (idx * 0.1), duration: 0.5 }}
                                className="flex items-start gap-4 group"
                            >
                                <div className="mt-1 w-12 h-12 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-600 group-hover:bg-blue-50 transition-all duration-300 rounded-xl">
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                                    <p className="text-slate-500 text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <Link
                        to="/about"
                        className="inline-flex items-center gap-3 text-slate-900 font-bold border-b-2 border-slate-900 pb-1 hover:text-blue-700 hover:border-blue-700 transition-colors group"
                    >
                        <span>Institutional Profile</span>
                        <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </div>
    </section>
);

// --- Professional CTA Section (Separated & Modern) ---
// --- Compact & Professional CTA Section ---
const CTASection = () => (
    <section className="py-10 md:py-12 mb-10 mx-4 lg:mx-8 rounded-2xl bg-slate-900 text-white relative overflow-hidden">
        <div className="container-custom max-w-4xl mx-auto text-center px-5">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-slate-700 rounded-full mb-5 bg-slate-800/60">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                    Confidential Consultation
                </span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 leading-snug text-white">
                Your Recovery Journey Starts Today
            </h2>


            {/* Description */}
            <p className="text-slate-400 text-base md:text-lg mb-7 max-w-xl mx-auto leading-relaxed">
                Compassionate, discreet care from licensed professionals — available 24/7.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                    href="tel:9751055190"
                    className="w-full sm:w-auto min-w-[220px] px-7 py-3.5 bg-white text-slate-900 font-semibold text-base rounded-xl shadow-md hover:bg-blue-50 transition flex items-center justify-center gap-3"
                >
                    <FaPhoneAlt className="text-blue-600" size={18} />
                    <span>97510 55190</span>
                </a>

                <Link
                    to="/contact"
                    className="w-full sm:w-auto min-w-[220px] px-7 py-3.5 border border-slate-600 text-white font-semibold text-base rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                    <FaCalendarCheck size={18} />
                    <span>Schedule Assessment</span>
                </Link>
            </div>
        </div>
    </section>
);

const Home = () => {
    return (
        <div className="w-full bg-white overflow-hidden">

            <FixedSidebar />

            <ProfessionalHeroSection />

            <StatsSection />

            <QuotesSection />

            <WhoWeAreSection />

            {/* Refined Expertise Section with better spacing and alignment */}
            <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
                {/* Clean, structural background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-200/30 rounded-full blur-[120px] -z-10" />

                <div className="container-custom lg:pl-24"> {/* Added padding to clear sidebar */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20">
                        <div className="max-w-2xl">
                            <FadeUp>
                                <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                                    Clinical Expertise
                                </span>
                                <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
                                    Specialized Care <br />
                                    <span className="text-blue-600">Tailored to Your Recovery</span>
                                </h2>
                            </FadeUp>
                        </div>
                        <FadeUp delay={0.2} className="max-w-md">
                            <p className="text-slate-600 text-lg leading-relaxed font-normal border-l-2 border-slate-200 pl-6">
                                We provide a spectrum of evidence-based treatments, meticulously designed to address the unique complexities of neurological and psychiatric wellness.
                            </p>
                        </FadeUp>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 relative z-10">
                        {[
                            {
                                title: "Alcohol Rehabilitation",
                                desc: "Comprehensive medical detoxification and behavioral therapy tailored for long-term sobriety.",
                                icon: FaHospital
                            },
                            {
                                title: "Drug Addiction",
                                desc: "Specialized treatment protocols for opioid, prescription, and synthetic dependency management.",
                                icon: FaLeaf
                            },
                            {
                                title: "Dual Diagnosis",
                                desc: "Simultaneous care for substance use disorders and co-occurring mental health conditions.",
                                icon: FaBrain
                            },
                            {
                                title: "Family Counseling",
                                desc: "Structured therapeutic sessions to rebuild family dynamics and establish home support systems.",
                                icon: FaUsers
                            },
                            {
                                title: "CBT & Psychotherapy",
                                desc: "Evidence-based cognitive behavioral strategies to transform maladaptive thought patterns.",
                                icon: FaUserMd
                            },
                            {
                                title: "Relapse Prevention",
                                desc: "Dynamic long-term monitoring and support frameworks to safeguard your recovery journey.",
                                icon: FaChartLine
                            }
                        ].map((item, index) => (
                            <ExpertiseCard key={index} {...item} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Review Section */}
            <ReviewSection />

            <CTASection />
        </div>
    );
};

export default Home;