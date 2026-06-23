import React, { useState, useEffect, useMemo } from 'react'
import { OnChange } from "react-final-form-listeners";
import axios from 'axios';
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'
import _ from 'lodash';
import OUMapping from '../../assets/data/registerOU'
import { useHistory } from "react-router-dom";

import HideShowCondition from "../validation/HideShowCondition";

import AssignCondition from "../validation/Assign";

import Validator from '../validation/validator/validatorStage'

// import HideStageFieldsOptions from '../validation/hideOptions/HideStageFieldsOptions'
import OUFieldConfig from './OUStageFieldConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faTimes, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import Html5QrcodePlugin from '../html5qrbarcodescanner/Html5QrBarcodeScanner';
import { isEmpty, isString } from "../../helper/index";
import {
    InputFieldFF,
    TextAreaFieldFF,
    SingleSelectFieldFF,
    ReactFinalForm,
    hasValue,
    FieldGroupFF,
    CheckboxFieldFF,
    RadioFieldFF,
    FileInputFieldFF
} from "@dhis2/ui";

import {
    Radios,
    TimePicker,
    Switches,
    DatePicker,
    DateTimePicker,
} from "mui-rff";
//import { CheckboxField } from '@dhis2-ui/checkbox'

//   import { Select } from 'mui-rff';

import Grid from "@material-ui/core/Grid";


//   import {Checkboxes, CheckboxData} from 'mui-rff';

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import AsyncSelect from "react-select/async";
import { apiServices } from "../../services/apiServices";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { APP_LOCALE } from '../../../src/assets/data/config.js';
import { getDateFormat, getKeyByValue, getAttributeValue, dynamiccalculateBMI, checkFieldCondition_dhis_, getRangeValues, maskText } from '../../config/validationutils';
import swal from 'sweetalert';
import { format } from 'date-fns';
import { useConfig } from '../../hooks/useConfig';
import EtDatePicker from "mui-ethiopian-datepicker";
import { convertToGC, toEthiopianDateString } from 'gc-to-ethiopian-calendar';
const { Form, Field } = ReactFinalForm;

const ValidatorComponent = (
    fieldId,
    attribute,
    values,
    form,
    rules,
    field,
) => {
    let programRules = rules.programRule;
    let programRulesVariables = rules.programRuleVariable;

    let filteringRuleWithField = null;
    let Flag = null;
    let val = null;
    let conditionArray = [];
    let programRuleActionType = null;
    let hideShow = true
    let assign
    programRules.map((rules) => {
        filteringRuleWithField = rules.programRuleActions.filter((obj) =>
            obj.dataElement ? fieldId == obj.dataElement.id : undefined
        );

        if (filteringRuleWithField.length > 0) {
            switch (filteringRuleWithField[0].programRuleActionType) {
                case "HIDEFIELD":
                    hideShow = HideShowCondition(
                        rules,
                        programRulesVariables,
                        values,
                        field,
                        fieldId
                    );
                    break;

                case "ASSIGN":
                    assign =
                        AssignCondition(
                            rules,
                            programRulesVariables,
                            values,
                            field,
                            fieldId,
                            attribute,
                            filteringRuleWithField

                        );
                    break;

                // case 'DISPLAYTEXT':
                //
                //     programRuleActionType = DisplayText(rules, programRulesVariables, values, field, fieldId)
                // break;

                // case "SHOWERROR":
                //   programRuleActionType = ShowError(
                //     rules,
                //     programRulesVariables,
                //     values,
                //     field,
                //     fieldId,
                //     attribute
                //   );
                //   break;

                // case 'HIDEOPTION':
                //     programRuleActionType = HideStageFieldsOptions(rules, programRulesVariables, values, field, fieldId, attribute)
                // break;
            }
        }
    });
    return ({
        'hideShow': hideShow,
        'assign': assign
    })
};
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
            return dataElement.formName ? dataElement.formName : dataElement.displayName ? dataElement.displayName : dataElement.description;
        }
    }
    return dataElement.formName ? dataElement.formName : dataElement.displayName ? dataElement.displayName : dataElement.description;
};

