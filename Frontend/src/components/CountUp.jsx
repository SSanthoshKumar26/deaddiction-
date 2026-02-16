import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const CountUp = ({ end, duration = 2.0, suffix = "", prefix = "", label, className = "", triggerOnScroll = false }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "0px" }); // Default margin
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // Trigger condition: Either we want it on scroll and it's in view, OR we want it immediately (default behavior interpretation)
        // User request: "Animate ONCE when user enters the website. NOT wait for scroll."
        // So effectively, if triggerOnScroll is false, we trigger immediately on mount.

        const shouldAnimate = triggerOnScroll ? inView : true;

        if (shouldAnimate) {
            const controls = animate(0, end, {
                duration: duration,
                ease: "easeOut", // easeOutCubic approximation or use specific bezier if needed. 'easeOut' in framer is naturally calm.
                onUpdate: (value) => setDisplayValue(Math.floor(value))
            });

            return () => controls.stop();
        }
    }, [inView, end, duration, triggerOnScroll]);

    return (
        <div ref={ref} className={className}>
            <span className="font-bold">
                {prefix}{displayValue.toLocaleString()}{suffix}
            </span>
        </div>
    );
};

export default CountUp;
