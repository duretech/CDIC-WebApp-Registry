import React, { useState, useEffect } from "react";
import Globalclasses from "../../App.module.css";
import { apiServices } from "../../services/apiServices";
import { Typography } from "@material-ui/core";
import OfflineDb from "../../db";
import { useHistory } from "react-router";
import Grid from "@material-ui/core/Grid";
import {
  InputFieldFF,
  ReactFinalForm,
} from "@dhis2/ui";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
//import {Configuration} from '../../assets/data/config'
// import '../../assets/css/customstyles.css'
// import '../../assets/css/theme_grey.css'
// import '../../assets/css/theme_blue.css'
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'
import { decryptData } from "../../imon/encryption/AesEnc";
const { Form, Field } = ReactFinalForm;

function EnterToken() {
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [token, setToken] = useState("SAVECHILD");
  const { t } = useTranslation();
  const history = useHistory();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const [Configuration, setConfiguration] = useState(null);
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

  function onSubmit() {
    let tokenValue = document.getElementById("enter-code").value;
    console.log("here", token, tokenValue);
    if (tokenValue) {
      setGlobalSpinner(true);
      apiServices
        .postAPI("save/mfa/user/validate/token", {
          username: sessionUserBoValue.username,
          token: tokenValue,
        })
        .then((res) => {
          console.log("res", res);
          res.data = decryptData(res.data)
          setGlobalSpinner(false);
          if (
            res &&
            res.data &&
            res.data.status &&
            res.data.status == "success"
          ) {
            history.push("/generatePin");
          } else {
            swal({
              title: t("Alert"),
              text: t("You have entered invalid code!"),
              icon: "error",
              button: t("Close"),
            });
          }
        })
        .catch((err) => {
          setGlobalSpinner(false);
          swal({
            title: t("Alert"),
            text: t("Sorry something went wrong, please try again later"),
            icon: "error",
            button: t("Close"),
          });
        });
    } else {
      swal({
        title: t("Alert"),
        text: t("Please enter the code"),
        icon: "error",
        button: t("Close"),
      });
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
                  Enter Token
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
                <div className="loginlang"></div>
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
                                  name="enter-code"
                                  id="enter-code"
                                  label={t("Enter account activation code")}
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
export default EnterToken;
