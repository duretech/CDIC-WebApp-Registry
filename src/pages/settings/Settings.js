import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import classes from '../../App.module.css'
import { useTranslation } from 'react-i18next'

import '../../assets/css/customstyles.css'
import '../../assets/css/theme_blue.css'

import { Configuration } from '../../assets/data/config.js'

import { Button, InputField, ReactFinalForm } from '@dhis2/ui'

import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { apiServices } from '../../services/apiServices'
import swal from 'sweetalert'

import OfflineDb from '../../db'
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'

import { setLoginUser } from '../../redux/actions/action'

const { Form, Field } = ReactFinalForm

export default function Settings() {
    const history = useHistory()
    const { t } = useTranslation()
    const runtime = window.RUNTIME_CONFIG || {};
    let basicAuth = runtime.basicAuth; // fallback
    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    const [isProcessing, setIsProcessing] = React.useState(false)
    const [showOldPassword, setShowOldPassword] = React.useState(false)
    const [showNewPassword, setShowNewPassword] = React.useState(false)

    const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null)

    async function getUserBo() {
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)
    }

    useEffect(() => {
        getUserBo()
    }, [])

    // ------------------------
    // Inline styles
    // ------------------------
    const fieldBlockStyle = {
        marginBottom: 18,
    }

    const errorTextStyle = {
        color: '#d32f2f',
        fontSize: 12,
        lineHeight: '16px',
        marginTop: 6,
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
    }

    // Wraps InputField + overlaid eye button
    const inputWrapperStyle = {
        position: 'relative',
        width: '100%',
    }

    // Eye button sits inside the input box on the right
    const eyeInsideStyle = {
        position: 'absolute',
        right: 20, 
        bottom: 8,          // aligns with input box (below DHIS2 label)
        height: 28,
        width: 28,
        padding: 0,
        marginRight:5,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6c757d',
        zIndex: 1,
    }

    // ------------------------
    // Validations (unchanged)
    // ------------------------
    const mediumRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})')
    const required = value => (value ? undefined : t('Please provide a value'))
    const scriptCheck = value =>
        value
            ? value.match(mediumRegex) != null
                ? undefined
                : t('Password should contain at least one numeric digit, one uppercase, one lowercase letter and one special character')
            : undefined
    const composeValidators =
        (...validators) =>
        value =>
            validators.reduce((error, validator) => error || validator(value), undefined)

    // ------------------------
    // Submit handler (unchanged)
    // ------------------------
    function onSubmit(values) {
        setGlobalSpinner(true)

        apiServices
            .putAPI('31/me/changePassword', values)
            .then(res => {
                setGlobalSpinner(false)

                swal({
                    title: 'Password Changed!',
                    text: 'You can now login with your new password',
                    icon: 'success',
                    button: 'Close',
                }).then(() => {
                    setIsProcessing(true)
                    setGlobalSpinner(true)

                    apiServices
                        .resetPasswordApi(basicAuth, {
                            username: sessionUserBoValue?.username,
                            passwordFlag: 'true',
                        })
                        .then(r => {
                            console.log(r, 'passwordFlag')
                        })

                    apiServices.getAPIWithDomain('dhis-web-commons-security/logout.action').catch(() => {})

                    setTimeout(() => {
                        OfflineDb.deleteDatabse()
                            .then(() => {
                                setLoginUser(false)
                                localStorage.clear()
                                sessionStorage.clear()

                                const redirectLink = document.createElement('a')
                                const runtime = window.RUNTIME_CONFIG || {}
                                const baseUrl = runtime.baseUrl || 'https://cdicuat.imonitorplus.com/'
                                const basename = runtime.basename || 'cdicv2'
                                redirectLink.href = baseUrl + basename
                                //redirectLink.click()
                               if (window.location.hostname.includes('localhost')) {
                                    try {
                                        const path = window.location.href.split('cdicv2')
                                        const basePath = path?.[0] ?? window.location.origin + '/'
                                        window.location.href = basePath + (runtime.basename || 'cdicv2')
                                    } catch (error) {
                                        console.error('Redirect error on localhost:', error)
                                        window.location.reload() // fallback
                                    }
                                } else {
                                    try {
                                        redirectLink.href = baseUrl + basename
                                        redirectLink.click()
                                    } catch (error) {
                                        console.error('Redirect error:', error)
                                        window.location.href = baseUrl + basename // fallback
                                    }
                                }
                            })
                            .catch(() => {
                                setLoginUser(false)
                                localStorage.clear()
                                sessionStorage.clear()

                                const redirectLink = document.createElement('a')
                                const runtime = window.RUNTIME_CONFIG || {}
                                const baseUrl = runtime.baseUrl || 'https://cdicuat.imonitorplus.com/'
                                const basename = runtime.basename || 'cdicv2'
                                redirectLink.href = baseUrl + basename
                                redirectLink.click()
                            })
                    }, 1000)
                })
            })
            .catch(error => {
                setGlobalSpinner(false)

                if (error.response) {
                    swal({
                        title: 'Reset password',
                        text: error.response.data.message,
                        icon: 'error',
                        button: 'Close',
                    })
                } else {
                    swal({
                        title: 'Reset password',
                        text: '',
                        icon: 'error',
                        button: 'Close',
                    })
                }
            })
    }

    // ------------------------
    // Reusable field renderer — eye icon INSIDE the field
    // ------------------------
