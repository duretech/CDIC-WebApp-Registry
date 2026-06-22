import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { OnChange } from "react-final-form-listeners";
import axios from "axios";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import _, { parseInt } from "lodash";
import OUMapping from "../../assets/data/registerOU";
import { useHistory } from "react-router-dom";
import { Mic, MicOff, VolumeUp, Clear, Settings } from "@mui/icons-material";

import HideShowCondition from "../validation/HideShowCondition";
import "../../assets/css/customstyles.css";
import AssignCondition from "../validation/Assign";
import Typography from "@material-ui/core/Typography";
import Validator from "../validation/validator/validatorStage";

// import HideStageFieldsOptions from '../validation/hideOptions/HideStageFieldsOptions'
import OUFieldConfig from "./OUStageFieldConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQrcode,
  faTimes,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import Html5QrcodePlugin from "../html5qrbarcodescanner/Html5QrBarcodeScanner";
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
  FileInputFieldFF,
} from "@dhis2/ui";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Paper from "@material-ui/core/Paper";

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
import Box from "@material-ui/core/Box";
//   import {Checkboxes, CheckboxData} from 'mui-rff';

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

import { apiServices } from "../../services/apiServices";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { APP_LOCALE } from "../../../src/assets/data/config.js";
import { useConfig } from "../../hooks/useConfig";

import {
  getDateFormat,
  getKeyByValue,
  checkFieldCondition_dhis,
  getAttributeValue,
  dynamiccalculateBMI,
  checkFieldCondition_dhis_,
  getRangeValues,
  maskText,
  getGlucoseSettings,
  getBMICategory,
  getBMIZScoreCategory,
} from "../../config/validationutils";
import swal from "sweetalert";
import Swal from "sweetalert2"
import { format } from "date-fns";
import AsyncSelect from "react-select/async";
import { de } from "date-fns/locale";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { Padding } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EtDatePicker from "mui-ethiopian-datepicker";
import { EthiopianDate } from "mui-ethiopian-datepicker";
import { convertToGC, toEthiopianDateString } from "gc-to-ethiopian-calendar";
import { EtLocalizationProvider } from "mui-ethiopian-datepicker";

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import imgUrl from "../../assets/images/imageUrl.js";
import { toast } from "react-toastify";
const { Form, Field } = ReactFinalForm;

const ValidatorComponent = (fieldId, attribute, values, form, rules, field) => {
  let programRules = rules.programRule;
  let programRulesVariables = rules.programRuleVariable;

  let filteringRuleWithField = null;
  let Flag = null;
  let val = null;
  let conditionArray = [];
  let programRuleActionType = null;
  let hideShow = true;
  let assign;
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
          assign = AssignCondition(
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
  return {
    hideShow: hideShow,
    assign: assign,
  };
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
      return dataElement.formName
        ? dataElement.formName
        : dataElement.displayName
        ? dataElement.displayName
        : dataElement.description;
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
      return dataElement.formName
        ? dataElement.formName
        : dataElement.displayName
        ? dataElement.displayName
        : dataElement.description;
    }
  }
  return dataElement.formName
    ? dataElement.formName
    : dataElement.displayName
    ? dataElement.displayName
    : dataElement.description;
};

