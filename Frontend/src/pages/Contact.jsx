import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaWhatsapp, FaArrowRight, FaShieldAlt, FaHospital } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const ContactItem = ({ icon: Icon, title, content, link, action }) => (
    <div className="group flex flex-col items-center text-center p-12 bg-white border border-surface-100 rounded-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
        <div className="w-16 h-16 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
            <Icon size={24} />
        </div>
        <div className="w-full">
            <h3 className="font-bold text-surface-400 text-[10px] uppercase tracking-[0.3em] mb-4">{title}</h3>
            {link ? (
                <a href={link} className="text-xl text-surface-900 hover:text-primary-600 transition-colors block whitespace-pre-line font-semibold tracking-tight mb-6 leading-snug">
                    {content}
                </a>
            ) : (
                <p className="text-xl text-surface-900 whitespace-pre-line font-semibold tracking-tight mb-6 leading-snug">{content}</p>
            )}
            {action && (
                <a
                    href={link}
                    className="inline-flex items-center gap-3 text-[10px] font-bold text-primary-600 uppercase tracking-widest group-hover:gap-5 transition-all py-2 border-b-2 border-transparent hover:border-primary-600"
                >
                    {action} <FaArrowRight size={10} />
                </a>
            )}
        </div>
    </div>
);

// --- Custom Marker Icon ---
const customIcon = new L.divIcon({
    html: `
        <div class="relative flex items-center justify-center">
            <div class="absolute w-10 h-10 bg-blue-600/20 rounded-full animate-ping"></div>
            <div class="relative w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M256 32c-88.366 0-160 71.634-160 160 0 72.33 160 320 160 320s160-247.67 160-320c0-88.366-71.634-160-160-160zm0 216c-30.928 0-56-25.072-56-56s25.072-56 56-56 56 25.072 56 56-25.072 56-56 56z"></path></svg>
            </div>
        </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

const Contact = () => {
    const position = [9.900232, 78.097006];

    return (
        <div className="bg-white min-h-screen selection:bg-primary-100">
            {/* --- HEADER --- */}
            <section className="pb-24 bg-[#FAF9F6]/90 border-b border-surface-100 relative overflow-hidden mt-8">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.1" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="container-custom relative z-10 text-center">
                    <FadeInView className="max-w-3xl mx-auto">
                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] block mb-8">Confidential clinical Support</span>
                        <h1 className="text-5xl lg:text-7xl font-semibold text-surface-900 mb-8 tracking-tight font-display text-balance leading-[1.1]">
                            You're not alone. <br />
                            <span className="text-primary-800 italic font-serif">Reach out today.</span>
                        </h1>
                        <p className="text-xl text-surface-600 font-normal leading-relaxed text-balance max-w-2xl mx-auto">
                            Whether you're seeking guidance for a loved one or need immediate clinical assistance, our team is available 24 hours a day.
                        </p>
                    </FadeInView>
                </div>
            </section>

            {/* --- CONTACT GRID --- */}
            <section className="py-32 bg-white relative">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FadeInView delay={0.1}>
                            <ContactItem
                                icon={FaPhoneAlt}
                                title="Call Assistance"
                                content={"97510 55190\n82480 11108"}
                                link="tel:9751055190"
                                action="Primary Helpline"
                            />
                        </FadeInView>
                        <FadeInView delay={0.2}>
                            <ContactItem
                                icon={FaWhatsapp}
                                title="WhatsApp"
                                content="+91 97510 55190"
                                link="https://wa.me/919751055190"
                                action="Message us"
                            />
                        </FadeInView>
                        <FadeInView delay={0.3}>
                            <ContactItem
                                icon={FaEnvelope}
                                title="Email Us"
                                content={"info@sobercenter.com\nsupport@sobercenter.com"}
                                link="mailto:info@sobercenter.com"
                                action="Official Inquiry"
                            />
                        </FadeInView>
                        <FadeInView delay={0.4}>
                            <ContactItem
                                icon={FaMapMarkerAlt}
                                title="Location"
                                content={"26, Nehru Nagar,\nMadurai – 625003"}
                                link="https://www.google.com/maps/search/?api=1&query=9.900232,78.097006"
                                action="Get Directions"
                            />
                        </FadeInView>
                    </div>
                </div>
            </section>

            {/* --- MAP SECTION --- */}
            <section className="pt-24 bg-[#FAF9F6] border-t border-surface-100">
                <div className="container-custom mb-20 text-center md:text-left">
                    <FadeInView>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                            <div className="max-w-xl">
                                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.3em] block mb-4">Location</span>
                                <h2 className="text-4xl font-semibold text-surface-900 mb-6 tracking-tight font-display">Visit our Center</h2>
                                <p className="text-lg text-surface-600 leading-relaxed max-w-lg">
                                    Located in the heart of Madurai, our facility provides a serene and secure environment for psychiatric care and de-addiction recovery.
                                </p>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-8">
                                <div className="text-right hidden lg:block">
                                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Response Time</p>
                                    <p className="text-sm font-semibold text-surface-900">Under 15 Minutes</p>
                                </div>
                                <div className="w-px h-12 bg-surface-200 hidden lg:block"></div>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=9.900232,78.097006"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-10 py-5 bg-primary-600 text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary-700 transition-all shadow-xl hover:shadow-primary-100 flex items-center gap-3"
                                >
                                    Open Google Maps <FaArrowRight size={10} />
                                </a>
                            </div>
                        </div>
                    </FadeInView>
                </div>

                <div className="h-[650px] w-full relative border-y border-surface-100 bg-surface-50">
                    <MapContainer
                        center={position}
                        zoom={15}
                        scrollWheelZoom={false}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                        />
                        <Marker position={position} icon={customIcon}>
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h3 className="font-bold text-slate-900 mb-1">SOBER Psychiatric Center</h3>
                                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                        26, Nehru Nagar, 1st Street,<br />
                                        TVS Nagar, Madurai - 3
                                    </p>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-wider hover:text-blue-700 transition-colors"
                                    >
                                        Get Directions
                                        <FaArrowRight size={10} />
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </section>

            {/* --- SUB FOOTER --- */}
            <section className="py-20 bg-surface-900">
                <div className="container-custom">
                    <div className="grid md:grid-cols-3 gap-12 items-center">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white">
                                <FaShieldAlt size={30} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-1">Secure</h4>
                                <p className="text-surface-400 text-sm">100% Confidential</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white">
                                <FaClock size={28} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-1">Available</h4>
                                <p className="text-surface-400 text-sm">24/7 Clinical Support</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white">
                                <FaHospital size={28} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-1">Authorized</h4>
                                <p className="text-surface-400 text-sm">Government Approved</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
