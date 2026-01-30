// import { useState, useEffect } from 'react';
// import { Configuration } from '../assets/data/config'; 
// import OfflineDb from '../db';
// import { decryptData, encryptData } from '../imon/encryption/AesEnc.js';
// export const useLocaleConfiguration = (source = 'default') => {
        //const runtime = window.RUNTIME_CONFIG || {};
//     // const [config, setConfig] = useState(() => {
//     //     const cachedConfig = localStorage.getItem('appConfign');
//     //     if (cachedConfig) {
//     //         console.log("CACHED")
//     //         localStorage.removeItem('appConfign'); 
//     //         return JSON.parse(cachedConfig); 
//     //     }
//     //     return null;
//     // });
//     const [config, setConfig] = useState(null);
//     const [loading, setLoading] = useState(!config);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!config) {  
//             setLoading(true);
//               let basicAuth = runtime.basicAuth; // fallback
//                 const encryptedAuth = localStorage.getItem('basicAuth');

//                 if (encryptedAuth) {
//                 try {
//                     basicAuth = decryptData(encryptedAuth);
//                 } catch (error) {
//                     console.error("Failed to decrypt customAuth:", error);
//                 }
//                 }

//             fetch(`${Configuration.apiService.key}dataStore/ruleConfig/countyrule`, {
//                 headers: {
//                     'Authorization': basicAuth,  
//                     'Cache-Control': 'no-cache'
//                 }
//             })
//             .then(response => {
//                 console.log("401 ",response)
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch configuration');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log("DATAAPI",data)
//                 localStorage.setItem('appConfign', JSON.stringify(data));
//                 sessionStorage.removeItem('appConfign');
//                 sessionStorage.setItem('appConfign',JSON.stringify(data))
                
//                 setConfig(data);
//             })
//             .catch(err => {
//                 console.log("401 ",err)
//                 setError(err.message);
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//         }
//     }, []); 

//     return { config, loading, error };
// };

import { useState, useEffect } from 'react';
import { Configuration } from '../assets/data/config'; 
import { decryptData } from '../imon/encryption/AesEnc.js';


export const useLocaleConfiguration = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const runtime = window.RUNTIME_CONFIG || {};

  const FALLBACK_AUTH = runtime.basicAuth;

  const getAuthHeader = () => {
    const encryptedAuth = localStorage.getItem('basicAuth');
    if (!encryptedAuth) return FALLBACK_AUTH;

    try {
      return decryptData(encryptedAuth);
    } catch (e) {
      console.error('Auth decrypt failed, using fallback');
      return FALLBACK_AUTH;
    }
  };

  const fetchConfig = async (auth, retry = false) => {
    const response = await fetch(
      `${Configuration.apiService.key}dataStore/ruleConfig/countyrule`,
      {
        headers: {
          Authorization: auth,
          'Cache-Control': 'no-cache',
        },
      }
    );

    // 🔁 Retry once with fallback auth if 401
    if (response.status === 401 && !retry) {
      console.warn('401 detected, retrying with fallback auth');
      return fetchConfig(FALLBACK_AUTH, true);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch configuration (${response.status})`);
    }

    return response.json();
  };

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      try {
        setLoading(true);
        const auth = getAuthHeader();
        const data = await fetchConfig(auth);

        if (!isMounted) return;

        localStorage.setItem('appConfign', JSON.stringify(data));
        sessionStorage.setItem('appConfign', JSON.stringify(data));

        setConfig(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return { config, loading, error };
};