const renderPasswordField = ({ name, label, show, toggleShow }) => (
    <Field name={name} validate={composeValidators(required, scriptCheck)}>
        {({ input, meta }) => {
            const showError = meta.touched && meta.error

            return (
                <div style={fieldBlockStyle}>
                    <div style={{ position: 'relative' }}>
                        <InputField
                            label={label}
                            required
                            name={input.name}
                            value={input.value}
                            onChange={({ value }) => input.onChange(value)}
                            onBlur={input.onBlur}
                            onFocus={input.onFocus}
                            type={show ? 'text' : 'password'}
                            // Do NOT pass error prop — prevents DHIS2 from rendering
                            // the internal exclamation icon that shrinks input width
                            // We handle error styling ourselves below
                        />

                        <button
                            type="button"
                            onClick={toggleShow}
                            aria-label={`toggle ${name} visibility`}
                            style={eyeInsideStyle}
                        >
                            {show
                                ? <Visibility style={{ fontSize: 18, color: '#6c757d' }} />
                                : <VisibilityOff style={{ fontSize: 18, color: '#6c757d' }} />
                            }
                        </button>
                    </div>

                    {/* Our own error text — replaces DHIS2's internal validation display */}
                    {showError
                        ? <div style={errorTextStyle}>{meta.error}</div>
                        : null
                    }
                </div>
            )
        }}
    </Field>
)


    return (
        <div className={classes.container}>
            <main style={{ display: 'flex', height: '100%', width: '100%' }}>
                <section
                    className="loginpagemainsection"
                    style={{ backgroundColor: '#fff', flexGrow: 1, padding: 20, borderLeft: '1px solid white' }}
                >
                    <div className="loginformholder">
                        <p className="loginformheading">{t('Reset Password')}</p>

                        <Form
                            onSubmit={values => onSubmit(values, null, 2)}
                            render={({ handleSubmit, submitting }) => (
                                <form onSubmit={handleSubmit}>
                                    {renderPasswordField({
                                        name: 'oldPassword',
                                        label: t('Existing Password'),
                                        show: showOldPassword,
                                        toggleShow: () => setShowOldPassword(v => !v),
                                    })}

                                    {renderPasswordField({
                                        name: 'newPassword',
                                        label: t('New Password'),
                                        show: showNewPassword,
                                        toggleShow: () => setShowNewPassword(v => !v),
                                    })}

                                    <div className="buttons setting-reset">
                                        <Button type="submit" disabled={submitting || isProcessing} className="loginbtn">
                                            {t('Submit')}
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
