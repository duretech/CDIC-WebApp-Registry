import React, { useState,useEffect } from 'react'
import Globalclasses from "../../App.module.css";
import { apiServices } from '../../services/apiServices'
import OfflineDb from '../../db'
import { useHistory } from "react-router";
import Grid from '@material-ui/core/Grid';
import {
    InputFieldFF, 
    ReactFinalForm} from '@dhis2/ui';
import { useTranslation } from 'react-i18next';
import swal from 'sweetalert'
import { connect } from "react-redux";
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import { setSidebarToggel,setLoginUser } from '../../redux/actions/action'
  
  
//import {Configuration} from '../../assets/data/config'
// import '../../assets/css/customstyles.css'
// import '../../assets/css/theme_grey.css'
// import '../../assets/css/theme_blue.css'
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'


const {Form, Field } = ReactFinalForm

function CheckPin({onSuccess,setSidebarToggel,setLoginUser}){
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [input, setInput] = useState('');
    const [searchResult,setSearchResult] = useState([])
    const [pinType,setPinType] = useState("verify")
    const {t,i18n} = useTranslation()
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
        i18n.changeLanguage(localStorage.getItem("locale"));
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
           if(localStorage.getItem('pinExist') && localStorage.getItem('pinExist') == 'Yes') {
                setPinType('verify')
            }else {
                if(localStorage.getItem('pinSet') && localStorage.getItem('pinSet') == 'Yes') {
                    setPinType('active')
                }else{
                    checkPinExist()
                }
            }
        }
    },[sessionUserBoValue, Configuration])

    function checkPinExist(){
        if(navigator.onLine && sessionUserBoValue && sessionUserBoValue.userCredentials){
            setGlobalSpinner(true)
            apiServices.postAPI('save/mfa/user/check/pinexist', {"username":sessionUserBoValue.username})
            .then(res=>{
                setGlobalSpinner(false)
                if(res && res.data && res.data.status){
                    if(res.data.status == "success"){
                    console.log("pincheck exist");
                    //history.push("/checkPin");
                    }else if(res.data.status == "fail"){
                        swal({
                            title: t("Alert"),
                            text: t("Please re-login, enter the code and set your new pin!"),
                            icon: "error",
                            button: "Ok",
                        }).then(r=>{
                            localStorage.clear()
                            OfflineDb.deleteDatabse().then(res=>{
                                setLoginUser(false)
                            }).catch(err=>{
                                setLoginUser(false)
                            }) 
                        })
                    }
                }else{
                    swal({
                    title: t("Alert"),
                    text: t("Sorry something went wrong, please try again later"),
                    icon: "error",
                    button: t("Close"),
                    })
                }
                
            })
            .catch(err=>{
                console.log("err",err);
                setGlobalSpinner(false)
                swal({
                    title: t("Alert"),
                    text: t("Sorry something went wrong, please try again later"),
                    icon: "error",
                    button: t("Close"),
                    })
            })
        }else{
            //offline
            if(!navigator.onLine){

            }else{
                //userbo not fournd
                localStorage.clear()
                OfflineDb.deleteDatabse().then(res=>{
                    setLoginUser(false)
                }).catch(err=>{
                    setLoginUser(false)
                }) 
            }
        }
    }

    function resetPin(){
        if(navigator.onLine && sessionUserBoValue && sessionUserBoValue.userCredentials){
        console.log("sessionUserBoValue",sessionUserBoValue);
        setGlobalSpinner(true)
        apiServices.postAPI('save/mfa/changestatus', {"status":"1","username":sessionUserBoValue.username,"preflanguage":"en",
        "userid":sessionUserBoValue.userCredentials.id})
        .then(res=>{
            setGlobalSpinner(false)
            if(res && res.data && res.data.status && res.data.status == "success"){
                swal({
                title: t("Success"),
                text: t("Please re-login, enter the code and set your new pin."),
                icon: "success",
                button: "Ok",
                }).then(r=>{
                    localStorage.clear()
                    OfflineDb.deleteDatabse().then(res=>{
                        setLoginUser(false)
                    }).catch(err=>{
                        setLoginUser(false)
                    }) 
                }) 
            }else{
                swal({
                title: t("Alert"),
                text: t("Sorry something went wrong, please try again later"),
                icon: "error",
                button: t("Close"),
                })
            }
            
        })
        .catch(err=>{
            console.log("err",err);
            setGlobalSpinner(false)
            swal({
                title: t("Alert"),
                text: t("Sorry something went wrong, please try again later"),
                icon: "error",
                button: t("Close"),
                })
        })
        }else{
            if(!navigator.onLine){

            }else{
                //userbo not fournd
                localStorage.clear()
                OfflineDb.deleteDatabse().then(res=>{
                    setLoginUser(false)
                }).catch(err=>{
                    setLoginUser(false)
                }) 
            }
        }
    }

    function onSubmit(){
        if(navigator.onLine && sessionUserBoValue && sessionUserBoValue.userCredentials){
            let newPin = document.getElementById("new-pin").value
            if(newPin){
                setGlobalSpinner(true)
                    apiServices.postAPI('save/mfa/user/check/validpin', {"username":sessionUserBoValue.username,"pin":newPin})
                    .then(res=>{
                        setGlobalSpinner(false)
                        if(res && res.data && res.data.status && res.data.status == "success"){
                            console.log("herre");
                            localStorage.setItem('pinEntered',true)
                            //onSuccess()
                            history.push('/layout/home')
                        }else{
                            swal({
                            title: t("Alert"),
                            text: t("You have entered invalid pin!"),
                            icon: "error",
                            button: t("Close"),
                            })
                        }
                        
                    })
                    .catch(err=>{
                        console.log("err",err);
                        setGlobalSpinner(false)
                        swal({
                            title: t("Alert"),
                            text: t("Sorry something went wrong, please try again later"),
                            icon: "error",
                            button: t("Close"),
                            })
                    })

            }else{
                swal({
                    title: t("Alert"),
                    text: t("Please enter Pin"),
                    icon: "alert",
                    button: t("Close"),
                })
            }
        }else{
            if(!navigator.onLine){
                history.push('/layout/home')
            }else{
                //userbo not fournd
                localStorage.clear()
                OfflineDb.deleteDatabse().then(res=>{
                    setLoginUser(false)
                }).catch(err=>{
                    setLoginUser(false)
                }) 
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
            <Grid container spacing={3} className="">
            <Grid item xs={12} sm={12} md={12} className="">
              <div className="innerdiv">
                <p className="zero text-center">
                  <div className="useravtarimg" />
                </p>
                <div className='center'>
                    <h1>{t('2-Step Verification')}</h1>
                    <h3 class="center">{t('Welcome')} <span class="username">{sessionUserBoValue ? sessionUserBoValue.displayName : ''}</span></h3>
                    <p >{pinType == 'verify' ? t('Please enter your PIN to verify your account') : t('Please enter your PIN to active your account')}</p>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} className="">
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
                        </Grid>
                        </div>
                        <div className="buttons">
                            <button className="regformsubmitbtn" type="submit" disabled={submitting || pristine}>
                               {t('Submit')}
                            </button>
                        </div> 
                        <p className="center">{t('Forgot PIN?')} <a href="#" className='forgot-pin' onClick={() => resetPin()}>{t('Reset your PIN')}</a></p>        
                    </form>
                    )}
                />
                </Grid>
            </Grid>
        </section>
        </main>
        </div>
    )
    
}
//export default CheckPin;
export default connect(null, {setSidebarToggel,setLoginUser})(CheckPin);