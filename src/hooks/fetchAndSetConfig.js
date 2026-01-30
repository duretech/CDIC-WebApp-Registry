import { Configuration } from '../assets/data/config'; 
import OfflineDb from '../db';
import { decryptData, encryptData } from '../imon/encryption/AesEnc.js';

export const fetchAndRestoreAppConfign = async () => {
    try {
         const runtime = window.RUNTIME_CONFIG || {};
         let basicAuth = runtime.basicAuth; // fallback
                        const encryptedAuth = localStorage.getItem('basicAuth');
        
                        if (encryptedAuth) {
                        try {
                            basicAuth = decryptData(encryptedAuth);
                        } catch (error) {
                            console.error("Failed to decrypt customAuth:", error);
                        }
                        }
        const response = await fetch(`${Configuration.apiService.key}dataStore/ruleConfig/countyrule`, {
            headers: {
                'Authorization': basicAuth,
                'Cache-Control': 'no-cache'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch configuration');
        }
        const data = await response.json();

       
        localStorage.setItem('appConfign', JSON.stringify(data));
        sessionStorage.setItem('appConfign', JSON.stringify(data));
        OfflineDb.setDataIntoPouchDB('appConfign', JSON.stringify(data));

        console.log('appConfign restored successfully');
        return data;
    } catch (err) {
        console.error('Error fetching appConfign:', err.message);
        throw err;
    }
};
