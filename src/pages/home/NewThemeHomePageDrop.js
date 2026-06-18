import React, { Component, useState, useEffect, useRef } from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import classes from "../../App.module.css";
import axios from "axios";
import _ from "lodash";
import { connect } from "react-redux";
import { setLoginUser } from "../../redux/actions/action";
import "../../assets/css/customstyles.css";
//import "../../assets/css/theme_grey.css";
import "../../assets/css/theme_blue.css";
//import "../../assets/css/theme_green.css";
//import "../../assets/css/theme_red.css";

import "../../assets/css/customstyles.css";
//import "../../assets/css/theme_grey.css";
import "../../assets/css/theme_blue.css";
//import "../../assets/css/theme_green.css";
//import "../../assets/css/theme_red.css";

import { Link, Redirect, useHistory } from "react-router-dom";
// import { Link, useHistory } from "react-router-dom";
import { MenuItem, Menu, Tab, TabBar, Button } from "@dhis2/ui";

import {
  Apps,
  Settings,
  Account,
  Exit,
  Message,
  AttachFile,
  Email,
  FolderOpen,
} from "@dhis2/ui-icons";
import OfflineDb from "../../db";
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserPlus,
  faSearch,
  faBullhorn,
  faFileAlt,
  faFileInvoice,
  faEdit,
  faWifi,
  faCog,
  faSignOutAlt,
  faFileSignature,
  faUserFriends,
  faShareSquare,
  faPrescriptionBottle,
  faFlask,
  faPills,
  faMale,
  faRobot,
  faVideo,
  faEye,
  faFilePdf,
  faLanguage,
  faHdd,
  faExchangeAlt,
  faCommentMedical,
  faMapPin,
  faBookMedical,
  faCalendar,
  faCircleQuestion,
  faBookOpen,
  faBook,
  faSitemap,
  faBuilding,
  faCubes,
  faToolbox,
  faUsers,
  faChalkboardTeacher,
  faArrowRight,
  faHandsHelping,
  faQuestionCircle


} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import { Configuration } from "../../assets/data/config";
import { apiServices } from "../../services/apiServices";
import Customcircularprogress from "./Customcircularprogress.js";
import Customcircularprogress1 from "./Customcircularprogress1.js";
import Customcircularprogress2 from "./Customcircularprogress2.js";
import {
  setSidebarToggel,
  getPageRelaodFlag,
} from "../../redux/actions/action";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Disclaimer from "../../component/disclaimer/Disclaimer";
import imgUrl from "../../assets/images/imageUrl.js";
//import swal from 'sweetalert';
import swal from "@sweetalert/with-react";
import { Typography } from "@material-ui/core";
import { setLanguageList } from "../../redux/actions/action";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import Appointment from "../appointment/appointment";
import CardHeader from "@material-ui/core/CardHeader";
import CloseIcon from "@material-ui/icons/Close";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import EventIcon from "@mui/icons-material/Event";
import FilterIcon from "@mui/icons-material/FilterAlt";

import AreaChart from "../landingDashboard/AreaChart.js";
import BarChartPyramid from "../landingDashboard/BarChartPyramid.js";
import MyMapComponent from "../pateintDashboard/MyMapComponent.js";
import MyMapComponentDash from "../pateintDashboard/MyMapComponentdash.js";
import PieChart from "../landingDashboard/PieChart.js";
import LineChart from "../landingDashboard/LineChart.js";
import LineChart2 from "../landingDashboard/LineChart2.js";
import BloodPressureDash from "../landingDashboard/BloodPressureDash.js";
import BMIChartDash from "../landingDashboard/BMIChartDash.js";
import PulseChart from "../landingDashboard/PulseChart.js";
import InsulineTabs from "../landingDashboard/InsulineTabs.js";
import RiskFactorTreeChart from "../landingDashboard/RiskFactorTreeChart.js";
import HyperglycemicTreeChart from "../landingDashboard/HyperglycemicTreeChart.js";
import HypoglycemicTreeChart from "../landingDashboard/HypoglycemicTreeChart.js";
import PatientStatusBarChart from "../landingDashboard/PatientStatusBarChart.js";
import ComplicationTreeChart from "../landingDashboard/ComplicationTreeChart.js";
import DeathLineChart from "../landingDashboard/DeathLineChart.js";
import BasicTests from "../landingDashboard/BasicTest.js";

import InfoIcon from "@material-ui/icons/Info";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PatientHospitalVisits from "../landingDashboard/PatientHospitalVisits.js";
import BasicTestsTabs from "../landingDashboard/BasicTestsTabs.js";
import StockLineChart from "../landingDashboard/StockLineChart.js";
import StockBarChart from "../landingDashboard/StockBarChart.js";
import SocioEconomic from "../landingDashboard/SocioEconomic.js";
import { APP_LOCALE } from "../../assets/data/config.js";
// import NewThemeStockManagementHomePage from "./NewThemeStockManagementHomePage.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import { ChatBotWidget } from "chatbot-widget-ui";



const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);

function createData(type, insulinname, frequency, beforemeal, course, doses) {
  return { type, insulinname, frequency, beforemeal, course, doses };
}


