import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAndRestoreAppConfign } from '../hooks/fetchAndSetConfig';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [appConfign, setAppConfign] = useState(() => {
        const cachedConfig = localStorage.getItem('appConfign');
        return cachedConfig ? JSON.parse(cachedConfig) : null;
    });
    const [loading, setLoading] = useState(!appConfign);
    const [error, setError] = useState(null);

    const restoreConfig = async () => {
        try {
            setLoading(true);
            const config = await fetchAndRestoreAppConfign();
            setAppConfign(config);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleStorageChange = async (event) => {
            // if (event.key === 'appConfign' && event.newValue === null) {
            //     console.warn('appConfign missing. Restoring configuration...');
            //     await restoreConfig();
            // }
            if (event.key === 'appConfign') {
                const appConfign = localStorage.getItem('appConfign');

                // Check if appConfign is missing, blank, or invalid
                if (!appConfign || appConfign === 'null' || appConfign === 'undefined' || appConfign.trim() === '') {
                    console.warn('appConfign is missing, blank, or invalid. Restoring configuration...');
                    await restoreConfig();
                } else {
                    console.log('Valid appConfign detected in localStorage.');
                }
            }
        };

        // Add listener for `storage` event
        window.addEventListener('storage', handleStorageChange);

        // Clean up the listener on unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (!appConfign) {
            restoreConfig();
        }
    }, [appConfign]);

    return (
        <ConfigContext.Provider value={{ appConfign, loading, error, restoreConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => useContext(ConfigContext);
