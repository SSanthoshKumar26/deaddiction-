import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeartbeat, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-surface-900 text-white font-sans overflow-hidden">
            {/* Professional Top Gradient Border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-medical"></div>

            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="container-custom py-16 lg:py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300 transform group-hover:scale-105">
                                <FaHeartbeat size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-bold text-xl tracking-tight text-white leading-none">
                                    SOBER
                                </span>
                                <span className="text-[10px] text-surface-400 uppercase tracking-[0.2em] font-medium mt-1">
                                    Psychiatric Center
                                </span>
                            </div>
                        </Link>
                        <p className="text-surface-400 text-sm leading-relaxed max-w-sm">
                            A government recognized center dedicated to holistic de-addiction and psychiatric care. We combine advanced medical science with compassionate support for lasting recovery.
                        </p>

                        {/* Social Links (Professional Placeholders) */}
                        <div className="flex gap-3 pt-2">
                            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center text-surface-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="lg:pl-8">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span>
                            Quick Access
                        </h3>
                        <ul className="space-y-3.5 text-sm text-surface-400 font-medium">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Treatment Programs', path: '/programs' },
                                { name: 'Our Doctors', path: '/doctors' },
                                { name: 'Facilities', path: '/facilities' },
                                { name: 'Book Appointment', path: '/appointment' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="hover:text-primary-400 transition-colors flex items-center gap-2 group"
                                        onClick={() => window.scrollTo(0, 0)}
                                    >
                                        <FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300 text-primary-500" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Services - Added extra column for balance */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-secondary-500 rounded-full"></span>
                            Our Services
                        </h3>
                        <ul className="space-y-3.5 text-sm text-surface-400 font-medium">
                            <li><Link to="/programs" className="hover:text-secondary-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Alcohol De-addiction</Link></li>
                            <li><Link to="/programs" className="hover:text-secondary-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Drug Rehabilitation</Link></li>
                            <li><Link to="/programs" className="hover:text-secondary-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Counseling Therapy</Link></li>
                            <li><Link to="/programs" className="hover:text-secondary-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Mental Health Care</Link></li>
                            <li><Link to="/programs" className="hover:text-secondary-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Family Support</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info - Enhanced Design */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-primary-500 rounded-full"></span>
                            Contact Us
                        </h3>
                        <ul className="space-y-5 text-sm text-surface-400">
                            <li className="flex items-start gap-4 group">
                                <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors shrink-0">
                                    <FaMapMarkerAlt size={14} />
                                </div>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=26+Nehru+Nagar+1st+Street+TVS+Nagar+Madurai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="leading-relaxed hover:text-white transition-colors"
                                >
                                    26, Nehru Nagar, 1st Street,<br />
                                    TVS Nagar, Madurai – 3
                                </a>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-secondary-500 group-hover:bg-secondary-500 group-hover:text-white transition-colors shrink-0">
                                    <FaPhoneAlt size={14} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <a href="tel:9751055190" className="hover:text-white transition-colors font-semibold">97510 55190</a>
                                    <a href="tel:8248011108" className="hover:text-white transition-colors font-semibold">82480 11108</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors shrink-0">
                                    <FaEnvelope size={14} />
                                </div>
                                <a
                                    href="mailto:soberdeaddoctorpmcentre2022@gmail.com"
                                    className="hover:text-white transition-colors break-all leading-relaxed"
                                >
                                    soberdeaddoctorpmcentre2022@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-surface-950 border-t border-surface-800/50">
                <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-surface-500 font-medium">
                    <p className="text-center md:text-left">
                        &copy; {currentYear} SOBER Psychiatric Center. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        <Link to="#" className="hover:text-surface-300 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-surface-300 transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-surface-300 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
