import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { HideCheckboxOptions } from "../../assets/data/hideCheckboxOnCondition";
import { isEmpty, isString } from "../../helper/index";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import _ from "lodash";
import swal from "sweetalert";
import {
  Button,
  InputFieldFF,
  SingleSelectFieldFF,
  ReactFinalForm,
  hasValue,
  TextAreaFieldFF,
  composeValidators,
  dhis2Username,
  FieldGroupFF,
  CheckboxFieldFF,
  FileInputFieldFF,
} from "@dhis2/ui";

import {
  Radios,
  TimePicker,
  Switches,
  DatePicker,
  DateTimePicker,
} from "mui-rff";

import OUFieldConfig from "./OUFieldConfig";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

import { apiServices } from "../../services/apiServices";
import HideShowCondition from "../validation/HideShowConditionRegistration";
import AssignCondition from "../validation/AssignRegistration";

import Validator from "../validation/validator/Validator";

import Grid from "@material-ui/core/Grid";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import Geocode from "react-geocode";
import OUMapping from "../../assets/data/registerOU";
import { OnChange } from "react-final-form-listeners";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQrcode,
  faTimes,
  faFileUpload,
  faMap,
  faCamera,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import QrReader from "react-qr-reader";
import OfflineDb from "../../db";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";

import CloseIcon from "@material-ui/icons/Close";
import GoogleMaps from "../GoogleMap/GoogleMap";
import { useTranslation } from "react-i18next";
//import { Configuration } from '../../assets/data/config'
import { setLocationAction } from "../../redux/actions/action";
import moment from "moment";
import { useConfig } from "../../hooks/useConfig";
import { APP_LOCALE } from "../../assets/data/config";
import { format } from "date-fns";

import {
  getDateFormat,
  getValidationFieldID,
  shouldIncludeCustomFieldObj_,
  checkFieldCondition_dhis,
  getAutocompletionRequest,
  findAttributeIdsWithFlags,
  getKeyByValue,
  checkregistartiondate,
  maskText,
  getPhonecodevalidations,
} from "../../config/validationutils";
import imgUrl from "../../assets/images/imageUrl";
import { Delete } from "@material-ui/icons";
import RefreshIcon from "@mui/icons-material/Refresh";
import EtDatePicker from "mui-ethiopian-datepicker";
import { EthiopianDate } from "mui-ethiopian-datepicker";
import { convertToGC, toEthiopianDateString } from "gc-to-ethiopian-calendar";
import { EtLocalizationProvider } from "mui-ethiopian-datepicker";

const { Form, Field, FormSpy } = ReactFinalForm;

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
      obj.trackedEntityAttribute
        ? fieldId == obj.trackedEntityAttribute.id
        : undefined
    );

    if (filteringRuleWithField.length > 0) {
      switch (filteringRuleWithField[0].programRuleActionType) {
        case "HIDEFIELD":
          hideShow = HideShowCondition(
            rules,
            programRulesVariables,
            values,
            field
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
          // <AssignCondition fieldId={fieldId} rules={rules} programRulesVariables={programRulesVariables} values={values} field={field} filteringRuleWithField={filteringRuleWithField}/>
          break;

        // case 'SHOWERROR':

        //     programRuleActionType = ShowErrorRegistration(rules, programRulesVariables, values, field, fieldId, attribute)
        // break;
      }
    }
  });

  return {
    hideShow: hideShow,
    assign: assign,
  };
};

const getTranslatedLabels = (attribute) => {
  if (!attribute) {
    return;
  }
  if (localStorage.getItem("locale") == "en") {
    let label = attribute.translations.filter(
      (tanslation) =>
        tanslation.property == "NAME" &&
        tanslation.locale == localStorage.getItem("locale")
    );
    if (label.length > 0) {
      return label[0].value;
    } else {
      return attribute.formName
        ? attribute.formName
        : attribute.displayName
        ? attribute.displayName
        : attribute.description;
    }
  } else if (attribute.translations && attribute.translations.length > 0) {
    //debugger;
    let label = attribute.translations.filter(
      (tanslation) =>
        tanslation.property == "NAME" &&
        tanslation.locale == localStorage.getItem("locale")
    );
    if (label.length > 0) {
      return label[0].value;
    } else {
      return attribute.formName
        ? attribute.formName
        : attribute.displayName
        ? attribute.displayName
        : attribute.description;
    }
  }
  return attribute.formName
    ? attribute.formName
    : attribute.displayName
    ? attribute.displayName
    : attribute.description;
};

