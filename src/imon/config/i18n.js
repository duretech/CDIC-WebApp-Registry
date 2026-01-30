import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { createStore } from 'redux';
import reducer from '../redux/reducers/appReducer';
import OffileDb from './pouchDB';
// import Services from "../api/api";
const store = createStore(reducer);

i18n.use(LanguageDetector).init({
  // we init with resources
  lng: localStorage.getItem('i18nextLng') || "en_US",
  resources: {
    en_US: {
      translations: {
        Qos: "Introduction"
      }
    },
  },
  fallbackLng: "en_US",
  debug: false,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  }
}).then(function (t) {

  var state = store.getState();
  OffileDb.setDatabase()
  console.log(state)
  var langid = localStorage.getItem('langId') || 1;
  var lng = localStorage.getItem('i18nextLng') || "en_US";
  document.getElementsByTagName("body")[0].setAttribute("lag", lng);
  OffileDb.getData('tranlation').then(function (result) {
    if (!result.status || result.status != 404) {
      let lan = result.data.locale;
      let tran = result.data.label;
      i18n.addResourceBundle(lan, "translations", tran, true, true);
      i18n.changeLanguage(lan);
    }
  });

  // var params = {
  //   communityId: state.communityId,
  //   labelType : 'Mobile',
  //   languageId: langid,
  // };
  // console.log("getCommunitywiseLabelsparams::",params)
  // Services.getCommunitywiseLabels(params).then((res) => {
  //   console.log('tranal', res)
  //   if (res.data.status == 200) {
  //     let lan = res.data.data.locale;
  //     let tran = res.data.data.label;
  //     document.getElementsByTagName("body")[0].setAttribute("lag", lng);
  //     i18n.addResourceBundle(lan, "translations", tran, true, true);
  //     i18n.changeLanguage(lan);
  //     localStorage.setItem('langId', langid)
  //     OffileDb.setData('tranlation', res.data.data)
  //   }
  // });


});

export default i18n;
