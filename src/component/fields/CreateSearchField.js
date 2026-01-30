import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { HideCheckboxOptions } from '../../assets/data/hideCheckboxOnCondition'
import {
    formValues, setTabHideValues
} from '../../redux/actions/action';
import { isEmpty, isString } from '../../helper/index'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import _ from 'lodash';
import {
    Button,
    ButtonStrip,
    InputFieldFF,
    SingleSelectFieldFF,
    ReactFinalForm,
    SwitchFieldFF,
    hasValue,
    TextAreaFieldFF,
    composeValidators,
    dhis2Username,
    FieldGroupFF,
    CheckboxFieldFF,
} from '@dhis2/ui';

import {
    TextField,
    Checkboxes,
    Radios,
    TimePicker,
    Switches,
    KeyboardDatePicker,
    DatePicker,
    DateTimePicker,
    Autocomplete,

} from 'mui-rff';

import OUFieldConfig from './OUFieldConfig';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import moment from "moment";

import { apiServices } from '../../services/apiServices';
import HideShowCondition from '../validation/HideShowConditionRegistration'
import AssignCondition from '../validation/AssignRegistration'
import ShowErrorRegistration from '../validation/showError/ShowErrorRegistration'

import Validator from '../validation/validator/Validator'

import Grid from '@material-ui/core/Grid';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import Geocode from "react-geocode";
import OUMapping from '../../assets/data/registerOU'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import FormLabel from '@material-ui/core/FormLabel';

import { Checkbox as MuiCheckbox } from '@material-ui/core';

import SearchLocationInput from './SearchLocationInput'

import imgUrl from '../../assets/images/imageUrl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faTimes } from "@fortawesome/free-solid-svg-icons";
import QrReader from 'react-qr-reader'
import { ta } from 'date-fns/locale';
import { withTranslation, Trans , useTranslation } from 'react-i18next';
import { shouldIncludeCustomFieldObj,getDateFormat} from '../../config/validationutils';
import { APP_LOCALE } from "../../assets/data/config";

const { Form, Field, FormSpy } = ReactFinalForm




const ValidatorComponent = (fieldId, attribute, values, form, rules, field) => {

    let programRules = rules.programRule
    let programRulesVariables = rules.programRuleVariable

    let filteringRuleWithField = null
    let Flag = null
    let val = null
    let conditionArray = []
    let programRuleActionType = null
    let hideShow = true
    let assign
    programRules.map(rules => {
        filteringRuleWithField = rules.programRuleActions.filter(obj => obj.trackedEntityAttribute ? fieldId == obj.trackedEntityAttribute.id : undefined)

        if (filteringRuleWithField.length > 0) {


            switch (filteringRuleWithField[0].programRuleActionType) {
                case 'HIDEFIELD':
                    hideShow = HideShowCondition(rules, programRulesVariables, values, field)
                    break;

                case 'ASSIGN':
                    assign = AssignCondition(
                        rules,
                        programRulesVariables,
                        values,
                        field,
                        fieldId,
                        attribute,
                        filteringRuleWithField

                    );
                    // <AssignCondition fieldId={fieldId} rules={rules} programRulesVariables={programRulesVariables} values={values} field={field} filteringRuleWithField={filteringRuleWithField}/>
                    break;

                // case 'SHOWERROR':

                //     programRuleActionType = ShowErrorRegistration(rules, programRulesVariables, values, field, fieldId, attribute)
                // break;
            }

        }
    })

    return ({
        'hideShow': hideShow,
        'assign': assign
    })

};

const getTranslatedLabels = (attribute) => {
    
    if (localStorage.getItem("locale") == "en") {
        let label = attribute.translations.filter(tanslation => tanslation.property == "NAME" && tanslation.locale == localStorage.getItem("locale"))
        if (label.length > 0) {
            return label[0].value;
        } else {
            return attribute.formName ? attribute.formName : attribute.displayName ? attribute.displayName : attribute.description;
        }    
    } else if (attribute.translations && attribute.translations.length > 0) {
        //debugger;
        let label = attribute.translations.filter(tanslation => tanslation.property == "NAME" && tanslation.locale == localStorage.getItem("locale"))
        if (label.length > 0) {
            return label[0].value;
        } else {
            return  attribute.formName ? attribute.formName : attribute.displayName ? attribute.displayName : attribute.description;
        }
    }
return  attribute.formName ? attribute.formName : attribute.displayName ? attribute.displayName : attribute.description;
};