function InputFieldConfig(props) {
  const { t } = useTranslation();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let customfieldobj = props.customfieldobj;
  let customClassName = props.customClassName;
  let customProps = { className: customClassName };
  let programData = props.programData,
    activeCaseDetails = props.activeCaseDetails,
    linkContactFlag = props.linkContactFlag,
    values = props.values,
    Configuration = props.Configuration;
  let indexClient = props.indexClient;
  let userBO = props.userBO;
  let programZambia = false;
  let ismaskable = props.ismaskable;
  let availableContactOptions = props.availableContactOptions;

  const inputType = ismaskable ? "text" : "number";
  if (programData && programData.code && programData.code == "Zambia_Program") {
    programZambia = true;
  }

  let formref = props.formref;

  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const [fieldType, setFieldType] = useState(null);
  const [optionSet, setOptions] = useState(null);
  const [icons, setIcons] = useState(null);
  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [hideFieldAttr, setHideFieldAttr] = useState(false);
  //=========custom logic for UNDP==================
  const [PresentlyOnAntiTBMedicationId, setPresentlyOnAntiTBMedicationId] =
    useState(null);
  const [clientTypeID, setClientTypeID] = useState(null);
  const [verifiedFieldId, setVerifiedFieldId] = useState(null);
  const [templateType, setTemplateType] = useState(null);
  const [renderKey, setrenderKey] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const isDropdownAttribute =
    fieldData?.trackedEntityAttribute?.attributeValues?.find(
      (attr) =>
        attr.attribute?.name === "ShowInContactDropdown" &&
        attr.value === "true"
    );

  const addToCustomObjectContact =
    fieldData.trackedEntityAttribute.attributeValues?.find(
      (attr) => attr.attribute.name === "AddtoCustomObjectContact"
    );
  let formattedKey = addToCustomObjectContact?.value;

  if (addToCustomObjectContact) {
    customfieldobj[formattedKey] = fieldData.trackedEntityAttribute.id;
  }

  function getCustomVariableIds() {
    if (programData && programData.code) {
      setTemplateType(programData.code);
    }
    programData.programTrackedEntityAttributes.map((regField) => {
      if (
        regField.trackedEntityAttribute.displayName
          .trim()
          .toLocaleLowerCase() == "client type"
      ) {
        setClientTypeID(regField.trackedEntityAttribute.id);
      }
      if (
        regField.trackedEntityAttribute.displayName
          .trim()
          .toLocaleLowerCase() == "presently on anti-tb medication?"
      ) {
        setPresentlyOnAntiTBMedicationId(regField.trackedEntityAttribute.id);
      }
      if (
        regField.trackedEntityAttribute.displayName
          .trim()
          .toLocaleLowerCase() == "documents verified"
      ) {
        setVerifiedFieldId(regField.trackedEntityAttribute.id);
      }
    });
    if (
      fieldData.trackedEntityAttribute.attributeValues &&
      fieldData.trackedEntityAttribute.attributeValues.length > 0
    ) {
      fieldData.trackedEntityAttribute.attributeValues.map((val) => {
        if (val.attribute.displayName === "hideField" && val.value == "true") {
          setHideFieldAttr(true);
        }
      });
    }
  }
  const setClientTypeDropdwonValues = () => {
    if (templateType && templateType == "UNDP") {
      if (
        activeCaseDetails &&
        activeCaseDetails.data &&
        values[clientTypeID] &&
        values[PresentlyOnAntiTBMedicationId] == "YES"
      ) {
        values[clientTypeID] = Configuration.ltbiLinkVariables.index;
      } else if (
        values[PresentlyOnAntiTBMedicationId] != undefined &&
        values[PresentlyOnAntiTBMedicationId] == "YES"
      ) {
        values[clientTypeID] = Configuration.ltbiLinkVariables.index;
      } else if (
        linkContactFlag &&
        linkContactFlag.data &&
        linkContactFlag.data.enabled
      ) {
        values[clientTypeID] = Configuration.ltbiLinkVariables.contact;
      } /*else if(activeCaseDetails && activeCaseDetails.data && values[PresentlyOnAntiTBMedicationId] == 'NO' && values[clientTypeID] == Configuration.ltbiLinkVariables.contact){
                values[clientTypeID] = Configuration.ltbiLinkVariables.contact;
            }else if(activeCaseDetails && activeCaseDetails.data && values[PresentlyOnAntiTBMedicationId] == 'NO' && values[clientTypeID] == Configuration.ltbiLinkVariables.presumptivetb){
                values[clientTypeID] = Configuration.ltbiLinkVariables.presumptivetb;
            }
            else if(activeCaseDetails && activeCaseDetails.data && values[PresentlyOnAntiTBMedicationId] == undefined){
                //use default values coming for edit
            }*/ else if (
        activeCaseDetails &&
        activeCaseDetails.data &&
        values[clientTypeID] == Configuration.ltbiLinkVariables.contact
      ) {
        values[clientTypeID] = Configuration.ltbiLinkVariables.contact;
      } else if (
        activeCaseDetails &&
        activeCaseDetails.data &&
        values[clientTypeID] == Configuration.ltbiLinkVariables.presumptivetb
      ) {
        values[clientTypeID] = Configuration.ltbiLinkVariables.presumptivetb;
      } else if (
        values[clientTypeID] != Configuration.ltbiLinkVariables.contact
      ) {
        values[clientTypeID] = Configuration.ltbiLinkVariables.presumptivetb;
      } else if (
        activeCaseDetails &&
        activeCaseDetails.data &&
        values[verifiedFieldId] == undefined
      ) {
        //use default values coming for edit
      }
    }
  };
  //End
  const requiredPhoneCode = (value) =>
    fieldData.mandatory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;
  const minValue = (min) => (value) =>
    value && value.length >= min
      ? undefined
      : t("Characters should be greater than") + " " + min;
  const required = (value) =>
    fieldData.mandatory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;
  // const scriptCheck = value => (value && value != undefined && value != null && value != '' ? value.match(/<[^>]*>/g) != null ? t('Incorrect expression "< or >" added as input') : undefined : undefined)
  // const scriptCheck = value => {
  //     if (value && value != undefined && value != null && value != '') {
  //         if (value.match(/<[^>]*>/g) != null) {
  //             return t('Incorrect expression "< or >" added as input');
  //         } else if (!/^[a-zA-Z\s]+$/.test(value)) {
  //             return t('Input contains numbers or special characters');
  //         }
  //     }
  //     return undefined;
  // };
  const scriptCheck =
    APP_LOCALE === "PRODUCT"
      ? (value) => {
          if (value && value !== undefined && value !== null && value !== "") {
            if (value.match(/<[^>]*>/g) != null) {
              return t('Incorrect expression "< or >" added as input');
            }
            // else if (!/^[a-zA-Z\s]+$/.test(value)) {
            //     return t('Input contains numbers or special characters');
            // }
          }
          return undefined;
        }
      : (value) =>
          value && value !== undefined && value !== null && value !== ""
            ? value.match(/<[^>]*>/g) != null
              ? t('Incorrect expression "< or >" added as input')
              : undefined
            : undefined;

  const alphaOnlyCheck =
    APP_LOCALE === "PRODUCT"
      ? (value) => {
          if (value && value !== undefined && value !== null && value !== "") {
            // Check if input contains any non-alphabetic characters
            if (!/^[a-zA-Z\s]+$/.test(value)) {
              return t("Input contains numbers or special characters");
            }
          }
          return undefined;
        }
      : (value) => {
          if (value && value !== undefined && value !== null && value !== "") {
            // Check if input contains any non-alphabetic characters
            if (!/^[a-zA-Z\s]+$/.test(value)) {
              return t("Input contains numbers or special characters");
            }
          }
          return undefined;
        };

  // const composeValidators =
  //   (...validators) =>
  //   (value) =>
  //     validators.reduce(
  //       (error, validator) => error || validator(value),
  //       undefined
  //     );
  const composeValidators = (...validators) => (value) =>
  validators
    .filter((v) => typeof v === "function") // remove undefined
    .reduce((error, validator) => error || validator(value), undefined);

  let maxLengthValidation = 10;
  // if (APP_LOCALE === "CC002") {
  //   maxLengthValidation = 9;
  // }
  const minCNICLength = (min) =>  (value) => {
  if (!value) return undefined;

  // remove dashes for raw digit validation
  const digitsOnly = value.replace(/\D/g, '');

  return digitsOnly.length === min
    ? undefined
    : t("CNIC/B-Form must contain exactly "+min+" digits");
};

  const maxLength = (max) => (value) =>
    value
      ? isNaN(value) || value.length > max
        ? t("Should be less than") + " " + max
        : undefined
      : undefined;
  const numberFormat = (value) =>
    isNaN(value) && value ? t(`Incorrect format`) : undefined;
  function checkHideOptionsFields(
    attributes,
    programRules,
    programRulesVariables,
    values
  ) {
    const fieldId = attributes.trackedEntityAttribute.id;
    let option = [];
    let filteringRuleWithField = null;

    programRules.map((rules) => {
      filteringRuleWithField = rules.programRuleActions.filter((obj) =>
        obj.trackedEntityAttribute
          ? fieldId == obj.trackedEntityAttribute.id
          : undefined
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
                      attributes.trackedEntityAttribute.optionSet.options.map(
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
                      attributes.trackedEntityAttribute.optionSet.options.map(
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
                      attributes.trackedEntityAttribute.optionSet.options.map(
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
                      attributes.trackedEntityAttribute.optionSet.options.map(
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
                      attributes.trackedEntityAttribute.optionSet.options.map(
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
      return attributes.trackedEntityAttribute.optionSet.options;
    }
  }

  const findKeyByValue = (obj, value) => {
    for (const key in obj) {
      if (obj[key] === value) {
        return key;
      }
    }
    return null; // Return null if value not found
  };

  function findFieldType() {
    const trackedEntityAttribute = fieldData.trackedEntityAttribute;
    if (trackedEntityAttribute.optionSet != undefined) {
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
    const trackedEntityAttribute = fieldData.trackedEntityAttribute;
    if (trackedEntityAttribute.optionSet != undefined) {
      //if (trackedEntityAttribute.id == 'YMCAMEegbRM') {
      if (trackedEntityAttribute.id == customfieldobj.nationality) {
        let defaultNationalityValue = "";
        if (Array.isArray(trackedEntityAttribute.attributeValues)) {
          const defaultNationalityAttr =
            trackedEntityAttribute.attributeValues.find(
              (attrVal) =>
                attrVal.attribute?.displayName === "defaultNationality"
            );
          if (defaultNationalityAttr) {
            defaultNationalityValue = defaultNationalityAttr.value;
          }
        }
        if (!values?.[customfieldobj.nationality]) {
          fieldData.trackedEntityAttribute.optionSet.options.find((o) => {
            if (o.code === defaultNationalityValue) {
              values[customfieldobj.nationality] = o.code;
            }
          });
        }
      }

      if (APP_LOCALE === "CC002") {
        if (trackedEntityAttribute.id == "xDijebCpDIu") {
          const currentValue = values["xDijebCpDIu"];
          const patientStatus = values[customfieldobj.patientStatus];
          if (!patientStatus && !currentValue) {
            const cameroonOption =
              fieldData.trackedEntityAttribute.optionSet.options.find(
                (o) => o.code === "Cameroonian"
              );
            if (cameroonOption) {
              values["xDijebCpDIu"] = cameroonOption.code;
            }
          }
        }
      }

      if(APP_LOCALE == "CC003"){
        console.log("customfieldobj.raceEthnicityId ",customfieldobj.raceEthnicityId,values[customfieldobj.raceEthnicityId])
        if(customfieldobj.raceEthnicityId && trackedEntityAttribute.id == customfieldobj.raceEthnicityId){
            if(!values[customfieldobj.raceEthnicityId]){
                values[customfieldobj.raceEthnicityId] = "Asian"
            }
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

      if (trackedEntityAttribute.id == customfieldobj.hivStatusId) {
        if (
          values &&
          values[clientTypeID] &&
          values[clientTypeID] == "Person living with HIV"
        ) {
          fieldData.trackedEntityAttribute.optionSet.options.find((o) => {
            if (o.code == "Positive") {
              values[customfieldobj.hivStatusId] = o.code;
            }
          });
        }
      }
    }
    if (output.length > 0) {
      setOptions(output);
    }
  }

  function getIcons() {
    let promises = [];
    const trackedEntityAttribute = fieldData.trackedEntityAttribute;
    if (navigator.onLine) {
      if (trackedEntityAttribute.optionSet != undefined) {
        trackedEntityAttribute.optionSet.options.forEach((options) => {
          if (options.style != undefined) {
            const getIconApi = "icons/" + options.style.icon + "/icon.svg";
            promises.push(apiServices.getAPI(getIconApi));
          } else {
            promises.push({});
            // promises.push(Promise.resolve({}));
          }
        });

        Promise.all(promises).then((responses) => {
          const icons = responses.map((response) => response.data);

          if (icons.length > 0) {
            setIcons(icons);
          } else {
            setIcons([]);
          }
          // if (icons.length > 0 && icons.every(icon => icon !== undefined && icon !== null)) {
          //     setIcons(icons);
          // } else {
          //     //setIcons([]);
          // }
        });
        // Promise.all(promises).then((responses) => {
        //     const icons = responses.map((response) => {
        //         if (response && response.data) {
        //             return response.data;
        //         }
        //         return {}; // Fallback to an empty object if the data is undefined or null
        //     });

        //     const validIcons = icons.filter(icon => icon && Object.keys(icon).length > 0);
        //     setIcons(validIcons.length > 0 ? validIcons : []);
        // }).catch((error) => {
        //     console.error("Error fetching icons:", error);
        //     setIcons([]);
        // });
      } else {
        setIcons([]);
      }
    } else {
      setIcons([]);
    }
  }

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
    );
    setValidationResult(validationResult);
  }

  const getDefaultCountryCode = (arr) => {
    // Check if the array is null, undefined, or not an array
    if (!Array.isArray(arr)) {
      return null;
    }

    // Iterate through the array to find the entry with name 'countryCode'
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].attribute && arr[i].attribute.description === "countryCode") {
        return arr[i].value;
      }
    }

    // Return null if no matching entry is found
    return null;
  };

  useEffect(() => {
    getIcons();
    getCustomVariableIds();
  }, []);
  useEffect(() => {
    if (clientTypeID != null) {
      setClientTypeDropdwonValues();
    }
  });
  useEffect(() => {
    if (Array.isArray(icons)) {
      findFieldType();
      fetchOption();
      fetchValidation();
    }
  }, [icons, values, localStorage.getItem("locale")]);

  const getClassForNumber = (fieldData, combineFeild) => {
    const isPrimaryContactAttribute =
      fieldData?.trackedEntityAttribute?.attributeValues?.find(
        (attr) =>
          attr.attribute?.name === "PrimaryContactAttribute" &&
          attr.value === "true"
      );
    // Check if there is a combineFeild and if it has a value i.e prefix-number combination
    if (combineFeild && combineFeild.length > 0) {
      const attributeKey = findKeyByValue(
        customfieldobj,
        fieldData.trackedEntityAttribute.id
      );
      if (
        values[combineFeild[0]?.value] ||
        values[fieldData?.trackedEntityAttribute?.id] ||
        isPrimaryContactAttribute?.value == "true"
      ) {
        return attributeKey;
      } else {
        return attributeKey + " hide";
      }
    }
  };

  function clickOnField(fieldId) {
    // Find the element by ID
    const fieldElement = document.getElementById(fieldId);
    // If the element exists, click on it
    if (fieldElement) {
      // Create and dispatch a click event
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      fieldElement.dispatchEvent(clickEvent);

      // Optional: Focus on the element as well
      fieldElement.focus();
    } else {
      console.warn(`Field with ID ${fieldId} not found`);
    }
  }

  useEffect(() => {
    if (validationResult != null && fieldType != null) {
      try {
        if (!navigator.onLine && !values[customfieldobj.addressLocationId]) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                values[customfieldobj.addressLocationId] =
                  latitude + "," + longitude;
              },
              (error) => {},
              { timeout: 10000 }
            );
          }
        }
      } catch (e) {}

      if (
        APP_LOCALE == "CC004" &&
        fieldData.trackedEntityAttribute.id == customfieldobj.fathersName && 
        values[customfieldobj.middleName]
      ) {
        values[customfieldobj.fathersName] = values[customfieldobj.middleName];
        setrenderKey(renderKey + 1);
      }

      if (
        fieldData.trackedEntityAttribute.id == clientTypeID ||
        fieldData.trackedEntityAttribute.id == PresentlyOnAntiTBMedicationId
      ) {
        customProps = {
          ...customProps,
          key: Math.random() * 9999,
        };
      }
      if (
        fieldData.trackedEntityAttribute.attributeValues.length > 0 &&
        fieldData.trackedEntityAttribute.attributeValues.some(
          (attr) =>
            attr.attribute.displayName === "IsName" && attr.value === "true"
        )
      ) {
        customProps = {
          ...customProps,
          validate: composeValidators(required, alphaOnlyCheck),
        };
      }

      if (
        fieldData.trackedEntityAttribute.id == customfieldobj.regRegisteredById
      ) {
        if (userBO && userBO.userCredentials) {
          values[fieldData.trackedEntityAttribute.id] =
            userBO.userCredentials.username;
        }
        validationResult.hideShow = false;
      }

      // Get all values from availableContactOptions
      const contactOptionValues = availableContactOptions.map(
        (option) => option.value
      );
      contactOptionValues.push("regPhoneNumberCodeId");

      const fieldIdsArray = contactOptionValues
        .map((optionValue) => {
          // Get the corresponding value from customfieldobj if it exists
          return customfieldobj[optionValue] || null;
        })
        .filter((value) => value !== null); // Remove any null values (in case some don't exist in customfieldobj)
      // Check if fieldData.trackedEntityAttribute.id matches any of the values in availableContactOptions
      if (fieldIdsArray.includes(fieldData.trackedEntityAttribute.id)) {
        customProps = {
          ...customProps,
          className: "hide",
        };
      }

      let fieldValue = values[fieldData.trackedEntityAttribute.id];
      let displayValue = fieldValue;

      if (inputType === "text" && fieldValue && ismaskable) {
        displayValue = maskText(fieldValue);
      }

      if (fieldData.trackedEntityAttribute.id == "nT1T679BjGI") {
        // values[customfieldobj.typeOfMedicationRoutineVisits] = programBoDetails
        if (!values["nT1T679BjGI"]) {
          values["nT1T679BjGI"] = userBO.organisationUnits[0].name;
        }
      }

      if (fieldType == "text") {
        const formatWithDashes = (value) => {
          if (!value) return value;
          // Remove all non-numeric characters
          let digitsOnly = value.replace(/\D/g, '').substring(0, 13);

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
          //console.log("formatted ",formatted)
          return formatted;
        };

        setFieldStructure(
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            className={
              validationResult.hideShow == true && !hideFieldAttr ? "" : "hide"
            }
          >
            <Field
              name={fieldData.trackedEntityAttribute.id}
              label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
              type={APP_LOCALE== "CC013" && customfieldobj.nationalIdNumber && fieldData.trackedEntityAttribute.id === customfieldobj.nationalIdNumber ?  "number" : "text"}
              component={InputFieldFF}
              key={fieldData.trackedEntityAttribute.id}
              required={
                fieldData.mandatory && validationResult.hideShow == true
                  ? true
                  : false
              }
              validate={APP_LOCALE== "CC005" && fieldData.trackedEntityAttribute.id === customfieldobj.nationalIdNumber ? composeValidators(
                required, 
                scriptCheck,
                minCNICLength(13)
              ) : composeValidators(
                required, 
                scriptCheck)} //fieldData.mandatory && validationResult.hideShow == true ? hasValue : false
              // value=''
              format={value => 
                  {
                      if (APP_LOCALE== "CC005" && fieldData.trackedEntityAttribute.id === customfieldobj.nationalIdNumber && value) {
                          return formatWithDashes(value);
                      }
                      return value; // Normal behavior for other fields
                    }}
              //parse={(value) => value}
              parse={(value) => {
                       if (
                         APP_LOCALE === "CC005" &&
                         fieldData.trackedEntityAttribute.id === customfieldobj.nationalIdNumber
                        ) {
                             return formatWithDashes(value);   // ✅ FIX
                         }
                      return value;
                    }}
              className={"customClassName"}
              {...customProps}
            />
          </Grid>
        );
      } else if (fieldType == "radio") {
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
                id={fieldData.trackedEntityAttribute.id}
                label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                name={fieldData.trackedEntityAttribute.id}
                required={
                  fieldData.mandatory && validationResult.hideShow == true
                    ? true
                    : false
                }
                data={optionSet != null ? optionSet : []}
                className={customClassName}
                // defaultValue={defaultValue}
              />
            </Grid>
            <Grid item xs={1}>
              <Field name={fieldData.trackedEntityAttribute.id}>
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
        const defaultValue = getDefaultCountryCode(programData.attributeValues);
        try {
          if (values[fieldData.trackedEntityAttribute.id]) {
            let isValueExist = true;
            isValueExist = optionSet.find(
              (obj) => obj.value == values[fieldData.trackedEntityAttribute.id]
            );
            if (isValueExist == undefined) {
              delete values[fieldData.trackedEntityAttribute.id];
            }
          }
        } catch (e) {}
        // custom logic to find the feild and prefix that will be shown together
        const combineFeild =
          fieldData.trackedEntityAttribute.attributeValues.filter(
            (attr) => attr.attribute && attr.attribute.name == "isPrefixEnabled"
          );
        const feildDataSuffix =
          props.programData.programTrackedEntityAttributes.filter(
            (feildDataSuffix) => {
              // return feildDataSuffix.trackedEntityAttribute.id == combineFeild[0]?.value
              // return feildDataSuffix.trackedEntityAttribute.description == combineFeild[0]?.value
              return (
                feildDataSuffix.trackedEntityAttribute.id ==
                  combineFeild[0]?.value ||
                feildDataSuffix.trackedEntityAttribute.description ==
                  combineFeild[0]?.value
              );
            }
          );

        if (validationResult.hideShow == true) {
          if(APP_LOCALE === "CC005"){
          if(fieldData.trackedEntityAttribute.id === customfieldobj.religion){
            if (!values[fieldData.trackedEntityAttribute.id]
          ) {
            values[fieldData.trackedEntityAttribute.id] = "Islam";
          }

          }
        }
          if (
            !values[customfieldobj.regPhoneNumberCodeId] &&
            defaultValue != null
          ) {
            values[customfieldobj.regPhoneNumberCodeId] = defaultValue;
          }
          let prefixClassName = getClassForNumber(fieldData, combineFeild);
          let contactClassName = findKeyByValue(
            customfieldobj,
            combineFeild[0]?.value
          );
          setFieldStructure(
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              className={prefixClassName != undefined ? prefixClassName : ""}
            >
              {/* Logic for contact information */}
              <Field name="forceRenderField" component="input" type="hidden" />
              <>
                {combineFeild?.length > 0 && combineFeild[0]?.value ? (
                  <>
                    <Field
                      //   disabled
                      label={t("Prefix")}
                      // label={fieldData.trackedEntityAttribute.description}
                      name={fieldData.trackedEntityAttribute.id}
                      className="disno"
                      type="dropdown"
                      component={SingleSelectFieldFF}
                      key={fieldData.trackedEntityAttribute.id}
                      options={optionSet != null ? optionSet : []}
                      // initialValue={defaultValue}
                      required={
                        fieldData.mandatory && validationResult.hideShow == true
                          ? true
                          : false
                      }
                      validate={composeValidators(requiredPhoneCode)}
                      customClassName={customClassName}
                      disabled={
                        fieldData.trackedEntityAttribute.attributeValues &&
                        fieldData.trackedEntityAttribute.attributeValues
                          .length > 0
                          ? fieldData.trackedEntityAttribute.attributeValues[0]
                              .attribute.name == "isDisabled" &&
                            fieldData.trackedEntityAttribute.attributeValues[0]
                              .value == "true"
                            ? true
                            : false
                          : false
                      }
                    />

                    <Field
                      name={feildDataSuffix[0]?.trackedEntityAttribute.id}
                      label={getTranslatedLabels(
                        feildDataSuffix[0]?.trackedEntityAttribute
                      )}
                      // label={feildDataSuffix[0]?.trackedEntityAttribute?.displayName}
                      type={"number"}
                      component={InputFieldFF}
                      key={feildDataSuffix[0]?.trackedEntityAttribute.id}
                      required={
                        fieldData.mandatory && validationResult.hideShow == true
                          ? true
                          : false
                      }
                      validate={composeValidators(
                        required,
                        numberFormat,
                        //maxLength(maxLengthValidation)
                      )}
                      className={customClassName}
                    />
                    {/* If it's a dropdown attribute then show the delete icon else show the plusicon */}
                    {isDropdownAttribute?.value == "true" ? (
                      <>
                        <IconButton
                          onClick={(e) => {
                            // Check if prefixClassName contains 'hide' and trim it if needed
                            let classNameToUse = prefixClassName;
                            if (prefixClassName.includes("hide")) {
                              classNameToUse = prefixClassName
                                .replace("hide", "")
                                .trim();
                            }
                            const elements =
                              document.getElementsByClassName(classNameToUse);
                            // const elements = document.getElementsByClassName(prefixClassName);
                            for (let i = 0; i < elements.length; i++) {
                              elements[i].classList.add("hide");
                            }
                            delete values[customfieldobj[prefixClassName]];
                            delete values[customfieldobj[contactClassName]];
                            let options = _.cloneDeep(selectedOptions);
                            setSelectedOptions(
                              options.filter((item) => item !== prefixClassName)
                            );
                          }}
                          className="deleteIcon"
                          style={{
                            height: "22px",
                            cursor: "pointer",
                            marginTop: "45px",
                            marginRight: "3px",
                            padding: "0px",
                          }}
                          aria-label="close"
                        >
                          <Delete />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <img
                          onClick={(e) => {
                            const filteredOptions =
                              availableContactOptions.filter((option) => {
                                // Get the element with the matching class
                                const element = document.querySelector(
                                  "." + option.value
                                );

                                // Keep the option if:
                                // 1. The element doesn't exist at all (return true to keep it in the array)
                                // 2. The element exists but also has the "hide" class (return true to keep it in the array)
                                if (!element) {
                                  return true; // Element doesn't exist, keep it in the array
                                } else {
                                  // Check if the element has the "hide" class
                                  return element.classList.contains("hide");
                                }
                              });
                            availableContactOptions = filteredOptions;

                            if (availableContactOptions.length === 0) {
                              swal({
                                title: t("No more contact details to be added"),
                                icon: "warning",
                                button: "OK",
                                className: "custom-swalwarning",
                              });
                              return;
                            }

                            swal({
                              title: t("Select type of phone number"),
                              text: "",
                              content: {
                                element: "select",
                                attributes: {
                                  id: "swal-dropdown",
                                  innerHTML:
                                    `
                                                                    <option value="" disabled selected>` +
                                    t("Select an option") +
                                    `</option>
                                                                    ${availableContactOptions
                                                                      .map(
                                                                        (
                                                                          option
                                                                        ) =>
                                                                          `<option value="${
                                                                            option.value
                                                                          }">${t(
                                                                            option.label
                                                                          )}</option>`
                                                                      )
                                                                      .join("")}
                                                                `,
                                },
                              },
                              className: "custom-swal",
                              buttons: {
                                cancel: t("Cancel"),
                                confirm: {
                                  text: t("Submit"),
                                  closeModal: false,
                                },
                              },
                            }).then((value) => {
                              if (value != true) return;
                              const selectedValue =
                                document.getElementById("swal-dropdown").value;

                              if (!selectedValue) return;
                              // Set default value based on selection using object lookup instead of multiple if statements
                              const fieldMapping = {
                                parentContactNumberCodeId:
                                  customfieldobj.parentContactNumberCodeId,
                                patientContactNumberCodeId:
                                  customfieldobj.patientContactNumberCodeId,
                                additionalPatientCodeId:
                                  customfieldobj.additionalPatientCodeId,
                                alternateContactNumberCodeId:
                                  customfieldobj.alternateContactNumberCodeId,
                                testPrefix: customfieldobj.testContactNumber,
                              };
                              const fieldMappingClick = {
                                parentContactNumberCodeId:
                                  customfieldobj.parentContactNumber,
                                patientContactNumberCodeId:
                                  customfieldobj.regPhoneNumberId,
                                additionalPatientCodeId:
                                  customfieldobj.additionalPatientNumber,
                                testPrefix: customfieldobj.testPrefix,
                                alternateContactNumberCodeId:
                                  customfieldobj.additionalContactNumber,
                              };
                              // Set the value if there's a mapping
                              if (fieldMapping[selectedValue]) {
                                const fieldId = fieldMapping[selectedValue];
                                const fieldIdClick =
                                  fieldMappingClick[selectedValue];
                                values[fieldId] = defaultValue;
                                setTimeout(() => {
                                  clickOnField(fieldIdClick);
                                }, 0);
                              }
                              setSelectedOptions((prevOptions) => [
                                ...prevOptions,
                                selectedValue,
                              ]); // Store selected option
                              setrenderKey(Math.random());

                              const elements =
                                document.getElementsByClassName(selectedValue);
                              for (let i = 0; i < elements.length; i++) {
                                elements[i].classList.remove("hide"); // Remove class
                              }
                              swal.close();
                            });
                          }}
                          style={{
                            height: "22px",
                            cursor: "pointer",
                            marginTop: "45px",
                            marginRight: "3px",
                          }}
                          src={imgUrl.plusIcon}
                          className="plusContactIcon"
                        />
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
              {/* Logic for the non-contact dropdown attributes */}

              <Field
                id={fieldData.trackedEntityAttribute.id}
                name={fieldData.trackedEntityAttribute.id}
                label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                component={SingleSelectFieldFF}
                key={fieldData.trackedEntityAttribute.id}
                // validate={
                //   fieldData.mandatory && validationResult.hideShow == true
                //     ? hasValue
                //     : false
                // }
                validate={
                  fieldData.mandatory && validationResult.hideShow === true
                    ? (value) => (value ? undefined : t("Required"))
                    : undefined
                }
                required={
                  fieldData.mandatory && validationResult.hideShow == true
                    ? true
                    : false
                }
                options={[
                  { label: t("Please Select"), value: "" },
                  ...(optionSet != null ? optionSet : []),
                ]}
                disabled={
                  fieldData.trackedEntityAttribute.attributeValues &&
                  fieldData.trackedEntityAttribute.attributeValues.length > 0
                    ? fieldData.trackedEntityAttribute.attributeValues[0]
                        .attribute.name == "isDisabled" &&
                      fieldData.trackedEntityAttribute.attributeValues[0]
                        .value == "true"
                      ? true
                      : false
                    : false
                }
                className={"disno"}
                {...customProps}
              />
            </Grid>
          );
        }
        // Logic for hiding the fields by adding hide class to the field
        else {
          setFieldStructure(
            <Grid item xs={12} sm={12} md={12} className={"hide"}>
              <Field
                name={fieldData.trackedEntityAttribute.id}
                label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                type={"text"}
                component={InputFieldFF}
                key={fieldData.trackedEntityAttribute.id}
                required={
                  fieldData.mandatory && validationResult.hideShow == true
                    ? true
                    : false
                }
                options={optionSet != null ? optionSet : []}
                disabled={
                  fieldData.trackedEntityAttribute.attributeValues &&
                  fieldData.trackedEntityAttribute.attributeValues.length > 0
                    ? fieldData.trackedEntityAttribute.attributeValues[0]
                        .attribute.name == "isDisabled"
                      ? true
                      : false
                    : false
                }
                //onChange={() => onDropdownOptionChange}
                validate={composeValidators(required, scriptCheck)} //fieldData.mandatory && validationResult.hideShow == true ? hasValue : false
                className={customClassName}
                value=""
              />
            </Grid>
          );
        }
      }
    }
  },[
    renderKey,
    fieldType,
    optionSet,
    selectedOptions,
    validationResult,
    localStorage.getItem("locale"),
  ]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

// function DateFieldConfig(props) {
//     let fieldData = props.fieldData
//     let programRules = props.programRules
//     let programRulesVariables = props.programRulesVariables
//     let values = props.values
//     let customClassName = props.customClassName
//     let customfieldobj = props.customfieldobj

//     let showYear = fieldData.trackedEntityAttribute.attributeValues.length > 0 && fieldData.trackedEntityAttribute.attributeValues[0].attribute.name == "showyear" ? true : false
//     const [fieldStructure, setFieldStructure] = useState(null)
//     const [selectedDate, setDate] = useState(new Date());
//     const [validationResult, setValidationResult] = useState(null)

//     function fetchValidation() {
//         const validationResult = Validator(fieldData.trackedEntityAttribute.id, fieldData, values, programRules, programRulesVariables)
//         setValidationResult(validationResult)
//     }

//     useEffect(() => {
//         fetchValidation()
//     }, [values])

//     useEffect(() => {
//         if (validationResult != null) {
//             try {
//                 if (fieldData.mandatory && !values[fieldData.trackedEntityAttribute.id]) {
//                     values[fieldData.trackedEntityAttribute.id] = selectedDate
//                 }

//                 if (values[fieldData.trackedEntityAttribute.id]) {
//                     values[fieldData.trackedEntityAttribute.id] = moment(values[fieldData.trackedEntityAttribute.id]).format('YYYY-MM-DD')
//                 }
//             } catch (e) {
//             }
//             setFieldStructure(
//                 <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
//                     <DatePicker

//                         disabled={showYear ? true : false}
//                         label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
//                         name={fieldData.trackedEntityAttribute.id}
//                         required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
//                         dateFunsUtils={DateFnsUtils}
//                         // value={values[fieldData.trackedEntityAttribute.id]}
//                         // value={fieldData.mandatory?values[fieldData.trackedEntityAttribute.id] == undefined ? selectedDate : values[fieldData.trackedEntityAttribute.id]:values[fieldData.trackedEntityAttribute.id]}
//                         margin="normal"
//                         variant="inline"
//                         format={showYear == true ? "yyyy" : "yyyy-MM-dd"}
//                         validate={fieldData.mandatory && validationResult.hideShow == true ? hasValue : false}
//                         disableFuture={fieldData.allowFutureDate ? fieldData.allowFutureDate : false}
//                         className={customClassName}
//                     />
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

function DateFieldConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let customfieldobj = props.customfieldobj;
  let programData = props.programData;
  let ismaskable = props.ismaskable;
  const programSections = programData.programSections;
  let formref = props.formref;

  let showYear =
    fieldData.trackedEntityAttribute.attributeValues.length > 0 &&
    fieldData.trackedEntityAttribute.attributeValues[0].attribute.name ==
      "showyear"
      ? true
      : false;
  const [fieldStructure, setFieldStructure] = useState(null);
  const [selectedDate, setDate] = useState(new Date());
  //const [selectedDate, setDate] = useState(null);
  const [selectedDateethiopia, setDateEthiopia] = useState(null); //For Ethiopia
  const [validationResult, setValidationResult] = useState(null);
  const { t } = useTranslation();
  const config = useConfig();

  const [validationFieldID, setValidationFieldID] = useState(null);
  const [dateformat, setDateFormat] = useState(null);
  const [condition, setCondition] = useState(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (APP_LOCALE == "CC004") {
      if (values[fieldData.trackedEntityAttribute.id]) {
        const storedDate = values[fieldData.trackedEntityAttribute.id]; // Example: "2025-01-23"
        const [year, month, day] = storedDate.split("-").map(Number);

        // Convert Gregorian to Ethiopian for display purposes
        const ethiopianDate = toEthiopianDateString(
          new Date(year, month - 1, day)
        );

        // Assuming Ethiopian date is in the format "Day Month Year"
        setDateEthiopia(new Date(year, month - 1, day));
      }
    }
  }, [values[fieldData.trackedEntityAttribute.id]]);

  useEffect(() => {
    const configRaw = localStorage.getItem("appConfign");
    if (configRaw) {
      // Ensure all dependencies are loaded
      const config = JSON.parse(configRaw);
      const fetchedValidationFieldID = getValidationFieldID(
        config,
        "createfield"
      );
      const fetchedDateFormat = getDateFormat("dateformat");
      setValidationFieldID(fetchedValidationFieldID);
      setDateFormat(fetchedDateFormat);
    }
  }, []);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    const dataFormat1 = getDateFormat("dateformat");
    //Code needs to be validated , throws error for dobID

    // let regFieldNew = regField.trackedEntityAttribute.attributeValues.filter((key) => key.attribute.name === "regDate" && key.value == 'true')
    // if(fieldData.trackedEntityAttribute.id == customfieldobj.dobID)
    //     {
    //         fieldData.allowFutureDate = false
    //     }
    // if (customfieldobj.dobID == fieldData.trackedEntityAttribute.id && values[customfieldobj.registrationDate])
    //     {
    //         if(values[customfieldobj.dobID] && (new Date(values[customfieldobj.dobID]) > new Date(values[customfieldobj.registrationDate])))
    //             {
    //              swal({ title: t("Date of birth cannot be greater than the date of registration"), text: "", icon: "warning", button: t("Close"),

    //              }).then( ); values[customfieldobj.dobID] = ''
    //             }

    //     }

    if (validationResult != null) {
      const attributeIds = findAttributeIdsWithFlags(programSections);

      const keyNamedobId = getKeyByValue(customfieldobj, attributeIds.dobId);

      const keyNameregdate = getKeyByValue(
        customfieldobj,
        attributeIds.regDate
      );

      const valuedob = values[customfieldobj[keyNamedobId]];

      const valueregdate = values[customfieldobj[keyNameregdate]];

      if (
        attributeIds.dobId == fieldData.trackedEntityAttribute.id &&
        valuedob &&
        valueregdate
      ) {
        if (valuedob && new Date(valuedob) > new Date(valueregdate)) {
          swal({
            title: t(
              "Date of birth cannot be greater than the date of registration"
            ),
            text: "",
            icon: "warning",
            button: t("Close"),
          }).then();
          values[customfieldobj[keyNamedobId]] = "";
        }
      }

      try {
        // const defaultdateflag= sessionStorage.getItem('defaultdateflag')
        const defaultDateFlagKey = `defaultdateflag_${fieldData.trackedEntityAttribute.id}`;
        const defaultdateflag = sessionStorage.getItem(defaultDateFlagKey);
        if (defaultdateflag === null) {
          const shouldSetDefaultDate = checkFieldCondition_dhis(
            config,
            "createfield",
            values,
            customfieldobj,
            fieldData
          );

          if (shouldSetDefaultDate) {
            if (values[fieldData.trackedEntityAttribute.id]) {
            } else {
              if (APP_LOCALE == "CC004") {
                values[fieldData.trackedEntityAttribute.id] =
                  selectedDateethiopia;
              } else {
                values[fieldData.trackedEntityAttribute.id] = selectedDate;
              }
              // sessionStorage.setItem('defaultdateflag', "true");
              sessionStorage.setItem(defaultDateFlagKey, "true");
            }
          } else {
          }
        } else if (defaultdateflag === "true") {
          const shouldSetDefaultDate_ = checkFieldCondition_dhis(
            config,
            "createfield",
            values,
            customfieldobj,
            fieldData
          );

          if (shouldSetDefaultDate_) {
            if (values[fieldData.trackedEntityAttribute.id]) {
            } else {
              if (APP_LOCALE == "CC004") {
                values[fieldData.trackedEntityAttribute.id] =
                  selectedDateethiopia;
              } else {
                values[fieldData.trackedEntityAttribute.id] = selectedDate;
              }
            }
          }
        }

        const isregDate = checkregistartiondate(
          config,
          "createfield",
          values,
          customfieldobj,
          fieldData
        );

        if (isregDate) {
          fieldData.allowFutureDate = false;
        } else {
        }

        if (APP_LOCALE !== "CC004") {
          if (values[fieldData.trackedEntityAttribute.id]) {
            values[fieldData.trackedEntityAttribute.id] = moment(
              values[fieldData.trackedEntityAttribute.id]
            ).format("YYYY-MM-DD");
          }
        }
      } catch (e) {}

      let displayValue;
      let fieldValue = values[fieldData.trackedEntityAttribute.id];
      if (ismaskable && fieldValue) {
        // const formattedValue = moment(fieldValue).format(dataFormat1); // Use dataFormat1 to format the date

        const formattedValue = format(new Date(fieldValue), dataFormat1);

        displayValue = maskText(formattedValue);
      }
      //         setFieldStructure(
      //             <Grid item xs={12} sm={12} md={12} className={validationResult.hideShow == true ? '' : 'hide'}>
      //                 {!ismaskable ? (
      //                     <DatePicker

      //                         disabled={showYear ? true : false}
      //                         label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
      //                         name={fieldData.trackedEntityAttribute.id}
      //                         required={fieldData.mandatory && validationResult.hideShow == true ? true : false}
      //                         dateFunsUtils={DateFnsUtils}
      //                         margin="normal"
      //                         variant="inline"
      //                         format={showYear == true ? "yyyy" : dataFormat1}
      //                         validate={fieldData.mandatory && validationResult.hideShow == true ? hasValue : false}
      //                         // disableFuture={fieldData.allowFutureDate ? fieldData.allowFutureDate : false}
      //                         disableFuture={fieldData.allowFutureDate != false ? fieldData.allowFutureDate : true}
      //                         className={customClassName}
      //                     />
      //                 //     <EtDatePicker
      //                 // label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
      //                 // name={fieldData.trackedEntityAttribute.id}
      //                 // className={customClassName}
      //                 // locale="am-ET" // Ethiopian calendar locale
      //                 // format="MMM dd/yyyy"
      //                 // value={selectedDate || ''}
      //                 // onChange={(selectedDate) => {

      //                 //     if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      //                 //       setDate(selectedDate);

      //                 //       // Store in YYYY-MM-DD format
      //                 //     //   values[fieldData.trackedEntityAttribute.id] = selectedDate.toISOString().split('T')[0];

      //                 //     const year = selectedDate.getFullYear();
      //                 //     const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
      //                 //     const day = String(selectedDate.getDate()).padStart(2, '0'); // Ensure two-digit day

      //                 //     values[fieldData.trackedEntityAttribute.id] = `${year}-${month}-${day}`;
      //                 //       } else {
      //                 //       console.error("Invalid date received:", selectedDate);
      //                 //     }
      //                 //   }}/>
      //                 ) : (
      //                     <Field
      //                         disabled
      //                         name={fieldData.trackedEntityAttribute.id}
      //                         type='text'
      //                         component={InputFieldFF}
      //                         key={fieldData.trackedEntityAttribute.id}
      //                         label={getTranslatedLabels(fieldData.trackedEntityAttribute)}

      //                         format={value => displayValue} // Here displayValue should already have the correct masking logic applied
      //                         parse={value => value}
      //                         className={customClassName}
      //                     />

      //                 )}
      //             </Grid>
      //         )
      //     }

      // }, [validationResult, localStorage.getItem("locale")])

      let content;

      if (!ismaskable) {
        const requiredDate = (value) => {
          if (!value || value === "" || value === null || value === undefined) {
            return t("Date is required");
          }
          return undefined; // No error
        };
        if (APP_LOCALE === "CC004") {
          content = (
            // <EtDatePicker
            //   label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            //             name={fieldData.trackedEntityAttribute.id}
            //             className={customClassName}Add commentMore actions
            //             locale="am-ET" // Ethiopian calendar locale
            //             format="MMM dd/yyyy"
            //             value={selectedDateethiopia || ''}
            //             onChange={(selectedDateethiopia) => {

            //                 if (selectedDateethiopia instanceof Date && !isNaN(selectedDateethiopia.getTime())) {
            //                   setDateEthiopia(selectedDateethiopia);

            //                   // Store in YYYY-MM-DD format
            //                 //   values[fieldData.trackedEntityAttribute.id] = selectedDate.toISOString().split('T')[0];

            //                 const year = selectedDateethiopia.getFullYear();
            //                 const month = String(selectedDateethiopia.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
            //                 const day = String(selectedDateethiopia.getDate()).padStart(2, '0'); // Ensure two-digit day

            //                 values[fieldData.trackedEntityAttribute.id] = `${year}-${month}-${day}`;
            //                   } else {
            //                   console.error("Invalid date received:", selectedDateethiopia);
            //                 }
            //               }}
            // />
            <div>
              <OnChange name={fieldData.trackedEntityAttribute.id}>
                {() => {
                  setTimeout(() => {
                    //  setTrigger(prev => prev + 1);
                  }, 1000);
                }}
              </OnChange>
              <OnChange name="forceRenderField_">
                {() => {
                  setTrigger((prev) => prev + 1);
                }}
              </OnChange>
              <Field name="forceRenderField_" component="input" type="hidden" />
              <Field
                name={fieldData.trackedEntityAttribute.id}
                key={`${fieldData.trackedEntityAttribute.id}-${validationResult.hideShow}`}
                validate={
                  fieldData.mandatory && validationResult.hideShow === true
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
            placement="bottom-start"
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            name={fieldData.trackedEntityAttribute.id}
            className={`${customClassName} ethiopian-datepicker-tall`}
            locale="am-ET" // Ethiopian calendar locale
            format="MMM dd/yyyy"
            disableFuture={fieldData.allowFutureDate && fieldData.allowFutureDate == true ? false : true}
            // disablePast={disablePastVal}
            value={ input.value ? new Date(input.value) : selectedDateethiopia instanceof Date ? selectedDateethiopia : '' }
            onChange={(selectedDateethiopia) => {
              
              if (selectedDateethiopia instanceof Date && !isNaN(selectedDateethiopia.getTime())) {
                setDateEthiopia(selectedDateethiopia);
                
                // Store in YYYY-MM-DD format
                const year = selectedDateethiopia.getFullYear();
                const month = String(selectedDateethiopia.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
                const day = String(selectedDateethiopia.getDate()).padStart(2, '0'); // Ensure two-digit day
                
                const formattedDate = `${year}-${month}-${day}`;
                values[fieldData.trackedEntityAttribute.id] = formattedDate;
                
                // Update Field component value
                //values[fieldData.trackedEntityAttribute.id] = formattedDate;
                input.onChange(formattedDate);
                //setTrigger(prev => prev + 1);
                if (formref.current) {
                    formref.current.change("forceRenderField_", Math.random());
                }

              } else {
                console.error("Invalid date received:", selectedDateethiopia);
                input.onChange(''); // Clear the field value
               // setDateEthiopia(null);
              }
             
            }}
            onBlur={input.onBlur}
            required={fieldData.mandatory && validationResult.hideShow === true}
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
        //  label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
        //  name={fieldData.trackedEntityAttribute.id}
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
      name={fieldData.trackedEntityAttribute.id}
      key={`${fieldData.trackedEntityAttribute.id}-${validationResult.hideShow}`}
      validate={fieldData.mandatory && validationResult.hideShow === true ? requiredDate : undefined}
    >
      {({ input, meta }) => {
        // Determine if there's an error to show
        const showError = ((meta.error && meta.touched) || (meta.error && meta.submitFailed));

                return (
                    <DatePicker
                      label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                      name={fieldData.trackedEntityAttribute.id}
                      required={
                        fieldData.mandatory && validationResult.hideShow === true
                      }
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
            name={fieldData.trackedEntityAttribute.id}
            type="text"
            component={InputFieldFF}
            key={fieldData.trackedEntityAttribute.id}
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
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
  }, [validationResult, localStorage.getItem("locale"), selectedDateethiopia]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function DateTimeFieldConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let showYear =
    fieldData.trackedEntityAttribute.attributeValues.length > 0 &&
    fieldData.trackedEntityAttribute.attributeValues[0].attribute.name ==
      "showyear"
      ? true
      : false;
  const [fieldStructure, setFieldStructure] = useState(null);
  const [selectedDate, setDate] = useState(new Date());
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
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
          <DateTimePicker
            disabled={showYear ? true : false}
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            name={fieldData.trackedEntityAttribute.id}
            required={
              fieldData.mandatory && validationResult.hideShow == true
                ? true
                : false
            }
            dateFunsUtils={DateFnsUtils}
            value={
              values[fieldData.trackedEntityAttribute.id] == undefined
                ? selectedDate
                : values[fieldData.trackedEntityAttribute.id]
            }
            margin="normal"
            variant="inline"
            format={showYear == true ? "yyyy" : "yyyy-MM-dd"}
            views={showYear ? ["year"] : ["year", "month", "date"]}
            openTo={showYear ? "year" : "date"}
            validate={
              selectedDate.mandatory && validationResult.hideShow == true
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
  const required = (value) =>
    fieldData.mandatory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("")
      : undefined;
  const mustBeNumber = (value) =>
    isNaN(value) && value ? t("Must be a number") : undefined;
  const minValue = (min) => (value) =>
    isNaN(value) || value >= min
      ? undefined
      : t("Should be greater than") + " " + { min };
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
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
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
            name={fieldData.trackedEntityAttribute.id}
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            type="number"
            component={InputFieldFF}
            key={fieldData.trackedEntityAttribute.id}
            required={
              fieldData.mandatory && validationResult.hideShow == true
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
  let customfieldobj = props.customfieldobj;
  let customProps = {};
  let ismaskable = props.ismaskable;
  const inputType = ismaskable ? "text" : "number";
  // let maxLengthValidation = 10;
  const countryCodes = ["+237", "+251", "+224"];
  const numberFormat = (value) =>
    value && value ? t(`Incorrect format`) : undefined;
  const minValue = (min) => (value) =>
    isNaN(value) || value >= min
      ? undefined
      : t("Phone number cannot be 0 or negative");
  const length9or10 = (value) =>
  value && !/^\d{9,10}$/.test(value)
    ? t("Should be 9 or 10 digits")
    : undefined;
  const maxLength = (max) => (value) =>
    value
      ? isNaN(value) || value.length != max
        ? t("Should be") + " " + max + " " + "digits"
        : undefined
      : undefined;
  const required = (value) =>
    fieldData.mandatory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;
  const requiredPhoneCode = (value) =>
    fieldData.mandatory && validationResult.hideShow == true
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
  const [maxLengthValidation, setmaxLengthValidation] = useState(10);
  useEffect(() => {
    if (values) {
      // if (
      //     (values[customfieldobj.regPhoneNumberCodeId] && customfieldobj.patientContactNumber === fieldData.trackedEntityAttribute.id && countryCodes.includes(values[customfieldobj.regPhoneNumberCodeId])) ||
      //     (values[customfieldobj.patientContactNumberCodeId] && customfieldobj.regPhoneNumberId === fieldData.trackedEntityAttribute.id && countryCodes.includes(values[customfieldobj.patientContactNumberCodeId])) ||
      //     (values[customfieldobj.additionalPatientCodeId] && customfieldobj.additionalPatientNumber === fieldData.trackedEntityAttribute.id && countryCodes.includes(values[customfieldobj.additionalPatientCodeId])) ||
      //     (values[customfieldobj.parentContactNumberCodeId] && customfieldobj.parentContactNumber === fieldData.trackedEntityAttribute.id && countryCodes.includes(values[customfieldobj.parentContactNumberCodeId]))
      // ) {
      const phonecodevalidation = getPhonecodevalidations();
      // if(APP_LOCALE === "CC002")
      // setmaxLengthValidation(9);
      // else
      // setmaxLengthValidation(10);
      const mappingConditions = [
        {
          codeId: customfieldobj.regPhoneNumberCodeId,
          numberId: customfieldobj.patientContactNumber,
        },
        {
          codeId: customfieldobj.patientContactNumberCodeId,
          numberId: customfieldobj.regPhoneNumberId,
        },
        {
          codeId: customfieldobj.additionalPatientCodeId,
          numberId: customfieldobj.additionalPatientNumber,
        },
        {
          codeId: customfieldobj.parentContactNumberCodeId,
          numberId: customfieldobj.parentContactNumber,
        },
      ];

      for (const condition of mappingConditions) {
        const selectedCode = values[condition.codeId];
        const currentFieldId = fieldData.trackedEntityAttribute.id;

        if (
          selectedCode &&
          currentFieldId == condition.numberId &&
          phonecodevalidation[selectedCode]
        ) {
          setmaxLengthValidation(
            parseInt(phonecodevalidation[selectedCode], 10)
          );
          return;
        }
      }

      setmaxLengthValidation(10);
      // } else {
      //     setmaxLengthValidation(10);
      // }
    }
  }, [
    values,
    customfieldobj,
    fieldData.trackedEntityAttribute.id,
    countryCodes,
  ]);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
      if (
        customfieldobj.patientContactNumber ==
          fieldData.trackedEntityAttribute.id ||
        customfieldobj.regPhoneNumberId ==
          fieldData.trackedEntityAttribute.id ||
        customfieldobj.parentContactNumber ==
          fieldData.trackedEntityAttribute.id ||
        customfieldobj.additionalPatientNumber ==
          fieldData.trackedEntityAttribute.id ||
        customfieldobj.testContactNumber ==
          fieldData.trackedEntityAttribute.id ||
        customfieldobj.additionalContactNumber ==
          fieldData.trackedEntityAttribute.id
      ) {
        customProps = {
          ...customProps,
          className: "hide",
        };
      }

      let fieldValue = values[fieldData.trackedEntityAttribute.id];
      let displayValue = fieldValue;

      // Check if the value is not empty and if ismaskable is true
      if (inputType === "text" && fieldValue) {
        displayValue = maskText(fieldValue); // Only mask if ismaskable is true
      }
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
          {...customProps}
        >
          <Field
            // name={fieldData.trackedEntityAttribute.id}
            name={fieldData.trackedEntityAttribute.id}
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            type={inputType}
            component={InputFieldFF}
            key={fieldData.trackedEntityAttribute.id}
            required={
              fieldData.mandatory && validationResult.hideShow == true
                ? true
                : false
            }
            // validate={composeValidators(required, numberFormat, maxLength(maxLengthValidation))}
            validate={composeValidators(
              required,
              APP_LOCALE === "CC013"
                ? length9or10
                : maxLength(maxLengthValidation),
              minValue(1)
            )}
            className={customClassName}
            // value={displayValue}
            {...customProps}
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
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
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
            name={fieldData.trackedEntityAttribute.id}
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            type={"email"}
            component={InputFieldFF}
            key={fieldData.trackedEntityAttribute.id}
            required={
              fieldData.mandatory && validationResult.hideShow == true
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
  let linkContactFlag = props.linkContactFlag;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const [UIC, setUIC] = useState(null);
  const offlineUIC = (
    len,
    chars = "A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5"
  ) =>
    [...Array(len)]
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join("");

  function getUIC() {
    if (navigator.onLine && UIC == null) {
      setGlobalSpinner(true);
      apiServices
        .generateUIC(fieldData.trackedEntityAttribute.id)
        .then((response) => {
          setUIC(response.value);
          setGlobalSpinner(false);
        })
        .catch((err) => {
          setGlobalSpinner(false);
        });
    } else {
      if (UIC == null) {
        OfflineDb.getDataFromPouchDB("offlineUICList")
          .then((res) => {
            if (res && res.data) {
              let uicobj = res.data.pop();
              if (uicobj) {
                setUIC(uicobj.value);
              } else {
                setUIC("OFF" + offlineUIC(12));
              }
              OfflineDb.setDataIntoPouchDB("offlineUICList", res.data);
            } else {
              setUIC("OFF" + offlineUIC(12));
            }
          })
          .catch((e) => {
            setUIC("OFF" + offlineUIC(12));
          });
      }
    }
  }
  useEffect(() => {
    getUIC();
  }, [linkContactFlag]);

  return (
    <>
      {UIC != null ? (
        <Grid item xs={12} sm={12} md={12}>
          <Field
            name={fieldData.trackedEntityAttribute.id}
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            type={fieldData.trackedEntityAttribute.valueType}
            component={InputFieldFF}
            key={fieldData.trackedEntityAttribute.id}
            defaultValue={UIC}
            disabled={true}
            className={customClassName}
            required={fieldData.mandatory ? true : false}
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
  const switchData = [{ label: "Yes", value: "item1" }];

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
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
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            name={fieldData.trackedEntityAttribute.id}
            disableRipple
            required={
              fieldData.mandatory && validationResult.hideShow == true
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
  let showYear =
    fieldData.trackedEntityAttribute.attributeValues.length > 0 &&
    fieldData.trackedEntityAttribute.attributeValues[0].attribute.name ==
      "showyear"
      ? true
      : false;
  const [fieldStructure, setFieldStructure] = useState(null);
  const [selectedDate, setDate] = useState(new Date());
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
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
          <TimePicker
            label={fieldData.trackedEntityAttribute.displayFormName}
            name={fieldData.trackedEntityAttribute.id}
            required={
              fieldData.mandatory && validationResult.hideShow == true
                ? true
                : false
            }
            dateFunsUtils={DateFnsUtils}
            margin="normal"
            variant="inline"
            format="HH:MM"
            className={customClassName}
          />
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function IntegerConfig(props) {
  const { t } = useTranslation();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customfieldobj = props.customfieldobj;
  let customClassName = props.customClassName;
  let customProps = { className: customClassName };
  let programData = props.programData;
  let programZambia = false;
  let ismaskable = props.ismaskable;
  if (programData && programData.code && programData.code == "Zambia_Program") {
    programZambia = true;
  }
  // if (ismaskable) {
  //     values[fieldData.trackedEntityAttribute.id] = maskText(  values[fieldData.trackedEntityAttribute.id]);
  // }

  const requiredPhoneCode = (value) =>
    fieldData.mandatory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;
  const required = (value) =>
    fieldData.mandatory && validationResult.hideShow == true
      ? value
        ? undefined
        : t("Required")
      : undefined;
  const mustBeNumber = (value) =>
    isNaN(value) && value ? t("Must be a number") : undefined;
  const minValue = (min) => (value) =>
    isNaN(value) || value >= min
      ? undefined
      : t("Should be greater than/equal to") + " " + min;
  const maxValue = (max) => (value) =>
    isNaN(value) || value <= max
      ? undefined
      : t("Should be less than") + " " + max;
  const equalLength = (eqVal) => (value) =>
    value
      ? isNaN(value) || value.length != eqVal
        ? APP_LOCALE == "CC004" && fieldData.trackedEntityAttribute.id == customfieldobj.nationalIdNumber ? t("Please enter") +" "+ eqVal+ " "+ t("digit") : t("Please enter 10 digit mobile number")
        : undefined
      : undefined;
  const maxLength = (max) => (value) =>
    value
      ? isNaN(value) || value.length > max
        ? t("Should be less than") + " " + max
        : undefined
      : undefined;
  const maxLengthv = (max) => (value) =>
    value
      ? isNaN(value) || value.length != max
        ? t("Should be") + " " + max + " " + "digits"
        : undefined
      : undefined;

  const errorCheck = (value) => (value ? findError(value) : undefined);

  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined
      );

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [maxLengthValidation, setmaxLengthValidation] = useState(13);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
    );
    setValidationResult(validationResult);
  }

  function findError(value) {
    let latestValidationValue = {};
    latestValidationValue[fieldData.trackedEntityAttribute.id] = value;

    let fetchValidationDetails = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      latestValidationValue,
      programRules,
      programRulesVariables
    );
    return fetchValidationDetails.showError
      ? fetchValidationDetails.showError
      : undefined;
  }

  function calculateAge(selectedDate) {
    let dt2 = new Date(selectedDate);
    let dt1 = new Date();

    var a = moment(dt2);
    var b = moment(dt1);

    var years = a.diff(b, "years");
    var birth = Math.abs(years);
    var age = Math.abs(years);
    return age == 0 || dt2 > dt1 ? "0" : age;
  }

  function calculateAgeBasedOnYearMonth(selectedYear, selectedMonth) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Month is zero-indexed (0 for January), so we add 1.

    let age = currentYear - selectedYear;

    // Check if the birth month is yet to come in the current year
    if (currentMonth < selectedMonth) {
      age--;
    }

    return age == 0 || age < 0 ? "0" : age;
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
      let fieldDisabled = false;
      let customProps = {};
      if (
        fieldData.trackedEntityAttribute.id ==
        customfieldobj.numberPeopleinHousehold
      ) {
        // Validation for number of people in household to be in the (1,25) range
        customProps = {
          ...customProps,
          validate: composeValidators(
            required,
            mustBeNumber,
            minValue(1),
            maxValue(25),
            errorCheck
          ),
        };
      }

      if(APP_LOCALE == "CC004" && fieldData.trackedEntityAttribute.id == customfieldobj.nationalIdNumber){
          customProps = {
          ...customProps,
          validate: composeValidators(
            required,
            mustBeNumber,
            equalLength(12),
            errorCheck
          ),
        };
      }

      if (
        fieldData.trackedEntityAttribute.id ==
          customfieldobj.regPhoneNumberCodeId &&
        programZambia
      ) {
        values[fieldData.trackedEntityAttribute.id] = "260";
        // customProps = {
        //     ...customProps,
        //     disabled: true
        // }
      }
      if (
        fieldData.trackedEntityAttribute.id == customfieldobj.ageUID &&
        APP_LOCALE == "CC002"
      ) {
        fieldDisabled = true;
      }

      const programSections = programData.programSections;

      const attributeIds = findAttributeIdsWithFlags(programSections);

      // ---------------------FOR REGULAR AGE----------------------------//

      const keyNamedobId = getKeyByValue(customfieldobj, attributeIds.dobId);

      const valuedob = values[customfieldobj[keyNamedobId]];
      if (
        attributeIds.ageId == fieldData.trackedEntityAttribute.id &&
        valuedob
      ) {
        try {
          values[fieldData.trackedEntityAttribute.id] = calculateAge(valuedob);
          fieldDisabled = true;
          customProps = {
            ...customProps,
            key: Math.random() * 9999,
            //disabled: true
          };
        } catch (e) {}
      }

      // if (customfieldobj.ageUID == fieldData.trackedEntityAttribute.id && values[customfieldobj.dobID]) {
      //     try {
      //         values[fieldData.trackedEntityAttribute.id] = calculateAge(values[customfieldobj.dobID]);
      //         fieldDisabled = true;
      //         customProps = {
      //             ...customProps,
      //             key: Math.random() * 9999,
      //             //disabled: true
      //         };
      //     } catch (e) {

      //     }
      // }
      // }
      //----------------------------------------------------------------------------//
      //-----------------------For Age With Diagnosis-------------------------------//
      const keydiagnosisageId = getKeyByValue(
        customfieldobj,
        attributeIds.calCustomAge
      );

      const valuediagnosisageId = values[customfieldobj[keydiagnosisageId]];

      const keyage = getKeyByValue(customfieldobj, attributeIds.ageId);

      const valueage = values[customfieldobj[keyage]];

      if (
        attributeIds.calCustomAge == fieldData.trackedEntityAttribute.id &&
        valuediagnosisageId &&
        valueage
      ) {
        try {
          let age = calculateAge(valuediagnosisageId);
          values[fieldData.trackedEntityAttribute.id] =
            parseInt(values[valueage]) - age;
          fieldDisabled = true;
          customProps = {
            ...customProps,
            key: Math.random() * 9999,
            //disabled: true
          };
        } catch (e) {}
      }

      //----------------------------------------------------------------------------//
      if (fieldData.trackedEntityAttribute.id == "xOIphl6fxg8") {
        customProps = {
          ...customProps,
          validate: composeValidators(required, maxLengthv(13)),
        };
      }

      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className={validationResult.hideShow == true ? "" : "hide"}
          {...customProps}
        >
          <Field
            name={fieldData.trackedEntityAttribute.id}
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            type={"number"}
            component={InputFieldFF}
            key={fieldData.trackedEntityAttribute.id}
            required={
              fieldData.mandatory && validationResult.hideShow == true
                ? true
                : false
            }
            validate={
              fieldData.trackedEntityAttribute.id == customfieldobj.ageUID
                ? // composeValidators(required, mustBeNumber, errorCheck) :
                  composeValidators(
                    required,
                    mustBeNumber,
                    minValue(0),
                    errorCheck
                  )
                : (programZambia &&
                    fieldData.trackedEntityAttribute.id ==
                      customfieldobj.regPhoneNumberId) ||
                  fieldData.trackedEntityAttribute.id ==
                    customfieldobj.additionalPatientNumber ||
                  fieldData.trackedEntityAttribute.id ==
                    customfieldobj.patientContactNumber
                ? // Validation for phone numbers to be of 9 digits
                  composeValidators(
                    required,
                    mustBeNumber,
                    equalLength(10),
                    errorCheck
                  )
                : composeValidators(
                    required,
                    mustBeNumber,
                    minValue(1),
                    errorCheck
                  )
            }
            value=""
            className={customClassName}
            disabled={fieldDisabled ? true : false}
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
          />
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function TextAreaConfig(props) {
  const { t } = useTranslation();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  const required = (value) =>
    fieldData.mandatory && validationResult.hideShow == true
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
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
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
            name={fieldData.trackedEntityAttribute.id}
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            type={"text"}
            component={InputFieldFF}
            key={fieldData.trackedEntityAttribute.id}
            required={
              fieldData.mandatory && validationResult.hideShow == true
                ? true
                : false
            }
            validate={composeValidators(required, scriptCheck)}
            autoGrow
            className={customClassName}
          />
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function UserNameConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
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
            name={fieldData.trackedEntityAttribute.id}
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            component={TextAreaFieldFF}
            key={fieldData.trackedEntityAttribute.id}
            required={
              fieldData.mandatory && validationResult.hideShow == true
                ? true
                : false
            }
            validate={composeValidators(hasValue, dhis2Username)}
            className={customClassName}
          />
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function URLConfig(props) {
  const { t } = useTranslation();
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  const required = (value) =>
    fieldData.mandatory && validationResult.hideShow == true
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
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
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
            name={fieldData.trackedEntityAttribute.id}
            label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
            component={TextAreaFieldFF}
            key={fieldData.trackedEntityAttribute.id}
            required={
              fieldData.mandatory && validationResult.hideShow == true
                ? true
                : false
            }
            validate={composeValidators(required, URLCheck)}
            className={customClassName}
          />
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
    OUMappingList[fieldData.trackedEntityAttribute.id] != undefined
      ? values[OUMappingList[fieldData.trackedEntityAttribute.id].parent]
      : null;
  let programData = props.programData;
  let options = props.options;
  let defaultOption = props.defaultOption;
  let rules = {
    programRule: props.programRules,
    programRuleVariable: props.programRulesVariables,
  };
  let OUJSON = props.OUJSON.organisationUnits;
  if (fieldData.trackedEntityAttribute.displayName == "Facility address") {
    OUJSON = OUJSON.filter((obj) => obj.comment == "Facility");
  }

  const option = { id: "option1", label: "Option1", value: "option1" };

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [location, setLocation] = useState([]);
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
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
      //setGlobalSpinner(true)
      const filterOnId = OUJSON.filter((obj) => obj.id == options);
      if (
        filterOnId.length > 0 &&
        fieldData.trackedEntityAttribute.displayName != "Facility address"
      ) {
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
      if (fieldData.trackedEntityAttribute.displayName == "Facility address") {
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

      if (
        OUMappingList[fieldData.trackedEntityAttribute.id] != undefined &&
        fieldData.trackedEntityAttribute.displayName != "Facility address"
      ) {
        if (OUMappingList[fieldData.trackedEntityAttribute.id].type) {
          let OUOptions = OUJSON.filter(
            (obj) =>
              obj.level ==
              OUMappingList[fieldData.trackedEntityAttribute.id].level
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
      }
      if (fieldData.trackedEntityAttribute.displayName == "Facility address") {
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
    values[fieldData.trackedEntityAttribute.id],
    parentValue,
    options,
    localStorage.getItem("locale"),
  ]); //defaultOption, options

  useEffect(() => {
    if (location != null) {
      if (values[fieldData.trackedEntityAttribute.id]) {
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

function MultiSelectConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  //let DataElementGroup = DataElementGroup
  let DataElementGroup = props.DataElementGroup;
  let programObj = props.programObj;
  let customfieldobj = props.customfieldobj;
  let customProps = {};
  let customClassName = props.customClassName;

  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
    );
    setValidationResult(validationResult);
  }

  function getFieldDetails(fieldId, formValues) {
    const getFieldsAttributes =
      programObj.programTrackedEntityAttributes.filter(
        (obj) => obj.trackedEntityAttribute.id == fieldId
      );

    if (getFieldsAttributes.length > 0) {
      const fieldData1 = getFieldsAttributes[0];

      const findField =
        HideCheckboxOptions[fieldData1.trackedEntityAttribute.id];
      let isFieldDisbaled = false;
      if (findField != undefined) {
        findField.field.map((eachField) => {
          if (formValues[eachField] == findField.value) {
            isFieldDisbaled = true;
          }
        });
      }

      try {
        if (values && values[props.DataElementGroup.id]) {
          values[props.DataElementGroup.id].map((field) => {
            values[field] = true;
          });
        }
      } catch (e) {
        console.log(e);
      }
      return (
        <Field
          type="checkbox"
          component={CheckboxFieldFF}
          name={props.DataElementGroup.id}
          disabled={isFieldDisbaled}
          label={getTranslatedLabels(fieldData1.trackedEntityAttribute)}
          value={fieldData1.trackedEntityAttribute.id}
          className={customClassName}
        />
      );
    }
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (validationResult != null) {
      let fieldLabel = getTranslatedLabels(DataElementGroup);
      try {
        if (fieldLabel.includes("_")) {
          let l = fieldLabel.split("_");
          fieldLabel = l[1];
        }
      } catch (e) {}
      if (
        (values &&
          values[customfieldobj.clientTypeID] &&
          values[customfieldobj.clientTypeID] != "Others") ||
        (values && !values[customfieldobj.clientTypeID])
      ) {
        //values[customVariable.hivStatusId] = "Reactive1"
        customProps = {
          ...customProps,
          className: "hide",
        };
      }
      setFieldStructure(
        <Grid
          item
          xs={12}
          sm={12}
          className={validationResult.hideShow == true ? "customLoc" : "hide"}
          {...customProps}
        >
          <FieldGroupFF
            label={fieldLabel}
            // onClick={(e, v) => onChange(e, v)}
            name={DataElementGroup.id}
            className={customClassName}
          >
            {DataElementGroup.trackedEntityAttributes.map((field) => {
              return getFieldDetails(field.id, values);
            })}
          </FieldGroupFF>
        </Grid>
      );
    }
  }, [validationResult, localStorage.getItem("locale")]);

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

  function generateQRCode(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return "dureProg_" + result;
  }

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
    if (defaultValue != null) {
      values[fieldData.trackedEntityAttribute.id] = defaultValue;
    }
    // if(!values[fieldData.trackedEntityAttribute.id]){
    //    values[fieldData.trackedEntityAttribute.id] = generateQRCode(8)
    // }
    if (showScannner) {
      setFieldStructure(
        <Grid item xs={12} sm={12} md={12}>
          <div style={{ display: "none" }}>
            <Field
              name={fieldData.trackedEntityAttribute.id}
              label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
              type={fieldData.trackedEntityAttribute.valueType}
              component={InputFieldFF}
              key={fieldData.trackedEntityAttribute.id}
              defaultValue={defaultValue}
            />
          </div>
          <div>
            <QrReader
              delay={300}
              onError={qrErrorhandler}
              onScan={handleQRScan}
              style={{ width: "50%", cursor: "pointer" }}
            />
            <span onClick={() => closeQrSacnner()}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
        </Grid>
      );
    } else {
      setFieldStructure(
        <Grid item xs={12} sm={12} md={12}>
          <div style={{ display: "none" }}>
            <Field
              name={fieldData.trackedEntityAttribute.id}
              label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
              type={fieldData.trackedEntityAttribute.valueType}
              component={InputFieldFF}
              key={fieldData.trackedEntityAttribute.id}
              //defaultValue={defaultValue}
            />
          </div>
          <p className="qrIcon hide" onClick={() => openQrSacnner()}>
            <FontAwesomeIcon className="fa-3x" icon={faQrcode} />
          </p>
          {/* {
                    values && values[fieldData.trackedEntityAttribute.id] ?
                    <div>
                        <QRCodeSVG
                        id="qr-gen"
                        value={values[fieldData.trackedEntityAttribute.id]}
                        size={50}
                        level={"H"}
                        includeMargin={true}
                        //onClick={enlargeImg}
                        />
                    </div>
                       : <></>
                    } */}
        </Grid>
      );
    }
  }, [showScannner, defaultValue, localStorage.getItem("locale")]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function ImageFieldConfig(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let dataElementGroup = props.dataElementGroup;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const { t } = useTranslation();
  const [fieldStructure, setFieldStructure] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [defaultValue, setDefaultValue] = useState(null);
  //const [dataUri, setDataUri] = useState(null)
  //openCamera
  const [openCameraOption, setCameraOption] = useState(null);
  //const [imagePath, setImagePath] = useState(null)
  const imagePath = props.imagePath;
  const cameraStatus = props.cameraStatus;
  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
    );
    setValidationResult(validationResult);
  }

  useEffect(() => {
    fetchValidation();
  }, [values]);

  useEffect(() => {
    if (props.imagePath) {
      //setImagePath(props.imagePath)
      if (!window.cordova) {
        values[fieldData.trackedEntityAttribute.id] = props.imagePath;
      } else {
        //values[fieldData.trackedEntityAttribute.id] = props.imagePath
      }
    }
  }, [props]);

  async function openFileChooser() {
    const file = await window.chooser.getFile({
      mimeTypes: ["application/pdf", "image/*"],
    });
    setDefaultValue(file);
  }

  function handleCameraClick(values) {
    setGlobalSpinner(true);
    setTimeout(function () {
      setCameraOption(true);
      props.cameraClick(values);
    }, 500);
  }

  function handleCameraClose(values) {
    setGlobalSpinner(false);
    setCameraOption(false);
    props.cameraClose(values);
  }

  useEffect(() => {
    if (validationResult != null) {
      if (!navigator.onLine) {
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
                name={fieldData.trackedEntityAttribute.id}
                label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                type={fieldData.trackedEntityAttribute.valueType}
                component={InputFieldFF}
                key={fieldData.trackedEntityAttribute.id}
                defaultValue={defaultValue}
              />
            </div>
            <div className="reg-file-block">
              <label className={customClassName}>
                {getTranslatedLabels(fieldData.trackedEntityAttribute)}
              </label>
              <p className="qrIcon" onClick={() => openFileChooser()}>
                <FontAwesomeIcon className="fa-3x" icon={faFileUpload} />
              </p>
            </div>
            <div className="reg-image-block" style={{ paddingTop: "20px" }}>
              <span className="or-block" style={{ right: "214px" }}>
                &nbsp; {t("OR")}
              </span>
              {!cameraStatus ? (
                <span
                  className={
                    imagePath
                      ? "qrIcon camera-block disabledClick"
                      : "qrIcon camera-block"
                  }
                  onClick={() => handleCameraClick()}
                >
                  <FontAwesomeIcon className="fa-2x" icon={faCamera} />
                </span>
              ) : (
                <></>
              )}
              {cameraStatus ? (
                <span
                  className="qrIcon camera-block"
                  onClick={() => handleCameraClose()}
                >
                  <FontAwesomeIcon className="fa-2x" icon={faWindowClose} />
                </span>
              ) : (
                <></>
              )}
              {imagePath ? (
                <div className="camera-helptext" style={{ right: "33px" }}>
                  <span>{t("Photo captured.")}</span> <br />{" "}
                  <span
                    style={{ textDecoration: "underline" }}
                    onClick={() => props.clearCameraImageClick()}
                  >
                    {t("Remove")}
                  </span>
                </div>
              ) : (
                <span className="camera-helptext" style={{ right: "33px" }}>
                  {t("Take a photo.")}
                </span>
              )}
            </div>
          </Grid>
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
                            name={fieldData.trackedEntityAttribute.id}
                            onChange={handleChange.bind(this)}
                            filesLimit={1}
                        /> */}
            <div className="reg-file-block">
              <Field
                name={fieldData.trackedEntityAttribute.id}
                label={getTranslatedLabels(fieldData.trackedEntityAttribute)}
                component={FileInputFieldFF}
                key={fieldData.trackedEntityAttribute.id}
                required={
                  fieldData.compulsory && validationResult.hideShow == true
                    ? true
                    : false
                }
                value={[]}
                className={
                  imagePath
                    ? "disabledClick " + customClassName
                    : customClassName
                }
                helpText={t(
                  "Max size 5mb. Supported file types are .jpg, .png"
                )}
                accept="image/*"
                //onChange={handleChange.bind(this)}
                //validate={composeValidators(required, URLCheck)}
              />
            </div>
            <div className="reg-image-block">
              <span className="or-block">&nbsp; {t("OR")}</span>
              {!cameraStatus ? (
                <span
                  className={
                    imagePath
                      ? "qrIcon camera-block disabledClick"
                      : "qrIcon camera-block"
                  }
                  onClick={() => handleCameraClick()}
                >
                  <FontAwesomeIcon className="fa-2x" icon={faCamera} />
                </span>
              ) : (
                <></>
              )}
              {cameraStatus ? (
                <span
                  className="qrIcon camera-block"
                  onClick={() => handleCameraClose()}
                >
                  <FontAwesomeIcon className="fa-2x" icon={faWindowClose} />
                </span>
              ) : (
                <></>
              )}
              {imagePath ? (
                <div className="camera-helptext" style={{ right: "33px" }}>
                  <span>{t("Photo captured.")}</span> <br />{" "}
                  <span
                    style={{ textDecoration: "underline" }}
                    onClick={() => props.clearCameraImageClick()}
                  >
                    {t("Remove")}
                  </span>
                </div>
              ) : (
                <span className="camera-helptext" style={{ right: "33px" }}>
                  {t("Take a photo.")}
                </span>
              )}
            </div>
          </Grid>
        );
      }
    }
  }, [
    validationResult,
    openCameraOption,
    cameraStatus,
    imagePath,
    defaultValue,
    localStorage.getItem("locale"),
  ]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function GoogleLocation(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let customClassName = props.customClassName;
  let customfieldobj = props.customfieldobj;
  let currentGeolocation = props.currentGeolocation;
  let mapLocation = props.mapLocation;
  let programData = props.programData;
  let availableAddressOptions = props.availableAddressOptions;
  const { t } = useTranslation();
  const [openMap, setOpenMap] = useState(false);
  let customProps = {};
  const defaultOption = props.defaultOption;
  const runtime = window.RUNTIME_CONFIG || {};
  const MAPAPIKEY = runtime.googleMapAPIKey
  let regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  const required = (value) =>
    fieldData.mandatory && validationResult.hideShow == true
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
  const [placeholder, setPlaceholder] = useState(
    values[fieldData.trackedEntityAttribute.id]
      ? values[fieldData.trackedEntityAttribute.id]
      : null
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [renderKey, setrenderKey] = useState(0);
  //const [value, setValue] = useState('INDIA')
  const isDropdownAttribute =
    fieldData?.trackedEntityAttribute?.attributeValues?.find(
      (attr) =>
        attr.attribute?.name === "ShowInAddressDropdown" &&
        attr.value === "true"
    );

  const isPrimaryContactAttribute =
    fieldData?.trackedEntityAttribute?.attributeValues?.find(
      (attr) =>
        attr.attribute?.name === "PrimaryContactAttribute" &&
        attr.value === "true"
    );

  function fetchValidation() {
    const validationResult = Validator(
      fieldData.trackedEntityAttribute.id,
      fieldData,
      values,
      programRules,
      programRulesVariables
    );
    setValidationResult(validationResult);
  }

  const noOptionsMessage = (value) => {
    values[fieldData.trackedEntityAttribute.id] = value.inputValue;
    setPlaceholder(value.inputValue);
  };

  const onGoogleLocationChange = (value) => {
    props.onGoogleLocationChange(value);
  };

  const onChnage = (value) => {
    if (value && value.label) {
      Geocode.setApiKey(MAPAPIKEY); 
      values[fieldData.trackedEntityAttribute.id] = value.label;
      setPlaceholder(value.label);
      geocodeByAddress(value.label)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          //setValue(value.label)
          let fieldId = fieldData.trackedEntityAttribute.id;
          values[fieldId] = value.label;
          let lati = "";
          let lngi = "";
          try {
            values[customfieldobj.addressLocationId] = lat + "," + lng;
          } catch (e) {}
          Geocode.fromAddress(value.label).then(
            (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              lati = lat;
              lngi = lng;

              try {
                values[customfieldobj.addressLocationId] = lat + "," + lng;
              } catch (e) {}

              Geocode.fromLatLng(lat, lng).then(
                (response) => {
                  const address = response.results[0].formatted_address;
                  const data = {
                    value: value,
                    fieldId: fieldData.trackedEntityAttribute.id,
                    lat: lat,
                    lng: lng,
                  };
                  props.onGoogleLocationChange(data);
                },
                (error) => {
                  console.error(error);
                }
              );
            },
            (error) => {
              console.error(error);
            }
          );
        });
    }
  };

  const openMapFun = () => {
    setOpenMap(true);
  };

  const mapLocationSubmit = () => {
    setOpenMap(false);
  };

  //mapLocation
  useEffect(() => {
    try {
      if (mapLocation != null && values) {
        values[customfieldobj.addressLocationId] =
          mapLocation.lat + "," + mapLocation.lng;
        values[fieldData.trackedEntityAttribute.id] = mapLocation.address;
        setPlaceholder(mapLocation.address);
        props.setLocationAction(null);
        // customProps = {
        //     ...customProps,
        //     key: Math.random() * 9999,
        // };
      }
      if (!mapLocation && !values[fieldData.trackedEntityAttribute.id]) {
        setPlaceholder(null);
      }
      if (!navigator.onLine && !values[customfieldobj.addressLocationId]) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              values[customfieldobj.addressLocationId] =
                latitude + "," + longitude;
            },
            (error) => {},
            { timeout: 10000 }
          );
        }
      }
    } catch (e) {}
  }, [values, mapLocation]);

  useEffect(() => {
    fetchValidation();
  }, [values, placeholder]);

  const getClassForAddress = (fieldData) => {
    let attributeKey = "";

    if (isDropdownAttribute?.value == "true") {
      attributeKey = findKeyByValue(
        customfieldobj,
        fieldData.trackedEntityAttribute.id
      );
    } else {
      attributeKey = Object.keys(customfieldobj).find(
        (key) => customfieldobj[key] === fieldData.trackedEntityAttribute.id
      );
    }

    if (
      (attributeKey && values[customfieldobj[attributeKey]]) ||
      isPrimaryContactAttribute?.value == "true"
    ) {
      return ` ${attributeKey}`;
    } else {
      return ` ${attributeKey} hide`;
    }
  };

  const findKeyByValue = (obj, value) => {
    for (const key in obj) {
      if (obj[key] === value) {
        return key;
      }
    }
    return null; // Return null if value not found
  };

  useEffect(() => {
    if (validationResult != null) {
      //let customProps = {};
      if (values[fieldData.trackedEntityAttribute.id]) {
        customProps = {
          ...customProps,
          defaultInputValue: defaultOption,
        };
      }
      if (navigator.onLine) {
        const autocompletionRequest = getAutocompletionRequest(programData);
        setFieldStructure(
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            className={
              (validationResult.hideShow == true
                ? "customAddLoc row " + customClassName
                : "hide") + getClassForAddress(fieldData)
            }
          >
            {customfieldobj.regAddressId ==
            fieldData.trackedEntityAttribute.id ? (
              <>
                <div>
                  <label>
                    <span>
                      {getTranslatedLabels(fieldData.trackedEntityAttribute)}
                    </span>
                  </label>
                  <Grid container spacing={1} className="align-items-center">
                    <Grid item xs={10} sm={10} md={10} lg={10}>
                      {/* location-block */}
                      <div className="">
                        <GooglePlacesAutocomplete
                          name={customfieldobj.regAddressId}
                          key={
                            values[customfieldobj.regAddressId]
                              ? Math.random() * 999
                              : fieldData.trackedEntityAttribute.id
                          }
                          required={
                            fieldData.mandatory &&
                            validationResult.hideShow == true
                              ? true
                              : false
                          }
                          validate={composeValidators(required)}
                          apiKey={MAPAPIKEY} 
                          // autocompletionRequest={{
                          //     bounds: [
                          //         { lat: 50, lng: 50 },
                          //         { lat: 100, lng: 100 }
                          //     ],

                          // }}
                          autocompletionRequest={autocompletionRequest}
                          selectProps={{
                            // defaultInputValue:
                            // customProps &&
                            // customProps.hasOwnProperty("defaultInputValue")
                            // ? customProps.defaultInputValue
                            // : "",
                            placeholder: values[
                              fieldData.trackedEntityAttribute.id
                            ]
                              ? values[fieldData.trackedEntityAttribute.id]
                              : placeholder != null
                              ? placeholder
                              : t("Enter Location"),
                            //placeholder: 'Enter location',
                            //value,
                            onChange: (value) => onChnage(value),
                            noOptionsMessage: (value) =>
                              noOptionsMessage(value),
                          }}
                          className={customClassName}
                        />
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      sm={2}
                      md={2}
                      lg={2}
                      className="mapAddDiv align-items-center"
                    >
                      {/* map-block */}
                      <span className="" onClick={() => openMapFun()}>
                        <FontAwesomeIcon
                          className="fa-2x cursor-pointer"
                          icon={faMap}
                        />
                      </span>
                      {/* <div onClick={()=>openMapFun()}>Open Map</div> */}
                      {openMap ? (
                        ReactDOM.createPortal(
                          <div className="modaloverlay">
                            <div className="modalcardholder">
                              <Card className="modalcard">
                                <CardHeader
                                  className="modalheader color-white"
                                  action={
                                    <IconButton aria-label="close">
                                      <CloseIcon
                                        onClick={() => setOpenMap(false)}
                                      />
                                    </IconButton>
                                  }
                                  title={"Location Map"}
                                />
                                {console.log("currentGeolocation", currentGeolocation)}
                                <CardContent className="modalbodycontent">
                                  <Grid container spacing={3}>
                                    <GoogleMaps
                                      fieldId={
                                        fieldData.trackedEntityAttribute.id
                                      }
                                      defaultOption={defaultOption}
                                      geoLat={APP_LOCALE !== "CC004" ? currentGeolocation.lat : 9.0192}
                                      onGoogleLocationChange={
                                        onGoogleLocationChange
                                      }
                                      geoLng={APP_LOCALE !== "CC004" ? currentGeolocation.lng : 38.7525}
                                    />
                                  </Grid>
                                </CardContent>
                                <CardActions className="modalfooter">
                                  <Button
                                    className="modalactionbtn"
                                    onClick={() => mapLocationSubmit()}
                                  >
                                    Ok
                                  </Button>
                                </CardActions>
                              </Card>
                            </div>
                          </div>,
                          document.body // Moves modal outside the restricted div
                        )
                      ) : (
                        <></>
                      )}
                      <img
                        onClick={(e) => {
                          const filteredOptions =
                            availableAddressOptions.filter((option) => {
                              // Get the element with the matching class
                              const element = document.querySelector(
                                "." + option.value
                              );

                              // Keep the option if:
                              // 1. The element doesn't exist at all (return true to keep it in the array)
                              // 2. The element exists but also has the "hide" class (return true to keep it in the array)
                              if (!element) {
                                return true; // Element doesn't exist, keep it in the array
                              } else {
                                // Check if the element has the "hide" class
                                return element.classList.contains("hide");
                              }
                            });

                          // Update the availableAddressOptions with the filtered list
                          availableAddressOptions = filteredOptions;

                          if (availableAddressOptions.length === 0) {
                            swal({
                              title: t("No more Address details to be added"),
                              icon: "warning",
                              button: t("OK"),
                              className: "custom-swalwarning",
                            });
                            return;
                          }

                          swal({
                            title: t("Select type of address"),
                            text: "",
                            content: {
                              element: "select",
                              attributes: {
                                id: "swal-dropdown",
                                innerHTML:
                                  `
                                                <option value="" disabled selected>` +
                                  t("Select an option") +
                                  `</option>
                                                ${availableAddressOptions
                                                  .map(
                                                    (option) =>
                                                      `<option value="${
                                                        option.value
                                                      }">${t(
                                                        option.label
                                                      )}</option>`
                                                  )
                                                  .join("")}
                                            `,
                              },
                            },
                            className: "custom-swal",
                            buttons: {
                              cancel: t("Cancel"),
                              confirm: {
                                text: t("Submit"),
                                closeModal: false,
                              },
                            },
                          }).then((value) => {
                            if (value != true) return;
                            const selectedValue =
                              document.getElementById("swal-dropdown").value;
                            if (!selectedValue) return;

                            setSelectedOptions((prevOptions) => [
                              ...prevOptions,
                              selectedValue,
                            ]); // Store selected option

                            setrenderKey(Math.random());
                            const elements =
                              document.getElementsByClassName(selectedValue);
                            for (let i = 0; i < elements.length; i++) {
                              elements[i].classList.remove("hide"); // Remove class
                            }
                            swal.close();
                          });
                        }}
                        style={{ height: "22px", cursor: "pointer" }}
                        src={imgUrl.plusIcon}
                        className="plusContactIcon"
                      />
                    </Grid>
                  </Grid>
                </div>
              </>
            ) : (
              <></>
            )}

            {isDropdownAttribute?.value == "true" ? (
              <>
                {(() => {
                  const attributeKey = findKeyByValue(
                    customfieldobj,
                    fieldData.trackedEntityAttribute.id
                  );
                  const hasValue = values[fieldData.trackedEntityAttribute.id]
                    ? ""
                    : " hide";
                  return (
                    <>
                      <div className={attributeKey + hasValue}>
                        <label>
                          <span>
                            {getTranslatedLabels(
                              fieldData.trackedEntityAttribute
                            )}
                          </span>
                        </label>
                        <Grid
                          container
                          spacing={1}
                          className="align-items-center"
                        >
                          <Grid item xs={10} sm={10} md={10} lg={10}>
                            <GooglePlacesAutocomplete
                              name={fieldData.trackedEntityAttribute.id}
                              key={
                                values[fieldData.trackedEntityAttribute.id]
                                  ? Math.random() * 999
                                  : fieldData.trackedEntityAttribute.id
                              }
                              required={
                                fieldData.mandatory &&
                                validationResult.hideShow == true
                                  ? true
                                  : false
                              }
                              validate={composeValidators(required)}
                              apiKey={MAPAPIKEY}
                              autocompletionRequest={autocompletionRequest}
                              selectProps={{
                                placeholder: values[
                                  fieldData.trackedEntityAttribute.id
                                ]
                                  ? values[fieldData.trackedEntityAttribute.id]
                                  : placeholder != null
                                  ? placeholder
                                  : t("Enter Location"),
                                onChange: (value) => onChnage(value),
                                noOptionsMessage: (value) =>
                                  noOptionsMessage(value),
                              }}
                              className={customClassName}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            sm={2}
                            md={2}
                            lg={2}
                            className="mapAddDiv align-items-center"
                          >
                            <span
                              className={attributeKey + hasValue}
                              onClick={() => openMapFun()}
                            >
                              <FontAwesomeIcon className="fa-2x" icon={faMap} />
                            </span>
                            <IconButton
                              onClick={(e) => {
                                const elements =
                                  document.getElementsByClassName(attributeKey);
                                for (let i = 0; i < elements.length; i++) {
                                  elements[i].classList.add("hide");
                                }
                                values[fieldData.trackedEntityAttribute.id] =
                                  null;
                              }}
                              style={{
                                height: "22px",
                                cursor: "pointer",
                                marginRight: "-1px",
                                padding: "0px",
                              }}
                              aria-label="close"
                            >
                              <Delete />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </div>
                      {openMap ? (
                        ReactDOM.createPortal(
                          <div className="modaloverlay">
                            <div className="modalcardholder">
                              <Card className="modalcard">
                                <CardHeader
                                  className="modalheader color-white"
                                  action={
                                    <IconButton aria-label="close">
                                      <CloseIcon
                                        onClick={() => setOpenMap(false)}
                                      />
                                    </IconButton>
                                  }
                                  title="Location Map"
                                />
                                <CardContent className="modalbodycontent">
                                  <Grid container spacing={3}>
                                    <GoogleMaps
                                      fieldId={
                                        fieldData.trackedEntityAttribute.id
                                      }
                                      defaultOption={defaultOption}
                                      geoLat={currentGeolocation.lat}
                                      onGoogleLocationChange={
                                        onGoogleLocationChange
                                      }
                                      geoLng={currentGeolocation.lng}
                                    />
                                  </Grid>
                                </CardContent>
                                <CardActions className="modalfooter">
                                  <Button
                                    className="modalactionbtn"
                                    onClick={() => mapLocationSubmit()}
                                  >
                                    Ok
                                  </Button>
                                </CardActions>
                              </Card>
                            </div>
                          </div>,
                          document.body
                        )
                      ) : (
                        <></>
                      )}
                    </>
                  );
                })()}
              </>
            ) : (
              <></>
            )}
          </Grid>
        );
      } else {
        setFieldStructure(
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            className={
              (validationResult.hideShow == true
                ? "customAddLoc row " + customClassName
                : "hide") + getClassForAddress(fieldData)
            }
          >
            {customfieldobj.regAddressId ==
            fieldData.trackedEntityAttribute.id ? (
              <>
                <div>
                  <Grid container spacing={1} className="align-items-center">
                    <Grid item xs={10} sm={10} md={10} lg={10}>
                      {/* location-block */}
                      <div className="">
                        <Field
                          name={fieldData.trackedEntityAttribute.id}
                          label={getTranslatedLabels(
                            fieldData.trackedEntityAttribute
                          )}
                          type={"text"}
                          component={InputFieldFF}
                          key={fieldData.trackedEntityAttribute.id}
                          required={
                            fieldData.mandatory &&
                            validationResult.hideShow == true
                              ? true
                              : false
                          }
                          validate={composeValidators(required)} //fieldData.mandatory && validationResult.hideShow == true ? hasValue : false
                          className={customClassName}
                        />
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      sm={2}
                      md={2}
                      lg={2}
                      className="mapAddDiv align-items-center"
                    >
                      <img
                        onClick={(e) => {
                          const filteredOptions =
                            availableAddressOptions.filter((option) => {
                              // Get the element with the matching class
                              const element = document.querySelector(
                                "." + option.value
                              );

                              // Keep the option if:
                              // 1. The element doesn't exist at all (return true to keep it in the array)
                              // 2. The element exists but also has the "hide" class (return true to keep it in the array)
                              if (!element) {
                                return true; // Element doesn't exist, keep it in the array
                              } else {
                                // Check if the element has the "hide" class
                                return element.classList.contains("hide");
                              }
                            });

                          // Update the availableAddressOptions with the filtered list
                          availableAddressOptions = filteredOptions;

                          if (availableAddressOptions.length === 0) {
                            swal({
                              title: "No more Address details to be added",
                              icon: "warning",
                              button: "OK",
                              className: "custom-swalwarning",
                            });
                            return;
                          }

                          swal({
                            title: "Select type of address",
                            text: "",
                            content: {
                              element: "select",
                              attributes: {
                                id: "swal-dropdown",
                                innerHTML: `
                                                    <option value="" disabled selected>Select an option</option>
                                                    ${availableAddressOptions
                                                      .map(
                                                        (option) =>
                                                          `<option value="${option.value}">${option.label}</option>`
                                                      )
                                                      .join("")}
                                                `,
                              },
                            },
                            className: "custom-swal",
                            buttons: {
                              cancel: t("Cancel"),
                              confirm: {
                                text: "Submit",
                                closeModal: false,
                              },
                            },
                          }).then((value) => {
                            if (value != true) return;
                            const selectedValue =
                              document.getElementById("swal-dropdown").value;
                            if (!selectedValue) return;

                            setSelectedOptions((prevOptions) => [
                              ...prevOptions,
                              selectedValue,
                            ]); // Store selected option

                            setrenderKey(Math.random());
                            const elements =
                              document.getElementsByClassName(selectedValue);
                            for (let i = 0; i < elements.length; i++) {
                              elements[i].classList.remove("hide"); // Remove class
                            }
                            swal.close();
                          });
                        }}
                        style={{ height: "22px", cursor: "pointer" }}
                        src={imgUrl.plusIcon}
                        className="plusContactIcon"
                      />
                    </Grid>
                  </Grid>
                </div>
              </>
            ) : (
              <></>
            )}
            {isDropdownAttribute?.value == "true" ? (
              <>
                {(() => {
                  const attributeKey = findKeyByValue(
                    customfieldobj,
                    fieldData.trackedEntityAttribute.id
                  );

                  const hasValue = values[fieldData.trackedEntityAttribute.id]
                    ? ""
                    : " hide";
                  return (
                    <>
                      <div className={attributeKey + hasValue}>
                        <Grid
                          container
                          spacing={1}
                          className="align-items-center"
                        >
                          <Grid item xs={10} sm={10} md={10} lg={10}>
                            <Field
                              name={fieldData.trackedEntityAttribute.id}
                              label={getTranslatedLabels(
                                fieldData.trackedEntityAttribute
                              )}
                              type={"text"}
                              component={InputFieldFF}
                              key={fieldData.trackedEntityAttribute.id}
                              required={
                                fieldData.mandatory &&
                                validationResult.hideShow == true
                                  ? true
                                  : false
                              }
                              validate={composeValidators(required)} //fieldData.mandatory && validationResult.hideShow == true ? hasValue : false
                              className={customClassName}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            sm={2}
                            md={2}
                            lg={2}
                            className="mapAddDiv align-items-center"
                          >
                            <IconButton
                              onClick={(e) => {
                                const elements =
                                  document.getElementsByClassName(attributeKey);
                                for (let i = 0; i < elements.length; i++) {
                                  elements[i].classList.add("hide");
                                }
                                values[fieldData.trackedEntityAttribute.id] =
                                  null;
                              }}
                              style={{
                                height: "22px",
                                cursor: "pointer",
                                marginRight: "-1px",
                                padding: "0px",
                              }}
                              aria-label="close"
                            >
                              <Delete />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </div>
                    </>
                  );
                })()}
              </>
            ) : (
              <></>
            )}
          </Grid>
        );
      }
    }
  }, [
    renderKey,
    validationResult,
    openMap,
    defaultOption,
    localStorage.getItem("locale"),
  ]);

  return <>{fieldStructure != null ? fieldStructure : <> </>}</>;
}

function CreateField(props) {
  let fieldData = props.fieldData;
  let programRules = props.programRules;
  let programRulesVariables = props.programRulesVariables;
  let values = props.values;
  let availableAddressOptions = props.availableAddressOptions;
  let availableContactOptions = props.availableContactOptions;
  let programData = props.programData;
  let activeCaseDetails = props.activeCaseDetails;
  let linkContactFlag = props.linkContactFlag;
  let OUM = OUMapping(values);
  let OUJSON = props.OUJSON;
  let Configuration = props.Configuration;
  let customfieldobj = props.customfieldobj;
  let currentGeolocation = props.currentGeolocation;
  //const OUM = OUMapping(values)
  let mapLocation = props.selectLocation;
  let indexClient = props.indexClient;
  let userBO = props.userBO;
  let customClassName = props.customClassName;
  let cameraStatus = props.cameraStatus;
  let ismaskable = false;
  let formref = props.formRef;

  const isHealthWorker = userBO?.userRoles?.find(
    (role) => role.name === "healthworker"
  );

  const addToCustomObject =
    fieldData.trackedEntityAttribute.attributeValues?.find(
      (attr) => attr.attribute.name === "AddtoCustomObject"
    );

  let formattedKey = addToCustomObject?.value
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");

  if (addToCustomObject) {
    customfieldobj[formattedKey] = fieldData.trackedEntityAttribute.id;
  }

  // if (!isHealthWorker) {
  //   const isEncryptedAttribute =
  //     fieldData?.trackedEntityAttribute?.attributeValues?.find(
  //       (attr) =>
  //         attr.attribute?.name === "IsEncrypted" && attr.value === "true"
  //     );
  //   const isMaskedAttribute =
  //     fieldData?.trackedEntityAttribute?.attributeValues?.find(
  //       (attr) => attr.attribute?.name === "isMaskable" && attr.value === "true"
  //     );
  //   if (isEncryptedAttribute) {
  //     return null;
  //   }
  //   if (isMaskedAttribute) {
  //     ismaskable = true;
  //   }
  // }

  let rules = {
    programRule: props.programRules,
    programRuleVariable: props.programRulesVariables,
  };
  if (fieldData.trackedEntityAttribute.id == customfieldobj.dateofbirthyearID) {
    //fieldData.trackedEntityAttribute.valueType = 'TEXT'
    let yearOptions = [];
    const d = new Date();
    let currentYear = d.getFullYear();
    for (var i = 1960; i <= currentYear; i++) {
      yearOptions.push({
        code: i.toString(),
        id: i.toString(),
        displayName: i.toString(),
        translations: [],
      });
    }
    fieldData.trackedEntityAttribute.optionSet = {
      id: "yeraid",
      options: yearOptions,
    };
  }

  function checkFieldType() {
    const includeCustomFieldObj = shouldIncludeCustomFieldObj_("createfield");
    const onGoogleLocationChange = (value) => {
      props.onGoogleLocationChangeParent(value);
    };
    const enableGoogleLocation =
      fieldData.trackedEntityAttribute.attributeValues?.find(
        (attr) =>
          attr.attribute.name === "enableGoogleLocation" &&
          attr.value === "true"
      );
    switch (fieldData.trackedEntityAttribute.valueType) {
      case "TEXT":
        return fieldData.trackedEntityAttribute.unique ? (
          <DefaultValueField
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            linkContactFlag={linkContactFlag}
            customClassName={customClassName}
            ismaskable={ismaskable}
          />
        ) : fieldData.renderType &&
          fieldData.renderType["DESKTOP"] &&
          fieldData.renderType["DESKTOP"].type == "QR_CODE" ? (
          <QrCodeScanner
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            ismaskable={ismaskable}
          />
        ) : fieldData.trackedEntityAttribute.attributeValues ? (
          enableGoogleLocation?.value == "true" ? (
            <GoogleLocation
              fieldData={fieldData}
              programRules={programRules}
              programRulesVariables={programRulesVariables}
              values={values}
              programData={programData}
              linkContactFlag={linkContactFlag}
              onGoogleLocationChange={onGoogleLocationChange}
              customfieldobj={customfieldobj}
              currentGeolocation={currentGeolocation}
              mapLocation={mapLocation}
              availableAddressOptions={availableAddressOptions}
              defaultOption={
                values && values[fieldData.trackedEntityAttribute.id]
                  ? values[fieldData.trackedEntityAttribute.id]
                  : ""
              }
              customClassName={customClassName}
              ismaskable={ismaskable}
            />
          ) : (
            <InputFieldConfig
              fieldData={fieldData}
              programRules={programRules}
              programRulesVariables={programRulesVariables}
              values={values}
              programData={programData}
              activeCaseDetails={activeCaseDetails}
              linkContactFlag={linkContactFlag}
              Configuration={Configuration}
              customfieldobj={customfieldobj}
              indexClient={indexClient}
              userBO={userBO}
              customClassName={customClassName}
              ismaskable={ismaskable}
              formref={formref}
              availableContactOptions={availableContactOptions}
            />
          )
        ) : (
          <InputFieldConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            programData={programData}
            activeCaseDetails={activeCaseDetails}
            linkContactFlag={linkContactFlag}
            Configuration={Configuration}
            customfieldobj={customfieldobj}
            indexClient={indexClient}
            userBO={userBO}
            customClassName={customClassName}
            ismaskable={ismaskable}
          />
        );
      //case 'COORDINATE':
      // return <GoogleLocation
      //     fieldData={fieldData}
      //     programRules={programRules}
      //     programRulesVariables={programRulesVariables}
      //     values={values}
      //     linkContactFlag={linkContactFlag}
      // />
      case "IMAGE":

      case "FILE_RESOURCE":
        return (
          <ImageFieldConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            cameraStatus={cameraStatus}
            cameraClick={() => props.cameraClick()}
            cameraClose={() => props.cameraClose()}
            imagePath={props.imagePath}
            clearCameraImageClick={() => props.clearCameraImage()}
            ismaskable={ismaskable}
          />
        );

      case "DATE":
        return (
          <DateFieldConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            programData={programData}
            customfieldobj={customfieldobj}
            ismaskable={ismaskable}
            formref={formref}
            //   {...(includeCustomFieldObj ? { customfieldobj: {customfieldobj} } : {})}
          />
        );

      case "AGE":
        return (
          <AgeFieldConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            ismaskable={ismaskable}
          />
        );

      case "PHONE_NUMBER":
        return (
          <PhoneNumberFieldConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            customfieldobj={customfieldobj}
            ismaskable={ismaskable}
          />
        );

      case "EMAIL":
        return (
          <EmailFieldConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            ismaskable={ismaskable}
          />
        );
      case "BOOLEAN":
      case "TRUE_ONLY":
        if (
          programData.programSections.length > 0 &&
          programData.programSections.filter(
            (obj) =>
              obj.displayName == fieldData.trackedEntityAttribute.displayName
          ).length > 0
        ) {
          const filterDataElementGroup = programData.programSections.filter(
            (obj) =>
              obj.displayName == fieldData.trackedEntityAttribute.displayName
          )[0];
          return (
            <MultiSelectConfig
              fieldData={fieldData}
              programRules={programRules}
              programRulesVariables={programRulesVariables}
              values={values}
              DataElementGroup={filterDataElementGroup}
              programObj={programData}
              customfieldobj={customfieldobj}
              customClassName={customClassName}
              ismaskable={ismaskable}
            />
          );
        } else {
          let ShowFieldFlag = false;
          if (ShowFieldFlag) {
            return (
              <BooleanFieldConfig
                fieldData={fieldData}
                programRules={programRules}
                programRulesVariables={programRulesVariables}
                values={values}
                customClassName={customClassName}
                ismaskable={ismaskable}
              />
            );
          } else {
            return <> </>;
          }
          // return <BooleanFieldConfig
          //     fieldData={fieldData}
          //     programRules={programRules}
          //     programRulesVariables={programRulesVariables}
          //     values={values}
          // />
        }

      case "TIME":
        return (
          <TimeFieldConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            ismaskable={ismaskable}
          />
        );

      case "DATETIME":
        return (
          <DateTimeFieldConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            ismaskable={ismaskable}
          />
        );

      case "INTEGER":
      case "INTEGER_POSITIVE":
      case "INTEGER_NEGATIVE":
      case "INTEGER_ZERO_OR_POSITIVE":
      case "NUMBER":
        return (
          <IntegerConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customfieldobj={customfieldobj}
            customClassName={customClassName}
            programData={programData}
            ismaskable={ismaskable}
          />
        );
      case "LONG_TEXT":
        return (
          <TextAreaConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            ismaskable={ismaskable}
          />
        );

      case "USERNAME":
        return (
          <UserNameConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            ismaskable={ismaskable}
          />
        );

      case "URL":
        return (
          <URLConfig
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            customClassName={customClassName}
            ismaskable={ismaskable}
          />
        );

      case "ORGANISATION_UNIT":
        const defaultValue = values[fieldData.trackedEntityAttribute.id];

        let optionsId = "";
        let defaultOption = {};
        const childDropDown = JSON.parse(localStorage.getItem("childDropDown"));
        if (childDropDown != null) {
          const fieldOptionFilter = childDropDown.filter(
            (obj) => obj.fieldId == fieldData.trackedEntityAttribute.id
          );
          if (fieldOptionFilter.length > 0) {
            optionsId = fieldOptionFilter[0].value;
          }
        }
        if (defaultValue != undefined) {
          const LocationFilter = programData.organisationUnits.filter(
            (OU) => OU.id == values[fieldData.trackedEntityAttribute.id]
          );
          const locationName =
            LocationFilter.length > 0 ? LocationFilter[0].displayName : "";
          defaultOption = {
            id: values[fieldData.trackedEntityAttribute.id],
            label: locationName
              ? locationName
              : values[fieldData.trackedEntityAttribute.id],
            value: values[fieldData.trackedEntityAttribute.id],
          };

          if (OUM[fieldData.trackedEntityAttribute.id] != undefined) {
            if (OUM[fieldData.trackedEntityAttribute.id].parent != "") {
              optionsId =
                values[OUM[fieldData.trackedEntityAttribute.id].parent];
            }
          }
        }
        //LocationFilter, locationName optionsId, defaultValue,
        //if(optionsId != '') {

        return (
          <HandleOUOptions
            fieldData={fieldData}
            programRules={programRules}
            programRulesVariables={programRulesVariables}
            values={values}
            programData={programData}
            options={optionsId}
            defaultOption={defaultOption}
            OUMapping={OUM}
            OUJSON={OUJSON}
            customClassName={customClassName}
          />
        );
      // case 'BOOLEAN':

      //     if (programData.programSections.length > 0 &&
      //         programData.programSections.filter(
      //             (obj) => obj.displayName == fieldData.trackedEntityAttribute.displayName
      //         ).length > 0
      //     ) {
      //         const filterDataElementGroup = programData.programSections.filter(
      //             (obj) => obj.displayName == fieldData.trackedEntityAttribute.displayName
      //         )[0];

      //         return (
      //             <MultiSelectConfig
      //                 fieldData={fieldData}
      //                 programRules={programRules}
      //                 programRulesVariables={programRulesVariables}
      //                 values={values}
      //                 DataElementGroup={filterDataElementGroup}
      //                 programObj={programData}
      //                 customfieldobj={customfieldobj}
      //             />
      //         );
      //     } else {
      //         return <BooleanFieldConfig
      //             fieldData={fieldData}
      //             programRules={programRules}
      //             programRulesVariables={programRulesVariables}
      //             values={values}
      //         />
      //     }
      // case 'TRUE_ONLY':
      //     return <BooleanFieldConfig
      //         fieldData={fieldData}
      //         programRules={programRules}
      //         programRulesVariables={programRulesVariables}
      //         values={values}
      //     />
    }
  }

  return <>{checkFieldType()}</>;
}

//export default CreateField;
function mapStateToProps(state) {
  const { storeState } = state;
  return { selectLocation: storeState.selectLocation };
}

export default connect(mapStateToProps, { setLocationAction })(CreateField);
