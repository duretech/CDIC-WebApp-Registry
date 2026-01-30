import React, { useState, useEffect } from "react";
import Globalclasses from "../../App.module.css";
import { apiServices } from "../../services/apiServices";
import { Typography } from "@material-ui/core";
import OfflineDb from "../../db";
import { useHistory } from "react-router";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import {
  InputFieldFF,
  ReactFinalForm,
} from "@dhis2/ui";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import {
  setSidebarToggel,
  setLoginUser,
} from "../../redux/actions/action";
import { decryptData } from "../../imon/encryption/AesEnc";
import { handleLanguageAndNavigation } from '../login/handleLanguageAndNavigation';
//import {Configuration} from '../../assets/data/config'
// import '../../assets/css/customstyles.css'
// import '../../assets/css/theme_grey.css'
// import '../../assets/css/theme_blue.css'
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'

const { Form, Field } = ReactFinalForm;

function EnterPin({ onSuccess, setSidebarToggel, setLoginUser }) {
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [token, setToken] = useState("SAVECHILD");
  const { t } = useTranslation();
  const history = useHistory();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const [Configuration, setConfiguration] = useState(null);
  const maxValue = (max) => (value) =>
    isNaN(value) || value.length == max
      ? undefined
      : `Should not be greater or less than ${max} digit`;

  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );
  async function getMetaData() {
    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);

    let configurations = await OfflineDb.getDataFromPouchDB("configurations");
    setConfiguration(configurations.data.configuration);
  }
  useEffect(() => {
    getMetaData();
    /*OfflineDb.removeDataFromPouchDB('activeCaseDetails')
        OfflineDb.removeDataFromPouchDB('activeCaseFormData')
        OfflineDb.removeDataFromPouchDB('linkContactFlag')
        OfflineDb.setDataIntoPouchDB('transferFlag', {type:null})
        if(localStorage.getItem('referral-type')){
            localStorage.removeItem('referral-type')
        }*/
  }, []);

  //once user bco is set call getContactList function
  useEffect(() => {
    if (sessionUserBoValue != null && Configuration != null) {
      //do something here
    }
  }, [sessionUserBoValue, Configuration]);

  function resetPin() {
    console.log("sessionUserBoValue", sessionUserBoValue);
    if (
      navigator.onLine &&
      sessionUserBoValue &&
      sessionUserBoValue.userCredentials
    ) {
      setGlobalSpinner(true);
      apiServices
        .postAPI("save/mfa/user/updatePin", {
          status: "1",
          username: sessionUserBoValue.username,
          userrole: sessionUserBoValue.userRoles[0].name,
          userid: sessionUserBoValue.id,
        })
        .then((res) => {
          setGlobalSpinner(false);
          if (
            res &&
            res.data &&
            res.data.status &&
            res.data.status == "success"
          ) {
            swal({
              title: t("Success"),
              text: t("Please re-login and set your new pin."),
              icon: "success",
              button: t("Close"),
            }).then((r) => {
              localStorage.clear();
              OfflineDb.deleteDatabse()
                .then((res) => {
                history.push("/");
                  setLoginUser(false);
                })
                .catch((err) => {
                  setLoginUser(false);
                });
            });
          } else {
            swal({
              title: t("Alert"),
              text: t("Sorry something went wrong, please try again later"),
              icon: "error",
              button: t("Close"),
            });
          }
        })
        .catch((err) => {
          console.log("err", err);
          setGlobalSpinner(false);
          swal({
            title: t("Alert"),
            text: t("Sorry something went wrong, please try again later"),
            icon: "error",
            button: t("Close"),
          });
        });
    } else {
      //offline
      if (!navigator.onLine) {
      } else {
        //userbo not fournd
        localStorage.clear();
        OfflineDb.deleteDatabse()
          .then((res) => {
            setLoginUser(false);
          })
          .catch((err) => {
            setLoginUser(false);
          });
      }
    }
  }

  function onSubmit() {
    let newPin = document.getElementById("new-pin").value;
    let newToken = document.getElementById("new-token").value;
    if (newPin && newToken &&  sessionUserBoValue && sessionUserBoValue.userCredentials) {
      setGlobalSpinner(true);
      apiServices
        .postAPI("save/mfa/user/check/validpin", {
          username: sessionUserBoValue.username,
          pin: newPin,
        })
        .then((res) => {
          setGlobalSpinner(false);
          if (
            res &&
            res.data &&
            res.data.status &&
            res.data.status == "success"
          ) {
            console.log("herre");
            apiServices
            .postAPI("save/mfa/user/validate/token", {
              username: sessionUserBoValue.username,
              token: newToken,
            })
            .then((res) => {
              // console.log(decryptData(res.data))
              res.data = decryptData(res.data)
              if (
                res &&
                res.data &&
                res.data.status &&
                res.data.status == "success"
              )
              {
              // history.push("/selectlanguage");
              (async () => {
                setGlobalSpinner(false);
                const locale = sessionStorage.getItem("userUILocale") || "en";
                const loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
            
                await handleLanguageAndNavigation(
                  loginDetails.data,
                  setGlobalSpinner,
                  () => history.push("/layout/home"),
                  locale
                );
              })();
            }
            else{
              swal({
                title: t("Alert"),
                text: t("You have entered invalid token!"),
                icon: "error",
                button: t("Close"),
              });
            }
            })
            //onSuccess()
          } else {
            swal({
              title: t("Alert"),
              text: t("You have entered invalid pin!"),
              icon: "error",
              button: t("Close"),
            });
          }
        })
        .catch((err) => {
          console.log("err", err);
          setGlobalSpinner(false);
          swal({
            title: t("Alert"),
            text: t("Sorry something went wrong, please try again later"),
            icon: "error",
            button: t("Close"),
          });
        });
    } else {
      if (!newPin) {
        swal({
          title: t("Alert"),
          text: t("Please enter Pin"),
          icon: "alert",
          button: t("Close"),
        });
      } else {
        localStorage.clear();
        OfflineDb.deleteDatabse()
          .then((res) => {
            setLoginUser(false);
          })
          .catch((err) => {
            setLoginUser(false);
          });
      }
    }
  }

  return (
    <div className={Globalclasses.container}>
      <main
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
        <section
          className="mainsection pb-0 langwebapp langMain"
          style={{
            flexGrow: 1,
          }}
        >
          <Grid container className="h-100percent">
            <Grid
              container
              xs={12}
              className="registernav langnav"
              style={{ height: "40px" }}
            >
              <Grid xs={3} className="backimg"></Grid>
              <Grid xs={6} className="text-center">
                <Typography
                  variant="subtitle1"
                  className="regname oneuhcfont user-name"
                >
                  Enter PIN
                </Typography>
              </Grid>
              <Grid xs={3}></Grid>
            </Grid>
            <Grid item xs={0} md={1}></Grid>
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
                </div>
                <div className="langSection">
                  <div className="">
                  <div className="center">
                      <h1>{t("2-Step Verification")}</h1>
                      <h3 class="center">
                        {t("Welcome")}{" "}
                        <span class="username">
                          {sessionUserBoValue
                            ? sessionUserBoValue.displayName
                            : ""}
                        </span>
                      </h3>
                      <p>{t("Enter PIN & Token")}</p>
                    </div>
                    <Form
                      onSubmit={onSubmit}
                      render={({
                        handleSubmit,
                        form,
                        submitting,
                        pristine,
                        values,
                      }) => (
                        <form
                          className="fullWidth noBG"
                          onSubmit={handleSubmit}
                        >
                          <div className="innertabdivreg">
                            <Grid container spacing={3} xs={12} lg={12}>
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Field
                                  name="new-pin"
                                  id="new-pin"
                                  label={t("Please enter your four digit PIN")}
                                  formControlProps={{ className: "my-class" }}
                                  component={InputFieldFF}
                                  type="number"
                                  validate={composeValidators(maxValue(4))}
                                ></Field>
                              </Grid>
                            </Grid>
                            <Grid container spacing={3} xs={12} lg={12}>
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Field
                                  name="new-token"
                                  id="new-token"
                                  label={t("Please enter your token")}
                                  formControlProps={{ className: "my-class" }}
                                  component={InputFieldFF}
                                  type="text"
                                ></Field>
                              </Grid>
                            </Grid>
                          </div>
                          <div className="buttons">
                            <button
                              className="regformsubmitbtn"
                              type="submit"
                              disabled={submitting || pristine}
                            >
                              {t("Submit")}
                            </button>
                          </div>
                          <p className="center">
                            {t("Forgot PIN?")}{" "}
                            <a
                              href="#"
                              className="forgot-pin"
                              onClick={() => resetPin()}
                            >
                              {t("Reset your PIN")}
                            </a>
                          </p>
                        </form>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={0} md={6}></Grid>
          </Grid>
        </section>
      </main>
    </div>
  );
}
//export default EnterPin;
export default connect(null, { setSidebarToggel, setLoginUser })(EnterPin);
