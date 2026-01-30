import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { encryptData, decryptData } from '../../imon/encryption/AesEnc';

// the translations
// (tip move them in a JSON file and import them)
let resources="";
if(localStorage.getItem("translations")){
 // console.log("JSIO",decryptData(localStorage.getItem("translations")))
// const decr= decryptData(localStorage.getItem("translations"))
 resources = JSON.parse(localStorage.getItem("translations"))
//  JSON.parse(decr)
}
// console.log("JSIO",decryptData(localStorage.getItem("translations")))
// const decr= decryptData(localStorage.getItem("translations"))
// const resources = JSON.parse(decr)
// const resources = JSON.parse(localStorage.getItem("translations"));
/*{
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
      "Choose Language": "Choose Language",
      "Add New Client": "English Add New Client",
      "My Clients": "English My Clients"
    }
  },
  fr: {
    translation: {
      "Welcome to React": "Bienvenue à React et react-i18next",
      "Choose Language": "French Choose Language",
      "Add New Client": "French Add New Client",
      "My Clients": "French My Clients"
    }
  }
};*/

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('locale') ? localStorage.getItem('locale'): 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false,
      wait: false,
    },
  });

export default i18n;