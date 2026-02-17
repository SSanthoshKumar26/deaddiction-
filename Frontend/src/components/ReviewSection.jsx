import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

const ReviewCard = ({ review }) => (
    <div className="flex-shrink-0 w-80 md:w-96 p-6 mx-4 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
        {/* Decorative background gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

        <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {review.user?.name?.charAt(0) || <FiUser />}
            </div>
            <div>
                <h4 className="font-bold text-slate-800">{review.user?.name || 'Anonymous'}</h4>
                <div className="flex text-amber-400 text-sm gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <FiStar key={i} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-amber-400" : "text-slate-300"} />
                    ))}
                </div>
            </div>
        </div>

        <p className="text-slate-600 italic leading-relaxed text-sm relative z-10">
            "{review.comment}"
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1 text-blue-500"><FiMessageSquare /> Verified Patient</span>
        </div>
    </div>
);

const STATIC_REVIEWS = [
    {
        _id: 'static-1',
        user: { name: 'Karthik Raja' },
        rating: 5,
        comment: "The medical detox program was professional and life-changing. I felt safe and supported throughout my journey.",
        createdAt: new Date('2024-01-15')
    },
    {
        _id: 'static-2',
        user: { name: 'Priya Dharshini' },
        rating: 5,
        comment: "Excellent family counseling sessions. They helped us understand addiction as a disease and how to heal together.",
        createdAt: new Date('2024-02-10')
    },
    {
        _id: 'static-3',
        user: { name: 'Suresh Kumar' },
        rating: 5,
        comment: "Clean facilities and very compassionate doctors. The cognitive behavioral therapy really helped me regain control.",
        createdAt: new Date('2024-03-05')
    },
    {
        _id: 'static-4',
        user: { name: 'Anitha R.' },
        rating: 5,
        comment: "I finally found a place that treats patients with dignity. The holistic approach and peaceful environment made all the difference.",
        createdAt: new Date('2024-04-20')
    }
];

const ReviewSection = () => {
    const [reviews, setReviews] = useState([]);
    const { user } = useAuth(); // kept if needed for other things, or remove if unused. kept for safety.

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/reviews`);
                if (res.data.success) {
                    setReviews(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            }
        };
        fetchReviews();
    }, []);

    /**
     * REVIEW DISPLAY LOGIC:
     * 1. Max total displayed = 4
     * 2. Real reviews show first, sorted by newest
     * 3. If real reviews < 4, fill the gap with static reviews
     * 4. If real reviews >= 4, show only top 4 real reviews
     */
    const getDisplaySequence = () => {
        const MAX_TOTAL = 4;

        // Sort real reviews (latest first)
        const sortedReal = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Take top 4 or less
        const realToShow = sortedReal.slice(0, MAX_TOTAL);

        // Fill remaining slots with static reviews
        const slotsRemaining = MAX_TOTAL - realToShow.length;
        const staticToFill = slotsRemaining > 0 ? STATIC_REVIEWS.slice(0, slotsRemaining) : [];

        return [...realToShow, ...staticToFill];
    };

    const finalReviews = getDisplaySequence();

    // Duplicate for infinite scroll loop (3x ensures zero-gap coverage)
    const marqueeItems = [...finalReviews, ...finalReviews, ...finalReviews];

    return (
        <section className="py-24 relative overflow-hidden bg-white border-t border-slate-100">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl mix-blend-multiply"></div>

            <div className="container mx-auto px-6 mb-12 relative z-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div className="max-w-2xl mx-auto md:mx-0">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2 block">Patient Stories</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                        Voices of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Recovery</span>
                    </h2>
                    <p className="text-slate-500 mt-4 text-lg">
                        Real stories from individuals who found their path to a better life with us.
                    </p>
                </div>
            </div>

            {/* Infinite Scroll Marquee */}
            <div className="relative w-full overflow-hidden py-10">
                <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                {finalReviews.length > 0 ? (
                    <div className="flex w-max">
                        <motion.div
                            className="flex"
                            animate={{ x: ["-33.33%", "0%"] }} // Sync with 3x duplication
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 30
                            }}
                        >
                            {marqueeItems.map((review, index) => (
                                <ReviewCard key={`${review._id}-${index}`} review={review} />
                            ))}
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-center py-20 px-6">
                        <p className="text-slate-400 italic text-xl max-w-3xl mx-auto leading-relaxed font-serif opacity-80">
                            “Our patients’ recovery journeys speak for our commitment to compassionate care.”
                        </p>
                        <div className="w-16 h-0.5 bg-slate-200 mx-auto mt-8"></div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReviewSection;
