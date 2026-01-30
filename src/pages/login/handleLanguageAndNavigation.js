import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import OfflineDb from "../../db";
import { apiServices } from "../../services/apiServices";
import { checkAttribute, getAttributeValue } from '../../config/validationutils';

export async function handleLanguageAndNavigation(sessionUserBoValue, setGlobalSpinner, onSuccess,locale) {
  try {
    setGlobalSpinner(true);
    const savedUILocale = locale;
    setValue(savedUILocale);
    OfflineDb.setDataIntoPouchDB("languageSelected", savedUILocale);
    localStorage.setItem("locale", savedUILocale);


    let translationResource = await OfflineDb.getDataFromPouchDB("translationResource");
    let resources = {};
    
    if (translationResource.data !== undefined) {
      resources = translationResource.data;
    } else {
      try {
        const res = await apiServices.getAPI("dataStore/translations/translations");
        OfflineDb.setDataIntoPouchDB("translationResource", res.data);
        resources = res.data;
        localStorage.setItem("translations", JSON.stringify(res.data));
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    }


    i18n
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: "en",
        lng: savedUILocale,
        keySeparator: false,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
          wait: false,
        },
      });


    if (sessionUserBoValue && sessionUserBoValue.organisationUnits && sessionUserBoValue.organisationUnits.length > 0) {
      const orgRes = await apiServices.getAPI(
        "29/organisationUnits/" + sessionUserBoValue.organisationUnits[0].id
      );
      
      if (orgRes && orgRes.data && orgRes.data.path) {
        const orgheirarchypath = orgRes.data.path;
        const orgunit = orgheirarchypath.split("/")[2];
        
        const res = await apiServices.getAPI("dataStore/translations/" + orgunit);
        let programData = res.data;
        
 
        if (
          sessionUserBoValue && 
          sessionUserBoValue.hasOwnProperty('interests') && 
          sessionUserBoValue["interests"] && 
          res.data && 
          res.data.hasOwnProperty(sessionUserBoValue["interests"])
        ) {
          programData = res.data[sessionUserBoValue["interests"]];
        }
        
        programData["orguid"] = orgunit;


        if (programData.hasOwnProperty("TB")) {
          OfflineDb.setDataIntoPouchDB("languageList", programData["TB"].selectedlanguage);
          OfflineDb.setDataIntoPouchDB("programBoDetails", programData["TB"]);
        } else {
          OfflineDb.setDataIntoPouchDB("languageList", programData.selectedlanguage);
          OfflineDb.setDataIntoPouchDB("programBoDetails", programData);
          

          const metafinalurl = 
            "metadata?fields=:owner,displayName&programs:filter=id:eq:" +
            programData.programuid +
            "&programs:fields=:owner,displayName,description,attributeValues[:all,attribute[id,name,displayName,description,formName]]";
          const metaData = await apiServices.getAPI(metafinalurl);
          

          const isattval = checkAttribute(metaData.data.programs[0].attributeValues, "flagEnabled");
          if (isattval) {
            localStorage.setItem('navbarflag', "true");
          } else {
            localStorage.setItem('navbarflag', "false");
          }
          

          const permission = localStorage.getItem("geolocationpermission");
          if (permission === "denied") {
            const getcoordinates = getAttributeValue(metaData.data.programs[0].attributeValues, "geoLocation");
            if (getcoordinates && getcoordinates.length === 2) {
              const [lat, lng] = getcoordinates;
              OfflineDb.setDataIntoPouchDB("geolocation", {
                lat: lat !== 0 ? lat : 40.712742,
                lng: lng !== 0 ? lng : -74.013382,
              });
            } else {
              OfflineDb.setDataIntoPouchDB("geolocation", {
                lat: 40.712742,
                lng: -74.013382,
              });
            }
          }
        }
      }
    }

    // Call the success callback to navigate to the next page
    onSuccess();
  } catch (error) {
    console.error("Error in handleLanguageAndNavigation:", error);
  } finally {
    setGlobalSpinner(false);
  }
}

// Helper function to set value (mimicking React useState)
function setValue(value) {
  console.log("Setting language to:", value);
  return value;
}