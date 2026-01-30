// const version = process.env.REACT_APP_BUILD_TIMESTAMP || "unknown"; 

// (function () {
//     var storedVersion = localStorage.getItem("app_version");

//     if (!storedVersion || storedVersion !== version) {
//         console.log("New version detected! Reloading...");
//         localStorage.setItem("app_version", version);
//         if ('caches' in window) {
//             caches.keys().then(function(names) {
//                 for (let name of names) caches.delete(name);
//             });
//         }
//         window.location.reload(true); 
//     } else {
//         console.log("Using cached version:", version);
//     }
// })();

// const version = process.env.REACT_APP_BUILD_TIMESTAMP || "unknown";

// (async function clearCacheAndReload() {
//     const storedVersion = localStorage.getItem("app_version");
    
//     if (!storedVersion || storedVersion !== version) {
//         console.log("New version detected! Clearing caches and reloading...");
        
//         try {
//             // Clear localStorage version
//             localStorage.setItem("app_version", version);
            
//             // Clear Cache Storage API
//             if ('caches' in window) {
//                 const cacheNames = await caches.keys();
//                 await Promise.all(cacheNames.map(name => caches.delete(name)));
//             }
            
//             // Clear Service Worker
//             if ('serviceWorker' in navigator) {
//                 const registrations = await navigator.serviceWorker.getRegistrations();
//                 await Promise.all(registrations.map(reg => reg.unregister()));
//             }
            
//             // Clear Application Cache (if supported)
//             if (window.applicationCache) {
//                 window.applicationCache.abort();
//             }
            
//             // Force clear browser cache for this domain
//             const hardReload = () => {
//                 // Clear session storage
//                 sessionStorage.clear();
                
//                 // Add timestamp to force-bypass cache
//                 const timestamp = new Date().getTime();
//                 const currentLocation = window.location.href;
//                 const cleanUrl = currentLocation.split('?')[0];
//                 const newUrl = `${cleanUrl}?e_bust=${timestamp}`;
                
//                 // Perform hard reload
//                 window.location.href = newUrl;
//             };
            
//             // Set a small timeout to ensure all clear operations complete
//             setTimeout(hardReload, 100);
            
//         } catch (error) {
//             console.error("Error while clearing cache:", error);
//             // Fallback to basic reload if clearing fails
//             window.location.reload(true);
//         }
//     } else {
//         console.log("Using cached version:", version);
//     }
// })();


const version = process.env.REACT_APP_BUILD_TIMESTAMP || "unknown";

(async function clearCacheAndReload() {
    const storedVersion = localStorage.getItem("app_version");
    
    if (!storedVersion || storedVersion !== version) {
        console.log("New version detected! Clearing caches and reloading...");
        
        try {
            // Clear localStorage version
            localStorage.setItem("app_version", version);
            
            // Clear Cache Storage API
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            
            // Clear Service Worker
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map(reg => reg.unregister()));
            }
            
            // Clear Application Cache
            if (window.applicationCache) {
                window.applicationCache.abort();
            }
            
            // Clear session storage
            sessionStorage.clear();

            // Safe URL handling with timestamp
            const baseUrl = window.location.origin + window.location.pathname;
            const params = new URLSearchParams(window.location.search);
            const timestamp = new Date().getTime();
            params.set('_v', version);
            params.set('bust', timestamp);
            
            // Add small timeout for cache clearing operations
            setTimeout(() => {
                window.location.href = `${baseUrl}?${params.toString()}`;
            }, 1000);

        } catch (error) {
            console.error("Cache clearing error:", error);
            // Fallback to root with cache bust
            const timestamp = new Date().getTime();
            window.location.href = `${window.location.origin}`;
        }
    } else {
        console.log("Using cached version:", version);
    }
})();