import { encryptData, decryptData } from '../imon/encryption/AesEnc';

(function () {
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    // const originalRemoveItem = localStorage.removeItem;


    localStorage.setItem = function (key, value) {
        try {
          //  if (key === 'translations' || key.includes('firebase')) {
            if (key.includes('firebase')) {
                originalSetItem.call(this, key, value);
            }
            else
            {
                const encryptedValue = encryptData(value);
                originalSetItem.call(this, key, encryptedValue);
            }
        } catch (error) {
            console.error('Error setting item to local storage:', error);
        }
    };

   
    localStorage.getItem = function (key) {
        try {
           // if (key === 'translations' || key.includes('firebase')) {
            if (key.includes('firebase')) {
                const returnvalue=originalGetItem.call(this, key);
                return returnvalue;
            }
            else
            {
                let encryptedValue;
            // let encryptedValue = originalGetItem.call(this, key);
            // console.log("encryptedValue",encryptedValue)
            if (key === 'appConfign'){
                encryptedValue = originalGetItem.call(this, key);
            if ((encryptedValue === null || encryptedValue === undefined) && key === 'appConfign') {

                encryptedValue = sessionStorage.getItem(key);
                //console.log("encryptedValue",encryptedValue)
                return encryptedValue;  
            }
            else
            {
                encryptedValue = originalGetItem.call(this, key);
                if (encryptedValue) {
                    return decryptData(encryptedValue);
                }
            }
           }
            else {
                encryptedValue = originalGetItem.call(this, key);
                if (encryptedValue) {
                    return decryptData(encryptedValue);
                }
            }
            // if (encryptedValue) {
            //     return decryptData(encryptedValue);
            // }
        }
            return null;
        } catch (error) {
            console.error('Error getting item from local storage:', error);
            return null;
        }
    };

    const originalSessionStorageSetItem = sessionStorage.setItem;
    const originalSessionStorageGetItem = sessionStorage.getItem;

    sessionStorage.setItem = function (key, value) {
        try {
            const encryptedValue = encryptData(value);
            originalSessionStorageSetItem.call(this, key, encryptedValue);
        } catch (error) {
            console.error('Error setting item to session storage:', error);
        }
    };

    sessionStorage.getItem = function (key) {
        try {
            const encryptedValue = originalSessionStorageGetItem.call(this, key);
            if (encryptedValue) {
                return decryptData(encryptedValue);
            }
            return null;
        } catch (error) {
            console.error('Error getting item from session storage:', error);
            return null;
        }
    };

    // Override removeItem to use the original localStorage remove method
    // localStorage.removeItem = function (key) {
    //     try {
    //         originalRemoveItem.call(this, key);
    //     } catch (error) {
    //         console.error('Error removing item from local storage:', error);
    //     }
    // };
})();
