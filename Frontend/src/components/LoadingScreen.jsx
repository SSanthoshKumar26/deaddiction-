import React from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat } from 'react-icons/fa';

const LoadingScreen = () => {
    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.8, ease: "easeInOut" }
            }}
        >
            {/* Minimalist Container */}
            <div className="relative flex flex-col items-center">

                {/* 1. Brand Logo Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    {/* Outer Glow Ring */}
                    <div className="absolute inset-0 bg-primary-50 rounded-full blur-xl animate-pulse opacity-50 w-24 h-24 -m-2"></div>

                    {/* Icon Container */}
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white shadow-2xl relative z-10 mx-auto">
                        <motion.div
                            animate={{
                                scale: [1, 1.15, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <FaHeartbeat size={40} />
                        </motion.div>
                    </div>
                </motion.div>

                {/* 2. Brand Text */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-center space-y-2 mb-12"
                >
                    <h1 className="font-display text-4xl font-bold text-surface-900 tracking-tight">
                        SOBER
                    </h1>
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-[0.3em]">
                        Psychiatric Center
                    </p>
                </motion.div>

                {/* 3. Modern Progress Bar */}
                <div className="w-48 h-1 bg-surface-100 rounded-full overflow-hidden relative">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-700 w-full"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
