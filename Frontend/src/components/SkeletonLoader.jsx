import React from 'react';

const Skeleton = ({ className = "", variant = "text" }) => {
    // variants: text, circular, rectangular, rounded
    const baseClasses = "animate-pulse bg-slate-200";

    let radiusClass = "rounded";
    if (variant === "circular") radiusClass = "rounded-full";
    if (variant === "rectangular") radiusClass = "rounded-none";
    if (variant === "rounded-xl") radiusClass = "rounded-xl";
    if (variant === "rounded-2xl") radiusClass = "rounded-2xl";

    return (
        <div className={`${baseClasses} ${radiusClass} ${className}`}></div>
    );
};

export const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-surface-200 p-8 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-8 h-full">
            <div className="flex-1 space-y-6">
                <div className="flex gap-4">
                    <Skeleton className="w-24 h-8 rounded-lg" />
                    <Skeleton className="w-32 h-8 rounded-lg" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="w-3/4 h-8" />
                    <Skeleton className="w-1/2 h-4" />
                </div>
                <div className="flex gap-10 pt-4">
                    <div className="space-y-2">
                        <Skeleton className="w-16 h-3" />
                        <Skeleton className="w-24 h-5" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="w-16 h-3" />
                        <Skeleton className="w-24 h-5" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="w-16 h-3" />
                        <Skeleton className="w-24 h-5" />
                    </div>
                </div>
            </div>
            <div className="md:w-32 flex items-end justify-end">
                <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
        </div>
    </div>
);

export const SkeletonStats = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <Skeleton className="w-20 h-10 mb-2" />
        <Skeleton className="w-32 h-4" />
    </div>
);

export default Skeleton;
