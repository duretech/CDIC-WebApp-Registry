
import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";

import classes from '../../App.module.css'
import imgUrl from '../../assets/images/imageUrl.js';
import CustomDrawer from '../../pages/template/CustomDrawer.js'
import Grid from '@material-ui/core/Grid';

import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import {
    Button,
    InputFieldFF,
    ReactFinalForm,
    hasValue,
    CircularLoader,
    CenteredContent
} from '@dhis2/ui';
import { apiServices } from '../../services/apiServices';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import swal from 'sweetalert';

import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import OfflineDb from '../../db'
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'
import { Typography } from '@material-ui/core';

const { Form, Field } = ReactFinalForm

function Login({ onSuccess }) {
    const [showPasswordFlag, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const history = useHistory();
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const {t, i18n} = useTranslation();
    useEffect(() => {
        i18n.changeLanguage('en');
        OfflineDb.getDataFromPouchDB('loginDetails')
            .then(loginDetails => {

                if (loginDetails.data != undefined) {
                    // history.push("/layout/home")
                    onSuccess()
                }
            })
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                OfflineDb.setDataIntoPouchDB('geolocation', { "lat": latitude, "lng": longitude })
                //alert("Geolocation R&D : "+latitude+' : '+longitude);
            }, (error) => {
                // if geolocation denied by user then set default one
                OfflineDb.setDataIntoPouchDB('geolocation', { "lat": 40.712742, "lng": -74.013382 })
                //alert("Geolocation Error : "+error)
            });
        } else {
            // if geolocation denied by user then set default one
            OfflineDb.setDataIntoPouchDB('geolocation', { "lat": 40.712742, "lng": -74.013382 })
        }

    }, [])

    function onSubmit(values) {
        //setLoading(true)
        setGlobalSpinner(true)
        const Authorization = 'Basic ' + btoa(values.username.trim() + ":" + values.password.trim())
        localStorage.setItem('basicAuth', Authorization)
        OfflineDb.setDataIntoPouchDB('basicAuth', Authorization)
        apiServices.loginApi(Authorization).then(res => {
            OfflineDb.setDataIntoPouchDB('loginDetails', res.data)
                .then(a => {
                    apiServices.getAPI('dataStore/configuration/configuration').then(res=>{
                        OfflineDb.setDataIntoPouchDB('configurations',res.data)      
                        setGlobalSpinner(false) 
                        setTimeout(()=>{
                            history.push("/selectlanguage")
                        },500)  
                        
                    }).catch(error => {
                        setGlobalSpinner(false)
                        history.push("/selectlanguage")
                    })
                })

        }).catch(error => {
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
            setGlobalSpinner(false)
        })
    }

    function doForgotPasswordRecoveryCall(username) {
        var bodyFormData = new FormData();
        bodyFormData.append('username', username);
        const url = "account/recovery";
        setLoading(true)
        apiServices.postMultiPartFormDataAPI(url, bodyFormData).then(res => {

            setLoading(false)
            swal({
                title: "Done",
                text: res.data.message,
                icon: "success",
                button: "Close",
            });
        }).catch(err => {
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
            setLoading(false)
        });
    }

    function openForgotPasswordPopup() {

        swal({
            text: 'Please enter username',
            content: "input",
            buttons: ["Cancel", "Submit"]
        }).then(username => {

            if (username) {
                doForgotPasswordRecoveryCall(username);
            }
        })
    }

    function showPassword() {
        if (showPasswordFlag) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }
    const regex = new RegExp("^[a-zA-Z0-9_@.]*$")
    const scriptBlockRegex = new RegExp("/<[^>]*>/g")
    const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
    const required = value => (value ? undefined : 'Required')
    const userCheck = value => (value ? value.match(regex) != null ? undefined : 'Incorrect expression added as input' : undefined)
    const scriptCheck = value => (value ? value.match(scriptBlockRegex) != null ? 'Incorrect expression "< or >" added as input' : undefined : undefined)
    const passWordCheck = value => (value ? value.match(passwordRegex) != null ? undefined : 'Incorrect password pattern' : undefined)
    const composeValidators = (...validators) => value =>
    validators.reduce((error, validator) => error || validator(value), undefined)

    return (

        <div className={classes.container}>
            <main style={{ display: 'flex', height: '100%', width: '100%' }}>
                <section
                    lassName="mainsection pb-0"
                    style={{
                        flexGrow: 1,
                        padding: 12,
                    }}
                >
                    <Grid container spacing={3} className="">
                        <Grid item xs={12} sm={12} md={7} className="loginpageformholder">
                            <div className="innerdiv userwebapp">
                                <p className="zero text-center">
                                    <div className="useravtarimg" />
                                </p>
                                <p className="zero text-center">
                                    <h3 className="text-uppercase">Sign In</h3>
                                </p>
                            </div>
                            <div className='migrantlogin'>
                                
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={5} className="pagelaterpart">
                         <div class="custom-shape-divider-top-1612935135">
                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" class="shape-fill"></path>
                            </svg>
                        </div> 
                            <div className="loginpageformholder">
                                <div className=''>
                                   {/* <div className="useravtarimgapp" /> */}
                                    <Typography variant='h4' className='mb-30px'>Sign In</Typography>
                                </div>
                                {/* <p className="loginformheading">Sign In</p> */}
                                {loading ?
                                    <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
                                        <CircularLoader large dataTest="dhis2-uicore-circularloader" />
                                    </CenteredContent>
                                    : ""
                                }
                                <Form
                                autocomplete="off"
                                    onSubmit={values => onSubmit(values, null, 2)}
                                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                                        <form onSubmit={handleSubmit} autocomplete="off" style={{display: 'contents'}}>
                                            <div className="w-100">
                                            <Field
                                                name='username'
                                                label='User Name'
                                                component={InputFieldFF}
                                                key='username'
                                                validate={composeValidators(required,userCheck, scriptCheck)}
                                                required
                                                />
                                                </div>
                                            <div className="w-100">
                                                <Field
                                                    name='password'
                                                    label='Password'
                                                    component={InputFieldFF}
                                                    key='password'
                                                    validate={composeValidators(required,scriptCheck, passWordCheck)}
                                                    required
                                                    className={showPasswordFlag ? "" : 'password'}

                                                />
                                                <p className="visibilityiconcontainer">
                                                    {!showPasswordFlag ? <VisibilityIcon onClick={() => showPassword()} /> :
                                                        <VisibilityOffIcon onClick={() => showPassword()} />}
                                                </p>
                                            </div>
                                            <p className="forgotpw" style={{ cursor: "pointer" }} onClick={() => openForgotPasswordPopup()}>Forgot Password?</p>
                                            <div className="buttons">
                                                <Button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="loginbtn loginsubmitbtn"
                                                >
                                                    Login
                                        </Button>
                                            &nbsp;
                                        <Button
                                                    type="button"
                                                    onClick={form.reset}
                                                    disabled={submitting || pristine}
                                                    className="resetButton"
                                                >
                                                    Reset
                                        </Button>
                                            </div>
                                        </form>
                                    )}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </section>
            </main>
        </div>
    )
}



export default Login;