function InputFieldConfig(props) {
  const { t } = useTranslation();
  const history = useHistory();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let dataElementGroup = props.dataElementGroup;
  let customfieldobj = props.customfieldobj;
  let customClassName = props.customClassName;
  let symptomsFID = props.symptomsFID;
  let Configuration = props.Configuration;
  let programBoDetails = props.programBoDetails;
  let userBO = props.userBO;
  let programData = props.programData;
  //let initialValues = props.initialValues
  const [fieldType, setFieldType] = useState(null);
  const [optionSet, setOptions] = useState(null);
  const [icons, setIcons] = useState(null);
  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [ageId, setAgeId] = useState(null);
  const [renderKey, setrenderKey] = useState(0);
  const isDrop = userBO?.userRoles?.find(
                    (role) => role.name === "DROP-HCP"
                  );
  let OUJSON = props.OUJSON.organisationUnits;
  let orgid = props.programorgid;
  let ismaskable = props.ismaskable;
  let formref = props.formref;
  const required = (value) =>
    fieldData.compulsory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;
  // const scriptCheck = value => (value ? value.match(/<[^>]*>/g) != null ? t('Incorrect expression "< or >" added as input') : undefined : undefined)

  const scriptCheck = (value) => {
    if (value && typeof value === "string") {
      return value.match(/<[^>]*>|</g) !== null
        ? t('Incorrect expression "< or >" added as input')
        : undefined;
    }
    return undefined;
  };

  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  const checkboxDependent = [
    //uat
    {
      dependentField: [customfieldobj.testingforTBinfectionID],
      option: customfieldobj.noneOptionID,
    },
  ];
  function checkHideOptionsFields(
    attributes,
    programRules,
    programRulesVariables,
    values
  ) {
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

          const parentNameFromFilterStart =
            splitCondition.search(parentNameFromFilter);
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
                              let checkOptionInArray = option.find(
                                (obj) => obj.id == options.id
                              );
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

                            let checkOptionInArray = option.find(
                              (obj) => obj.id == temp.id
                            );

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
      return attributes.dataElement.optionSet.options;
    }
  }

  function findFieldType() {
    const dataElement = fieldData.dataElement;
    if (dataElement.optionSet != undefined) {
      if (
        fieldData.renderOptionsAsRadio ||
        (fieldData.renderType &&
          fieldData.renderType["DESKTOP"] &&
          fieldData.renderType["DESKTOP"].type &&
          fieldData.renderType["DESKTOP"].type == "HORIZONTAL_RADIOBUTTONS")
      ) {
        setFieldType("radio");
      } else {
        if (fieldData.renderType) {
          if (fieldData.renderType.DESKTOP) {
            if (fieldData.renderType.DESKTOP.type == "ICONS_AS_BUTTONS") {
              setFieldType("radio");
            } else {
              setFieldType("dropdown");
            }
          }
        }
      }
    } else {
      setFieldType("text");
    }
  }

  function fetchOption() {
    let output = [];
    const dataElement = fieldData.dataElement;

    if (dataElement.optionSet != undefined) {
      if (dataElement.id == customfieldobj.patientStatus) {
        if (values && !values[customfieldobj.patientStatus]) {
          fieldData.dataElement.optionSet.options.find((o) => {
            if (o.code == "On Treatment") {
              values[customfieldobj.patientStatus] = o.code;
            }
          });
        }
      }
      let refinedOptionList = checkHideOptionsFields(
        fieldData,
        programRules,
        programRulesVariables,
        values
      );

      //dataElement.optionSet.options.map((items, index) => {
      refinedOptionList.map((items, index) => {
        if (icons.length > 0) {
          output.push({
            value: items.code,
            label: (
              <>
                {" "}
                <span dangerouslySetInnerHTML={{ __html: icons[index] }} />{" "}
                <>{getTranslatedLabels(items)} </>{" "}
              </>
            ),
          });
        } else {
          output.push({ value: items.code, label: getTranslatedLabels(items) });
        }
      });
    }
    if (output.length > 0) {
      setOptions(output);
    }
  }

  function getIcons() {
    let promises = [];
    const dataElement = fieldData.dataElement;
    if (navigator.onLine) {
      if (dataElement.optionSet != undefined) {
        dataElement.optionSet.options.forEach((options) => {
          if (options.style != undefined) {
            const getIconApi = "icons/" + options.style.icon + "/icon.svg";
            promises.push(apiServices.getAPI(getIconApi));
          } else {
            promises.push({});
          }
        });

        Promise.all(promises).then((responses) => {
          const icons = responses.map((response) => response.data);

          if (icons.length > 0) {
            setIcons(icons);
          } else {
            setIcons([]);
          }
        });
      } else {
        setIcons([]);
      }
    } else {
      setIcons([]);
    }
  }

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    getIcons();
  }, []);

  useEffect(() => {
    if (Array.isArray(icons)) {
      findFieldType();
      fetchOption();
      fetchValidation();
    }
  }, [icons, values, localStorage.getItem("locale")]);

  useEffect(() => {
    if (validationResult != null && fieldType != null) {
      let customProps = { className: customClassName };

      try {
        checkboxDependent.map((o) => {
          if (o.dependentField.includes(fieldData.dataElement.id)) {
            //for symptoms
            customProps = { ...customProps, className: "hide" };
            if (values[o.option]) {
              if (
                values[customfieldobj.CXRreportavailableID] &&
                (values[customfieldobj.CXRreportavailableID] == "No" ||
                  (values[customfieldobj.CXRresultId] &&
                    values[customfieldobj.CXRresultId] ==
                      "Not suggestive of TB")) &&
                values[customfieldobj.mWRDreportavailableID] &&
                (values[customfieldobj.mWRDreportavailableID] == "No" ||
                  (values[customfieldobj.mWRDresultId] &&
                    values[customfieldobj.mWRDresultId] == "Negative"))
              ) {
                //customProps = { ...customProps, className: "" };
                if (
                  !values[customfieldobj.hivStatusId] ||
                  values[customfieldobj.hivStatusId] != "Positive" ||
                  (values[customfieldobj.hivStatusId] &&
                    values[customfieldobj.hivStatusId] == "Positive" &&
                    values[customfieldobj.CRPreportavailableID] &&
                    (values[customfieldobj.CRPreportavailableID] == "No" ||
                      (values[customfieldobj.CRPresultId] &&
                        values[customfieldobj.CRPresultId] == "Negative")))
                ) {
                  customProps = { ...customProps, className: "" };
                }
              }
            } else {
            }
          }
        });
      } catch (e) {}

      let fieldValue = values[fieldData.dataElement.id];
      let displayValue = fieldValue;
      if (fieldValue && ismaskable) {
        displayValue = maskText(fieldValue);
      }
      if (fieldType == "text") {
        if (APP_LOCALE === "CC006") {
          if (
            values[customfieldobj.Diagnosis_Examination] &&
            (values[customfieldobj.Diagnosis_Examination] == "Type 1" ||
              values[customfieldobj.Diagnosis_Examination] == "Type 2" ||
              values[customfieldobj.Diagnosis_Examination] == "Unknown" ||
              values[customfieldobj.Diagnosis_Examination] ==
                "Gestational Diabetes")
          ) {
            if (fieldData.dataElement.id == customfieldobj.additionalComments) {
              validationResult.hideShow = false;
            }
          }

          if(fieldData.dataElement.id == customfieldobj.otherSpecificiDabetes){
              validationResult.hideShow = false;
              if(values[customfieldobj.typeOfDiabetes] && 
                (values[customfieldobj.typeOfDiabetes] == "Other specific diabetes" ||
                values[customfieldobj.typeOfDiabetes] == "Neonatal diabetes" ||
                values[customfieldobj.typeOfDiabetes] == "MODY" ||
                values[customfieldobj.typeOfDiabetes] == "Monogenic Diabetes" ||
                values[customfieldobj.typeOfDiabetes] == "Secondary Diabetes")){
                validationResult.hideShow = true;
              }
          }
        }
        if (
          values[customfieldobj.typeOfMedication] &&
          values[customfieldobj.typeOfMedication] == "Other"
        ) {
          if (fieldData.dataElement.id == customfieldobj.nonInsulinName) {
            validationResult.hideShow = false;
          }
        }

        if (
          values[customfieldobj.typeOfMedication] &&
          values[customfieldobj.typeOfMedication] != "Other"
        ) {
          if (
            fieldData.dataElement.id ==
              customfieldobj.nameOfAdditionalMedication ||
            fieldData.dataElement.id == customfieldobj.otherMedDosage
          ) {
            validationResult.hideShow = false;
          }
        }

        if (
          values[customfieldobj.typeOfMedicationRoutineVisits] &&
          values[customfieldobj.typeOfMedicationRoutineVisits] == "Insulin"
        ) {
          if (
            fieldData.dataElement.id ==
            customfieldobj.nameOfNonInsulinRoutineVisits
          ) {
            validationResult.hideShow = false;
          }
        }

        if (!values[customfieldobj.typeOfMedicationRoutineVisits]) {
          if (
            fieldData.dataElement.id ==
              customfieldobj.nameOfNonInsulinRoutineVisits ||
            fieldData.dataElement.id ==
              customfieldobj.nameOfAddMedicationRoutineVisits
          ) {
            validationResult.hideShow = false;
          }
        }

        if (
          values[customfieldobj.typeOfMedicationRoutineVisits] &&
          values[customfieldobj.typeOfMedicationRoutineVisits] == "Other"
        ) {
          if (
            fieldData.dataElement.id ==
            customfieldobj.nameOfNonInsulinRoutineVisits
          ) {
            validationResult.hideShow = false;
          }
        }

        if (
          values[customfieldobj.typeOfMedicationRoutineVisits] &&
          values[customfieldobj.typeOfMedicationRoutineVisits] != "Other"
        ) {
          if (
            fieldData.dataElement.id ==
            customfieldobj.nameOfAddMedicationRoutineVisits
          ) {
            validationResult.hideShow = false;
          }
        }

        // if (fieldData.dataElement.id =="TcabgaUKuC4"){
        if (fieldData.dataElement.id == customfieldobj.filledinby) {
          // values[customfieldobj.typeOfMedicationRoutineVisits] = programBoDetails
          if (!values[customfieldobj.filledinby]) {
            values[customfieldobj.filledinby] = userBO.displayName;
            formref.current.change("forceRenderField_", Math.random());
          }
        }

        let defaultFieldValue = "";
        if (fieldData.dataElement.fieldMask == "Default Facility") {
          let facility = OUJSON.filter((obj) => obj.id == orgid);
          defaultFieldValue = facility && facility[0] ? facility[0].name : "";
        }
        // if (values[customfieldobj.TimeTo] > values[customfieldobj.TimeFrom]){
        // }
        if (fieldData.dataElement.id == customfieldobj.other)
          validationResult.hideShow = false;
        if (
          values[customfieldobj.reasonForTodaysVisit] &&
          values[customfieldobj.reasonForTodaysVisit] == "Other"
        ) {
          if (fieldData.dataElement.id == customfieldobj.other)
            validationResult.hideShow = true;
        }
        setFieldStructure(
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            className={validationResult.hideShow == true ? "" : "hide"}
          >
            <Field name="forceRenderField_" component="input" type="hidden" />
            <Field
              name={fieldData.dataElement.id}
              label={getTranslatedLabels(fieldData.dataElement)}
              type={"text"}
              component={InputFieldFF}
              key={fieldData.dataElement.id}
              defaultValue={defaultFieldValue}
              required={
                fieldData.compulsory && validationResult.hideShow == true
                  ? true
                  : false
              }
              validate={composeValidators(required, scriptCheck)} //fieldData.compulsory && validationResult.hideShow == true ? hasValue : false
              // value=''
              className={customClassName}
              format={(value) => displayValue} // Here displayValue should already have the correct masking logic applied
              parse={(value) => value}
            />
          </Grid>
        );
      } else if (fieldType == "radio") {

        // if (
        //   values[customfieldobj.reasonForTodaysVisit] &&
        //   (values[customfieldobj.reasonForTodaysVisit] == "Routine Visit" ||
        //     values[customfieldobj.reasonForTodaysVisit] == "Quarterly Visit" ||
        //     values[customfieldobj.reasonForTodaysVisit] == "Collecting insulin")
        // ) {
        //   if (
        //     fieldData.dataElement.id == customfieldobj.footulcer ||
        //     fieldData.dataElement.id == customfieldobj.nephropathy ||
        //     fieldData.dataElement.id == customfieldobj.neuropathy ||
        //     fieldData.dataElement.id == customfieldobj.retinopathy
        //   )
        //     validationResult.hideShow = false;
        // }

        setFieldStructure(
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            className={
              validationResult.hideShow == true ? customClassName : "hide"
            }
          >
            <Grid item xs={11}>
              <Radios
                id={fieldData.dataElement.id}
                label={getTranslatedLabels(fieldData.dataElement)}
                name={fieldData.dataElement.id}
                required={
                  fieldData.compulsory && validationResult.hideShow == true
                    ? true
                    : false
                }
                data={optionSet != null ? optionSet : []}
                className={customClassName}
                // defaultValue={defaultValue}
              />
            </Grid>
            <Grid item xs={1}>
              <Field name={fieldData.dataElement.id}>
                {({ input }) => (
                  <IconButton
                    aria-label="reset"
                    onClick={() => {
                      input.onChange(""); // Final Form tracks this
                      setrenderKey(Math.random()); // if needed
                    }}
                    size="small"
                    style={{ marginTop: "10px" }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                )}
              </Field>
            </Grid>
          </Grid>
        );
      } else if (fieldType == "dropdown") {
         if (APP_LOCALE== "CC005" && !values[customfieldobj.entryPointId]) {
          values[customfieldobj.entryPointId] = "OPD";
          if (formref?.current) {
            formref.current.change("forceRenderField_", Math.random());
          }
        }

        if(APP_LOCALE === "CC013"){
          if(customfieldobj.occupationId && fieldData.dataElement.id == customfieldobj.occupationId){
              validationResult.hideShow = false;
              if(values[customfieldobj.ageUID] && values[customfieldobj.ageUID] >= 18){
                  validationResult.hideShow = true;
              }
          }
          if(customfieldobj.monthlyHouseholdIncomeId && fieldData.dataElement.id == customfieldobj.monthlyHouseholdIncomeId){
              validationResult.hideShow = false;
              if(values[customfieldobj.ageUID] && values[customfieldobj.ageUID] >= 18 && values[customfieldobj.occupationId] && (values[customfieldobj.occupationId] == "Self-employed" || values[customfieldobj.occupationId] == "Employed")){
                  validationResult.hideShow = true;
              }
          }
          if(customfieldobj.packYearsId && fieldData.dataElement.id == customfieldobj.packYearsId){
              validationResult.hideShow = false;
              if(values[customfieldobj.smokingId] && values[customfieldobj.smokingId] == "Active"){
                  validationResult.hideShow = true;
              }
          }
          if(customfieldobj.quitSmokingId && fieldData.dataElement.id == customfieldobj.quitSmokingId){
              validationResult.hideShow = false;
              if(values[customfieldobj.smokingId] && values[customfieldobj.smokingId] == "Ex-smoker"){
                  validationResult.hideShow = true;
              }
          }
        }

        //commented this as issue found in kier data upload
        // if (!values[customfieldobj.typeOfDiabetes]) {
        //   values[customfieldobj.typeOfDiabetes] = "Type 1";
        //   if (formref?.current) {
        //     formref.current.change("forceRenderField_", Math.random());
        //   }
        // }

        if (fieldData.dataElement.id == "Rc0D1mmFu8K") {
          if (values["ZTQ487xJDkp"] == "Yes") {
            values["Rc0D1mmFu8K"] = "Positive";
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

        if (
          values[customfieldobj.typeOfMedication] &&
          values[customfieldobj.typeOfMedication] == "Other"
        ) {
          if (
            fieldData.dataElement.id == customfieldobj.insulinType ||
            fieldData.dataElement.id == customfieldobj.nonInsulinFrequency ||
            fieldData.dataElement.id == customfieldobj.insulinFrequency ||
            fieldData.dataElement.id == customfieldobj.insulinName
          ) {
            validationResult.hideShow = false;
          }
        }
        if (
          values[customfieldobj.typeOfMedication] &&
          values[customfieldobj.typeOfMedication] != "Other"
        ) {
          if (fieldData.dataElement.id == customfieldobj.otherMedFrequency) {
            validationResult.hideShow = false;
          }
        }

        if (
          values[customfieldobj.typeOfMedicationRoutineVisits] &&
          values[customfieldobj.typeOfMedicationRoutineVisits] == "Non-Insulin"
        ) {
          if (
            // fieldData.dataElement.id == customfieldobj.typeOfInsulinRoutineVisits||
            fieldData.dataElement.id ==
              customfieldobj.nameOfInsulinRoutineVisits ||
            fieldData.dataElement.id == customfieldobj.frequencyRoutineVisits
          ) {
            validationResult.hideShow = false;
          }
          if (
            fieldData.dataElement.id ==
            customfieldobj.frequencyOfNonInsulinRoutineVisits
          ) {
            validationResult.hideShow = true;
          }
        }
        if (
          values[customfieldobj.typeOfMedicationRoutineVisits] &&
          values[customfieldobj.typeOfMedicationRoutineVisits] == "Insulin"
        ) {
          if (
            fieldData.dataElement.id ==
            customfieldobj.frequencyOfNonInsulinRoutineVisits
          ) {
            validationResult.hideShow = false;
          }
        }
        if (!values[customfieldobj.typeOfMedicationRoutineVisits]) {
          if (
            fieldData.dataElement.id ==
              customfieldobj.frequencyOfNonInsulinRoutineVisits ||
            fieldData.dataElement.id ==
              customfieldobj.frequencyOfAddMedicationRoutineVisits ||
            fieldData.dataElement.id ==
              customfieldobj.frequencyOfmissedDosesRoutineVisits ||
            fieldData.dataElement.id ==
              customfieldobj.frequencyOfbloodGlucoseRoutineVisits
          ) {
            validationResult.hideShow = false;
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
        if (
          values[customfieldobj.typeOfMedicationRoutineVisits] &&
          values[customfieldobj.typeOfMedicationRoutineVisits] != "Other"
        ) {
          if (
            fieldData.dataElement.id ==
              customfieldobj.frequencyOfAddMedicationRoutineVisits ||
            fieldData.dataElement.id ==
              customfieldobj.frequencyOfmissedDosesRoutineVisits ||
            fieldData.dataElement.id ==
              customfieldobj.frequencyOfbloodGlucoseRoutineVisits
          ) {
            validationResult.hideShow = false;
          }
        }

        if (
          fieldData.dataElement.id == customfieldobj.treatmentstartedId &&
          customfieldobj.tptIntiationStageId
        ) {
          try {
            document.querySelector(
              ".section-1-" + customfieldobj.tptIntiationStageId
            ).style.display = "none";
            if (values[customfieldobj.treatmentstartedId] == "Yes") {
              document.querySelector(
                ".section-1-" + customfieldobj.tptIntiationStageId
              ).style.display = "block";
            }
          } catch (e) {}
        }
        if (fieldData.dataElement.id == customfieldobj.CRPreportavailableID) {
          customProps = {
            ...customProps,
            className: "hide",
            required: false,
            validate: false,
          };
          if (
            values &&
            values[customfieldobj.hivStatusId] &&
            values[customfieldobj.hivStatusId] == "Positive"
          ) {
            customProps = {
              ...customProps,
              className: "",
              required: false,
              validate: false,
            };
          }
        }
        if (fieldData.dataElement.id == customfieldobj.patientStatus) {
          if (values && values[customfieldobj.changestatus] != "Yes") {
            // fieldData.dataElement.attributeValues[0].attribute.name = 'isDisabled'
            if (APP_LOCALE === "PRODUCT") {
              fieldData.dataElement.attributeValues[0].attribute.name =
                "isDisabled";
            }
          } else if (values && values[customfieldobj.changestatus] == "Yes") {
            fieldData.dataElement.attributeValues[0].attribute.name =
              "ShowInTable";
          }
          if (
            values &&
            values[customfieldobj.patientStatus] == "On Treatment"
          ) {
            customProps = { ...customProps, disabled: true };
          }
        }
        if (fieldData.dataElement.id == customfieldobj.patientStatus) {
          if (!values[customfieldobj.changestatus]) {
            values[customfieldobj.changestatus] = "No";
          }
        }

        if (
          fieldData.dataElement.id ==
            customfieldobj.HaveyouhadanycontactwithTBdiseasepatientID ||
          fieldData.dataElement.id ==
            customfieldobj.Haveyoucomecontactwithsomeonepast5yearsID
        ) {
          if (
            values[customfieldobj.clientTypeID] &&
            Configuration &&
            Configuration.ltbiLinkVariables &&
            values[customfieldobj.clientTypeID] ==
              Configuration.ltbiLinkVariables.contact
          ) {
            customProps = {
              ...customProps,
              className: "hide",
            };
          }
        }

         if (fieldData.dataElement.id == customfieldobj.typeOfDiabetes) {
          if (APP_LOCALE === "CC005" && !isDrop) {
              if (!values[customfieldobj.typeOfDiabetes]) {
                values[customfieldobj.typeOfDiabetes] = "Type 1";
                if (formref?.current) {
                  formref.current.change("forceRenderField_", Math.random());
                }
              }
              fieldData.dataElement.attributeValues[0].attribute.name =
                "isDisabled";
            }
        }

        try {
          if (
            fieldData.dataElement.id == customfieldobj.testingforTBinfectionID
          ) {
            if (values && values[fieldData.dataElement.id]) {
              if (customProps && customProps.className == "hide") {
                delete values[fieldData.dataElement.id];
              }
            }
          }

          if (fieldData.dataElement.id == customfieldobj.eligibleforTPTId) {
            customProps = { ...customProps, className: "hide" };
            if (
              validationResult.hideShow == true &&
              values[symptomsFID] &&
              values[symptomsFID].includes(customfieldobj.noneOptionID) &&
              values[customfieldobj.CXRreportavailableID] &&
              (values[customfieldobj.CXRreportavailableID] == "No" ||
                (values[customfieldobj.CXRresultId] &&
                  values[customfieldobj.CXRresultId] ==
                    "Not suggestive of TB")) &&
              values[customfieldobj.mWRDreportavailableID] &&
              (values[customfieldobj.mWRDreportavailableID] == "No" ||
                (values[customfieldobj.mWRDresultId] &&
                  values[customfieldobj.mWRDresultId] == "Negative"))
            ) {
              //customProps = { ...customProps, className: "" };
              if (
                !values[customfieldobj.hivStatusId] ||
                values[customfieldobj.hivStatusId] != "Positive" ||
                (values[customfieldobj.hivStatusId] &&
                  values[customfieldobj.hivStatusId] == "Positive" &&
                  values[customfieldobj.CRPreportavailableID] &&
                  (values[customfieldobj.CRPreportavailableID] == "No" ||
                    (values[customfieldobj.CRPresultId] &&
                      values[customfieldobj.CRPresultId] == "Negative")))
              ) {
                customProps = { ...customProps, className: "" };
              }
            }
            if (
              values[customfieldobj.eligibleforTPTId] &&
              values[customfieldobj.testingforTBinfectionID] &&
              values[customfieldobj.testingforTBinfectionID] == "Yes"
            ) {
              delete values[fieldData.dataElement.id];
            }
          }
        } catch (e) {}
        try {
          if (values[fieldData.dataElement.id]) {
            let isValueExist = true;
            isValueExist = optionSet.find(
              (obj) => obj.value == values[fieldData.dataElement.id]
            );
            if (isValueExist == undefined) {
              delete values[fieldData.dataElement.id];
            }
          }
        } catch (e) {}
        if (validationResult.hideShow == true) {
          setFieldStructure(
            //     <Grid
            //     item
            //     xs={12}
            //     sm={getTranslatedLabels(fieldData.dataElement) === 'Type of Medication' ? 6 : 4}
            //     md={getTranslatedLabels(fieldData.dataElement) === 'Type of Medication' ? 6 : 4}
            //     {...customProps}
            //   >
            <Grid item xs={12} sm={12} md={12} {...customProps}>
              {/* <Grid item xs={12} sm={getTranslatedLabels(fieldData.dataElement) === 'Type of Medication' ? 12 : 4} md={getTranslatedLabels(fieldData.dataElement) === 'Type of Medication' ? 12 : 4} {...customProps}> */}
              <Field
                id={fieldData.dataElement.id}
                name={fieldData.dataElement.id}
                label={getTranslatedLabels(fieldData.dataElement)}
                // type={fieldData.dataElement.valueType}

                component={SingleSelectFieldFF}
                key={fieldData.dataElement.id}
                // validate={
                //   fieldData.compulsory && validationResult.hideShow == true
                //     ? hasValue
                //     : false
                // }
                validate={
                  fieldData.compulsory && validationResult.hideShow === true
                    ? (value) => (value ? undefined : t("Required"))
                    : undefined
                }
                required={
                  fieldData.compulsory && validationResult.hideShow == true
                    ? true
                    : false
                }
                options={[
                  { label: t("Please Select"), value: "" },
                  ...(optionSet != null ? optionSet : []),
                ]}
                disabled={
                  fieldData.dataElement.attributeValues &&
                  fieldData.dataElement.attributeValues.length > 0
                    ? fieldData.dataElement.attributeValues[0].attribute.name ==
                      "isDisabled"
                      ? true
                      : false
                    : false
                }
                // onChange={() => this.onDropdownOptionChange(attribute.dataElement)}
                className={customClassName}
                // className={getTranslatedLabels(fieldData.dataElement) === 'Type of Medication' ? `${customClassName} customWidth` : customClassName}
              />
            </Grid>
          );
        } else {
          setFieldStructure(
            <Grid item xs={12} sm={12} md={12} className={"hide"}>
              <Field
                name={fieldData.dataElement.id}
                label={getTranslatedLabels(fieldData.dataElement)}
                type={"text"}
                component={InputFieldFF}
                key={fieldData.dataElement.id}
                required={
                  fieldData.compulsory && validationResult.hideShow == true
                    ? true
                    : false
                }
                validate={composeValidators(required, scriptCheck)} //fieldData.compulsory && validationResult.hideShow == true ? hasValue : false
                value=""
                className={customClassName + " classfortext"}
              />
            </Grid>
          );
        }
      }
    }
  }, [fieldType, optionSet, validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function DateFieldConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  let customfieldobj = props.customfieldobj;
  let showYear =
    fieldData.dataElement.attributeValues.length > 0 &&
    fieldData.dataElement.attributeValues[0].attribute.name == "showyear"
      ? true
      : false;
  let hideField =
    fieldData.dataElement.attributeValues.length > 0 &&
    fieldData.dataElement.attributeValues[0].attribute.name == "hideField"
      ? true
      : false;
  let customProps = {};
  let ismaskable = props.ismaskable;
  let formref = props.formref;
  const [fieldStructure, setFieldStructure] = useState(null);
  const [selectedDate, setDate] = useState(new Date());
  const [validationResult, setValidationResult] = useState(null);
  const [selectedDateethiopia, setDateEthiopia] = useState(null); //For Ethiopia
  const config = useConfig();
    const [trigger, setTrigger] = useState(0);
    const { t } = useTranslation();

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    if (APP_LOCALE == "CC004") {
      if (values[fieldData.dataElement.id]) {
        const storedDate = values[fieldData.dataElement.id]; // Example: "2025-01-23"
        const [year, month, day] = storedDate.split("-").map(Number);

        // Convert Gregorian to Ethiopian for display purposes
        const ethiopianDate = toEthiopianDateString(
          new Date(year, month - 1, day)
        );

        // Assuming Ethiopian date is in the format "Day Month Year"
        setDateEthiopia(new Date(year, month - 1, day));
        //setDateEthiopia(new Date(values[fieldData.dataElement.id]));
      }
    }
  }, [values[fieldData.dataElement.id]]);

  useEffect(() => {
    fetchValidation();
  }, [values]);

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
          } else {
            if (APP_LOCALE == "CC004") {
              values[fieldData.dataElement.id] = selectedDateethiopia;
            } else {
              values[fieldData.dataElement.id] = selectedDate;
            }
            // sessionStorage.setItem('defaultdateflag', "true");
            sessionStorage.setItem(defaultDateFlagKey, "true");
          }
        } else {
        }
      } else if (defaultdateflag === "true") {
        const shouldSetDefaultDate_ = checkFieldCondition_dhis_(
          config,
          "createfield",
          values,
          customfieldobj,
          fieldData
        );

        if (shouldSetDefaultDate_) {
          if (values[fieldData.dataElement.id]) {
          } else {
            if (APP_LOCALE == "CC004") {
              values[fieldData.dataElement.id] = selectedDateethiopia;
            } else {
              values[fieldData.dataElement.id] = selectedDate;
            }
          }
        }
      }
      if (
        values[customfieldobj.dateofInitialAssessment] &&
        values[customfieldobj.dateOfEntry] &&
        APP_LOCALE === "CC002"
      ) {
        let initialAssessmentDate = new Date(
          values[customfieldobj.dateofInitialAssessment]
        );
        let entryDate = new Date(values[customfieldobj.dateOfEntry]);

        if (entryDate < initialAssessmentDate) {
          values[customfieldobj.dateOfEntry] = null;
          delete values[customfieldobj.dateOfEntry];
          setDate(null);
          swal({
            icon: "warning",
            title: t("Invalid Date Selection"),
            text: t(`Date of Entry cannot be before the Initial Assessment Date`),
            confirmButtonText: t("OK"),
          });
        }
      }
      if (
        values[customfieldobj.dateofInitialAssessment] &&
        values[customfieldobj.dateOfFollowUp] &&
        APP_LOCALE === "CC002"
      ) {
        let initialAssessmentDate = new Date(
          values[customfieldobj.dateofInitialAssessment]
        );
        let followUpDate = new Date(values[customfieldobj.dateOfFollowUp]);
        if (followUpDate < initialAssessmentDate) {
          values[customfieldobj.dateOfFollowUp] = null;
          delete values[customfieldobj.dateOfFollowUp];
          setDate(null);
          swal({
            icon: "warning",
            title: t("Invalid Date Selection"),
            text: t("Follow up Date cannot be before the Initial Assessment Date."),
            confirmButtonText: t("OK"),
          });
        }
      }

      if (
        values[customfieldobj.dateofInitialAssessment] &&
        values[customfieldobj.dateOfDiagnosis]
      ) {
        let initialAssessmentDate = new Date(
          values[customfieldobj.dateofInitialAssessment]
        );
        let diagnosisDate = new Date(values[customfieldobj.dateOfDiagnosis]);

        if (diagnosisDate > initialAssessmentDate) {
          delete values[customfieldobj.dateOfDiagnosis];
          setDate(null);
          swal({
            icon: "warning",
            title: t("Invalid Date Selection"),
            text: t("Date of Diagnosis cannot be later than Initial Assessment Date"),
            confirmButtonText: t("OK"),
          });
        }
      }
      //
      if (fieldData.dataElement.id == customfieldobj.dateOfDiagnosis) {
        fieldData.allowFutureDate = false;
      }

      if (
        fieldData.dataElement.id == customfieldobj.dateOfLastFollowUp &&
        values[customfieldobj.patientStatus] &&
        values[customfieldobj.patientStatus] != "Died" &&
        values[customfieldobj.patientStatus] != "Lost to follow up"
      ) {
        customProps = {
          ...customProps,
          className: "hide",
        };
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
          const [year, month, day] = fieldValue.split("-").map(Number);
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
          if (!value || value === "" || value === null || value === undefined) {
            if(props.pageType) return undefined;
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
             <div>
              <OnChange name="forceRenderField_">
                              {() => {
                                setTrigger((prev) => prev + 1);
                              }}
                            </OnChange>
                            <Field name="forceRenderField_" component="input" type="hidden" />
            <Field
              name={fieldData.dataElement.id}
              key={`${fieldData.dataElement.id}-${validationResult.hideShow}`}
              validate={
                fieldData.compulsory && validationResult.hideShow === true
                  ? requiredDate
                  : undefined
              }
            >
              {({ input, meta }) => {
                // Determine if there's an error to show
                const showError =
                  (meta.error && meta.touched) ||
                  (meta.error && meta.submitFailed);

                            return (
                                 <div style={{ paddingTop: '20px', marginBottom: '10px' }}>
                            <EtDatePicker
                                label={getTranslatedLabels(fieldData.dataElement)}
                                name={fieldData.dataElement.id}
                                className={`${customClassName} ethiopian-datepicker-tall`}
                                locale="am-ET" // Ethiopian calendar locale
                                format="MMM dd/yyyy"
                                disableFuture={fieldData.allowFutureDate && fieldData.allowFutureDate == true ? false : true}
                                disablePast={disablePastVal}
                                value={ input.value ? new Date(input.value) : selectedDateethiopia instanceof Date ? selectedDateethiopia : '' }
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
                                    if (formref?.current) {
                                        formref.current.change("forceRenderField_", Math.random());
                                    }
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
                        </div>
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
                    <>
                      {APP_LOCALE === "CC005" ? (
                        <DatePicker
                          label={getTranslatedLabels(fieldData.dataElement)}
                          name={fieldData.dataElement.id}
                          required={
                            fieldData.compulsory && validationResult.hideShow === true
                          }
                          dateFunsUtils={DateFnsUtils}
                          value={input.value || null}
                          onChange={(value) => input.onChange(value)}
                          onBlur={input.onBlur}
                          margin="normal"
                          variant="inline"
                          format={showYear ? "yyyy" : dataFormat1}
                          views={showYear ? ["year"] : ["year", "month", "date"]}
                          openTo={showYear ? "year" : "date"}
                          disableFuture={
                            fieldData.allowFutureDate &&
                            fieldData.allowFutureDate === true
                              ? false
                              : true
                          }
                          disablePast={disablePastVal}
                          className={customClassName}
                          error={showError}
                          helperText={showError ? meta.error : ""}
                        />
                      ) : (
                        <DatePicker
                          disabled={showYear ? true : false}
                          label={getTranslatedLabels(fieldData.dataElement)}
                          name={fieldData.dataElement.id}
                          required={
                            fieldData.compulsory && validationResult.hideShow === true
                          }
                          dateFunsUtils={DateFnsUtils}
                          value={input.value || null}
                          onChange={(value) => input.onChange(value)}
                          onBlur={input.onBlur}
                          margin="normal"
                          variant="inline"
                          format={showYear === true ? "yyyy" : dataFormat1}
                          views={showYear ? ["year"] : ["year", "month", "date"]}
                          openTo={showYear ? "year" : "date"}
                          disableFuture={
                            fieldData.allowFutureDate &&
                            fieldData.allowFutureDate === true
                              ? false
                              : true
                          }
                          disablePast={disablePastVal}
                          className={customClassName}
                          error={showError}
                          helperText={showError ? meta.error : ""}
                        />
                      )}
                    </>
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
            type="text"
            component={InputFieldFF}
            key={fieldData.dataElement.id}
            label={getTranslatedLabels(fieldData.dataElement)}
            format={(value) => displayValue} // Here displayValue should already have the correct masking logic applied
            parse={(value) => value}
            className={customClassName}
          />
        );
      }

      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
          {content}
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")],selectedDateethiopia);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function DateTimeFieldConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName;
  let dataElementGroup = props.dataElementGroup;
  let showYear =
    fieldData.dataElement.attributeValues.length > 0 &&
    fieldData.dataElement.attributeValues[0].attribute.name == "showyear"
      ? true
      : false;
  const [fieldStructure, setFieldStructure] = useState(null);
  const [selectedDate, setDate] = useState(new Date());
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
      const dateFormat = getDateFormat("dateformat");
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
          <DateTimePicker
            disabled={showYear ? true : false}
            label={getTranslatedLabels(fieldData.dataElement)}
            name={fieldData.dataElement.id}
            required={
              fieldData.compulsory && validationResult.hideShow == true
                ? true
                : false
            }
            dateFunsUtils={DateFnsUtils}
            value={
              values[fieldData.dataElement.id] == undefined
                ? selectedDate
                : values[fieldData.dataElement.id]
            }
            margin="normal"
            variant="inline"
            format={showYear == true ? "yyyy" : dateFormat}
            views={showYear ? ["year"] : ["year", "month", "date"]}
            openTo={showYear ? "year" : "date"}
            validate={
              selectedDate.compulsory && validationResult.hideShow == true
                ? hasValue
                : false
            }
            disableFuture={
              fieldData.allowFutureDate ? fieldData.allowFutureDate : false
            }
            className={customClassName}
          />
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function AgeFieldConfig(props) {
  const { t } = useTranslation();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;

  const required = (value) =>
    fieldData.compulsory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;
  const mustBeNumber = (value) =>
    isNaN(value) && value ? t("Must be a number") : undefined;
  const minValue = (min) => (value) =>
    isNaN(value) || value >= min
      ? undefined
      : t("Should be greater than") + " " + min;
  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
          <Field
            name={fieldData.dataElement.id}
            label={getTranslatedLabels(fieldData.dataElement)}
            type="number"
            component={InputFieldFF}
            key={fieldData.dataElement.id}
            required={
              fieldData.compulsory && validationResult.hideShow == true
                ? true
                : false
            }
            validate={composeValidators(required, mustBeNumber)}
            className={customClassName}
          />
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function PhoneNumberFieldConfig(props) {
  const { t } = useTranslation();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;

  const numberFormat = (value) =>
    isNaN(value) && value ? `Incorrect format` : undefined;

  const maxLength = (max) => (value) =>
    value
      ? isNaN(value) || value.length > max
        ? t("Should be less than") + " " + max
        : undefined
      : undefined;
  const required = (value) =>
    fieldData.compulsory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;

  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
          <Field
            name={fieldData.dataElement.id}
            label={getTranslatedLabels(fieldData.dataElement)}
            type={"number"}
            component={InputFieldFF}
            key={fieldData.dataElement.id}
            required={
              fieldData.compulsory && validationResult.hideShow == true
                ? true
                : false
            }
            validate={composeValidators(required, numberFormat, maxLength(12))}
            className={customClassName}
          />
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function EmailFieldConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;

  const EMAIL_ADDRESS_PATTERN =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

  const invalidEmailMessage = "Please provide a valid email address";

  const email = (value) =>
    isEmpty(value) || (isString(value) && EMAIL_ADDRESS_PATTERN.test(value))
      ? undefined
      : invalidEmailMessage;

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
          <Field
            name={fieldData.dataElement.id}
            label={getTranslatedLabels(fieldData.dataElement)}
            type={"email"}
            component={InputFieldFF}
            key={fieldData.dataElement.id}
            required={
              fieldData.compulsory && validationResult.hideShow == true
                ? true
                : false
            }
            validate={email}
            className={customClassName}
          />
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function DefaultValueField(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  const [UIC, setUIC] = useState(null);

  async function getUIC() {
    if (UIC == null) {
      let getUIC = await apiServices.generateUIC(fieldData.dataElement.id);
      setUIC(getUIC.value);
    }
  }
  useEffect(() => {
    getUIC();
  }, []);

  return (
    <>
      {UIC != null ? (
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
      ) : (
        <> </>
      )}
    </>
  );
}

function DefaultStageValueField(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  const [randomNumber, setRandomNumber] = useState(null);

  async function getRandomNumber() {
    if (randomNumber == null) {
      let param = {
        length: 8,
      };
      let getRandomNumber = await apiServices.generateRandomNumber(param);
      setRandomNumber(getRandomNumber.random);
    }
  }
  useEffect(() => {
    getRandomNumber();
  }, []);

  return (
    <>
      {randomNumber != null ? (
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
      ) : (
        <> </>
      )}
    </>
  );
}

function BooleanFieldConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  const switchData = [{ label: "Yes", value: "item1" }];

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
          <Switches
            label={getTranslatedLabels(fieldData.dataElement)}
            name={fieldData.dataElement.id}
            disableRipple
            required={
              fieldData.compulsory && validationResult.hideShow == true
                ? true
                : false
            }
            data={switchData}
            className={customClassName}
          />
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function TimeFieldConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  let customfieldobj = props.customfieldobj;
  let customProps = {};
  let showYear =
    fieldData.dataElement.attributeValues.length > 0 &&
    fieldData.dataElement.attributeValues[0].attribute.name == "showyear"
      ? true
      : false;
  const [fieldStructure, setFieldStructure] = useState(null);
  const [selectedDate, setDate] = useState(new Date());
  const [validationResult, setValidationResult] = useState(null);
  // const [error, setError] = useState(null);
  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }
  // const initialTime = values[fieldData.dataElement.id] || null;
  // const [selectedTime, setSelectedTime] = useState(initialTime);
  const [selectedTime, setSelectedTime] = useState(null);
  const convertToTimePickerValue = (timeString) => {
    if (!timeString) return null;
    const now = new Date();
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
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
    fetchValidation();
  }, [values]);
  const handleTimeChange = (time) => {
    const formattedTime = format(time, "HH:mm");

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
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
          <TimePicker
            label={getTranslatedLabels(fieldData.dataElement)}
            name={fieldData.dataElement.id}
            // error={fieldData.compulsory && !selectedTime} // Display error if required and no time is selected
            // helperText={
            //     fieldData.compulsory && !selectedTime
            //         ? "This field is required."
            //         : ""
            // }// Display error message
            required={
              fieldData.compulsory && validationResult.hideShow == true
                ? true
                : false
            }
            dateFunsUtils={DateFnsUtils}
            onChange={handleTimeChange}
            value={selectedTime}
            margin="normal"
            variant="inline"
            format="HH:mm"
            className={customClassName}
          />
        </Grid>
      );
    }
  }, [validationResult, selectedTime, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function IntegerConfig(props) {
  const { t, i18n } = useTranslation();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  // const [values, setValues] = useState(props.values || {}); // Initialize local state

  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  let customfieldobj = props.customfieldobj;
  let customProps = {};
  let programData = props.programData;
  let currentstagename = props.currentstagename;
  let programBoDetails = props.programBoDetails;
  let activeCaseFormData = props.activeCaseFormData;
  let activeCaseDetails = props.activeCaseDetails;
  let formref = props.formref;
  let orguid = programBoDetails?.orguid || "";
  let programuid = programBoDetails?.programuid || "";
  let trackedEntityInstance =
    activeCaseDetails?.data?.trackedEntityInstance || "";
  let bmiCategoryLabel = "";
  // let age = activeCaseFormData?.data?.formFormat?.[customfieldobj.regage] || "";
  let age = "";
  const ageAttribute = programData.programTrackedEntityAttributes.find(
    (attr) => attr.trackedEntityAttribute.description === "Age"
  );

  if (ageAttribute) {
    // setAgeId(ageAttribute.trackedEntityAttribute.id);
    age = values[ageAttribute.trackedEntityAttribute.id];
  }

  // Logging the values
  let ageValue = age ? parseFloat(age) : 0;
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
  const [formValues, setFormValues] = useState({});
  const [bmicondition, setBmiCondition] = useState();
  const [bmizcondition, setBmiZCondition] = useState();

  const proxiedValues = useMemo(() => {
    return new Proxy(values, {
      set(target, prop, value) {
        target[prop] = value; // Update the value in the original `values` object
        setForceUpdate((prev) => prev + 1); // Trigger re-render
        return true;
      },
    });
  }, [values]);
  // Function to get data element ID by attribute name
  const getDataElementIdByAttribute = (stage, attributeName) => {
    const element = stage.programStageDataElements.find((el) => {
      return el.dataElement.attributeValues.some(
        (attr) => attr.attribute.name === attributeName && attr.value === "true"
      );
    });
    return element ? element.dataElement.id : null;
  };

  // Function to check if the stage has the CalcBMI attribute
  const hasCalcBMIAttribute = (stage) => {
    return stage.attributeValues?.some(
      (attr) => attr.attribute.name === "CalcBMI" && attr.value === "true"
    );
  };

  useEffect(() => {}, [fieldData, customfieldobj, values, programData]);

  // Fetch unit when programData changes
  useEffect(() => {
    const unit = getAttributeValue(programData.attributeValues, "BMIUnit");
    setBmiUnit(unit);
  }, [programData]);

  useEffect(() => {
    const currentStage = programData.programStages.find(
      (stage) => stage.name === currentstagename
    );
    if (currentStage && hasCalcBMIAttribute(currentStage)) {
      const deId = getDataElementIdByAttribute(currentStage, "BMIFlag");
      const wtId = getDataElementIdByAttribute(currentStage, "WeightForBMI");
      const htId = getDataElementIdByAttribute(currentStage, "HeightForBMI");

      if (deId && wtId && htId) {
        setdeidval(deId);
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
        values[customfieldobj.bmizscore] = "";
        console.log("ageValue ",ageValue)
        if (variableweight && variableheight && ageValue >= 2) {
          const calculatedBMI = dynamiccalculateBMI(
            variableweight,
            variableheight,
            bmiUnit
          );
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

  const [bmiZScore, setBmiZScore] = useState(null);
  const [ageAlertShown, setAgeAlertShown] = useState(false);
  //const bmiValue_ = values?.[dataElementId] ?? "";
  //OLD WORKING CODE
  // useEffect(() => {
  //   const currentStage = programData.programStages.find(
  //     (stage) => stage.name === currentstagename
  //   );
  //   if (currentStage && hasCalcBMIAttribute(currentStage)) {
      

  //     if (
  //       (values[customfieldobj.bmiID] && !values[customfieldobj.bmizscore]) ||
  //       values[customfieldobj.bmizscore] === ""
  //     ) {
  //         const handleInputChange_ = (event) => {
  //       const apiUrl = `dashboardIndicator/getBMIZScore?programuid=${programuid}&orguid=${orguid}&instanceuid=${trackedEntityInstance}&bmiValue=${values[dataElementId]}`;
  //       apiServices
  //         .getAPI(apiUrl)
  //         .then((response) => {
  //           if (response.data?.data?.length > 0) {
  //             const bmiZScore = response.data.data[0]["BMIZ Score"];
  //             values[customfieldobj.bmizscore] = bmiZScore;
             
  //             setFormValues((prevValues) => ({
  //               ...prevValues,
  //               [customfieldobj.bmizscore]: bmiZScore,
  //             }));

  //             setBmiZScore(bmiZScore);
  //           } else {
  //             // swal({
  //             //     title: "Please check the data",
  //             //     text: `Please check if the required data is filled in to calculate BMI Z-Score`,
  //             //     icon: "warning",
  //             //     button: "OK",
  //             // });
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("Error fetching BMI Z-Score:", error);
  //         });
  //       };

  //        function debounce(func, delay) {
  //           let timer;
  //           return function (...args) {
  //             clearTimeout(timer);
  //             timer = setTimeout(() => func.apply(this, args), delay);
  //           };
  //         }
  //        const element = document.getElementById(height);
  //     const debouncedHandleInputChange = debounce(handleInputChange_, 1000); // 800ms delay

  //     if (element) {
  //       element.addEventListener("input", debouncedHandleInputChange);
  //     }
  //     }
  //     if (!ageValue || ageValue > 19) {
  //       if (!ageAlertShown) {
  //         // swal({
  //         //     title: " Either Age is above 19 or date of birth is not selected",
  //         //     text: `BMI Z-Score is applicable only for ages 19 and below`,
  //         //     icon: "warning",
  //         //     button: "OK",
  //         // });
  //         setAgeAlertShown(true);
  //       }
  //       return; // Exit early if age is empty or > 19
  //     } else {
  //       setAgeAlertShown(false);
  //     }
       
  //   }
  // }, [values[dataElementId]]);

  useEffect(() => {
    if (fieldData.dataElement.id !== customfieldobj.bmiID) return; 

  const currentStage = programData.programStages.find(
    (stage) => stage.name === currentstagename
  );

  if (!currentStage || !hasCalcBMIAttribute(currentStage)) return;

  const bmiValue = values[dataElementId];

  // 🟢 Reset Z-score when BMI is blank
  if (!bmiValue || bmiValue === "") {
    if (typeof setFormValues === "function") {
      setFormValues((prev) => ({
        ...prev,
        [customfieldobj.bmizscore]: "",
      }));
    }
    if (typeof setBmiZScore === "function") {
      setBmiZScore("");
    }
    return;
  }

  if (currentStage && hasCalcBMIAttribute(currentStage)) {
    // Debounce timer
    const timer = setTimeout(() => {
      // --- Check BMI Z-Score conditions ---
      //if(values[customfieldobj.bmiID]) {
        const apiUrl = `dashboardIndicator/getBMIZScore?programuid=${programuid}&orguid=${orguid}&instanceuid=${trackedEntityInstance}&bmiValue=${values[dataElementId]}`;

        apiServices
          .getAPI(apiUrl)
          .then((response) => {
            if (response.data?.data?.length > 0) {
              const bmiZScore = response.data.data[0]["BMIZ Score"] || "";
              values[customfieldobj.bmizscore] = values[customfieldobj.bmiID]?bmiZScore : ""; 
              setFormValues((prevValues) => ({
                ...prevValues,
                [customfieldobj.bmizscore]: values[customfieldobj.bmiID]?bmiZScore : "",
              }));

              setBmiZScore(bmiZScore?bmiZScore:"");
              setBmiZCondition(response.data.data[0]["interpretation"] ? t(response.data.data[0]["interpretation"]) : "")
            } else {
              // 
              // toast.warn(
              //   "Please check if the required data is filled in to calculate BMI Z-Score"
              // );
              // Clear previous value
              formref.current.change(customfieldobj.bmizscore, '');
              formref.current.change("forceRenderField_", Math.random());
              
              values[customfieldobj.bmizscore] = "";

              setFormValues((prev) => ({
                ...prev,
                [customfieldobj.bmizscore]: "",
              }));
              
              setBmiZScore("");
              setBmiZCondition("");
            }
          })
          .catch((error) => {
            console.error("Error fetching BMI Z-Score:", error);
          });
      //}

      // --- Check Age conditions ---
      if (!ageValue || ageValue > 19) {
        if (!ageAlertShown) {
          // 
          // toast.warn(
          //   "Either Age is above 19 or date of birth is not selected. BMI Z-Score is applicable only for ages 19 and below"
          // );
          setAgeAlertShown(true);
        }
        return; 
      } else {
        setAgeAlertShown(false);
      }
    }, 1000); 

   
    return () => clearTimeout(timer);
  }
}, [values[dataElementId], ageValue, ageAlertShown, programData, currentstagename,i18n.language]);

useEffect(() => {
  try{
    const fieldId = customfieldobj.bmizscore;
    const value = bmiZScore ?? "";

    if (formref?.current?.change && fieldId) {
      formref.current.change(fieldId, value);
    }

    values[fieldId] = value;
  }catch(e){ console.log(e) }
}, [bmiZScore]);

  // useEffect(() => {
  //   try{
  //     if (bmiZScore !== null) {
  //       const heightInput = document.getElementById(height);
  //         setTimeout(() => {
  //           //const bmizInput = document.getElementById("Ubz8DR9cmzv"); // Ensure correct ID
  //         //  formref.current.change("forceRenderField_", Math.random());
  //             const bmizInput = document.getElementById(customfieldobj.bmizscore);
            
  //             values[customfieldobj.bmizscore] = bmiZScore;
  //             bmizInput.focus();
  //             // bmizInput.blur()
              
  //             setTimeout(() =>  bmizInput.blur(), 30);
  //             heightInput.focus();
  //             // if (bmizInput) {
  //             //  bmizInput.focus();
  //             //  setTimeout(() => bmizInput.blur(), 300);
  //             // }
  //         }, 200); // Small delay ensures UI updates first
  //         heightInput.focus();
  //       }
  //   }catch(e){console.log(e)}
  // }, [bmiZScore]);

useEffect(() => {
  if (bmiZScore == null) return;

  try {
    const fieldId = customfieldobj.bmizscore;

    // Preferred: Update via Final Form API
    if (formref?.current?.change) {
      formref.current.change(fieldId, bmiZScore);
      formref.current.change("forceRenderField_", Math.random()); // optional
      if (values) values[fieldId] = bmiZScore;
      return;
    }

    // Fallback: Update DOM input safely
    const input = document.getElementById(fieldId);
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      ).set;
      setter.call(input, bmiZScore);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      if (values) values[fieldId] = bmiZScore;
    } else {
      console.warn("BMIZ input not found:", fieldId);
    }
  } catch (err) {
    console.error("BMIZ update failed:", err);
  }
}, [bmiZScore, formref, customfieldobj, values]);



  //-----------------------------------------------------------------------------//
  const decimalregex = /^\d+(\.\d{1,2})?$/;
  const required = (value) =>
    fieldData.compulsory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;
  const mustBeNumber = (value) =>
    isNaN(value) && value ? t("Must be a number") : undefined;
  const mustBeInteger = (value) =>
    value && value % 1 !== 0 ? t("Age cannot be in Decimals") : undefined;

  const minValue = (min) => (value) =>
    isNaN(value) || value >= min
      ? undefined
      : t("Should be greater than/equal to") + " " + min;

  const maxValue = (max) => (value) =>
    isNaN(value) || value <= max
      ? undefined
      : t("Should be less than/equal to") + " " + max;

  const maxLength = (max) => (value) =>
    value
      ? isNaN(value) || value.length > max
        ? t("Should be less than") + " " + (max + 1) + " " + "digits"
        : undefined
      : undefined;
  const validateDecimalPlaces = (value) =>
    value
      ? isNaN(value) || decimalregex.test(value)
        ? undefined
        : t("Should be less than 3 decimal places")
      : undefined;
  const maxLengthv = (max) => (value) =>
    value
      ? isNaN(value) || parseFloat(value) > parseFloat(max)
        ? t("Should be less than or equal to patient age") + " " + max
        : undefined
      : undefined;

  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
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
    { label: "Breakfast", key: "dosage (breakfast)" },
    { label: "Lunch", key: "dosage (lunch)" },
    { label: "Dinner", key: "dosage (dinner)" },
  ];

  // State for dosage inputs display
  const [showWithPrepend, setShowWithPrepend] = useState(false); // or any condition based on your attribute

  useEffect(() => {
    // Check your attribute to determine how to display dosage fields
    const ele = fieldData.dataElement;

    if (ele) {
      const showPrependAttr =
        fieldData.dataElement?.formName?.split(" ")[0] === "Dosage"
          ? true
          : false;
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
    fetchValidation();
  }, [values]);

  let bmicategory="";
    useEffect(() => {
      //if(APP_LOCALE === "PRODUCT" || APP_LOCALE === "CC008"){
        if(ageValue > 20){
    const bmiData = getBMICategory();
    const bmiValue = parseFloat(values[dataElementId]);

    if (!bmiData || isNaN(bmiValue)) {
        return;
    }

    const matchedCategory = bmiData.find(item => {
        const min = item.min ?? -Infinity;
        const max = item.max ?? Infinity;
        return bmiValue >= min && bmiValue <= max;
    });

    if (matchedCategory) {
        if(bmiValue){
        bmiCategoryLabel = matchedCategory.category;
        // setBmiCondition(matchedCategory.category)
        bmicategory = t("Patient Category is") +" "+t(matchedCategory.category);
        setBmiCondition(bmicategory)
        }
    } else {
    }
  //}
  }
  
}, [values[dataElementId], localStorage.getItem("locale")]);

const bmizscore_ = values?.[customfieldobj.bmizscore] ?? "";
let bmizcategory="";
 useEffect(() => {
      //if(APP_LOCALE === "PRODUCT" || APP_LOCALE === "593aad5"){
        if(ageValue >=2 && ageValue <= 20 && customfieldobj.sexatbirthUID && values[customfieldobj.sexatbirthUID] != "Other"){
          const bmizDiv = document.getElementById("bmizscore-category");
          if (bmizDiv) {
            setTimeout(() => {
          bmizDiv.textContent = `${t("BMI Z Score")}: ${bmizcondition}`;
          bmizDiv.focus();
          setTimeout(() => bmizDiv.blur(), 300);
          const bmizInput = document.getElementById(customfieldobj.bmizscore);
            // bmizInput.focus();
            setTimeout(() => bmizInput.blur(), 300);
            }, 500);
        }
      //}
  //       if(ageValue >=5 && ageValue <= 19){
  //   const bmiZData = getBMIZScoreCategory();
  //   const bmiZValue = parseFloat(values[customfieldobj.bmizscore]);

  //   if (!bmiZData || isNaN(bmiZValue)) {
  //       console.log("Invalid or missing BMI value.");
  //       return;
  //   }

  //   const matchedCategory = bmiZData.find(item => {
  //       const min = item.min ?? -Infinity;
  //       const max = item.max ?? Infinity;
  //       return bmiZValue >= min && bmiZValue <= max;
  //   });

  //   if (matchedCategory) {
  //       if(bmiZValue){
  //      // bmiCategoryLabel = matchedCategory.category;
  //       bmizcategory = t("Patient Category is") +" "+t(matchedCategory.category);

  //       setBmiZCondition(bmizcategory)
  //      // formref.current.change("forceRenderField_", Math.random());
  //       const bmizDiv = document.getElementById("bmizscore-category");
  //       if (bmizDiv) {
  //          setTimeout(() => {
  //         bmizDiv.textContent = `${t("BMI Z Score")}: ${t(matchedCategory.category)}`;
  //         bmizDiv.focus();
  //         setTimeout(() => bmizDiv.blur(), 300);
  //         const bmizInput = document.getElementById(customfieldobj.bmizscore);
  //          // bmizInput.focus();
  //          setTimeout(() => bmizInput.blur(), 300);
  //           }, 500);
  //       }

  //       // Optional: highlight/focus logic
  //       // const bmizInput = document.getElementById(customfieldobj.bmizscore);
  //       // if (bmizInput) {
  //       //   bmizInput.focus();
  //       //   setTimeout(() => bmizInput.blur(), 300);
  //       // }
  //       }
  //   } else {
  //       console.log("No matching BMI category found.");
  //   }
  // }
  }
}, [bmiZScore, bmizcondition]);
const hba1cValue = values[customfieldobj.hbba1c];
if (isNaN(hba1cValue) || hba1cValue <= 0) {
  values[customfieldobj.hbba1c] = "0";
}

// useEffect(() => {
//   const hba1cValue = values[customfieldobj.hbba1c];
//    const domhba1c = document.getElementById(customfieldobj.hbba1c);
//    let EstimatedAverageBloodGlucose = document.getElementById(customfieldobj.EstimatedAverageBloodGlucose);

//   if (domhba1c) {
//    const calculateAndUpdateAverage = () => {
//     let inputValue = domhba1c.value.trim();

//     // Convert to number
//     const hba1cValue = parseFloat(inputValue);
//        //const hba1cValue = parseFloat(domhba1c.value);

//     if (!isNaN(hba1cValue) && hba1cValue > 0) {
//       let calc = (hba1cValue * 28.7) - 46.7;
//       calc = Math.round(calc * 100) / 100;

//       values[customfieldobj.EstimatedAverageBloodGlucose] = calc;
//      // formref.current.change("forceRenderField_", Math.random());
//       EstimatedAverageBloodGlucose.focus();
//      // setTimeout(() => EstimatedAverageBloodGlucose.blur(), 300);
//     }
//     else if (domhba1c.value === "") {
//       // Reset to 0 when field is cleared
//       values[customfieldobj.EstimatedAverageBloodGlucose] = 0;
//     } else {
//       values[customfieldobj.EstimatedAverageBloodGlucose] = 0;
//     }
//    };
//    domhba1c.addEventListener("input", calculateAndUpdateAverage);
    
//       // Cleanup listeners on component unmount
//       return () => {
//         domhba1c.removeEventListener("input", calculateAndUpdateAverage);
//       };
//     }

// }, [hba1cValue]);



  useEffect(() => {
    if (validationResult != null) {
      // Fields to be hidden for value "Annual visit"
      // if (
      //   values[customfieldobj.reasonForTodaysVisit] &&
      //   (values[customfieldobj.reasonForTodaysVisit] == "Routine Visit" ||
      //     values[customfieldobj.reasonForTodaysVisit] == "Quarterly Visit" ||
      //     values[customfieldobj.reasonForTodaysVisit] == "Collecting insulin")
      // ) {
      //   if (
      //     fieldData.dataElement.id ==
      //       customfieldobj.microalbuminuriaTestForNephropathy ||
      //     fieldData.dataElement.id == customfieldobj.creatinine ||
      //     fieldData.dataElement.id == customfieldobj.totalCholestrol ||
      //     fieldData.dataElement.id == customfieldobj.ldlCholestrol ||
      //     fieldData.dataElement.id == customfieldobj.hdlCholestrol ||
      //     fieldData.dataElement.id == customfieldobj.triglyceride ||
      //     fieldData.dataElement.id == customfieldobj.TSH ||
      //     fieldData.dataElement.id == customfieldobj.freeT4 ||
      //     fieldData.dataElement.id ==
      //       customfieldobj.thyroidPeroxidaseAntibody ||
      //     fieldData.dataElement.id == customfieldobj.footulcer ||
      //     fieldData.dataElement.id == customfieldobj.nephropathy ||
      //     fieldData.dataElement.id == customfieldobj.neuropathy ||
      //     fieldData.dataElement.id == customfieldobj.retinopathy ||
      //     fieldData.dataElement.id == customfieldobj.fundusPhotography ||
      //     fieldData.dataElement.id == customfieldobj.totalCholestrol ||
      //     fieldData.dataElement.id == customfieldobj.myocardialInfarction ||
      //     fieldData.dataElement.id == customfieldobj.cerebrovascularAccident
      //   )
      //     customProps = {
      //       ...customProps,
      //       className: "hide",
      //     };
      // }
      // if (
      //   values[customfieldobj.reasonForTodaysVisit] &&
      //   (values[customfieldobj.reasonForTodaysVisit] == "Routine Visit" ||
      //     values[customfieldobj.reasonForTodaysVisit] == "Collecting insulin")
      // ) {
      //   if (fieldData.dataElement.id == customfieldobj.HbA1c)
      //     customProps = {
      //       ...customProps,
      //       className: "hide",
      //     };
      // }

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

      const currentStage = programData.programStages.find(
        (stage) => stage.name === currentstagename
      );
      if (currentStage) {
        const rangeValues = getRangeValues(
          currentStage,
          fieldData.dataElement.id
        );

        if (rangeValues) {
          const keyName = getKeyByValue(
            customfieldobj,
            fieldData.dataElement.id
          );
          const element = document.getElementById(fieldData.dataElement.id);
          const field_value = values[customfieldobj[keyName]];

          const showWarningToast = (value, rangeValues, t) => {
            toast.warn(
              `${t("The value")} ${value} ${t("falls below the lower limit of")} ${rangeValues.lowRange}.`,
              {
                toastId: "lowRangeWarning",
                position: "top-center", // you can change to "bottom-left" etc.
                autoClose: 2500, // auto close after 5 sec
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
          };

           const showupperWarningToast = (value, rangeValues, t) => {
            toast.warn(
              `${t("The value")} ${value} ${t("exceeds the upper limit of")} ${rangeValues.highRange}.`,
              {
                toastId: "highRangeWarning",
                position: "top-center", // you can change to "bottom-left" etc.
                autoClose: 2500, // auto close after 5 sec
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
          };
          function showFieldError(element, message) {
            let errorEl = element.nextElementSibling;

            if (!errorEl || !errorEl.classList.contains("field-validation-msg")) {
              errorEl = document.createElement("span");
              errorEl.className = "field-validation-msg";
              element.insertAdjacentElement("afterend", errorEl);
            }

            // Force the flex parent to wrap vertically
            if (element.parentNode) {
              element.parentNode.style.flexDirection = "column";
              element.parentNode.style.alignItems = "flex-start";
            }

            //errorEl.textContent = message;
            errorEl.innerHTML = `
              <span style="display: inline-flex; align-items: center; gap: 4px; color:#d97706 !important">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" 
                  fill="#fff" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="fill:#fff !important">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                ${message}
              </span>
            `;
            errorEl.style.cssText = `
              display: block;
              width: 100%;
              margin-top: 4px;
              font-size: 0.85rem;
              font-weight: 500;
              color: #d97706 !important;
            `;
          }

          function clearFieldError(element) {
            const errorEl = element.nextElementSibling;
            if (errorEl && errorEl.classList.contains("field-validation-msg")) {
              errorEl.style.display = "none";
              errorEl.textContent = "";

              // Restore parent flex direction
              if (element.parentNode) {
                element.parentNode.style.flexDirection = "";
                element.parentNode.style.alignItems = "";
              }
            }
          }
          const handleInputChange = (event) => {
            const { id, value } = event.target;

            // Log the key up event

            // if (id === fieldData.dataElement.id) {
            //   const timer = setTimeout(() => {
            //     if (value !== null && value !== undefined && value !== "") {
            //       if (value < rangeValues.lowRange) {
            //         // If the value is less than the low range
            //        if(APP_LOCALE === "IGICH"){
            //         Swal.fire({
            //           title: t("Falls in Lower Range"),
            //           text: `${t("The value")} ${value} ${t(
            //             "falls below the lower limit of"
            //           )} ${rangeValues.lowRange}.`,
            //           icon: "warning",
            //           showConfirmButton: false,
            //           timer: 1500,
            //           timerProgressBar: true
            //         });
            //       }
            //       else{
            //         swal({
            //           title: t("Falls in Lower Range"),
            //           text: `${t("The value")} ${value} ${t(
            //             "falls below the lower limit of"
            //           )} ${rangeValues.lowRange}.`,
            //           icon: "warning",
            //           button: t("OK"),
            //         });
            //       }
            //        // showWarningToast(value, rangeValues, t);

            //       } else if (value > rangeValues.highRange) {
            //         // If the value is greater than the high range
            //          if(APP_LOCALE === "IGICH"){
            //         Swal.fire({
            //           title: t("Falls in Higher Range"),
            //           text: `${t("The value")} ${value} ${t(
            //             "exceeds the upper limit of"
            //           )} ${rangeValues.highRange}.`,
            //           icon: "warning",
            //          showConfirmButton: false,
            //           timer: 1500,
            //           timerProgressBar: true
            //         });
            //       }
            //       else{
            //        swal({
            //           title: t("Falls in Higher Range"),
            //           text: `${t("The value")} ${value} ${t(
            //             "exceeds the upper limit of"
            //           )} ${rangeValues.highRange}.`,
            //           icon: "warning",
            //           button: t("OK"),
            //         });
            //       }
            //         // showupperWarningToast(value, rangeValues, t);
            //       } else if (
            //         value >= rangeValues.lowRange &&
            //         value <= rangeValues.highRange
            //       ) {
            //         // if (rangeValues.lowRange < 50 && rangeValues.highRange > 120) {
            //         // If the value is within range, but the range is out of normal bounds
            //         // swal({
            //         //     title: "Out of Range",
            //         //     text: `The value ${value} is within the allowed range of ${rangeValues.lowRange} to ${rangeValues.highRange}, but the range itself is out of normal bounds.`,
            //         //     icon: "warning",
            //         //     button: "OK",
            //         // });
            //       }
            //     }
            //   }, 100);
            // }
            if (id === fieldData.dataElement.id) {
              if (value !== null && value !== undefined && value !== "") {
                if (value < rangeValues.lowRange) {
                  showFieldError(
                    event.target,
                    `${t("The value")} ${value} ${t("falls below the lower limit of")} ${rangeValues.lowRange}.`
                  );
                } else if (value > rangeValues.highRange) {
                  showFieldError(
                    event.target,
                    `${t("The value")} ${value} ${t("exceeds the upper limit of")} ${rangeValues.highRange}.`
                  );
                } else {
                  // Value is within range — clear any existing message
                  clearFieldError(event.target);
                }
              } else {
                // Empty value — clear error
                clearFieldError(event.target);
              }
            }
          };

          // if (element) {
          //   element.addEventListener("focusout", handleInputChange);
          // }
          //  if (element) {
          //   element.addEventListener("input", handleInputChange);
          // }
          function debounce(func, delay) {
            let timer;
            return function (...args) {
              clearTimeout(timer);
              timer = setTimeout(() => func.apply(this, args), delay);
            };
          }


          const debouncedHandleInputChange = debounce(handleInputChange, 800); // 800ms delay

          if (element) {
            element.addEventListener("input", debouncedHandleInputChange);
          }

          //
        } else {
        }
      } else {
      }

      if (
        values[customfieldobj.typeOfMedicationRoutineVisits] &&
        values[customfieldobj.typeOfMedicationRoutineVisits] == "Other"
      ) {
        if (
          fieldData.dataElement.id == customfieldobj.dosageRoutineVisits ||
          fieldData.dataElement.id ==
            customfieldobj.courseOfDaysOfRoutineVisits ||
          fieldData.dataElement.id ==
            customfieldobj.dosageOfNonInsulinRoutineVisits
        ) {
          validationResult.hideShow = false;
        }
      }

      if (
        values[customfieldobj.typeOfMedicationRoutineVisits] &&
        values[customfieldobj.typeOfMedicationRoutineVisits] == "Insulin"
      ) {
        if (
          fieldData.dataElement.id ==
            customfieldobj.dosageOfNonInsulinRoutineVisits ||
          fieldData.dataElement.id ==
            customfieldobj.dosageOfAddMedicationRoutineVisits ||
          fieldData.dataElement.id == customfieldobj.noOfMealsRoutineVisits
        ) {
          validationResult.hideShow = false;
        }
      }

      if (
        values[customfieldobj.typeOfMedicationRoutineVisits] &&
        values[customfieldobj.typeOfMedicationRoutineVisits] == "Non-Insulin"
      ) {
        if (
          fieldData.dataElement.id == customfieldobj.dosageRoutineVisits ||
          fieldData.dataElement.id ==
            customfieldobj.courseOfDaysOfRoutineVisits ||
          fieldData.dataElement.id ==
            customfieldobj.dosageOfAddMedicationRoutineVisits ||
          fieldData.dataElement.id == customfieldobj.noOfMealsRoutineVisits
        ) {
          validationResult.hideShow = false;
        }

        if (
          fieldData.dataElement.id ==
          customfieldobj.dosageOfNonInsulinRoutineVisits
        ) {
          validationResult.hideShow = true;
        }
      }

      if (!values[customfieldobj.typeOfMedicationRoutineVisits]) {
        if (
          fieldData.dataElement.id ==
            customfieldobj.dosageOfNonInsulinRoutineVisits ||
          fieldData.dataElement.id ==
            customfieldobj.dosageOfAddMedicationRoutineVisits ||
          fieldData.dataElement.id == customfieldobj.noOfMealsRoutineVisits
        ) {
          validationResult.hideShow = false;
        }
      }

      let fieldDisabled = false;
      if (
        fieldData.dataElement.id == customfieldobj.ageAtCDIC &&
        values[customfieldobj.registrationDate] &&
        values[customfieldobj.dobID]
      ) {
        try {
          values[fieldData.dataElement.id] = calculateAge(
            values[customfieldobj.registrationDate],
            values[customfieldobj.dobID]
          );
          fieldDisabled = true;
          customProps = {
            ...customProps,
            key: Math.random() * 9999,
            disabled: true,
          };
        } catch (e) {}
      }
      if (
        fieldData.dataElement.id == customfieldobj.ageAtDeath &&
        values[customfieldobj.dateOfDeath]
      ) {
        try {
          values[fieldData.dataElement.id] = calculateAge(
            values[customfieldobj.dateOfDeath],
            values[customfieldobj.dobID]
          );
          fieldDisabled = true;
          customProps = {
            ...customProps,
            key: Math.random() * 9999,
            disabled: true,
          };
        } catch (e) {}
      }
      if (
        fieldData.dataElement.id == customfieldobj.durationInCDIC &&
        values[customfieldobj.registrationDate]
      ) {
        try {
          values[fieldData.dataElement.id] = calculateAge(
            values[customfieldobj.dateOfRollOut],
            values[customfieldobj.registrationDate]
          );
          fieldDisabled = true;
          customProps = {
            ...customProps,
            key: Math.random() * 9999,
            disabled: true,
          };
        } catch (e) {}
      }

      if (
        fieldData.dataElement.id == customfieldobj.ageAtCDIC &&
        values[customfieldobj.ageUID]
      ) {
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
      if (
        fieldData.dataElement.id == customfieldobj.durationOfDiabetes &&
        values[customfieldobj.dateOfDiagnosis]
      ) {
        try {
          values[fieldData.dataElement.id] = calculateAge(
            values[customfieldobj.dateOfRollOut],
            values[customfieldobj.dateOfDiagnosis]
          );
          fieldDisabled = true;
          customProps = {
            ...customProps,
            key: Math.random() * 9999,
            disabled: true,
          };
        } catch (e) {}
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
          validate: composeValidators(
            required,
            mustBeNumber,
            validateDecimalPlaces
          ),
        };
      }

      const ageAttribute = programData.programTrackedEntityAttributes.find(
        (attr) => attr.trackedEntityAttribute.description === "Age"
      );

      if (ageAttribute) {
        // setAgeId(ageAttribute.trackedEntityAttribute.id);
        const agevalue = values[ageAttribute.trackedEntityAttribute.id];
        if (fieldData.dataElement.id == "eT64f8bLPkK") {
          customProps = {
            ...customProps,
            validate: composeValidators(maxLengthv(agevalue)),
          };
        }

        if (fieldData.dataElement.id == customfieldobj.yearssmoked) {
          customProps = {
            ...customProps,
            validate: composeValidators(maxLengthv(agevalue)),
          };
        }

        if (
          fieldData.dataElement.id == customfieldobj.yearsagopatientquitsmoking
        ) {
          customProps = {
            ...customProps,
            validate: composeValidators(maxLengthv(agevalue)),
          };
        }
      }
      if((fieldData.dataElement.id) == String(customfieldobj.bmizscore) )
      {
      }

    //   if(values[customfieldobj.HbA1c]){
    //  // values[customfieldobj.EstimatedAverageBloodGlucose] = (values[customfieldobj.HbA1c] * 28.7) - 46.7;
    //    const EstimatedAverageBloodGlucose = document.getElementById(customfieldobj.EstimatedAverageBloodGlucose);
    //       values[customfieldobj.EstimatedAverageBloodGlucose] = (values[customfieldobj.HbA1c] * 28.7) - 46.7;
    //       EstimatedAverageBloodGlucose.focus();
    //       setTimeout(() =>  EstimatedAverageBloodGlucose.blur(), 300);
    //   }

  const domhba1c = document.getElementById(customfieldobj.hbba1c);
  let EstimatedAverageBloodGlucose = document.getElementById(customfieldobj.EstimatedAverageBloodGlucose);

  if (domhba1c && (APP_LOCALE == "PRODUCT" || APP_LOCALE == "SENEGAL") && EstimatedAverageBloodGlucose) {
   const calculateAndUpdateAverage = () => {
    let inputValue = domhba1c.value.trim();

    // Convert to number
    const hba1cValue = parseFloat(inputValue);
       //const hba1cValue = parseFloat(domhba1c.value);

    if (!isNaN(hba1cValue) && hba1cValue > 0) {
      let calc = (hba1cValue * 28.7) - 46.7;
      calc = Math.round(calc * 100) / 100;

      values[customfieldobj.EstimatedAverageBloodGlucose] = calc;
     // formref.current.change("forceRenderField_", Math.random());
        //EstimatedAverageBloodGlucose.focus();
     // setTimeout(() => EstimatedAverageBloodGlucose.blur(), 300);
    }
    else if (domhba1c.value === "") {
      // Reset to 0 when field is cleared
      values[customfieldobj.EstimatedAverageBloodGlucose] = 0;
    } else {
      values[customfieldobj.EstimatedAverageBloodGlucose] = 0;
    }
   };
   domhba1c.addEventListener("input", calculateAndUpdateAverage);
    
      // Focus after user finishes editing
      domhba1c.addEventListener("blur", (e) => {
        // relatedTarget is the element that is RECEIVING focus next
        const focusingTarget = e.relatedTarget;

        // Skip focusing EstimatedAverageBloodGlucose if user clicked a button (e.g. Submit)
        if (focusingTarget && (focusingTarget.type === "submit" || focusingTarget.tagName === "BUTTON")) {
          return;
        }
        if (EstimatedAverageBloodGlucose) {
          EstimatedAverageBloodGlucose.focus();
        }
      });

      //Cleanup listeners on component unmount
      // return () => {
      //   domhba1c.removeEventListener("input", calculateAndUpdateAverage);
      // };
    }
    //Waist to Hip Ratio Calculation for Gandhi 
    if(APP_LOCALE == "CC008"){
                      if( customfieldobj.waistHipRatioId && fieldData.dataElement.id == customfieldobj.waistHipRatioId && customfieldobj.waistCircumferenceId && customfieldobj.hipCircumferenceId){
                                customProps = {
          ...customProps,
          key: Math.random() * 9999,
          disabled: true,
        };
                          try{
                              const domWaist = values[customfieldobj.waistCircumferenceId];
                              const domHip = values[customfieldobj.hipCircumferenceId];
                              if(domWaist && domHip){
                                  const waist = parseFloat(domWaist);
                                  const hip   = parseFloat(domHip);
                                  const ratio = (waist / hip).toFixed(3);
                                  values[fieldData.dataElement.id] = ratio;
                              }else{
                                  values[fieldData.dataElement.id] = ""
                              }
                          }catch(e){ console.log(e)}
                      }
}

      if(APP_LOCALE == "CC013"){
        if(customfieldobj.maximumValueFastingBloodGlucoseId && fieldData.dataElement.id == customfieldobj.maximumValueFastingBloodGlucoseId){
            validationResult.hideShow = false;
            if(customfieldobj.monitoringMethodId && values[customfieldobj.monitoringMethodId] && (values[customfieldobj.monitoringMethodId] == "SMBG only" || values[customfieldobj.monitoringMethodId] == "Both")){
                validationResult.hideShow = true;
            }
        }
        if(customfieldobj.maximumValuePostPrandialBloodGlucoseId && fieldData.dataElement.id == customfieldobj.maximumValuePostPrandialBloodGlucoseId){
            validationResult.hideShow = false;
            if(customfieldobj.monitoringMethodId && values[customfieldobj.monitoringMethodId] && (values[customfieldobj.monitoringMethodId] == "SMBG only" || values[customfieldobj.monitoringMethodId] == "Both")){
                validationResult.hideShow = true;
            }
        }
        if(customfieldobj.glucoseValuesFromMeterId && fieldData.dataElement.id == customfieldobj.glucoseValuesFromMeterId){
            validationResult.hideShow = false;
            if(customfieldobj.monitoringMethodId && values[customfieldobj.monitoringMethodId] && (values[customfieldobj.monitoringMethodId] == "CGM only" || values[customfieldobj.monitoringMethodId] == "Both")){
                validationResult.hideShow = true;
            }
        }
        if(customfieldobj.patientEstimatedBloodGlucoseMaximumId && fieldData.dataElement.id == customfieldobj.patientEstimatedBloodGlucoseMaximumId){
            validationResult.hideShow = false;
            if(customfieldobj.monitoringMethodId && values[customfieldobj.monitoringMethodId] && (values[customfieldobj.monitoringMethodId] == "CGM only" || values[customfieldobj.monitoringMethodId] == "Both")){
                validationResult.hideShow = true;
            }
        }
        if(customfieldobj.patientEstimatedBloodGlucoseMinimumId && fieldData.dataElement.id == customfieldobj.patientEstimatedBloodGlucoseMinimumId){
            validationResult.hideShow = false;
            if(customfieldobj.monitoringMethodId && values[customfieldobj.monitoringMethodId] && (values[customfieldobj.monitoringMethodId] == "CGM only" || values[customfieldobj.monitoringMethodId] == "Both")){
                validationResult.hideShow = true;
            }
        }
      }
      try{
        if(dataElementId && ageValue < 2){
          values[dataElementId] = ""
        }
      }catch(e){}
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
          {showWithPrepend ? (
            <div className="input-group-vertical input-dosageField">
              <label className="input-label">
                {fieldData.dataElement.formName.split(" ")[0]}
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={
                    composeValidators(required, mustBeNumber, minValue(0))
                      ? {}
                      : { marginBottom: "18px", marginRight: "-12px" }
                  }
                >
                  {(() => {
                    const words =
                      fieldData?.dataElement?.formName?.split(" ") || [];

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
                  {APP_LOCALE === "CC006"
                    ? fieldData.dataElement.formName
                        .split(" ")[0]
                        .replace(/[()]/g, "")
                        .charAt(0)
                        .toUpperCase() +
                      fieldData.dataElement.formName
                        .split(" ")[0]
                        .replace(/[()]/g, "")
                        .slice(1)
                    : fieldData.dataElement.formName
                        .split(" ")[1]
                        .replace(/[()]/g, "")
                        .charAt(0)
                        .toUpperCase() +
                      fieldData.dataElement.formName
                        .split(" ")[1]
                        .replace(/[()]/g, "")
                        .slice(1)}
                </span>
                 <Field name="forceRenderField_" component="input" type="hidden" />
                <Field
                  name={fieldData.dataElement.id}
                  type={"number"}
                  label={
                    fieldData.dataElement.formName.split(" ")[1] === "breakfast"
                      ? fieldData.dataElement.formName.split(" ")[0]
                      : null
                  }
                  component={InputFieldFF}
                  key={fieldData.dataElement.id}
                  className="input-field"
                  validate={composeValidators(
                    required,
                    mustBeNumber,
                    minValue(0)
                  )}
                  parse={(value) => {
                    if (value && typeof value === "string") {
                      // Preserve leading zero for numbers starting with '0.'
                      if (value.startsWith("0.") || value === "0") {
                        return value;
                      }
                      const sanitized = value
                        .replace(/^0+/, "")
                        .replace(/^\./, "");
                      return sanitized === "" ? "0" : sanitized;
                    }
                    return value;
                  }}
                 disabled={
                    fieldData?.dataElement?.attributeValues?.some(
                      (attr) =>
                        attr.attribute?.name === "isDisabled" &&
                        attr.value === "true"
                    ) ?? false
                  }
                />
              </div>
              {fieldData.dataElement.id === dataElementId && (
              <div style={{ marginTop: "5px", color: "#001965", fontWeight: "bold" }}>
               {bmicategory?.trim() ? bmicategory : bmicondition}
              </div>
            )}
              {String(fieldData.dataElement.id) === customfieldobj.bmizscore && (
                <div id="bmizscore-category" style={{ marginTop: "5px", color: "#001965", fontWeight: "bold" }}>
                 {bmizcategory?.trim() ? bmizcategory : bmizcondition}
                </div>
              )}
               {fieldData.dataElement.id === customfieldobj.bmizscore &&
              (ageValue < 2 || (customfieldobj.sexatbirthUID && values[customfieldobj.sexatbirthUID] == "Other")) && (
                <Typography
                  variant="caption"
                  color="#d97706"
                  className="zscore-help"
                  style={{ marginTop: 4,color:"#d97706" }}
                >
                  {customfieldobj.sexatbirthUID && values[customfieldobj.sexatbirthUID] == "Other" ? t("BMI Z score is not available to patients who have the gender Other") : t("BMI z-score is not available for children under 2 years")}.
                </Typography>
              )}
            </div>
          ) : (
            <div>
             <Field name="forceRenderField_" component="input" type="hidden" />
            <Field
              name={fieldData.dataElement.id}
              label={getTranslatedLabels(fieldData.dataElement)}
              type={"number"}
              component={InputFieldFF}
              key={fieldData.dataElement.id}
              required={
                fieldData.compulsory && validationResult.hideShow == true
                  ? true
                  : false
              }
              validate={fieldData.dataElement.id == customfieldobj.bmizscore ? composeValidators(
                    required,
                    mustBeNumber
                  ): composeValidators(
                required,
                mustBeNumber,
                minValue(
                  fieldData.dataElement.id != customfieldobj.durationInCDIC &&
                    fieldData.dataElement.id !=
                      customfieldobj.durationOfDiabetes
                    ? 0
                    : 0
                )
              )}
              value=""
              className={customClassName}
              {...customProps}
              parse={(value) => {
                if (value && typeof value === "string") {
                  // Preserve leading zero for numbers starting with '0.'
                  if (value.startsWith("0.") || value === "0") {
                    return value;
                  }
                  const sanitized = value.replace(/^0+/, "").replace(/^\./, "");
                  return sanitized === "" ? "0" : sanitized;
                }
                return value;
              }}
             disabled={
                fieldData?.dataElement?.attributeValues?.some(
                  (attr) =>
                    attr.attribute?.name === "isDisabled" &&
                    attr.value === "true"
                ) ?? false
              }
            />
            {fieldData.dataElement.id === dataElementId && (
              <div style={{ marginTop: "5px", color: "#001965", fontWeight: "bold" }}>
               {bmicategory?.trim() ? bmicategory : bmicondition}
              </div>
            )}
              {String(fieldData.dataElement.id) === customfieldobj.bmizscore && (
                <div id="bmizscore-category" style={{ marginTop: "5px", color: "#001965", fontWeight: "bold" }}>
                 {bmizcategory?.trim() ? bmizcategory : bmizcondition}
                </div>
              )}
              {fieldData.dataElement.id === customfieldobj.bmizscore &&
              (ageValue < 2 || (customfieldobj.sexatbirthUID && values[customfieldobj.sexatbirthUID] == "Other")) && (
                <Typography
                  variant="caption"
                  color="#d97706"
                  className="zscore-help"
                  style={{ marginTop: 4,color:"#d97706" }}
                >
                  {customfieldobj.sexatbirthUID && values[customfieldobj.sexatbirthUID] == "Other" ? t("BMI Z score is not available to patients who have the gender Other") : t("BMI z-score is not available for children under 2 years")}.
                </Typography>
              )}
            </div>
          )}
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function sanitizeNumber(input) {
  const sanitized = input.replace(/^0+/, "");
  return sanitized === "" ? "0" : sanitized;
}

function TextAreaConfig(props) {
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const { t } = useTranslation();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  let formref = props.formref;
  let currentStage = props.currentStage
  let customfieldobj = props.customfieldobj;

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  // Notes Speech To Text
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [isPluginReady, setIsPluginReady] = useState(false);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
  console.log("STATE isListening changed:", isListening);
}, [isListening]);

  const required = (value) =>
    fieldData.compulsory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;
  const scriptCheck = (value) =>
    value
      ? value.match(/<[^>]*>/g) != null
        ? t('Incorrect expression "< or >" added as input')
        : undefined
      : undefined;
  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  const requestPermissions = () => {
    return new Promise((resolve, reject) => {
      if (window.plugins && window.plugins.speechRecognition) {
        window.plugins.speechRecognition.requestPermission(
          () => {
            setError("");
            resolve(true);
          },
          (error) => {
            console.error("Speech recognition permission denied:", error);
            setError("Microphone permission denied");
            reject(error);
          }
        );
      } else {
        const errorMsg = "Speech recognition plugin not available";
        setError(errorMsg);
        reject(errorMsg);
      }
    });
  };

  let collectedTranscript = "";

  const startListening = async () => {
    if (!window.plugins || !window.plugins.speechRecognition) {
      setError("Speech recognition is not ready yet");
      return;
    }
   setRecognizedText("");
  values[fieldData.dataElement.id] = "";
  prevTranscript.current = "";
  collectedTranscript = "";

    try {
      await requestPermissions();

      // ✅ IMPORTANT: force stop before starting again
    window.plugins.speechRecognition.stopListening(
      () => {
        console.log("Previous session stopped");
      },
      () => {}
    );


      const options = {
        language: "en-US",
        matches: 5,
        prompt: "Speak now...",
        showPopup: true,
        showPartial: true,
        continuous: true,
      };

      // window.plugins.speechRecognition.startListening(
      //   (results) => {
      //     if (results && results.length > 0) {
      //       const newText = results[0];
      //       values[fieldData.dataElement.id] = newText; // Update the form value
      //       formref.current.change("forceRenderField_", Math.random());
      //       setRecognizedText((prev) => {
      //         const separator =
      //           prev &&
      //           !prev.endsWith(".") &&
      //           !prev.endsWith("!") &&
      //           !prev.endsWith("?")
      //             ? ". "
      //             : " ";
      //         return prev + (prev ? separator : "") + newText;
      //       });
      //       setError("");
      //     }
      //   },
      //   (error) => {
      //     console.error("Speech recognition error:", error);
      //     setIsListening(false);
      //     setError("Speech recognition error: " + (error.message || error));
      //   },
      //   options
      // );
      

// let collectedTranscript = "";

window.plugins.speechRecognition.startListening(
  (results) => {
    if (results && results.length > 0) {
      // Get the most complete result (usually the last one)
      const latestResult = results[results.length - 1];
      // If your plugin returns string results instead of objects:
      if (typeof latestResult === 'string') {
        collectedTranscript = latestResult;
      } else if (latestResult && latestResult.transcript) {
        // If it returns result objects with transcript property
        collectedTranscript = latestResult.transcript;
      } else {
        // Fallback: concatenate all results
        collectedTranscript = results.join(' ');
      }
      setIsListening(false);
      values[fieldData.dataElement.id] = collectedTranscript;
       formref.current.change("forceRenderField_", Math.random());
      setRecognizedText(collectedTranscript);
      setError("");
    }
  },
  (error) => {
    console.error("Speech recognition error:", error);
    setIsListening(false);
    setError("Speech recognition error: " + (error.message || error));
  },
  {
    language: "en-US",
    matches: 5,
    prompt: "Speak now...",
    showPopup: true,
    showPartial: true,
    continuous: true,
  }
);

      setIsListening(true);

      // ✅ Always reset
      setTimeout(() => {
        setIsListening(false);
        console.log("set to false")
      }, 5000);
      setError("");
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setError("Failed to start speech recognition");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (window.plugins && window.plugins.speechRecognition) {
      window.plugins.speechRecognition.stopListening(
        () => {
          setIsListening(false);
          setError("");
        },
        (error) => {
          console.error("Error stopping speech recognition:", error);
          setIsListening(false);
          setError("Error stopping speech recognition");
        }
      );
    }
  };

  const toggleListening_old = () => {
    if (isListening) {
      stopListening();
    } else {
  //  resetTranscript();
  // prevTranscript.current = "";
  // setRecognizedText("");
      startListening();
    }
  };

const toggleListening = async () => {
  console.log("clicked mic",isListening);

  // always stop previous (safe reset)
  await stopListening();

  // small delay (important for Android)
  setTimeout(() => {
    startListening();
  }, 300);
};

  useEffect(() => {
    let checkAttempts = 0;
    const maxAttempts = 20; // Try for 10 seconds (20 * 500ms)

    // Check if Cordova plugins are available
    const checkPlugins = () => {
      checkAttempts++;

      // Log what's available for debugging

      if (window.plugins && window.plugins.speechRecognition && window.TTS) {
        setIsPluginReady(true);
        setError("");
      } else if (checkAttempts < maxAttempts) {
        // Still waiting for plugins to load
        setTimeout(checkPlugins, 500);
      } else {
        // Max attempts reached
        setError("Plugins failed to load. Please restart the app.");
      }
    };

    // Initialize plugins when device is ready
    const onDeviceReady = () => {
      // Give plugins a moment to initialize after device ready
      setTimeout(checkPlugins, 100);
    };

    // Check if we're in Cordova environment
    if (window.cordova) {
      // Check if device is already ready
      if (document.readyState === "complete" && window.device) {
        onDeviceReady();
      } else {
        document.addEventListener("deviceready", onDeviceReady, false);

        // Fallback: also start checking after a delay in case deviceready already fired
        setTimeout(() => {
          if (!isPluginReady) {
            checkPlugins();
          }
        }, 2000);
      }
    } else {
      // For web testing - allow enabling button for development
      setError("Running in web environment - plugins not available");

      // Uncomment next line for web testing (button will be enabled but won't work)
      setIsPluginReady(true);
    }

    return () => {
      if (window.cordova) {
        document.removeEventListener("deviceready", onDeviceReady, false);
      }
    };
  }, [isPluginReady]);

// Code for speach to text on browser
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

    const prevTranscript = useRef("");
    const silenceTimer = useRef(null);

  // Set form value when transcript updates
  // useEffect(() => {
  //   if (transcript && transcript !== prevTranscript.current) {
  //     const newText = transcript.replace(prevTranscript.current, "").trim();
  //     if (newText) {
  //       values[fieldData.dataElement.id] = newText;
  //       // formref.current.change("forceRenderField_", Math.random());

  //       setRecognizedText((prev) => {
  //         const separator =
  //           prev &&
  //           !prev.endsWith(".") &&
  //           !prev.endsWith("!") &&
  //           !prev.endsWith("?")
  //             ? ". "
  //             : " ";
  //         return prev + (prev ? separator : "") + newText;
  //       });

  //       setError("");
  //     }
  //     prevTranscript.current = transcript;

  //     // Reset silence timer every time new speech is detected
  //     clearTimeout(silenceTimer.current);
  //     silenceTimer.current = setTimeout(() => {
  //       SpeechRecognition.stopListening();
  //       // stopListeningBrowser()
  //     }, 2000); // Stop if no new words for 2 seconds
  //   }
  // }, [transcript]);

  useEffect(() => {
  if (transcript && transcript !== prevTranscript.current) {
    values[fieldData.dataElement.id] = "";
    
    // Store the complete transcript in the form field
    values[fieldData.dataElement.id] = transcript;
    
    formref.current.change("forceRenderField_", Math.random());
    // Update the recognized text with the complete transcript
    setRecognizedText(transcript);
    
    setError("");
    prevTranscript.current = transcript;

    // Reset silence timer every time new speech is detected
    clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      SpeechRecognition.stopListening();
    }, 2000); // Stop if no new words for 2 seconds
  }
}, [transcript]);

  const startListeningBrowser = () => {
    if (!browserSupportsSpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    resetTranscript();
    prevTranscript.current = "";
    SpeechRecognition.startListening({ continuous: true, language: "en-US",  interimResults: false   });
  };

  const stopListeningBrowser = () => {
    
  SpeechRecognition.stopListening();
  clearTimeout(silenceTimer.current);

  setTimeout(() => {
    const finalText = transcript
      .toLowerCase()
      .trim();

    // Save to form value
    values[fieldData.dataElement.id] = finalText;
    formref.current.change("forceRenderField_", Math.random());
    setRecognizedText(finalText);
  }, 300); // slight delay to ensure transcript is finalized
  };

  const showVoiceInputSwal = (fieldData, values, formref) => {
  let startTime = Date.now();
  let timerInterval;

  const htmlContent = `
    <style>
      .mic-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .mic-circle {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background-color: #ff4d4d;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        animation: pulse 2s infinite;
      }

      .mic-circle svg {
        width: 48px;
        height: 48px;
        color: white;
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.7);
        }
        70% {
          box-shadow: 0 0 0 20px rgba(255, 77, 77, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 77, 77, 0);
        }
      }

      .timer-text {
        margin-top: 16px;
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
    </style>

    <div class="mic-wrapper">
      <div class="mic-circle">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24"><path d="M12 15c1.657 0 3-1.343 3-3V6a3 3 0 0 0-6 0v6c0 1.657 1.343 3 3 3z"/><path d="M19 11v1a7 7 0 0 1-14 0v-1H3v1a9 9 0 0 0 8 8.94V23h2v-3.06A9 9 0 0 0 21 12v-1h-2z"/></svg>
      </div>
      <div class="timer-text" id="recording-timer">00:00</div>
    </div>
  `;
 resetTranscript();
  prevTranscript.current = "";
  setRecognizedText("");
  values[fieldData.dataElement.id] = "";
  SpeechRecognition.stopListening();
  SpeechRecognition.startListening({ continuous: true, language: "en-US", interimResults: false });

  swal({
    title: t("Voice Recorder"),
    content: {
      element: "div",
      attributes: {
        innerHTML: htmlContent,
      },
    },
    buttons: {
      cancel: t("Cancel"),
      confirm: {
        text: t("Stop & Add"),
        closeModal: false,
      },
    },
    closeOnClickOutside: false,
  }).then((confirmed) => {
    SpeechRecognition.stopListening();
    clearInterval(timerInterval);

    setTimeout(() => {
      const transcript = SpeechRecognition.getTranscript?.() || "";
      const finalText = transcript
        .toLowerCase()
        .replace(/hb1c|hb a1c|hb a one c/g, "HbA1c")
        .trim();

      if (confirmed) {
        // values[fieldData.dataElement.id] = finalText;
        // formref.current.change("forceRenderField_", Math.random());
        setRecognizedText(finalText);
        swal.close();
        // swal("✅ Added", `"${finalText}" added to form`, "success");
      } else {
        swal(t("Cancelled"), t("Voice input was cancelled"), "info");
      }
    }, 300);
  });

  // ⏱️ Start timer
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const mins = String(Math.floor(elapsed / 60000)).padStart(2, '0');
    const secs = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
    const timerEl = document.getElementById("recording-timer");
    if (timerEl) timerEl.textContent = `${mins}:${secs}`;
  }, 1000);
};


  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
       const settingsc = getGlucoseSettings();
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
          <Field
            name={fieldData.dataElement.id}
            label={getTranslatedLabels(fieldData.dataElement)}
            type={"text"}
            component={TextAreaFieldFF}
            key={fieldData.dataElement.id}
            required={
              fieldData.compulsory && validationResult.hideShow == true
                ? true
                : false
            }
            validate={composeValidators(required, scriptCheck)}
            autoGrow
            className={customClassName}
          />
         

          {/* { window.cordova ? (
                    <button
                        // type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleListening();
                        }}
                        disabled={isPluginReady}
                        className={`flex items-center justify-center w-6 h-2 transition-all duration-200 transform hover:scale-105 ${isListening
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                            : 'bg-blue-500 hover:bg-blue-600'
                            } ${!isPluginReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isListening ? (
                            <MicOff className="text-white text-2xl" />
                        ) : (
                            <Mic className="text-white text-2xl" />
                        )}
                    </button>
                    ) : <></>} */}
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  const extractJsonArray = (text) => {
    const match = text.match(/\[\s*{[\s\S]*?}\s*]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
      }
    }
    return null;
  };
  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function UserNameConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  let orgunitid = props.programorgid;
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }
  function fetchCustomUsersList() {
    setGlobalSpinner(true);
    let options = [];
    apiServices
      .getAPI(
        "users?paging=true&page=1&pageSize=10&query=&fields=firstName,surname,userCredentials[username],id&ou=" +
          orgunitid
      )
      .then((response) => {
        setGlobalSpinner(false);

        response.data.users.map((user) => {
          let obj = {
            id: user.id,
            label: user.firstName + " " + user.surname,
            value: user.id,
          };
          options.push(obj);
          setDropdownOptions(options);
          setGlobalSpinner(false);
        });
      })
      .catch((err) => {
        setGlobalSpinner(false);
      });
  }
  useEffect(() => {
    fetchCustomUsersList();
  }, []);
  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null && dropdownOptions.length > 0) {
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
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
            validate={
              fieldData.compulsory && validationResult.hideShow == true
                ? hasValue
                : false
            }
            required={
              fieldData.compulsory && validationResult.hideShow == true
                ? true
                : false
            }
            options={dropdownOptions}
            disabled={
              fieldData.dataElement.attributeValues &&
              fieldData.dataElement.attributeValues.length > 0
                ? fieldData.dataElement.attributeValues[0].attribute.name ==
                  "isDisabled"
                  ? true
                  : false
                : false
            }
            className={customClassName}
          />
        </Grid>
      );
    }
  }, [validationResult, dropdownOptions, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function URLConfig(props) {
  const { t } = useTranslation();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  let regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  const required = (value) =>
    fieldData.compulsory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;

  const URLCheck = (value) =>
    regexp.test(value) ? undefined : t("Incorrect URL format");

  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
        >
          {getTranslatedLabels(fieldData.dataElement)} :
          <a target="_blank" href={values[fieldData.dataElement.id]}>
            URL
          </a>
          {/* <Field
                        name={fieldData.dataElement.id}
                        label={getTranslatedLabels(fieldData.dataElement)}
                        component={TextAreaFieldFF}
                        key={fieldData.dataElement.id}
                        required={fieldData.compulsory && validationResult.hideShow == true ? true : false}
                        validate={composeValidators(required, URLCheck)}
                    /> */}
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function HandleOUOptions(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let OUMappingList = OUMapping(values);
  let parentValue =
    OUMappingList[fieldData.dataElement.id] != undefined
      ? values[OUMappingList[fieldData.dataElement.id].parent]
      : null;
  let programData = props.programData;
  let options = props.options;
  let defaultOption = props.defaultOption;
  let rules = {
    programRule: props.programRules,
    programRuleVariable: props.programRulesVariables,
  };
  let OUJSON = props.OUJSON.organisationUnits;

  if (
    fieldData.dataElement.displayName == "Referral facility" ||
    fieldData.dataElement.displayName == "Sample transferred to facility "
  ) {
    OUJSON = OUJSON.filter((obj) => obj.comment == "Facility");
  }

  const option = { id: "option1", label: "Option1", value: "option1" };

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [location, setLocation] = useState([]);

  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    if (options != "") {
      let locationList = [];
      const filterOnId = OUJSON.filter((obj) => obj.id == options);
      if (filterOnId.length > 0) {
        const childrenOptions = filterOnId[0].children;
        childrenOptions.map((childOptions) => {
          const filterChildDetails = OUJSON.filter(
            (obj) => obj.id == childOptions.id
          );
          if (filterChildDetails.length > 0) {
            let obj = {
              id: filterChildDetails[0].id,
              label: filterChildDetails[0].name,
              value: filterChildDetails[0].id,
            };
            locationList.push(obj);
            setLocation(locationList);
          }
        });
      }
      if (
        fieldData.dataElement.displayName == "Referral facility" ||
        fieldData.dataElement.displayName == "Sample transferred to facility "
      ) {
        OUJSON.map((facility) => {
          let obj = {
            id: facility["id"],
            label: facility["name"],
            value: facility["id"],
          };
          locationList.push(obj);
          locationList = _.orderBy(locationList, ["label"], ["asc"]);
          setLocation(locationList);
        });
      }
    } else {
      const OUList = programData.organisationUnits;
      let autocompleteData = [];

      if (OUMappingList[fieldData.dataElement.id] != undefined) {
        if (OUMappingList[fieldData.dataElement.id].type) {
          let OUOptions = OUJSON.filter(
            (obj) => obj.level == OUMappingList[fieldData.dataElement.id].level
          );
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
      if (
        fieldData.dataElement.displayName == "Referral facility" ||
        fieldData.dataElement.displayName == "Sample transferred to facility "
      ) {
        OUJSON.map((facility) => {
          let obj = {
            id: facility["id"],
            label: facility["name"],
            value: facility["id"],
          };
          autocompleteData.push(obj);
          autocompleteData = _.orderBy(autocompleteData, ["label"], ["asc"]);
          setLocation(autocompleteData);
        });
      }
    }
  }, [
    values[fieldData.dataElement.id],
    parentValue,
    options,
    localStorage.getItem("locale"),
  ]); //defaultOption, options

  useEffect(() => {
    if (location != null) {
      if (values[fieldData.dataElement.id]) {
        if (!_.isEmpty(defaultOption)) {
          setFieldStructure(
            <OUFieldConfig
              data={fieldData}
              values={values}
              rules={rules}
              options={location}
              defaultOption={defaultOption}
              programData={programData}
              OUMapping={OUMappingList}
              customClassName={customClassName}
            />
          );
        }
      } else {
        setFieldStructure(
          <OUFieldConfig
            data={fieldData}
            values={values}
            rules={rules}
            options={location}
            defaultOption={defaultOption}
            programData={programData}
            OUMapping={OUMappingList}
            customClassName={customClassName}
          />
        );
      }
    }
  }, [location, localStorage.getItem("locale")]);
  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function ReferalConfig(props) {
  let fieldData = props.fieldData;

  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  let programData = props.programData;
  let customfieldobj = props.customfieldobj;
  let programBoDetails = props.programBoDetails;
  let referralWorkFlow =
    programBoDetails && programBoDetails.isReferralWorkflow ? true : false;
  let symptomsFID = props.symptomsFID ? props.symptomsFID : "";
  let Configuration = props.Configuration;
  const stagesList = programData.programStages;
  const { t } = useTranslation();
  const [referralDefaultValue, setReferralDefaultValue] = useState(null);
  let checkboxData = [];
  let isCheckboxReadOnly = false,
    readOnlyCheckboxArr = [];

  let ReferToLabForinvestigationFieldValue = values[customfieldobj.referToId]
    ? values[customfieldobj.referToId]
    : undefined;
  let defaultval = "";

  let testingStage = customfieldobj.tbTestingStageId; //stagesList.filter(obj => obj.description == "Testing Form")
  let tbInfectionTestingStage = customfieldobj.tbInfectionTestingStageId; //stagesList.filter(obj => obj.description == "TB Treatment Initiation") //ltbi
  let tptInitiation = customfieldobj.tptIntiationStageId; //stagesList.filter(obj => obj.description == "TPT  Initiation Form") //TPT ltbi
  if (referralWorkFlow) {
    if (testingStage && testingStage.length > 0) {
      if (
        ReferToLabForinvestigationFieldValue == "TB" ||
        ReferToLabForinvestigationFieldValue == "LTBI"
      ) {
        defaultval = testingStage; //testingStage[0].id
      }
    }

    if (
      values[customfieldobj.eligibleforTPTId] == "Yes" &&
      values[customfieldobj.testingforTBinfectionID] == "No"
    ) {
      //&& values[customfieldobj.testingforTBinfectionID] == 'No'
      defaultval = tptInitiation; //tptInitiation[0].id
    } else if (
      values[customfieldobj.mWRDresultId] == "Negative" &&
      values[customfieldobj.mWRDreportavailableID] == "Yes"
    ) {
      defaultval = tbInfectionTestingStage;
    } else if (
      values[customfieldobj.mWRDresultId] == "Positive" &&
      values[customfieldobj.mWRDreportavailableID] == "Yes"
    ) {
      defaultval = customfieldobj.tbTretmentInitiationStageId;
    } else if (
      (values[customfieldobj.CXRreportavailableID] == "Yes" &&
        values[customfieldobj.CXRresultId] == "Suggestive of TB") ||
      (values[customfieldobj.CRPreportavailableID] == "Yes" &&
        values[customfieldobj.CRPresultId] == "Positive") ||
      (symptomsFID &&
        values[symptomsFID] &&
        _.isArray(values[symptomsFID]) &&
        values[symptomsFID].length > 0 &&
        !values[symptomsFID].includes(customfieldobj.noneOptionID))
    ) {
      defaultval = testingStage; //tbTestingStage[0].id
    } else {
      if (
        values[customfieldobj.CXRresultId] == "Not suggestive of TB" ||
        values[customfieldobj.mWRDreportavailableID] == "No" ||
        (symptomsFID &&
          values[symptomsFID] &&
          _.isArray(values[symptomsFID]) &&
          values[symptomsFID].length > 0 &&
          values[symptomsFID].includes(customfieldobj.noneOptionID))
      ) {
        defaultval = tbInfectionTestingStage; //testingStage
      } else {
        defaultval = tbInfectionTestingStage;
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

    if (
      values &&
      customfieldobj.selectReferralServiceId == fieldData.dataElement.id
    ) {
      if (!values[customfieldobj.selectReferralServiceId]) {
        values[customfieldobj.selectReferralServiceId] = ""; //[];
      }
      if (defaultval) {
        //values[customfieldobj.selectReferralServiceId] = '' //[];
        values[customfieldobj.selectReferralServiceId] = defaultval; //.push(defaultval);
      }
    }
    // if(values[customfieldobj.selectReferralServiceId] && _.isArray(values[customfieldobj.selectReferralServiceId])){
    //     values[customfieldobj.selectReferralServiceId] = values[customfieldobj.selectReferralServiceId][0]
    // }
    if (
      values[customfieldobj.selectReferralServiceId] &&
      _.isArray(values[customfieldobj.selectReferralServiceId])
    ) {
      values[customfieldobj.selectReferralServiceId] = tbInfectionTestingStage
        ? tbInfectionTestingStage
        : values[customfieldobj.selectReferralServiceId][0];
    }

    if (
      Configuration &&
      Configuration.ltbiLinkVariables &&
      values[customfieldobj.clientTypeID] ==
        Configuration.ltbiLinkVariables.index
    ) {
      values[customfieldobj.selectReferralServiceId] =
        customfieldobj.tbTretmentInitiationStageId;
    }
  } else {
    //radio type
    // if(values[customfieldobj.selectReferralServiceId] && _.isArray(values[customfieldobj.selectReferralServiceId])){
    //     values[customfieldobj.selectReferralServiceId] = values[customfieldobj.selectReferralServiceId][0]
    // }
    if (
      values[customfieldobj.selectReferralServiceId] &&
      _.isArray(values[customfieldobj.selectReferralServiceId])
    ) {
      values[customfieldobj.selectReferralServiceId] = tbInfectionTestingStage
        ? tbInfectionTestingStage
        : values[customfieldobj.selectReferralServiceId][0];
    }
  }

  //defaultvalue
  // if(!values[customfieldobj.selectReferralServiceId]){
  //     values[customfieldobj.selectReferralServiceId] = testingStage
  // }
  if (!values[customfieldobj.selectReferralServiceId]) {
    values[customfieldobj.selectReferralServiceId] = tbInfectionTestingStage
      ? tbInfectionTestingStage
      : testingStage; //testingStage
  }

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  function getFieldDetails(stage, parentAttribute, parentReadOnlyCheckboxArr) {
    let customProps = {};
    if (referralWorkFlow) {
      customProps = { ...customProps };
      customProps.disabled = true; //false
      //customProps.initialValue = parentReadOnlyCheckboxArr
      if (defaultval) {
        customProps.initialValue = [defaultval];
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
              values[customfieldobj.selectReferralServiceId] = value;
            }
          }}
        </OnChange>
      </>
    );
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
      stagesList.map((stage) => {
        // readynoly checkbox logic for savemynmar
        if (stage.attributeValues.length > 0) {
          stage.attributeValues.map((val) => {
            if (
              val.attribute.displayName == "showStageNameInReferralService" &&
              val.value == "true"
            ) {
              if (stage.id == defaultval) {
                readOnlyCheckboxArr.push(stage.id);
              }
              isCheckboxReadOnly = true;
              checkboxData.push({
                label: stage.displayName
                  ? t(stage.displayName)
                  : t(stage.description),
                value: stage.id,
              });
            }
          });
        }
      });

      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          className={
            validationResult.hideShow == true
              ? "customLoc " + customClassName
              : "hide"
          }
        >
          <FieldGroupFF
            label={getTranslatedLabels(fieldData.dataElement)}
            required={
              fieldData.compulsory && validationResult.hideShow == true
                ? true
                : false
            }
            name={fieldData.dataElement.id}
            className={customClassName}
          >
            {checkboxData.map((stage) => {
              return getFieldDetails(stage, fieldData, readOnlyCheckboxArr);
            })}
          </FieldGroupFF>
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function MultiSelectConfig(props) {
  const { t } = useTranslation();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let DataElementGroup = props.DataElementGroup;
  let customfieldobj = props.customfieldobj;
  let programObj = props.programObj;
  let dataElementGroup = props.dataElementGroup;
  let stage = props.stages;
  let noneFieldId = customfieldobj.noneOptionID; //"ATGexAEZ8xm"
  let formref = props.formref;
  let customProps = {};
  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [forceRender, setForceRender] = useState(false);
  //const formRef = useRef(null);
  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
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
          if (
            values[DataElementGroup.id] &&
            _.isArray(values[DataElementGroup.id]) &&
            _.last(values[DataElementGroup.id]) &&
            _.last(values[DataElementGroup.id]) != noneFieldId
          ) {
            if (values[findField] == true && findField != noneFieldId) {
              if (
                values[DataElementGroup.id] &&
                values[DataElementGroup.id].includes(noneFieldId)
              ) {
                values[DataElementGroup.id] = values[
                  DataElementGroup.id
                ].filter((item) => item !== noneFieldId);
              }
              //values[noneFieldId] = false
              delete values[noneFieldId];
            }
          } else if (
            values[DataElementGroup.id] &&
            _.isArray(values[DataElementGroup.id]) &&
            _.last(values[DataElementGroup.id]) &&
            _.last(values[DataElementGroup.id]) == noneFieldId
          ) {
            values[DataElementGroup.id].map((ele) => {
              if (ele != noneFieldId) delete values[ele];
            });
            values[DataElementGroup.id] = [noneFieldId];
          }
        }
      } catch (e) {}
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
      return autoChecked == true ? (
        <Field
          component={CheckboxFieldFF}
          name={DataElementGroup.id}
          disabled={isFieldDisbaled}
          label={getTranslatedLabels(fieldData1.dataElement)}
          value={fieldData1.dataElement.id}
          initialValue={formValues[DataElementGroup.id]}
          className={customClassName}
        />
      ) : (
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
    } else {
    }
  }

  const loadOptions = (inputValue, callback) => {
    const filteredOptions = DataElementGroup.dataElements
      .filter((de) =>
        de.displayName.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((de) => ({
        label: getAsyncLabel(de.id, values),
        // de.displayName.includes('_') ? de.displayName.split('_')[0] : de.displayName,
        value: de.id,
      }));
    callback(filteredOptions);
  };

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    setSelectedOptions([]);
    if (
      values[DataElementGroup.id] &&
      Array.isArray(values[DataElementGroup.id])
    ) {
      const preselected = DataElementGroup.dataElements
        .filter(
          (de) =>
            values[DataElementGroup.id].includes(de.id) ||
            values[de.id] === true
        )
        .map((de) => ({ label: getAsyncLabel(de.id, values), value: de.id }));
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
      return getTranslatedLabels(fieldData1.dataElement);
    }
  }
  useEffect(() => {
    if (validationResult != null) {
      let fieldLabel = getTranslatedLabels(fieldData.dataElement)//getTranslatedLabels(DataElementGroup);
      try {
        if (fieldLabel.includes("_")) {
          let l = fieldLabel.split("_");
          fieldLabel = l[1];
        }
      } catch (e) {}
      const sortedDataElements = [...DataElementGroup.dataElements].sort(
        (a, b) => a.displayName.localeCompare(b.displayName)
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
      const displayOptions =
        selectedOptions.length > 0
          ? selectedOptions.map((option) => {
              const transformedOption = {
                label: option.label.includes("_")
                  ? option.label.split("_")[0]
                  : option.label,
                value: option.value,
              };
              return transformedOption;
            })
          : null;
      // signs and symtoms dropdown
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          lg={12}
          md={12}
          className={
            validationResult.hideShow == true
              ? "customLoc  " + customClassName
              : "hide"
          }
        >
          <div style={{ display: "none" }}>
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
            <Field name={DataElementGroup.id}>
              {({ input, meta }) => (
                <AsyncSelect
                  key={forceRender}
                  className="multiSelectDropdown"
                  isMulti
                  cacheOptions
                  defaultOptions={sortedDataElements.map((de) => ({
                    label: getAsyncLabel(de.id, values),
                    value: de.id,
                  }))}
                  loadOptions={loadOptions}
                  placeholder={t("Search and select...")}
                  noOptionsMessage={() => t("Search and select...")}
                  value={selectedOptions.length > 0
                    ? selectedOptions.map((option) => ({
                      label: option.label.includes("_")
                        ? option.label.split("_")[0]
                        : option.label,
                      value: option.value,
                    }))
                    : null}
                  onChange={(newSelectedOptions) => {
                    const updatedSelections = newSelectedOptions || [];
                    // Store only the selected values (IDs)
                    values[DataElementGroup.id] = updatedSelections.map(
                      (option) => option.value
                    );
                    sortedDataElements.map((field) => {
                      if (values[DataElementGroup.id].includes(field.id)) {
                        values[field.id] = true;
                      } else {
                        values[field.id] = false;
                      }
                    });
                    setSelectedOptions([...updatedSelections]);
                  }
                  }
                  classNamePrefix="custom-Asyncselect"
                  styles={{
                    control: (base) => ({
                      ...base,
                      maxHeight: "100px",
                      overflowY: "auto",
                      flexWrap: "wrap",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }),
                  }}
                />
              )}
            </Field>
          </div>
        </Grid>
      );
    }
  }, [
    selectedOptions,
    validationResult,
    localStorage.getItem("locale"),
    values,
    values[DataElementGroup.id],
  ]);
  // useEffect(() => {
  //     // Ensure dropdown binds latest selected values
  //     if (values[DataElementGroup.id] && Array.isArray(values[DataElementGroup.id])) {
  //         const preselected = DataElementGroup.dataElements
  //             .filter(de => values[DataElementGroup.id].includes(de.id))
  //             .map(de => ({ label: de.displayName, value: de.id }));

  //         setSelectedOptions(preselected);
  //     }
  // }, [values[DataElementGroup.id]]);
  useEffect(() => {}, [forceRender]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}
function QrCodeScanner(props) {
  let fieldData = props.fieldData;

  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;

  const [fieldStructure, setFieldStructure] = useState(null);
  const [showScannner, setShowScannner] = useState(false);
  const [defaultValue, setDefaultValue] = useState(null);

  function qrErrorhandler() {
    setShowScannner(false);
  }

  function handleQRScan(data) {
    if (data) {
      setShowScannner(false);
      setDefaultValue(data);
    }
  }

  function closeQrSacnner() {
    setShowScannner(false);
  }
  function openCordovaQrScanner() {
    let that = this;
    window.cordova.plugins.barcodeScanner.scan(
      function (result) {
        handleQRScan(result.text);
        //setShowScannner(false)
        //setDefaultValue(result.text)
      },
      function (error) {},
      {
        preferFrontCamera: false, // iOS and Android
        showFlipCameraButton: true, // iOS and Android
        showTorchButton: false, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        prompt: "Place a barcode inside the scan area", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        //orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations: true, // iOS
        disableSuccessBeep: false, // iOS
      }
    );
  }
  function openQrSacnner() {
    if (window.cordova) {
      openCordovaQrScanner();
    } else {
      setShowScannner(true);
    }
  }

  useEffect(() => {
    if (showScannner) {
      setFieldStructure(
        <Grid item xs={12} sm={12} md={12}>
          <div style={{ display: "none" }}>
            <Field
              name={fieldData.dataElement.id}
              label={getTranslatedLabels(fieldData.dataElement)}
              type={fieldData.dataElement.valueType}
              component={InputFieldFF}
              key={fieldData.dataElement.id}
              defaultValue={defaultValue}
            />
          </div>
          <div style={{ height: "200px", width: "200px" }}>
            <Html5QrcodePlugin
              fps={10}
              qrbox={200}
              disableFlip={false}
              qrCodeSuccessCallback={(e) => handleQRScan(e)}
            />
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
      );
    } else {
      setFieldStructure(
        <Grid item xs={12} sm={12} md={12}>
          <div style={{ display: "none" }}>
            <Field
              name={fieldData.dataElement.id}
              label={getTranslatedLabels(fieldData.dataElement)}
              type={fieldData.dataElement.valueType}
              component={InputFieldFF}
              key={fieldData.dataElement.id}
              defaultValue={defaultValue}
            />
          </div>
          <p className="qrIcon" onClick={() => openQrSacnner()}>
            <FontAwesomeIcon className="fa-3x" icon={faQrcode} />
          </p>
        </Grid>
      );
    }
  }, [showScannner, defaultValue, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}
function ImageFieldConfig(props) {
  const [fileName, setFileName] = useState("No file chosen");
  const [fieldDate, setFieldDate] = useState([])
  const [fieldURL, setFieldURL] = useState([])
  const [downloading, setDownloading] = useState({});
  const { t } = useTranslation();
  const runtime = window.RUNTIME_CONFIG || {};
  const apiServiceKey = runtime.apiServiceKey || "https://stagingcdic.imonitorplus.com/service/api/";
  let tempData = {
    Monday: {
      Breakfast: { Before: 0, After: 0 },
      Lunch: { Before: 0, After: 0 },
      Dinner: { Before: 0, After: 0 },
      Bedtime: { Before: 0, After: 0 },
    },
    Tuesday: {
      Breakfast: { Before: 0, After: 0 },
      Lunch: { Before: 0, After: 0 },
      Dinner: { Before: 0, After: 0 },
      Bedtime: { Before: 0, After: 0 },
    },
    Wednesday: {
      Breakfast: { Before: 0, After: 0 },
      Lunch: { Before: 0, After: 0 },
      Dinner: { Before: 0, After: 0 },
      Bedtime: { Before: 0, After: 0 },
    },
    Thursday: {
      Breakfast: { Before: 0, After: 0 },
      Lunch: { Before: 0, After: 0 },
      Dinner: { Before: 0, After: 0 },
      Bedtime: { Before: 0, After: 0 },
    },
    Friday: {
      Breakfast: { Before: 0, After: 0 },
      Lunch: { Before: 0, After: 0 },
      Dinner: { Before: 0, After: 0 },
      Bedtime: { Before: 0, After: 0 },
    },
    Saturday: {
      Breakfast: { Before: 0, After: 0 },
      Lunch: { Before: 0, After: 0 },
      Dinner: { Before: 0, After: 0 },
      Bedtime: { Before: 0, After: 0 },
    },
    Sunday: {
      Breakfast: { Before: 0, After: 0 },
      Lunch: { Before: 0, After: 0 },
      Dinner: { Before: 0, After: 0 },
      Bedtime: { Before: 0, After: 0 },
    },
  };
//   const dataElementMap = {
//     Monday: {
//       Breakfast: {
//         Before: "CrMRQxaV8Td",
//         After: "jHWyviHiKYw",
//       },
//       Lunch: {
//         Before: "kuAWwVqWxFA",
//         After: "NKMKyTf6Bn0",
//       },
//       Dinner: {
//         Before: "F20FMv2nR7u",
//         After: "wvnATUmMlZt",
//       },
//       Bedtime: {
//         Before: "rums2B8WtVq",
//         After: "wBp0jeKUixI",
//       },
//     },
//     Tuesday: {
//       Breakfast: {
//         Before: "CWslEsakpiX",
//         After: "V0ifM25ofnm",
//       },
//       Lunch: {
//         Before: "MjvUWCgNIl3",
//         After: "HUSO4zu3HJr",
//       },
//       Dinner: {
//         Before: "L0SqmO48PPz",
//         After: "Z2ArjOqe45i",
//       },
//       Bedtime: {
//         Before: "SBlvjzkKJ3o",
//         After: "fUnvKBTX0sK",
//       },
//     },
//     Wednesday: {
//       Breakfast: {
//         Before: "N41CSrZVMD3",
//         After: "WdpxMABiU27",
//       },
//       Lunch: {
//         Before: "ZhiDdpWHtoM",
//         After: "ZhiDdpWHtoM", // same UID for before and after!
//       },
//       Dinner: {
//         Before: "SHpE2rC8m6a",
//         After: "PW2nlfJJQZ1",
//       },
//       Bedtime: {
//         Before: "xHE0qKIAkY6",
//         After: "tKd6h7o4i3F",
//       },
//     },
//     Thursday: {
//       Breakfast: {
//         Before: "EtmgzOzfEzg",
//         After: "vJ92bJqSCyw",
//       },
//       Lunch: {
//         Before: "jeqPLF6mkkb",
//         After: "iP4lBlo2RSx",
//       },
//       Dinner: {
//         Before: "Hm8VCo97mJe",
//         After: "ER0l2GMI5gi",
//       },
//       Bedtime: {
//         Before: "FgOBtHC9SpX",
//         After: "W0PuaSZXdtX",
//       },
//     },
//     Friday: {
//       Breakfast: {
//         Before: "MlLry59Twws",
//         After: "fMCNv8z2OZl",
//       },
//       Lunch: {
//         Before: "lIqrRVFtKie",
//         After: "NhPS23B9r34",
//       },
//       Dinner: {
//         Before: "CwUOVfnu8vo",
//         After: "eepvFkESauC",
//       },
//       Bedtime: {
//         Before: "LSwBSRoNJYa",
//         After: "IIZauyxLelQ",
//       },
//     },
//     Saturday: {
//       Breakfast: {
//         Before: "dy5SCpVYoou",
//         After: "Pqes813E7tQ",
//       },
//       Lunch: {
//         Before: "J5zkGKqX0Y0",
//         After: "fq0Y1nIC0BN",
//       },
//       Dinner: {
//         Before: "lYS92MCc2ZP",
//         After: "bETvVkK24OM",
//       },
//       Bedtime: {
//         Before: "RVEluJZrziv",
//         After: "eO0ZUrUAqtr",
//       },
//     },
//     Sunday: {
//       Breakfast: {
//         Before: "CCb9GhqrSVt",
//         After: "SH0NJ4nR2pk",
//       },
//       Lunch: {
//         Before: "LtMdKR2nhkl",
//         After: "QdpMGuZc9GW",
//       },
//       Dinner: {
//         Before: "G0m3b1TjJA5",
//         After: "kXQbUatCtII",
//       },
//       Bedtime: {
//         Before: "Me2JBghMjnV",
//         After: "WzdlWdNTKZT",
//       },
//     },
//   };

  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  let customfieldobj = props.customfieldobj;
  let formref = props.formref;
  let dataElementMap = props.glucometerFieldMap
  
  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [defaultValue, setDefaultValue] = useState(null);

  function handleSave() {}

  function handleChange(files) {
    if (files.length > 0) {
      let data = new FormData();
      data.append("file", files[0]);

      axios({
        method: "post",
        url: "https://undp.imonitorplus.com/service/api/fileResources",
        data: data,
        headers: {
          //'Content-Type':  'multipart/form-data',
          Authorization:
            "YOUR_BASIC_AUTH_KEY",
        },
      })
        .then(function (response) {
          //handle success
        })
        .catch(function (response) {
          //handle error
        });
    }
  }

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.dataElement.id,
      fieldData,
      values,
      programRules,
      programRulesVariables,
      dataElementGroup
    );
    setValidationResult(validationResult);
  }

  const [selectedFile, setSelectedFile] = useState(null);
  const [openMap, setOpenMap] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [glucoseData, setGlucoseData] = useState({});
  const [isNewFormat, setIsNewFormat] = useState(false); // Track which format we're using
  const [dateBasedData, setDateBasedData] = useState([]); // Store new format data
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  const VALID_DAYS = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
  const days = VALID_DAYS.filter((day) => day in glucoseData);
  const mealTimes = ["Breakfast", "Lunch", "Dinner", "Bedtime"];

  // New format: Column mapping for date-based data
  const columnMapping = {
    Fasting: { meal: "Breakfast", time: "Before" },
    "After Breakfast": { meal: "Breakfast", time: "After" },
    "Before Lunch": { meal: "Lunch", time: "Before" },
    "After Lunch": { meal: "Lunch", time: "After" },
    "Before Dinner": { meal: "Dinner", time: "Before" },
    "After Dinner": { meal: "Dinner", time: "After" },
    "3:00 AM": { meal: "Bedtime", time: "Before" },
    Random: { meal: "Bedtime", time: "After" },
  };

  // Helper function to validate if a date string is a valid date
  const isValidDate = (year, month, day) => {
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    
    // Validate year is reasonable (between 1900 and 2100)
    if (yearNum < 1900 || yearNum > 2100) {
      return false;
    }
    
    // Validate month is between 1-12
    if (monthNum < 1 || monthNum > 12) {
      return false;
    }
    
    // Validate day is between 1-31
    if (dayNum < 1 || dayNum > 31) {
      return false;
    }
    
    // Create a date object to validate the actual date
    const date = new Date(yearNum, monthNum - 1, dayNum);
    
    // Check if the date is valid and matches the input values
    return (
      date.getFullYear() === yearNum &&
      date.getMonth() === monthNum - 1 &&
      date.getDate() === dayNum
    );
  };

  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD for date input
  const convertToDateInputFormat = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return "";
    
    // If already in YYYY-MM-DD format, validate and return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parts = dateStr.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      
      // Validate the date
      if (!isValidDate(year, month, day)) {
        console.log(dateStr, "Invalid date format - rejected");
        return "";
      }
      
      return dateStr;
    }
    
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      let year = parts[2];
      
      // Handle 2-digit year
      if (year.length === 2) {
        year = '20' + year;
      } else if (year.length === 4) {
        // Year is already 4 digits
      } else if (year.length === 1) {
        year = '202' + year;
      } else {
        // Invalid year length
        console.log(dateStr, "Invalid year format - rejected");
        return "";
      }
      
      // Validate the date before returning
      if (!isValidDate(year, month, day)) {
        console.log(dateStr, "Invalid date - rejected");
        return "";
      }
      
      return `${year}-${month}-${day}`;
    }
    
    // If format doesn't match expected patterns, reject it
    console.log(dateStr, "dateStr - invalid format, rejected");
    return "";
  };

  // Transform new array format to work with existing dataElementMap structure
  const transformNewFormatToOldStructure = (dataArray) => {
    if (!Array.isArray(dataArray) || dataArray.length < 4) {
      return tempData;
    }

    // Row 2 (index 1) contains headers
    const headers = dataArray[1];
    // Data starts from row 4 (index 3)
    const dataRows = dataArray.slice(3);

    const transformedData = {};
    const dayNames = VALID_DAYS;

    dataRows.forEach((row, index) => {
      if (index >= 7) return; // Only process up to 7 rows (Monday-Sunday)
      
      const dayName = dayNames[index];
      const rowNum = index + 4; // Actual row number in the JSON (4, 5, 6, ...)
      
      // Try different key formats
      const getColumnValue = (colNum) => {
        return row[`row${rowNum}_column${colNum}`] || row[`row_column${colNum}`] || "";
      };
      
      // Get date and convert to YYYY-MM-DD format for DHIS2
      const rawDate = getColumnValue(1);
      const formattedDate = convertToDateInputFormat(rawDate);
      console.log(formattedDate,"formattedDate")
      transformedData[dayName] = {
        Date: formattedDate, // Store in YYYY-MM-DD format
        Breakfast: {
          Before: getColumnValue(2), // Fasting
          After: getColumnValue(3), // After Breakfast
        },
        Lunch: {
          Before: getColumnValue(4), // Before Lunch
          After: getColumnValue(5), // After Lunch
        },
        Dinner: {
          Before: getColumnValue(6), // Before Dinner
          After: getColumnValue(7), // After Dinner
        },
        Bedtime: {
          Before: getColumnValue(8), // 3:00 AM
          After: getColumnValue(9), // Random
        },
      };
    });

    return transformedData;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    
    // Validate that the file is an image
    const isValidImage = file.type.startsWith('image/') || 
      /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file.name);
    if (!isValidImage) {
      swal("Error", t("Please select an image file only. Other file types are not allowed."), "error");
      // Reset the input
      event.target.value = '';
      return;
    }
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    swal({
      title: t("Capture and Submit"),
      content: {
        element: "img",
        attributes: {
          src: URL.createObjectURL(file),
          alt: "Preview",
          style: "width: 100%; max-width: 100%;",
        },
      },
      className: "custom-swal-capture", // Adding class here
      buttons: {
        cancel: t("Cancel"),
        confirm: t("Process"),
      },
    }).then((willSubmit) => {
      if (willSubmit) {
        handleUpload(file);
        //   swal("Submitted!", "File captured and submitted.", "success");
      }
      // Reset the input value after dialog closes (whether confirmed or cancelled)
      // This ensures onChange will fire again when selecting the same file
      event.target.value = '';
    });
    setFileName(file ? file.name : t("No file chosen"));
  };

  const captureFromCamera = () => {
    if (window.cordova && navigator.camera) {
      navigator.camera.getPicture(
        (imageURI) => {
          window.resolveLocalFileSystemURL(
            imageURI,
            function (fileEntry) {
              fileEntry.file(
                function (file) {
                  const reader = new FileReader();
                  reader.onloadend = function () {
                    const arrayBuffer = reader.result;
                    const realFile = new File([arrayBuffer], file.name, {
                      type: file.type,
                      lastModified: file.lastModified,
                    });

                    setSelectedFile(realFile);
                    const fileUri = URL.createObjectURL(realFile);
                    setPreviewUrl(fileUri);

                    swal({
                      title: "Capture and Submit",
                      content: {
                        element: "img",
                        attributes: {
                          src: fileUri,
                          alt: "Preview",
                          style: "width: 100%; max-width: 100%;",
                        },
                      },
                      className: "custom-swal-capture",
                      buttons: {
                        cancel: "Cancel",
                        confirm: "Process",
                      },
                    }).then((willSubmit) => {
                      if (willSubmit) {
                        handleUpload(realFile);
                      }
                    });
                  };

                  reader.readAsArrayBuffer(file);
                },
                (err) => {
                  console.error("Error getting file from fileEntry:", err);
                }
              );
            },
            (err) => {
              console.error("Error resolving file URI:", err);
            }
          );
        },
        (error) => {
          console.error("Camera error:", error);
        },
        {
          quality: 50,
          destinationType: navigator.camera.DestinationType.FILE_URI,
          saveToPhotoAlbum: true,
          sourceType: navigator.camera.PictureSourceType.CAMERA,
          correctOrientation: true,
        }
      );
    } else {
      document.getElementById("upload-file").click();
    }
  };

  const handlePdfFileChange = async (event, id) => {
    const file = event.target.files[0];
    if (!file) {
      // setError('Please select or capture an image first.')
      return;
    }
    
    // Validate that the file is a PDF
    const isValidPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf');
    if (!isValidPdf) {
      swal("Error", t("Please select a PDF file only. Other file types are not allowed."), "error");
      // Reset the input
      event.target.value = '';
      return;
    }
    
    setGlobalSpinner(true);
    const axiosInstance = axios.create({
      baseURL: "https://apivital.imonitorplus.com/service/", // Replace with your API's base URL
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Token ${AUTH_TOKEN}`,
        // Add any other default headers here
      },
    });
    const formData = new FormData();
    formData.append("files", file);
    const jsonData = {
      phoneNumber: "+919867155919",
    };
    formData.append("data", JSON.stringify(jsonData));
    formData.append("testname", 
      `GLYCOSYLATED HEMOGLOBIN (HbA1c),
      Hemoglobin,
      RBC Count,
      Platelet Count,
      Neutrophils,
      Lymphocytes,
      Monocytes,
      Eosinophils,
      Basophils,
      TOTAL BILIRUBIN,
      URINE MICROALBUMIN,
      URINE CREATININE,
      W.B.C,
      R.B.C,
      TOTAL CHOLESTEROL,
      LDL CHOLESTEROL,
      HDL CHOLESTEROL,
      TRIGLYCERIDES
      `);
    let head = {
      // "Content-Type": "multipart/form-data",
      token: "yE637V8ZXVLNhIKkIJpcydCrkJeOxGgG",
    };
    try {
      const response = await axiosInstance.post(
        "v1.0/lab-report/process-report",
        formData,
        {
          // headers: {
          //   "Content-Type": "multipart/form-data",
          //   "token":token,
          // },
          headers: head,
        }
      );
      const number = parseFloat(
        response.data.data["GLYCOSYLATED HEMOGLOBIN (HbA1c)"]
      );
      const hemoglobinValue = parseFloat(
        response.data.data["Hemoglobin"]
      );
      const rbcCountValue = parseFloat(
        response.data.data["RBC Count"] || response.data.data["R.B.C"]
      );
      const plateletCountValue = parseFloat(
        response.data.data["Platelet Count"]
      );
      const neutrophilsValue = parseFloat(
        response.data.data["Neutrophils"]
      );
      const lymphocytesValue = parseFloat(
        response.data.data["Lymphocytes"]
      );
      const monocytesValue = parseFloat(
        response.data.data["Monocytes"]
      );
      const eosinophilsValue = parseFloat(
        response.data.data["Eosinophils"]
      );
      const basophilsValue = parseFloat(
        response.data.data["Basophils"]
      );
      const creatinineValue = parseFloat(
        response.data.data["URINE CREATININE"]
      );
      const wbcValue = parseFloat(
        response.data.data["W.B.C"]
      );
      const totalCholesterolValue = parseFloat(
        response.data.data["TOTAL CHOLESTEROL"]
      );
      const ldlCholesterolValue = parseFloat(
        response.data.data["LDL CHOLESTEROL"]
      );
      const hdlCholesterolValue = parseFloat(
        response.data.data["HDL CHOLESTEROL"]
      );
      const triglyceridesValue = parseFloat(
        response.data.data["TRIGLYCERIDES"]
      );
     
      setGlobalSpinner(false);
      swal("", t("Lab report sucessfully uploaded"), "success");
      //Calculation eAG
    // Convert to number
    const hba1cValue = number;

    if (!isNaN(hba1cValue) && hba1cValue > 0) {
      let calc = (hba1cValue * 28.7) - 46.7;
      calc = Math.round(calc * 100) / 100;
      values[customfieldobj.EstimatedAverageBloodGlucose] = calc;
    }
    else {
      values[customfieldobj.EstimatedAverageBloodGlucose] = 0;
    }
      //
      setTimeout(() => {
        // const bmizInput = document.getElementById("Br849ixPiPj"); // Ensure correct ID
        // if (bmizInput) {
        //     bmizInput.focus();
        //     setTimeout(() => bmizInput.blur(), 300);
        // }
        values[id] = event.target.files;
        values["Br849ixPiPj"] = number;
        values["j4bBNr7kPfM"] = hemoglobinValue;
        values["hZlxkLnoLNX"] = neutrophilsValue;
        values["tJaqaceP7ky"] = lymphocytesValue;
        values["rkcbgxJLPs0"] = monocytesValue;
        values["GyPXmzGEzM8"] = eosinophilsValue;
        values["dUltOfowoLm"] = basophilsValue;
        values["WOaCpWKszVO"] = rbcCountValue;
        values["Z92ftrTjmS5"] = plateletCountValue;
        values["ElT6ODpiuKP"] = creatinineValue;
        values["HcemfZG0LPQ"] = wbcValue;
        values["tShYB61qPz3"] = totalCholesterolValue;
        values["ZpcCQRjcbXU"] = ldlCholesterolValue;
        values["dxwoI3g7sil"] = hdlCholesterolValue;
        values["hcIYUW54fBm"] = triglyceridesValue;
        formref.current.change("forceRenderField_", Math.random());
      }, 1000);
      return response.data;
    } catch (error) {
      console.error("POST form data request error:", error);
      throw error;
    }
  };
  const handleUpload = async (file) => {
    setGlobalSpinner(true);
    if (!file) {
      // setError('Please select or capture an image first.')
      return;
    }

    const axiosInstance = axios.create({
      baseURL: "https://apivital.imonitorplus.com/service/", // Replace with your API's base URL
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Token ${AUTH_TOKEN}`,
        // Add any other default headers here
      },
    });

    const formData = new FormData();

    // Append the file (assuming 'selectedFile' holds your image file)
    formData.append("files", file);
    // formData.append('token', "yRX3MzrICoVo8lV7A2428n8N7t4XgkJs")

    // Append the JSON data as a string or Blob
    const jsonData = {
      phoneNumber: "+919867155919",
    };

    // You can append it as a string
    formData.append("data", JSON.stringify(jsonData));
    let head = {
      "Content-Type": "multipart/form-data",
      token: "yRX3MzrICoVo8lV7A2428n8N7t4XgkJs",
    };
    try {
      const response = await axiosInstance.post(
        "v1.0/lab-report/process-imageocr",
        formData,
        {
          // headers: {
          //   "Content-Type": "multipart/form-data",
          //   "token":token,
          // },
          headers: head,
        }
      );
      
      if (response.data.data.lab_data) {
        const parsedData = JSON.parse(response.data.data.lab_data).table_data;
        
        // Check if it's the new array format (starts with array)
        if (Array.isArray(parsedData)) {
          setIsNewFormat(true);
          setDateBasedData(parsedData);
          // Transform to old structure for compatibility with dataElementMap
          const transformedData = transformNewFormatToOldStructure(parsedData);
          setGlucoseData(transformedData);
        } else {
          // Old object format (day-based)
          setIsNewFormat(false);
          setDateBasedData([]);
          setGlucoseData(parsedData);
        }
      } else {
        setGlucoseData(tempData);
      }
      
      setGlobalSpinner(false);
      setOpenMap(true);
      return response.data;
    } catch (error) {
      console.error("POST form data request error:", error);
      setGlobalSpinner(false);
      throw error;
    }
  };
  useEffect(() => {
    Object.entries(dataElementMap).forEach(([day, meals]) => {
      // Check if there's a Date field in the dataElementMap
      if (meals.Date && glucoseData?.[day]?.Date) {
        const dateValue = glucoseData[day].Date;
        if (dateValue !== undefined && dateValue !== null && dateValue !== "") {
          values[meals.Date] = dateValue;
        }
      }
      
      // Process meal data (existing logic)
      Object.entries(meals).forEach(([meal, times]) => {
        // Skip the Date field as it's already processed above
        if (meal === "Date") return;
        
        Object.entries(times).forEach(([time, dataElementUID]) => {
          const enteredValue = glucoseData?.[day]?.[meal]?.[time];

          // Only add if we have a value!
          if (enteredValue !== undefined && enteredValue !== null) {
            values[dataElementUID] = parseInt(enteredValue);
          }
        });
      });
    });
  }, [glucoseData]);

  const getHighestGlucoseValues = (data) => {
    let highestBeforeBreakfast = 0;
    let highestPostMeals = 0;

    Object.values(data).forEach((meals) => {
      // 1. Check BEFORE Breakfast (fasting)
      const beforeBreakfast = parseFloat(meals?.Breakfast?.Before) || 0;
      if (beforeBreakfast > highestBeforeBreakfast) {
        highestBeforeBreakfast = beforeBreakfast;
      }

      // 2. Check AFTER values (all meals)
      ["Breakfast", "Lunch", "Dinner", "Bedtime"].forEach((meal) => {
        const afterVal = parseFloat(meals?.[meal]?.After) || 0;
        if (afterVal > highestPostMeals) {
          highestPostMeals = afterVal;
        }
      });
    });
    
    values[customfieldobj.MaximumValueOfFastingBloodGlucose] = highestBeforeBreakfast;
    values[customfieldobj.MaximumValueOfPostPandialBloodGlucose] = highestPostMeals;
    formref.current.change("forceRenderField_", Math.random());
    return {
      highestBeforeBreakfast,
      highestPostMeals
    };
  };

  const handleValueChange = (uid, day, meal, type, value) => {
    setGlucoseData((prevData) => ({
      ...prevData,
      [day]: {
        ...prevData[day],
        [meal]: {
          ...prevData[day][meal],
          [type]: value,
        },
      },
    }));
    values[uid] = value;
  };

  const handleDateChange = (uid, day, value) => {
    // Store date in YYYY-MM-DD format (ISO 8601 format for DHIS2)
    setGlucoseData((prevData) => ({
      ...prevData,
      [day]: {
        ...prevData[day],
        Date: value,  // Keep as YYYY-MM-DD
      },
    }));
    values[uid] = value;  // Store as YYYY-MM-DD for DHIS2
  };

  const clearAllValues = () => {
    // Clear all glucose data
    const clearedData = {};
    Object.keys(dataElementMap).forEach((day) => {
      clearedData[day] = {
        Date: "",
        Breakfast: { Before: "", After: "" },
        Lunch: { Before: "", After: "" },
        Dinner: { Before: "", After: "" },
        Bedtime: { Before: "", After: "" },
      };
    });
    setGlucoseData(clearedData);

    // Clear all values in form
    Object.entries(dataElementMap).forEach(([day, meals]) => {
      // Clear date
      if (meals.Date) {
        values[meals.Date] = "";
      }
      
      // Clear meal values
      Object.entries(meals).forEach(([meal, times]) => {
        if (meal === "Date") return;
        Object.entries(times).forEach(([time, dataElementUID]) => {
          values[dataElementUID] = "";
        });
      });
    });

    // Clear maximum values
    if (customfieldobj.MaximumValueOfFastingBloodGlucose) {
      values[customfieldobj.MaximumValueOfFastingBloodGlucose] = "";
    }
    if (customfieldobj.MaximumValueOfPostPandialBloodGlucose) {
      values[customfieldobj.MaximumValueOfPostPandialBloodGlucose] = "";
    }

    // Force re-render
    formref.current.change("forceRenderField_", Math.random());
  };

  const buildGlucoseData = (valuesObj) => {
    const newGlucoseData = {};

    Object.keys(dataElementMap).forEach((day) => {
      newGlucoseData[day] = {};

      // Check if there's a Date UID and get its value
      if (dataElementMap[day].Date) {
        newGlucoseData[day].Date = valuesObj[dataElementMap[day].Date] || "";
      }

      Object.keys(dataElementMap[day]).forEach((meal) => {
        // Skip the Date field as it's already processed above
        if (meal === "Date") return;
        
        const beforeUID = dataElementMap[day][meal].Before;
        const afterUID = dataElementMap[day][meal].After;

        newGlucoseData[day][meal] = {
          Before: valuesObj[beforeUID] || "",
          After: valuesObj[afterUID] || "",
        };
      });
    });
    setGlucoseData(newGlucoseData);
    return newGlucoseData;
  };

  const getFileDetails = (values) => {
    try{
      if(props?.trackentityInstanceDetails?.enrollments?.[0]?.events){
          const events = props.trackentityInstanceDetails.enrollments[0].events
          const currentField = fieldData.dataElement.id
          const stageEvent = events.filter(
            (event) => event.programStage === props.currentStage.id
          );
          if (stageEvent.length > 0) {
            const latestEvent = stageEvent.sort(
              (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
            )[0];
             const fileFieldId = latestEvent.dataValues.find(
              (dv) => dv.dataElement === currentField
            );
            const fileFieldValue = fileFieldId?.value;
            
            if (fileFieldValue) {
              // setFieldDate(prev => ({
              //   ...prev,
              //   [currentField]: moment(latestEvent.lastUpdated).format("DD-MM-YYYY"),
              // }));

              setFieldURL(prev => ({
                ...prev,
                [currentField]:
                  "events/files?eventUid=" +
                  latestEvent.event +
                  "&dataElementUid=" +
                  currentField,
              }));
            }
          }
      }
    }catch(e){}
  }

  const handleDownload = async () => {
  const key = fieldData.dataElement.id;

  try {
    setGlobalSpinner(true);
    setDownloading(prev => ({ ...prev, [key]: true }));

    const response = await apiServices.getBlobAPI(fieldURL[key]);

    const blob = response.data; // already blob

    // 🔥 Detect file type
    const contentType =
      response.headers?.["content-type"] || blob.type;

    // 🔥 Extract filename from header (if backend sends it)
    let fileName = "download";

    const contentDisposition = response.headers?.["content-disposition"];

    if (contentDisposition && contentDisposition.includes("filename")) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);

      if (match && match[1]) {
        fileName = match[1]
          .split(";")[0]          // 🔥 removes ;charset=UTF-8
          .trim();
      }
    } else {
      // fallback
      const contentType =
      response.headers?.["content-type"] || blob.type;

      if (contentType.includes("pdf")) {
        fileName = "download.pdf";
      } else if (contentType.includes("image")) {
        // 🔥 remove charset if present
        const cleanType = contentType.split(";")[0];   // removes ;charset=UTF-8
        const extension = cleanType.split("/")[1];

        fileName = `download.${extension}`;
      }
    }
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed", err);
  } finally {
    setGlobalSpinner(false);
    setDownloading(prev => ({ ...prev, [key]: false }));
  }
};
  
  useEffect(() => {
    fetchValidation();
    buildGlucoseData(values);
    getFileDetails(values)
  }, [values]);

  async function openFileChooser() {
    const file = await window.chooser.getFile({
      mimeTypes: ["application/pdf", "image/*"],
    });
    setDefaultValue(file);
  }

  const validateFileType = (file) => {
    if (!file) return undefined;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf"
    ];

    // DHIS2 may pass File or array
    const selectedFile = Array.isArray(file) ? file[0] : file;

    if (!allowedTypes.includes(selectedFile.type)) {
      return t("Only JPG, PNG, and PDF files are allowed");
    }

    return undefined;
  };
  
  const TranslatedFileInput = (props) => {
    return <FileInputFieldFF {...props} />;
  };
  useEffect(() => {
    if (validationResult != null) {
      // if (
      //   values[customfieldobj.reasonForTodaysVisit] &&
      //   (values[customfieldobj.reasonForTodaysVisit] == "Routine Visit" ||
      //     values[customfieldobj.reasonForTodaysVisit] == "Quarterly Visit" ||
      //     values[customfieldobj.reasonForTodaysVisit] == "Collecting insulin")
      // ) {
      //   {
      //     if (fieldData.dataElement.id == customfieldobj.fundusPhotography)
      //       validationResult.hideShow = false;
      //   }
      // }
      const isCordova = window.cordova !== undefined;
      if (!navigator.onLine) {
        if (defaultValue) {
          values[fieldData.dataElement.id] = [defaultValue];
        }
        setFieldStructure(
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            className={validationResult.hideShow == true ? "hide" : "hide"}
          >
            <div style={{ display: "none" }}>
              <Field
                name={fieldData.dataElement.id}
                label={getTranslatedLabels(fieldData.dataElement)}
                type={fieldData.dataElement.valueType}
                component={InputFieldFF}
                key={fieldData.dataElement.id}
                defaultValue={defaultValue}
                value={""}
              />
            </div>
            <label className={customClassName}>
              {getTranslatedLabels(fieldData.dataElement)}
            </label>
            <p className="qrIcon" onClick={() => openFileChooser()}>
              <FontAwesomeIcon className="fa-3x" icon={faFileUpload} />
            </p>
            {defaultValue && defaultValue.name ? (
              <p className={defaultValue && defaultValue.name ? "" : "hide"}>
                {defaultValue && defaultValue.name ? defaultValue.name : ""}
              </p>
            ) : values[fieldData.dataElement.id] &&
              values[fieldData.dataElement.id].includes("RTMUPLOADS") ? (
              <p className={values[fieldData.dataElement.id] ? "" : "hide"}>
                {values[fieldData.dataElement.id]
                  ? values[fieldData.dataElement.id].split("RTMUPLOADS/")
                    ? values[fieldData.dataElement.id].split("RTMUPLOADS/")[1]
                    : ""
                  : ""}
              </p>
            ) : (
              <p className={values[fieldData.dataElement.id] ? "" : "hide"}>
                {values[fieldData.dataElement.id]
                  ? values[fieldData.dataElement.id]
                  : ""}
              </p>
            )}
          </Grid>
        );
      } else {
        if(APP_LOCALE == "CC013"){
          if(customfieldobj.selfMonitoringId && fieldData.dataElement.id == customfieldobj.selfMonitoringId){
              validationResult.hideShow = false;
              if(customfieldobj.monitoringMethodId && values[customfieldobj.monitoringMethodId] && (values[customfieldobj.monitoringMethodId] == "SMBG only" || values[customfieldobj.monitoringMethodId] == "Both")){
                  validationResult.hideShow = true;
              }
          }
          if(customfieldobj.continuousGlucoseSensorUseId && fieldData.dataElement.id == customfieldobj.continuousGlucoseSensorUseId){
              validationResult.hideShow = false;
              if(customfieldobj.monitoringMethodId && values[customfieldobj.monitoringMethodId] && (values[customfieldobj.monitoringMethodId] == "CGM only" || values[customfieldobj.monitoringMethodId] == "Both")){
                  validationResult.hideShow = true;
              }
          }
        }
        console.log("fieldData.dataElement.description ",fieldData.dataElement.description)
        if (
          fieldData.dataElement.description ==
          "Continuous Glucose Monitoring Chart"
        ) {
          const settingsc = getGlucoseSettings();
          setFieldStructure(
            <>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                className={validationResult.hideShow == true ? "" : "hide"}
              >
                <div>
                  <label>{getTranslatedLabels(fieldData.dataElement)}</label>
                  {/* <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileChange}
                                /> */}
                  {settingsc && settingsc.enableUpload === "Yes" && (
                    <>
                      <input
                        type="file"
                        accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp"
                        capture="environment"
                        style={{ display: "none" }}
                        id="upload-file"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="upload-file" className="uploadImageFile">
                        <p>{t("Upload/ Click log book image")}</p>
                        <AttachFileIcon className="attachIcon"></AttachFileIcon>{" "}
                        *
                      </label>
                    </>
                  )}
                  {(APP_LOCALE == "CC013" || APP_LOCALE == "SENEGAL") &&
                    (
                      <>
                        <Field
                          name={fieldData.dataElement.id}
                          //label={getTranslatedLabels(fieldData.dataElement)}
                          // component={FileInputFieldFF}
                          component={TranslatedFileInput}
                          key={fieldData.dataElement.id}
                          required={
                            fieldData.compulsory && validationResult.hideShow == true
                              ? true
                              : false
                          }
                          value={[]}
                          accept=".pdf,.jpg,.jpeg,.png"
                          validate={validateFileType}
                          className={customClassName}
                          //onChange={handleChange.bind(this)}
                          //validate={composeValidators(required, URLCheck)}
                        />
                        {fieldURL?.[fieldData.dataElement.id] && values[fieldData.dataElement.id] && (
                          <Box sx={{ mt: 1.3, ml: 0.2, mb: 0.9 }} className="download-btn">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {/* <Typography variant="body2">
                                <strong>{t("View/Download")}:</strong>{" "}
                                {fieldDate?.[fieldData.dataElement.id]}
                              </Typography> */}

                              <FileDownloadOutlined
                                className="viewdownloadIcon"
                                sx={{
                                  cursor: downloading?.[fieldData.dataElement.id] ? "not-allowed" : "pointer",
                                  opacity: downloading?.[fieldData.dataElement.id] ? 0.6 : 1,
                                  fontSize: 20,
                                  color: "#1976d2",
                                  "&:hover": { color: "#0d47a1" },
                                }}
                                onClick={!downloading?.[fieldData.dataElement.id] ? handleDownload : undefined}
                              />
                            </Box>
                          </Box>
                        )}
                      </>

                    )
                  }
                  <div className="manualButton" style={{marginTop:"10px"}}>
                    <div className="d-flex justify-content-start align-items-center gap-10px">
                      <span onClick={() => setOpenMap(true)}>
                        <IconButton aria-label="close">
                          <Edit />
                        </IconButton>
                        <span>{t("Add Manually")}</span>
                      </span>
                      {/* {isCordova && (
                                    <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={captureFromCamera}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' '){ 
                                             e.preventDefault();
                                             e.stopPropagation();
                                            captureFromCamera();}
                                    }}
                                    className="uploadImageFile"
                                    >
                                    <CameraAltIcon />
                                    <p>Take Photo</p>
                                    </span>
                                     )} */}
                    </div>

                    {/* <Typography variant="body2" className='fileSpecify'>{fileName}</Typography> */}
                  </div>
                </div>
              </Grid>
              {openMap &&
                ReactDOM.createPortal(
                  <div className="modaloverlay glucoseModal">
                    <div className="modalcardholder">
                      <Card className="modalcard">
                        <CardContent className="modalbodycontent">
                          <div className="modalHeader">
                            <Typography>{t("Patient CGM Values")}</Typography>

                            <IconButton
                              aria-label="close"
                              className="modalCloseButton"
                              onClick={() => setOpenMap(false)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </div>

                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              {Object.keys(glucoseData).length > 0 ? (
                                <TableContainer component={Paper}>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell
                                          rowSpan={2}
                                          align="center"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {t("Date")}
                                        </TableCell>
                                        {/* Breakfast columns - no category header */}
                                        <TableCell
                                          rowSpan={2}
                                          align="center"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {t("Fasting")}
                                        </TableCell>
                                        <TableCell
                                          rowSpan={2}
                                          align="center"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {t("After Breakfast")}
                                        </TableCell>
                                        {/* Lunch with Pre/Post sub-headers */}
                                        <TableCell
                                          colSpan={2}
                                          align="center"
                                          className="MealHeading"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <p className="mealSubHeading">
                                            {t("Lunch")}
                                          </p>
                                        </TableCell>
                                        {/* Dinner with Pre/Post sub-headers */}
                                        <TableCell
                                          colSpan={2}
                                          align="center"
                                          className="MealHeading"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <p className="mealSubHeading">
                                            {t("Dinner")}
                                          </p>
                                        </TableCell>
                                        {/* Bedtime columns - no category header */}
                                        <TableCell
                                          rowSpan={2}
                                          align="center"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          3:00 AM
                                        </TableCell>
                                        <TableCell
                                          rowSpan={2}
                                          align="center"
                                          className="borderRightTable"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                            borderRight: "1px solid #ddd!important",
                                          }}
                                        >
                                          {t("Random")}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        {/* Sub-headers only for Lunch and Dinner */}
                                        <TableCell
                                          align="center"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {t("Pre")}
                                        </TableCell>
                                        <TableCell
                                          align="center"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {t("Post")}
                                        </TableCell>
                                        <TableCell
                                          align="center"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {t("Pre")}
                                        </TableCell>
                                        <TableCell
                                          align="center"
                                          className="borderRightTable"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            fontWeight: "bold",
                                            borderRight: "1px solid #ddd!important",
                                          }}
                                        >
                                          {t("Post")}
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>

                                    <TableBody>
                                      {days.map((day, dayIndex) => {
                                        // Get date UID for this day
                                        const dateUID = dataElementMap?.[day]?.Date;
                                        
                                        // Get current date value from glucoseData or values
                                        let dateValue = glucoseData?.[day]?.Date || values[dateUID] || "";
                                        
                                        // For new format, also check dateBasedData as fallback
                                        if (!dateValue && isNewFormat && dateBasedData.length > 0) {
                                          const dataRowIndex = 3 + dayIndex;
                                          if (dateBasedData[dataRowIndex]) {
                                            dateValue = dateBasedData[dataRowIndex][`row${dataRowIndex + 1}_column1`] || 
                                                       dateBasedData[dataRowIndex].row_column1 || 
                                                       "";
                                          }
                                        }
                                        
                                        // Convert date to YYYY-MM-DD format for date input
                                        const dateInputValue = convertToDateInputFormat(dateValue);
                                        
                                        return (
                                          <TableRow key={day}>
                                            <TableCell
                                              align="center"
                                              style={{ 
                                                fontWeight: "bold",
                                                minWidth: "160px !important",
                                                width: "160px !important",
                                                maxWidth: "160px !important"
                                              }}
                                            >
                                              {dateUID ? (
                                                // Editable date field if UID exists
                                                <TextField
                                                  type="date"
                                                  variant="outlined"
                                                  size="small"
                                                  fullWidth
                                                  value={dateInputValue}
                                                  onChange={(e) =>
                                                    handleDateChange(
                                                      dateUID,
                                                      day,
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder={isNewFormat ? "DD/MM/YYYY" : t(day)}
                                                  className="dateTextField"
                                                  InputLabelProps={{
                                                    shrink: true,
                                                  }}
                                                  sx={{
                                                    width: '155px !important',
                                                    minWidth: '155px !important',
                                                    '& .MuiOutlinedInput-root': {
                                                      fontSize: '0.875rem',
                                                      width: '155px !important',
                                                    },
                                                    '& .MuiOutlinedInput-input': {
                                                      textAlign: 'center',
                                                      fontWeight: 'bold',
                                                      padding: '8px 8px',
                                                      width: '100% !important',
                                                      minWidth: '140px !important',
                                                    }
                                                  }}
                                                />
                                              ) : (
                                                // Non-editable display if no UID (backward compatibility)
                                                <p className="dayDiv">
                                                  {isNewFormat ? dateValue : t(day)}
                                                </p>
                                              )}
                                            </TableCell>

                                            {mealTimes.map((meal) => {
                                              const beforeUID =
                                                dataElementMap?.[day]?.[meal]
                                                  ?.Before;
                                              const afterUID =
                                                dataElementMap?.[day]?.[meal]
                                                  ?.After;

                                              return (
                                                <React.Fragment
                                                  key={`${day}-${meal}`}
                                                >
                                                  <TableCell align="center">
                                                    <TextField
                                                      variant="outlined"
                                                      size="small"
                                                      value={
                                                        values[beforeUID] || ""
                                                      }
                                                      onChange={(e) =>
                                                        handleValueChange(
                                                          beforeUID,
                                                          day,
                                                          meal,
                                                          "Before",
                                                          e.target.value
                                                        )
                                                      }
                                                      placeholder="X"
                                                    />
                                                  </TableCell>

                                                  <TableCell
                                                    align="center"
                                                    className="borderRightTable"
                                                  >
                                                    <TextField
                                                      variant="outlined"
                                                      size="small"
                                                      value={
                                                        values[afterUID] || ""
                                                      }
                                                      onChange={(e) =>
                                                        handleValueChange(
                                                          afterUID,
                                                          day,
                                                          meal,
                                                          "After",
                                                          e.target.value
                                                        )
                                                      }
                                                      placeholder="X"
                                                    />
                                                  </TableCell>
                                                </React.Fragment>
                                              );
                                            })}
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              ) : null}
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardActions className="modalfooter" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                          <Button
                            className="modalactionbtn"
                            variant="outlined"
                            color="secondary"
                            onClick={clearAllValues}
                            style={{ marginRight: '10px' }}
                          >
                            {t("Clear All")}
                          </Button>
                          <Button
                            className="modalactionbtn"
                            onClick={() => {                              
                              setOpenMap(false);
                              const result = getHighestGlucoseValues(glucoseData);
                            }}
                          >
                            {" "}
                            {t("Save")}
                          </Button>
                        </CardActions>
                      </Card>
                    </div>
                  </div>,
                  document.body // Moves modal outside the restricted div
                )}
            </>
          );
        }else if (fieldData.dataElement.description == "Lab Report Upload") {
          setFieldStructure(
            <>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                className={validationResult.hideShow == true ? "" : "hide"}
              >
                <div>
                  <label>{getTranslatedLabels(fieldData.dataElement)}</label>
                  {/* <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileChange}
                                /> */}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    capture="environment"
                    style={{ display: "none" }}
                    id="upload-file"
                    onChange={(e) =>
                      handlePdfFileChange(e, fieldData.dataElement.id)
                    }
                  />
                  <label htmlFor="upload-file" className="uploadImageFile">
                    <p>{t("Upload / Click Lab Report")}</p>

                    <AttachFileIcon className="attachIcon"></AttachFileIcon>
                  </label>
                  <div className="manualButton">
                    <div className="d-flex justify-content-start align-items-center gap-10px">
                      {/* <span onClick={() => setOpenMap(true)} >
                                    <IconButton aria-label="close">
                                        <Edit/>
                                    </IconButton>
                                    <span>{t("Add Manually")}</span>
                                    </span> */}
                    </div>

                    {/* <Typography variant="body2" className='fileSpecify'>{fileName}</Typography> */}
                  </div>
                </div>
              </Grid>
            </>
          );
        } else {
          setFieldStructure(
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              className={validationResult.hideShow == true ? "" : "hide"}
            >
              {/* <DropzoneArea
                                name={fieldData.dataElement.id}
                                onChange={handleChange.bind(this)}
                                filesLimit={1}
                            /> */}
              <div>
                 
              <>
              <label>{getTranslatedLabels(fieldData.dataElement)}</label>
              <Field
                name={fieldData.dataElement.id}
                //label={getTranslatedLabels(fieldData.dataElement)}
                // component={FileInputFieldFF}
                component={TranslatedFileInput}
                key={fieldData.dataElement.id}
                required={
                  fieldData.compulsory && validationResult.hideShow == true
                    ? true
                    : false
                }
                value={[]}
                accept=".pdf,.jpg,.jpeg,.png"
                validate={validateFileType}
                className={customClassName}

                //onChange={handleChange.bind(this)}
                //validate={composeValidators(required, URLCheck)}
              />

              {/* FORCE NEW ROW */}
                {fieldURL?.[fieldData.dataElement.id] && values[fieldData.dataElement.id] && (
                  <Box sx={{  mt: 0, ml: 1.5 }} className="download-btn tp">
                    <Box
                       sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                    >
                      {/* <Typography variant="body2">
                        <strong>{t("View/Download")}:</strong>{" "}
                        {fieldDate?.[fieldData.dataElement.id]}
                      </Typography> */}

                      <FileDownloadOutlined
                        className="viewdownloadIcon"
                        sx={{
                          cursor: downloading?.[fieldData.dataElement.id] ? "not-allowed" : "pointer",
                          opacity: downloading?.[fieldData.dataElement.id] ? 0.6 : 1,
                          fontSize: 20,
                          color: "#1976d2",
                          "&:hover": { color: "#0d47a1" },
                        }}
                        onClick={!downloading?.[fieldData.dataElement.id] ? handleDownload : undefined}
                      />
                    </Box>
                  </Box>
                )}
                </>
              </div>
             
            </Grid>
          );
        }
      }
    }
  }, [
    validationResult,
    previewUrl,
    glucoseData,
    openMap,
    selectedFile,
    defaultValue,
    isNewFormat,
    dateBasedData,
    localStorage.getItem("locale"),
    fieldURL
  ]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function CreateField(props) {
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
    let activeCaseFormData=props.activeCaseFormData
    let userData=props.userData
    let activeCaseDetails=props.activeCaseDetails
    let formref = props.formRef
    let initialValues = props.initialValues
    let glucometerFieldMap = props.glucometerFieldMap
    let currentStage = props.currentStage
    let pageType = props.pageType
    let trackentityInstanceDetails = props.trackentityInstanceDetails
    const isHealthWorker = userBO?.userRoles?.find(
    (role) => role.name === "healthworker"
  );

  // if (!isHealthWorker) {
  //   //
  //   const isEncryptedAttribute = fieldData?.dataElement?.attributeValues?.find(
  //     (attr) => attr.attribute?.name === "IsEncrypted" && attr.value === "true"
  //   );
  //   const isMaskedAttribute = fieldData?.dataElement?.attributeValues?.find(
  //     (attr) => attr.attribute?.name === "isMaskable" && attr.value === "true"
  //   );
  //   if (isEncryptedAttribute) {
  //     return null;
  //   }
  //   if (isMaskedAttribute) {
  //     ismaskable = true;
  //   }
  // }
  try {
    if (dataElementGroup && dataElementGroup.length > 0) {
      let dEID = dataElementGroup.filter(
        (obj) =>
          obj.displayName == customfieldobj.symptomsDisplayName &&
          obj.description &&
          obj.description ==
            "Currently are you experiencing any of the following symptoms"
        //(obj) => obj.description && obj.description == "Currently are you experiencing any of the following symptoms"
      );
      if (dEID && dEID.length > 0) {
        symptomsReferralID = dEID[0].id;
      }
      //let dEID = dataElementGroup.find(obj => obj.description && obj.description == "Symptoms" && obj.displayName == fieldData.dataElement.displayName)
    }
  } catch (e) {}

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
                                    programBoDetails={programBoDetails}
                                    userBO={userBO}
                                    programData={programData}
                                    formref={formref}
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
                    formref={formref}
                    glucometerFieldMap={glucometerFieldMap}
                    activeCaseDetails={activeCaseDetails}
                    trackentityInstanceDetails={trackentityInstanceDetails}
                    currentStage={currentStage}
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
                    formref={formref}
                    pageType={pageType}
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
                    userData={userData}
                    programBoDetails={programBoDetails}
                    activeCaseFormData={activeCaseFormData}
                    activeCaseDetails={activeCaseDetails}

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
                    currentStage={currentStage}
                    formref= {formref}
                    customfieldobj={customfieldobj}
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

export default CreateField;