function InputFieldConfig(props) {
    const { t } = useTranslation()
    const history = useHistory();
    let selectedOptionMed = props.selectedOptionMed
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let dataElementGroup = props.dataElementGroup
    let customfieldobj = props.customfieldobj
    let customClassName = props.customClassName
    let symptomsFID = props.symptomsFID
    let Configuration = props.Configuration
    const [fieldType, setFieldType] = useState(null)
    const [optionSet, setOptions] = useState(null)
    const [icons, setIcons] = useState(null)
    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)
    let OUJSON = props.OUJSON.organisationUnits
    let orgid = props.programorgid
    let ismaskable = props.ismaskable;
    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    // const scriptCheck = value => (value ? value.match(/<[^>]*>/g) != null ? t('Incorrect expression "< or >" added as input') : undefined : undefined)
    const scriptCheck = value => {
        if (value && typeof value === 'string') {
            return value.match(/<[^>]*>|</g) !== null ? t('Incorrect expression "<, >, or -" added as input') : undefined;
        }
        return undefined;
    };

    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    const checkboxDependent = [
        //uat
        {
            dependentField: [customfieldobj.testingforTBinfectionID],
            option: customfieldobj.noneOptionID,
        }
    ]
    function checkHideOptionsFields(attributes, programRules, programRulesVariables, values) {
        const fieldId = attributes.dataElement.id;
        let option = [];
        let filteringRuleWithField = null;

        programRules.map((rules) => {
            filteringRuleWithField = rules.programRuleActions.filter((obj) =>
                obj.dataElement ? fieldId == obj.dataElement.id : undefined
            );

            if (
                filteringRuleWithField.length > 0 &&
                filteringRuleWithField[0].programRuleActionType == "HIDEOPTION"
            ) {
                const operators = ["==", "!="];
                const condition = rules.condition;
                const splitConditions = condition.split("&&");
                let Flag = null;
                let val = null;
                let conditionArray = [];
                splitConditions.map((splitCondition) => {
                    const variableName = splitCondition.match(/\{(.*?)\}/)[1];
                    const parentRaw = programRulesVariables.filter(
                        (obj) => obj.displayName == splitCondition.match(/\{(.*?)\}/)[1]
                    ); //[0] .dataElement.id
                    const parentNameFromFilter =
                        parentRaw.length > 0 ? parentRaw[0].displayName : undefined;
                    const parentId =
                        parentRaw.length > 0
                            ? parentRaw[0].dataElement
                                ? parentRaw[0].dataElement.id
                                : parentRaw[0].trackedEntityAttribute
                                    ? parentRaw[0].trackedEntityAttribute.id
                                    : undefined
                            : undefined;

                    const parentNameFromFilterStart = splitCondition.search(
                        parentNameFromFilter
                    );
                    const parentNameLength = parentNameFromFilter
                        ? parentNameFromFilter.length
                        : undefined;

                    const operatorInitLength =
                        parentNameFromFilterStart + parentNameLength + 2;

                    const operator = splitCondition.substring(
                        operatorInitLength,
                        operatorInitLength + 2
                    );

                    const alternateOperatorFinding = operators.map((ops) => {
                        if (splitCondition.search(ops) > -1) {
                            const a = {
                                operator: ops,
                                operatorLength: splitCondition.search(ops),
                            };
                            return a;
                        }
                    });
                    const stringLength = splitCondition.length;
                    if (parentNameFromFilter) {
                        const filteredOperator = alternateOperatorFinding.filter(
                            (obj) => obj != undefined
                        );

                        const conditionValueRaw =
                            filteredOperator.length > 0
                                ? splitCondition.substring(
                                    filteredOperator[0].operatorLength + 3,
                                    splitCondition.length
                                )
                                : undefined;

                        const removeEmptySpace =
                            conditionValueRaw != undefined
                                ? conditionValueRaw.substring(
                                    conditionValueRaw.length - 1,
                                    conditionValueRaw.length
                                ) == " "
                                    ? conditionValueRaw.substring(0, conditionValueRaw.length - 1)
                                    : conditionValueRaw
                                : undefined;

                        const conditionValue =
                            removeEmptySpace != undefined
                                ? removeEmptySpace.substring(1, removeEmptySpace.length - 1)
                                : undefined;
                        const conditionalOperator =
                            filteredOperator.length > 0
                                ? filteredOperator[0].operator
                                : undefined;
                        let conditionForValidation = null;
                        if (conditionalOperator != undefined) {
                            val = conditionValue;
                            switch (conditionalOperator) {
                                case "==":
                                    if (
                                        values[parentId] != undefined &&
                                        String(values[parentId]) == String(conditionValue)
                                    ) {
                                        // values[fieldId] = ''

                                        filteringRuleWithField.map((optionHideRule) => {
                                            attributes.dataElement.optionSet.options.map(
                                                (options) => {
                                                    if (options.id != optionHideRule.option.id) {
                                                        if (option.length > 0) {
                                                            let checkOptionInArray = option.find(obj => obj.id == options.id)
                                                            if (checkOptionInArray == undefined) {
                                                                option.push(options);
                                                            }

                                                        } else {
                                                            option.push(options);
                                                        }



                                                    } else {
                                                        // values[fieldId] = ''

                                                        var temp = {
                                                            id: options.id,
                                                            code: options.code,
                                                            displayName: null,
                                                        };

                                                        let checkOptionInArray = option.find(obj => obj.id == temp.id)

                                                        if (checkOptionInArray == undefined) {
                                                            option.push(temp);
                                                        }


                                                    }
                                                }
                                            );
                                        });
                                    } else {
                                        // values[fieldId] = ''
                                    }
                                    break;

                                case ">=":
                                    if (
                                        values[parentId] != undefined &&
                                        Number(values[parentId]) >= Number(conditionValue)
                                    ) {
                                        // values[fieldId] = ''

                                        filteringRuleWithField.map((optionHideRule) => {
                                            attributes.dataElement.optionSet.options.map(
                                                (options) => {
                                                    if (options.id != optionHideRule.option.id) {
                                                        option.push(options);
                                                    } else {
                                                        // values[fieldId] = ''

                                                        var temp = {
                                                            id: options.id,
                                                            code: options.code,
                                                            displayName: null,
                                                        };
                                                        option.push(temp);
                                                    }
                                                }
                                            );
                                        });
                                    } else {
                                        // values[fieldId] = ''
                                    }
                                    break;

                                case "<=":
                                    if (
                                        values[parentId] != undefined &&
                                        Number(values[parentId]) <= Number(conditionValue)
                                    ) {
                                        // values[fieldId] = ''

                                        filteringRuleWithField.map((optionHideRule) => {
                                            attributes.dataElement.optionSet.options.map(
                                                (options) => {
                                                    if (options.id != optionHideRule.option.id) {
                                                        option.push(options);
                                                    } else {
                                                        // values[fieldId] = ''

                                                        var temp = {
                                                            id: options.id,
                                                            code: options.code,
                                                            displayName: null,
                                                        };
                                                        option.push(temp);
                                                    }
                                                }
                                            );
                                        });
                                    } else {
                                        // values[fieldId] = ''
                                    }
                                    break;

                                case "<":
                                    if (
                                        values[parentId] != undefined &&
                                        Number(values[parentId]) < Number(conditionValue)
                                    ) {
                                        // values[fieldId] = ''

                                        filteringRuleWithField.map((optionHideRule) => {
                                            attributes.dataElement.optionSet.options.map(
                                                (options) => {
                                                    if (options.id != optionHideRule.option.id) {
                                                        option.push(options);
                                                    } else {
                                                        // values[fieldId] = ''

                                                        var temp = {
                                                            id: options.id,
                                                            code: options.code,
                                                            displayName: null,
                                                        };
                                                        option.push(temp);
                                                    }
                                                }
                                            );
                                        });
                                    } else {
                                        // values[fieldId] = ''
                                    }
                                    break;

                                case ">":
                                    if (
                                        values[parentId] != undefined &&
                                        Number(values[parentId]) > Number(conditionValue)
                                    ) {
                                        // values[fieldId] = ''

                                        filteringRuleWithField.map((optionHideRule) => {
                                            attributes.dataElement.optionSet.options.map(
                                                (options) => {
                                                    if (options.id != optionHideRule.option.id) {
                                                        option.push(options);
                                                    } else {
                                                        // values[fieldId] = ''

                                                        var temp = {
                                                            id: options.id,
                                                            code: options.code,
                                                            displayName: null,
                                                        };
                                                        option.push(temp);
                                                    }
                                                }
                                            );
                                        });
                                    } else {
                                        // values[fieldId] = ''
                                    }
                                    break;
                            }
                        } else {
                            // values[parentId] != ''
                            // values[fieldId] = ''
                        }
                    }
                });
            }
        });

        if (option.length > 0) {
            return option;
        } else {
            return attributes.dataElement.optionSet.options
        }
    }

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
                    }
                }
            }
        } else {
            setFieldType('text')
        }

    }

    function fetchOption() {
        let output = []
        const dataElement = fieldData.dataElement

        if (dataElement.optionSet != undefined) {
            if (dataElement.id == customfieldobj.patientStatus) {
                if (values && !values[customfieldobj.patientStatus]) {
                    fieldData.dataElement.optionSet.options.find((o) => {
                        if (o.code == "On Treatment") {
                            values[customfieldobj.patientStatus] = o.code
                        }
                    });
                }
            }
            let refinedOptionList = checkHideOptionsFields(fieldData, programRules, programRulesVariables, values);

            //dataElement.optionSet.options.map((items, index) => {
            refinedOptionList.map((items, index) => {
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
        const dataElement = fieldData.dataElement
        if (navigator.onLine) {
            if (dataElement.optionSet != undefined) {
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

    }, [icons, values, localStorage.getItem("locale")])

    useEffect(() => {

        if (validationResult != null && fieldType != null) {
            let customProps = { className: customClassName };


            try {
                checkboxDependent.map((o) => {
                    if (o.dependentField.includes(fieldData.dataElement.id)) { //for symptoms
                        customProps = { ...customProps, className: "hide" };
                        if (values[o.option]) {
                            if (values[customfieldobj.CXRreportavailableID] && (values[customfieldobj.CXRreportavailableID] == 'No' || (values[customfieldobj.CXRresultId] && values[customfieldobj.CXRresultId] == 'Not suggestive of TB')) && values[customfieldobj.mWRDreportavailableID] && (values[customfieldobj.mWRDreportavailableID] == 'No' || (values[customfieldobj.mWRDresultId] && values[customfieldobj.mWRDresultId] == 'Negative'))) {
                                //customProps = { ...customProps, className: "" };
                                if (((!values[customfieldobj.hivStatusId] || values[customfieldobj.hivStatusId] != 'Positive')) || (values[customfieldobj.hivStatusId] && values[customfieldobj.hivStatusId] == 'Positive' && values[customfieldobj.CRPreportavailableID] && (values[customfieldobj.CRPreportavailableID] == 'No' || (values[customfieldobj.CRPresultId] && values[customfieldobj.CRPresultId] == 'Negative')))) {
                                    customProps = { ...customProps, className: "" };
                                }
                            }
                        } else {

                        }
                    }
                });
            } catch (e) {

            }

            let fieldValue = values[fieldData.dataElement.id];
            let displayValue = fieldValue;
            if (fieldValue && ismaskable) {
                displayValue = maskText(fieldValue);

            }
            if (fieldType == "text") {
                // Validation to hide/show other medication field if Other Medications is selected in the type of medication field
                if (selectedOptionMed?.type != "Others" && fieldData.dataElement.id == customfieldobj.otherMedications) {
                    validationResult.hideShow = false
                }
                if (APP_LOCALE === 'CC006') {
                    if (values[customfieldobj.Diagnosis_Examination] &&
                        (values[customfieldobj.Diagnosis_Examination] == "Type 1" ||
                            values[customfieldobj.Diagnosis_Examination] == "Type 2" ||
                            values[customfieldobj.Diagnosis_Examination] == "Unknown" ||
                            values[customfieldobj.Diagnosis_Examination] == "Gestational Diabetes")) {
                        if (fieldData.dataElement.id == customfieldobj.additionalComments) {
                            validationResult.hideShow = false
                        }
                    }
                }
                if (values[customfieldobj.typeOfMedication] && values[customfieldobj.typeOfMedication] == "Other") {
                    if (fieldData.dataElement.id == customfieldobj.nonInsulinName) {
                        validationResult.hideShow = false
                    }
                }

                if (values[customfieldobj.typeOfMedication] && values[customfieldobj.typeOfMedication] != "Other") {
                    if (fieldData.dataElement.id == customfieldobj.nameOfAdditionalMedication ||
                        fieldData.dataElement.id == customfieldobj.otherMedDosage
                    ) {
                        validationResult.hideShow = false
                    }
                }

                if (values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] == "Insulin") {
                    if (fieldData.dataElement.id == customfieldobj.nameOfNonInsulinRoutineVisits) {
                        validationResult.hideShow = false
                    }
                }

                if (!values[customfieldobj.typeOfMedicationRoutineVisits]) {
                    if (fieldData.dataElement.id == customfieldobj.nameOfNonInsulinRoutineVisits || fieldData.dataElement.id == customfieldobj.nameOfAddMedicationRoutineVisits) {
                        validationResult.hideShow = false
                    }
                }

                if (values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] == "Other") {
                    if (fieldData.dataElement.id == customfieldobj.nameOfNonInsulinRoutineVisits) {
                        validationResult.hideShow = false
                    }
                }

                if (values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] != "Other") {
                    if (fieldData.dataElement.id == customfieldobj.nameOfAddMedicationRoutineVisits) {
                        validationResult.hideShow = false
                    }
                }

                let defaultFieldValue = '';
                if (fieldData.dataElement.fieldMask == "Default Facility") {
                    let facility = OUJSON.filter(obj => obj.id == orgid)
                    defaultFieldValue = facility && facility[0] ? facility[0].name : ''
                }
                // if (values[customfieldobj.TimeTo] > values[customfieldobj.TimeFrom]){
                // }
                if (fieldData.dataElement.id == customfieldobj.other)
                    validationResult.hideShow = false
                if (values[customfieldobj.reasonForTodaysVisit] &&
                    (values[customfieldobj.reasonForTodaysVisit] == "Other")) {
                    if (fieldData.dataElement.id == customfieldobj.other)
                        validationResult.hideShow = true
                }

                const fullWidthIds = ["yp0dtPDo0AT", "OW0xLMu4yVv"];
                const formatWithDashes = (value) => {
                    // Remove all non-numeric characters
                    let digitsOnly = value.replace(/\D/g, '');

                    // Apply format: XX-XX-XX-XX (add dashes after every 2 digits)
                    return digitsOnly
                        .substring(0, 8) // Limit to 8 characters (XX-XX-XX-XX)
                        .replace(/(\d{2})(?=\d)/g, '$1-'); // Insert dash every 2 digits
                };
                if (fieldData.dataElement.id === "kajeJgrCwVu") {
                }
                if(APP_LOCALE == "CC013" && customfieldobj.insulinDosePerkg && fieldData.dataElement.id == customfieldobj.insulinDosePerkg && customfieldobj.dosageDailyUnits && customfieldobj.weightID1){
                    try{
                        const doseString = values[customfieldobj.dosageDailyUnits];
                        const weight = values[customfieldobj.weightID1];
                        if(doseString && weight){
                            const doses = doseString.split("-").map(Number);
                            const totalDose = doses.reduce((a, b) => a + b, 0);
                            const dosePerKg = (totalDose / weight).toFixed(3);
                            values[fieldData.dataElement.id] = dosePerKg
                        }else{
                            values[fieldData.dataElement.id] = ""
                        }
                    }catch(e){ console.log(e)}
                }
                // additional comment field
                setFieldStructure(
                    
                    // <Grid item xs={12} sm={fullWidthIds.includes(fieldData.dataElement.id) ? 12 : 2} md={fullWidthIds.includes(fieldData.dataElement.id) ? 12 : 2} className={validationResult.hideShow ? '' : 'hide'}></Grid>
                    <div sm={fullWidthIds.includes(fieldData.dataElement.id) ? 12 : 2} md={fullWidthIds.includes(fieldData.dataElement.id) ? 12 : 2} className={validationResult.hideShow ? '' : 'hide'}>
                        <Field
                            name={fieldData.dataElement.id}
                            label={getTranslatedLabels(fieldData.dataElement)}
                            type={'text'}
                            component={InputFieldFF}
                            key={fieldData.dataElement.id}
                            defaultValue={defaultFieldValue}
                            required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                            validate={composeValidators(required, scriptCheck)} //fieldData.compulsory && validationResult.hideShow == true ? hasValue : false
                            // value=''
                            className={customClassName}
                            format={value => {
                                if (APP_LOCALE != "CC006" && fieldData.dataElement.id === customfieldobj.dosageSplitId && value) {
                                    return formatWithDashes(value);
                                }
                                return value; // Normal behavior for other fields
                            }}
                            placeholder={fieldData.dataElement.id == customfieldobj.dosageDailyUnits ? "e.g. 10-00-08-22" : ""}
                            parse={value => value}
                            disabled={APP_LOCALE == "CC013" && customfieldobj.insulinDosePerkg && fieldData.dataElement.id == customfieldobj.insulinDosePerkg ? true : false}
                        />
                        {APP_LOCALE === "CC013" &&
                        customfieldobj.insulinDosePerkg &&
                        fieldData.dataElement.id === customfieldobj.insulinDosePerkg &&
                        (!values[customfieldobj.dosageDailyUnits] ||
                            !values[customfieldobj.weightID1]) && (
                            <span className="field-info field-note">
                            {t("* Weight and Daily Dosage (Units) are required for this calculation")}
                            </span>
                        )}
                    </div>
                   
                        
                    
                )
            } else if (fieldType == "radio") {
                if (values[customfieldobj.reasonForTodaysVisit] &&
                    (values[customfieldobj.reasonForTodaysVisit] == "Routine Visit" ||
                        values[customfieldobj.reasonForTodaysVisit] == "Quarterly Visit" ||
                        values[customfieldobj.reasonForTodaysVisit] == "Collecting insulin")
                ) {
                    if (
                        fieldData.dataElement.id == customfieldobj.footulcer ||
                        fieldData.dataElement.id == customfieldobj.nephropathy ||
                        fieldData.dataElement.id == customfieldobj.neuropathy ||
                        fieldData.dataElement.id == customfieldobj.retinopathy)
                        validationResult.hideShow = false
                }

                setFieldStructure(
                    <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? customClassName : 'hide'}>
                        <Radios
                            id={fieldData.dataElement.id}
                            label={getTranslatedLabels(fieldData.dataElement)}
                            name={fieldData.dataElement.id}
                            required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                            data={optionSet != null ? optionSet : []}
                            className={customClassName}
                        // defaultValue={defaultValue}
                        />
                    </Grid>
                )

            } else if (fieldType == "dropdown") {
                if (!values[customfieldobj.typeOfDiabetes]) {
                    values[customfieldobj.typeOfDiabetes] = "Type 1"
                }
                if (fieldData.dataElement.id == "Rc0D1mmFu8K") {
                    if (values['ZTQ487xJDkp'] == "Yes") {
                        values['Rc0D1mmFu8K'] = "Positive"
                    }
                }
                
                // if(values[customfieldobj.regimeTypeManagement] && values[customfieldobj.regimeTypeManagement] == "Basal-bolus")
                // {
                //     if(fieldData.dataElement.id == customfieldobj.insulinFrequency)
                //     {
                //         values[customfieldobj.insulinFrequency] = "Three times a day"
                //         customProps = { ...customProps,key: Math.random() * 9999, disabled: true };
                //     }
                // }

                if (values[customfieldobj.typeOfMedication] && values[customfieldobj.typeOfMedication] == "Other") {
                    if (fieldData.dataElement.id == customfieldobj.insulinType ||
                        fieldData.dataElement.id == customfieldobj.nonInsulinFrequency ||
                        fieldData.dataElement.id == customfieldobj.insulinFrequency ||
                        fieldData.dataElement.id == customfieldobj.insulinName
                    ) {
                        validationResult.hideShow = false
                    }
                }
                if (values[customfieldobj.typeOfMedication] && values[customfieldobj.typeOfMedication] != "Other") {
                    if (fieldData.dataElement.id == customfieldobj.otherMedFrequency) {
                        validationResult.hideShow = false
                    }
                }

                if (values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] == "Non-Insulin") {
                    if (
                        // fieldData.dataElement.id == customfieldobj.typeOfInsulinRoutineVisits|| 
                        fieldData.dataElement.id == customfieldobj.nameOfInsulinRoutineVisits ||
                        fieldData.dataElement.id == customfieldobj.frequencyRoutineVisits) {
                        validationResult.hideShow = false
                    }
                    if (fieldData.dataElement.id == customfieldobj.frequencyOfNonInsulinRoutineVisits) {
                        validationResult.hideShow = true
                    }
                }
                if (values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] == "Insulin") {
                    if (fieldData.dataElement.id == customfieldobj.frequencyOfNonInsulinRoutineVisits) {
                        validationResult.hideShow = false
                    }
                }
                if (!values[customfieldobj.typeOfMedicationRoutineVisits]) {
                    if (fieldData.dataElement.id == customfieldobj.frequencyOfNonInsulinRoutineVisits ||
                        fieldData.dataElement.id == customfieldobj.frequencyOfAddMedicationRoutineVisits ||
                        fieldData.dataElement.id == customfieldobj.frequencyOfmissedDosesRoutineVisits ||
                        fieldData.dataElement.id == customfieldobj.frequencyOfbloodGlucoseRoutineVisits) {
                        validationResult.hideShow = false
                    }
                }
                // if(values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] == "Other") 
                //     { 
                //         if(fieldData.dataElement.id == customfieldobj.typeOfInsulinRoutineVisits || 
                //             fieldData.dataElement.id == customfieldobj.nameOfInsulinRoutineVisits || 
                //             fieldData.dataElement.id == customfieldobj.frequencyRoutineVisits || 
                //             fieldData.dataElement.id == customfieldobj.frequencyOfNonInsulinRoutineVisits ) 
                //             { 
                //                 validationResult.hideShow = false 
                //             } 
                //     } 
                if (values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] != "Other") {
                    if (fieldData.dataElement.id == customfieldobj.frequencyOfAddMedicationRoutineVisits ||
                        fieldData.dataElement.id == customfieldobj.frequencyOfmissedDosesRoutineVisits ||
                        fieldData.dataElement.id == customfieldobj.frequencyOfbloodGlucoseRoutineVisits) {
                        validationResult.hideShow = false
                    }
                }

                if (fieldData.dataElement.id == customfieldobj.treatmentstartedId && customfieldobj.tptIntiationStageId) {
                    try {
                        document.querySelector('.section-1-' + customfieldobj.tptIntiationStageId).style.display = 'none'
                        if (values[customfieldobj.treatmentstartedId] == 'Yes') {
                            document.querySelector('.section-1-' + customfieldobj.tptIntiationStageId).style.display = 'block'
                        }
                    } catch (e) {

                    }
                }
                if (fieldData.dataElement.id == customfieldobj.CRPreportavailableID) {
                    customProps = { ...customProps, className: "hide", required: false, validate: false };
                    if (values && values[customfieldobj.hivStatusId] && values[customfieldobj.hivStatusId] == 'Positive') {
                        customProps = { ...customProps, className: "", required: false, validate: false };
                    }
                }
                if (fieldData.dataElement.id == customfieldobj.patientStatus) {
                    if (values && values[customfieldobj.changestatus] != 'Yes') {
                        // fieldData.dataElement.attributeValues[0].attribute.name = 'isDisabled'
                        if (APP_LOCALE === 'PRODUCT') {
                            fieldData.dataElement.attributeValues[0].attribute.name = 'isDisabled';
                        }
                    }
                    else if (values && values[customfieldobj.changestatus] == 'Yes') {
                        fieldData.dataElement.attributeValues[0].attribute.name = 'ShowInTable'
                    }
                    if (values && values[customfieldobj.patientStatus] == 'On Treatment') {
                        customProps = { ...customProps, disabled: true };
                    }
                }

                if (fieldData.dataElement.id == customfieldobj.regimeTypeManagement) {
                    customProps = { ...customProps, disabled: true };
                }

                if (fieldData.dataElement.id == customfieldobj.insulinType) {
                    customProps = { ...customProps, disabled: true };
                }

                if (fieldData.dataElement.id == customfieldobj.patientStatus) {
                    if (!values[customfieldobj.changestatus]) {
                        values[customfieldobj.changestatus] = "No"
                    }
                }

                if (fieldData.dataElement.id == customfieldobj.HaveyouhadanycontactwithTBdiseasepatientID || fieldData.dataElement.id == customfieldobj.Haveyoucomecontactwithsomeonepast5yearsID) {
                    if (values[customfieldobj.clientTypeID] && Configuration && Configuration.ltbiLinkVariables && values[customfieldobj.clientTypeID] == Configuration.ltbiLinkVariables.contact) {
                        customProps = {
                            ...customProps,
                            className: 'hide'
                        }
                    }

                }

                try {
                    if (fieldData.dataElement.id == customfieldobj.testingforTBinfectionID) {
                        if (values && values[fieldData.dataElement.id]) {
                            if (customProps && customProps.className == 'hide') {
                                delete values[fieldData.dataElement.id]
                            }
                        }
                    }

                    if (fieldData.dataElement.id == customfieldobj.eligibleforTPTId) {
                        customProps = { ...customProps, className: "hide" };
                        if (validationResult.hideShow == true && values[symptomsFID] && values[symptomsFID].includes(customfieldobj.noneOptionID) && values[customfieldobj.CXRreportavailableID] && (values[customfieldobj.CXRreportavailableID] == 'No' || (values[customfieldobj.CXRresultId] && values[customfieldobj.CXRresultId] == 'Not suggestive of TB')) && values[customfieldobj.mWRDreportavailableID] && (values[customfieldobj.mWRDreportavailableID] == 'No' || (values[customfieldobj.mWRDresultId] && values[customfieldobj.mWRDresultId] == 'Negative'))) {
                            //customProps = { ...customProps, className: "" };
                            if (((!values[customfieldobj.hivStatusId] || values[customfieldobj.hivStatusId] != 'Positive')) || (values[customfieldobj.hivStatusId] && values[customfieldobj.hivStatusId] == 'Positive' && values[customfieldobj.CRPreportavailableID] && (values[customfieldobj.CRPreportavailableID] == 'No' || (values[customfieldobj.CRPresultId] && values[customfieldobj.CRPresultId] == 'Negative')))) {
                                customProps = { ...customProps, className: "" };
                            }
                        }
                        if (values[customfieldobj.eligibleforTPTId] && values[customfieldobj.testingforTBinfectionID] && values[customfieldobj.testingforTBinfectionID] == 'Yes') {
                            delete values[fieldData.dataElement.id]
                        }

                    }
                } catch (e) {

                }
                try {
                    if (values[fieldData.dataElement.id]) {
                        let isValueExist = true;
                        isValueExist = optionSet.find(
                            (obj) => obj.value == values[fieldData.dataElement.id]
                        );
                        if (isValueExist == undefined) {
                            delete values[fieldData.dataElement.id]
                        }
                    }
                } catch (e) {

                }
                if (validationResult.hideShow == true) {
                    const isDisabledField =
                        (fieldData.dataElement.id === customfieldobj.regimeTypeManagement ||
                            fieldData.dataElement.id === customfieldobj.insulinType) && customProps.disabled;
                    setFieldStructure(
                        //     <Grid
                        //     item
                        //     xs={12}
                        //     sm={getTranslatedLabels(fieldData.dataElement) === 'Type of Medication' ? 6 : 4}
                        //     md={getTranslatedLabels(fieldData.dataElement) === 'Type of Medication' ? 6 : 4}
                        //     {...customProps}
                        //   >
                        // first medical therapy section 
                        // Grid item xs={12} sm={2} md={2}
                        // , opacity: 0.5 
                        <div {...customProps} style={isDisabledField ? { pointerEvents: 'none'} : {}}>

                            {/* <Grid item xs={12} sm={getTranslatedLabels(fieldData.dataElement) === 'Type of Medication' ? 12 : 4} md={getTranslatedLabels(fieldData.dataElement) === 'Type of Medication' ? 12 : 4} {...customProps}> */}
                            <Field
                                id={fieldData.dataElement.id}
                                name={fieldData.dataElement.id}
                                label={getTranslatedLabels(fieldData.dataElement)}
                                // type={fieldData.dataElement.valueType}

                                component={SingleSelectFieldFF}
                                key={fieldData.dataElement.id}
                                validate={fieldData.compulsory && validationResult.hideShow == true ? hasValue : false}
                                required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                                options={optionSet != null ? optionSet : []}
                                disabled={isDisabledField ? true : fieldData.dataElement.attributeValues && fieldData.dataElement.attributeValues.length > 0 ? fieldData.dataElement.attributeValues[0].attribute.name == 'isDisabled' ? true : false : false}

                                // onChange={() => this.onDropdownOptionChange(attribute.dataElement)}
                                className={customClassName}
                            // className={getTranslatedLabels(fieldData.dataElement) === 'Type of Medication' ? `${customClassName} customWidth` : customClassName}
                            />
                        </div>
                    )
                } else {
                    setFieldStructure(
                        // Grid item xs={12} sm={2} md={2}
                        <div className={'hide'}>
                            <Field
                                name={fieldData.dataElement.id}
                                label={getTranslatedLabels(fieldData.dataElement)}
                                type={'text'}
                                component={InputFieldFF}
                                key={fieldData.dataElement.id}
                                required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                                validate={composeValidators(required, scriptCheck)} //fieldData.compulsory && validationResult.hideShow == true ? hasValue : false
                                value=''
                                className={customClassName}
                            />
                        </div>
                    )
                }

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

// function DateFieldConfig(props) {
//     let fieldData = props.fieldData
//     let programRules = props.programRules
//     let programRulesVariables = props.programRulesVariables
//     let values = props.values
//     let customClassName = props.customClassName
//     let dataElementGroup = props.dataElementGroup
//     let customfieldobj = props.customfieldobj
//     let showYear = fieldData.dataElement.attributeValues.length > 0 && fieldData.dataElement.attributeValues[0].attribute.name == "showyear" ? true : false
//     let hideField = fieldData.dataElement.attributeValues.length > 0 && fieldData.dataElement.attributeValues[0].attribute.name == "hideField" ? true : false
//     let customProps = {}
//     let ismaskable = props.ismaskable
//     const [fieldStructure, setFieldStructure] = useState(null)
//     const [selectedDate, setDate] = useState(new Date());
//     const [validationResult, setValidationResult] = useState(null)

//     function fetchValidation() {
//         const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
//         setValidationResult(validationResult)
//     }

//     useEffect(() => {
//         fetchValidation()
//     }, [values])

//     useEffect(() => {
//         const dataFormat1 = getDateFormat("dateformat");
//         if (validationResult != null) {
//             // if(fieldData.dataElement.id == customfieldobj.dateOfAppointment) 
//             //     { 
//             //         customProps = {
//             //             ...customProps,
//             //             validate: composeValidators(required),
//             //         }; 
//             //     }

//             const defaultDateFlagKey = `defaultdateflag_${fieldData.dataElement.id}`;
//             const defaultdateflag = sessionStorage.getItem(defaultDateFlagKey);
//             if (defaultdateflag === null) {
//                 const shouldSetDefaultDate = checkFieldCondition_dhis_(fieldData);

//                 if (shouldSetDefaultDate) {
//                     if (values[fieldData.dataElement.id]) {

//                     }
//                     else {
//                         values[fieldData.dataElement.id] = selectedDate;
//                         // sessionStorage.setItem('defaultdateflag', "true");
//                         sessionStorage.setItem(defaultDateFlagKey, "true");
//                     }

//                 } else {
//                 }
//             }
//             else if (defaultdateflag === "true") {
//                 const shouldSetDefaultDate_ = checkFieldCondition_dhis_(fieldData);

//                 if (shouldSetDefaultDate_) {
//                     if (values[fieldData.dataElement.id]) {

//                     }
//                     else {
//                         values[fieldData.dataElement.id] = selectedDate;
//                     }

//                 }
//             }
//             if (values[customfieldobj.dateofInitialAssessment] && values[customfieldobj.dateOfDiagnosis]) {
//                 let initialAssessmentDate = new Date(values[customfieldobj.dateofInitialAssessment]);
//                 let diagnosisDate = new Date(values[customfieldobj.dateOfDiagnosis]);


//                 if (diagnosisDate > initialAssessmentDate) {
//                     delete values[customfieldobj.dateOfDiagnosis];
//                     setDate(null);
//                     swal({
//                         icon: "warning",
//                         title: "Invalid Date Selection",
//                         text: `Date of Diagnosis cannot be later than Initial Assessment Date.`,
//                         confirmButtonText: "OK"
//                     });
//                 }
//             }
//             //
//             if (fieldData.dataElement.id == customfieldobj.dateOfDiagnosis) {
//                 fieldData.allowFutureDate = false
//             }

//             if (fieldData.dataElement.id == customfieldobj.dateOfLastFollowUp &&
//                 values[customfieldobj.patientStatus] &&
//                 values[customfieldobj.patientStatus] != "Died" &&
//                 values[customfieldobj.patientStatus] != "Lost to follow up") {
//                 customProps = {
//                     ...customProps,
//                     className: "hide"
//                 }
//             }


//             let disablePastVal = fieldData?.dataElement?.attributeValues && fieldData?.dataElement?.attributeValues.length > 0 && fieldData?.dataElement?.attributeValues.map((getAttr) => {
//                 if (getAttr.attribute.name && getAttr.attribute.name == "disablePastDate") {
//                     return getAttr.value;
//                 }
//             }).find(val => val !== undefined) || false;

//             let fieldValue = values[fieldData.dataElement.id];
//             let displayValue;
//             if (ismaskable && fieldValue) {

//                 // const formattedValue = moment(fieldValue).format(dataFormat1); 

//                 const formattedValue = format(new Date(fieldValue), dataFormat1);

//                 displayValue = maskText(formattedValue);

//             }
//             // outcome fields value

//             setFieldStructure(
//                 // Grid item xs={12} 
//                 // <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? ''  : 'hide'}{...customProps} style={{ marginBottom: '18px' }}>
//                 <div sm={fieldData.dataElement.id === "WUI6MrQ7Jl7" ? 12 : 2} md={fieldData.dataElement.id === "WUI6MrQ7Jl7" ? 12 : 2} className={validationResult.hideShow ? '' : 'hide'} {...customProps}>
//                     {!ismaskable ? (
//                         <DatePicker
//                             disabled={showYear ? true : false}
//                             label={getTranslatedLabels(fieldData.dataElement)}
//                             name={fieldData.dataElement.id}
//                             required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
//                             dateFunsUtils={DateFnsUtils}
//                             // value={values[fieldData.dataElement.id] == undefined ? selectedDate : values[fieldData.dataElement.id]}
//                             margin="normal1"
//                             variant="inline"
//                             className={hideField ? "hide " : customClassName}
//                             format={showYear == true ? "yyyy" : dataFormat1}
//                             validate={fieldData.compulsory && validationResult.hideShow == true ? hasValue : false}
//                             disableFuture={fieldData.allowFutureDate && fieldData.allowFutureDate == true ? false : true}
//                             // disableFuture={fieldData.allowFutureDate ? fieldData.allowFutureDate : false}
//                             disablePast={disablePastVal}
//                         />
//                     ) : (
//                         <Field
//                             disabled
//                             name={fieldData.dataElement.id}
//                             type='text'
//                             component={InputFieldFF}
//                             key={fieldData.dataElement.id}
//                             label={getTranslatedLabels(fieldData.dataElement)}

//                             format={value => displayValue} // Here displayValue should already have the correct masking logic applied
//                             parse={value => value}
//                             validate={fieldData.compulsory && validationResult.hideShow == true ? hasValue : false}
//                             className={customClassName}
//                         />


//                     )}
//                 </div>
//             )
//         }

//     }, [validationResult, localStorage.getItem("locale")])

//     return (
//         <>
//             {fieldStructure != null ? fieldStructure : <> </>

//             }
//         </>
//     )

// }
function DateFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup
    let customfieldobj = props.customfieldobj
    let showYear = fieldData.dataElement.attributeValues.length > 0 && fieldData.dataElement.attributeValues[0].attribute.name == "showyear" ? true : false
    let hideField = fieldData.dataElement.attributeValues.length > 0 && fieldData.dataElement.attributeValues[0].attribute.name == "hideField" ? true : false
    let customProps = {}
    let ismaskable = props.ismaskable
    const [fieldStructure, setFieldStructure] = useState(null)
    const [selectedDate, setDate] = useState(new Date());
    const [validationResult, setValidationResult] = useState(null)
    const [selectedDateethiopia, setDateEthiopia] = useState(null); //For Ethiopia
    const config = useConfig();
    const { t } = useTranslation();


    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        if (APP_LOCALE == "CC004") {
            if (values[fieldData.dataElement.id]) {
                const storedDate = values[fieldData.dataElement.id];  // Example: "2025-01-23"
                const [year, month, day] = storedDate.split('-').map(Number);

                // Convert Gregorian to Ethiopian for display purposes
                const ethiopianDate = toEthiopianDateString(new Date(year, month - 1, day));

                // Assuming Ethiopian date is in the format "Day Month Year"
                setDateEthiopia(new Date(year, month - 1, day));
            }
        }
    }, [values[fieldData.dataElement.id]]);

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        const dataFormat1 = getDateFormat("dateformat");
        if (validationResult != null) {
            // if(fieldData.dataElement.id == customfieldobj.dateOfAppointment) 
            //     { 
            //         customProps = {
            //             ...customProps,
            //             validate: composeValidators(required),
            //         }; 
            //     }

            const defaultDateFlagKey = `defaultdateflag_${fieldData.dataElement.id}`;
            const defaultdateflag = sessionStorage.getItem(defaultDateFlagKey);
            if (defaultdateflag === null) {
                const shouldSetDefaultDate = checkFieldCondition_dhis_(fieldData);

                if (shouldSetDefaultDate) {
                    if (values[fieldData.dataElement.id]) {

                    }
                    else {
                        if (APP_LOCALE == "CC004") {
                            values[fieldData.dataElement.id] = selectedDateethiopia;
                        }
                        else {
                            values[fieldData.dataElement.id] = selectedDate;
                        }
                        // sessionStorage.setItem('defaultdateflag', "true");
                        sessionStorage.setItem(defaultDateFlagKey, "true");
                    }

                } else {
                }
            }
            else if (defaultdateflag === "true") {
                const shouldSetDefaultDate_ = checkFieldCondition_dhis_(config, 'createfield', values, customfieldobj, fieldData);

                if (shouldSetDefaultDate_) {
                    if (values[fieldData.dataElement.id]) {

                    }
                    else {
                        if (APP_LOCALE == "CC004") {
                            values[fieldData.dataElement.id] = selectedDateethiopia;
                        }
                        else {
                            values[fieldData.dataElement.id] = selectedDate;
                        }
                    }

                }
            }
            if (values[customfieldobj.dateofInitialAssessment] && values[customfieldobj.dateOfEntry] && APP_LOCALE === "CC002") {
                let initialAssessmentDate = new Date(values[customfieldobj.dateofInitialAssessment]);
                let entryDate = new Date(values[customfieldobj.dateOfEntry]);

                if (entryDate < initialAssessmentDate) {
                    values[customfieldobj.dateOfEntry] = null;
                    delete values[customfieldobj.dateOfEntry];
                    setDate(null);
                    swal({
                        icon: "warning",
                        title: t("Invalid Date Selection"),
                        text: t(`Date of Entry cannot be before the Initial Assessment Date`),
                        confirmButtonText: t("OK")
                    });
                }
            }
            if (values[customfieldobj.dateofInitialAssessment] && values[customfieldobj.dateOfFollowUp] && APP_LOCALE === "CC002") {
                let initialAssessmentDate = new Date(values[customfieldobj.dateofInitialAssessment]);
                let followUpDate = new Date(values[customfieldobj.dateOfFollowUp]);
                if (followUpDate < initialAssessmentDate) {
                    values[customfieldobj.dateOfFollowUp] = null;
                    delete values[customfieldobj.dateOfFollowUp];
                    setDate(null);
                    swal({
                        icon: "warning",
                        title: t("Invalid Date Selection"),
                        text: t(`Follow up Date cannot be before the Initial Assessment Date`),
                        confirmButtonText: t("OK")
                    });
                }
            }

            if (values[customfieldobj.dateofInitialAssessment] && values[customfieldobj.dateOfDiagnosis]) {
                let initialAssessmentDate = new Date(values[customfieldobj.dateofInitialAssessment]);
                let diagnosisDate = new Date(values[customfieldobj.dateOfDiagnosis]);


                if (diagnosisDate > initialAssessmentDate) {
                    delete values[customfieldobj.dateOfDiagnosis];
                    setDate(null);
                    swal({
                        icon: "warning",
                        title: t("Invalid Date Selection"),
                        text: t(`Date of Diagnosis cannot be later than Initial Assessment Date`),
                        confirmButtonText: t("OK")
                    });
                }
            }
            //
            if (fieldData.dataElement.id == customfieldobj.dateOfDiagnosis) {
                fieldData.allowFutureDate = false
            }

            if (fieldData.dataElement.id == customfieldobj.dateOfLastFollowUp &&
                values[customfieldobj.patientStatus] &&
                values[customfieldobj.patientStatus] != "Died" &&
                values[customfieldobj.patientStatus] != "Lost to follow up") {
                customProps = {
                    ...customProps,
                    className: "hide"
                }
            }


            // let disablePastVal = fieldData?.dataElement?.attributeValues && fieldData?.dataElement?.attributeValues.length > 0 && fieldData?.dataElement?.attributeValues.map((getAttr) => {
            //     if (getAttr.attribute.name && getAttr.attribute.name == "disablePastDate" && getAttr.attribute.value === 'true') {
            //         return true;
            //     }
            // }).find(val => val !== undefined) || false;
            let disablePastVal = fieldData?.dataElement?.attributeValues?.some(
                (getAttr) =>
                    getAttr.attribute?.name === "disablePastDate" &&
                    getAttr.value === "true"
            );

            let fieldValue = values[fieldData.dataElement.id];
            let displayValue;
            if (ismaskable && fieldValue) {
                if (APP_LOCALE === "CC004") {
                    // Parse the stored date (assuming it's in YYYY-MM-DD format)
                    const [year, month, day] = fieldValue.split('-').map(Number);
                    const gregorianDate = new Date(year, month - 1, day);

                    // Convert to Ethiopian date format
                    const ethiopianDateString = toEthiopianDateString(gregorianDate);

                    displayValue = maskText(ethiopianDateString);
                } else {
                    // For non-Ethiopian locales, use the original logic
                    const formattedValue = format(new Date(fieldValue), dataFormat1);
                    displayValue = maskText(formattedValue);
                }
            }
            let content;

            if (!ismaskable) {
                const requiredDate = (value) => {
                    if (!value || value === '' || value === null || value === undefined) {
                        return t("Date is required");
                    }
                    return undefined; // No error
                };
                if (APP_LOCALE === "CC004") {
                    content = (
                        // <EtDatePicker
                        //   label={getTranslatedLabels(fieldData.dataElement)}
                        //             name={fieldData.dataElement.id}
                        //             className={customClassName}Add commentMore actions
                        //             locale="am-ET" // Ethiopian calendar locale
                        //             format="MMM dd/yyyy" 
                        //             value={selectedDateethiopia || ''}
                        //             onChange={(selectedDateethiopia) => {

                        //                 if (selectedDateethiopia instanceof Date && !isNaN(selectedDateethiopia.getTime())) {
                        //                   setDateEthiopia(selectedDateethiopia);

                        //                   // Store in YYYY-MM-DD format
                        //                 //   values[fieldData.dataElement.id] = selectedDate.toISOString().split('T')[0];

                        //                 const year = selectedDateethiopia.getFullYear();
                        //                 const month = String(selectedDateethiopia.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
                        //                 const day = String(selectedDateethiopia.getDate()).padStart(2, '0'); // Ensure two-digit day

                        //                 values[fieldData.dataElement.id] = `${year}-${month}-${day}`;
                        //                   } else {
                        //                   console.error("Invalid date received:", selectedDateethiopia);
                        //                 }
                        //               }}
                        // />
                        <Field
                            name={fieldData.dataElement.id}
                            key={`${fieldData.dataElement.id}-${validationResult.hideShow}`}
                            validate={fieldData.compulsory && validationResult.hideShow === true ? requiredDate : undefined}
                        >
                            {({ input, meta }) => {
                                // Determine if there's an error to show
                                const showError = ((meta.error && meta.touched) || (meta.error && meta.submitFailed));

                                return (
                                    <div>
                                        <EtDatePicker
                                            label={getTranslatedLabels(fieldData.dataElement)}
                                            name={fieldData.dataElement.id}
                                            className={`${customClassName} ethiopian-datepicker-tall`}
                                            locale="am-ET" // Ethiopian calendar locale
                                            format="MMM dd/yyyy"
                                            disableFuture={fieldData.allowFutureDate && fieldData.allowFutureDate == true ? false : true}
                                            disablePast={disablePastVal}
                                            value={input.value ? new Date(input.value) : selectedDateethiopia instanceof Date ? selectedDateethiopia : ''}
                                            onChange={(selectedDateethiopia) => {
                                                if (selectedDateethiopia instanceof Date && !isNaN(selectedDateethiopia.getTime())) {
                                                    setDateEthiopia(selectedDateethiopia);

                                                    // Store in YYYY-MM-DD format
                                                    const year = selectedDateethiopia.getFullYear();
                                                    const month = String(selectedDateethiopia.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
                                                    const day = String(selectedDateethiopia.getDate()).padStart(2, '0'); // Ensure two-digit day

                                                    const formattedDate = `${year}-${month}-${day}`;
                                                    values[fieldData.dataElement.id] = formattedDate;

                                                    // Update Field component value
                                                    input.onChange(formattedDate);
                                                } else {
                                                    console.error("Invalid date received:", selectedDateethiopia);
                                                    input.onChange(''); // Clear the field value
                                                }
                                            }}
                                            onBlur={input.onBlur}
                                            required={fieldData.compulsory && validationResult.hideShow === true}
                                            error={showError}
                                            helperText={showError ? meta.error : ""}
                                            InputLabelProps={{
                                                shrink: true, // Always shrink the label
                                                style: {
                                                    transform: 'translate(0, -8px) scale(1)',
                                                    transformOrigin: 'top left',
                                                    color: '#1976d2'
                                                }
                                            }}
                                        />
                                    </div>
                                );
                            }}
                        </Field>
                    );
                } else {
                    content = (
                        // <DatePicker
                        //  disabled={showYear ? true : false}
                        //  label={getTranslatedLabels(fieldData.dataElement)}
                        //  name={fieldData.dataElement.id}
                        //  required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
                        //  dateFunsUtils={DateFnsUtils}
                        //  margin="normal"
                        //  variant="inline"
                        //  format={showYear == true ? "yyyy" : dataFormat1}
                        //  validate={fieldData.mandatory && validationResult.hideShow == true ? hasValue : false}
                        //  // disableFuture={fieldData.allowFutureDate ? fieldData.allowFutureDate : false}
                        //  disableFuture={fieldData.allowFutureDate != false ? fieldData.allowFutureDate : true}
                        //  className={customClassName}
                        // />
                        <Field
                            name={fieldData.dataElement.id}
                            key={`${fieldData.dataElement.id}-${validationResult.hideShow}`}
                            validate={fieldData.compulsory && validationResult.hideShow === true ? requiredDate : undefined}
                        >
                            {({ input, meta }) => {
                                // Determine if there's an error to show
                                const showError = ((meta.error && meta.touched) || (meta.error && meta.submitFailed));

                                return (
                                    <DatePicker
                                        disabled={showYear ? true : false}
                                        label={getTranslatedLabels(fieldData.dataElement)}
                                        name={fieldData.dataElement.id}
                                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                                        dateFunsUtils={DateFnsUtils}
                                        value={input.value || null}
                                        onChange={(value) => {

                                            input.onChange(value);
                                        }}
                                        onBlur={input.onBlur}
                                        margin="normal"
                                        variant="inline"
                                        format={showYear === true ? "yyyy" : dataFormat1}
                                        views={showYear ? ["year"] : ["year", "month", "date"]}
                                        openTo={showYear ? "year" : "date"}
                                        disableFuture={fieldData.allowFutureDate && fieldData.allowFutureDate == true ? false : true}
                                        disablePast={disablePastVal}
                                        className={customClassName}
                                        error={showError}
                                        helperText={showError ? meta.error : ""}
                                    />
                                );
                            }}
                        </Field>
                    );
                }
            } else {
                content = (
                    <Field
                        disabled
                        name={fieldData.dataElement.id}
                        type='text'
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}

                        format={value => displayValue} // Here displayValue should already have the correct masking logic applied
                        parse={value => value}
                        className={customClassName}
                    />
                );
            }

            setFieldStructure(
                <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                    {content}
                </Grid>
            );
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
    let customClassName
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
            const dateFormat = getDateFormat('dateformat');
            setFieldStructure(
                <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <DateTimePicker
                        disabled={showYear ? true : false}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        name={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        dateFunsUtils={DateFnsUtils}
                        value={values[fieldData.dataElement.id] == undefined ? selectedDate : values[fieldData.dataElement.id]}
                        margin="normal"
                        variant="inline"
                        format={showYear == true ? "yyyy" : dateFormat}
                        views={showYear ? ["year"] : ["year", "month", "date"]}
                        openTo={showYear ? "year" : "date"}
                        validate={selectedDate.compulsory && validationResult.hideShow == true ? hasValue : false}
                        disableFuture={fieldData.allowFutureDate ? fieldData.allowFutureDate : false}
                        className={customClassName}
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
    const { t } = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup

    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    const mustBeNumber = value => (isNaN(value) && value ? t('Must be a number') : undefined)
    const minValue = min => value =>
        isNaN(value) || value >= min ? undefined : t('Should be greater than') + ' ' + min
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
                <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type="number"
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(required, mustBeNumber)}
                        className={customClassName}
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
    const { t } = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup

    const numberFormat = value =>
        isNaN(value) && value ? `Incorrect format` : undefined

    const maxLength = max => value => value ? isNaN(value) || value.length > max ? t('Should be less than') + ' ' + max : undefined : undefined
    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)

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
                <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type={'number'}
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(required, numberFormat, maxLength(12))}
                        className={customClassName}
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
    let customClassName = props.customClassName
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
                <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type={'email'}
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={email}
                        className={customClassName}
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
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup
    const [UIC, setUIC] = useState(null)

    async function getUIC() {
        if (UIC == null) {
            let getUIC = await apiServices.generateUIC(fieldData.dataElement.id)
            setUIC(getUIC.value)
        }

    }
    useEffect(() => {
        getUIC()
    }, [])

    return (
        <>
            {UIC != null ?
                <Grid item xs={12} sm={12} md={12}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type={fieldData.dataElement.valueType}
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        defaultValue={UIC}
                        disabled={true}
                        className={customClassName}
                    />
                </Grid>
                :
                <> </>
            }
        </>
    )
}

