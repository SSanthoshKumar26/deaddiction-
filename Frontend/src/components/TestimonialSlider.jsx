import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
    {
        text: "I kept waiting for 'rock bottom', but SOBER taught me I didn't have to lose everything to start gaining my life back. The facility is a sanctuary.",
        author: "James Peterson",
        role: "Alcohol Recovery, 3 Years Sober"
    },
    {
        text: "The dual-diagnosis program saved my daughter's life. They treated her depression and addiction as one connected issue, not separate problems.",
        author: "Sarah Jenkins",
        role: "Parent of Patient"
    },
    {
        text: "Privacy was my biggest concern. SOBER provided a discreet, dignified environment where I could focus entirely on healing without judgment.",
        author: "Michael R.",
        role: "Executive Detox Program"
    }
];

const TestimonialSlider = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length);
        }, 8000); // Slow auto-progression
        return () => clearInterval(timer);
    }, []);

    const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <div className="relative bg-surface-900 rounded-3xl p-8 md:p-12 overflow-hidden border border-white/10">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]"></div>

            <div className="relative z-10">
                <FaQuoteLeft className="text-4xl text-primary-500 mb-8 opacity-50" />

                <div className="h-[280px] md:h-[200px] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            <p className="text-lg md:text-2xl font-light text-white leading-relaxed italic mb-8">
                                "{testimonials[index].text}"
                            </p>
                            <div>
                                <h4 className="text-xl font-bold text-white">{testimonials[index].author}</h4>
                                <p className="text-primary-400 text-sm font-medium uppercase tracking-wider">{testimonials[index].role}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mt-8 border-t border-white/5 pt-6">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-500 text-sm" />
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={prev} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                            <FaChevronLeft />
                        </button>
                        <button onClick={next} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialSlider;
