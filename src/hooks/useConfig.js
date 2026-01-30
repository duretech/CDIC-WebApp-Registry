import { useState, useEffect } from 'react';

export const useConfig = () => {
    const [config, setConfig] = useState(null);

    useEffect(() => {
        const configRaw = localStorage.getItem('appConfign');
        if (configRaw) {
            setConfig(JSON.parse(configRaw));
        }
    }, []);

    return config;
};