function NewThemeHomePageDrop(props) {
  const [resources, setResources] = React.useState(JSON.parse(localStorage.getItem("translations")));
  const [value, setValue] = React.useState('en');
  const [isOpenChat, setIsOpenChat] = useState(false);
  const handleNewUserMessage = (newMessage) => {
    console.log(`New message: ${newMessage}`);
    // You can integrate API calls or chatbot responses here
    // addResponseMessage("Thanks for your message!");
  };

  // useEffect(() => {

  //   i18n
  //     .use(initReactI18next) // passes i18n down to react-i18next
  //     .init({
  //       resources,
  //       fallbackLng: 'en',
  //       lng: localStorage.getItem('locale') || value,//value, //localStorage.getItem('locale') ? localStorage.getItem('locale'): 'en',          
  //       keySeparator: false, // we do not use keys in form messages.welcome

  //       interpolation: {
  //         escapeValue: false // react already safes from xss
  //       },
  //       react: {
  //         useSuspense: false,
  //         wait: false,
  //       },
  //     });
  // },[])
  
  const customApiCall = async (message) => {
    console.log(message)
    const response = await fetch("https://llm.imonitorplus.com/vitalai/chatconversation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token e614a25d52419a9a46a915e06c4ffbed10a61a35`,
      },
      body: JSON.stringify({
        original_query: message,
        chat_history: [],
        bot_id: [`Bot482`],
        bot_type: "Type 1 Diabetes",
        enable_emoji: true,
        version: "v2",
        demographic_data: {}
      }),
    });
    const data = await response.json();
    return data.payload.choices[0].message.content;
  };

  const history = useHistory();
  const [ConfigurationFromServer, setConfigurationFromServer] = useState(null);
  const metaDataParam = Configuration.homepage.metaDataParam;
  const relationshipTypeParams = Configuration.homepage.relationshipTypeParam;
  const DEGParams = Configuration.homepage.DEGParams;
  const OUGroupParams = Configuration.homepage.OUGroupParam;
  const programRuleVariableParam =
    Configuration.homepage.programRuleVariableParam;
  const dataSetParams = Configuration.homepage.dataSets;
  const OUStructureParams = Configuration.homepage.OUStrutureParams;
  const [reloadData, setReloadDataFlag] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [programDetailsValue, setprogramDetailsValue] = React.useState(null);
  const [userConsent, setUserConsent] = React.useState(null);
  const [userConsentAttributeIndex, setUserConsentAttributeIndex] =
    React.useState(null);
  const [programData, setProgramData] = React.useState(null);
  const { t, i18n } = useTranslation();
  const [switchBoxFlag, setSwitchBoxFlag] = React.useState(false);
  const progressIncrement = progress + 10;
  const [registerdClient, setRegisterdClient] = React.useState(null);
  const [alertCount, setAlertCount] = React.useState(null);
  const [homePageCharts, setHomePageCharts] = React.useState(null);
  const [ageChart, setAgeChart] = React.useState(null);
  const [socioEconomicCharts, setsocioEconomicCharts] = React.useState(null);
  const [homePageMap, setHomePageMap] = React.useState(null);
  const [dashboardCards, setDashboardCards] = React.useState(null);
  const [dashboardLineChart, setDashboardLineChart] = React.useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [basicTabValue, setBasicTabValue] = useState(0);
  const [basicTestBarChart, setBasicTestBarChart] = React.useState(null);
  const [followUpChart, setFollowUpChart] = React.useState(null);
  const [transferInCount, setTransferInCount] = React.useState("0");
  const [transferOutCount, setTransferOutCount] = React.useState("0");
  const [transferInOutCount, setTransferInOutCount] = React.useState(null);
  const [referralCasesCount, setReferralCasesCount] = React.useState(null);
  const [referralCaseslist, setReferralCaseslist] = React.useState(null);
  const [myClientsCaseslist, setMyClientsCaseslist] = React.useState(null);
  const [userrolename, setuserrolename] = React.useState(null);
  const [appointmentPopup, setAppointmentPopup] = useState(null);
  const [openHomePageFilter, setOpenHomePageFilter] = React.useState(false);
  const patientRole = "Patient Role";
  const superAdmin = "superuser";
  const facilityUser = "facilityUser";
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const dataSetValidationApi = Configuration.homepage.dataSetValidations;
  const [hypertensionCount, setHypertensionCount] = React.useState(null);
  const [diabetesCount, setDiabetesCount] = React.useState(null);
  const [followupCount, setfollowupCount] = React.useState(null);
  const [COPDCount, setCOPDCount] = React.useState(null);
  const [asthmaCount, setAsthmaCount] = React.useState(null);
  const [tertiaryCount, setTertiaryCount] = React.useState(null);
  const [periodType, setPeriodType] = React.useState("Yearly");
  const [periodTypeD, setPeriodTypeD] = React.useState("Yearly");
  const [tempStartdate, setTempStartDate] = React.useState(new Date().getFullYear());
  const [tempEnddate, setTempEndDate] = React.useState("");
  const [startdate, setStartDate] = React.useState(new Date().getFullYear());
  const [enddate, setEndDate] = React.useState("");
  const [tempYear, setTempYear] = useState(new Date().getFullYear());
  const [tempMonth, setTempMonth] = useState('01');
  const [tempPeriodType, setTempPeriodType] = useState('Yearly');
  const [lineChartType, setLineChartType] = useState(
    APP_LOCALE === 'CC008' ? 'Basal Insulin' : 'Insulin'
  );
  const [basicTestChartType, setBasicTestChartType] = useState('Basic Test');
  const filterRef = useRef(null);
  // Stock Management Dashboard Indicators & Charts
  const [inventoryItemsCount, setInventoryItemsCount] = useState(0);
  const [currentStockoutsCount, setCurrentStockoutsCount] = useState(0);
  const [reachedThresholdCount, setReachedThresholdCount] = useState(0);
  const [stockBarChartData, setStockBarChartData] = useState([]);
  const [stockLineChartData, setStockLineChartData] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear()); // State for the selected year



  const icons = {
    faHome,
    faUserPlus,
    faSearch,
    faBullhorn,
    faFileAlt,
    faUsers,
    faFileInvoice,
    faEdit,
    faWifi,
    faCog,
    faSignOutAlt,
    faFileSignature,
    faUserFriends,
    faShareSquare,
    faPrescriptionBottle,
    faFlask,
    faPills,
    faMale,
    faRobot,
    faVideo,
    faEye,
    faFilePdf,
    faLanguage,
    faHdd,
    faExchangeAlt,
    faCalendar,
    faBook,
    faSitemap,
    faBuilding,
    faCubes,
    faToolbox,
    faChalkboardTeacher,
    faArrowRight,
    faHandsHelping,
    faQuestionCircle
  };

  const rows = [
    { name: "Insulin pump", type: "Intermediate acting insulin", insulinname: "Humuline", frequency: "3 times a day", beforemeal: "Before Meal", course: "60", doses: "12-14-16" },

  ];

  const rowsSecondTable = [
    { name: "Insulin pump", insulinname: "Humuline", frequency: "3 times a day", beforemeal: "Before Meal", course: "60", doses: "12-14-16" },
  ]

  async function getUserBo() {
    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);

    let programDetails = await OfflineDb.getDataFromPouchDB("programBoDetails");
    setprogramDetailsValue(programDetails)

    let configurations = await OfflineDb.getDataFromPouchDB("configurations");
    setConfigurationFromServer(configurations.data.configuration);
  }
  useEffect(() => {
    if (localStorage.getItem("showCases")) {
      localStorage.removeItem("showCases");
    }
    if (localStorage.getItem("stagesShow")) {
      localStorage.removeItem("stagesShow");
    }
  }, []);

  useEffect(() => {
    getUserBo();
    i18n.changeLanguage(localStorage.getItem("locale"));
  }, []);

  useEffect(() => {
    if (progress == 100) {
      setReloadDataFlag(false);
    }
  }, [progress]);

  useEffect(() => {
    if (sessionUserBoValue != null) {
      setuserrolename(
        sessionUserBoValue?.userRoles[0]?.name ||
        sessionUserBoValue?.userRoles[0]?.displayName
      );
      checkUserConsent();
    }
  }, [sessionUserBoValue]);

  useEffect(() => {

    OfflineDb.removeDataFromPouchDB("activeCaseDetails");
    OfflineDb.removeDataFromPouchDB("activeCaseFormData");
    OfflineDb.removeDataFromPouchDB("linkContactFlag");
    OfflineDb.setDataIntoPouchDB("transferFlag", { type: null });
    if (reloadData == true) {
      OfflineDb.getDataFromPouchDB("loginDetails").then((loginDetails) => {
        if (loginDetails.data != undefined) {
          //First Call
          apiServices
            .getAPI(
              "programs.json?fields=[id,displayFormName,publicAccess,organisationUnit[id,path,displayName]]&paging=false&filter=id:in:[" +
              loginDetails.data.programs?.toString() +
              "]"
            )
            .then((programsDetails) => {
              const filterProgramWithAccess =
                programsDetails.data.programs.filter(
                  (obj) => obj.publicAccess == "rwrw----"
                );
              //programBoDetails
              OfflineDb.getDataFromPouchDB("programBoDetails").then(
                (programBoDetails) => {
                  let metafinalurl =
                    "metadata?fields=:owner,displayName&programs:filter=id:eq:" +
                    programBoDetails.data.programuid +
                    "&programs:fields=:owner,displayName,description,attributeValues[:all,attribute[id,name,displayName,description,formName]],organisationUnits[id,path,displayName,description,level],dataEntryForm[:owner],programSections[id,name,displayName,formName,description,translations[*],renderType,program,sortOrder,lastUpdated,trackedEntityAttributes[id,name,displayName,formName,description,code,sortOrder,attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id]]],notificationTemplates[:owner],programTrackedEntityAttributes[:owner,renderType,trackedEntityAttribute[id,displayName,formName,description,translations[*],valueType,unique,optionSet[id,options[id,code,displayName,description,translations[*],style]],attributeValues[:all,attribute[id,name,displayName,description]],domainType]],user[id,name],programStages[:owner,user[id,name],userAccesses,userGroupAccesses,displayName,description,attributeValues[:all,attribute[id,name,displayName,description]],programStageDataElements[:owner,renderType,unique,dataElement[id,displayName,description,formName,displayFormName,unique,valueType,fieldMask,translations[*],attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id,options[id,code,displayName,description,translations[*],%20style]],domainType]],notificationTemplates[:owner,displayName,description],dataEntryForm[:owner],programStageSections[:owner,displayName,description,translations[*],dataElements[id,displayName,description]]]&dataElements:fields=id,displayName,formName,description,valueType,translations[*],optionSet&dataElements:filter=domainType:eq:TRACKER&trackedEntityAttributes:fields=id,displayName,formName,description,valueType,optionSet[id,options[id,code,displayName,description,style]],unique";

                  let tempHolder = {
                    "type": "GET",
                    "url": metafinalurl,
                    "data": null
                  }


                  //Second call //metaDataParam
                  apiServices.getedAPI(tempHolder).then((metaData) => {
                    // apiServices.getAPI(metafinalurl).then((metaData) => {
                    metaData.data.programs.map((programs) => {
                      const filterOU = programs.organisationUnits.find(
                        (array) =>
                          array.id ==
                          loginDetails.data["organisationUnits"][0].id
                      );

                      if (filterOU != undefined) {
                        metaData.data.programs = [programs];
                        loginDetails.data.programs = [
                          metaData.data.programs[0].id,
                        ];

                        OfflineDb.setDataIntoPouchDB(
                          "loginDetails",
                          loginDetails.data
                        );
                        setProgress(10);
                        OfflineDb.setDataIntoPouchDB("metaData", metaData.data);
                        setProgress(20);
                        //need for consent
                        //setProgramData(metaData.data)
                        metaData.data.programs[0].programTrackedEntityAttributes.map(
                          (TEAField) => {
                            if (
                              TEAField.trackedEntityAttribute.unique &&
                              TEAField.trackedEntityAttribute.description &&
                              TEAField.trackedEntityAttribute.description.toLocaleLowerCase() ==
                              "uic"
                            ) {
                              //setUICFieldId(TEAField.trackedEntityAttribute.id)
                              let generateOfflineUICUrl = `33/trackedEntityAttributes/${TEAField.trackedEntityAttribute.id}/generateAndReserve?numberToReserve=50`;
                              apiServices
                                .getAPI(generateOfflineUICUrl)
                                .then((response) => {
                                  OfflineDb.setDataIntoPouchDB(
                                    "offlineUICList",
                                    response.data
                                  );
                                });
                            }
                          }
                        );
                      } else {
                        OfflineDb.setDataIntoPouchDB("metaData", metaData.data);
                        setProgress(20);
                      }
                    });

                    //Third call
                    apiServices
                      .getAPI(relationshipTypeParams)
                      .then((response) => {
                        const relationshipTypes =
                          response.data.relationshipTypes;
                        if (relationshipTypes.length > 0) {
                          relationshipTypes.map((relationshipType) => {
                            if (
                              relationshipType.fromConstraint.program.id ==
                              loginDetails.data.programs[0]
                            ) {
                              OfflineDb.setDataIntoPouchDB(
                                "relationshipTypeId",
                                relationshipType.id
                              );
                              setProgress(30);
                            } /*else {
                                                          OfflineDb.setDataIntoPouchDB('relationshipTypeId', "")
                                                          setProgress(30)
                                                      }*/
                          });
                        } /*else {
                                                  OfflineDb.setDataIntoPouchDB('relationshipTypeId', "")
                                                  setProgress(30)
                                              }*/

                        //Fourth Call
                        apiServices
                          .getAPI(DEGParams)
                          .then((dataElementGroup) => {
                            //sort dataElementGroup
                            dataElementGroup.data.dataElementGroups.map(
                              (dataElementGroups) => {
                                metaData.data.programs[0].programStages.map(
                                  (programStages) => {
                                    let findDataElementInStage =
                                      programStages.programStageDataElements.find(
                                        (x) =>
                                          x.dataElement.displayName ==
                                          dataElementGroups.displayName
                                      );
                                    if (findDataElementInStage) {
                                      dataElementGroups.dataElements.map(
                                        (dataElements) => {
                                          let findDataElementOptionsInStage =
                                            programStages.programStageDataElements.find(
                                              (x) =>
                                                x.dataElement.id ==
                                                dataElements.id
                                            );
                                          if (findDataElementOptionsInStage) {
                                            dataElements["sortOrder"] =
                                              findDataElementOptionsInStage.sortOrder;
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                                dataElementGroups.dataElements = _.orderBy(
                                  dataElementGroups.dataElements,
                                  ["sortOrder"],
                                  ["asc"]
                                );
                              }
                            );
                            OfflineDb.setDataIntoPouchDB(
                              "dataElementGroup",
                              dataElementGroup.data
                            );
                            setProgress(40);

                            //Fifth Call
                            apiServices
                              .getAPI(OUGroupParams)
                              .then((OUGroups) => {
                                OfflineDb.setDataIntoPouchDB(
                                  "organisationUnitGroups",
                                  OUGroups.data
                                );
                                setProgress(50);
                                const programRuleParam =
                                  "programRules?filter=program.id:eq:" +
                                  loginDetails.data.programs[0] +
                                  "&filter=name:ne:default&fields=id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],option[id],optionGroup[id],programIndicator[id],programStage[id]]&paging=false";

                                apiServices
                                  .getAPI(programRuleParam)
                                  .then((programRule) => {
                                    OfflineDb.setDataIntoPouchDB(
                                      "programRules",
                                      programRule.data
                                    );
                                    setProgress(60);

                                    apiServices
                                      .getAPI(
                                        programRuleVariableParam +
                                        "&filter=program.id:eq:" +
                                        loginDetails.data.programs[0]
                                      )
                                      .then((programRuleVariable) => {
                                        OfflineDb.setDataIntoPouchDB(
                                          "programRulesVariables",
                                          programRuleVariable.data
                                        );
                                        setProgress(70);
                                        apiServices
                                          .getAPI(dataSetParams)
                                          .then((dataSet) => {
                                            OfflineDb.setDataIntoPouchDB(
                                              "dataEntrySet",
                                              dataSet.data
                                            );
                                            setProgress(80);
                                            apiServices
                                              .getAPI(dataSetValidationApi)
                                              .then((dataSetRules) => {
                                                OfflineDb.setDataIntoPouchDB(
                                                  "datasetRules",
                                                  dataSetRules.data
                                                    ? dataSetRules.data
                                                      .validationRules
                                                      ? dataSetRules.data
                                                        .validationRules
                                                      : []
                                                    : []
                                                );
                                                setProgress(90);
                                                
                                                let ouAPI = OUStructureParams;
                                                if (
                                                  programBoDetails &&
                                                  programBoDetails.data &&
                                                  programBoDetails.data.orguid
                                                ) {
                                                  ouAPI =
                                                    "organisationUnits/" +
                                                    programBoDetails.data
                                                      .orguid +
                                                    "?includeDescendants=true&paging=false&fields=id,level,name,displayFormName,children,comment";
                                                }
                                                apiServices
                                                  .getAPI(ouAPI)
                                                  .then((OUStructureParams) => {
                                                    OfflineDb.setDataIntoPouchDB(
                                                      "OUStructureJSON",
                                                      OUStructureParams.data
                                                    );
                                                    setProgress(100);
                                                    setReloadDataFlag(false);
                                                  });
                                              });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
                }
              );
            });
        }
      });
    } else {
      if (reloadData == false) {
        OfflineDb.getDataFromPouchDB("dataElementGroup").then(
          (dataElementGroup) => {
            if (dataElementGroup.data == undefined) {
              if (!reloadData) {
                setReloadDataFlag(true);
              }
            }

            if (reloadData == false) {
              OfflineDb.getDataFromPouchDB("metaData").then((metaData) => {
                if (metaData.data == undefined) {
                  if (!reloadData) {
                    setReloadDataFlag(true);
                  }
                }
                //need for consent
                setProgramData(metaData.data);

                OfflineDb.getDataFromPouchDB("loginDetails").then(
                  (loginDetails) => {
                    if (loginDetails.data != undefined) {
                      try {
                        if (
                          loginDetails.data.programs &&
                          loginDetails.data.programs.length == 1
                        ) {
                          // API calls for Stock Management Dashboard (Facility User Specific)
                          if (loginDetails.data.userRoles[0].name == "facilityUser") {
                            getStockManagementData(startdate, periodType, loginDetails.data.organisationUnits[0].id)
                          }
                          else {

                            getAlertCount(
                              loginDetails.data.programs[0],
                              loginDetails.data.organisationUnits[0].id
                            );
                            getCustomCharts(
                              loginDetails.data.programs[0],
                              loginDetails.data.organisationUnits[0].id
                            );
                            getDashboardMap(
                              loginDetails.data.programs[0],
                              loginDetails.data.organisationUnits[0].id
                            );
                            getBasicTestBarChart(
                              loginDetails.data.programs[0],
                              loginDetails.data.organisationUnits[0].id
                            );
                            getDashboardCards(
                              loginDetails.data.programs[0],
                              loginDetails.data.organisationUnits[0].id
                            );
                            getDashboardLineCharts(
                              loginDetails.data.programs[0],
                              loginDetails.data.organisationUnits[0].id
                            );
                            getFollowUpChart(
                              loginDetails.data.programs[0],
                              loginDetails.data.organisationUnits[0].id
                            )
                            if (APP_LOCALE === 'CC008') {
                              getSocioEconomicCharts(
                                loginDetails.data.programs[0],
                                loginDetails.data.organisationUnits[0].id
                              );
                            }
                          }
                        }
                      } catch (e) { }
                      const versionCheckParam =
                        "metadata?fields=:owner,displayName&programs:filter=id:eq:" +
                        loginDetails.data?.programs[0] +
                        "&programs:fields=:owner,unique,playName,attributeValues[:all,attribute[id,name,displayName]]";


                      let tempHolder = {
                        "type": "GET",
                        "url": versionCheckParam,
                        "data": null
                      }
                      apiServices
                        .getedAPI(tempHolder)
                        .then((versionCheck) => {
                          // apiServices
                          // .getAPI(versionCheckParam)
                          // .then((versionCheck) => {
                          //debugger
                          if (
                            metaData.data != undefined &&
                            versionCheck.data != undefined &&
                            Array.isArray(versionCheck.data.programs)
                          ) {
                            if (
                              versionCheck.data.programs[0].version !=
                              metaData.data.programs[0].version
                            ) {
                              if (!reloadData) {
                                setReloadDataFlag(true);
                              }
                            }
                            // logic for mobile app
                            if (window.cordova) {
                              let result = _.filter(
                                versionCheck.data.programs[0].attributeValues,
                                ["attribute.name", "AppVersion"]
                              );
                              if (
                                result.length > 0 &&
                                result[0].value !=
                                Configuration.mobileAppVersion
                              ) {
                                swal({
                                  title: t("Application update"),
                                  text: "The current version of the application is no longer supported. Kindly upgrade the same!",
                                  icon: "warning",
                                  button: t("Ok"),
                                }).then((res) => {
                                  window.open(
                                    Configuration.mobileAppDownloadUrl,
                                    "_system"
                                  );
                                });
                              }
                            }
                          }
                        });
                    }
                  }
                );

                if (reloadData == false) {
                  OfflineDb.getDataFromPouchDB("organisationUnitGroups").then(
                    (organisationUnitGroups) => {
                      if (organisationUnitGroups.data == undefined) {
                        if (!reloadData) {
                          setReloadDataFlag(true);
                        }
                      }

                      if (reloadData == false) {
                        OfflineDb.getDataFromPouchDB("programRules").then(
                          (programRules) => {
                            if (programRules.data == undefined) {
                              if (!reloadData) {
                                setReloadDataFlag(true);
                              }
                            }

                            if (reloadData == false) {
                              OfflineDb.getDataFromPouchDB("dataEntrySet").then(
                                (dataEntrySet) => {
                                  if (dataEntrySet.data == undefined) {
                                    if (!reloadData) {
                                      setReloadDataFlag(true);
                                    }
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          }
        );
      }
    }
  }, [reloadData, periodType, startdate, enddate]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openHomePageFilter]);

  useEffect(() => {

    OfflineDb.getDataFromPouchDB("loginDetails").then(
      (loginDetails) => {
        if (loginDetails.data != undefined) {
          try {
            if (
              loginDetails.data.programs &&
              loginDetails.data.programs.length == 1
            ) {
              getDashboardLineCharts(
                loginDetails.data.programs[0],
                loginDetails.data.organisationUnits[0].id
              )
            }
          } catch (e) { }

        }
      })

  }, [lineChartType]);

  useEffect(() => {
    OfflineDb.getDataFromPouchDB("loginDetails").then(
      (loginDetails) => {
        if (loginDetails.data != undefined) {
          try {
            if (
              loginDetails.data.programs &&
              loginDetails.data.programs.length == 1
            ) {
              getBasicTestBarChart(
                loginDetails.data.programs[0],
                loginDetails.data.organisationUnits[0].id
              )
            }
          } catch (e) { }

        }
      })

  }, [basicTestChartType]);


  function getAlertCount(programId, orgId) {
    let param = {
      param1: programId,
      param2: orgId,
    };
    apiServices
      .postAPI("common/getindicators/Get_customs_Clients_Alerts_counts", param)
      .then((result) => {
        if (result && result.data && result.data.data) {
          let regClient = _.find(result.data.data, {
            variablename: "ClientReg",
          });
          let alertsCount = _.find(result.data.data, {
            variablename: "Alert_counts",
          });
          let referralCasesCount = _.find(result.data.data, {
            variablename: "Referral",
          });
          let transferInCount = _.find(result.data.data, {
            variablename: "Transfer In",
          });
          let transferOutCount = _.find(result.data.data, {
            variablename: "Transfer Out",
          });
          let hypertensionData = _.find(result.data.data, {
            variablename: "Hypertension & CVD",
          });
          if (hypertensionData) {
            setHypertensionCount(hypertensionData.numbercount);
          }
          let diabetesData = _.find(result.data.data, {
            variablename: "Diabetes",
          });
          if (diabetesData) {
            setDiabetesCount(diabetesData.numbercount);
          }
          let asthmaData = _.find(result.data.data, {
            variablename: "Asthma",
          });
          if (asthmaData) {
            setAsthmaCount(asthmaData.numbercount);
          }
          let COPDData = _.find(result.data.data, {
            variablename: "COPD",
          });
          if (COPDData) {
            setCOPDCount(COPDData.numbercount);
          }
          let tertiaryData = _.find(result.data.data, {
            variablename: "Referred for tertiary hospitals",
          });
          if (tertiaryData) {
            setTertiaryCount(tertiaryData.numbercount);
          }
          if (regClient) {
            setRegisterdClient(regClient.numbercount);
          }
          if (alertsCount) {
            setAlertCount(alertsCount.numbercount);
          }
          if (referralCasesCount) {
            setReferralCasesCount(referralCasesCount.numbercount);
          }
          if (transferInCount) {
            setTransferInCount(transferInCount.numbercount);
          }
          if (transferOutCount) {
            setTransferOutCount(transferOutCount.numbercount);
          }
          let followupData = _.find(result.data.data, {
            variablename: "Follow Up",
          });
          if (followupData) {
            setfollowupCount(followupData.numbercount);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // API calls for the Stock Management Indicators & Charts 
  function getStockManagementData(startDate, periodType, orgid) {
    apiServices
      .getAPI("dashboardIndicator/getStockData/get_custom_stock_box?orguid=" + orgid + "&periodtype=" + periodType + "&periodvalue=" + startDate)
      .then((res) => {
        res.data.data.forEach(item => {
          if (item.indicatorname === "INVENTORY ITEMS") {
            setInventoryItemsCount(item.counts);
          } else if (item.indicatorname === "CURRENT STOCKOUTS") {
            setCurrentStockoutsCount(item.counts);
          } else if (item.indicatorname === "REACHED THRESOHILD") {
            setReachedThresholdCount(item.counts);
          }
        });
      });
    apiServices
      .getAPI("dashboardIndicator/getStockData/get_custom_stock_barchart?orguid=" + orgid + "&periodtype=" + periodType + "&periodvalue=" + startDate)
      .then((response) => {
        setStockBarChartData(response.data.data)
      });
    apiServices
      .getAPI("dashboardIndicator/getStockData/get_custom_stock_linechart?orguid=" + orgid + "&periodtype=Yearly&periodvalue=" + new Date().getFullYear())
      .then((lineres) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const drugs = {};

        lineres.data.data.forEach(item => {
          const monthIndex = months.indexOf(item.month.trim());
          if (!drugs[item.name]) {
            drugs[item.name] = new Array(12).fill(0);
          }
          drugs[item.name][monthIndex] = item.sums;
        });

        const series = Object.keys(drugs).map(name => ({
          name,
          data: drugs[name]
        }));

        setStockLineChartData(series)
      });
  }
  // API calls for the charts start here ---------->
  function getCustomCharts(programId, orgId) {
    apiServices
      .getAPI(
        "dashboardIndicator/getCustomChart1?programuid=" +
        programId +
        "&orguid=" +
        orgId +
        "&periodtype=" + periodType + "&startdate=" + startdate + "&enddate=" + enddate
      )
      .then((result) => {
        if (result && result.data && result.data.data) {
          setHomePageCharts(result.data.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getSocioEconomicCharts(programId, orgId) {
    apiServices
      .getAPI(
        "dashboardIndicator/getCustomBarChart?programuid=" +
        programId +
        "&orguid=" +
        orgId +
        "&periodtype=" + periodType + "&startdate=" + startdate + "&enddate=" + enddate
      )
      .then((result) => {
        if (result && result.data && result.data.data) {
          setsocioEconomicCharts(result.data.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getDashboardMap(programId, orgId) {
    apiServices
      .getAPI(
        "dashboardIndicator/getDashboardMap?programuid=" +
        programId +
        "&orguid=" +
        orgId +
        "&periodtype=" + periodType + "&startdate=" + startdate + "&enddate=" + enddate
      )
      .then((result) => {
        if (result && result.data && result.data.data) {
          setHomePageMap(result.data.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getDashboardCards(programId, orgId) {
    apiServices
      .getAPI(
        "dashboardIndicator/getDashboardBox?programuid=" +
        programId +
        "&orguid=" +
        orgId +
        "&periodtype=" + periodType + "&startdate=" + startdate + "&enddate=" + enddate
      )
      .then((result) => {
        if (result && result.data && result.data.data) {
          setDashboardCards(result.data.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getDashboardLineCharts(programId, orgId) {
    apiServices
      .getAPI(
        "dashboardIndicator/getLineChart?programuid=" +
        programId +
        "&orguid=" +
        orgId +
        "&charttype=" + lineChartType + "&periodtype=Yearly&periodvalue=" + startdate
      )
      .then((result) => {
        if (result && result.data && result.data.data) {
          setDashboardLineChart(result.data.data);
          setSelectedYear(startdate);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getBasicTestBarChart(programId, orgId) {
    apiServices
      .getAPI(
        "dashboardIndicator/getBasicTestChart?programuid=" +
        programId +
        "&orguid=" +
        orgId +
        "&periodtype=" + periodType + "&startdate=" + startdate + "&enddate=" + enddate + "&charttype=" + basicTestChartType
      )
      .then((result) => {
        if (result && result.data && result.data.data) {
          setBasicTestBarChart(result.data.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getFollowUpChart(programId, orgId) {
    apiServices
      .getAPI(
        "dashboardIndicator/getRegistrationCount?programuid=" +
        programId +
        "&orguid=" +
        orgId +
        "&periodtype=" + periodType + "&periodvalue=" + (periodType === "Yearly" ? startdate : new Date().getFullYear())
      )
      .then((result) => {
        if (result && result.data && result.data.data) {
          setFollowUpChart(result.data.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // End of Charts API call ------------------------>
  const handleTabChange = (newValue) => {
    setTabValue(newValue);

    if (APP_LOCALE === 'CC008') {
      setLineChartType(newValue === 1 ? 'Bolus Insulin' : newValue === 2 ? 'Glucose' : newValue === 0 ? 'Basal Insulin' : '');
    } else {
      setLineChartType(newValue === 1 ? 'HbA1c' : newValue === 2 ? 'Glucose' : newValue === 0 ? 'Insulin' : '');
    }
  };

  const handleBasicChartTabChange = (newValue) => {
    setBasicTabValue(newValue);
    setBasicTestChartType(newValue === 1 ? 'Lipid Profile' : newValue === 2 ? 'Thyroid Profile' : newValue === 0 ? 'Basic Test' : '');
  };

  // Filter functions start here --------------------->
  const openFilter = () => {
    setOpenHomePageFilter(!openHomePageFilter);
  };

  const handleTempPeriodTypeChange = (event) => {
    setTempPeriodType(event.target.value);
  };

  const handleStartDateChange = (e) => {
    setTempStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setTempEndDate(e.target.value);
  };

  const handleFilterSubmit = () => {
    // Handle form submission logic here
    setPeriodType(tempPeriodType);
    if (tempPeriodType && tempPeriodType == "Yearly") {
      setStartDate(tempYear);
      setPeriodTypeD("Yearly")
    }
    else if (tempPeriodType && tempPeriodType == "Monthly") {
      setStartDate(tempYear + '-' + tempMonth)
      setPeriodTypeD("Monthly")
    }
    else {
      setStartDate(tempStartdate);
      setPeriodTypeD("Date Range")
    }
    setEndDate(tempEnddate);
    handleCloseFilter();
  };

  const handleFilterReset = () => {
    setTempPeriodType('Yearly');
    setTempYear(new Date().getFullYear())
    setTempMonth(new Date().getMonth())
    setTempStartDate('');
    setTempEndDate('');

  };

  const handleCloseFilter = () => {
    setOpenHomePageFilter(!openHomePageFilter)
  };

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      handleCloseFilter();
    }
  };

  const generateYearOptions = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  let years = generateYearOptions(2020, new Date().getFullYear());

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const handleTempYearChange = (e) => {
    setTempYear(e.target.value);
  };

  const handleTempMonthChange = (e) => {
    setTempMonth(e.target.value);
  };

  // End of Filter functions ------------------------>



  function checkUserConsent() {
    if (
      sessionUserBoValue != null &&
      sessionUserBoValue.attributeValues &&
      sessionUserBoValue.attributeValues.length > 0
    ) {
      sessionUserBoValue.attributeValues.map((val, indx) => {
        // if (val.attribute.displayName === "IsConsent" && val.value == "true") {
        //   setUserConsent(true);
        //   setUserConsentAttributeIndex(indx);
        //   //alert("consent submitted")
        // } else {
        //   setUserConsent(false);
        //   setUserConsentAttributeIndex(indx);
        // }
        if (val.attribute.displayName === "IsConsent") {
          //} && val.value == "true") {
          if (val.value == "true") {
            setUserConsent(true);
            setUserConsentAttributeIndex(indx);
          } else {
            setUserConsent(false);
            setUserConsentAttributeIndex(indx);
          }
        }
      });
    }
  }
  function setConset() {
    setUserConsent(true);
  }

  useEffect(() => {
    // Event listeners to update the online/offline state
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const onMenuClick = (menuName, menuData) => {
    if (menuName === "Logout") {
      OfflineDb.getAllEntities().then((res) => {
        if (res === undefined || res.total_rows === 0) {
          localStorage.clear();
          OfflineDb.deleteDatabse()
            .then(() => {
              props.setLoginUser(false);
            })
            .catch(() => {
              props.setLoginUser(false);
            });
        } else {
          swal({
            title: t("Offline data"),
            text: t("Offline records found, please sync data before logout"),
            icon: "warning",
            buttons: t("Close"),
          });
        }
      });
    } else if (menuName === "Settings" && !navigator.onLine) {
      swal({
        title: t("Offline mode"),
        text: t("This operation is not available while offline. Please go online to proceed."),
        icon: "warning",
        buttons: t("Close"),
      }).then(() => {
        history.push("/layout/home");
      });
    } else if (menuName === "Users") {
      if (window.cordova && window.cordova.InAppBrowser) {
        window.cordova.InAppBrowser.open(
          Configuration.apiSurvey.key + "dhis-web-user/#/",
          "_system"
        );
      } else {
        window.open(Configuration.apiSurvey.key + "dhis-web-user/#/", "_blank");
      }
    } else if (menuName === "Organisations") {
      if (window.cordova && window.cordova.InAppBrowser) {
        window.cordova.InAppBrowser.open(
          Configuration.apiSurvey.key +
          "dhis-web-maintenance/index.html#/list/organisationUnitSection/organisationUnit",
          "_system"
        );
      } else {
        window.open(
          Configuration.apiSurvey.key +
          "dhis-web-maintenance/index.html#/list/organisationUnitSection/organisationUnit",
          "_blank"
        );
      }
    } else {
      history.push(menuData.path || "/layout/home");
    }
  };

  function renderPatientMenuitems() {
    return (
      <Menu className="">
        <Link
          className={classes.noDeco}
          // to="/myjourney"
          to="/historypatient"
          //onClick={() => onMenuClick(menuItems.name)}
          key={"0"}
        // state={{test: 'test'}}
        >
          <MenuItem
            // className="menuitem"
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faCalendar} />}
            label={t("My Journey")}
          />
        </Link>
        <Link
          className={classes.noDeco}
          to="/layout/peerchat"
          //onClick={() => onMenuClick(menuItems.name)}
          key={"0"}
        // state={{test: 'test'}}
        >
          <MenuItem
            // className="menuitem"
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faCommentMedical} />}
            label={t("Get Connected")}
          />
        </Link>
        <Link
          className={classes.noDeco}
          to="/layout/nearme"
          //onClick={() => onMenuClick(menuItems.name)}
          key={"0"}
        // state={{test: 'test'}}
        >
          <MenuItem
            // className="menuitem"
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faMapPin} />}
            label={t("Nearme")}
          />
        </Link>
        <Link
          className={classes.noDeco}
          to="/layout/widgetlist"
          //onClick={() => onMenuClick(menuItems.name)}
          key={"0"}
        // state={{test: 'test'}}
        >
          <MenuItem
            // className="menuitem"
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faBookMedical} />}
            label={t("Health Tools")}
          />
        </Link>
        <Link
          className={classes.noDeco}
          to="/layout/diseaseadvpro"
          //onClick={() => onMenuClick(menuItems.name)}
          key={"0"}
        // state={{test: 'test'}}
        >
          <MenuItem
            // className="menuitem"
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faBookOpen} />}
            label={t("Education And Knowledge")}
          />
        </Link>
        <Link
          className={classes.noDeco}
          to={""}
          onClick={() => onMenuClick("Logout")}
          key={"7"}
        // state={{test: 'test'}}
        >
          <MenuItem
            // className="menuitem"
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faSignOutAlt} />}
            label={t("Logout")}
          />
        </Link>
      </Menu>
    );
  }

  function renderNewStyleMenuitems() {
    //const roleBasedArray = programDetailsValue.data.roleBasedArray;
    let userRoleData;
    if (userrolename == null && programDetailsValue == null) {
      return;
    }
    else {
      // const userRole = programDetailsValue.find(role => role.hasOwnProperty(userrolename));

      if (programDetailsValue && programDetailsValue.data) {

        const roleBasedArray = programDetailsValue?.data?.roleBasedArray[0];
        let userRoleData = roleBasedArray[userrolename] ? roleBasedArray[userrolename] : []
        if(roleBasedArray){
          const hasSortOrder = userRoleData?.some(item => item.sortOrder !== undefined);

          if (hasSortOrder) {
            // Find logout item
            const logoutItemIndex = userRoleData.findIndex(
              item => item.name?.toLowerCase() === "logout"
            );

            let logoutItem = null;
            if (logoutItemIndex !== -1) {
              logoutItem = userRoleData[logoutItemIndex];
            }

            // Separate items with & without sortOrder
            const withOrder = userRoleData.filter(item => item.sortOrder !== undefined && item !== logoutItem);
            const withoutOrder = userRoleData.filter(item => item.sortOrder === undefined && item !== logoutItem);

            // Sort items with sortOrder
            withOrder.sort((a, b) => a.sortOrder - b.sortOrder);

            // Final Order: withOrder → withoutOrder → Logout
            userRoleData = [
              ...withOrder,
              ...withoutOrder,
              ...(logoutItem ? [logoutItem] : [])
            ];
          }
        }
        //   }
        // }
        // let programDetails = await OfflineDb.getDataFromPouchDB("programBoDetails");
        // const roleBasedArray= programDetails.data.roleBasedArray
        // const userRole = roleBasedArray.find(role => role.hasOwnProperty(userrolename));
        return (
          <Menu className="">
            {userRoleData.map((userRoleData, index) => {
              return userRoleData.showMenu && !userRoleData.userrole ? (
                userRoleData.name === "Logout" ? (
                  <Link
                    className={classes.noDeco}
                    to="#"
                    onClick={() => onMenuClick(userRoleData.name)}
                    key={index}
                    disabled={userRoleData.disabled ? true : false}
                  >
                    <MenuItem
                      dataTest="dhis2-uicore-menuitem"
                      icon={<FontAwesomeIcon icon={icons[userRoleData.icon]} />}
                      label={t(userRoleData.name)}
                      disabled={userRoleData.disabled ? true : false}
                    />
                  </Link>
                ) : (userRoleData.name === "Settings" || userRoleData.name === "Appointments") && !isOnline ? (
                  <Link
                    className={classes.noDeco}
                    to="#"
                    onClick={(event) => {
                      event.preventDefault(); // Prevent navigation
                      swal({
                        title: t("Offline mode"),
                        text: t(
                          "This operation is not available while offline. Please go online to proceed."
                        ),
                        icon: "warning",
                        buttons: t("Close"),
                      });
                    }}
                    key={index}
                    disabled={userRoleData.disabled ? true : false}
                  >
                    <MenuItem
                      dataTest="dhis2-uicore-menuitem"
                      icon={<FontAwesomeIcon icon={icons[userRoleData.icon]} />}
                      label={t(userRoleData.name)}
                      disabled={userRoleData.disabled ? true : false}
                    />
                  </Link>
                ) : (
                  <Link
                    className={classes.noDeco}
                    to={userRoleData.disabled ? "#" : userRoleData.path}
                    key={index}
                    disabled={userRoleData.disabled ? true : false}
                  >
                    <MenuItem
                      dataTest="dhis2-uicore-menuitem"
                      icon={<FontAwesomeIcon icon={icons[userRoleData.icon]} />}
                      label={t(userRoleData.name)}
                      disabled={userRoleData.disabled ? true : false}
                    />
                  </Link>
                )
              ) : null;
            })}
          </Menu>
        );
        // return (
        //   <Menu className="">
        //     {ConfigurationFromServer &&
        //       ConfigurationFromServer.sidebar.menuItems.map((menuItems, index) => {
        //         return menuItems.showMenu && !menuItems.userrole ? (
        //           menuItems.name == "My Clients" || menuItems.name == "Logout" ? (
        //             <Link
        //               className={classes.noDeco}
        //               //to={menuItems.path}
        //               to="#"
        //               onClick={() => onMenuClick(menuItems.name)}
        //               key={index}
        //               disabled={menuItems.disabled ? true : false}
        //             // state={{test: 'test'}}
        //             >
        //               <MenuItem
        //                 // className="menuitem"
        //                 dataTest="dhis2-uicore-menuitem"
        //                 icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
        //                 label={t(menuItems.name)}
        //                 disabled={menuItems.disabled ? true : false}
        //               />
        //             </Link>
        //           ) : (
        //             <Link
        //               className={classes.noDeco}
        //               to={menuItems.disabled ? "#" : menuItems.path}
        //               disabled={menuItems.disabled ? true : false}
        //               onClick={() => {
        //                 // localStorage.setItem("followup", true)
        //                 onMenuClick(menuItems.name);
        //               }}
        //               key={index}
        //             >
        //               <MenuItem
        //                 // className="menuitem"
        //                 dataTest="dhis2-uicore-menuitem"
        //                 icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
        //                 label={t(menuItems.name)}
        //                 disabled={menuItems.disabled ? true : false}
        //               />
        //             </Link>
        //           )
        //         ) : null;
        //       })}
        //   </Menu>
        // );
      }
    }
  }
  function renderSuperUserComponent() {
    return (
      <Menu className="">
        {ConfigurationFromServer &&
          ConfigurationFromServer.sidebar.menuItems.map((menuItems, index) => {
            return menuItems.userrole &&
              menuItems.userrole.toLowerCase() == superAdmin ? (
              menuItems.name == "Logout" ? (
                <Link
                  className={classes.noDeco}
                  //to={menuItems.path}
                  to="#"
                  onClick={() => onMenuClick(menuItems.name)}
                  key={index}
                  disabled={menuItems.disabled ? true : false}
                // state={{test: 'test'}}
                >
                  <MenuItem
                    // className="menuitem"
                    dataTest="dhis2-uicore-menuitem"
                    icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
                    label={t(menuItems.name)}
                    disabled={menuItems.disabled ? true : false}
                  />
                </Link>
              ) : (
                <Link
                  className={classes.noDeco}
                  to={menuItems.path}
                  onClick={() => onMenuClick(menuItems.name)}
                  key={index}
                  disabled={menuItems.disabled ? true : false}
                >
                  <MenuItem
                    // className="menuitem"
                    dataTest="dhis2-uicore-menuitem"
                    icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
                    label={t(menuItems.name)}
                    disabled={menuItems.disabled ? true : false}
                  />
                </Link>
              )
            ) : null;
          })}
      </Menu>
    );
  }
  function renderFacilityUserComponent() {
    return (
      <Menu className="">
        {ConfigurationFromServer &&
          ConfigurationFromServer.sidebar.menuItems.map((menuItems, index) => {
            return menuItems.showMenu &&
              menuItems.userrole &&
              menuItems.userrole == facilityUser ? (
              menuItems.name == "Logout" ? (
                <Link
                  className={classes.noDeco}
                  //to={menuItems.path}
                  to="#"
                  onClick={() => onMenuClick(menuItems.name)}
                  key={index}
                  disabled={menuItems.disabled ? true : false}
                // state={{test: 'test'}}
                >
                  <MenuItem
                    // className="menuitem"
                    dataTest="dhis2-uicore-menuitem"
                    icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
                    label={t(menuItems.name)}
                    disabled={menuItems.disabled ? true : false}
                  />
                </Link>
              ) : (
                <Link
                  className={classes.noDeco}
                  to={menuItems.disabled ? "#" : menuItems.path}
                  disabled={menuItems.disabled ? true : false}
                  onClick={() => {
                    // localStorage.setItem("followup", true)
                    onMenuClick(menuItems.name);
                  }}
                  key={index}
                >
                  <MenuItem
                    // className="menuitem"
                    dataTest="dhis2-uicore-menuitem"
                    icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
                    label={t(menuItems.name)}
                    disabled={menuItems.disabled ? true : false}
                  />
                </Link>
              )
            ) : null;
          })}
      </Menu>
    );
  }
  function rendermenuitems() {
    ConfigurationFromServer.homepage.menuItems = _.filter(
      ConfigurationFromServer.homepage.menuItems,
      { showMenu: true }
    );
    let flag = true;
    if (ConfigurationFromServer.homepage.menuItems.length % 2 != 0) {
      ConfigurationFromServer.homepage.menuItems.push({
        name: "",
        icon: "",
        path: "",
        showMenu: true,
        iconClass: "",
      });
    }
    return ConfigurationFromServer.homepage.menuItems.map(
      (menuItems, index) => {
        if (index % 2 == 0) {
          flag = !flag;
        }
        flag = !flag;
        //if(menuItems.showMenu){
        return (
          <Grid
            key={index}
            item
            xs={6}
            sm={6}
            md={6}
            className={menuItems.showMenu ? "" : "hide"}
          >
            <Link
              className={reloadData ? "anchorLink disbaledLink" : "anchorLink "}
              to={menuItems.path}
            >
              <div
                className={
                  flag
                    ? "homemenucontainer background-theme"
                    : "homemenucontainer"
                }
              >
                <p className="zero text-center">
                  <div
                    className={
                      flag
                        ? menuItems.iconClass + " background_white"
                        : menuItems.iconClass + " background-theme"
                    }
                  ></div>
                </p>
                <p
                  className={
                    flag ? "text-uppercase color-white" : "text-uppercase"
                  }
                >
                  {t(menuItems.name)}
                </p>
              </div>
            </Link>
          </Grid>
        );
      }
    );
  }

  const casesList = (casesData) => {
    return (
      <div>
        <Typography variant="h6">{casesData["Name"]}</Typography>
        <Typography variant="body2">UID : {casesData["UID"]}</Typography>
        <Typography variant="body2">
          Client type: {casesData["ClientType"]}
        </Typography>
      </div>
    );
  };

  const openAppointment = () => {
    setAppointmentPopup(true);
  };







  return (
    // Stock Dashboard Will be shown for Facility User Else Product Dashboard Will be Shown
    userrolename == "facilityUser" ?
      <>
        {openHomePageFilter ? (
          <>
            <div ref={filterRef} className="filter-container-stock">
              <div className="filter-item">
                <div className="d-flex justify-content-end">
                  <CloseIcon onClick={handleCloseFilter} className="close-icon" style={{ cursor: "pointer" }} />
                </div>

                <label htmlFor="periodType">{t("Time Period")}:</label>
                <select
                  id="periodType"
                  value={tempPeriodType}
                  onChange={handleTempPeriodTypeChange}
                  className="rounded-select"
                >
                  <option value="Yearly">{t("Yearly")}</option>
                  <option value="Monthly">{t("Monthly")}</option>
                  {/* <option value="Date Range">Date Range</option> */}
                </select>
              </div>
              <div className="filter-item">
                <label htmlFor="periodValue">
                  {tempPeriodType === 'Yearly' ? "Select Year:" : tempPeriodType === 'Monthly' ? "Select Month:" : ""}
                </label>

                {tempPeriodType === 'Yearly' &&
                  (
                    <select
                      id="periodValue"
                      value={tempYear}
                      onChange={handleTempYearChange}
                      className="rounded-select"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  )
                }

                {tempPeriodType === 'Monthly' &&
                  (
                    <div className="d-flex">
                      <select
                        id="periodYear"
                        value={tempYear}
                        onChange={handleTempYearChange}
                        className="rounded-select mr-2"
                      >
                        {years.map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <select
                        id="periodMonth"
                        value={tempMonth}
                        onChange={handleTempMonthChange}
                        className="rounded-select"
                      >
                        {months.map(month => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                {/* {tempPeriodType === 'Date Range' && (
                  <>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                      type="date"
                      id="startDate"
                      value={tempStartdate}
                      onChange={handleStartDateChange}
                      className="rounded-input mb-10px"
                      max={tempEnddate}
                    />
                    <label htmlFor="endDate">End Date:</label>
                    <input
                      type="date"
                      id="endDate"
                      value={tempEnddate}
                      onChange={handleEndDateChange}
                      className="rounded-input"
                      min={tempStartdate}
                    />
                  </>
                )} */}

              </div>
              <div className="filter-buttons">
                <button onClick={handleFilterSubmit} className="filter-button submit-button">Apply</button>
                <button onClick={handleFilterReset} className="filter-button reset-button">Reset</button>
              </div>
            </div>
          </>
        ) : (
          <> </>
        )}
        <div className={classes.container}>
          <main style={{ display: "flex", height: "100%", width: "100%" }}>
            <section
              className="mainsection pb-0 pT-55 home-main-section"
              style={{
                // backgroundColor: '#fff',
                flexGrow: 1,
                padding: 0,
              }}
            >
              <Grid container spacing={0} className="d-none">
                <Grid item xs={12} sm={12} md={12} className="pos-relative">
                  <div className="homeheaderdiv">
                    <h3 className="text-uppercase zero hide1">{t("Homepage")}</h3>
                    <div class="custom-shape-divider-top-1617788413">
                      <svg
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
                          class="shape-fill"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                className="menulistingholder d-none"
              >
                {reloadData && progress != 100 ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {/* <Grid container spacing={3}> */}

                      <p className="homepageappdesc">{t("Syncing data")}</p>
                      <BorderLinearProgress
                        variant="determinate"
                        value={progress}
                      />
                      <p className="homepageappdesc">
                        {" "}
                        {progress} % {t("completed")}{" "}
                      </p>
                      {/* </Grid> */}
                    </Grid>
                  </Grid>
                ) : !userConsent &&
                  userConsent != null &&
                  sessionUserBoValue != null &&
                  sessionUserBoValue.attributeValues ? (
                  <Grid item xs={12} sm={12} md={12} className="">
                    <div className="choose_alertdiv">
                      <Disclaimer
                        disclaimerContents={
                          programData != null
                            ? programData.programs[0].description
                            : "N/A"
                        }
                        sessionUserBoValue={sessionUserBoValue}
                        userConsentAttributeIndex={userConsentAttributeIndex}
                        userConsent={setConset}
                      />
                    </div>
                  </Grid>
                ) : (
                  // Add new Home page section
                  <div className="homemenupageholder d-none">
                    <div className="w-100">
                      <Grid container spacing={0} className="">
                        {ConfigurationFromServer ? rendermenuitems() : <></>}
                      </Grid>
                    </div>
                  </div>
                )}
              </Grid>
              <Grid container spacing={0} className="">
                {reloadData && progress != 100 ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {/* <Grid container spacing={3}> */}

                      <p className="homepageappdesc">{t("Syncing data")}</p>
                      <BorderLinearProgress
                        variant="determinate"
                        value={progress}
                      />
                      <p className="homepageappdesc">
                        {" "}
                        {progress} % {t("completed")}{" "}
                      </p>
                      {/* </Grid> */}
                    </Grid>
                  </Grid>
                ) : (
                  <>
                    {userrolename == "facilityUser" ?
                      <>
                      </>
                      :
                      <Grid item xs={2} sm={2} md={2} className="">
                        {/* {sessionUserBoValue && sessionUserBoValue.userCredentials && sessionUserBoValue.userCredentials.username ?
            <div className="username-tag"> {sessionUserBoValue.userCredentials.username}</div>
            : <></>
            } */}
                        <div className="leftsidebar">
                          {renderNewStyleMenuitems()}
                          {/* {userrolename
                            ? userrolename == patientRole
                              ? renderPatientMenuitems()
                              : userrolename.toLowerCase() == superAdmin
                                ? renderSuperUserComponent()
                                : userrolename == facilityUser
                                  ? renderFacilityUserComponent()
                                  : renderNewStyleMenuitems()
                            : renderNewStyleMenuitems()} */}
                        </div>
                        <div className="version-tag web-version-tag">
                          {t("Version No")} : 1.0.8s
                          {/*{Configuration != null ? Configuration.mobileAppVersion : ""}*/}
                        </div>
                      </Grid>
                    }
                    <Grid item xs={userrolename == "facilityUser" ? 12 : 10} sm={userrolename == "facilityUser" ? 12 : 10} md={userrolename == "facilityUser" ? 12 : 10} className="rightsection">
                      <div className="rightsectiontoppart d-none">
                        {/* <div className="statMain">
                    <div className="statClientBox">
                      <Typography variant="h5" className="">MY CLENTS</Typography>
                     <div className="statclientlist">
                        { myClientsCaseslist && myClientsCaseslist.length > 0 ?
                              myClientsCaseslist.map((caseData) => {
                                return casesList(caseData)
                              })
                        :
                        myClientsCaseslist && myClientsCaseslist.length == 0 ?
                        <h2>N/A</h2>
                        :<>Loading...</>
                        }
                     </div>
                     
                    </div>
                    <div className="statClientBox2">
                      <Typography variant="h5" className="">REFERRAL CASES</Typography>
                     <div className="statclientlist">
                       { referralCaseslist && referralCaseslist.length > 0 ?
                              referralCaseslist.map((caseData) => {
                                return casesList(caseData)
                              })
                        :
                        referralCaseslist && referralCaseslist.length == 0 ?
                        <h2>N/A</h2>
                        :<>Loading...</>
                        }
                     </div>
                     
                    </div>
                </div> */}
                        {userrolename &&
                          userrolename.toLowerCase() == superAdmin ? (
                          <div className="statboxesholdermain">
                            <div
                              className="statbox one"
                              onClick={() => {
                                history.push("/layout/linelist");
                              }}
                            >
                              <div className="alertBox">
                                <img src={imgUrl.linelist} className="alertImg" />
                              </div>
                              <div>
                                {/* <p className="statnumber one">{registerdClient ? registerdClient : 0}</p> */}
                                <p className="stattext">{t("Line List")}</p>
                              </div>
                            </div>
                            <div
                              className="statbox two"
                              onClick={() => {
                                history.push("/layout/deactivatecases");
                              }}
                            >
                              <div className="referalBox">
                                <img
                                  src={imgUrl.clientImg}
                                  className="referalImg"
                                />
                              </div>
                              <div>
                                {/* <p className="statnumber one">{registerdClient ? registerdClient : 0}</p> */}
                                <p className="stattext">
                                  {t("Deactivated Clients")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : userrolename && userrolename != patientRole ? (
                          <div className="statboxesholdermain">
                            <div
                              className="statbox one"
                              onClick={() => {
                                localStorage.setItem("showCases", true);
                                history.push("/layout/cases", {
                                  showCases: true,
                                });
                              }}
                            >
                              <div className="clientBox">
                                <img src={imgUrl.clientImg} className="clientImg" />
                              </div>
                              <div>
                                <p className="statnumber one">
                                  {registerdClient ? registerdClient : 0}
                                </p>
                                <p className="stattext">
                                  {t("Patient record list")}
                                </p>
                              </div>
                            </div>
                            {userrolename !== facilityUser && (
                              <div
                                className="statbox two"
                                onClick={() => {
                                  history.push("/layout/followup");
                                }}
                              >
                                <div className="referalBox">
                                  <img
                                    src={imgUrl.transferImg}
                                    color="blue"
                                    className="referalImg"
                                  />
                                </div>
                                <div>
                                  <p className="statnumber two">
                                    {/* {referralCasesCount ? referralCasesCount : 0} */}
                                    {followupCount ? followupCount : 0}
                                  </p>
                                  {/* <p className="stattext">{t("Referral Cases")}</p> */}
                                  <p className="stattext">{t("Follow up")}</p>
                                </div>
                              </div>
                            )}

                            {/* <div className="statbox three">
                   <div className="transferBox">
                     <img src={imgUrl.transferImg} className="transferImg" />
                    </div>
                    <div>
                    <p className="statnumber three">{transferInCount+" / "+transferOutCount}</p>
                    <p className="stattext">{t("Transfer In / Out")}</p>
                    </div>                   
                  </div> */}
                            <div
                              className="statbox four"
                              onClick={() => {
                                history.push("/layout/alerts");
                              }}
                            >
                              <div className="alertBox">
                                <img src={imgUrl.alertImg} className="alertImg" />
                              </div>
                              <div>
                                <p className="statnumber four">
                                  {alertCount ? alertCount : 0}
                                </p>
                                <p className="stattext">{t("Alerts")}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="statboxesholdermain">
                            {/* <div className="statbox one" onClick={()=>{ 
                    history.push('/layout/widgetlist')
                  }}>
                      <div className="clientBox">
                      <img src={imgUrl.clientImg} className="clientImg" />
                      </div>
                      <div>
                        <p className="statnumber one">{2}</p>
                        <p className="stattext">Widgets</p>
                      </div>
                    </div>  */}
                            <div
                              className="statbox one"
                              onClick={() => {
                                history.push("/layout/alerts");
                              }}
                            >
                              <div className="clientBox">
                                <img src={imgUrl.alertImg} className="clientImg" />
                              </div>
                              <div>
                                <p className="statnumber four">
                                  {alertCount ? alertCount : 0}
                                </p>
                                <p className="stattext">{t("Alerts")}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* {new cards} */}
                        <br />
                        <div className="statboxesholdermain hide">
                          <div className="statbox one secondary-box">
                            <div>
                              <p className="statnumber one">
                                {hypertensionCount ? hypertensionCount : 0}
                              </p>
                              <p className="stattext">{t("Hypertension & CVD")}</p>
                            </div>
                          </div>
                          <div className="statbox one secondary-box">
                            <div>
                              <p className="statnumber one">
                                {diabetesCount ? diabetesCount : 0}
                              </p>
                              <p className="stattext"> {t("Diabetes")}</p>
                            </div>
                          </div>
                          <div className="statbox one secondary-box">
                            <div>
                              <p className="statnumber one">
                                {asthmaCount ? asthmaCount : 0}
                              </p>
                              <p className="stattext"> {t("Asthma")}</p>
                            </div>
                          </div>
                          <div className="statbox one secondary-box">
                            <div>
                              <p className="statnumber one">
                                {COPDCount ? COPDCount : 0}
                              </p>
                              <p className="stattext"> {t("COPD")}</p>
                            </div>
                          </div>
                          <div className="statbox one secondary-box">
                            <div>
                              <p className="statnumber one">
                                {tertiaryCount ? tertiaryCount : 0}
                              </p>
                              <p className="stattext">
                                {" "}
                                {t("Referred Tertiary hospitals")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* dashboard section */}
                      <div className="" style={{ marginTop: "90px" }}>
                        <div className="main-cdic-dashboard">
                          <div className="d-flex justify-space-between align-items-center">
                            <h4 className="main-heading mb-20px mt-0">
                              STOCK MANAGEMENT ANALYTICAL DASHBOARD OVERVIEW
                            </h4>
                            <div>

                              <FilterIcon
                                style={{ cursor: "pointer" }}
                                onClick={openFilter}
                                className=" mr-10px "
                              />
                              <Button className="mb-20px mt-0 modalactionbtn" onClick={() => { history.push('/layout/datasetmanagement') }}>Stock Module</Button>
                            </div>

                          </div>
                          <Grid container spacing={2}>
                            <Grid item xs={3}>
                              <Card
                                variant="outlined"
                                className="bg-lightgrey home-box"
                              >
                                <CardContent className="pb-0">
                                  <div className="main-first-section">
                                    {/* <img src={imgUrl.med_icon}></img> */}
                                    <h5 className="mb-0 mt-0 mx-4px">
                                      {inventoryItemsCount}
                                      {/* {_.find(dashboardCards, {
                                        indiacatorname:
                                          "Total Patients Registered Till Now",
                                      })
                                        ? _.find(dashboardCards, {
                                          indiacatorname:
                                            "Total Patients Registered Till Now",
                                        }).count
                                        : 0} */}
                                    </h5>
                                  </div>
                                  <div className="main-first-section">
                                    <p>INVENTORY ITEMS</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={3}>
                              <Card
                                variant="outlined"
                                className="bg-lightgrey home-box"
                              >
                                <CardContent className="pb-0">
                                  <div className="main-first-section">
                                    {/* <img
                                      src={imgUrl.calender_icon}
                                      className="calender-icon"
                                    ></img> */}
                                    <h5 className="mb-0 mt-0 mx-4px">
                                      {currentStockoutsCount}
                                      {/* {_.find(dashboardCards, {
                                        indiacatorname: "Total Patients Registered",
                                      })
                                        ? _.find(dashboardCards, {
                                          indiacatorname:
                                            "Total Patients Registered",
                                        }).count
                                        : 0} */}
                                    </h5>
                                  </div>
                                  <div className="main-first-section">
                                    <p>CURRENT STOCKOUTS</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            {/* <Grid item xs={3}>
                              <Card
                                variant="outlined"
                                className="bg-lightgrey home-box"
                              >
                                <CardContent className="pb-0">
                                  <div className="main-first-section">
                                    <h5 className="mb-0 mt-0 mx-4px">4</h5>
                                  </div>
                                  <div className="main-first-section">
                                    <p>
                                      EXPIRED ITEMS
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid> */}
                            <Grid item xs={3}>
                              <Card
                                variant="outlined"
                                className="bg-lightgrey home-box"
                              >
                                <CardContent className="pb-0">
                                  <div className="main-first-section">
                                    {/* <img src={imgUrl.missed_icon}></img> */}
                                    <h5 className="mb-0 mt-0 mx-4px">
                                      0
                                    </h5>
                                  </div>
                                  <div className="main-first-section">
                                    <p>
                                      WILL EXPIRE SOON
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={3}>
                              <Card
                                variant="outlined"
                                className="bg-lightgrey home-box"
                              >
                                <CardContent className="pb-0">
                                  <div className="main-first-section">
                                    {/* <img src={imgUrl.missed_icon}></img> */}
                                    <h5 className="mb-0 mt-0 mx-4px">
                                      {reachedThresholdCount}
                                    </h5>
                                  </div>
                                  <div className="main-first-section">
                                    <p>
                                      REACHED THRESHOLD
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>

                          <div className="main-second-mainchartSection">

                            <Grid
                              container
                              spacing={2}
                              className="mb-10px mt-10px main-second-chartSection"
                            >
                              <Grid item xs={12} sm={6} md={6} lg={6}>
                                <Card variant="outlined" className="bg-lightgrey">
                                  <CardContent className="pb-0">
                                    <div className="main-second-section mb-10px">
                                      <div className="heading">
                                        <h4 className="mt-0 mb-0">
                                          MONTHLY INVENTORY ({new Date().getFullYear()})
                                        </h4>
                                      </div>

                                      <div className="main-icon">
                                        {/* <InfoIcon className="info-icon"></InfoIcon>
                                  <Button
                                    variant="contained"
                                    className="blue-icon"
                                  >
                                    %
                                  </Button>
                                  <Button
                                    variant="contained"
                                    className="gray-icon"
                                  >
                                    #
                                  </Button> */}
                                      </div>
                                    </div>

                                    <div className="">
                                      {" "}
                                      <StockLineChart data={stockLineChartData} />
                                    </div>
                                  </CardContent>
                                </Card>
                              </Grid>
                              <Grid item xs={12} sm={6} md={6} lg={6}>
                                <Card variant="outlined" className="bg-lightgrey ">
                                  <CardContent className="pb-0">
                                    {/* <div className="main-second-section">
                              <h4 className="mt-0 mb-15px"></h4>
                            </div> */}
                                    <div className="main-second-section mb-2">
                                      <div className="heading">
                                        <h4 className="mt-0 mb-0">
                                          CURRENT STOCK
                                        </h4>
                                      </div>
                                    </div>
                                    <div className="">
                                      <StockBarChart
                                        data={stockBarChartData}
                                      />
                                    </div>
                                  </CardContent>
                                </Card>
                              </Grid>
                            </Grid>
                          </div>
                        </div>
                      </div>
                      {userrolename && userrolename.toLowerCase() == superAdmin ? (
                        <></>
                      ) : userrolename && userrolename == patientRole ? (
                        <div
                          className="chatbotBox"
                          onClick={() => {
                            window.open("http://bit.ly/3Ww8GOI", "_system");
                          }}
                        >
                          <div className="chatDiv">
                            <img src={imgUrl.chatbot} className="botImg" />
                          </div>
                        </div>
                      ) : (
                        <Tooltip title={t("Appointments")} arrow>
                          <div
                            className="chatbotBox hide"
                            onClick={() => openAppointment()}
                          >
                            <div className="chatDiv">
                              <EventIcon></EventIcon>
                            </div>
                          </div>
                        </Tooltip>
                      )}

                      <div className="bottomstatspart">
                        <div className="circleholderdiv">
                          <div class="redcircle">
                            <h3 id="totalStakeHolder">123</h3>
                          </div>
                          <p class="circleredtext">Registered</p>
                        </div>
                        <div className="circleholderdiv">
                          <div class="redcircle">
                            <h3 id="totalStakeHolder">123</h3>
                          </div>
                          <p class="circleredtext">Registered</p>
                        </div>
                        <div className="circleholderdiv">
                          <div class="redcircle">
                            <h3 id="totalStakeHolder">123</h3>
                          </div>
                          <p class="circleredtext">Registered</p>
                        </div>
                      </div>
                    </Grid>
                  </>
                )}

                {appointmentPopup ? (
                  <>
                    <div className="modaloverlay eventpopup">
                      <div className="modalcardholder">
                        <Card className="modalcard">
                          <CardHeader
                            className="modalheader"
                            action={
                              <IconButton aria-label="close">
                                <CloseIcon
                                  onClick={() => setAppointmentPopup(null)}
                                />
                              </IconButton>
                            }
                            title={t("Appointments")}
                          />
                          <CardContent className="modalbodycontent">
                            <Appointment></Appointment>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </section>

          </main>
        </div>
      </>

      :
      <div className={classes.container}>
        <main style={{ display: "flex", height: "100%", width: "100%" }}>
          <section
            className="mainsection pb-0 pT-55 home-main-section"
            style={{
              // backgroundColor: '#fff',
              flexGrow: 1,
              padding: 0,
            }}
          >
            <Grid container spacing={0} className="d-none">
              <Grid item xs={12} sm={12} md={12} className="pos-relative">
                <div className="homeheaderdiv">
                  <h3 className="text-uppercase zero hide1">{t("Homepage")}</h3>
                  <div class="custom-shape-divider-top-1617788413">
                    <svg
                      data-name="Layer 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1200 120"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
                        class="shape-fill"
                      ></path>
                    </svg>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              className="menulistingholder d-none"
            >
              {reloadData && progress != 100 ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {/* <Grid container spacing={3}> */}

                    <p className="homepageappdesc">{t("Syncing data")}</p>
                    <BorderLinearProgress
                      variant="determinate"
                      value={progress}
                    />
                    <p className="homepageappdesc">
                      {" "}
                      {progress} % {t("completed")}{" "}
                    </p>
                    {/* </Grid> */}
                  </Grid>
                </Grid>
              ) : !userConsent &&
                userConsent != null &&
                sessionUserBoValue != null &&
                sessionUserBoValue.attributeValues ? (
                <Grid item xs={12} sm={12} md={12} className="">
                  <div className="choose_alertdiv">
                    <Disclaimer
                      disclaimerContents={
                        programData != null
                          ? programData.programs[0].description
                          : "N/A"
                      }
                      sessionUserBoValue={sessionUserBoValue}
                      userConsentAttributeIndex={userConsentAttributeIndex}
                      userConsent={setConset}
                    />
                  </div>
                </Grid>
              ) : (
                // Add new Home page section
                <div className="homemenupageholder d-none">
                  <div className="w-100">
                    <Grid container spacing={0} className="">
                      {ConfigurationFromServer ? rendermenuitems() : <></>}
                    </Grid>
                  </div>
                </div>
              )}
            </Grid>
            <Grid container spacing={0} className="">
              {reloadData && progress != 100 ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {/* <Grid container spacing={3}> */}

                    <p className="homepageappdesc">{t("Syncing data")}</p>
                    <BorderLinearProgress
                      variant="determinate"
                      value={progress}
                    />
                    <p className="homepageappdesc">
                      {" "}
                      {progress} % {t("completed")}{" "}
                    </p>
                    {/* </Grid> */}
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Grid item xs={0} sm={0} md={2} lg={2} xl={2} className="display-none-smallVersions">
                    {/* {sessionUserBoValue && sessionUserBoValue.userCredentials && sessionUserBoValue.userCredentials.username ?
            <div className="username-tag"> {sessionUserBoValue.userCredentials.username}</div>
            : <></>
            } */}
                    <div className="leftsidebar">
                      {renderNewStyleMenuitems()}
                      {/* {userrolename
                        ? userrolename == patientRole
                          ? renderPatientMenuitems()
                          : userrolename.toLowerCase() == superAdmin
                            ? renderSuperUserComponent()
                            : userrolename == facilityUser
                              ? renderFacilityUserComponent()
                              : renderNewStyleMenuitems()
                        : renderNewStyleMenuitems()} */}
                    </div>
                    <div className="version-tag web-version-tag">
                      {t("Version No")} : 1.0.8s
                      {/*{Configuration != null ? Configuration.mobileAppVersion : ""}*/}
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={10} lg={10} xl={10} className="rightsection">
                    <div className="rightsectiontoppart d-none">
                      {/* <div className="statMain">
                    <div className="statClientBox">
                      <Typography variant="h5" className="">MY CLENTS</Typography>
                     <div className="statclientlist">
                        { myClientsCaseslist && myClientsCaseslist.length > 0 ?
                              myClientsCaseslist.map((caseData) => {
                                return casesList(caseData)
                              })
                        :
                        myClientsCaseslist && myClientsCaseslist.length == 0 ?
                        <h2>N/A</h2>
                        :<>Loading...</>
                        }
                     </div>
                     
                    </div>
                    <div className="statClientBox2">
                      <Typography variant="h5" className="">REFERRAL CASES</Typography>
                     <div className="statclientlist">
                       { referralCaseslist && referralCaseslist.length > 0 ?
                              referralCaseslist.map((caseData) => {
                                return casesList(caseData)
                              })
                        :
                        referralCaseslist && referralCaseslist.length == 0 ?
                        <h2>N/A</h2>
                        :<>Loading...</>
                        }
                     </div>
                     
                    </div>
                </div> */}
                      {userrolename &&
                        userrolename.toLowerCase() == superAdmin ? (
                        <div className="statboxesholdermain">
                          <div
                            className="statbox one"
                            onClick={() => {
                              history.push("/layout/linelist");
                            }}
                          >
                            <div className="alertBox">
                              <img src={imgUrl.linelist} className="alertImg" />
                            </div>
                            <div>
                              {/* <p className="statnumber one">{registerdClient ? registerdClient : 0}</p> */}
                              <p className="stattext">{t("Line List")}</p>
                            </div>
                          </div>
                          <div
                            className="statbox two"
                            onClick={() => {
                              history.push("/layout/deactivatecases");
                            }}
                          >
                            <div className="referalBox">
                              <img
                                src={imgUrl.clientImg}
                                className="referalImg"
                              />
                            </div>
                            <div>
                              {/* <p className="statnumber one">{registerdClient ? registerdClient : 0}</p> */}
                              <p className="stattext">
                                {t("Deactivated Clients")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : userrolename && userrolename != patientRole ? (
                        <div className="statboxesholdermain">
                          <div
                            className="statbox one"
                            onClick={() => {
                              localStorage.setItem("showCases", true);
                              history.push("/layout/cases", {
                                showCases: true,
                              });
                            }}
                          >
                            <div className="clientBox">
                              <img src={imgUrl.clientImg} className="clientImg" />
                            </div>
                            <div>
                              <p className="statnumber one">
                                {registerdClient ? registerdClient : 0}
                              </p>
                              <p className="stattext">
                                {t("Patient record list")}
                              </p>
                            </div>
                          </div>
                          {userrolename !== facilityUser && (
                            <div
                              className="statbox two"
                              onClick={() => {
                                history.push("/layout/followup");
                              }}
                            >
                              <div className="referalBox">
                                <img
                                  src={imgUrl.transferImg}
                                  color="blue"
                                  className="referalImg"
                                />
                              </div>
                              <div>
                                <p className="statnumber two">
                                  {/* {referralCasesCount ? referralCasesCount : 0} */}
                                  {followupCount ? followupCount : 0}
                                </p>
                                {/* <p className="stattext">{t("Referral Cases")}</p> */}
                                <p className="stattext">{t("Follow up")}</p>
                              </div>
                            </div>
                          )}

                          {/* <div className="statbox three">
                   <div className="transferBox">
                     <img src={imgUrl.transferImg} className="transferImg" />
                    </div>
                    <div>
                    <p className="statnumber three">{transferInCount+" / "+transferOutCount}</p>
                    <p className="stattext">{t("Transfer In / Out")}</p>
                    </div>                   
                  </div> */}
                          <div
                            className="statbox four"
                            onClick={() => {
                              history.push("/layout/alerts");
                            }}
                          >
                            <div className="alertBox">
                              <img src={imgUrl.alertImg} className="alertImg" />
                            </div>
                            <div>
                              <p className="statnumber four">
                                {alertCount ? alertCount : 0}
                              </p>
                              <p className="stattext">{t("Alerts")}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="statboxesholdermain">
                          {/* <div className="statbox one" onClick={()=>{ 
                    history.push('/layout/widgetlist')
                  }}>
                      <div className="clientBox">
                      <img src={imgUrl.clientImg} className="clientImg" />
                      </div>
                      <div>
                        <p className="statnumber one">{2}</p>
                        <p className="stattext">Widgets</p>
                      </div>
                    </div>  */}
                          <div
                            className="statbox one"
                            onClick={() => {
                              history.push("/layout/alerts");
                            }}
                          >
                            <div className="clientBox">
                              <img src={imgUrl.alertImg} className="clientImg" />
                            </div>
                            <div>
                              <p className="statnumber four">
                                {alertCount ? alertCount : 0}
                              </p>
                              <p className="stattext">{t("Alerts")}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* {new cards} */}
                      <br />
                      <div className="statboxesholdermain hide">
                        <div className="statbox one secondary-box">
                          <div>
                            <p className="statnumber one">
                              {hypertensionCount ? hypertensionCount : 0}
                            </p>
                            <p className="stattext">{t("Hypertension & CVD")}</p>
                          </div>
                        </div>
                        <div className="statbox one secondary-box">
                          <div>
                            <p className="statnumber one">
                              {diabetesCount ? diabetesCount : 0}
                            </p>
                            <p className="stattext"> {t("Diabetes")}</p>
                          </div>
                        </div>
                        <div className="statbox one secondary-box">
                          <div>
                            <p className="statnumber one">
                              {asthmaCount ? asthmaCount : 0}
                            </p>
                            <p className="stattext"> {t("Asthma")}</p>
                          </div>
                        </div>
                        <div className="statbox one secondary-box">
                          <div>
                            <p className="statnumber one">
                              {COPDCount ? COPDCount : 0}
                            </p>
                            <p className="stattext"> {t("COPD")}</p>
                          </div>
                        </div>
                        <div className="statbox one secondary-box">
                          <div>
                            <p className="statnumber one">
                              {tertiaryCount ? tertiaryCount : 0}
                            </p>
                            <p className="stattext">
                              {" "}
                              {t("Referred Tertiary hospitals")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* dashboard section */}
                    <div className="pt-30 mainLandingHome" style={{ marginTop: "72px" }}>
                      <div className="main-cdic-dashboard">
                        <div className="d-flex justify-space-between align-items-center mb-25px">
                          <h4 className="main-heading mb-0 mt-0">
                            {t("T1D ANALYTICAL DASHBOARD OVERVIEW")}
                          </h4>
                          <FilterIcon
                            style={{ cursor: "pointer" }}
                            onClick={openFilter}
                            className=""
                          />
                          {openHomePageFilter ? (
                            <>
                              <div ref={filterRef} className="filter-container">
                                <div className="filter-item">
                                  <div className="d-flex justify-content-end">
                                    <CloseIcon onClick={handleCloseFilter} className="close-icon" style={{ cursor: "pointer" }} />
                                  </div>

                                  <label htmlFor="periodType">{t("Time Period")}:</label>
                                  <select
                                    id="periodType"
                                    value={tempPeriodType}
                                    onChange={handleTempPeriodTypeChange}
                                    className="rounded-select"
                                  >
                                    <option value="Yearly">{t("Yearly")}</option>
                                    <option value="Monthly">{t("Monthly")}</option>
                                    <option value="Date Range">{t("Date Range")}</option>
                                  </select>
                                </div>
                                <div className="filter-item">
                                  <label htmlFor="periodValue">
                                    {tempPeriodType === 'Yearly' ? t("Select Year:"): tempPeriodType === 'Monthly' ? t("Select Month:") : ""}
                                  </label>

                                  {tempPeriodType === 'Yearly' &&
                                    (
                                      <select
                                        id="periodValue"
                                        value={tempYear}
                                        onChange={handleTempYearChange}
                                        className="rounded-select"
                                      >
                                        {years.map(year => (
                                          <option key={year} value={year}>
                                            {year}
                                          </option>
                                        ))}
                                      </select>
                                    )
                                  }

                                  {tempPeriodType === 'Monthly' &&
                                    (
                                      <div className="d-flex">
                                        <select
                                          id="periodYear"
                                          value={tempYear}
                                          onChange={handleTempYearChange}
                                          className="rounded-select mr-2"
                                        >
                                          {years.map(year => (
                                            <option key={year} value={year}>
                                              {year}
                                            </option>
                                          ))}
                                        </select>
                                        <select
                                          id="periodMonth"
                                          value={tempMonth}
                                          onChange={handleTempMonthChange}
                                          className="rounded-select"
                                        >
                                          {months.map(month => (
                                            <option key={month.value} value={month.value}>
                                              {month.label}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    )}

                                  {tempPeriodType === 'Date Range' && (
                                    <>
                                      <label htmlFor="startDate">{t("Start Date")}:</label>
                                      <input
                                        type="date"
                                        id="startDate"
                                        value={tempStartdate}
                                        onChange={handleStartDateChange}
                                        className="rounded-input mb-10px"
                                        max={tempEnddate}
                                      />
                                      <label htmlFor="endDate">{t("End Date")}:</label>
                                      <input
                                        type="date"
                                        id="endDate"
                                        value={tempEnddate}
                                        onChange={handleEndDateChange}
                                        className="rounded-input"
                                        min={tempStartdate}
                                      />
                                    </>
                                  )}

                                </div>
                                <div className="filter-buttons">
                                  <button onClick={handleFilterSubmit} className="filter-button submit-button">{t("Apply")}</button>
                                  <button onClick={handleFilterReset} className="filter-button reset-button">{t("Reset")}</button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <> </>
                          )}
                        </div>
                        <Grid container spacing={2}>
                          <Grid item xs={APP_LOCALE === "CC006" ? 6 : 12} sm={APP_LOCALE === "CC006" ? 6 : 4} md={APP_LOCALE === "CC006" ? 6 : 4}
                            lg={APP_LOCALE === "CC006" ? 6 : 4}>
                            <Card variant="outlined" className="bg-lightgrey home-box">
                              <CardContent className="pb-0">
                                <div className="main-first-section">
                                  <img src={imgUrl.med_icon} className="med-icon"></img>
                                  <h5 className="mb-0 mt-0 mx-4px">
                                    {_.find(dashboardCards, {
                                      indiacatorname: "Total Patients Registered Till Now",
                                    })?.count || 0}
                                  </h5>
                                </div>
                                <div className="main-first-section">
                                  <p>{t("TOTAL PATIENTS REGISTERED TILL NOW")}</p>
                                </div>
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item xs={APP_LOCALE === "CC006" ? 6 : 12} sm={APP_LOCALE === "CC006" ? 6 : 4} md={APP_LOCALE === "CC006" ? 6 : 4}
                            lg={APP_LOCALE === "CC006" ? 6 : 4}>
                            <Card variant="outlined" className="bg-lightgrey home-box">
                              <CardContent className="pb-0">
                                <div className="main-first-section">
                                  <img src={imgUrl.calender_icon} className="calender-icon"></img>
                                  <h5 className="mb-0 mt-0 mx-4px">
                                    {_.find(dashboardCards, { indiacatorname: "Total Patients Registered" })?.count || 0}
                                  </h5>
                                </div>
                                <div className="main-first-section">
                                  <p>
                                    {t("TOTAL PATIENTS REGISTERED")}{" "} {periodType && periodType !== "Date Range" ? `${t("IN")} ${startdate}` : `${t("FROM")} ${startdate} ${t("TO")} ${enddate}`}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </Grid>

                          {APP_LOCALE !== "CC006" && (
                            <Grid item xs={12} sm={4} md={4} lg={4}>
                              <Card variant="outlined" className="bg-lightgrey home-box">
                                <CardContent className="pb-0">
                                  <div className="main-first-section">
                                    <img src={imgUrl.clock_icon} className="clock-icon"></img>
                                    <h5 className="mb-0 mt-0 mx-4px">
                                      {_.find(dashboardCards, { indiacatorname: "Total Patient Followed Up In The Current Year" })?.count || 0}
                                    </h5>
                                  </div>
                                  <div className="main-first-section">
                                    <p>
                                      {t("TOTAL PATIENTS FOLLOWED UP")}{" "} {periodType && periodType !== "Date Range" ? `${t("IN")} ${startdate}` : `${t("FROM")} ${startdate} ${t("TO")} ${enddate}`}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                          )}
                        </Grid>


                        <div className="main-second-mainchartSection">

                          <Grid
                            container
                            spacing={2}
                            className="mt-10px main-second-chartSection main-chart-SubSection"
                          >
                            <Grid item xs={12} sm={12} md={12} lg={12} className="blur-container">
                              <Card variant="outlined" className="bg-lightgrey">
                                <div className="relative-container">
                                  <CardContent className={`blur-content ${periodType !== "Yearly" ? "blur-effect" : ""}`}>
                                    <div className="main-second-section mb-10px">
                                      <div className="heading">
                                        <h4 className="mt-0 mb-0">
                                          {t("TOTAL PATIENTS REGISTERED")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}
                                        </h4>
                                      </div>

                                      <div className="main-icon">
                                        <Tooltip title={t("This chart is available only for yearly filter")}>
                                          <InfoIcon className="info-icon" />
                                        </Tooltip>
                                        {/* <Button variant="contained" className="blue-icon">%</Button>
                                    <Button variant="contained" className="gray-icon">#</Button> */}
                                      </div>
                                    </div>

                                    <div className="">
                                      {" "}
                                      <LineChart2 followUpChart={followUpChart ? followUpChart : ""} />
                                    </div>

                                  </CardContent>
                                  {/* Show overlay when periodType is Monthly or Date Range */}
                                  {periodType !== "Yearly" && (
                                    <div className="overlay-message">
                                      <p>{t("Chart available only for yearly filter")}</p>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            </Grid>
                            {/* <Grid item xs={12} sm={6} md={6} lg={6}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-15px">
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">
                                        {t("PATIENT CLUSTERS TO T1D FACILITIES")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}
                                      </h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title={t("Distribution of patients by location")}>
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>
                                     
                                    </div>
                                  </div>

                                  <div className="">
                                    <MyMapComponentDash
                                      homePageMap={homePageMap ? homePageMap : ""}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid> */}
                          </Grid>
                          <Grid
                            container
                            spacing={2}
                            className="mt-10px main-second-chartSection"
                          >

                            <Grid item xs={12} sm={12} md={12} lg={6}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0 pb-16px">

                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">
                                        {t("GENDER WISE DISTRIBUTION")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}
                                      </h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title={t("Distribution of patients by gender")}>
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>

                                    </div>
                                  </div>
                                  <div>
                                    <PieChart
                                      homePageCharts={
                                        _.find(homePageCharts, "GenderWise")
                                          ? _.find(homePageCharts, "GenderWise")
                                            .GenderWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6}>

                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0 pb-16px">

                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">
                                        {t("AGE WISE DISTRIBUTION")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}
                                      </h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title={t("Distribution of patients by age")}>
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>

                                    </div>
                                  </div>
                                  <div className="">
                                    <BarChartPyramid
                                      homePageCharts={
                                        _.find(homePageCharts, "AgeWise")
                                          ? _.find(homePageCharts, "AgeWise")
                                            .AgeWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent>
                              </Card>

                            </Grid>
                          </Grid>
                          {/*  */}
                          {APP_LOCALE === "CC008" && (<Grid
                            container
                            spacing={2}
                            className="mt-10px main-second-chartSection"
                          >
                            <Grid item xs={12} className="blur-container">
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0">
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">{t("SOCIO-ECONOMIC CLASS")}</h4>
                                    </div>
                                    <div className="main-icon">
                                      {/* <Tooltip title="Types of hospital visits by patients.">
                                          <InfoIcon className="info-icon" />
                                        </Tooltip> */}
                                    </div>
                                  </div>
                                  <div>
                                    <SocioEconomic
                                      socioEconomicCharts={socioEconomicCharts ? socioEconomicCharts : ""}
                                    />
                                  </div>
                                </CardContent>
                              </Card>

                              {/* <CardContent className="pb-0 pb-16px">
                               
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">
                                        {t("GENDER WISE DISTRIBUTION")}
                                      </h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title="Distribution of patients by gender">
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>
                                
                                    </div>
                                  </div>
                                  <div>
                                    <PieChart
                                      homePageCharts={
                                        _.find(homePageCharts, "GenderWise")
                                          ? _.find(homePageCharts, "GenderWise")
                                            .GenderWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent> */}
                            </Grid>
                          </Grid>
                          )}
                          {/*  */}
                          <Grid
                            container
                            spacing={2}
                            className="mt-10px main-second-chartSection"
                          >
                            <Grid item xs={12} className="blur-container">
                              <Card variant="outlined" className="bg-lightgrey">
                                <div className="relative-container">
                                  <CardContent className={`blur-content ${periodType !== "Yearly" ? "blur-effect" : ""}`}>

                                    <div className="">
                                      <InsulineTabs
                                        dashboardLineChart={dashboardLineChart ? dashboardLineChart : ""}
                                        onTabChange={handleTabChange}
                                        selectedYear={selectedYear}
                                      />
                                    </div>
                                  </CardContent>
                                  {periodType !== "Yearly" && (
                                    <div className="overlay-message">
                                      <p>{t("Chart available only for yearly filter")}</p>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            spacing={2}
                            className={`mt-10px main-second-chartSection main-chart-SubSection ${APP_LOCALE === "CC008" ? "hide" : ""}`}
                          >
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0">
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">
                                        {t("BLOOD PRESSURE")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}
                                      </h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title={t("Distribution of BP values among patients.")}>
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>
                                      {/* <Button
                                    variant="contained"
                                    className="blue-icon"
                                  >
                                    %
                                  </Button>
                                  <Button
                                    variant="contained"
                                    className="gray-icon"
                                  >
                                    #
                                  </Button> */}
                                    </div>
                                  </div>
                                  <div className="">
                                    <BloodPressureDash
                                      homePageCharts={
                                        _.find(homePageCharts, "LabValueWise")
                                          ? _.find(homePageCharts, "LabValueWise")
                                            .LabValueWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0">
                                  {/* <div className="main-second-section">
                              <h4 className="mt-0 mb-0">BMI</h4>
                            </div> */}
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">{t("BMI")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}</h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title={t("Distribution of BMI values among patients.")}>
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>
                                      {/* <Button
                                    variant="contained"
                                    className="blue-icon"
                                  >
                                    %
                                  </Button>
                                  <Button
                                    variant="contained"
                                    className="gray-icon"
                                  >
                                    #
                                  </Button> */}
                                    </div>
                                  </div>
                                  <div>
                                    <BMIChartDash
                                      homePageCharts={
                                        _.find(homePageCharts, "LabValueWise")
                                          ? _.find(homePageCharts, "LabValueWise")
                                            .LabValueWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            {APP_LOCALE === "CC006" ?
                              <>
                                <Grid item xs={4}>
                                  <Card variant="outlined" className="bg-lightgrey">
                                    <CardContent className="pb-0">
                                      <div className="main-second-section mb-2">
                                        <div className="heading">
                                          <h4 className="mt-0 mb-0">
                                            {t("PATIENTS STATUS")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}
                                          </h4>
                                        </div>

                                        <div className="main-icon">
                                          <Tooltip title={t("Distribution of treatment outcomes.")}>
                                            <InfoIcon className="info-icon" />
                                          </Tooltip>
                                        </div>
                                      </div>
                                      <div>
                                        <PatientStatusBarChart
                                          homePageCharts={
                                            _.find(homePageCharts, "PatientWise")
                                              ? _.find(homePageCharts, "PatientWise")
                                                .PatientWise
                                              : ""
                                          }
                                        />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              </>
                              :
                              <>
                                {/* <Grid item xs={12} sm={12} md={12} lg={4}>
                                  <Card variant="outlined" className="bg-lightgrey">
                                    <CardContent className="pb-0">
                                      <div className="main-second-section mb-2">
                                        <div className="heading">
                                          <h4 className="mt-0 mb-0">{t("PULSE")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}</h4>
                                        </div>

                                        <div className="main-icon">
                                          <Tooltip title={t("Distribution of pulse rates among patients..")}>
                                            <InfoIcon className="info-icon" />
                                          </Tooltip>
                                    
                                        </div>
                                      </div>
                                      <div>
                                        <PulseChart
                                          homePageCharts={
                                            _.find(homePageCharts, "LabValueWise")
                                              ? _.find(homePageCharts, "LabValueWise")
                                                .LabValueWise
                                              : ""
                                          }
                                        />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Grid> */}
                              </>
                            }



                          </Grid>
                          <Grid
                            container
                            spacing={2}
                            className={`mt-10px main-second-chartSection ${APP_LOCALE === "CC008" ? "hide" : ""}`}
                          >
                            {/* Risk Factor Chart */}
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0">
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">{t("RISK FACTORS")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}</h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title={t("Various risk factors identified among patients.")}>
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>
                                      {/* <Button
                                    variant="contained"
                                    className="blue-icon"
                                  >
                                    %
                                  </Button>
                                  <Button
                                    variant="contained"
                                    className="gray-icon"
                                  >
                                    #
                                  </Button> */}
                                    </div>
                                  </div>
                                  <div className="">
                                    <RiskFactorTreeChart
                                      homePageCharts={
                                        _.find(homePageCharts, "RiskWise")
                                          ? _.find(homePageCharts, "RiskWise")
                                            .RiskWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            {/* Complications Chart */}
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0">
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">{t("COMPLICATIONS")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}</h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title={t("Complications observed in patients with type 1 diabetes.")}>
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>
                                      {/* <Button
                                    variant="contained"
                                    className="blue-icon"
                                  >
                                    %
                                  </Button>
                                  <Button
                                    variant="contained"
                                    className="gray-icon"
                                  >
                                    #
                                  </Button> */}
                                    </div>
                                  </div>
                                  <div>
                                    <ComplicationTreeChart
                                      homePageCharts={
                                        _.find(homePageCharts, "RiskWise")
                                          ? _.find(homePageCharts, "RiskWise")
                                            .RiskWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            {/* Hyperglycemia Chart */}
                            {/* <Grid item xs={6}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0">
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">{t("HYPERGLYCEMIC SYMPTOMS")}</h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title="Incidences of hyperglycemic symptoms among patients.">
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div className="">
                                    <HyperglycemicTreeChart
                                      homePageCharts={
                                        _.find(homePageCharts, "SymptompWise")
                                          ? _.find(homePageCharts, "SymptompWise")
                                            .SymptompWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid> */}

                            {/* Hypoglycemia Chart */}
                            {/* <Grid item xs={6}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0">
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">{t("HYPOGLYCEMIC SYMPTOMS")}</h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title="Incidences of hypoglycemic symptoms among patients.">
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div className="">
                                    <HypoglycemicTreeChart
                                      homePageCharts={
                                        _.find(homePageCharts, "SymptompWise")
                                          ? _.find(homePageCharts, "SymptompWise")
                                            .SymptompWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid> */}

                          </Grid>
                          <Grid
                            container
                            spacing={2}
                            className="mt-10px main-second-chartSection"
                          >
                            <Grid item xs={12} className={APP_LOCALE === "CC008" ? "hide" : ""}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0">
                                  <div className="">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">{t("For Year")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}</h4>
                                    </div>
                                    <BasicTestsTabs
                                      basicTestData={basicTestBarChart ? basicTestBarChart : ""}
                                      onTabChange={handleBasicChartTabChange}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            spacing={2}
                            className={`mt-10px main-second-chartSection ${APP_LOCALE === "CC008" || APP_LOCALE === "CC006" ? "hide" : ""}`}
                          >
                            {/* <Grid item xs={12} sm={6} md={6} lg={6}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0">
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">
                                        {t("PATIENT HOSPITAL VISIT TYPE")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}
                                      </h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title={t("Types of hospital visits by patients.")}>
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div className="">
                                    <PatientHospitalVisits
                                      homePageCharts={
                                        _.find(homePageCharts, "HospitalWise")
                                          ? _.find(homePageCharts, "HospitalWise")
                                            .HospitalWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid> */}
                            {/* <Grid item xs={12} sm={6} md={6} lg={6}>
                              <Card variant="outlined" className="bg-lightgrey">
                                <CardContent className="pb-0">
                               
                                  <div className="main-second-section mb-2">
                                    <div className="heading">
                                      <h4 className="mt-0 mb-0">
                                        {t("PATIENTS STATUS")} {(periodType === "Yearly" ? startdate : new Date().getFullYear())}
                                      </h4>
                                    </div>

                                    <div className="main-icon">
                                      <Tooltip title={t("Distribution of treatment outcomes.")}>
                                        <InfoIcon className="info-icon" />
                                      </Tooltip>
                                   
                                    </div>
                                  </div>
                                  <div>
                                    <PatientStatusBarChart
                                      homePageCharts={
                                        _.find(homePageCharts, "PatientWise")
                                          ? _.find(homePageCharts, "PatientWise")
                                            .PatientWise
                                          : ""
                                      }
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid> */}
                          </Grid>

                        </div>
                      </div>
                    </div>
                    {userrolename && userrolename.toLowerCase() == superAdmin ? (
                      <></>
                    ) : userrolename && userrolename == patientRole ? (
                      <div
                        className="chatbotBox"
                        onClick={() => {
                          window.open("http://bit.ly/3Ww8GOI", "_system");
                        }}
                      >
                        <div className="chatDiv">
                          <img src={imgUrl.chatbot} className="botImg" />
                        </div>
                      </div>
                    ) : (
                      <Tooltip title={t("Appointments")} arrow>
                        <div
                          className="chatbotBox hide"
                          onClick={() => openAppointment()}
                        >
                          <div className="chatDiv">
                            <EventIcon></EventIcon>
                          </div>
                        </div>
                      </Tooltip>
                    )}

                    <div className="bottomstatspart">
                      <div className="circleholderdiv">
                        <div class="redcircle">
                          <h3 id="totalStakeHolder">123</h3>
                        </div>
                        <p class="circleredtext">Registered</p>
                      </div>
                      <div className="circleholderdiv">
                        <div class="redcircle">
                          <h3 id="totalStakeHolder">123</h3>
                        </div>
                        <p class="circleredtext">Registered</p>
                      </div>
                      <div className="circleholderdiv">
                        <div class="redcircle">
                          <h3 id="totalStakeHolder">123</h3>
                        </div>
                        <p class="circleredtext">Registered</p>
                      </div>
                    </div>
                  </Grid>
                </>
              )}

              {appointmentPopup ? (
                <>
                  <div className="modaloverlay eventpopup">
                    <div className="modalcardholder">
                      <Card className="modalcard">
                        <CardHeader
                          className="modalheader"
                          action={
                            <IconButton aria-label="close">
                              <CloseIcon
                                onClick={() => setAppointmentPopup(null)}
                              />
                            </IconButton>
                          }
                          title={t("Appointments")}
                        />
                        <CardContent className="modalbodycontent">
                          <Appointment></Appointment>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              {/* Conditionally Render Chat Widget */}
              {/* code for bot view */}
              {/* <ChatBotWidget
                  callApi={customApiCall}
                  avatar={imgUrl.botIcon}
                  primaryColor="#001965"
                  inputMsgPlaceholder="Type your message..."
                  chatbotName="T1D BOT"
                  isTypingMessage="Typing..."
                  IncommingErrMsg="Oops! Something went wrong. Try again."
                  handleNewMessage={handleNewUserMessage}
                  chatIcon={
                    <div className="voiceFixIcon">
                      <img src={imgUrl.botIcon}></img>
                    </div>
                  }
                /> */}
            </Grid>
          </section>
        </main>

        <div>
          <p>test</p>
        </div>

      </div>

  );
}

//export default NewThemeHomePage;
export default connect(null, { setLoginUser, setLanguageList })(
  NewThemeHomePageDrop
);