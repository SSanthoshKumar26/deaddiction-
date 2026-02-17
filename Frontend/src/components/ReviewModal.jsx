import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';

const ReviewModal = ({ isOpen, onClose }) => {
    const [submitRating, setSubmitRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to write a review");
            return;
        }
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(`${API_BASE_URL}/api/reviews`, { rating: submitRating, comment }, config);

            if (res.data.success) {
                toast.success("Review submitted successfully!");
                setComment('');
                setSubmitRating(5);
                onClose();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-slate-800">Share Your Experience</h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setSubmitRating(star)}
                                            className={`text-2xl transition-transform hover:scale-110 ${submitRating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                                        >
                                            <FiStar fill={submitRating >= star ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Your Review</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="4"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Tell us about your journey..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Submitting...</span>
                                    </span>
                                ) : 'Post Review'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReviewModal;
