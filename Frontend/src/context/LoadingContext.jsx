import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // Initial Load Logic
    useEffect(() => {
        const handleInitialLoad = async () => {
            const minLoadTime = new Promise(resolve => setTimeout(resolve, 2500));
            const resourceLoad = new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                }
            });

            await Promise.all([minLoadTime, resourceLoad]);
            setIsLoading(false);
        };

        handleInitialLoad();
    }, []);

    const triggerLoading = (duration = 1000) => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), duration);
    };

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading, triggerLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