function DefaultStageValueField(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup
    const [randomNumber, setRandomNumber] = useState(null)

    async function getRandomNumber() {
        if (randomNumber == null) {
            let param = {
                length: 8
            }
            let getRandomNumber = await apiServices.generateRandomNumber(param)
            setRandomNumber(getRandomNumber.random)
        }

    }
    useEffect(() => {
        getRandomNumber()
    }, [])

    return (
        <>
            {randomNumber != null ?
                <Grid item xs={12} sm={12} md={12}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type={fieldData.dataElement.valueType}
                        component={InputFieldFF}
                        key={fieldData.dataElement.id}
                        defaultValue={randomNumber}
                        disbaled={true}
                        className={customClassName}
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
    let customClassName = props.customClassName
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
                <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Switches
                        label={getTranslatedLabels(fieldData.dataElement)}
                        name={fieldData.dataElement.id}
                        disableRipple
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        data={switchData}
                        className={customClassName}
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
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup
    let customfieldobj = props.customfieldobj
    let customProps = {}
    let showYear = fieldData.dataElement.attributeValues.length > 0 && fieldData.dataElement.attributeValues[0].attribute.name == "showyear" ? true : false
    const [fieldStructure, setFieldStructure] = useState(null)
    const [selectedDate, setDate] = useState(new Date());
    const [validationResult, setValidationResult] = useState(null)
    // const [error, setError] = useState(null); 
    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }
    // const initialTime = values[fieldData.dataElement.id] || null;
    // const [selectedTime, setSelectedTime] = useState(initialTime);
    const [selectedTime, setSelectedTime] = useState(null);
    const convertToTimePickerValue = (timeString) => {
        if (!timeString) return null;
        const now = new Date();
        const [hours, minutes] = timeString.split(":").map(Number);
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    };

    useEffect(() => {
        if (fieldData.dataElement.id === customfieldobj.fromtime) {
            const fromTimeValue = values[customfieldobj.fromtime];
            values[fieldData.dataElement.id] = fromTimeValue;
            setSelectedTime(convertToTimePickerValue(fromTimeValue));

        }
        if (fieldData.dataElement.id === customfieldobj.toTime) {
            const toTimeValue = values[customfieldobj.toTime];
            values[fieldData.dataElement.id] = toTimeValue;
            setSelectedTime(convertToTimePickerValue(toTimeValue));
        }
    }, [fieldData, customfieldobj, values]);



    useEffect(() => {
        fetchValidation()
    }, [values])
    const handleTimeChange = (time) => {
        const formattedTime = format(time, 'HH:mm');

        values[fieldData.dataElement.id] = formattedTime;
        setSelectedTime(time);
        // if (fieldData.compulsory && !time) {
        //     setError("This field is required.");
        // } else {
        //     setError(null);
        // }

    };


    useEffect(() => {
        if (validationResult != null) {
            setFieldStructure(
                <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <TimePicker
                        label={fieldData.dataElement.displayFormName}
                        name={fieldData.dataElement.id}
                        // error={fieldData.compulsory && !selectedTime} // Display error if required and no time is selected
                        // helperText={
                        //     fieldData.compulsory && !selectedTime
                        //         ? "This field is required."
                        //         : ""
                        // }// Display error message
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        dateFunsUtils={DateFnsUtils}
                        onChange={handleTimeChange}
                        value={selectedTime}
                        margin="normal"
                        variant="inline"
                        format="HH:mm"

                        className={customClassName}
                    />
                </Grid>
            )
        }

    }, [validationResult, selectedTime, localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )

}



function IntegerConfig(props) {

    const { t } = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    // const [values, setValues] = useState(props.values || {}); // Initialize local state

    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup
    let customfieldobj = props.customfieldobj
    let customProps = {}
    let programData = props.programData
    let currentstagename = props.currentstagename

    // const stagesList = programData.programStages


    //----------------------------DYNAMIC BMI-----------------------------//      
    const [deidval, setdeidval] = useState();
    const [dataElementId, setDataElementId] = useState();
    const [weightId, setWeightId] = useState();
    const [heightId, setHeightId] = useState();
    const [bmiUnit, setBmiUnit] = useState();
    const [variableBmiId, setVariableBmiId] = useState();
    const [variableWeight, setVariableWeight] = useState();
    const [variableHeight, setVariableHeight] = useState();
    const [weight, setWeight] = useState();
    const [height, setHeight] = useState();
    const [bmiValue, setBmiValue] = useState(""); // State to hold immediate BMI value
    const [localValues, setLocalValues] = useState({});
    const [renderTrigger, setRenderTrigger] = useState(0);
    const [forceUpdate, setForceUpdate] = useState(0);


    const proxiedValues = useMemo(() => {
        return new Proxy(values, {
            set(target, prop, value) {
                target[prop] = value; // Update the value in the original `values` object
                setForceUpdate(prev => prev + 1); // Trigger re-render
                return true;
            }
        });
    }, [values]);
    // Function to get data element ID by attribute name
    const getDataElementIdByAttribute = (stage, attributeName) => {
        const element = stage.programStageDataElements.find(el => {
            return el.dataElement.attributeValues.some(attr => attr.attribute.name === attributeName && attr.value === 'true');
        });
        return element ? element.dataElement.id : null;
    };

    // Function to check if the stage has the CalcBMI attribute
    const hasCalcBMIAttribute = (stage) => {
        return stage.attributeValues?.some(attr => attr.attribute.name === 'CalcBMI' && attr.value === 'true');
    };

    useEffect(() => {
    }, [fieldData, customfieldobj, values, programData]);

    // Fetch unit when programData changes
    useEffect(() => {
        const unit = getAttributeValue(programData.attributeValues, "BMIUnit");
        setBmiUnit(unit);
    }, [programData]);


    useEffect(() => {
        const currentStage = programData.programStages.find(stage => stage.name === currentstagename);
        if (currentStage && hasCalcBMIAttribute(currentStage)) {
            const deId = getDataElementIdByAttribute(currentStage, "BMIFlag");
            const wtId = getDataElementIdByAttribute(currentStage, "WeightForBMI");
            const htId = getDataElementIdByAttribute(currentStage, "HeightForBMI");



            if (deId && wtId && htId) {
                setdeidval(deId)
                const getbmifieldidkey = getKeyByValue(customfieldobj, deId);
                const getweightidkey = getKeyByValue(customfieldobj, wtId);
                const getheightidkey = getKeyByValue(customfieldobj, htId);
                const unit = getAttributeValue(programData.attributeValues, "BMIUnit");

                setDataElementId(deId);
                // deId,wtId,htId - Adding direct id here
                setWeightId(getweightidkey);
                setHeightId(getheightidkey);
                setBmiUnit(unit);
                setWeight(wtId);
                setHeight(htId);
            } else {

            }
        }


        const weightInput = document.getElementById(weight);
        const heightInput = document.getElementById(height);


        if (weightInput && heightInput) {
            // Function to calculate BMI
            const calculateAndUpdateBMI = () => {
                const variableweight = parseFloat(weightInput.value);
                const variableheight = parseFloat(heightInput.value);

                if (variableweight && variableheight) {
                    const calculatedBMI = dynamiccalculateBMI(variableweight, variableheight, bmiUnit);
                    values[dataElementId] = calculatedBMI;
                } else {
                    values[dataElementId] = "";
                }
            };

            // Attach listeners to update BMI on user input
            weightInput.addEventListener("input", calculateAndUpdateBMI);
            heightInput.addEventListener("input", calculateAndUpdateBMI);

            // Cleanup listeners on component unmount
            return () => {
                weightInput.removeEventListener("input", calculateAndUpdateBMI);
                heightInput.removeEventListener("input", calculateAndUpdateBMI);
            };
        }
    }, [fieldData, customfieldobj, values, programData]);


    //-----------------------------------------------------------------------------//
    const decimalregex = /^\d+(\.\d{1,2})?$/;
    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    const mustBeNumber = value => (isNaN(value) && value ? t('Must be a number') : undefined)
    const mustBeInteger = value =>
        (value && value % 1 !== 0 ? t('Age cannot be in Decimals') : undefined);

    const minValue = min => value =>
        isNaN(value) || value >= min ? undefined : t('Should be greater than/equal to') + ' ' + min

    const maxValue = max => value =>
        isNaN(value) || value <= max ? undefined : t('Should be less than/equal to') + ' ' + max

    const maxLength = max => value => value ? isNaN(value) || value.length > max ? t('Should be less than') + ' ' + (max + 1) + " " + 'digits' : undefined : undefined
    const validateDecimalPlaces = value => value ? isNaN(value) || decimalregex.test(value) ? undefined : t('Should be less than 3 decimal places') : undefined;

    const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    function calculateAge(Date1, Date2) {
        let dt2 = new Date(Date1);
        let dt1 = new Date(Date2).toISOString();

        var a = moment(dt2);
        var b = moment(dt1);

        var years = a.diff(b, "years");
        var birth = Math.abs(years);
        var age = Math.abs(years);
        return age == 0 || dt2 > dt1 ? "0" : age;
    }

    const dosageFields = [
        { label: 'Breakfast', key: 'dosage (breakfast)' },
        { label: 'Lunch', key: 'dosage (lunch)' },
        { label: 'Dinner', key: 'dosage (dinner)' }
    ];

    // State for dosage inputs display
    const [showWithPrepend, setShowWithPrepend] = useState(false); // or any condition based on your attribute

    useEffect(() => {
        // Check your attribute to determine how to display dosage fields
        const ele = fieldData.dataElement

        if (ele) {
            const showPrependAttr = fieldData.dataElement?.formName?.split(' ')[0] === 'Dosage' ? true : false
            setShowWithPrepend(showPrependAttr);
        }
    }, []);

    function calculateBMI(weightKg, heightCm) {
        // Convert height from centimeters to meters
        const heightM = heightCm / 100;

        // Calculate BMI
        let bmi = weightKg / (heightM * heightM);
        bmi = bmi.toFixed(2);
        return bmi;
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {

        if (validationResult != null) {
            // Fields to be hidden for value "Annual visit"
            if (values[customfieldobj.reasonForTodaysVisit] &&
                (values[customfieldobj.reasonForTodaysVisit] == "Routine Visit" ||
                    values[customfieldobj.reasonForTodaysVisit] == "Quarterly Visit" ||
                    values[customfieldobj.reasonForTodaysVisit] == "Collecting insulin")
            ) {
                if (fieldData.dataElement.id == customfieldobj.microalbuminuriaTestForNephropathy ||
                    fieldData.dataElement.id == customfieldobj.creatinine ||
                    fieldData.dataElement.id == customfieldobj.totalCholestrol ||
                    fieldData.dataElement.id == customfieldobj.ldlCholestrol ||
                    fieldData.dataElement.id == customfieldobj.hdlCholestrol ||
                    fieldData.dataElement.id == customfieldobj.triglyceride ||
                    fieldData.dataElement.id == customfieldobj.TSH ||
                    fieldData.dataElement.id == customfieldobj.freeT4 ||
                    fieldData.dataElement.id == customfieldobj.thyroidPeroxidaseAntibody ||
                    fieldData.dataElement.id == customfieldobj.footulcer ||
                    fieldData.dataElement.id == customfieldobj.nephropathy ||
                    fieldData.dataElement.id == customfieldobj.neuropathy ||
                    fieldData.dataElement.id == customfieldobj.retinopathy ||
                    fieldData.dataElement.id == customfieldobj.fundusPhotography ||
                    fieldData.dataElement.id == customfieldobj.totalCholestrol ||
                    fieldData.dataElement.id == customfieldobj.myocardialInfarction ||
                    fieldData.dataElement.id == customfieldobj.cerebrovascularAccident)
                    customProps = {
                        ...customProps,
                        className: "hide"
                    }
            }
            if (values[customfieldobj.reasonForTodaysVisit] &&
                (values[customfieldobj.reasonForTodaysVisit] == "Routine Visit" ||
                    values[customfieldobj.reasonForTodaysVisit] == "Collecting insulin")
            ) {
                if (fieldData.dataElement.id == customfieldobj.HbA1c)
                    customProps = {
                        ...customProps,
                        className: "hide"
                    }
            }

            // Insulin table rules for History stage
            // if(
            //     fieldData.dataElement.id == customfieldobj.course_of_days_Other || 
            //     fieldData.dataElement.id == customfieldobj.course_of_days_Insulin || 
            //     fieldData.dataElement.id == customfieldobj.course_of_days_NonInsulin ||
            //     fieldData.dataElement.id == customfieldobj.dosageOfAddMedicationRoutineVisits || 
            //     fieldData.dataElement.id == customfieldobj.dosageRoutineVisits  ||
            //     fieldData.dataElement.id == customfieldobj.nonInsulinDosage ||
            //     fieldData.dataElement.id == customfieldobj.courseOfDaysOfRoutineVisits
            //     )
            //     {
            //         validationResult.hideShow = false
            //     }
            //     if(values[customfieldobj.typeOfMedication] && values[customfieldobj.typeOfMedication] == "Insulin")
            //     {
            //         if(fieldData.dataElement.id == customfieldobj.regimeType || 
            //            fieldData.dataElement.id == customfieldobj.typeOfInsulinRoutineVisits || 
            //            fieldData.dataElement.id == customfieldobj.nameOfInsulinRoutineVisits || 
            //            fieldData.dataElement.id == customfieldobj.frequencyRoutineVisits || 
            //            fieldData.dataElement.id == customfieldobj.dosageRoutineVisits || 
            //             fieldData.dataElement.id == customfieldobj.courseOfDaysOfRoutineVisits )
            //             {
            //                 validationResult.hideShow = true
            //             }
            //     }
            //     if(values[customfieldobj.typeOfMedication] && values[customfieldobj.typeOfMedication] == "Non-Insulin")
            //         {
            //             if(fieldData.dataElement.id == customfieldobj.nonInsulinDosage || 
            //                 fieldData.dataElement.id == customfieldobj.course_of_days_NonInsulin )
            //                 {
            //                     validationResult.hideShow = true
            //                 }
            //     }
            //     if(values[customfieldobj.typeOfMedication] && values[customfieldobj.typeOfMedication] == "Others")
            //     {
            //         if(fieldData.dataElement.id == customfieldobj.nonInsulinDosage || 
            //             fieldData.dataElement.id == customfieldobj.insulinDosage ||
            //             fieldData.dataElement.id == customfieldobj.courseOfDays 
            //         )
            //             {
            //                 validationResult.hideShow = false
            //             }
            //     }



            //     if(values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] == "Others")
            //         {
            //             if(fieldData.dataElement.id == customfieldobj.course_of_days_Other || 
            //                 fieldData.dataElement.id == customfieldobj.dosageOfAddMedicationRoutineVisits
            //             )
            //                 {
            //                     validationResult.hideShow = true
            //                 }
            //         }

            // if (fieldData.dataElement.id == customfieldobj.bmiID && values[customfieldobj.weightID] && values[customfieldobj.heightID]) {
            //     values[customfieldobj.bmiID] = calculateBMI(values[customfieldobj.weightID], values[customfieldobj.heightID])
            //     customProps = {
            //         ...customProps,
            //         key: Math.random() * 9999
            //     }
            // }

            // if (fieldData.dataElement.id == customfieldobj.bmiID1 && values[customfieldobj.weightID1] && values[customfieldobj.heightID1]) {
            //     values[customfieldobj.bmiID1] = calculateBMI(values[customfieldobj.weightID1], values[customfieldobj.heightID1])
            //     customProps = {
            //         ...customProps,
            //         key: Math.random() * 9999
            //     }
            // }

            const currentStage = programData.programStages.find(stage => stage.name === currentstagename);

            if (currentStage) {
                const rangeValues = getRangeValues(currentStage, fieldData.dataElement.id);

                if (rangeValues) {
                    const keyName = getKeyByValue(customfieldobj, fieldData.dataElement.id);
                    const element = document.getElementById(fieldData.dataElement.id);
                    const field_value = values[customfieldobj[keyName]];
                    const handleInputChange = (event) => {
                        const { id, value } = event.target;

                        // Log the key up event

                        if (id === fieldData.dataElement.id) {
                            const timer = setTimeout(() => {
                                if (value !== null && value !== undefined && value !== "") {
                                    if (value < rangeValues.lowRange) {
                                        // If the value is less than the low range
                                        swal({
                                            title: t("Falls in Lower Range"),
                                            text: `${t("The value")} ${value} ${t("falls below the lower limit of")} ${rangeValues.lowRange}.`,
                                            icon: "warning",
                                            button: t("OK"),
                                        });
                                    } else if (value > rangeValues.highRange) {
                                        // If the value is greater than the high range
                                        swal({
                                            title: t("Falls in Higher Range"),
                                            text: `${t("The value")} ${value} ${t("exceeds the upper limit of")} ${rangeValues.highRange}.`,
                                            icon: "warning",
                                            button: t("OK"),
                                        });
                                    } else if (value >= rangeValues.lowRange && value <= rangeValues.highRange) {
                                        // if (rangeValues.lowRange < 50 && rangeValues.highRange > 120) {
                                        // If the value is within range, but the range is out of normal bounds
                                        // swal({
                                        //     title: "Out of Range",
                                        //     text: `The value ${value} is within the allowed range of ${rangeValues.lowRange} to ${rangeValues.highRange}, but the range itself is out of normal bounds.`,
                                        //     icon: "warning",
                                        //     button: "OK",
                                        // });
                                    }
                                }
                            }, 100);
                        }


                    };

                    if (element) {
                        element.addEventListener('focusout', handleInputChange);
                    }
                    //            
                } else {

                }

            } else {

            }

            if (values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] == "Other") {
                if (fieldData.dataElement.id == customfieldobj.dosageRoutineVisits ||
                    fieldData.dataElement.id == customfieldobj.courseOfDaysOfRoutineVisits ||
                    fieldData.dataElement.id == customfieldobj.dosageOfNonInsulinRoutineVisits) {
                    validationResult.hideShow = false
                }
            }

            if (values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] == "Insulin") {
                if (fieldData.dataElement.id == customfieldobj.dosageOfNonInsulinRoutineVisits ||
                    fieldData.dataElement.id == customfieldobj.dosageOfAddMedicationRoutineVisits ||
                    fieldData.dataElement.id == customfieldobj.noOfMealsRoutineVisits) {
                    validationResult.hideShow = false
                }
            }

            if (values[customfieldobj.typeOfMedicationRoutineVisits] && values[customfieldobj.typeOfMedicationRoutineVisits] == "Non-Insulin") {
                if (fieldData.dataElement.id == customfieldobj.dosageRoutineVisits ||
                    fieldData.dataElement.id == customfieldobj.courseOfDaysOfRoutineVisits ||
                    fieldData.dataElement.id == customfieldobj.dosageOfAddMedicationRoutineVisits ||
                    fieldData.dataElement.id == customfieldobj.noOfMealsRoutineVisits) {
                    validationResult.hideShow = false
                }

                if (fieldData.dataElement.id == customfieldobj.dosageOfNonInsulinRoutineVisits) {
                    validationResult.hideShow = true
                }

            }

            if (!values[customfieldobj.typeOfMedicationRoutineVisits]) {
                if (fieldData.dataElement.id == customfieldobj.dosageOfNonInsulinRoutineVisits ||
                    fieldData.dataElement.id == customfieldobj.dosageOfAddMedicationRoutineVisits ||
                    fieldData.dataElement.id == customfieldobj.noOfMealsRoutineVisits) {
                    validationResult.hideShow = false
                }
            }

            let fieldDisabled = false;
            if (fieldData.dataElement.id == customfieldobj.ageAtCDIC && values[customfieldobj.registrationDate] && values[customfieldobj.dobID]) {
                try {
                    values[fieldData.dataElement.id] = calculateAge(values[customfieldobj.registrationDate], values[customfieldobj.dobID]);
                    fieldDisabled = true;
                    customProps = {
                        ...customProps,
                        key: Math.random() * 9999,
                        disabled: true
                    };
                } catch (e) {

                }
            }
            if (fieldData.dataElement.id == customfieldobj.ageAtDeath && values[customfieldobj.dateOfDeath]) {
                try {
                    values[fieldData.dataElement.id] = calculateAge(values[customfieldobj.dateOfDeath], values[customfieldobj.dobID]);
                    fieldDisabled = true;
                    customProps = {
                        ...customProps,
                        key: Math.random() * 9999,
                        disabled: true
                    };
                } catch (e) {

                }
            }
            if (fieldData.dataElement.id == customfieldobj.durationInCDIC && values[customfieldobj.registrationDate]) {
                try {
                    values[fieldData.dataElement.id] = calculateAge(values[customfieldobj.dateOfRollOut], values[customfieldobj.registrationDate]);
                    fieldDisabled = true;
                    customProps = {
                        ...customProps,
                        key: Math.random() * 9999,
                        disabled: true
                    };
                } catch (e) {
                }
            }


            if (fieldData.dataElement.id == customfieldobj.ageAtCDIC && values[customfieldobj.ageUID]) {
                customProps = {
                    ...customProps,
                    validate: composeValidators(maxValue(values[customfieldobj.ageUID])),
                };
            }
            if (fieldData.dataElement.id == customfieldobj.ageAtCDIC) {
                customProps = {
                    ...customProps,
                    validate: composeValidators(mustBeInteger),
                };
            }

            if (fieldData.dataElement.id == customfieldobj.durationOfDiabetes && values[customfieldobj.dateOfDiagnosis]) {
                try {
                    values[fieldData.dataElement.id] = calculateAge(values[customfieldobj.dateOfRollOut], values[customfieldobj.dateOfDiagnosis]);
                    fieldDisabled = true;
                    customProps = {
                        ...customProps,
                        key: Math.random() * 9999,
                        disabled: true
                    };
                } catch (e) {
                }
            }
            if (fieldData.dataElement.id == customfieldobj.pulsebpm) {

                customProps = {
                    ...customProps,
                    validate: composeValidators(required, mustBeNumber, maxLength(3)),
                };
            }
            if (fieldData.dataElement.id == customfieldobj.HbA1c) {
                customProps = {
                    ...customProps,
                    validate: composeValidators(required, mustBeNumber, validateDecimalPlaces),
                };
            }
            // dosage field
            setFieldStructure(
                // Grid item xs={12} sm={2} md={2}
                <div className={validationResult.hideShow == true ? '' : 'hide'}>
                    {showWithPrepend ? (
                        <div className="input-group-vertical input-dosageField">
                            <label className="input-label">
                                {fieldData.dataElement.formName.split(' ')[0]}
                            </label>
                            <div className="input-group">
                                <span className="input-group-text"
                                    style={
                                        composeValidators(required, mustBeNumber, minValue(0))
                                            ? {}
                                            : { marginBottom: '18px', marginRight: '-12px' }
                                    }>
                                    {(() => {
                                        const words = fieldData?.dataElement?.formName?.split(' ') || [];

                                        // Log if the second word is missing
                                        if (!words[1]) {
                                        }

                                        // return words[1] 
                                        //     ? words[1].replace(/[()]/g, '').charAt(0).toUpperCase() + words[1].replace(/[()]/g, '').slice(1) 
                                        //     : ''; 
                                    })()}
                                    {/* {fieldData.dataElement.formName.split(' ')[1]
                            .replace(/[()]/g, '')
                            .charAt(0)
                            .toUpperCase() + 
                        fieldData.dataElement.formName.split(' ')[1]
                            .replace(/[()]/g, '')
                            .slice(1)} */}
                                    {APP_LOCALE === 'CC006'
                                        ? fieldData.dataElement.formName.split(' ')[0]
                                            .replace(/[()]/g, '')
                                            .charAt(0)
                                            .toUpperCase() +
                                        fieldData.dataElement.formName.split(' ')[0]
                                            .replace(/[()]/g, '')
                                            .slice(1)
                                        : fieldData.dataElement.formName.split(' ')[1]
                                            .replace(/[()]/g, '')
                                            .charAt(0)
                                            .toUpperCase() +
                                        fieldData.dataElement.formName.split(' ')[1]
                                            .replace(/[()]/g, '')
                                            .slice(1)
                                    }
                                </span>
                                <Field
                                    name={fieldData.dataElement.id}
                                    type={'number'}
                                    label={
                                        fieldData.dataElement.formName.split(' ')[1] === 'breakfast'
                                            ? fieldData.dataElement.formName.split(' ')[0]
                                            : null
                                    }
                                    component={InputFieldFF}
                                    key={fieldData.dataElement.id}
                                    className="input-field"
                                    validate={composeValidators(required, mustBeNumber, minValue(0))}
                                    parse={(value) => {
                                        if (value && typeof value === "string") {
                                            // Preserve leading zero for numbers starting with '0.'
                                            if (value.startsWith("0.") || value === "0") {
                                                return value;
                                            }
                                            const sanitized = value.replace(/^0+/, '').replace(/^\./, '');
                                            return sanitized === '' ? '0' : sanitized;
                                        }
                                        return value;
                                    }}
                                />
                            </div>
                        </div>


                    ) : (
                        <Field
                            name={fieldData.dataElement.id}
                            label={getTranslatedLabels(fieldData.dataElement)}
                            type={'number'}
                            component={InputFieldFF}
                            key={fieldData.dataElement.id}
                            required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                            validate={composeValidators(required, mustBeNumber, minValue(fieldData.dataElement.id != customfieldobj.durationInCDIC && fieldData.dataElement.id != customfieldobj.durationOfDiabetes ? 0 : 0))}
                            value=""

                            className={customClassName}
                            {...customProps}
                            parse={(value) => {
                                if (value && typeof value === "string") {
                                    // Preserve leading zero for numbers starting with '0.'
                                    if (value.startsWith("0.") || value === "0") {
                                        return value;
                                    }
                                    const sanitized = value.replace(/^0+/, '').replace(/^\./, '');
                                    return sanitized === '' ? '0' : sanitized;
                                }
                                return value;
                            }}
                        />
                    )}
                </div>
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

function sanitizeNumber(input) {
    const sanitized = input.replace(/^0+/, '');
    return sanitized === '' ? '0' : sanitized;
}

function TextAreaConfig(props) {
    const { t } = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)
    const scriptCheck = value => (value ? value.match(/<[^>]*>/g) != null ? t('Incorrect expression "< or >" added as input') : undefined : undefined)
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
                <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        type={'text'}
                        component={TextAreaFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(required, scriptCheck)}
                        autoGrow
                        className={customClassName}
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
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup
    let orgunitid = props.programorgid
    const [dropdownOptions, setDropdownOptions] = useState([])
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }
    function fetchCustomUsersList() {

        setGlobalSpinner(true)
        let options = [];
        apiServices.getAPI('users?paging=true&page=1&pageSize=10&query=&fields=firstName,surname,userCredentials[username],id&ou=' + orgunitid)
            .then(response => {
                setGlobalSpinner(false)

                response.data.users.map(user => {
                    let obj = {
                        'id': user.id,
                        'label': user.firstName + " " + user.surname,
                        'value': user.id,
                    }
                    options.push(obj)
                    setDropdownOptions(options)
                    setGlobalSpinner(false)
                })
            }).catch(err => {
                setGlobalSpinner(false)

            })

    }
    useEffect(() => {
        fetchCustomUsersList();
    }, [])
    useEffect(() => {
        fetchValidation()
    }, [values])

    useEffect(() => {
        if (validationResult != null && dropdownOptions.length > 0) {
            setFieldStructure(
                <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                    {/* old code commented
                    <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        component={TextAreaFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(hasValue, dhis2Username)}
                    /> */}
                    <Field
                        id={fieldData.dataElement.id}
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        component={SingleSelectFieldFF}
                        key={fieldData.dataElement.id}
                        validate={fieldData.compulsory && validationResult.hideShow == true ? hasValue : false}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        options={dropdownOptions}
                        disabled={fieldData.dataElement.attributeValues && fieldData.dataElement.attributeValues.length > 0 ? fieldData.dataElement.attributeValues[0].attribute.name == 'isDisabled' ? true : false : false}
                        className={customClassName}
                    />
                </Grid>
            )
        }

    }, [validationResult, dropdownOptions, localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function URLConfig(props) {
    const { t } = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    const required = value => (fieldData.compulsory && validationResult.hideShow == true ? value ? undefined : t('Required') : undefined)

    const URLCheck = value => (regexp.test(value) ? undefined : t('Incorrect URL format'))

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
                <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                    {getTranslatedLabels(fieldData.dataElement)} :
                    <a target='_blank' href={values[fieldData.dataElement.id]}>URL</a>
                    {/* <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        component={TextAreaFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(required, URLCheck)}
                    /> */}
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
    let customClassName = props.customClassName
    let OUMappingList = OUMapping(values)
    let parentValue = OUMappingList[fieldData.dataElement.id] != undefined ? values[OUMappingList[fieldData.dataElement.id].parent] : null
    let programData = props.programData
    let options = props.options
    let defaultOption = props.defaultOption
    let rules = {
        "programRule": props.programRules,
        "programRuleVariable": props.programRulesVariables
    }
    let OUJSON = props.OUJSON.organisationUnits

    if (fieldData.dataElement.displayName == "Referral facility" || fieldData.dataElement.displayName == "Sample transferred to facility ") {
        OUJSON = OUJSON.filter(obj => obj.comment == "Facility")
    }

    const option = { "id": "option1", "label": 'Option1', "value": 'option1' }

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)
    const [location, setLocation] = useState([])

    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables)
        setValidationResult(validationResult)
    }

    useEffect(() => {



        if (options != '') {
            let locationList = []
            const filterOnId = OUJSON.filter(obj => obj.id == options)
            if (filterOnId.length > 0) {
                const childrenOptions = filterOnId[0].children
                childrenOptions.map(childOptions => {
                    const filterChildDetails = OUJSON.filter(obj => obj.id == childOptions.id)
                    if (filterChildDetails.length > 0) {
                        let obj = {
                            'id': filterChildDetails[0].id,
                            'label': filterChildDetails[0].name,
                            'value': filterChildDetails[0].id,
                        }
                        locationList.push(obj)
                        setLocation(locationList)
                    }

                })

            }
            if (fieldData.dataElement.displayName == "Referral facility" || fieldData.dataElement.displayName == "Sample transferred to facility ") {

                OUJSON.map(facility => {
                    let obj = {
                        'id': facility["id"],
                        'label': facility["name"],
                        'value': facility["id"],
                    }
                    locationList.push(obj)
                    locationList = _.orderBy(locationList, ['label'], ['asc'])
                    setLocation(locationList)
                })
            }
        } else {
            const OUList = programData.organisationUnits
            let autocompleteData = []

            if (OUMappingList[fieldData.dataElement.id] != undefined) {
                if (OUMappingList[fieldData.dataElement.id].type) {

                    let OUOptions = OUJSON.filter(obj => obj.level == OUMappingList[fieldData.dataElement.id].level)
                    if (OUOptions.length > 0) {
                        OUOptions.map(items => {
                            let obj = {
                                'id': items.id,
                                'label': items.name,
                                'value': items.id
                            }
                            autocompleteData.push(obj)
                        })
                        setLocation(autocompleteData)
                    }
                }
            } else {
                let OUOptions = OUJSON;
                OUOptions = OUJSON.filter((obj) => obj.comment == "Facility");
                if (OUOptions.length > 0) {
                    OUOptions.map((items) => {
                        let obj = {
                            id: items.id,
                            label: items.name,
                            value: items.id,
                        };
                        autocompleteData.push(obj);
                    });
                    setLocation(autocompleteData);
                }
            }
            if (fieldData.dataElement.displayName == "Referral facility" || fieldData.dataElement.displayName == "Sample transferred to facility ") {

                OUJSON.map(facility => {
                    let obj = {
                        'id': facility["id"],
                        'label': facility["name"],
                        'value': facility["id"],
                    }
                    autocompleteData.push(obj)
                    autocompleteData = _.orderBy(autocompleteData, ['label'], ['asc'])
                    setLocation(autocompleteData)
                })
            }


        }

    }, [values[fieldData.dataElement.id], parentValue, options, localStorage.getItem("locale")]) //defaultOption, options

    useEffect(() => {
        if (location != null) {
            if (values[fieldData.dataElement.id]) {
                if (!_.isEmpty(defaultOption)) {
                    setFieldStructure(
                        <OUFieldConfig
                            data={fieldData} values={values} rules={rules} options={location} defaultOption={defaultOption} programData={programData} OUMapping={OUMappingList} customClassName={customClassName}
                        />
                    )
                }
            } else {
                setFieldStructure(
                    <OUFieldConfig
                        data={fieldData} values={values} rules={rules} options={location} defaultOption={defaultOption} programData={programData} OUMapping={OUMappingList} customClassName={customClassName}
                    />
                )
            }
        }


    }, [location, localStorage.getItem("locale")])
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
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup
    let programData = props.programData
    let customfieldobj = props.customfieldobj
    let programBoDetails = props.programBoDetails
    let referralWorkFlow = programBoDetails && programBoDetails.isReferralWorkflow ? true : false
    let symptomsFID = props.symptomsFID ? props.symptomsFID : ''
    let Configuration = props.Configuration
    const stagesList = programData.programStages
    const { t } = useTranslation()
    const [referralDefaultValue, setReferralDefaultValue] = useState(null)
    let checkboxData = [];
    let isCheckboxReadOnly = false, readOnlyCheckboxArr = []

    let ReferToLabForinvestigationFieldValue = values[customfieldobj.referToId] ? values[customfieldobj.referToId] : undefined
    let defaultval = '';

    let testingStage = customfieldobj.tbTestingStageId //stagesList.filter(obj => obj.description == "Testing Form")
    let tbInfectionTestingStage = customfieldobj.tbInfectionTestingStageId //stagesList.filter(obj => obj.description == "TB Treatment Initiation") //ltbi
    let tptInitiation = customfieldobj.tptIntiationStageId //stagesList.filter(obj => obj.description == "TPT  Initiation Form") //TPT ltbi
    if (referralWorkFlow) {
        if (testingStage && testingStage.length > 0) {
            if (ReferToLabForinvestigationFieldValue == 'TB' || ReferToLabForinvestigationFieldValue == 'LTBI') {
                defaultval = testingStage //testingStage[0].id
            }

        }

        if (values[customfieldobj.eligibleforTPTId] == 'Yes' && values[customfieldobj.testingforTBinfectionID] == 'No') { //&& values[customfieldobj.testingforTBinfectionID] == 'No'
            defaultval = tptInitiation //tptInitiation[0].id
        } else if (values[customfieldobj.mWRDresultId] == 'Negative' && values[customfieldobj.mWRDreportavailableID] == 'Yes') {
            defaultval = tbInfectionTestingStage
        } else if (values[customfieldobj.mWRDresultId] == 'Positive' && values[customfieldobj.mWRDreportavailableID] == 'Yes') {
            defaultval = customfieldobj.tbTretmentInitiationStageId
        } else if ((values[customfieldobj.CXRreportavailableID] == 'Yes' && values[customfieldobj.CXRresultId] == 'Suggestive of TB') || (values[customfieldobj.CRPreportavailableID] == 'Yes' && values[customfieldobj.CRPresultId] == 'Positive') || (symptomsFID && values[symptomsFID] && _.isArray(values[symptomsFID]) && values[symptomsFID].length > 0 && !values[symptomsFID].includes(customfieldobj.noneOptionID))) {
            defaultval = testingStage //tbTestingStage[0].id
        } else {
            if (values[customfieldobj.CXRresultId] == 'Not suggestive of TB' || values[customfieldobj.mWRDreportavailableID] == 'No' || (symptomsFID && values[symptomsFID] && _.isArray(values[symptomsFID]) && values[symptomsFID].length > 0 && values[symptomsFID].includes(customfieldobj.noneOptionID))) {
                defaultval = tbInfectionTestingStage//testingStage
            } else {
                defaultval = tbInfectionTestingStage
            }
            //defaultval =  testingStage //tbInfectionTestingStage //tbInfectionTestingStage[0].id
        }

        // if(values[customfieldobj.mWRDresultId] == 'Positive' && values[customfieldobj.mWRDreportavailableID] == 'Yes'){
        //     defaultval =  customfieldobj.tbTretmentInitiationStageId
        // }else if(values[customfieldobj.CXRresultId] == 'Suggestive of TB' || values[customfieldobj.CRPresultId] == 'Positive' || (symptomsFID && values[symptomsFID]  && _.isArray(values[symptomsFID]) && values[symptomsFID].length > 0 && !values[symptomsFID].includes(customfieldobj.noneOptionID))){
        //     defaultval = testingStage //tbTestingStage[0].id
        // }else if(values[customfieldobj.eligibleforTPTId] == 'Yes' && values[customfieldobj.testingforTBinfectionID] == 'No'){ //&& values[customfieldobj.testingforTBinfectionID] == 'No'
        //     defaultval =  tptInitiation //tptInitiation[0].id
        // }else{
        //     if(values[customfieldobj.CXRresultId] == 'Not suggestive of TB' || values[customfieldobj.mWRDreportavailableID] == 'No' || (symptomsFID && values[symptomsFID]  && _.isArray(values[symptomsFID]) && values[symptomsFID].length > 0 && values[symptomsFID].includes(customfieldobj.noneOptionID))){
        //         defaultval =  testingStage
        //     }
        //     //defaultval =  testingStage //tbInfectionTestingStage //tbInfectionTestingStage[0].id
        // }

        if (values && customfieldobj.selectReferralServiceId == fieldData.dataElement.id) {
            if (!values[customfieldobj.selectReferralServiceId]) {
                values[customfieldobj.selectReferralServiceId] = '' //[];
            }
            if (defaultval) {
                //values[customfieldobj.selectReferralServiceId] = '' //[];
                values[customfieldobj.selectReferralServiceId] = defaultval //.push(defaultval);
            }
        }
        // if(values[customfieldobj.selectReferralServiceId] && _.isArray(values[customfieldobj.selectReferralServiceId])){
        //     values[customfieldobj.selectReferralServiceId] = values[customfieldobj.selectReferralServiceId][0]
        // }
        if (values[customfieldobj.selectReferralServiceId] && _.isArray(values[customfieldobj.selectReferralServiceId])) {
            values[customfieldobj.selectReferralServiceId] = tbInfectionTestingStage ? tbInfectionTestingStage : values[customfieldobj.selectReferralServiceId][0]
        }

        if (Configuration && Configuration.ltbiLinkVariables && values[customfieldobj.clientTypeID] == Configuration.ltbiLinkVariables.index) {
            values[customfieldobj.selectReferralServiceId] = customfieldobj.tbTretmentInitiationStageId
        }
    } else {
        //radio type
        // if(values[customfieldobj.selectReferralServiceId] && _.isArray(values[customfieldobj.selectReferralServiceId])){
        //     values[customfieldobj.selectReferralServiceId] = values[customfieldobj.selectReferralServiceId][0]
        // }
        if (values[customfieldobj.selectReferralServiceId] && _.isArray(values[customfieldobj.selectReferralServiceId])) {
            values[customfieldobj.selectReferralServiceId] = tbInfectionTestingStage ? tbInfectionTestingStage : values[customfieldobj.selectReferralServiceId][0]
        }
    }

    //defaultvalue
    // if(!values[customfieldobj.selectReferralServiceId]){
    //     values[customfieldobj.selectReferralServiceId] = testingStage
    // }
    if (!values[customfieldobj.selectReferralServiceId]) {
        values[customfieldobj.selectReferralServiceId] = tbInfectionTestingStage ? tbInfectionTestingStage : testingStage//testingStage
    }

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    function getFieldDetails(stage, parentAttribute, parentReadOnlyCheckboxArr) {
        let customProps = {}
        if (referralWorkFlow) {
            customProps = { ...customProps }
            customProps.disabled = true//false
            //customProps.initialValue = parentReadOnlyCheckboxArr
            if (defaultval) {
                customProps.initialValue = [defaultval]
            }
        }
        return (
            <>
                <Field
                    type="radio"
                    component={RadioFieldFF}
                    name={parentAttribute.dataElement.id}
                    label={stage.label}
                    value={stage.value}
                    //initialValue={parentReadOnlyCheckboxArr}
                    {...customProps}
                    className={customClassName}
                />
                <OnChange name={parentAttribute.dataElement.id}>
                    {(value, previous) => {
                        if (!defaultval) {
                            values[customfieldobj.selectReferralServiceId] = value
                        }
                    }}
                </OnChange>
            </>

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

                        if (val.attribute.displayName == "showStageNameInReferralService" && val.value == 'true') {
                            if (stage.id == defaultval) {
                                readOnlyCheckboxArr.push(stage.id)
                            }
                            isCheckboxReadOnly = true;
                            checkboxData.push({
                                label: stage.displayName ? t(stage.displayName) : t(stage.description),
                                value: stage.id,
                            });
                        }
                    })
                }
            })

            setFieldStructure(
                <Grid item xs={12} sm={12} className={validationResult.hideShow == true ? 'customLoc ' + customClassName : 'hide'}>
                    <FieldGroupFF
                        label={getTranslatedLabels(fieldData.dataElement)}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        name={fieldData.dataElement.id}
                        className={customClassName}
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

// function MultiSelectConfig(props) {
//     let fieldData = props.fieldData
//     let programRules = props.programRules
//     let programRulesVariables = props.programRulesVariables
//     let values = props.values
//     let customClassName = props.customClassName
//     let DataElementGroup = props.DataElementGroup
//     let customfieldobj = props.customfieldobj
//     let programObj = props.programObj
//     let dataElementGroup = props.dataElementGroup
//     let stage = props.stages
//     let noneFieldId = customfieldobj.noneOptionID//"ATGexAEZ8xm"
//     let customProps = {}
//     const [fieldStructure, setFieldStructure] = useState(null)
//     const [validationResult, setValidationResult] = useState(null)

//     function fetchValidation() {
//         const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
//         setValidationResult(validationResult)
//     }

//     function getFieldDetails(fieldId, formValues) {
//         const getFieldsAttributes = stage.filter(
//             (obj) => obj.dataElement.id == fieldId
//         );

//         if (getFieldsAttributes.length > 0) {

//             const fieldData1 = getFieldsAttributes[0];
//             const findField = fieldData1.dataElement.id;
//             let isFieldDisbaled = false;
//             let autoChecked = false;
//             try {
//                 if (findField != undefined && formValues[findField]) {
//                     if (values[DataElementGroup.id] && _.isArray(values[DataElementGroup.id]) && _.last(values[DataElementGroup.id]) && _.last(values[DataElementGroup.id]) != noneFieldId) {
//                         if (values[findField] == true && findField != noneFieldId) {
//                             if (values[DataElementGroup.id] && (values[DataElementGroup.id].includes(noneFieldId))) {
//                                 values[DataElementGroup.id] = values[DataElementGroup.id].filter(item => item !== noneFieldId)
//                             }
//                             //values[noneFieldId] = false
//                             delete values[noneFieldId]
//                         }
//                     } else if (values[DataElementGroup.id] && _.isArray(values[DataElementGroup.id]) && _.last(values[DataElementGroup.id]) && _.last(values[DataElementGroup.id]) == noneFieldId) {
//                         values[DataElementGroup.id].map(ele => {
//                             if (ele != noneFieldId)
//                                 delete values[ele]
//                         })
//                         values[DataElementGroup.id] = [noneFieldId]
//                     }
//                 }
//             } catch (e) {

//             }
//             // if (findField != undefined && findField != noneFieldId) {
//             //     if (formValues[noneFieldId] == true && values[DataElementGroup.id] && values[DataElementGroup.id].includes(noneFieldId)) {
//             //       //let indexOfEle = formValues[DataElementGroup.id].indexOf(findField);
//             //       isFieldDisbaled = true;
//             //       autoChecked = true;
//             //       if(formValues[fieldData1.dataElement.id]){
//             //           if(values[DataElementGroup.id] && values[DataElementGroup.id].includes(fieldData1.dataElement.id)){
//             //               values[DataElementGroup.id] = values[DataElementGroup.id].filter(item => item !== fieldData1.dataElement.id)
//             //           }
//             //          delete formValues[fieldData1.dataElement.id]
//             //         //formValues[DataElementGroup.id].splice(indexOfEle, 1);
//             //       }
//             //     }
//             //   }else{

//             //   }
//             return (
//                 autoChecked == true ?
//                     <Field
//                         component={CheckboxFieldFF}
//                         name={DataElementGroup.id}
//                         disabled={isFieldDisbaled}
//                         label={getTranslatedLabels(fieldData1.dataElement)}
//                         value={fieldData1.dataElement.id}
//                         initialValue={formValues[DataElementGroup.id]}
//                         className={customClassName}
//                     />
//                     :
//                     <Field
//                         type="checkbox"
//                         component={CheckboxFieldFF}
//                         name={DataElementGroup.id}
//                         // disabled={isFieldDisbaled}
//                         label={getTranslatedLabels(fieldData1.dataElement)}
//                         value={fieldData1.dataElement.id}
//                         initialValue={formValues[DataElementGroup.id]}
//                         className={customClassName}
//                     />
//             );
//         }
//     }

//     useEffect(() => {
//         fetchValidation()

//     }, [values])

//     useEffect(() => {
//         if (validationResult != null) {
//             let fieldLabel = getTranslatedLabels(DataElementGroup);
//             try {
//                 if (fieldLabel.includes('_')) {
//                     let l = fieldLabel.split('_');
//                     fieldLabel = l[1]
//                 }
//             } catch (e) {

//             }
//             setFieldStructure(
//                 <Grid item xs={12} sm={12} className={validationResult.hideShow == true ? 'customLoc ' + customClassName : 'hide'}>
//                     <FieldGroupFF
//                         label={fieldLabel}
//                         // onClick={(e, v) => onChange(e, v)}
//                         name={DataElementGroup.id}
//                         className={customClassName}
//                     >
//                         {DataElementGroup.dataElements.map((field) => {
//                             return getFieldDetails(field.id, values);
//                         })}
//                     </FieldGroupFF>
//                 </Grid>
//             )
//         }

//     }, [validationResult, localStorage.getItem("locale")])

//     return (
//         <>
//             {fieldStructure != null ? fieldStructure : <> </>

//             }
//         </>
//     )

// }
function MultiSelectConfig(props) {
    const { t } = useTranslation()
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    let DataElementGroup = props.DataElementGroup
    let customfieldobj = props.customfieldobj
    let programObj = props.programObj
    let dataElementGroup = props.dataElementGroup
    let stage = props.stages
    let noneFieldId = customfieldobj.noneOptionID//"ATGexAEZ8xm"
    let formref = props.formref
    let customProps = {}
    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [forceRender, setForceRender] = useState(false);
    //const formRef = useRef(null);

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
            const findField = fieldData1.dataElement.id;
            let isFieldDisbaled = false;
            let autoChecked = false;
            try {
                if (findField != undefined && formValues[findField]) {
                    if (values[DataElementGroup.id] && _.isArray(values[DataElementGroup.id]) && _.last(values[DataElementGroup.id]) && _.last(values[DataElementGroup.id]) != noneFieldId) {
                        if (values[findField] == true && findField != noneFieldId) {
                            if (values[DataElementGroup.id] && (values[DataElementGroup.id].includes(noneFieldId))) {
                                values[DataElementGroup.id] = values[DataElementGroup.id].filter(item => item !== noneFieldId)
                            }
                            //values[noneFieldId] = false
                            delete values[noneFieldId]
                        }
                    } else if (values[DataElementGroup.id] && _.isArray(values[DataElementGroup.id]) && _.last(values[DataElementGroup.id]) && _.last(values[DataElementGroup.id]) == noneFieldId) {
                        values[DataElementGroup.id].map(ele => {
                            if (ele != noneFieldId)
                                delete values[ele]
                        })
                        values[DataElementGroup.id] = [noneFieldId]
                    }
                }
            } catch (e) {

            }
            // if (findField != undefined && findField != noneFieldId) {
            //     if (formValues[noneFieldId] == true && values[DataElementGroup.id] && values[DataElementGroup.id].includes(noneFieldId)) {
            //       //let indexOfEle = formValues[DataElementGroup.id].indexOf(findField);
            //       isFieldDisbaled = true;
            //       autoChecked = true;
            //       if(formValues[fieldData1.dataElement.id]){
            //           if(values[DataElementGroup.id] && values[DataElementGroup.id].includes(fieldData1.dataElement.id)){
            //               values[DataElementGroup.id] = values[DataElementGroup.id].filter(item => item !== fieldData1.dataElement.id)
            //           }
            //          delete formValues[fieldData1.dataElement.id]
            //         //formValues[DataElementGroup.id].splice(indexOfEle, 1);
            //       }
            //     }
            //   }else{

            //   }
            return (
                autoChecked == true ?
                    <Field
                        component={CheckboxFieldFF}
                        name={DataElementGroup.id}
                        disabled={isFieldDisbaled}
                        label={getTranslatedLabels(fieldData1.dataElement)}
                        value={fieldData1.dataElement.id}
                        initialValue={formValues[DataElementGroup.id]}
                        className={customClassName}
                    />
                    :
                    <Field
                        type="checkbox"
                        component={CheckboxFieldFF}
                        name={DataElementGroup.id}
                        // disabled={isFieldDisbaled}
                        label={getTranslatedLabels(fieldData1.dataElement)}
                        value={fieldData1.dataElement.id}
                        initialValue={formValues[DataElementGroup.id]}
                        className={customClassName}
                    />
            );
        }
        else {
        }
    }

    const loadOptions = (inputValue, callback) => {
        const filteredOptions = DataElementGroup.dataElements
            .filter(de => de.displayName.toLowerCase().includes(inputValue.toLowerCase()))
            .map(de => ({
                label: getAsyncLabel(de.id, values),
                // de.displayName.includes('_') ? de.displayName.split('_')[0] : de.displayName,
                value: de.id
            }));
        callback(filteredOptions);
    };

    useEffect(() => {
        fetchValidation()

    }, [values])

    useEffect(() => {
        setSelectedOptions([])
        if (values[DataElementGroup.id] && Array.isArray(values[DataElementGroup.id])) {
            const preselected = DataElementGroup.dataElements
                .filter(de => values[DataElementGroup.id].includes(de.id) || values[de.id] === true)
                .map(de => ({ label: getAsyncLabel(de.id, values), value: de.id }));
            if (preselected.length > 0) {
                setSelectedOptions(preselected);
            }
        }
    }, [values[DataElementGroup.id], DataElementGroup]);


    function getAsyncLabel(fieldId, formValues) {
        const getFieldsAttributes = stage.filter(
            (obj) => obj.dataElement.id == fieldId
        );
        if (getFieldsAttributes.length > 0) {
            const fieldData1 = getFieldsAttributes[0];
            return getTranslatedLabels(fieldData1.dataElement)
        }
    }
    useEffect(() => {
        if (validationResult != null) {
            let fieldLabel = getTranslatedLabels(fieldData.dataElement);
            try {
                if (fieldLabel.includes('_')) {
                    let l = fieldLabel.split('_');
                    fieldLabel = l[1]
                }
            } catch (e) {

            }
            const sortedDataElements = [...DataElementGroup.dataElements].sort((a, b) =>
                a.displayName.localeCompare(b.displayName)
            );
            //     options: sortedDataElements.map(de => ({ 
            //       label: de.displayName.includes('_') ? de.displayName.split('_')[0] : de.displayName, 
            //       value: de.id 
            //     })),
            //     value: selectedOptions.length > 0 ? selectedOptions.map(option => ({
            //       label: option.label.includes('_') ? option.label.split('_')[0] : option.label,
            //       value: option.value
            //     })) : null
            //   });


            // Transform the options for display and log the result
            const displayOptions = selectedOptions.length > 0
                ? selectedOptions.map(option => {
                    const transformedOption = {
                        label: option.label.includes('_')
                            ? option.label.split('_')[0]
                            : option.label,
                        value: option.value
                    };
                    return transformedOption;
                })
                : null;
            // signs and symtoms dropdown
            setFieldStructure(
                <Grid item xs={12} sm={12} lg={12} md={12} className={validationResult.hideShow == true ? 'customLoc  ' + customClassName : 'hide'}>
                    <div style={{ display: 'none' }}>
                        <FieldGroupFF
                            //  style={{display: "none"}}
                            label={fieldLabel}
                            // onClick={(e, v) => onChange(e, v)}
                            name={DataElementGroup.id}
                            className={customClassName + " hide"}
                        >
                            {sortedDataElements.map((field) => {
                                return getFieldDetails(field.id, values);
                            })}
                        </FieldGroupFF>
                    </div>
                    {/* <AsyncSelect
                        isMulti
                        cacheOptions
                        loadOptions={loadOptions}
                        defaultOptions={sortedDataElements.map(de => ({ label: de.displayName, value: de.id }))}
                        placeholder="Search and select options..."
                        value={selectedOptions.length > 0 ? selectedOptions : null} 
                        onChange={(newSelectedOptions) => {
                            const updatedSelections = newSelectedOptions || [];
                    // Store only the selected values (IDs)
        values[DataElementGroup.id] = updatedSelections.map(option => option.value);

        // Manually force a re-render by updating state asynchronously
        setSelectedOptions(prevOptions => [...updatedSelections]);

                            // // Find newly selected items by filtering out previously selected ones
                            // const newlySelected = updatedSelections.filter(option => 
                            //     !selectedOptions.some(prevOption => prevOption.value === option.value)
                            // );
                    
                            // // Update state with the new selections
                            // setSelectedOptions([...updatedSelections]); 
                    
                            // // Store only IDs in `values`
                            // values[DataElementGroup.id] = updatedSelections.map(option => option.value); 
                    
                            // // Call `getFieldDetails` only for newly selected items
                            // newlySelected.forEach(option => {
                            //     getFieldDetails(option.value, values);
                            // });

                            // {sortedDataElements.map((field) => {
                                
                            //     newlySelected.forEach(option => {
                            //      return getFieldDetails(option.value, values);
                            //     });
                               
                            //         customProps = {
                            //             ...customProps,
                            //             key: Math.random() * 9999,
                                       
                            //         };// Then, set it again
                             
                            // })}
                            
                          

                        }}
                    /> */}
                    <div>
                        <label className="labelSelect">{t(fieldLabel)}</label>
                        <OnChange name={DataElementGroup.id}>
                            {() => {
                                if (formref.current) {
                                    formref.current.change("forceRenderField", Math.random());
                                }
                            }}
                        </OnChange>
                        <Field name="forceRenderField" component="input" type="hidden" />
                        <AsyncSelect
                            // menuIsOpen={true} // Keeps the dropdown always open
                            key={forceRender}
                            className="multiSelectDropdown"
                            isMulti
                            cacheOptions
                            label={t(fieldLabel)}
                            loadOptions={loadOptions}
                            defaultOptions={sortedDataElements.map(de => ({
                                label: getAsyncLabel(de.id, values),
                                // de.displayName.includes('_') ? de.displayName.split('_')[0] : de.displayName, 
                                value: de.id
                            }))}
                            placeholder={t("Search and select...")}
                            noOptionsMessage={() => t("Search and select...")}
                            value={selectedOptions.length > 0 ? selectedOptions.map(option => ({
                                label: option.label.includes('_') ? option.label.split('_')[0] : option.label,
                                value: option.value
                            })) : null}
                            onChange={(newSelectedOptions) => {
                                const updatedSelections = newSelectedOptions || [];
                                // Store only the selected values (IDs)
                                values[DataElementGroup.id] = updatedSelections.map(option => option.value);

                                // values[DataElementGroup.id] = updatedSelections.map(option => {
                                //     values[option.value] = true
                                //     return option.value
                                // });
                                {
                                    sortedDataElements.map((field) => {
                                        if (values[DataElementGroup.id].includes(field.id)) {
                                            values[field.id] = true;
                                        }
                                        else {
                                            values[field.id] = false;
                                        }
                                    })
                                }


                                setSelectedOptions([...updatedSelections]);
                                // Manually force a re-render by updating state asynchronously
                                // setSelectedOptions(prevOptions => [...updatedSelections]);
                            }}
                            classNamePrefix="custom-Asyncselect"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    maxHeight: "100px", // Prevents excessive height
                                    overflowY: "auto",  // Allows scrolling when too many options are selected
                                    flexWrap: "wrap"
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    maxWidth: "100px", // Prevents long labels from breaking layout
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                })
                            }}
                        />
                    </div>
                </Grid>
            )

        }


    }, [selectedOptions, validationResult, localStorage.getItem("locale"), values, values[DataElementGroup.id]])
    // useEffect(() => {
    //     // Ensure dropdown binds latest selected values
    //     if (values[DataElementGroup.id] && Array.isArray(values[DataElementGroup.id])) {
    //         const preselected = DataElementGroup.dataElements
    //             .filter(de => values[DataElementGroup.id].includes(de.id))
    //             .map(de => ({ label: de.displayName, value: de.id }));

    //         setSelectedOptions(preselected);
    //     }
    // }, [values[DataElementGroup.id]]);  
    useEffect(() => {

    }, [forceRender]);

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )

}

