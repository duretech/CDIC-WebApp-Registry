import CryptoJS from "crypto-js";

// Define a secret key for encryption and decryption
const secretKey = "thisIsATempKey";  // Make sure this key is strong and stored securely

// Function to encrypt text
export const encryptText = (text) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption Error:", error);
    return null;
  }
};

// Function to decrypt text
export const decryptText = (encryptedText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
};
