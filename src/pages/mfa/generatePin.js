import React, { useState,useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import Globalclasses from "../../App.module.css";
import { makeStyles } from '@material-ui/core/styles';
import { apiServices } from '../../services/apiServices'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { InputLabel, Input, Typography } from '@material-ui/core';
import OfflineDb from '../../db'
import { useHistory } from "react-router";
import Grid from '@material-ui/core/Grid';
import {
    Button, 
    ButtonStrip,
    Divider,
    InputFieldFF, 
    SingleSelectFieldFF, 
    ReactFinalForm,
    hasValue,
    InputField,
    CircularLoader,
    CenteredContent
} from '@dhis2/ui';
import { withTranslation, Trans , useTranslation } from 'react-i18next';
import swal from 'sweetalert'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import { handleLanguageAndNavigation } from '../login/handleLanguageAndNavigation';
//import {Configuration} from '../../assets/data/config'
// import '../../assets/css/customstyles.css'
// import '../../assets/css/theme_grey.css'
// import '../../assets/css/theme_blue.css'
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'


const {Form, Field } = ReactFinalForm

function GeneratePin({onSuccess}){
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [input, setInput] = useState('');
    const [searchResult,setSearchResult] = useState([])
    const [token,setToken] = useState("U^hQn$#WY[S2]}D")
    const {t} = useTranslation()
    const history = useHistory();
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [Configuration,setConfiguration] = useState(null);
    const maxValue = (max) => (value) =>
    isNaN(value) || value.length == max ? undefined : `Should not be greater or less than ${max} digit`;

    const composeValidators = (...validators) => (value) =>
    validators.reduce((error, validator) => error || validator(value), undefined);
    async function getMetaData(){
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)

        let configurations = await OfflineDb.getDataFromPouchDB('configurations')
        setConfiguration(configurations.data.configuration)
    }
    useEffect(()=>{
        getMetaData()      
        /*OfflineDb.removeDataFromPouchDB('activeCaseDetails')
        OfflineDb.removeDataFromPouchDB('activeCaseFormData')
        OfflineDb.removeDataFromPouchDB('linkContactFlag')
        OfflineDb.setDataIntoPouchDB('transferFlag', {type:null})
        if(localStorage.getItem('referral-type')){
            localStorage.removeItem('referral-type')
        }*/
    },[])
    
    //once user bco is set call getContactList function
    useEffect(()=>{
        if(sessionUserBoValue != null && Configuration != null){
           //do something here
        }
    },[sessionUserBoValue, Configuration])

    function onSubmit(){
        
        let newPin = document.getElementById("new-pin").value
        let reEnterPin = document.getElementById("verify-pin").value
        if(newPin && reEnterPin){
            if(newPin == reEnterPin){
                //api call
                setGlobalSpinner(true)
                apiServices.postAPI('save/mfa/user/save/pin', {"username":sessionUserBoValue.username,"token":token,"pin":newPin})
                .then(res=>{
                    setGlobalSpinner(false)
                    if(res && res.data && res.data.status && res.data.status == "success"){
                        //history.push('/enterPin')
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
                          localStorage.setItem('pinSet','Yes')
                        })();
                        // onSuccess()
                    }else{
                        swal({
                        title: t("Alert"),
                        text: t("Pin not valid/exist"),
                        icon: "error",
                        button: t("Close"),
                        })
                    }
                    
                })
                .catch(err=>{
                    console.log(err)
                    setGlobalSpinner(false)
                    swal({
                        title: t("Alert"),
                        text: t("Sorry something went wrong, please try again later"),
                        icon: "error",
                        button: t("Close"),
                        })
                })
            }else{
                setGlobalSpinner(false)
                swal({
                    title: t("Alert"),
                    text: t("Pin dit not match, please re-check"),
                    icon: "error",
                    button: t("Close"),
                  })
            }

        }else{
            swal({
                title: t("Alert"),
                text: t("Please enter Pin"),
                icon: "error",
                button: t("Close"),
              })
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
                  Set New PIN
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
                      <p >{t('Create your four digit new PIN.')}</p>
                    </div>
                    <Form onSubmit={onSubmit} render={({ handleSubmit, form, submitting, pristine, values }) => (
                    <form className="fullWidth noBG" onSubmit={handleSubmit}>
                        <div className="innertabdivreg">
                        <Grid container spacing={3} xs={12} lg={12} >
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                            <Field
                                name="new-pin"
                                id="new-pin"
                                label={t("Please enter your four digit PIN")}
                                formControlProps={{className: 'my-class'}}
                                component={InputFieldFF}
                                type='number'
                                validate={composeValidators(maxValue(4))}
                            >
                            </Field>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} >
                            <Field
                                name="verify-pin"
                                id="verify-pin"
                                label={t("Verify your new PIN")}
                                formControlProps={{className: 'my-class'}}
                                component={InputFieldFF}
                                type='number'
                                validate={composeValidators(maxValue(4))}
                            >
                            </Field>
                        </Grid>
                        </Grid>
                        </div>
                        <div className="buttons">
                            <button className="regformsubmitbtn" type="submit" disabled={submitting || pristine}>
                               {t('Submit')}
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
    )
    
}
export default GeneratePin;