function InputFieldConfig(props) {
    const {t} = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    let customfieldobj = props.customfieldobj

    const [fieldType, setFieldType] = useState(null)
    const [optionSet, setOptions] = useState(null)
    const [icons, setIcons] = useState(null)
    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)
    const requiredPhoneCode = value => (fieldData.mandatory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    const required = value => (fieldData.mandatory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    const numberFormat = value => isNaN(value) && value ? t(`Incorrect format`) : undefined
    const maxLength = max => value => value ? isNaN(value) || value.length != max ? t('Should be') + ' ' + max + ' ' + 'digits': undefined : undefined
    const scriptCheck = value => (value ? value.match(/<[^>]*>/g) != null ? t('Incorrect expression "< or >" added as input') : undefined : undefined)
    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)
    let maxLengthValidation = 10;
    let customProps = { className: customClassName }

    function findFieldType() {
        const trackedEntityAttribute = fieldData.trackedEntityAttribute
        if (trackedEntityAttribute.optionSet != undefined) {
            if (fieldData.renderOptionsAsRadio || 
                (fieldData.renderType && fieldData.renderType['DESKTOP'] &&
                fieldData.renderType['DESKTOP'].type &&
                fieldData.renderType['DESKTOP'].type == 'HORIZONTAL_RADIOBUTTONS')) {
                setFieldType('radio')
            } else {
                if (fieldData.renderType) {
                    if (fieldData.renderType.DESKTOP) {
                        if (fieldData.renderType.DESKTOP.type == "ICONS_AS_BUTTONS") {
                            setFieldType('radio')
                        } else {
                            setFieldType('dropdown')
                        }
                    }
                }
            }
        } else {
            setFieldType('text')
        }
        
    }

    const getDefaultCountryCode = (arr) => {
        // Check if the array is null, undefined, or not an array
          if (!Array.isArray(arr)) {
              return null;
          }
    
          // Iterate through the array to find the entry with name 'countryCode'
          for (let i = 0; i < arr.length; i++) {
              if (arr[i].attribute && arr[i].attribute.description === 'countryCode') {
                  return arr[i].value;
              }
          }
    
          // Return null if no matching entry is found
          return null;
      }

    function fetchOption() {
        let output = []
        const trackedEntityAttribute = fieldData.trackedEntityAttribute
        if (trackedEntityAttribute.optionSet != undefined) {
            trackedEntityAttribute.optionSet.options.map((items, index) => {
                if (icons.length > 0) {
                    output.push({ 'value': items.code, 'label': <> <span dangerouslySetInnerHTML={{ __html: icons[index] }} /> <>{getTranslatedLabels(items)} </>  </> })
                } else {
                    output.push({ 'value': items.code, 'label': getTranslatedLabels(items) })
                }
            })

        }
        if (output.length > 0) {
            setOptions(output)
        }
    }

    function getIcons() {
        let promises = [];
        const trackedEntityAttribute = fieldData.trackedEntityAttribute
        if(navigator.onLine){
            if (trackedEntityAttribute.optionSet != undefined) {
                trackedEntityAttribute.optionSet.options.forEach((options) => {
                    if (options.style != undefined) {
    
                        const getIconApi = 'icons/' + options.style.icon + '/icon.svg'
                        promises.push(apiServices.getAPI(getIconApi))
                    } else {
                        promises.push({})
                    }
                })
    
                Promise.all(promises).then((responses) => {
    
                    const icons = responses.map((response) => response.data)
    
                    if (icons.length > 0) {
                        setIcons(icons)
                    } else {
                        setIcons([])
                    }
                })
            } else {
                setIcons([])
            }
        }else{
            setIcons([])
        }
    }

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        getIcons()
    }, [])

    useEffect(() => {
        if (Array.isArray(icons)) {
            findFieldType()
            fetchOption()
            fetchValidation()
        }

    }, [icons,localStorage.getItem("locale")])

    useEffect(() => {
        if (validationResult != null && fieldType != null) {
            if (customfieldobj.regPhoneNumberCodeId == fieldData.trackedEntityAttribute.id
                || customfieldobj.patientContactNumberCodeId == fieldData.trackedEntityAttribute.id
                || customfieldobj.additionalPatientCodeId == fieldData.trackedEntityAttribute.id
                || customfieldobj.parentContactNumberCodeId == fieldData.trackedEntityAttribute.id) {
                customProps = {
                    ...customProps,
                    className: "hide"
                }
            } //search field section
            if (fieldType == "text") {
                const formatWithDashes = (value) => {
          // Remove all non-numeric characters
          let digitsOnly = value.replace(/\D/g, '');

          // Apply format: XXXXX-XXXXXXX-X (5 digits, 7 digits, 1 digit)
          let formatted = '';
          
          if (digitsOnly.length > 0) {
              formatted = digitsOnly.substring(0, 5); // First 5 digits
          }
          if (digitsOnly.length > 5) {
              formatted += '-' + digitsOnly.substring(5, 12); // Next 7 digits
          }
          if (digitsOnly.length > 12) {
              formatted += '-' + digitsOnly.substring(12, 13); // Last 1 digit
          }
          
          return formatted;
        };
                setFieldStructure(
                    <Grid item xs={12} sm={6} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                        <Field
                            name={fieldData.trackedEntityAttribute.id}
                            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                            type={'text'}
                            component={InputFieldFF}
                            key={fieldData.trackedEntityAttribute.id}
                            // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                            validate={composeValidators(scriptCheck)} //fieldData.mandatory && validationResult.hideShow == true ? hasValue : false
                            value=''
                            className={customClassName}
                            format={value => 
                                              {
                                                  if (APP_LOCALE== "CC005" && fieldData.trackedEntityAttribute.id === customfieldobj.nationalIdNumber && value) {
                                                      return formatWithDashes(value);
                                                  }
                                                  return value; // Normal behavior for other fields
                                                }}
                        />
                    </Grid>
                )
            } else if (fieldType == "radio") {
                setFieldStructure(
                    <Grid item xs={12} sm={6} md={4}  className={validationResult.hideShow == true ? customClassName : 'hide'}>
                        <Radios
                            id={fieldData.trackedEntityAttribute.id}
                            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                            name={fieldData.trackedEntityAttribute.id}
                            // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                            data={optionSet != null ? optionSet : []}
                        // defaultValue={defaultValue}
                        />
                    </Grid>
                )

            } else if (fieldType == "dropdown") {
                const defaultValue = getDefaultCountryCode(props.programData.attributeValues);
                
                setFieldStructure(
                    <Grid item xs={12} sm={6} md={4} className={validationResult.hideShow == true ? 'prefixField' : 'hide'}>
                        {customfieldobj.regPhoneNumberCodeId == fieldData.trackedEntityAttribute.id ?
                            <>
                            <Field
                                //   disabled
                                label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                                name={customfieldobj.regPhoneNumberCodeId}
                                className='disno'
                                type="dropdown"
                                component={SingleSelectFieldFF}
                                key={customfieldobj.regPhoneNumberCodeId}
                                options={optionSet != null ? optionSet : []}
                                // initialValue={defaultValue}
                                // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                                // validate={composeValidators(requiredPhoneCode)}
                                customClassName={customClassName}
                                disabled={fieldData.trackedEntityAttribute.attributeValues && fieldData.trackedEntityAttribute.attributeValues.length > 0 ? fieldData.trackedEntityAttribute.attributeValues[0].attribute.name == 'isDisabled' && fieldData.trackedEntityAttribute.attributeValues[0].value == "true" ? true : false : false}
                            />
                             <Field
                                name={customfieldobj.patientContactNumber}
                                label={t("Patient Contact Number")}
                                type={'number'}
                                component={InputFieldFF}
                                key={customfieldobj.patientContactNumber}
                                // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                                // validate={composeValidators(required, numberFormat)}
                                className={customClassName}
                            />
                            </>
                            : 
                            <></>
                        }

                        <Field
                            id={fieldData.trackedEntityAttribute.id}
                            name={fieldData.trackedEntityAttribute.id}
                            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                            // type={fieldData.trackedEntityAttribute.valueType}

                            component={SingleSelectFieldFF}
                            key={fieldData.trackedEntityAttribute.id}
                            // validate= {fieldData.mandatory && validationResult.hideShow == true ? hasValue: false}
                            // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                            options={optionSet != null ? optionSet : []}
                            // disabled={fieldData.trackedEntityAttribute.attributeValues && fieldData.trackedEntityAttribute.attributeValues.length > 0 ? fieldData.trackedEntityAttribute.attributeValues[0].attribute.name == 'isDisabled' ? true : false : false}
                            className={customClassName}
                            {...customProps}
                        // onChange={() => this.onDropdownOptionChange(attribute.trackedEntityAttribute)}
                        />
                    </Grid>
                )
            }
        }


    }, [fieldType, optionSet, validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function DateFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let showYear = fieldData.trackedEntityAttribute.attributeValues.length > 0 && fieldData.trackedEntityAttribute.attributeValues[0].attribute.name == "showyear" ? true : false
    const [fieldStructure, setFieldStructure] = useState(null)
    const [selectedDate, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        const shouldFormat = shouldIncludeCustomFieldObj('createsearchfield');
        const dateFormat = getDateFormat('dateformat');
        if (validationResult != null) {
            // if (values[fieldData.trackedEntityAttribute.id]) {
            //     values[fieldData.trackedEntityAttribute.id] = moment(values[fieldData.trackedEntityAttribute.id]).format('YYYY-MM-DD')
            // }
            if (shouldFormat && values[fieldData.trackedEntityAttribute.id]) {
                // Format the date only if 'shouldFormat' is true
                values[fieldData.trackedEntityAttribute.id] = moment(values[fieldData.trackedEntityAttribute.id]).format('YYYY-MM-DD');
            }
            
            setFieldStructure(
                <Grid item xs={12} sm={6} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <DatePicker

                        disabled={showYear ? true : false}
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        name={fieldData.trackedEntityAttribute.id}
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        dateFunsUtils={DateFnsUtils}
                        // value={values[fieldData.trackedEntityAttribute.id] == undefined ? selectedDate :  moment(values[fieldData.trackedEntityAttribute.id]).format('YYYY-MM-DD')}
                        margin="normal"
                        variant="inline"
                        format={showYear == true ? "yyyy" : dateFormat}
                        views={showYear ? ["year"] : ["year", "month", "date"]}
                        openTo={showYear ? "year" : "date"}
                        //validate={selectedDate.mandatory && validationResult.hideShow == true ? hasValue : false}
                        disableFuture={fieldData.allowFutureDate ? fieldData.allowFutureDate : false}
                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )

}

function DateTimeFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let showYear = fieldData.trackedEntityAttribute.attributeValues.length > 0 && fieldData.trackedEntityAttribute.attributeValues[0].attribute.name == "showyear" ? true : false
    const [fieldStructure, setFieldStructure] = useState(null)
    const [selectedDate, setDate] = useState(new Date());
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <DateTimePicker
                        disabled={showYear ? true : false}
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        name={fieldData.trackedEntityAttribute.id}
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        dateFunsUtils={DateFnsUtils}
                        value={values[fieldData.trackedEntityAttribute.id] == undefined ? selectedDate : values[fieldData.trackedEntityAttribute.id]}
                        margin="normal"
                        variant="inline"
                        format={showYear == true ? "yyyy" : "yyyy-MM-dd"}
                        views={showYear ? ["year"] : ["year", "month", "date"]}
                        openTo={showYear ? "year" : "date"}
                        //validate={selectedDate.mandatory && validationResult.hideShow == true ? hasValue : false}
                        disableFuture={fieldData.allowFutureDate ? fieldData.allowFutureDate : false}
                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )

}

function AgeFieldConfig(props) {
    const {t} = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values

    const required = value => (fieldData.mandatory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    const mustBeNumber = value => (isNaN(value) && value ? t('Must be a number') : undefined)
    const minValue = min => value =>
        isNaN(value) || value >= min ? undefined : t('Should be greater than')+' '+min
    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.trackedEntityAttribute.id}
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        type="number"
                        component={InputFieldFF}
                        key={fieldData.trackedEntityAttribute.id}
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(mustBeNumber)}
                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function PhoneNumberFieldConfig(props) {
    const {t} = useTranslation()

    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customfieldobj = props.customfieldobj
    let customClassName = props.customClassName
    let customProps = {}
    let maxLengthValidation = 10; 
    const countryCodes = ["+237", "+251", "+224"]; 
    if (values && 
        values[customfieldobj.regPhoneNumberCodeId] && 
        customfieldobj.patientContactNumber == fieldData.trackedEntityAttribute.id 
        && countryCodes.includes(values[customfieldobj.regPhoneNumberCodeId])) 
        { 
            maxLengthValidation = 9;
        } 
    if (values 
        && values[customfieldobj.patientContactNumberCodeId] && 
        customfieldobj.regPhoneNumberId == fieldData.trackedEntityAttribute.id && 
        countryCodes.includes(values[customfieldobj.patientContactNumberCodeId])) 
        { 
            maxLengthValidation = 9; 
        } 
    if (values 
        && values[customfieldobj.additionalPatientCodeId] && 
        customfieldobj.additionalPatientNumber  == fieldData.trackedEntityAttribute.id && 
        countryCodes.includes(values[customfieldobj.additionalPatientCodeId])) 
        { 
            maxLengthValidation = 9; 
        } 
    if (values && values[customfieldobj.parentContactNumberCodeId] &&
        customfieldobj.parentContactNumber == fieldData.trackedEntityAttribute.id && 
        countryCodes.includes(values[customfieldobj.parentContactNumberCodeId])) 
        { 
            maxLengthValidation = 9; 
        }
    const numberFormat = value =>
        isNaN(value) && value ? t('Incorrect format') : undefined

    const maxLength = max => value => value ? isNaN(value) || value.length != max ? t('Should be') + ' ' + max + ' ' + 'digits': undefined : undefined
    const required = value => (fieldData.mandatory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    const requiredPhoneCode = value => (fieldData.mandatory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)

    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        if (validationResult != null) {
            if (customfieldobj.patientContactNumber == fieldData.trackedEntityAttribute.id
                || customfieldobj.regPhoneNumberId == fieldData.trackedEntityAttribute.id
                || customfieldobj.parentContactNumber == fieldData.trackedEntityAttribute.id
                || customfieldobj.additionalPatientNumber == fieldData.trackedEntityAttribute.id) {
                customProps = {
                    ...customProps,
                    className: "hide"
                }
            }
           
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}{...customProps}>
                    <Field
                        name={fieldData.trackedEntityAttribute.id}
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        type={'number'}
                        component={InputFieldFF}
                        key={fieldData.trackedEntityAttribute.id}
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                       // validate={composeValidators(numberFormat, maxLength(9))}
                       validate={composeValidators(numberFormat)}
                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])
   
    return (
        
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function EmailFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values

    const EMAIL_ADDRESS_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

    const invalidEmailMessage = 'Please provide a valid email address'

    const email = value =>
        isEmpty(value) || (isString(value) && EMAIL_ADDRESS_PATTERN.test(value))
            ? undefined
            : invalidEmailMessage

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.trackedEntityAttribute.id}
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        type={'email'}
                        component={InputFieldFF}
                        key={fieldData.trackedEntityAttribute.id}
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        validate={email}

                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function DefaultValueField(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    //const [UIC, setUIC] = useState(nu''l)

    // async function getUIC() {
    //     let getUIC = await apiServices.generateUIC(fieldData.trackedEntityAttribute.id)
    //     setUIC(getUIC.value)
    // }
    // useEffect(() => {
    //     getUIC()
    // }, [])

    return (
        <>
            {/* {UIC != null ? */}
                <Grid item xs={12} sm={4} md={4} className='UICField'>
                    <Field
                        name={fieldData.trackedEntityAttribute.id}
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        type={fieldData.trackedEntityAttribute.valueType}
                        component={InputFieldFF}
                        key={fieldData.trackedEntityAttribute.id}
                        //defaultValue={UIC}
                        disabled={false}
                        className={customClassName}
                    />
                </Grid>
                {/* // :
                // <> </>
            //} */}
        </>
    )
}

function BooleanFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    const switchData = [
        { label: 'Yes', value: 'item1' },
    ];

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Switches
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        name={fieldData.trackedEntityAttribute.id}
                        disableRipple
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        data={switchData}
                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function TimeFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let showYear = fieldData.trackedEntityAttribute.attributeValues.length > 0 && fieldData.trackedEntityAttribute.attributeValues[0].attribute.name == "showyear" ? true : false
    const [fieldStructure, setFieldStructure] = useState(null)
    const [selectedDate, setDate] = useState(new Date());
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <TimePicker
                        label={fieldData.dataElement.displayFormName}
                        name={fieldData.dataElement.id}
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        dateFunsUtils={DateFnsUtils}
                        margin="normal"
                        variant="inline"
                        format="HH:MM"
                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )

}

