import React, { useState, useEffect } from 'react'
import { withTranslation, Trans, useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { formValues, setTabHideValues } from "../../redux/actions/action";
import { OnChange } from "react-final-form-listeners";
import axios from 'axios';
import { DropzoneArea } from 'material-ui-dropzone'
import { DropzoneDialog } from 'material-ui-dropzone'
import Rating from '@material-ui/lab/Rating';
import OfflineDb from '../../db'
//import HideShowCondition from "../validation/HideShowCondition";

//import AssignCondition from "../validation/Assign";

import Validator from '../validation/validator/validatorStage'
import { HideCheckboxOptions } from '../../assets/data/hideCheckboxOnCondition'
import ShowError from "../validation/showError/ShowError";

// import HideStageFieldsOptions from '../validation/hideOptions/HideStageFieldsOptions'
import OUFieldConfig from './OUStageFieldConfig';
import DisplayText from "../validation/DisplayText.js";

import ReferalForm from "../forms/referalForm/ReferalForm";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { isEmpty, isString } from "../../helper/index";
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
    MultiSelectFieldFF,
    FileInput,
    FileInputFieldFF
} from "@dhis2/ui";

import {
    TextField,
    Checkboxes,
    CheckboxData,
    Radios,
    Select,
    TimePicker,
    Switches,
    KeyboardDatePicker,
    DatePicker,
    DateTimePicker,
    Autocomplete,
} from "mui-rff";
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'
import _ from 'lodash';
import OUMapping from '../../assets/data/registerOU'

import { createStyles, makeStyles } from '@material-ui/core/styles';

//   import { Select } from 'mui-rff';
import { MenuItem } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";

import { Checkbox as MuiCheckbox } from "@material-ui/core";

//   import {Checkboxes, CheckboxData} from 'mui-rff';

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

import { apiServices } from "../../services/apiServices";

const { Form, Field } = ReactFinalForm;

const useStyles = makeStyles(theme => createStyles({
    previewChip: {
        minWidth: 160,
        maxWidth: 210
    },
}));

const getTranslatedLabels = (dataElement) => {
    if (localStorage.getItem("locale") == "en") {
        let label = dataElement.translations.filter(
            (tanslation) =>
                tanslation.property == "NAME" &&
                tanslation.locale == localStorage.getItem("locale")
        );
        if (label.length > 0) {
            return label[0].value;
        } else {
            return dataElement.formName ? dataElement.formName : dataElement.displayName ? dataElement.displayName : dataElement.description;
        }
    } else if (dataElement.translations && dataElement.translations.length > 0) {
        let label = dataElement.translations.filter(
            (tanslation) =>
                tanslation.property == "NAME" &&
                tanslation.locale == localStorage.getItem("locale")
        );
        if (label.length > 0) {
            return label[0].value;
        } else {
            return dataElement.formName ? dataElement.formName : dataElement.displayName;
        }
    }
    return dataElement.formName ? dataElement.formName : dataElement.displayName;
};

const getTranslatedOptionLabels = (dataElement) => {
    if (localStorage.getItem("locale") == "en") {
        return dataElement.displayName;
    } else if (dataElement.translations && dataElement.translations.length > 0) {
        let label = dataElement.translations.filter(
            (tanslation) =>
                tanslation.property == "NAME" &&
                tanslation.locale == localStorage.getItem("locale")
        );
        if (label.length > 0) {
            return label[0].value;
        } else {
            return dataElement.displayName;
        }
    }
    return dataElement.displayName;
};

function InputFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let dataElementGroup = props.dataElementGroup;

    const [fieldType, setFieldType] = useState(null)
    const [optionSet, setOptions] = useState(null)
    const [icons, setIcons] = useState(null)
    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)
    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : 'Required' : undefined)
    const scriptCheck = value => (value ? value.match(/<[^>]*>/g) != null ? 'Incorrect expression "< or >" added as input' : undefined : undefined)
    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    function findFieldType() {
        const dataElement = fieldData.dataElement
        if (dataElement.optionSet != undefined) {
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
                    } else {
                        setFieldType('dropdown')
                    }
                } else {
                    setFieldType('dropdown')
                }
            }
            //setFieldType('dropdown')
        } else {
            setFieldType('text')
        }
    }

    function fetchOption() {
        let output = []
        const dataElement = fieldData.dataElement
        if (dataElement.optionSet != undefined && dataElement.optionSet.options) {
            dataElement.optionSet.options.map((items, index) => {
                if (icons.length > 0) {
                    output.push({ 'value': items.code, 'label': <> <span dangerouslySetInnerHTML={{ __html: icons[index] }} /> <>{getTranslatedOptionLabels(items)} </>  </> })
                } else {
                    output.push({ 'value': items.code, 'label': getTranslatedOptionLabels(items) })
                }
            })

        }
        if (output.length > 0) {
            setOptions(output)
        }
    }

    function getIcons() {
        let promises = [];
        const dataElement = fieldData.dataElement
        if (navigator.onLine) {
            if (dataElement.optionSet != undefined && dataElement.optionSet.options) {
                dataElement.optionSet.options.forEach((options) => {
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
        } else {
            setIcons([])
        }


    }

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
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

    }, [icons, values])

    useEffect(() => {

        if (validationResult != null && fieldType != null) {
            if (fieldType == "text") {
                setFieldStructure(
                    <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                        <Field
                            name={fieldData.dataElement.id}
                            label={getTranslatedLabels(fieldData.dataElement)}
                            type={'text'}
                            component={InputFieldFF}
                            key={fieldData.dataElement.id}
                            required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                            validate={composeValidators(required, scriptCheck)} //fieldData.compulsory && validationResult.hideShow == true ? hasValue : false
                            value=''
                        />
                    </Grid>
                )
            } else if (fieldType == "radio") {
                setFieldStructure(
                    <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                        <Radios
                            id={fieldData.dataElement.id}
                            label={getTranslatedLabels(fieldData.dataElement)}
                            name={fieldData.dataElement.id}
                            required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                            data={optionSet != null ? optionSet : []}
                        // defaultValue={defaultValue}
                        />
                    </Grid>
                )

            } else if (fieldType == "dropdown") {
                setFieldStructure(
                    <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide1'}>
                        <Field
                            key={fieldData.dataElement.id}
                            id={fieldData.dataElement.id}
                            name={fieldData.dataElement.id}
                            label={getTranslatedLabels(fieldData.dataElement)}
                            // type={fieldData.dataElement.valueType}

                            component={SingleSelectFieldFF}
                            //key={fieldData.dataElement.id}
                            required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                            options={optionSet != null ? optionSet : []}
                            disabled={fieldData.dataElement.attributeValues && fieldData.dataElement.attributeValues.length > 0 ? fieldData.dataElement.attributeValues[0].attribute.name == 'isDisabled' ? true : false : false}
                            validate={composeValidators(required, scriptCheck)}
                        //onChange={()=>onDropdownOptionChange(fieldData.dataElement.id)}
                        />
                    </Grid>
                )
            }
        }


    }, [fieldType, optionSet, validationResult, localStorage.getItem("locale")])

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
    let dataElementGroup = props.dataElementGroup
    let showYear = fieldData.dataElement && fieldData.dataElement.attributeValues && fieldData.dataElement.attributeValues.length > 0 && fieldData.dataElement.attributeValues[0].attribute.name == "showyear" ? true : false
    const [fieldStructure, setFieldStructure] = useState(null)
    const [selectedDate, setDate] = useState(new Date());
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <DatePicker

                        disabled={showYear ? true : false}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        name={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        dateFunsUtils={DateFnsUtils}
                        value={values[fieldData.dataElement.id] == undefined ? selectedDate : values[fieldData.dataElement.id]}
                        margin="normal"
                        variant="inline"
                        format={showYear == true ? "yyyy" : "yyyy-MM-dd"}
                        views={showYear ? ["year"] : ["year", "month", "date"]}
                        openTo={showYear ? "year" : "date"}
                        validate={selectedDate.compulsory && validationResult.hideShow == true ? hasValue : false}
                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

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
    let dataElementGroup = props.dataElementGroup
    let showYear = fieldData.dataElement.attributeValues.length > 0 && fieldData.dataElement.attributeValues[0].attribute.name == "showyear" ? true : false
    const [fieldStructure, setFieldStructure] = useState(null)
    const [selectedDate, setDate] = useState(new Date());
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <DateTimePicker
                        disabled={showYear ? true : false}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        name={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        dateFunsUtils={DateFnsUtils}
                        value={values[fieldData.dataElement.id] == undefined ? selectedDate : values[fieldData.dataElement.id]}
                        margin="normal"
                        variant="inline"
                        format={showYear == true ? "yyyy" : "yyyy-MM-dd"}
                        views={showYear ? ["year"] : ["year", "month", "date"]}
                        openTo={showYear ? "year" : "date"}
                        validate={selectedDate.compulsory && validationResult.hideShow == true ? hasValue : false}
                        disableFuture={fieldData.allowFutureDate ? fieldData.allowFutureDate : false}
                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )

}

function AgeFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let dataElementGroup = props.dataElementGroup

    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : 'Required' : undefined)
    const mustBeNumber = value => (isNaN(value) && value ? 'Must be a number' : undefined)
    const minValue = min => value =>
        isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`
    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type="number"
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(required, mustBeNumber)}
                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function PhoneNumberFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let dataElementGroup = props.dataElementGroup

    const numberFormat = value =>
        isNaN(value) && value ? `Incorrect format` : undefined

    const maxLength = max => value => value ? isNaN(value) || value.length > max ? `Should be less than ${max}` : undefined : undefined
    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : 'Required' : undefined)

    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type={'number'}
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(required, numberFormat, maxLength(12))}
                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

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
    let dataElementGroup = props.dataElementGroup

    const EMAIL_ADDRESS_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

    const invalidEmailMessage = 'Please provide a valid email address'

    const email = value =>
        isEmpty(value) || (isString(value) && EMAIL_ADDRESS_PATTERN.test(value))
            ? undefined
            : invalidEmailMessage

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type={'email'}
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={email}

                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

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
    let dataElementGroup = props.dataElementGroup

    const [UIC, setUIC] = useState(null)

    async function getUIC() {
        let getUIC = await apiServices.generateUIC(fieldData.dataElement.id)
        setUIC(getUIC.value)
    }
    useEffect(() => {
        getUIC()
    }, [])

    return (
        <>
            {UIC != null ?
                <Grid item xs={12} sm={4} md={4}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type={fieldData.dataElement.valueType}
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        defaultValue={UIC}
                        disabled={true}
                    />
                </Grid>
                :
                <> </>
            }
        </>
    )
}

function BooleanFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let dataElementGroup = props.dataElementGroup
    const switchData = [
        { label: 'Yes', value: 'item1' },
    ];

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
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
                        label={getTranslatedLabels(fieldData.dataElement)}
                        name={fieldData.dataElement.id}
                        disableRipple
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        data={switchData}
                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

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
    let dataElementGroup = props.dataElementGroup
    let showYear = fieldData.dataElement && fieldData.dataElement.attributeValues && fieldData.dataElement.attributeValues.length > 0 && fieldData.dataElement.attributeValues[0].attribute.name == "showyear" ? true : false
    const [fieldStructure, setFieldStructure] = useState(null)
    const [selectedDate, setDate] = useState(new Date());
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <TimePicker
                        label={fieldData.dataElement.displayFormName}
                        name={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        dateFunsUtils={DateFnsUtils}
                        margin="normal"
                        variant="inline"
                        format="HH:MM"
                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )

}

function IntegerConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let datasetRules = props.datasetRules ? props.datasetRules : []
    let values = props.values
    let dataElementGroup = props.dataElementGroup
    let maxEqualValueCond = null
    let minEqualValueCond = 0
    let maxValueCond = null
    let minValueCond = 0
    let equalValueCond = null
    let notEqaluValueCond = null
    let operator = null
    const { t, i18n } = useTranslation();
    //console.log("props.fieldData",props.fieldData)
    datasetRules.map(rules => {
        const datasetField = rules.leftSide ? rules.leftSide.expression ? rules.leftSide.expression : null : null
        let filteringRuleWithField = datasetField ? datasetField.replace(/[^a-zA-Z0-9 ]/g, "") : ''
        if (filteringRuleWithField && filteringRuleWithField == fieldData.dataElement.id) {
            switch (rules.operator) {
                case 'less_than_or_equal_to':
                    maxEqualValueCond = rules.rightSide ? Number(rules.rightSide.expression) : 0
                    operator = '<='
                    break;
                case 'less_than':
                    maxValueCond = rules.rightSide ? Number(rules.rightSide.expression) : 0
                    operator = '<'
                    break;
                case 'greater_than_or_equal_to':
                    minEqualValueCond = rules.rightSide ? Number(rules.rightSide.expression) : null
                    operator = '>='
                    break;
                case 'greater_than':
                    minValueCond = rules.rightSide ? Number(rules.rightSide.expression) : null
                    operator = '>'
                    break;
                case 'not_equal_to':
                    notEqaluValueCond = rules.rightSide ? Number(rules.rightSide.expression) : null
                    operator = '!='
                    break;
                case 'equal_to':
                    equalValueCond = rules.rightSide ? Number(rules.rightSide.expression) : null
                    operator = '=='
                    break;
            }
        }
    })
    //console.log("maxValueCond",minEqualValueCond);
    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : `${t('Required')}` : undefined)
    const mustBeNumber = value => (isNaN(value) && value ? `${t('Must be a number')}` : undefined)
    const minValue = value => minEqualValueCond || minEqualValueCond == 0 ?
        isNaN(value) || value >= minEqualValueCond ? undefined : `${t('Should be greater than or equal to ')} ${minEqualValueCond}` : undefined

    const maxValue = value => maxEqualValueCond ?
        isNaN(value) || value <= maxEqualValueCond ? undefined : `${t('Should be less than or equal to ')} ${maxEqualValueCond}` : undefined

    const equalValue = value => equalValueCond ?
        isNaN(value) || value == equalValueCond ? undefined : `${t('Should be equal to ')} ${equalValueCond}` : undefined

    const notEqualValue = value => notEqaluValueCond ?
        isNaN(value) || value != notEqaluValueCond ? undefined : `${t('Should not be equal to ')} ${notEqaluValueCond}` : undefined

    const greaterValue = value => minValueCond ?
        isNaN(value) || value > minValueCond ? undefined : `${t('Should be greater than ')} ${minValueCond}` : undefined

    const lessValue = value => maxValueCond ?
        isNaN(value) || value < maxValueCond ? undefined : `${t('Should be less than ')} ${maxValueCond}` : undefined

    //const maxValu

    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type={'number'}
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(required, mustBeNumber, minValue, maxValue, equalValue, notEqualValue, greaterValue, lessValue)}
                        value=''
                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function TextAreaConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let dataElementGroup = props.dataElementGroup

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : 'Required' : undefined)
    const scriptCheck = value => (value ? value.match(/<[^>]*>/g) != null ? 'Incorrect expression "< or >" added as input' : undefined : undefined)
    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type={'text'}
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(required, scriptCheck)}
                        autoGrow
                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

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
    let dataElementGroup = props.dataElementGroup

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        component={TextAreaFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(hasValue, dhis2Username)}
                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function URLConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let dataElementGroup = props.dataElementGroup
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : 'Required' : undefined)

    const URLCheck = value => (regexp.test(value) ? undefined : 'Incorrect URL format')

    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        component={TextAreaFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(required, URLCheck)}
                    />
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

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
    let parentValue = OUMappingList[fieldData.dataElement.id] != undefined ? values[OUMappingList[fieldData.dataElement.id].parent] : null
    let programData = props.programData
    let options = props.options
    let defaultOption = props.defaultOption
    const [countryOption, setCountryOption] = React.useState(null);
    let rules = {
        "programRule": props.programRules,
        "programRuleVariable": props.programRulesVariables
    }

    const option = { "id": "option1", "label": 'Option1', "value": 'option1' }

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)
    const [location, setLocation] = useState([])

    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    async function getDataFromDatabase() {
        let ouId = await OfflineDb.getDataFromPouchDB('OUStructureJSON')
        setCountryOption(ouId.data)
    }

    useEffect(() => {
        getDataFromDatabase()
        //getsurveydata();
    }, [])

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {



        if (options != '') {
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


                })
        } else {
            if (countryOption != null) {
                const OUList = countryOption.organisationUnits;//countryOption.organisationUnits//programData.organisationUnits
                let autocompleteData = []
                if (OUMappingList[fieldData.dataElement.id] != undefined) {
                    if (OUMappingList[fieldData.dataElement.id].type) {
                        let OUOptions = OUList.filter(obj => obj.level == OUMappingList[fieldData.dataElement.id].level)
                        if (OUOptions.length > 0) {
                            OUOptions.map(items => {
                                let obj = {
                                    'id': items.id,
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

        }

    }, [values[fieldData.dataElement.id], parentValue, options, countryOption]) //defaultOption, options

    useEffect(() => {
        if (location != null) {
            if (values[fieldData.dataElement.id]) {
                if (!_.isEmpty(defaultOption)) {
                    setFieldStructure(
                        <OUFieldConfig
                            data={fieldData} values={values} rules={rules} options={location} defaultOption={defaultOption} programData={programData} OUMapping={OUMappingList}
                        />
                    )
                }
            } else {
                setFieldStructure(
                    <OUFieldConfig
                        data={fieldData} values={values} rules={rules} options={location} defaultOption={defaultOption} programData={programData} OUMapping={OUMappingList}
                    />
                )
            }
        }


    }, [location])
    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function ReferalConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let dataElementGroup = props.dataElementGroup
    let programData = props.programData

    const stagesList = programData.programStages

    let checkboxData = [];
    let isCheckboxReadOnly = false, readOnlyCheckboxArr = []

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    function getFieldDetails(stage, parentAttribute, parentReadOnlyCheckboxArr) {
        return (
            <Field
                type="checkbox"
                component={CheckboxFieldFF}
                name={parentAttribute.dataElement.id}
                label={stage.label}
                value={stage.value}
                disabled={true}
                initialValue={parentReadOnlyCheckboxArr}
            />
        );
    };

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            stagesList.map((stage) => {
                // readynoly checkbox logic for savemynmar
                if (stage.attributeValues.length > 0) {
                    stage.attributeValues.map((val) => {

                        if (val.attribute.displayName == "showStageNameInReferralService") {
                            readOnlyCheckboxArr.push(stage.id)
                            isCheckboxReadOnly = true;

                            checkboxData.push({
                                label: stage.description,
                                value: stage.id,
                            });
                        }
                    })
                }
            })
            setFieldStructure(
                <Grid item xs={12} sm={4} className={validationResult.hideShow == true ? 'customLoc' : 'hide'}>
                    <FieldGroupFF
                        label={getTranslatedLabels(fieldData.dataElement)}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        name={fieldData.dataElement.id}
                    >

                        {checkboxData.map((stage) => {

                            return getFieldDetails(stage, fieldData, readOnlyCheckboxArr);
                        })}
                    </FieldGroupFF>
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

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
    let DataElementGroup = props.DataElementGroup
    let programObj = props.programObj
    let dataElementGroup = props.dataElementGroup
    let stage = props.stages

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    function getFieldDetails(fieldId, formValues) {
        const getFieldsAttributes = stage.filter(
            (obj) => obj.dataElement.id == fieldId
        );

        if (getFieldsAttributes.length > 0) {

            const fieldData1 = getFieldsAttributes[0];
            return (
                <Field
                    type="checkbox"
                    component={CheckboxFieldFF}
                    name={DataElementGroup.id}
                    // disabled={isFieldDisbaled}
                    label={getTranslatedLabels(fieldData1.dataElement)}
                    value={fieldData1.dataElement.id}
                />
            );
        }
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null) {
            let fieldLabel = getTranslatedLabels(DataElementGroup);
            try {
                if (fieldLabel.includes('_')) {
                    let l = fieldLabel.split('_');
                    fieldLabel = l[1]
                }
            } catch (e) {

            }
            setFieldStructure(
                <Grid item xs={12} sm={4} className={validationResult.hideShow == true ? 'customLoc' : 'hide'}>
                    <FieldGroupFF
                        label={fieldLabel}
                        // onClick={(e, v) => onChange(e, v)}
                        name={DataElementGroup.id}
                    >
                        {DataElementGroup.dataElements.map((field) => {
                            return getFieldDetails(field.id, values);
                        })}
                    </FieldGroupFF>
                </Grid>
            )
        }

    }, [validationResult, localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )

}



function ImageFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let dataElementGroup = props.dataElementGroup
    const classes = useStyles();
    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)
    const [initialFile, setInitialFile] = useState(null)
    // const file = new File(["foo"], "foo.txt", {
    //     type: "text/plain",
    //   });
    function handleSave() {

    }



    function handleChange(files) {

        if (files.length > 0) {
            let data = new FormData();
            data.append('file', files[0]);
            values[fieldData.dataElement.id] = files
        }


    }

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {


        if (validationResult != null) {

            let file = []
            if (values[fieldData.dataElement.id]) {


                file = new File(["131015049_3744049505646273_5914943780102983194_o"], values[fieldData.dataElement.id][0].name, {
                    type: values[fieldData.dataElement.id][0].type,
                })

                // setInitialFile(array)
            }
            setFieldStructure(
                <Grid item xs={12} sm={4} md={4} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <DropzoneArea
                        name={fieldData.dataElement.id}
                        onChange={handleChange.bind(this)}
                        filesLimit={1}
                        dropzoneText={getTranslatedLabels(fieldData.dataElement)}
                        //showPreviews={true}
                        showPreviewsInDropzone={true}
                        useChipsForPreview
                        previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                        previewChipProps={{ classes: { root: classes.previewChip } }}
                        acceptedFiles={['image/*']}
                        //previewText="Selected files"
                        initialFiles={[file].length ? [file] : []}
                    />

                    {/* <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        component={FileInputFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        value={[]}
                        //onChange={handleChange.bind(this)}
                        //validate={composeValidators(required, URLCheck)}
                    /> */}

                </Grid>
            )
        }

    }, [validationResult, initialFile, localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function CreateField(props) {
    let fieldData = props.fieldData
    let programRules = [] //props.programRules
    let programRulesVariables = [] //props.programRulesVariables
    let datasetRules = props.datasetRules
    let values = props.values
    let programData = props.programData
    let dataElementGroup = props.dataElementGroup
    let stages = props.stages
    let OUM = OUMapping(values)
    let activeCaseDetails = props.activeCaseDetails
    const [countryOption, setCountryOption] = React.useState(null);
    //console.log("propscreade",props);
    let rules = {
        "programRule": props.programRules,
        "programRuleVariable": props.programRulesVariables
    }
    async function getDataFromDatabase() {
        let ouId = await OfflineDb.getDataFromPouchDB('OUStructureJSON')
        setCountryOption(ouId.data)
    }

    useEffect(() => {
        getDataFromDatabase()
        //getsurveydata();
    }, [])

    function checkFieldType() {
        switch (fieldData.dataElement.valueType) {
            case 'TEXT':
                return fieldData.dataElement.unique
                    ?
                    <DefaultValueField
                        fieldData={fieldData}
                        programRules={programRules}
                        programRulesVariables={programRulesVariables}
                        values={values}
                        dataElementGroup={dataElementGroup}
                    /> :
                    fieldData.dataElement.fieldMask == "Facility Referral" ||
                        fieldData.dataElement.fieldMask == "Select HTC Referral Location"
                        ?
                        <ReferalConfig
                            fieldData={fieldData}
                            programRules={programRules}
                            programRulesVariables={programRulesVariables}
                            values={values}
                            dataElementGroup={dataElementGroup}
                            programData={programData}
                        />
                        : <InputFieldConfig
                            fieldData={fieldData}
                            programRules={programRules}
                            programRulesVariables={programRulesVariables}
                            values={values}
                            dataElementGroup={dataElementGroup}
                        />

            case 'IMAGE':
                return <ImageFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                />

            case 'DATE':
                return <DateFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                />

            case 'AGE':
                return <AgeFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                />

            case 'PHONE_NUMBER':
                return <PhoneNumberFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                />

            case 'EMAIL':
                return <EmailFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                />
            case 'BOOLEAN':
                //dataElementGroup
                if (
                    dataElementGroup.filter(
                        (obj) => obj.displayName == fieldData.dataElement.formName
                    ).length > 0
                ) {
                    const filterDataElementGroup = dataElementGroup.filter(
                        (obj) => obj.displayName == fieldData.dataElement.formName
                    )[0];

                    return (
                        <MultiSelectConfig
                            fieldData={fieldData}
                            programRules={programRules}
                            programRulesVariables={programRulesVariables}
                            values={values}
                            DataElementGroup={filterDataElementGroup}
                            dataElementGroup={dataElementGroup}
                            programObj={programData}
                            stages={stages}
                        />
                    )


                } else {
                    // const filterDataElementGroup = dataElementGroup.dataElementGroups.filter(obj => obj.displayName == attribute.dataElement.formName)[0]

                    let ShowFieldFlag = true;
                    dataElementGroup.map((DEG) => {
                        DEG.dataElements.map((DataElements) => {
                            if (DataElements.id == fieldData.dataElement.id) {
                                ShowFieldFlag = false;
                            }
                        });
                    });

                    if (ShowFieldFlag) {
                        return <BooleanFieldConfig
                            fieldData={fieldData}
                            programRules={programRules}
                            programRulesVariables={programRulesVariables}
                            values={values}
                            dataElementGroup={dataElementGroup}
                        />
                    } else {
                        return <> </>;
                    }
                }

            case "TRUE_ONLY":
                if (
                    dataElementGroup.filter(
                        (obj) => obj.displayName == fieldData.dataElement.formName
                    ).length > 0
                ) {
                    const filterDataElementGroup = dataElementGroup.filter(
                        (obj) => obj.displayName == fieldData.dataElement.formName
                    )[0];

                    return (
                        <MultiSelectConfig
                            fieldData={fieldData}
                            programRules={programRules}
                            programRulesVariables={programRulesVariables}
                            values={values}
                            DataElementGroup={filterDataElementGroup}
                            programObj={programData}
                            stages={stages}
                            dataElementGroup={dataElementGroup}
                        />
                    )


                } else {
                    // const filterDataElementGroup = dataElementGroup.dataElementGroups.filter(obj => obj.displayName == attribute.dataElement.formName)[0]

                    let ShowFieldFlag = true;
                    dataElementGroup.map((DEG) => {
                        DEG.dataElements.map((DataElements) => {
                            if (DataElements.id == fieldData.dataElement.id) {
                                ShowFieldFlag = false;
                            }
                        });
                    });

                    if (ShowFieldFlag) {
                        return <BooleanFieldConfig
                            fieldData={fieldData}
                            programRules={programRules}
                            programRulesVariables={programRulesVariables}
                            values={values}
                            dataElementGroup={dataElementGroup}
                        />
                    } else {
                        return <> </>;
                    }
                }
            // case 'TRUE_ONLY': 
            //     return <BooleanFieldConfig
            //         fieldData={fieldData}
            //         programRules={programRules}
            //         programRulesVariables={programRulesVariables}
            //         values={values}  
            //     />
            case 'TIME':
                return <TimeFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                />

            case 'DATETIME':
                return <DateTimeFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
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
                    datasetRules={datasetRules}
                    values={values}
                    dataElementGroup={dataElementGroup}
                />
            case 'LONG_TEXT':
                return <TextAreaConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                />

            case 'USERNAME':
                return <UserNameConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                />

            case 'URL':
                return <URLConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                />

            case 'ORGANISATION_UNIT':
                //console.log("values",values);
                let optionsId = ''
                const childDropDown = JSON.parse(localStorage.getItem('childDropDown'))
                if (childDropDown != null) {
                    const fieldOptionFilter = childDropDown.filter(obj => obj.fieldId == fieldData.dataElement.id)
                    if (fieldOptionFilter.length > 0) {

                        optionsId = fieldOptionFilter[0].value
                    }

                }

                const defaultValue = values[fieldData.dataElement.id]
                let defaultOption = {}
                if (defaultValue != undefined && countryOption != null) {
                    const meta = JSON.parse(localStorage.getItem('metaData'))
                    //const LocationFilter = programData.organisationUnits.filter(OU => OU.id == values[fieldData.dataElement.id])
                    const LocationFilter = countryOption.organisationUnits.filter(OU => OU.id == values[fieldData.dataElement.id])
                    const locationName = LocationFilter.length > 0 ? LocationFilter[0].displayName : ""

                    defaultOption = {
                        'id': values[fieldData.dataElement.id],
                        'label': locationName,
                        'value': values[fieldData.dataElement.id]
                    }


                    if (OUM[fieldData.dataElement.id] != undefined) {
                        if (OUM[fieldData.dataElement.id].parent != '') {
                            optionsId = values[OUM[fieldData.dataElement.id].parent]
                        }
                    }
                }

                //console.log("defaultOption",defaultOption,activeCaseDetails);
                if (values && values[fieldData.dataElement.id] && defaultOption != null) {
                    return <HandleOUOptions
                        fieldData={fieldData}
                        programRules={programRules}
                        programRulesVariables={programRulesVariables}
                        values={values}
                        programData={programData}
                        options={optionsId}
                        defaultOption={defaultOption}

                    //data={fieldData} values={values} rules={rules} options={optionsId} defaultOption={defaultOption}
                    />
                } else if (activeCaseDetails && !activeCaseDetails.data) {
                    return <HandleOUOptions
                        fieldData={fieldData}
                        programRules={programRules}
                        programRulesVariables={programRulesVariables}
                        values={values}
                        programData={programData}
                        options={optionsId}
                        defaultOption={defaultOption}

                    //data={fieldData} values={values} rules={rules} options={optionsId} defaultOption={defaultOption}
                    />
                }


        }
    }


    return (
        <>
            {checkFieldType()}
        </>

    )
}

export default CreateField