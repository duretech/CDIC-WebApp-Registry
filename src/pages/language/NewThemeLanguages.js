import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import swal from "sweetalert";
//import { Configuration } from '../../assets/data/config'
import OfflineDb from "../../db";
import i18n from "i18next";
import { apiServices } from "../../services/apiServices";
import { useTranslation } from "react-i18next";

import classes from "../../App.module.css";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
//import { withRouter, Link } from "react-router-dom";
import { useHistory } from "react-router";
import "../../assets/css/customstyles.css";
//import '../../assets/css/theme_grey.css'
import "../../assets/css/theme_blue.css";
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'
import { Typography } from "@material-ui/core";
import { initReactI18next } from "react-i18next";
import _ from 'lodash'
import { decryptData, encryptData } from '../../imon/encryption/AesEnc.js';
import { checkAttribute,getAttributeValue } from '../../config/validationutils';
import { Configuration } from '../../assets/data/config.js';


export default function SelectLanguages({ onSuccess }) {
  const location = useLocation(); //location.state.trackedEntityInstance
  const { t } = useTranslation();
  const [value, setValue] = React.useState("en");
  const history = useHistory();
  const [resources, setResources] = React.useState({});
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  //const [loading, setGlobalSpinner] = React.useState(false);
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  // const [Configuration, setConfiguration] = React.useState(null);
  const [languageList, setLanguageList] = React.useState([
    { label: "English", value: "en" },
  ]);
  const [hideContainer, setHideContainer] = React.useState(true);
  async function getUserBo() {
    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);

    // let configurations = await OfflineDb.getDataFromPouchDB("configurations");
    // if (configurations && configurations.data) {
    //   setConfiguration(configurations.data.configuration);
    // }
  }

  function handleBack() {
    window.history.back();
  }

  useEffect(() => {
    //get use details from localdb
    getUserBo();

  
    OfflineDb.getDataFromPouchDB("translationResource").then(
      (translationResource) => {
        if (translationResource.data != undefined) {
          setResources(translationResource.data);
        } else {
          setGlobalSpinner(true);
          apiServices
            .getAPI("dataStore/translations/translations")
            .then((res) => {
              OfflineDb.setDataIntoPouchDB("translationResource", res.data);
              setResources(res.data);
              //setGlobalSpinner(false)
              localStorage.setItem("translations", JSON.stringify(res.data));
            })
            .catch((error) => {
              /*swal({
            title: t("Success"),
            text: t("No translation found"),
            icon: "success",
            button: "Close",
          })*/
              setGlobalSpinner(false);
            });
        }
      }
    );
   

    OfflineDb.getDataFromPouchDB("languageSelected").then(
      (languageSelected) => {
        if (languageSelected.data != undefined) {
          setValue(languageSelected.data);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (sessionUserBoValue != null) {
      //setDeviceDetails()
      getLanguageList();
    }
  }, [sessionUserBoValue,resources,value]);

  const getDefaultLanguage = (arr) => {
    // Check if the array is null, undefined, or not an array
      if (!Array.isArray(arr)) {
          return null;
      }

      // Iterate through the array to find the entry with name 'defaultLocal'
      for (let i = 0; i < arr.length; i++) {
          if (arr[i].attribute && arr[i].attribute.name === 'defaultLocal') {
              return arr[i].value;
          }
      }

      // Return null if no matching entry is found
      return null;
  }

  const getLanguageList = async () => {
    // setGlobalSpinner(true);
    getPragramLanguageDetails();
    return
    try {
      OfflineDb.getDataFromPouchDB("languageList").then((languageResource) => {
        if (languageResource.data != undefined) {
          setLanguageList(languageResource.data);
          setGlobalSpinner(false);
        } else {
          getPragramLanguageDetails();
        }
      });
    } catch (e) {
      getPragramLanguageDetails();
    }
    async function getPragramLanguageDetails() {
      apiServices
        .getAPI(
          "29/organisationUnits/" + sessionUserBoValue.organisationUnits[0].id
        )
        .then((orgres) => {
          if (orgres && orgres.data && orgres.data.path) {
            try {
              let orgheirarchypath = orgres.data.path;
              let orgunit = orgheirarchypath.split("/")[2];
              let tempHolder = {
                "type":"GET",
                "url":"dataStore/translations/"+orgunit,
                "data":null
              }
              const encryptedData = encryptData(tempHolder);
              apiServices.postAPI("commonencryption/getDecrypt",{"data":encryptedData})
              // apiServices
              //   .getAPI("dataStore/translations/" + orgunit)
                .then(async (res) => {
                  res.data = decryptData(res.data)
                  if(sessionUserBoValue && sessionUserBoValue.hasOwnProperty('interests') && sessionUserBoValue["interests"] && res.data && res.data.hasOwnProperty(sessionUserBoValue["interests"])){
                    res.data = res.data[sessionUserBoValue["interests"]]
                  }else{
                    // let i = 0;
                    // for(let prop in res.data){
                    //   if(i == 0 && _.isObject(res.data[prop])){
                    //     res.data = res.data[prop]
                    //   }
                    //   i++;
                    // }
                  }
                  res.data["orguid"] = orgunit;

                  if (res.data.hasOwnProperty("TB")) {
                    OfflineDb.setDataIntoPouchDB(
                      "languageList",
                      res.data["TB"].selectedlanguage
                    );
                    OfflineDb.setDataIntoPouchDB(
                      "programBoDetails",
                      res.data["TB"]
                    );
                    setLanguageList(res.data["TB"].selectedlanguage);
                  } else {
                    OfflineDb.setDataIntoPouchDB(
                      "languageList",
                      res.data.selectedlanguage
                    );
                    OfflineDb.setDataIntoPouchDB("programBoDetails", res.data);
                    setLanguageList(res.data.selectedlanguage);

                    // call to get metadata
                   
                    //
                    let metafinalurl =
                    "metadata?fields=:owner,displayName&programs:filter=id:eq:" +
                    res.data.programuid +
                    "&programs:fields=:owner,displayName,description,attributeValues[:all,attribute[id,name,displayName,description,formName]]";

                    let tempHolder = {
                      "type":"GET",
                      "url":metafinalurl,
                      "data":null
                    }
                    const encryptedData = encryptData(tempHolder);
                    const metaData = await apiServices
                    .getedAPI(tempHolder)
                    //Second call //metaDataParam
                   // const metaData = await apiServices.getAPI(metafinalurl);
                    let defaultLanguage = await getDefaultLanguage(metaData.data.programs[0].attributeValues);
                    await setValue(defaultLanguage); 
                    const isattval =  checkAttribute(metaData.data.programs[0].attributeValues, "flagEnabled");
                    if (isattval) {
                        localStorage.setItem('navbarflag', "true");
                    } else {
                        localStorage.setItem('navbarflag', "false");
                    }
                   
                    const permission = localStorage.getItem("geolocationpermission");
                    if (permission === "denied") {
                    
                     const getcoordinates = getAttributeValue(metaData.data.programs[0].attributeValues,"geoLocation")
                     if (getcoordinates && getcoordinates.length === 2) {
                      const [lat, lng] = getcoordinates;
                      OfflineDb.setDataIntoPouchDB("geolocation", {
                          lat: lat !== 0 ? lat : 31.8008346,
                          lng: lng !== 0 ? lng : -7.1506879,
                      });
                  } else {
                      OfflineDb.setDataIntoPouchDB("geolocation", {
                          lat: 31.8008346,
                          lng: -7.1506879,
                      });
                  }
                  } else {
                  }
                   
                                   
    
                  }

                  setGlobalSpinner(false);
                  const savedUILocale = sessionStorage.getItem("userUILocale") || "en";
 
                  try {
                    OfflineDb.setDataIntoPouchDB("languageSelected", savedUILocale);
                    localStorage.setItem("locale", savedUILocale);
                    if (resources && Object.keys(resources).length > 0) {
                      i18n
                      .use(initReactI18next) // passes i18n down to react-i18next
                      .init({
                        resources,
                        fallbackLng: "en",
                        lng: savedUILocale,
                        keySeparator: false, // we do not use keys in form messages.welcome
                        interpolation: {
                          escapeValue: false, // react already safes from xss
                        },
                        react: {
                          useSuspense: false,
                          wait: false,
                        },
                      })
                      .then(() => {
                        console.log("i18n initialized successfully",resources);
                      })
                      .catch((error) => {
                        console.error("i18n initialization failed:",resources, error);
                        // Optional: fallback logic or notification to user
                      });
                    }
                  } catch (err) {
                    console.error("Unexpected error during language setup:",resources, err);
                    // Optionally fallback to 'en' and re-init
                  }                  
                    if(Object.entries(resources).length > 0)
                    onSuccess();
                })
                .catch((e) => {
                  setGlobalSpinner(false);
                });
            } catch (e) {
              setGlobalSpinner(false);
            }
          }
        })
        .catch((e) => {
          setGlobalSpinner(false);
        });
    }
  };

  const handleChange = (event) => {
    
    setValue(event.target.value);
    //i18n.changeLanguage(event.target.value);
  };
  const submit = () => {
    if (value) {
      OfflineDb.setDataIntoPouchDB("languageSelected", value);
      localStorage.setItem("locale", value);
      i18n
        .use(initReactI18next) // passes i18n down to react-i18next
        .init({
          resources,
          fallbackLng: "en",
          lng: value, //localStorage.getItem('locale') ? localStorage.getItem('locale'): 'en',
          keySeparator: false, // we do not use keys in form messages.welcome

          interpolation: {
            escapeValue: false, // react already safes from xss
          },
          react: {
            useSuspense: false,
            wait: false,
          },
        });

      if (location && location.state && location.state.userid) {
        //history.push("/layout/imonhome");
        onSuccess();
      } else {
        onSuccess();
      }
      // history.push("/layout/home");
    }
    return;
  };
  function setDeviceDetails() {
    var deviceInfo = {};
    if (window.cordova) {
      deviceInfo.name = window.device.model;
      deviceInfo.cordova = window.device.cordova;
      deviceInfo.platform = window.device.platform;
      deviceInfo.uuid = window.device.uuid;
      deviceInfo.version = window.device.version;
      deviceInfo.manufacturer = window.device.manufacturer;
      deviceInfo.isVirtual = window.device.isVirtual;
      deviceInfo.serial = window.device.serial;
    } else {
      if (navigator) {
        deviceInfo.platform = navigator.platform;
        deviceInfo.uuid = navigator.appCodeName;
        deviceInfo.version = navigator.appVersion;
        deviceInfo.name = navigator.appName;
      }
    }
    //deviceInfo
    sessionUserBoValue.attributeValues.map((item) => {
      if (item.attribute.displayName == "Device Info") {
        item.value = JSON.stringify(deviceInfo);
      }
    });
    //OfflineDb.setDataIntoPouchDB('loginDetails', sessionUserBoValue)
    setGlobalSpinner(true);
    apiServices
      .putAPI(`users/${sessionUserBoValue.id}`, sessionUserBoValue)
      .then((res) => {
        setGlobalSpinner(false);
      })
      .catch((err) => {
        setGlobalSpinner(false);
        swal({ title: err });
      });
  }
  const backgroundImageUrl = `${Configuration.baseUrl}media/langpage.jpg`;


  return (
    <>
       {!hideContainer && (
    <div className={classes.container}>
      <main style={{ display: "flex", height: "100%", width: "100%" }}>
        <section
          className="mainsection pb-0 langwebapp langMain"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            flexGrow: 1,
            backgroundColor: "rgba(0, 0, 0, 0.9)"
          }}
        >
          {/* {loading ?
                  <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
                      <CircularLoader large dataTest="dhis2-uicore-circularloader" />
                  </CenteredContent>
                  :""
              } */}
          <Grid container className="h-100percent">
            <Grid
              container
              xs={12}
              className="registernav langnav"
              style={{ height: "40px" }}
            >
              {/* <Grid xs={3} className="backimg" onClick={() => handleBack()}>
              <IconButton
                className="backsvg"
                aria-label="go back"
                onClick={() => handleBack()}
                style={{marginTop: "2%", width: "6%"}}
              >
              <ArrowBack />
              </IconButton>
              </Grid> */}
              <Grid xs={6} className="text-center">
                <Typography
                  variant="subtitle1"
                  className="regname oneuhcfont user-name"
                >
                   {t("Language Preference")}
                </Typography>
              </Grid>
              <Grid xs={3}></Grid>
            </Grid>
            <Grid item xs={0} md={1}>
              {/* <div className="innerdiv userwebapp">
                  <p className="zero text-center">
                    <div className="useravtarimg" />
                  </p>
                  <p className="zero text-center">
                    <h3 className="text-uppercase">Language Preference</h3>
                  </p>
                </div> */}
            </Grid>
            <Grid item xs={12} md={5} className="pagelaterpart">
              <div class="custom-shape-divider-top-1612935135">
                <svg
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
                    class="shape-fill"
                  ></path>
                </svg>
              </div>
              <div className="langprefpageformholder">
                <div className="loginlang">
                  {/* <div className="useravtarimgapp" /> */}
                  {/* <Typography variant='h4' className='mb-30px'>Language Preference</Typography> */}
                </div>
                <div className="langSection">
                  <div className="langitems">
                    <FormControl component="fieldset">
                      {/* <FormLabel component="legend">{t('Choose Language')}</FormLabel> */}
                      <RadioGroup
                        aria-label="language"
                        name="languages"
                        value={value}
                        onChange={handleChange}
                      >
                        {languageList &&
                          languageList.map((languageList, i) => {
                            return (
                              <FormControlLabel
                                key={i}
                                value={languageList.value}
                                control={<Radio />}
                                label={t(languageList.label)}
                              />
                            );
                          })}
                        {/* {Configuration && Configuration.language.languageList.map((languageList, i) => {
                                return (languageList.showHide != undefined && languageList.showHide) ? <FormControlLabel key={i} value={languageList.value} control={<Radio />} label={t(languageList.name)} />: ""
                              })} */}
                        {/* <FormControlLabel value="en" control={<Radio />} label="English" />
                                    <FormControlLabel value="my" control={<Radio />} label="Burmese" /> */}
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="mt-20px buttons">
                    <Button onClick={submit} className="loginsubmitbtn">
                      {t("Submit")}
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={0} md={6}></Grid>
          </Grid>
        </section>
      </main>
    </div>
     )}
  </>
  );
}
