
import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";

import classes from '../../App.module.css'
import { useTranslation } from "react-i18next";

import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'

import { Configuration } from '../../assets/data/config.js';

import {
    Button,
    InputFieldFF,
    ReactFinalForm,
    hasValue
} from '@dhis2/ui';
import { apiServices } from '../../services/apiServices';

import swal from 'sweetalert';

import OfflineDb from '../../db'
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'

import { setLoginUser } from "../../redux/actions/action";


const { Form, Field } = ReactFinalForm

export default function Settings() {
    const history = useHistory();

    const [showPasswordFlag, setShowPassword] = React.useState(false)
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [isProcessing, setIsProcessing] = React.useState(false)

    const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);

    async function getUserBo() {
        let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
        setSessionUserBoValue(loginDetails.data);
    }
    useEffect(() => {
        getUserBo();
    }, []);
    const { t, i18n } = useTranslation();

    function onSubmit(values) {
        setGlobalSpinner(true)
        apiServices.putAPI('31/me/changePassword', values).then(res => {
            setGlobalSpinner(false)
            swal({
                title: "Password Changed!",
                text: 'You can now login with your new password',
                icon: "success",
                button: "Close",
            }).then(res => {
                 // disable submit button once user presses Close
                setIsProcessing(true)
                setGlobalSpinner(true)
                apiServices.postAPI('dashboardIndicator/updatePasswordFlag', { "username": sessionUserBoValue.username, "passwordFlag": "true" }).then(res => {
                    console.log(res, "passwordFlag")
                })
                apiServices.getAPIWithDomain('dhis-web-commons-security/logout.action').then((result) => {

                }).catch((err) => {

                });
                setTimeout(() => {
                    OfflineDb.deleteDatabse().then(res => {
                        // window.location.reload();

                        setLoginUser(false)
                        localStorage.clear();
                        sessionStorage.clear();
                        const redirectLink = document.createElement('a');

                       // redirectLink.href = Configuration.baseUrl + Configuration.basename;
                        const runtime = window.RUNTIME_CONFIG || {};
                        const baseUrl = runtime.baseUrl;
                        const basename = runtime.basename;
                        redirectLink.href = baseUrl + basename;
                        redirectLink.click();

                        // window.location.href = "cdicss"
                        // history.replace("/login");
                        // history.go(0)
                        // window.location.reload();
                    }).catch(err => {

                        setLoginUser(false)
                        localStorage.clear();
                        sessionStorage.clear();
                        const redirectLink = document.createElement('a');
                        //redirectLink.href = Configuration.baseUrl + Configuration.basename;
                        const runtime = window.RUNTIME_CONFIG || {};
                        const baseUrl = runtime.baseUrl;
                        const basename = runtime.basename;
                        redirectLink.href = baseUrl + basename;
                        redirectLink.click();

                        // window.location.replace = "/cdicss"
                        // window.location.href = "cdicss"
                        // window.location.reload();
                        // history.replace("/login");
                        // history.go(0)
                        // window.location.reload();
                    })
                }, 1000);
            });

        }).catch(error => {
            if (error.response) {

                swal({
                    title: "Reset password",
                    text: error.response.data.message,
                    icon: "error",
                    button: "Close",
                });
            } else {
                swal({
                    title: "Reset password",
                    text: "",
                    icon: "error",
                    button: "Close",
                });
            }
            setGlobalSpinner(false)
        })
    }


    function showPassword() {
        if (showPasswordFlag) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    function passwordField() {
        var mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
        const required = value => (value ? undefined : t("Please provide a value"))
        const scriptCheck = value => (value ? value.match(mediumRegex) != null ? undefined : t("Password should contain at least one numeric digit, one uppercase, one lowercase letter and one special character") : undefined)
        const composeValidators = (...validators) => value =>
            validators.reduce((error, validator) => error || validator(value), undefined)

        return (
            <Field
                name='newPassword'
                label={t('New Password')}
                component={InputFieldFF}
                key='newPassword'
                validate={composeValidators(required, scriptCheck)}
                required
                className={showPasswordFlag ? "newpassword" : 'newpassword password'}

            />
        )
    }
        var mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
        const required = value => (value ? undefined : t("Please provide a value"))
        const scriptCheck = value => (value ? value.match(mediumRegex) != null ? undefined : t("Password should contain at least one numeric digit, one uppercase, one lowercase letter and one special character") : undefined)
        const composeValidators = (...validators) => value =>
            validators.reduce((error, validator) => error || validator(value), undefined)

    return (

        <div className={classes.container}>
            <main style={{ display: 'flex', height: '100%', width: '100%' }}>
                <section className="loginpagemainsection" style={{ backgroundColor: '#fff', flexGrow: 1, padding: 20, borderLeft: '1px solid white', }}>
                    <div className="loginformholder">
                    <p className="loginformheading">{t("Reset Password")}</p>

                        <Form
                            onSubmit={values => onSubmit(values, null, 2)}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <form onSubmit={handleSubmit}>

                                    <Field
                                        name='oldPassword'
                                        label={t('Existing Password')}
                                        component={InputFieldFF}
                                        key='oldPassword'
                                        validate={composeValidators(required, scriptCheck)}
                                        required
                                        className={'newpassword password'}
                                    />
                                    <div>
                                        {passwordField()}

                                        {/* <p className="visibilityiconcontainer">
                                    {!showPasswordFlag ? <VisibilityIcon onClick={() => showPassword()} /> :
                                    <VisibilityOffIcon onClick={() => showPassword()} />}
                                    </p> */}
                                    </div>

                                    <div className="buttons setting-reset">
                        <Button
                            type="submit"
                            disabled={submitting || isProcessing}   // disable when loader is on
                            className="loginbtn"
                        >
                            {t("Submit")}
                        </Button>
                    </div>
                                </form>
                            )}
                        />
                    </div>
                </section>
            </main>
        </div>
    )
}