function IntegerConfig(props) {
    let customfieldobj_temp = 
        {
            "regPhoneNumberCodeId": "VIJiZQU2PXq",
            "regPhoneNumberCodeBO": {
                "translations": [
                    {
                        "locale": "fr",
                        "property": "FORM_NAME",
                        "value": "Le chiffre"
                    },
                    {
                        "locale": "ru",
                        "property": "SHORT_NAME",
                        "value": "Код"
                    },
                    {
                        "locale": "es",
                        "property": "NAME",
                        "value": "Código"
                    },
                    {
                        "locale": "es",
                        "property": "DESCRIPTION",
                        "value": "Código"
                    },
                    {
                        "locale": "ar",
                        "property": "SHORT_NAME",
                        "value": "رمز"
                    },
                    {
                        "locale": "ru",
                        "property": "NAME",
                        "value": "Код"
                    },
                    {
                        "locale": "es",
                        "property": "FORM_NAME",
                        "value": "Código"
                    },
                    {
                        "locale": "ru",
                        "property": "DESCRIPTION",
                        "value": "Код"
                    },
                    {
                        "locale": "fr",
                        "property": "DESCRIPTION",
                        "value": "Le chiffre"
                    },
                    {
                        "locale": "zh",
                        "property": "NAME",
                        "value": "代码"
                    },
                    {
                        "locale": "es",
                        "property": "SHORT_NAME",
                        "value": "Código"
                    },
                    {
                        "locale": "ar",
                        "property": "DESCRIPTION",
                        "value": "رمز"
                    },
                    {
                        "locale": "zh",
                        "property": "DESCRIPTION",
                        "value": "代码"
                    },
                    {
                        "locale": "ar",
                        "property": "NAME",
                        "value": "رمز"
                    },
                    {
                        "locale": "ru",
                        "property": "FORM_NAME",
                        "value": "Код"
                    },
                    {
                        "locale": "fr",
                        "property": "NAME",
                        "value": "Le chiffre"
                    },
                    {
                        "locale": "ar",
                        "property": "FORM_NAME",
                        "value": "رمز"
                    },
                    {
                        "locale": "fr",
                        "property": "SHORT_NAME",
                        "value": "Le chiffre"
                    },
                    {
                        "locale": "zh",
                        "property": "FORM_NAME",
                        "value": "代码"
                    },
                    {
                        "locale": "zh",
                        "property": "SHORT_NAME",
                        "value": "代码"
                    }
                ],
                "description": "Code",
                "formName": "Prefix",
                "valueType": "NUMBER",
                "unique": false,
                "displayName": "Prefix",
                "id": "VIJiZQU2PXq",
                "attributeValues": [
                    {
                        "attribute": {
                            "name": "isDisabled",
                            "description": "isDisabled",
                            "displayName": "isDisabled",
                            "id": "K0OFkC481Iu"
                        },
                        "value": "false"
                    }
                ]
            },
            "patientContactNumber": "QDBh1vxjR10",
            "patientContactNumberCodeId": "kJkHAwGWzUn",
            "regPhoneNumberId": "yWVcgcKShNM",
            "additionalPatientNumber": "BbSMkQpMUGu",
        }
    const {t} = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    let customfieldobj = props.customfieldobj ? props.customfieldobj : customfieldobj_temp
    let programData = props.programData

  
    let programZambia = false;
    if(programData && programData.code && programData.code == "Zambia_Program"){
        programZambia = true;
    }

    const requiredPhoneCode = value => (fieldData.mandatory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    const required = value => (fieldData.mandatory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    const mustBeNumber = value => (isNaN(value) && value ? t('Must be a number') : undefined)
    const minValue = min => value =>
        isNaN(value) || value >= min ? undefined : t('Should be greater than')+' '+min

    const maxValue = max => value =>
        isNaN(value) || value <= max ? undefined : t('Should be less than')+' '+max

    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        
        if (validationResult != null) {
            let customProps = {}
            if(customfieldobj && customfieldobj.regPhoneNumberCodeId == fieldData.trackedEntityAttribute.id){
                validationResult.hideShow = false
            }
            if (customfieldobj.patientContactNumber == fieldData.trackedEntityAttribute.id
                || customfieldobj.regPhoneNumberId == fieldData.trackedEntityAttribute.id
                || customfieldobj.parentContactNumber == fieldData.trackedEntityAttribute.id
                || customfieldobj.additionalPatientNumber == fieldData.trackedEntityAttribute.id) {
                customProps = {
                    ...customProps,
                    className: "hide"
                }
            }


            if (customfieldobj.regPhoneNumberCodeId == fieldData.trackedEntityAttribute.id
                || customfieldobj.patientContactNumberCodeId == fieldData.trackedEntityAttribute.id
                || customfieldobj.additionalPatientCodeId == fieldData.trackedEntityAttribute.id
                || customfieldobj.parentContactNumberCodeId == fieldData.trackedEntityAttribute.id) {
                customProps = {
                    ...customProps,
                    className: "hide"
                }
            }

            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                     {/* {customfieldobj && customfieldobj.regPhoneNumberCodeId && customfieldobj.patientContactNumber == fieldData.trackedEntityAttribute.id ? 
                    <Field
                    //   disabled
                    label={customfieldobj.regPhoneNumberCodeBO ? getTranslatedLabels(customfieldobj.regPhoneNumberCodeBO) : 'Code'}
                    name={customfieldobj.regPhoneNumberCodeId}
                    className='disno'
                    type="number"
                    component={InputFieldFF}
                    key={customfieldobj.regPhoneNumberCodeId}
                    //value={t(phonecode)}
                    placeholder={programZambia ? "260" : "+225"}
                    required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                    validate={composeValidators(requiredPhoneCode)}
                    customClassName={customClassName}
                    disabled={fieldData.trackedEntityAttribute.attributeValues && fieldData.trackedEntityAttribute.attributeValues.length > 0 ? fieldData.trackedEntityAttribute.attributeValues[0].attribute.name == 'isDisabled' &&  fieldData.trackedEntityAttribute.attributeValues[0].value == "true" ? true : false : false}
                    // onFocus={() => handleonfocus()}
                    // onBlur={() => handleonblur()}
                    // onChange={({ target }) => handleonchange(target.value)}
                  />
                   : <></>} */}

                    <Field
                        name={fieldData.trackedEntityAttribute.id}
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        type={'number'}
                        component={InputFieldFF}
                        key={fieldData.trackedEntityAttribute.id}
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(mustBeNumber, minValue(1))}
                        value=''
                        className={customClassName}
                        {...customProps}
                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function TextAreaConfig(props) {
    const {t} = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    const required = value => (fieldData.mandatory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    const scriptCheck = value => (value ? value.match(/<[^>]*>/g) != null ? t('Incorrect expression "< or >" added as input') : undefined : undefined)
    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.trackedEntityAttribute.id}
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        type={'text'}
                        component={InputFieldFF}
                        key={fieldData.trackedEntityAttribute.id}
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(scriptCheck)}
                        autoGrow
                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function UserNameConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.trackedEntityAttribute.id}
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        component={TextAreaFieldFF}
                        key={fieldData.trackedEntityAttribute.id}
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(dhis2Username)}
                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function URLConfig(props) {
    const {t} = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    const required = value => (fieldData.mandatory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)

    const URLCheck = value => (regexp.test(value) ? undefined : t('Incorrect URL format'))

    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.trackedEntityAttribute.id}
                        label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                        component={TextAreaFieldFF}
                        key={fieldData.trackedEntityAttribute.id}
                        // required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(URLCheck)}
                    />
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function HandleOUOptions(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let OUMappingList = OUMapping(values)  
    let parentValue = OUMappingList[fieldData.trackedEntityAttribute.id] != undefined ? values[OUMappingList[fieldData.trackedEntityAttribute.id].parent] : null
    let programData = props.programData
    let options= props.options
    let defaultOption= props.defaultOption
    let rules = {
       "programRule": props.programRules,
       "programRuleVariable":props.programRulesVariables
    }

    const option = { "id": "option1", "label": 'Option1', "value": 'option1' }

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)
    const [location, setLocation] = useState([])
    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        
        
        
        if(options != '') {
            let locationList = []
            setGlobalSpinner(true)
            apiServices.getAPI('organisationUnits/' + options + '?paging=false&fields=children[id,displayName,children::isNotEmpty,path]')
            .then(OUResponse => {
                OUResponse.data.children.map(locations => {
                    let obj = {
                        'id': locations.id,
                        'label': locations.displayName,
                        'value': locations.id,
                    }
                    locationList.push(obj)
                    setLocation(locationList)
                    setGlobalSpinner(false)
                })
                
                
            }).catch(err=>{
                setGlobalSpinner(false)
                
            })
        } else {
            const OUList = programData.organisationUnits
            let autocompleteData = []
            
            if (OUMappingList[fieldData.trackedEntityAttribute.id] != undefined) {
                if (OUMappingList[fieldData.trackedEntityAttribute.id].type) {
                    
                    let OUOptions = OUList.filter(obj => obj.level == OUMappingList[fieldData.trackedEntityAttribute.id].level)
                    if(OUOptions.length > 0) {
                        OUOptions.map(items => {
                            let obj = {
                                'id': items.id , 
                                'label': items.displayName, 
                                'value': items.id
                            }
                            autocompleteData.push(obj)
                        })
                        setLocation(autocompleteData)
                    }
                }
            }
            

        }
        
    }, [values[fieldData.trackedEntityAttribute.id], parentValue, options,localStorage.getItem("locale")]) //defaultOption, options

    useEffect(() => {
            if(location != null) {
                if(values[fieldData.trackedEntityAttribute.id]) {
                    if(!_.isEmpty(defaultOption)) {
                        setFieldStructure(
                            <OUFieldConfig 
                                data={fieldData} values={values} rules={rules} options={location} defaultOption={defaultOption} programData={programData} OUMapping={OUMappingList}
                            />
                        )
                    }
                }else {
                    setFieldStructure(
                        <OUFieldConfig 
                            data={fieldData} values={values} rules={rules} options={location} defaultOption={defaultOption} programData={programData} OUMapping={OUMappingList}
                        />
                    )
                }
            }
            
        
    }, [location,localStorage.getItem("locale")])
    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function MultiSelectConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let DataElementGroup = DataElementGroup
    let programObj = programObj

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    function getFieldDetails(fieldId, formValues) {
        const getFieldsAttributes = programObj.programTrackedEntityAttributes.filter(
            (obj) => obj.trackedEntityAttribute.id == fieldId
        );

        if (getFieldsAttributes.length > 0) {

            const fieldData1 = getFieldsAttributes[0];

            const findField = HideCheckboxOptions[fieldData1.trackedEntityAttribute.id]
            let isFieldDisbaled = false
            if (findField != undefined) {
                // 
                findField.field.map(eachField => {
                    if (formValues[eachField] == findField.value) {
                        isFieldDisbaled = true
                    }
                })


            }


            return (
                <Field
                    type="checkbox"
                    component={CheckboxFieldFF}
                    name={this.props.DataElementGroup.id}
                    disabled={isFieldDisbaled}
                    label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                    value={fieldData1.trackedEntityAttribute.id}
                />
            );
        }
    }

    useEffect(() => {
        fetchValidation()
    }, [])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={12} className={validationResult.hideShow == true ? 'customLoc' : 'hide'}>
                    <FieldGroupFF
                        label={DataElementGroup.displayName}
                        // onClick={(e, v) => onChange(e, v)}
                        name={DataElementGroup.id}
                    >
                        {DataElementGroup.trackedEntityAttributes.map((field) => {
                            return getFieldDetails(field.id, values);
                        })}
                    </FieldGroupFF>
                </Grid>
            )
        }

    }, [validationResult,localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )

}

