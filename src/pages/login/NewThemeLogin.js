import React, { useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { CookieConsentContext } from "../../App.js";
import classes from "../../App.module.css";
import imgUrl from "../../assets/images/imageUrl.js";
import getImgUrl from "../../assets/images/imageUrlDynamic.js";
import Grid from "@material-ui/core/Grid";
import "../../assets/css/customstyles.css";
//import '../../assets/css/theme_grey.css'
import "../../assets/css/theme_blue.css";
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'

import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import {
  Button,
  InputFieldFF,
  ReactFinalForm,
  CircularLoader,
  CenteredContent,
} from "@dhis2/ui";
import { apiServices } from "../../services/apiServices";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";

import "react-html5-camera-photo/build/css/index.css";

import OfflineDb from "../../db";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import { Typography } from "@material-ui/core";
import {
  getLoginConfig,
  getPrivacypolicyConfig,
  getUserconsentConfig,
} from "../../config/validationutils.js";
import { APP_LOCALE, Configuration } from "../../assets/data/config.js";
import Cookies from "js-cookie";
import { decryptData, encryptData } from "../../imon/encryption/AesEnc.js";
import _ from "lodash";
import { parseBooleans } from "xml2js/lib/processors.js";
import { handleLanguageAndNavigation } from "./handleLanguageAndNavigation.js";
import PouchDB from "pouchdb";

// const db = new PouchDB('myDatabase');

const { Form, Field } = ReactFinalForm;

function Login({ onSuccess }) {
  const formRef = useRef(null);
  const { setShowCookieConsent } = useContext(CookieConsentContext);
  const [showPasswordFlag, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFacilityUser, setisFacilityUser] = useState(false);
  const history = useHistory();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const { t, i18n } = useTranslation();
  const [isDefault, setIsDefault] = useState(false);
  const [defaultChecked, setDefaultChecked] = useState(true);
  const [showConsent, setShowConsent] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [initialValuesObject, setInitialValuesObject] = useState({
    agreePrivacy: true,
    agreeConsent: true,
    // username:"NikhilG",
    // username:"hsw_user1",
    // password:"Dure@123"
  });
  const healthWorkerRole = "healthworker"
  const cdicHCP = "CDIC-HCP"
  const dropRole = "DROP-HCP"
  const [userType, setUserType] = useState(APP_LOCALE === "CC005" ?  healthWorkerRole : dropRole)
  // Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,}$/;
  const facilityUser = {};
  // const locale = localStorage.getItem("locale");
  const db = new PouchDB("myDatabase");

  async function getImgStored() {
    const imageUrl = `${process.env.PUBLIC_URL}/images/female-icon.png`;
    const imageBlob = await convertPublicImageToBlob(imageUrl);
    const doc = {
      _id: "img_female_icon",
      _attachments: {
        "female-icon.png": {
          content_type: "image/png",
          data: imageBlob,
        },
      },
    };
    try {
      await db.put(doc);
    } catch (err) {
      console.error("Error storing image in PouchDB:", err);
    }

    // const locale = loginRes?.data?.settings?.keyUiLocale;
    // const loginDetails = loginRes.data;
    async function convertPublicImageToBlob(url) {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob;
    }
    // setIsImgStored(true)
  }
  useEffect(() => {
    // Check if cookies are accepted and set the initial values accordingly
    const cookiesAccepted = Cookies.get("cookiesAccepted");
    if (cookiesAccepted === "true") {
      setInitialValuesObject({
        ...initialValuesObject,
        agreePrivacy: true,
        agreeConsent: true,
      });
    }
    if (!cookiesAccepted || cookiesAccepted === "false") {
      setShowCookieConsent(true);
    }
    getImgStored();
  }, []);

  const runtime = window.RUNTIME_CONFIG || {};
  const backgroundImageUrl = (runtime.baseUrl) + 
  (APP_LOCALE === "CC010" ? "mediaColombia/landingpage.png" : "media/landingpage.png");
  //const backgroundImageUrl = `${Configuration.baseUrl}media/landingpage.png`;

  useEffect(() => {
    i18n.changeLanguage("en");
    let selecteduserrole = localStorage.getItem("facilty");
    if (selecteduserrole) {
      setisFacilityUser(true);
      setInitialValuesObject(facilityUser);
    }
    OfflineDb.getDataFromPouchDB("loginDetails").then((loginDetails) => {
      if (loginDetails.data != undefined) {
        // history.push("/layout/home")
        OfflineDb.getDataFromPouchDB("programBoDetails").then(
        (programBoDetails) => {
          if (programBoDetails.data != undefined) {
              onSuccess();
          }
        })
      }
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          OfflineDb.setDataIntoPouchDB("geolocation", {
            lat: latitude,
            lng: longitude,
          });
          //alert("Geolocation R&D : "+latitude+' : '+longitude);
        },
        () => {
          // if geolocation denied by user then set default one
          OfflineDb.setDataIntoPouchDB("geolocation", {
            lat: 40.712742,
            lng: -74.013382,
          });
          localStorage.setItem("geolocationpermission", "denied");
          //alert("Geolocation Error : "+error)
        }
      );
    } else {
      // if geolocation denied by user then set default one
      localStorage.setItem("geolocationpermission", "denied");
      OfflineDb.setDataIntoPouchDB("geolocation", {
        lat: 40.712742,
        lng: -74.013382,
      });
    }

    return () => {
      localStorage.removeItem("facilty");
    };
  }, []);

  // useEffect(() => {
  //   const requestAndroid15Permissions = () => {
  //     const permissions = window.cordova.plugins.permissions;
  //     permissions.requestPermissions(
  //       [
  //         permissions.READ_MEDIA_IMAGES,
  //         permissions.READ_MEDIA_VIDEO,
  //         permissions.READ_MEDIA_AUDIO,
  //         permissions.READ_MEDIA_VISUAL_USER_SELECTED,
  //       ],
  //       (status) => {
  //         if (status.hasPermission) {
  //         } else {
  //           alert("Permission denied.");
  //         }
  //       },
  //       (err) => {
  //         console.error("Permission request error:", err);
  //       }
  //     );
  //   };

  //   document.addEventListener("deviceready", requestAndroid15Permissions, false);

  //   return () => {
  //     document.removeEventListener("deviceready", requestAndroid15Permissions);
  //   };
  // }, []);

  function checkPinExist(userName, userDetails) {
    if (navigator.onLine) {
      //setGlobalSpinner(true)
      apiServices
        .postAPI("save/mfa/user/check/pinexist", { username: userName })
        .then((res) => {
          if (res && res.data && res.data.status) {
            if (res.data.status == "success") {
              localStorage.setItem("pinExist", "Yes");
              localStorage.setItem("pinSet", "Yes");
              //onSuccess()
              apiServices
                .postAPI("save/mfa/user/sendToken", {
                  status: "1",
                  username: userDetails.username,
                  userrole: userDetails.userRoles[0].name,
                  userid: userDetails.id,
                })
                .then((res) => {
                  history.push("/enterPin");
                });
            } else if (res.data.status == "fail") {
              localStorage.setItem("pinExist", "No");
              localStorage.setItem("pinSet", "No");
              history.push("/enterToken");
            }
          } else {
            swal({
              title: t("Error 1:"),
              text: t("Sorry something went wrong, please try again later"),
              icon: "error",
              button: t("Close"),
            });
          }
          setGlobalSpinner(false);
        })
        .catch(() => {
          setGlobalSpinner(false);
          swal({
            title: t("Error 2:"),
            text: t("Sorry something went wrong, please try again later"),
            icon: "error",
            button: t("Close"),
          });
        });
    } else {
      setGlobalSpinner(false);
      localStorage.setItem("pinExist", "Yes");
      localStorage.setItem("pinSet", "Yes");
      onSuccess();
    }
  }

  // Function to show cookie consent dialog
  const showCookieConsentDialog = () => {
    setShowCookieConsent(true);
  };

  const privacypolicyConfig = getPrivacypolicyConfig();
  const ppversion = privacypolicyConfig?.version || "1.1";
  const ppdescription = privacypolicyConfig?.privacypolicy || "Privacy Policy";

  const userconsentConfig = getUserconsentConfig();
  const ucversion = userconsentConfig?.version || "1.1";
  const ucdescription = userconsentConfig?.userconsent || "User Consent";

  function onSubmit(values) {
    const cookiesAccepted = Cookies.get("cookiesAccepted");
    // if(cookiesAccepted === 'false'){
    //   swal({
    //     title: t("Agreement Required"),
    //     text: t("Kindly agree to terms of use"),
    //     icon: "warning",
    //     buttons: [t("Close"), t("Ok")]
    //         }).then((res) => {

    //         });
    //         return;
    // }
    // Check if cookies not accepted or explicitly declined
    if (!cookiesAccepted || cookiesAccepted === "false") {
      swal({
        title: t("Agreement Required"),
        text: t("To proceed with login please accept the Policies."),
        icon: "warning",
        buttons: [t("Close"), t("Ok")],
      }).then((willShowConsent) => {
        if (willShowConsent) {
          // If user clicks OK, show consent dialog
          // You need a way to trigger the CookieConsent component to display
          // This could be through Redux or a context
          showCookieConsentDialog(); // This function needs to be implemented
        }
      });
      return; // Stop the login process
    }
    // Validate username and password
    if (!values.username || values.username.trim() === "") {
      swal({
        title: "Invalid input",
        text: "Username is required..",
        icon: "error",
        button: "Close",
      });
      return;
    } else if (!values.password || values.password.trim() === "") {
      swal({
        title: "Invalid input",
        text: "Password is required",
        icon: "error",
        button: "Close",
      });
      return;
    }

    // Check if both checkboxes are selected
    else if (!values.agreePrivacy || !values.agreeConsent) {
      swal({
        title: t("Agreement Required"),
        text: t(
          "Kindly agree to consent and privacy policy by selecting the checkbox.."
        ),
        icon: "warning",
        button: t("Close"),
      });
      return;
    } else if (!values.ageconfirmation) {
      swal({
        title: t("Age Confirmation Required"),
        text: t(
          "Please confirm that you are above 18 years of age to proceed with the login..."
        ),
        icon: "warning",
        button: t("Close"),
      });
      return;
    } else {
      // const cookieConfig = getCookieConfig();
      // const cookieexpirydays = parseInt(cookieConfig?.cookieexpirydays) || 150;
      // Cookies.set('cookiesAccepted', 'true', { expires: cookieexpirydays });
      setGlobalSpinner(true);
      const Authorization =
        "Basic " + btoa(values.username.trim() + ":" + values.password.trim());
      const encryptedData = encryptData(Authorization);
      localStorage.setItem("basicAuth", encryptedData);
      OfflineDb.setDataIntoPouchDB("basicAuth", Authorization);
      apiServices
        .loginApi(Authorization)
        //.loginEncApi(values.username.trim(),values.password.trim(),Authorization)
        .then(async (loginRes) => {
          if(APP_LOCALE == "CC005"){
            //cdicHCP
            const userRoleName = loginRes?.data?.userRoles?.[0]?.name ?? "";
            const userrole = userType == healthWorkerRole && (userRoleName == healthWorkerRole || userRoleName == cdicHCP) ? userType : loginRes?.data?.userRoles?.some(role => role.name == userType)
            //console.log("userrole ",userrole)
            if(!userrole){
                setGlobalSpinner(false)
                swal({
                  title: t("Login Failed"),
                  text: userTypeError,
                  icon: "warning",
                  button: t("Ok"),
                });
                return;
            }
          }
          const imageUrl = `${process.env.PUBLIC_URL}/images/cdic-logo.png`;
          const imageBlob = await convertPublicImageToBlob(imageUrl);
          const doc = {
            _id: "img_b",
            _attachments: {
              "cdic-logo.png": {
                content_type: "image/png",
                data: imageBlob,
              },
            },
          };
          try {
            await db.put(doc);
          } catch (err) {
            console.error("Error storing image in PouchDB:", err);
          }
          const locale = loginRes?.data?.settings?.keyUiLocale;
          const loginDetails = loginRes.data;
          async function convertPublicImageToBlob(url) {
            const response = await fetch(url);
            const blob = await response.blob();
            return blob;
          }
          // async function convertPublicImageToByteStream(url) {
          //   try {
          //     const response = await fetch(url);
          //     if (!response.ok) {
          //       throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
          //     }
          //     const arrayBuffer = await response.arrayBuffer();
          //     return arrayBuffer;
          //   } catch (error) {
          //     console.error("Error converting image to byte stream:", error);
          //     throw error;
          //   }
          // }
          // function arrayBufferToBase64(buffer) {
          //   let binary = '';
          //   const bytes = new Uint8Array(buffer);
          //   const len = bytes.byteLength;
          //   for (let i = 0; i < len; i++) {
          //     binary += String.fromCharCode(bytes[i]);
          //   }
          //   return btoa(binary);
          // }
          if (Array.isArray(loginDetails.userRoles)) {
            const roleNames = loginDetails.userRoles.map((role) => role.name);
            sessionStorage.setItem("userRoles", roleNames.join(","));
          }

          if (locale) {
            sessionStorage.setItem("userUILocale", locale);
          }
          let param = {
            userid: loginRes.data.id,
          };
          const privacyRes = await apiServices.postAPI(
            "common/getPrivacyVersions",
            param
          );

          if (privacyRes && privacyRes.data) {
            const { consentVersion, privacyVersion, status } = privacyRes.data;
            const approvedTimeStamp = new Date().toISOString();
            if (status === "fail") {
              const updateSuccessful = await updatePrivacyVersions(
                ucversion,
                ppversion,
                approvedTimeStamp,
                loginRes.data.id
              );

              if (!updateSuccessful) {
                swal({
                  title: t("Error"),
                  text: t("Error updating privacy policy & user consent"),
                  icon: "warning",
                  button: t("Ok"),
                });
                return;
              }
            } else if (status === "success") {
              if (ucversion > consentVersion && ppversion > privacyVersion) {
                const ucppValue = sessionStorage.getItem("ucpp");
                const isUcpp = parseBooleans(ucppValue);
                if (!isUcpp || ucppValue == null) {
                  setGlobalSpinner(false);
                  swal({
                    title: t("Review"),
                    text: t(
                      "Please review and accept updated privacy policy and user consent"
                    ),
                    icon: "warning",
                    button: t("Ok"),
                  });

                  sessionStorage.setItem("ucpp", true);
                  setInitialValuesObject({
                    ...initialValuesObject,
                    agreePrivacy: false,
                    agreeConsent: false,
                  });
                  return;
                } else {
                  const updateSuccessful = await updatePrivacyVersions(
                    ucversion,
                    ppversion,
                    approvedTimeStamp,
                    loginRes.data.id
                  );

                  if (updateSuccessful) {
                    sessionStorage.removeItem("ucpp");
                  }
                }
              } else if (ucversion > consentVersion) {
                const ucValue = sessionStorage.getItem("uc");
                const isUc = ucValue === true;
                if (!isUc || ucValue === null) {
                  setGlobalSpinner(false);
                  swal({
                    title: t("Review"),
                    text: t("Please review and accept updated user consent"),
                    icon: "warning",
                    button: t("Ok"),
                  });

                  sessionStorage.setItem("uc", true);
                  setInitialValuesObject({
                    ...initialValuesObject,

                    agreeConsent: false,
                  });
                  return;
                } else {
                  const updateSuccessful = await updatePrivacyVersions(
                    ucversion,
                    ppversion,
                    approvedTimeStamp,
                    loginRes.data.id
                  );

                  if (updateSuccessful) {
                    sessionStorage.removeItem("uc");
                  }
                }
              } else if (ppversion > privacyVersion) {
                const ppValue = sessionStorage.getItem("pp");
                const ispp = ppValue === true;
                if (!ispp || ppValue === null) {
                  setGlobalSpinner(false);
                  swal({
                    title: t("Review"),
                    text: t("Please review and accept updated privacy policy"),
                    icon: "warning",
                    button: t("Ok"),
                  });

                  sessionStorage.setItem("pp", true);
                  setInitialValuesObject({
                    ...initialValuesObject,
                    agreePrivacy: false,
                  });
                  return;
                } else {
                  const updateSuccessful = await updatePrivacyVersions(
                    ucversion,
                    ppversion,
                    approvedTimeStamp,
                    loginRes.data.id
                  );

                  if (updateSuccessful) {
                    sessionStorage.removeItem("pp");
                  }
                }
              }
            }
          }
          //
          OfflineDb.setDataIntoPouchDB("loginDetails", loginRes.data).then(
            () => {
              apiServices
                .getAPI(
                  "dataStore/configuration/" +
                    (APP_LOCALE == "CC006"
                      ? "configuration_kier"
                      : "configuration_ncd")
                )
                .then((res) => {
                  OfflineDb.setDataIntoPouchDB("configurations", res.data);
                  setGlobalSpinner(false);
                  setTimeout(() => {
                    apiServices
                      .getAPI(
                        "29/organisationUnits/" +
                          loginRes.data.organisationUnits[0]?.id
                      )
                      .then((orgres) => {
                        if (orgres && orgres.data && orgres.data.path) {
                          try {
                            let orgheirarchypath = orgres.data.path;
                            let orgunit = orgheirarchypath.split("/")[2];
                            let tempHolder = {
                              type: "GET",
                              url: "dataStore/translations/" + orgunit,
                              data: null,
                            };
                            const encryptedData = encryptData(tempHolder);
                            apiServices
                              .postAPI("commonencryption/getDecrypt", {
                                data: encryptedData,
                              })
                              // apiServices
                              // .getAPI("dataStore/translations/" + orgunit)
                              .then(async (configRes) => {
                                configRes.data = decryptData(configRes.data);
                                if (
                                  configRes.data.roleBasedArray &&
                                  configRes.data.roleBasedArray.length > 0
                                ) {
                                  // Proceed with existing logic if roleBasedArray is present and not empty
                                  if (
                                    configRes.data.resetPassFlag &&
                                    configRes.data.resetPassFlag == true
                                  ) {
                                    if (
                                      loginRes.data.facebookMessenger &&
                                      loginRes.data.facebookMessenger == "true"
                                    ) {
                                      if (configRes.data.mfaFlag === true)
                                        checkPinExist(
                                          values.username.trim(),
                                          loginRes.data
                                        );
                                      else {
                                        const loginDetails =
                                          await OfflineDb.getDataFromPouchDB(
                                            "loginDetails"
                                          );
                                        await handleLanguageAndNavigation(
                                          loginDetails.data,
                                          setGlobalSpinner,
                                          () => history.push("/layout/home"),
                                          locale
                                        );
                                      }
                                    } else {
                                      history.push("/settings");
                                    }
                                  } else if (configRes.data.mfaFlag === true) {
                                    if (
                                      loginRes.data.facebookMessenger &&
                                      loginRes.data.facebookMessenger == "true"
                                    )
                                      checkPinExist(
                                        values.username.trim(),
                                        loginRes.data
                                      );
                                    else history.push("/selectlanguage");
                                  } else {
                                    // history.push("/selectlanguage");
                                    const loginDetails =
                                      await OfflineDb.getDataFromPouchDB(
                                        "loginDetails"
                                      );
                                    await handleLanguageAndNavigation(
                                      loginDetails.data,
                                      setGlobalSpinner,
                                      () => history.push("/layout/home"),
                                      locale
                                    );
                                  }
                                } else {
                                  // Log a message if roleBasedArray does not exist or is empty
                                  swal({
                                    title: t("Error"),
                                    text: t(
                                      "Role based configuration is not present , kindly contact admin"
                                    ),
                                    icon: "warning",
                                    button: t("Ok"),
                                  });
                                }
                              });
                          } catch (e) {
                            console.log(e);
                            // setGlobalSpinner(false);
                          }
                        }
                      });
                    // })
                    //
                  }, 500);
                })
                .catch(() => {
                  setGlobalSpinner(false);
                  // history.push("/selectlanguage");
                  (async () => {
                    setGlobalSpinner(false);

                    const loginDetails = await OfflineDb.getDataFromPouchDB(
                      "loginDetails"
                    );

                    await handleLanguageAndNavigation(
                      loginDetails.data,
                      setGlobalSpinner,
                      () => history.push("/layout/home"),
                      locale
                    );
                  })();
                  // checkPinExist(values.username.trim())
                });
            }
          );
        })
        .catch((error) => {
          localStorage.removeItem("basicAuth");
          if (error.response) {
            swal({
              title: "Login failed",
              text: error.response.data.message,
              icon: "error",
              button: "Close",
            });
          } else {
            swal({
              title: "Login failed",
              text: "",
              icon: "error",
              button: "Close",
            });
          }
          //setLoading(false)
          setGlobalSpinner(false);
        });
    }
  }

  async function updatePrivacyVersions(
    ucversion,
    ppversion,
    approvedTimeStamp,
    userId
  ) {
    const updateVersion = {
      consentVersion: ucversion,
      privacyVersion: ppversion,
      approvedTimeStamp: approvedTimeStamp,
      userid: userId,
    };

    try {
      const updatePrivacyVersionResponse = await apiServices.postAPI(
        "common/updatePrivacyVersions",
        updateVersion
      );

      // Log the response

      if (updatePrivacyVersionResponse.data === "success") {
        return true; // Indicate success
      } else {
        console.error(
          "Failed to update privacy versions:",
          updatePrivacyVersionResponse
        );
        return false; // Indicate failure
      }
    } catch (error) {
      console.error("Error updating privacy versions:", error);
      return false; // Indicate failure
    }
  }

  function doForgotPasswordRecoveryCall(username) {
    var bodyFormData = new FormData();
    bodyFormData.append("username", username);
    const url = "account/recovery";
    setLoading(true);
    apiServices
      .postMultiPartFormDataAPI(url, bodyFormData)
      .then((res) => {
        setLoading(false);
        swal({
          title: "Done",
          text: res.data.message,
          icon: "success",
          button: "Close",
        });
      })
      .catch((err) => {
        if (err.response) {
          swal({
            title: "Fail",
            text: err.response.data.message,
            icon: "error",
            button: "Close",
          });
        } else {
          swal({
            title: "Fail",
            text: "Fail to update",
            icon: "error",
            button: "Close",
          });
        }
        setLoading(false);
      });
  }

 function openForgotPasswordPopup() {
  swal({
    title: "Forgot Password",
    text: "Please enter your username to reset your password",
    content: "input",
    buttons: ["Cancel", "Continue"],
    className: "my-custom-swal",
    icon: "info",
    closeOnClickOutside: false,
  }).then((username) => {
    if (username === null) {
      // User clicked Cancel, do nothing
      return;
    }
    
    if (username && username.trim()) {
      validateUsername(username.trim());
    } else {
      // Show error if Continue clicked without input
      swal({
        title: "Username Required",
        text: "Please enter your username to continue.",
        icon: "warning",
        button: "OK",
      }).then(() => {
        openForgotPasswordPopup(); // Show the popup again
      });
    }
  });
}



// Step 1: Validate username and send token
function validateUsername(username) {
  const requestBody = {
    status: "1",
    username,
    userrole: "",
    userid: ""
  };

  setLoading(true);

  apiServices.sendTokenAPI(requestBody)
    .then((res) => {
      setLoading(false);
      if (res.status === "success") {
        swal({
          title: "Token Required",
          text: "Please enter the verification token you received via your registered email.",
          icon: "warning",
          button: "OK"
        }).then(() => openTokenVerificationModal(username));
      } else if(res.message === "service unavailable") {
        showInvalidUsernameAlert();
      }
      else {
        showMissingEmailAlert();
      }
    })
    .catch((err) => {
      setLoading(false);
      console.error("Error validating username:", err);
      showErrorAlert(err, "Failed to validate username.");
    });
}

// Step 2: Send token to email
function sendTokenToEmail(username) {
 const requestBody = {
    status: "1",
    username,
    userrole: "",
    userid: ""
  };

  setLoading(true);

  apiServices.sendTokenAPI(requestBody)
    .then((res) => {
      setLoading(false);
      if (res.status === "success") {
        swal({
          title: "Token Sent!",
          text: "A verification token has been sent to your email address.",
          icon: "success",
          button: "Continue"
        }).then(() => openTokenVerificationModal(username));
      } else {
        showTokenFailureAlert();
      }
    })
    .catch((err) => {
      setLoading(false);
      showErrorAlert(err, "Failed to send token.");
    });
}

// Step 3: Token verification modal
function openTokenVerificationModal(username) {
  swal({
    title: "Enter Verification Token",
    content: {
      element: "input",
      attributes: {
        placeholder: "Enter token here",
        type: "text"
      }
    },
    buttons: {
      resend: { text: "Resend", value: "resend" },
      verify: { text: "Verify", value: "verify" }
    }
  }).then((value) => {
    const tokenInput = document.querySelector('.swal-content input');
    const token = tokenInput?.value.trim();

    if (value === "resend") {
      sendTokenToEmail(username);
    } else if (value === "verify") {
      if (token) {
        verifyTokenAndShowPasswordModal(username, token);
      } else {
        swal({
          title: "Token Required",
          text: "Please enter the verification token.",
          icon: "warning",
          button: "OK"
        }).then(() => openTokenVerificationModal(username));
      }
    }
  });
}

// Step 4: Verify token and show password modal
function verifyTokenAndShowPasswordModal(username, token) {
  setLoading(true);

  apiServices.validateTokenAPI({ username, token })
    .then((res) => {
      const response = decryptData(res);
      setLoading(false);

      if (response.status === "success") {
        swal({
          title: "Token Validated!",
          text: "Please set a new password.",
          icon: "success",
          button: "Continue"
        }).then(() => openNewPasswordModal(username, token));
      } else {
        swal({
          title: "Invalid Token",
          text: "The token is invalid. Please try again.",
          icon: "error",
          button: "Retry"
        }).then(() => openTokenVerificationModal(username));
      }
    })
    .catch((err) => {
      setLoading(false);
      showErrorAlert(err, "Token validation failed.");
    });
}

// Step 5: Show new password modal
function openNewPasswordModal(username, token) {
  const passwordForm = document.createElement('div');
 passwordForm.innerHTML = `
  <div style="text-align: left; margin-top: 15px;">
    <label style="font-weight: bold;">Username:</label>
    <input type="text" value="${username}" disabled 
      style="width: 95%; margin-bottom: 15px; border: none; background-color: #f2f2f2; padding: 10px; font-size: 14px;" />

    <label style="font-weight: bold;">New Password:</label>
    <input type="password" id="newPassword" placeholder="Enter new password" 
      style="width: 95%; margin-bottom: 15px; border: none; background-color: #f9f9f9; padding: 10px; font-size: 14px;" />

    <label style="font-weight: bold;">Confirm Password:</label>
    <input type="password" id="confirmPassword" placeholder="Confirm new password" 
      style="width: 95%; border: none; background-color: #f9f9f9; padding: 10px; font-size: 14px;" />

    <div style="font-size: 12px; color: #666; margin-top: 5px; margin-bottom: 10px;">
      Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol.
    </div>
  </div>
`;


  swal({
    title: "Set New Password",
    content: passwordForm,
    buttons: {
      confirm: { text: "Update Password", value: "update" },
      cancel: t("Cancel"),
    },
    icon: "info",
    closeOnClickOutside: false
  }).then((result) => {
    if (result === "update") {
      const newPassword = document.getElementById('newPassword').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();

      if (!newPassword || !confirmPassword) {
        return showSimpleAlert("Missing Information", "Please fill in both password fields.", "warning", () =>
          openNewPasswordModal(username, token));
      }

      if (newPassword !== confirmPassword) {
        return showSimpleAlert("Password Mismatch", "Passwords do not match.", "error", () =>
          openNewPasswordModal(username, token));
      }

      if (!passwordRegex.test(newPassword)) {
        return showSimpleAlert(
          "Invalid Password",
          "Password must contain at least 8 characters, including 1 lowercase, 1 uppercase, 1 number, and 1 special character.",
          "warning",
          () => openNewPasswordModal(username, token)
        );
      }

      updatePassword(username, newPassword, token);
    }
    else{
      swal.close(); // Close the modal if cancelled
    }
  });
}

// Step 6: Update password
function updatePassword(email, password, token) {
  setLoading(true);

  apiServices.updatePasswordAPI({ email, password })
    .then(() => {
      setLoading(false);
      swal({
        title: "Password Updated!",
        text: "Your password has been successfully updated.",
        icon: "success",
        button: "Go to Login"
      }).then(() => {
        swal.close(); // Or redirect
      });
    })
    .catch((err) => {
      setLoading(false);
      swal({
        title: "Update Failed",
        text: err.response?.data?.message || "Failed to update password.",
        icon: "error",
        buttons: {
          retry: { text: "Try Again", value: "retry" },
          cancel: { text: "Cancel", value: null }
        }
      }).then((result) => {
        if (result === "retry") {
          verifyTokenAndShowPasswordModal(email, token);
        }
      });
    });
}

function showSimpleAlert(title, text, icon, callback) {
  swal({ title, text, icon, button: "OK" }).then(callback);
}

function showErrorAlert(err, fallbackMsg) {
  swal({
    title: "Error",
    text: err.response?.data?.message || fallbackMsg,
    icon: "error",
    button: "Try Again"
  }).then(() => openForgotPasswordPopup());
}

function showInvalidUsernameAlert() {
  swal({
    title: "Invalid Username",
    text: "The username you entered is not valid. Please check and try again.",
    icon: "error",
    button: "Try Again"
  }).then(() => openForgotPasswordPopup());
}

function showMissingEmailAlert() {
  swal({
    title: "Email Not Found",
    text: "No email found with this username. Please check and try again.",
    icon: "error",
    button: "Try Again"
  }).then(() => openForgotPasswordPopup());
}

function showTokenFailureAlert() {
  swal({
    title: "Token Error",
    text: "Failed to send verification token. Please try again.",
    icon: "error",
    button: "Retry"
  }).then(() => openForgotPasswordPopup());
}



  function showPassword() {
    if (showPasswordFlag) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }
  const regex = new RegExp("^[a-zA-Z0-9_@.]*$");
  const scriptBlockRegex = new RegExp("/<[^>]*>/g");
  
  const userCheck = (value) =>
    value
      ? value.match(regex) != null
        ? undefined
        : "Incorrect expression added as input"
      : undefined;
  const scriptCheck = (value) =>
    value
      ? value.match(scriptBlockRegex) != null
        ? 'Incorrect expression "< or >" added as input'
        : undefined
      : undefined;
  const passWordCheck = (value) =>
    value
      ? value.match(passwordRegex) != null
        ? undefined
        : "Incorrect password pattern"
      : undefined;
  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  const loginConfig = getLoginConfig();
  const displayLabel = loginConfig?.displayLabel === "Yes";
  const countryName = loginConfig?.countryName || "Default Country";
  const cdicPakCountryName = loginConfig?.cdicCountryName || "NCD Registry";
  const dropLoginTab = loginConfig?.dropUserTab || "DROP Login";
  const dropSwitchLoginTab = loginConfig?.switchDropUserTab || "Switch to DROP Login";
  const cdicLoginTab = loginConfig?.cdicUserTab || "CDIC Login";
  const cdicSwitchLoginTab = loginConfig?.switchCDICUserTab || "Switch to CDIC Login";
  const userTypeError = loginConfig?.userTypeError || "Please select correct user type!";
  const welcomeText = loginConfig?.welcomeText || "Welcome Message";
  const iagreeprivacypolicy = loginConfig?.iagreeprivacypolicy || "I agree to the";
  const iagreeconsent = loginConfig?.iagreeconsent || "I agree to the";
  const privacypolicy = loginConfig?.privacypolicy || "Privacy Policy";
  const consent = loginConfig?.consent || "consent";
  const agecheckbox = loginConfig?.agecheckbox || "I am above 18 years of age";
  const usernameLabel = displayLabel
    ? loginConfig?.usernameLabel || "User Name"
    : "User Name";
  const passwordLabel = displayLabel
    ? loginConfig?.passwordLabel || "Password"
    : "Password";
  const forgotPasswordLabel = displayLabel
    ? loginConfig?.forgotPasswordLabel || "Forgot Password?"
    : "Forgot Password?";
  const submitButtonText = displayLabel
    ? loginConfig?.submitButtonText || "Login"
    : "Login";
  const resetButtonText = displayLabel
    ? loginConfig?.resetButtonText || "Reset"
    : "Reset";

  const handleOpenPolicyModal = () => {
    setShowPolicyModal(true); // Show the policy modal
  };

  const handleClosePolicyModal = () => {
    setShowPolicyModal(false); // Close the policy modal
  };

  const handleOpenConsentModal = () => {
    setShowConsent(true); // Show the policy modal
  };

  const handleCloseConsentModal = () => {
    setShowConsent(false); // Close the policy modal
  };

  const handleUserType = (userRole) => {
    if (formRef.current) {
        formRef.current.reset();
    }
    setUserType(userRole)
  }

  const imageUrlDynamic = getImgUrl();
  return (
    <div className={classes.container}>
      <main style={{ display: "flex", height: "100%", width: "100%" }}>
        <section
          className="mainsection pb-0 homeMain loginMain"
          style={{
            flexGrow: 1,
          }}
        >
          {/* <Grid container xs={12} md={12} className="loginnav registernav">
            <Grid xs={3} className="backimg">
              <img
                src={imgUrl.backlogo}
                className="backsvg"
                onClick={() => handleBack()}
                style={{ marginTop: "2%", width: "6%" }}
              />
              <IconButton
                className="backsvg"
                aria-label="go back"
                onClick={() => handleBack()}
                style={{marginTop: "2%", width: "6%"}}
              >
              <ArrowBack />
              </IconButton>
            </Grid>
            <Grid xs={6} className="text-center">
              <Typography variant="subtitle1" className="logname oneuhcfont">
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Typography variant='body2' className='stepname'><Feedback></Feedback>
                        </Typography>
            </Grid>
          </Grid> */}

          <Grid container className="lognewDIv loginMainwrapper">
            <Grid
              item
              xs={APP_LOCALE === "CC010" ? 5 : 6}
              md={APP_LOCALE === "CC010" ? 5 : 6}
              className="loginpageformholder main-loginSection login-leftSection colombiaBgimage"
              style={{
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundPosition: APP_LOCALE === "CC010" ? "left" : "center",
                backgroundSize: "cover",
                height: APP_LOCALE === "CC005" ? "120vh" : "100vh",
                backgroundRepeat: APP_LOCALE === "CC010" ? "no-repeat" : "",
              }}
            >
              <div className="innerdiv userwebapp">
                <p className="zero text-center">
                  {/* <div className="useravtarimg" /> */}
                </p>
                <p className="zero text-center">
                  {/* <h3 className="text-uppercase">Sign In</h3> */}
                </p>
              </div>
            </Grid>

            <Grid item xs={12} md={6} className="pagelaterpart">
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
              <div className="loginpageformholder loginwebhome">
                <div className="">
                  {/* <div className="useravtarimgapp" /> */}
                  {/* <Typography variant='h4' className='signmob mb-30px'>Sign In</Typography> */}
                </div>
                {
                  APP_LOCALE == "CC005" &&
                      <div className="buttons d-flex align-items-center usertype-block">
                        <Button tabIndex={-1} className={userType == healthWorkerRole ? "mr-20px usertype-btn active" : "mr-20px usertype-btn"} onClick={() => handleUserType(healthWorkerRole)}>{userType == healthWorkerRole ? cdicLoginTab : cdicSwitchLoginTab}</Button>
                        <Button tabIndex={-1} className={userType == dropRole ? "usertype-btn active" : "usertype-btn"} onClick={() => handleUserType(dropRole)}>{userType == dropRole ? dropLoginTab : dropSwitchLoginTab}</Button>
                      </div>
                }
                <Typography variant="h4" className="clini-head mb-20px" style={APP_LOCALE =="CC005"? {marginTop:"65px"} : {}}>
                  {" "}
                  <div className="login-logo">
                    {/* CDIC E- Registry */}
                    {/* <img src={imgUrl['who-logo']} className="whologo main-logo"/> */}
                    <img
                      src={APP_LOCALE =="CC003" ? imageUrlDynamic["bangladesh-logo"] : APP_LOCALE == "CC005" && userType == healthWorkerRole ?  imageUrlDynamic["cdic-logo"] : imageUrlDynamic["who-logo"]}
                      className={`whologo main-logo ${
                        APP_LOCALE === "CC005" ? "pakistan-logo" : ""
                      }`}
                    />
                  </div>
                </Typography>
                {displayLabel && (
                  <>
                    <Typography
                      variant="subtitle1"
                      className="custlabel-style custlabel-bold"
                    >
                      {APP_LOCALE == "CC005" && userType == healthWorkerRole ? cdicPakCountryName : countryName}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      className="custlabel2-style custlabel-spacing"
                    >
                      {welcomeText}
                    </Typography>
                  </>
                )}
                <div className="loginwweb pt-0">
                  {/* <Typography variant='h4' className='signweb mb-30px'>Sign In</Typography> */}
                  {/* <p className="loginformheading">Sign In</p> */}
                  {loading ? (
                    <CenteredContent
                      dataTest="dhis2-uicore-centeredcontent"
                      position="middle"
                    >
                      <CircularLoader
                        large
                        dataTest="dhis2-uicore-circularloader"
                      />
                    </CenteredContent>
                  ) : (
                    ""
                  )}

                  <Form
                    initialValues={initialValuesObject}
                    autocomplete="off"
                    onSubmit={(values) => onSubmit(values, null, 2)}
                    render={({ handleSubmit, form, submitting, pristine }) => {
                      formRef.current = form; // ✅ store reference
                      return (
                      <form
                        onSubmit={handleSubmit}
                        autocomplete="off"
                        style={{ display: "contents" }}
                      >
                        <div className="w-100">
                          <Field
                            name="username"
                            label={usernameLabel}
                            component={InputFieldFF}
                            placeholder={usernameLabel}
                            key="username"
                            validate={composeValidators(userCheck, scriptCheck)}
                            // required
                          />
                        </div>
                        <div className="w-100 mt-10px position-relative">
                          <Field
                            name="password"
                            label={passwordLabel}
                            component={InputFieldFF}
                            key="password"
                            placeholder="******"
                            validate={composeValidators(
                              scriptCheck,
                              passWordCheck
                            )}
                            // required
                            className={
                              showPasswordFlag
                                ? "position-relative"
                                : "password position-relative"
                            }
                          />
                          <p className="visibilityiconcontainer ">
                            {showPasswordFlag ? (
                              <VisibilityIcon onClick={() => showPassword()} />
                            ) : (
                              <VisibilityOffIcon
                                onClick={() => showPassword()}
                              />
                            )}
                          </p>
                        </div>
                        <p
                          className="forgotpw"
                          style={{ cursor: "pointer" }}
                          onClick={() => openForgotPasswordPopup()}
                        >
                          {forgotPasswordLabel}
                        </p>
                        <div className="checkboxpc-container mt-15px">
                          <Field name="agreePrivacy" type="checkbox">
                            {({ input }) => (
                              <label className="checkboxpc-label">
                                <input {...input} type="checkbox" />
                                <span style={{ marginLeft: "5px" }}>
                                  {t(iagreeprivacypolicy)}{" "}
                                  {/* <a
                                  href=""
                                  onClick={() => history.push("/privacy-policy")}
                                  style={{ textDecoration: "underline", color: "", cursor: "pointer" }}
                                > */}
                                  <a
                                    href="#!"
                                    onClick={handleOpenPolicyModal}
                                    style={{
                                      textDecoration: "underline",
                                      color: "",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {t(privacypolicy)}
                                  </a>
                                </span>
                              </label>
                            )}
                          </Field>

                          <Field name="agreeConsent" type="checkbox">
                            {({ input }) => (
                              <label className="checkboxpc-label">
                                <input {...input} type="checkbox" />
                                <span style={{ marginLeft: "5px" }}>
                                  {t(iagreeconsent)}{" "}
                                  {/* <a
                                  href=""
                                  onClick={() => history.push("/user-consent")}
                                  style={{ textDecoration: "underline", color: "", cursor: "pointer" }}
                                > */}
                                  <a
                                    href="#!"
                                    onClick={handleOpenConsentModal}
                                    style={{
                                      textDecoration: "underline",
                                      color: "",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {t(consent)}
                                  </a>
                                </span>
                              </label>
                            )}
                          </Field>
                        </div>
                        <div className="checkboxpc-container mt-1px">
                          <Field name="ageconfirmation" type="checkbox">
                            {({ input }) => (
                              <label className="checkboxpc-label">
                                <input {...input} type="checkbox" />
                                <span style={{ marginLeft: "5px" }}>
                                  {t(agecheckbox)}
                                </span>
                              </label>
                            )}
                          </Field>
                        </div>

                        <div className="buttons d-flex mt-15px align-items-center">
                          <Button
                            type="submit"
                            disabled={submitting}
                            className="loginbtn loginsubmitbtn mt-0"
                          >
                            {submitButtonText}
                          </Button>
                          &nbsp;
                          <Button
                            type="button"
                            onClick={form.reset}
                            disabled={submitting || pristine}
                            className="resetButton w-50"
                          >
                            {resetButtonText}
                          </Button>
                          <br></br>
                        </div>
                        {/* {
                          APP_LOCALE == "CC005" &&
                            <div className="buttons mt-15px align-items-center">
                              <Button type="button" className="mt-15px" onClick={handleUserType}>{userType == dropRole ? "Switch to CDIC Login" : "Switch to DROP Login"}</Button>
                            </div>
                        } */}
                        {/* <div className="default-mainLogin mt-5px">
                          <input
                            type="checkbox"
                            checked={defaultChecked}
                            onChange={handleDefaultLogin}
                            // style={{marginLeft: "120px",marginTop: "10px"}}
                          />{" "}
                        <p className="default-login"> {defaultCredentials} </p> 
                        </div> */}
                        {/* <div style={{marginTop:"12px",fontSize:"12px"}}>{t('Version No')} : 1.3.0 (TPT Test)</div> */}
                      </form>
                    );
                  }}
                  />
                </div>
              </div>
            </Grid>
            {/* <Grid item xs={0} md={4}></Grid> */}
          </Grid>
        </section>
      </main>
      {showPolicyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h4 style={styles.modalTitle}>Privacy Policy</h4>
              <button
                style={styles.closeModalButton}
                onClick={handleClosePolicyModal}
              >
                &times;
              </button>
            </div>

            <div
              style={styles.modalBody}
              dangerouslySetInnerHTML={{ __html: ppdescription }}
            >
              {/* Dynamically bind the privacy policy content */}
            </div>
            <div style={styles.modalFooter}>
              <button
                className="loginbtn loginsubmitbtn mt-0"
                onClick={handleClosePolicyModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showConsent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h4 style={styles.modalTitle}>User Consent Policy</h4>
              <button
                style={styles.closeModalButton}
                onClick={handleCloseConsentModal}
              >
                &times;
              </button>
            </div>

            <div
              style={styles.modalBody}
              dangerouslySetInnerHTML={{ __html: ucdescription }}
            >
              {/* Dynamically bind the consent policy content */}
            </div>
            <div style={styles.modalFooter}>
              <button
                className="loginbtn loginsubmitbtn mt-0"
                onClick={handleCloseConsentModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    backgroundColor: "#fff",
    width: "300px",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    padding: "20px",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: "0",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  },
  description: {
    margin: "10px 0 10px 0",
    textAlign: "justify", // Justify the description text
  },
  policy: {
    marginBottom: "15px",
    textAlign: "left",
  },
  link: {
    color: "#007bff", // Highlight color (blue)
    textDecoration: "underline", // Underline the link
    // fontWeight: 'bold', // Make it bold for emphasis
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    width: "45%", // Ensure both buttons are equal size
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    width: "45%", // Ensure both buttons are equal size
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "320px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  modalTitle: {
    margin: "0",
  },
  closeModalButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  },
  modalBody: {
    overflowY: "auto",
    maxHeight: "60vh",
    paddingRight: "10px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
};

export default Login;
