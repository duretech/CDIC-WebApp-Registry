// cryptoUtils.js
import CryptoJS from "crypto-js";

// Define the key and IV as 16-byte strings
const SECRET_KEY = "1234567890123456"; // 16 characters = 16 bytes
const INIT_VECTOR = "abcdefghijklmnop"; // 16 characters = 16 bytes

// Convert key and IV to WordArray
const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
const iv = CryptoJS.enc.Utf8.parse(INIT_VECTOR);

/**
 * Encrypt data using AES-CBC with PKCS7 padding
 * @param {Object} data - The data to encrypt
 * @returns {string} - Base64 encoded ciphertext
 */
export function encryptData(data) {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return ciphertext;
}

/**
 * Decrypt data using AES-CBC with PKCS7 padding
 * @param {string} ciphertext - Base64 encoded ciphertext
 * @returns {Object} - Decrypted data
 */
export function decryptData(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // console.log(decryptedData,"decryptedData")
    return decryptedData;
}