function CreateField(props) {
    let fieldData = props.fieldData

    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let programData = props.programData
    let OUM = OUMapping(values)
    let customClassName = props.customClassName
    let customfieldobj = props.customfieldobj
   
    let rules = {
        "programRule": props.programRules,
        "programRuleVariable":props.programRulesVariables
     }


    function checkFieldType() {

        switch (fieldData.trackedEntityAttribute.valueType) {
            case 'TEXT':
                return fieldData.trackedEntityAttribute.unique
                    ?
                    <DefaultValueField
                        fieldData={fieldData}
                        programRules={programRules}
                        programRulesVariables={programRulesVariables}
                        values={values}
                        customClassName={customClassName}
                    />
                    : <InputFieldConfig
                        fieldData={fieldData}
                        programRules={programRules}
                        programRulesVariables={programRulesVariables}
                        values={values}
                        customClassName={customClassName}
                        customfieldobj={customfieldobj}
                        programData={programData}
                    />


            case 'DATE':
                return <DateFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    customClassName={customClassName}
                />

            case 'AGE':
                return <AgeFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                />

            case 'PHONE_NUMBER':
                return <PhoneNumberFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    customClassName={customClassName}
                    customfieldobj={customfieldobj}
                    programData={programData}
                />

            case 'EMAIL':
                return <EmailFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                />
            case 'BOOLEAN':

                if (programData.programSections.length > 0 &&
                    programData.programSections.filter(
                        (obj) => obj.displayName == fieldData.trackedEntityAttribute.displayName
                    ).length > 0
                ) {
                    const filterDataElementGroup = programData.programSections.filter(
                        (obj) => obj.displayName == fieldData.trackedEntityAttribute.displayName
                    )[0];

                    return (
                        <MultiSelectConfig
                            fieldData={fieldData}
                            programRules={programRules}
                            programRulesVariables={programRulesVariables}
                            values={values}
                            DataElementGroup={filterDataElementGroup}
                            programObj={programData}
                        />
                    );
                } else {
                    // 
                    return <BooleanFieldConfig
                        fieldData={fieldData}
                        programRules={programRules}
                        programRulesVariables={programRulesVariables}
                        values={values}
                    />
                }
            case 'TRUE_ONLY':
                return <BooleanFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                />
            case 'TIME':
                return <TimeFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                />

            case 'DATETIME':
                return <DateTimeFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                />

            case 'INTEGER':
            case 'INTEGER_POSITIVE':
            case 'INTEGER_NEGATIVE':
            case 'INTEGER_ZERO_OR_POSITIVE':
            case 'NUMBER':
                return <IntegerConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    customClassName={customClassName}
                    customfieldobj = {customfieldobj}
                    programData={programData}
                />
            case 'LONG_TEXT':
                return <TextAreaConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                />

            case 'USERNAME':
                return <UserNameConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                />

            case 'URL':
                return <URLConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                />

                case 'ORGANISATION_UNIT':
                    const defaultValue = values[fieldData.trackedEntityAttribute.id]
                    
                    let optionsId = ''
                    let defaultOption = {}
                    const childDropDown = JSON.parse(localStorage.getItem('childDropDown'))
                        if (childDropDown != null) {
                            const fieldOptionFilter = childDropDown.filter(obj => obj.fieldId == fieldData.trackedEntityAttribute.id)
                            if (fieldOptionFilter.length > 0) {
                                
                                optionsId = fieldOptionFilter[0].value
                            }
    
                        }
                    if (defaultValue != undefined) {
                        
    
                        const LocationFilter = programData.organisationUnits.filter(OU => OU.id == values[fieldData.trackedEntityAttribute.id])
                        const locationName = LocationFilter.length > 0 ? LocationFilter[0].displayName : ""
                        defaultOption = {
                            'id': values[fieldData.trackedEntityAttribute.id],
                            'label': locationName,
                            'value': values[fieldData.trackedEntityAttribute.id]
                        }
    
                        if (OUM[fieldData.trackedEntityAttribute.id] != undefined) {
                            if (OUM[fieldData.trackedEntityAttribute.id].parent != '') {
                                optionsId = values[OUM[fieldData.trackedEntityAttribute.id].parent]
                            }
                        }
                        
                    }
                     //LocationFilter, locationName optionsId, defaultValue,
                    //if(optionsId != '') {
                        
                        return <HandleOUOptions
                        fieldData={fieldData}
                        programRules={programRules}
                        programRulesVariables={programRulesVariables}
                        values={values}
                        programData={programData}
                        options={optionsId} 
                        defaultOption={defaultOption}
                        OUMapping ={OUM}
                        />
                 

        }
    }


    return (
        <>
            {checkFieldType()}
        </>

    )
}

export default CreateField;