function QrCodeScanner(props) {

    let fieldData = props.fieldData

    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values

    const [fieldStructure, setFieldStructure] = useState(null)
    const [showScannner, setShowScannner] = useState(false)
    const [defaultValue, setDefaultValue] = useState(null)

    function qrErrorhandler() {
        setShowScannner(false)
    }

    function handleQRScan(data) {
        if (data) {
            setShowScannner(false)
            setDefaultValue(data)
        }
    }

    function closeQrSacnner() {
        setShowScannner(false)
    }
    function openCordovaQrScanner() {

        let that = this;
        window.cordova.plugins.barcodeScanner.scan(
            function (result) {
                handleQRScan(result.text);
                //setShowScannner(false)
                //setDefaultValue(result.text)
            },
            function (error) {

            },
            {
                preferFrontCamera: false, // iOS and Android
                showFlipCameraButton: true, // iOS and Android
                showTorchButton: false, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                prompt: 'Place a barcode inside the scan area', // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                //orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations: true, // iOS
                disableSuccessBeep: false // iOS
            }
        );
    }
    function openQrSacnner() {
        if (window.cordova) {
            openCordovaQrScanner()
        } else {
            setShowScannner(true)
        }
    }

    useEffect(() => {
        if (showScannner) {
            setFieldStructure(
                <Grid item xs={12} sm={12} md={12} >
                    <div style={{ display: 'none' }}>
                        <Field
                            name={fieldData.dataElement.id}
                            label={getTranslatedLabels(fieldData.dataElement)}
                            type={fieldData.dataElement.valueType}
                            component={InputFieldFF}
                            key={fieldData.dataElement.id}
                            defaultValue={defaultValue}
                        />
                    </div>
                    <div style={{ height: '200px', width: '200px' }}>

                        <Html5QrcodePlugin
                            fps={10}
                            qrbox={200}
                            disableFlip={false}
                            qrCodeSuccessCallback={(e) => handleQRScan(e)} />
                        <span onClick={() => closeQrSacnner()}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </div>
                    {/* <div>
                        <QrReader
                            delay={300}
                            onError={qrErrorhandler}
                            onScan={handleQRScan}
                            style={{ width: '50%', cursor: 'pointer' }}
                        />
                        <span onClick={() =>closeQrSacnner()}><FontAwesomeIcon icon={faTimes} /></span>
                    </div> */}
                </Grid>
            )
        } else {
            setFieldStructure(
                <Grid item xs={12} sm={12} md={12} >
                    <div style={{ display: 'none' }}>
                        <Field
                            name={fieldData.dataElement.id}
                            label={getTranslatedLabels(fieldData.dataElement)}
                            type={fieldData.dataElement.valueType}
                            component={InputFieldFF}
                            key={fieldData.dataElement.id}
                            defaultValue={defaultValue}
                        />
                    </div>
                    <p className="qrIcon" onClick={() => openQrSacnner()}><FontAwesomeIcon className="fa-3x" icon={faQrcode} /></p>
                </Grid>
            )
        }
    }, [showScannner, defaultValue, localStorage.getItem("locale")])


    return (
        <>
            {
                fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}
function ImageFieldConfig(props) {
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let customClassName = props.customClassName
    let dataElementGroup = props.dataElementGroup
    let customfieldobj = props.customfieldobj

    const [fieldStructure, setFieldStructure] = useState(null)
    const [validationResult, setValidationResult] = useState(null)
    const [defaultValue, setDefaultValue] = useState(null)

    function handleSave() {

    }

    function handleChange(files) {

        if (files.length > 0) {
            let data = new FormData();
            data.append('file', files[0]);

            axios({
                method: 'post',
                url: 'https://undp.imonitorplus.com/service/api/fileResources',
                data: data,
                headers: {
                    //'Content-Type':  'multipart/form-data',
                    Authorization: 'YOUR_BASIC_AUTH_KEY'
                }
            })
                .then(function (response) {
                    //handle success

                })
                .catch(function (response) {
                    //handle error
                })
        }


    }

    function fetchValidation() {
        const validationResult = Validator(fieldData.dataElement.id, fieldData, values, programRules, programRulesVariables, dataElementGroup)
        setValidationResult(validationResult)
    }

    useEffect(() => {
        fetchValidation()
    }, [values])

    async function openFileChooser() {
        const file = await window.chooser.getFile({ mimeTypes: ["application/pdf", "image/*"] });
        setDefaultValue(file)
    }
    useEffect(() => {

        if (validationResult != null) {
            if (values[customfieldobj.reasonForTodaysVisit] &&
                (values[customfieldobj.reasonForTodaysVisit] == "Routine Visit" ||
                    values[customfieldobj.reasonForTodaysVisit] == "Quarterly Visit" ||
                    values[customfieldobj.reasonForTodaysVisit] == "Collecting insulin")) {
                {
                    if (
                        fieldData.dataElement.id == customfieldobj.fundusPhotography)
                        validationResult.hideShow = false
                }
            }

            if (!navigator.onLine) {
                if (defaultValue) {
                    values[fieldData.dataElement.id] = [defaultValue]
                }
                setFieldStructure(
                    <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? 'hide' : 'hide'}>
                        <div style={{ display: 'none' }}>
                            <Field
                                name={fieldData.dataElement.id}
                                label={getTranslatedLabels(fieldData.dataElement)}
                                type={fieldData.dataElement.valueType}
                                component={InputFieldFF}
                                key={fieldData.dataElement.id}
                                defaultValue={defaultValue}
                                value={''}
                            />
                        </div>
                        <label className={customClassName}>{getTranslatedLabels(fieldData.dataElement)}</label>
                        <p className="qrIcon" onClick={() => openFileChooser()}><FontAwesomeIcon className="fa-3x" icon={faFileUpload} /></p>
                        {defaultValue && defaultValue.name ?
                            <p className={defaultValue && defaultValue.name ? '' : 'hide'}>{defaultValue && defaultValue.name ? defaultValue.name : ''}</p>
                            :
                            values[fieldData.dataElement.id] && values[fieldData.dataElement.id].includes('RTMUPLOADS') ?
                                <p className={values[fieldData.dataElement.id] ? '' : 'hide'}>{values[fieldData.dataElement.id] ? values[fieldData.dataElement.id].split('RTMUPLOADS/') ? values[fieldData.dataElement.id].split('RTMUPLOADS/')[1] : '' : ''}</p>
                                :
                                <p className={values[fieldData.dataElement.id] ? '' : 'hide'}>{values[fieldData.dataElement.id] ? values[fieldData.dataElement.id] : ''}</p>
                        }

                    </Grid>
                )
            } else {
                setFieldStructure(
                    <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
                        {/* <DropzoneArea
                            name={fieldData.dataElement.id}
                            onChange={handleChange.bind(this)}
                            filesLimit={1}
                        /> */}

                        <Field
                            name={fieldData.dataElement.id}
                            label={getTranslatedLabels(fieldData.dataElement)}
                            component={FileInputFieldFF}
                            key={fieldData.dataElement.id}
                            required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                            value={[]}
                            accept=".pdf, image/*"
                            className={customClassName}
                        //onChange={handleChange.bind(this)}
                        //validate={composeValidators(required, URLCheck)}
                        />

                    </Grid>
                )
            }
        }

    }, [validationResult, defaultValue, localStorage.getItem("locale")])

    return (
        <>
            {fieldStructure != null ? fieldStructure : <> </>

            }
        </>
    )
}

function CreateStageFieldManagement(props) {
    let selectedOptionMed = props.selectedOption
    let fieldData = props.fieldData
    let programRules = props.programRules
    let programRulesVariables = props.programRulesVariables
    let values = props.values
    let programData = props.programData
    let dataElementGroup = props.dataElementGroup
    let stages = props.stages
    let orgid = props.orgid
    let OUM = OUMapping(values)
    let OUJSON = props.OUJSON
    let customfieldobj = props.customfieldobj;
    let programBoDetails = props.programBoDetails
    let customClassName = props.customClassName
    let Configuration = props.Configuration
    let symptomsReferralID = null;
    let currentstagename = props.currentstagename
    let userBO = props.userBO
    let ismaskable = false;
    let formref = props.formRef
    let activeCaseFormData = props.activeCaseFormData

    const isHealthWorker = userBO?.userRoles?.find(
        (role) => role.name === "healthworker"
    );

    // if (!isHealthWorker) {
    //     //  
    //     const isEncryptedAttribute = fieldData?.dataElement?.attributeValues?.find(
    //         (attr) => attr.attribute?.name === "IsEncrypted" && attr.value === "true"
    //     );
    //     const isMaskedAttribute = fieldData?.dataElement?.attributeValues?.find(
    //         (attr) => attr.attribute?.name === "isMaskable" && attr.value === "true"
    //     );
    //     if (isEncryptedAttribute) {

    //         return null;
    //     }
    //     if (isMaskedAttribute) {
    //         ismaskable = true;
    //     }
    // }
    try {
        if (dataElementGroup && dataElementGroup.length > 0) {
            let dEID = dataElementGroup.filter(
                (obj) => obj.displayName == customfieldobj.symptomsDisplayName && obj.description && obj.description == "Currently are you experiencing any of the following symptoms"
                //(obj) => obj.description && obj.description == "Currently are you experiencing any of the following symptoms"
            )
            if (
                dEID && dEID.length > 0
            ) {
                symptomsReferralID = dEID[0].id
            }
            //let dEID = dataElementGroup.find(obj => obj.description && obj.description == "Symptoms" && obj.displayName == fieldData.dataElement.displayName)

        }
    } catch (e) {

    }

    let rules = {
        "programRule": props.programRules,
        "programRuleVariable": props.programRulesVariables
    }

    function checkFieldType() {
        let checkUnique = false;
        if (fieldData.dataElement.attributeValues.length > 0 && fieldData.dataElement.attributeValues[0].attribute.displayName == "unique" && fieldData.dataElement.attributeValues[0].value) {
            checkUnique = true;
        }

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
                        customClassName={customClassName}
                        ismaskable={ismaskable}
                    />
                    :
                    checkUnique
                        ?
                        <DefaultStageValueField
                            fieldData={fieldData}
                            programRules={programRules}
                            programRulesVariables={programRulesVariables}
                            values={values}
                            dataElementGroup={dataElementGroup}
                            customClassName={customClassName}
                            ismaskable={ismaskable}
                        />
                        :
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
                                customfieldobj={customfieldobj}
                                programBoDetails={programBoDetails}
                                symptomsFID={symptomsReferralID}
                                customClassName={customClassName}
                                Configuration={Configuration}
                                ismaskable={ismaskable}
                            />
                            :
                            fieldData.renderType && fieldData.renderType['DESKTOP'] && fieldData.renderType['DESKTOP'].type == "QR_CODE" ?
                                <QrCodeScanner
                                    fieldData={fieldData}
                                    programRules={programRules}
                                    programRulesVariables={programRulesVariables}
                                    values={values}
                                    customClassName={customClassName}
                                    ismaskable={ismaskable}
                                />
                                : <InputFieldConfig
                                    selectedOptionMed={selectedOptionMed}
                                    fieldData={fieldData}
                                    programRules={programRules}
                                    programRulesVariables={programRulesVariables}
                                    values={values}
                                    dataElementGroup={dataElementGroup}
                                    OUJSON={OUJSON}
                                    programorgid={orgid}
                                    symptomsFID={symptomsReferralID}
                                    customfieldobj={customfieldobj}
                                    customClassName={customClassName}
                                    Configuration={Configuration}
                                    ismaskable={ismaskable}
                                />

            case 'IMAGE':
            case "FILE_RESOURCE":
                return <ImageFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                    customClassName={customClassName}
                    customfieldobj={customfieldobj}
                    ismaskable={ismaskable}
                />

            case 'DATE':
                return <DateFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                    customClassName={customClassName}
                    customfieldobj={customfieldobj}
                    ismaskable={ismaskable}
                    activeCaseFormData={activeCaseFormData}
                />

            case 'AGE':
                return <AgeFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                    customClassName={customClassName}
                    ismaskable={ismaskable}
                />

            case 'PHONE_NUMBER':
                return <PhoneNumberFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                    customClassName={customClassName}
                    ismaskable={ismaskable}
                />

            case 'EMAIL':
                return <EmailFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                    customClassName={customClassName}
                    ismaskable={ismaskable}
                />
            case 'BOOLEAN':
                //dataElementGroup
                if (
                    dataElementGroup.filter(
                        (obj) => obj.displayName == fieldData.dataElement.displayName
                    ).length > 0
                ) {
                    const filterDataElementGroup = dataElementGroup.filter(
                        (obj) => obj.displayName == fieldData.dataElement.displayName
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
                            customfieldobj={customfieldobj}
                            customClassName={customClassName}
                            formref={formref}
                        />
                    )


                } else {
                    // const filterDataElementGroup = dataElementGroup.dataElementGroups.filter(obj => obj.displayName == attribute.dataElement.displayName)[0]

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
                            customClassName={customClassName}
                        />
                    } else {
                        return <> </>;
                    }
                }

            case "TRUE_ONLY":
                if (
                    dataElementGroup.filter(
                        (obj) => obj.displayName == fieldData.dataElement.displayName
                    ).length > 0
                ) {
                    const filterDataElementGroup = dataElementGroup.filter(
                        (obj) => obj.displayName == fieldData.dataElement.displayName
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
                            customClassName={customClassName}
                        />
                    )


                } else {
                    // const filterDataElementGroup = dataElementGroup.dataElementGroups.filter(obj => obj.displayName == attribute.dataElement.displayName)[0]

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
                            customClassName={customClassName}
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
                    customClassName={customClassName}
                    ismaskable={ismaskable}
                    customfieldobj={customfieldobj}
                />

            case 'DATETIME':
                return <DateTimeFieldConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                    customClassName={customClassName}
                    ismaskable={ismaskable}
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
                    dataElementGroup={dataElementGroup}
                    customClassName={customClassName}
                    customfieldobj={customfieldobj}
                    programData={programData}
                    currentstagename={currentstagename}
                    ismaskable={ismaskable}

                />
            case 'LONG_TEXT':
                return <TextAreaConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                    customClassName={customClassName}
                    ismaskable={ismaskable}
                />

            case 'USERNAME':
                return <UserNameConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                    programorgid={orgid}
                    customClassName={customClassName}
                    ismaskable={ismaskable}
                />

            case 'URL':
                return <URLConfig
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    dataElementGroup={dataElementGroup}
                    customClassName={customClassName}
                    ismaskable={ismaskable}
                />

            case 'ORGANISATION_UNIT':
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
                if (defaultValue != undefined) {
                    const meta = JSON.parse(localStorage.getItem('metaData'))
                    const LocationFilter = programData.organisationUnits.filter(OU => OU.id == values[fieldData.dataElement.id])
                    //const locationName = LocationFilter.length > 0 ? LocationFilter[0].displayName : ""
                    //const UserBOLocationFilter = userBO && userBO.organisationUnits ? userBO.organisationUnits.filter(OU => OU.id == values[fieldData.dataElement.id]) : []
                    const OUJSONLocationFilter = OUJSON && OUJSON.organisationUnits ? OUJSON.organisationUnits.filter(OU => OU.id == values[fieldData.dataElement.id]) : []
                    const locationName = LocationFilter.length > 0 ? LocationFilter[0].displayName : OUJSONLocationFilter.length > 0 ? OUJSONLocationFilter[0].displayName : ''
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
                return <HandleOUOptions
                    fieldData={fieldData}
                    programRules={programRules}
                    programRulesVariables={programRulesVariables}
                    values={values}
                    programData={programData}
                    options={optionsId}
                    defaultOption={defaultOption}
                    OUJSON={OUJSON}
                    customClassName={customClassName}
                //data={fieldData} values={values} rules={rules} options={optionsId} defaultOption={defaultOption}
                />

        }
    }


    return (
        <>
            {checkFieldType()}
        </>

    )
}

export default CreateStageFieldManagement
