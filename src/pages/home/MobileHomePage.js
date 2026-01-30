import React, { Component, useState, useEffect } from "react";
import { withTranslation, Trans, useTranslation } from "react-i18next";
import classes from "../../App.module.css";
import axios from "axios";
import _ from 'lodash';
import { connect } from "react-redux";
import "../../assets/css/customstyles.css";
//import "../../assets/css/theme_grey.css";
import "../../assets/css/theme_blue.css";
// import "../../assets/css/theme_green.css";
// import "../../assets/css/theme_red.css";

// import "../../assets/css/customstyles.css";
// import "../../assets/css/theme_grey.css";
// import "../../assets/css/theme_blue.css";
// import "../../assets/css/theme_green.css";
// import "../../assets/css/theme_red.css";

import { Link, Redirect, useHistory } from "react-router-dom";
// import { Link, useHistory } from "react-router-dom";
import { MenuItem, Menu, Tab, TabBar, Button } from "@dhis2/ui";
import EventIcon from '@mui/icons-material/Event';
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
  faCommentMedical,
  faMapPin,
  faBookMedical,
  faCalendar,
  faBookOpen
} from "@fortawesome/free-solid-svg-icons";

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
import { setLanguageList } from "../../redux/actions/action";
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import Service from "../../imon/api/api";
import Appointment from "../appointment/appointment";
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
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

function MobileHomePage(props) {
  const history = useHistory();
  const [ConfigurationFromServer,setConfigurationFromServer] = useState(null);
  const metaDataParam = Configuration.homepage.metaDataParam;
  const relationshipTypeParams = Configuration.homepage.relationshipTypeParam;
  const DEGParams = Configuration.homepage.DEGParams;
  const OUGroupParams = Configuration.homepage.OUGroupParam;
  const programRuleVariableParam =
    Configuration.homepage.programRuleVariableParam;
  const dataSetParams = Configuration.homepage.dataSets;
  const dataSetValidationApi = Configuration.homepage.dataSetValidations
  const OUStructureParams = Configuration.homepage.OUStrutureParams;
  const [reloadData, setReloadDataFlag] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [userConsent, setUserConsent] = React.useState(null);
  const [userConsentAttributeIndex, setUserConsentAttributeIndex] =
    React.useState(null);
  const [programData, setProgramData] = React.useState(null);
  const { t, i18n } = useTranslation();
  const [switchBoxFlag, setSwitchBoxFlag] = React.useState(false);
  const progressIncrement = progress + 10;
  const [userrolename, setuserrolename] = React.useState(null);
  const patientRole = "Patient Role"
  const superAdmin = "superuser"
  const facilityUser = "facilityUser";
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  const [appointmentPopup, setAppointmentPopup] = useState(null);
  
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
    faCalendar
	  };

  async function getUserBo() {
    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);
    
    let configurations = await OfflineDb.getDataFromPouchDB('configurations')
    setConfigurationFromServer(configurations.data.configuration)
  }

  function appUpdate(){
    swal({
      title: t("Application update"),
      text: t("The current version of the application is no longer supported. Kindly upgrade the same!"),
      icon: "warning",
      button: Configuration.mobileAppMode && Configuration.mobileAppMode == 'debug' ? t("Ok") : t("Update")
    }).then(res=>{
      if(Configuration.mobileAppMode && Configuration.mobileAppMode == 'debug'){
        appUpdate()
      }else{
        if(window.cordova && window.cordova.platformId == 'ios'){
            window.open(Configuration.mobileAppiOSUrl, '_system');
        }else{
            window.open(Configuration.mobileAppDownloadUrl, '_system');
        }
      }
    })
  }

  useEffect(() => {
    if(localStorage.getItem("showCases")){
      localStorage.removeItem("showCases")
    }
    if(localStorage.getItem("stagesShow")){
      localStorage.removeItem("stagesShow")
    }
  }, []);

  useEffect(() => {
    getUserBo();
    i18n.changeLanguage(localStorage.getItem("locale"));
    document.addEventListener('deviceready', () => {
      try{
        if(window.cordova && window.FirebasePlugin && userrolename && userrolename == patientRole){
          window.FirebasePlugin.onTokenRefresh(function(fcmToken) {
            console.log("fcmToken", fcmToken);
            localStorage.setItem('fcmToken', fcmToken);
            var param = {
              communityId: localStorage.getItem("CommunityId"),
              userId: JSON.parse(localStorage.getItem("obj")).userId,
              fcmId: fcmToken,
            };
            if (navigator.onLine && param.fcmId) {
              Service.updateFcmId(param).then((data) => {
                console.log("addApplicant>>", data);
              })
            }
          }, function(error) {
              console.error(error);
          });
        }
      }catch(e){
        console.log("e")
      }
    })

    document.addEventListener('resume', () => {
      try{
          OfflineDb.getDataFromPouchDB('metaData')
              .then(metaData => {
              OfflineDb.getDataFromPouchDB('loginDetails')
              .then(loginDetails => {
                  if (loginDetails.data != undefined) {
                      const versionCheckParam = 'metadata?fields=:owner,displayName&programs:filter=id:eq:' + loginDetails.data.programs[0] + '&programs:fields=:owner,unique,playName,attributeValues[:all,attribute[id,name,displayName]]'
                      apiServices.getAPI(versionCheckParam)
                          .then(versionCheck => {
                              console.log('versionCheck', versionCheck)
                              if (metaData.data != undefined && versionCheck.data != undefined && Array.isArray(versionCheck.data.programs)) {
                                  if(window.cordova){
                                      let result = _.filter(versionCheck.data.programs[0].attributeValues, ['attribute.name', 'AppVersion'])
                                      if(result.length > 0 && result[0].value != Configuration.mobileAppVersion){
                                        appUpdate()
                                      }
                                  }
                              }
                          })
                  }
              })
          })
      }catch(e){

      }
    })
  }, []);

  useEffect(() => {
    if (progress == 100) {
      setReloadDataFlag(false);
    }
  }, [progress]);

  useEffect(() => {
    if (sessionUserBoValue != null) {
      setuserrolename(sessionUserBoValue.userRoles[0].name || sessionUserBoValue.userRoles[0].displayName);
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
                loginDetails.data.programs.toString() +
                "]"
            )
            .then((programsDetails) => {
              const filterProgramWithAccess =
                programsDetails.data.programs.filter(
                  (obj) => obj.publicAccess == "rwrw----"
                );

              //Second call
              OfflineDb.getDataFromPouchDB("programBoDetails").then((programBoDetails) => {
                  let metafinalurl =
                    "metadata?fields=:owner,displayName&programs:filter=id:eq:" +
                    programBoDetails.data.programuid +
                    "&programs:fields=:owner,displayName,description,attributeValues[:all,attribute[id,name,displayName,description,formName]],organisationUnits[id,path,displayName,description,level],dataEntryForm[:owner],programSections[id,name,displayName,formName,description,translations[*],renderType,program,sortOrder,lastUpdated,trackedEntityAttributes[id,name,displayName,formName,description,code,sortOrder,attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id]]],notificationTemplates[:owner],programTrackedEntityAttributes[:owner,renderType,trackedEntityAttribute[id,displayName,formName,description,translations[*],valueType,unique,optionSet[id,options[id,code,displayName,description,translations[*],style]],attributeValues[:all,attribute[id,name,displayName,description]],domainType]],user[id,name],programStages[:owner,user[id,name],userAccesses,userGroupAccesses,displayName,description,attributeValues[:all,attribute[id,name,displayName,description]],programStageDataElements[:owner,renderType,unique,dataElement[id,displayName,description,formName,displayFormName,unique,valueType,fieldMask,translations[*],attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id,options[id,code,displayName,description,translations[*],%20style]],domainType]],notificationTemplates[:owner,displayName,description],dataEntryForm[:owner],programStageSections[:owner,displayName,description,translations[*],dataElements[id,displayName,description]]]&dataElements:fields=id,displayName,formName,description,valueType,translations[*],optionSet&dataElements:filter=domainType:eq:TRACKER&trackedEntityAttributes:fields=id,displayName,formName,description,valueType,optionSet[id,options[id,code,displayName,description,style]],unique";
                  
              //Second call //metaDataParam
              apiServices.getAPI(metafinalurl).then((metaData) => {
                metaData.data.programs.map((programs) => {
                  const filterOU = programs.organisationUnits.find(
                    (array) =>
                      array.id == loginDetails.data["organisationUnits"][0].id
                  );

                  if (filterOU != undefined) {
                    metaData.data.programs = [programs];
                    loginDetails.data.programs = [metaData.data.programs[0].id];

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
                apiServices.getAPI(relationshipTypeParams).then((response) => {
                  const relationshipTypes = response.data.relationshipTypes;
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
                  apiServices.getAPI(DEGParams).then((dataElementGroup) => {                    
                    //sort dataElementGroup                    
                    dataElementGroup.data.dataElementGroups.map(dataElementGroups => {
                      metaData.data.programs[0].programStages.map(programStages => {
                        let findDataElementInStage = programStages.programStageDataElements.find(x => x.dataElement.displayName == dataElementGroups.displayName)
                        if(findDataElementInStage) {
                          dataElementGroups.dataElements.map(dataElements => {
                            let findDataElementOptionsInStage = programStages.programStageDataElements.find(x => x.dataElement.id == dataElements.id)
                            if(findDataElementOptionsInStage) {
                              dataElements['sortOrder'] = findDataElementOptionsInStage.sortOrder
                            }
                          })
                        }
                        
                      })
                      dataElementGroups.dataElements = _.orderBy(dataElementGroups.dataElements, ['sortOrder'], ['asc'])
                    })
                    OfflineDb.setDataIntoPouchDB(
                      "dataElementGroup", dataElementGroup.data
                    );
                    setProgress(40);

                    //Fifth Call
                    apiServices.getAPI(OUGroupParams).then((OUGroups) => {
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
                            .getAPI(programRuleVariableParam+'&filter=program.id:eq:'+loginDetails.data.programs[0])
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
                                      dataSetRules.data ? dataSetRules.data.validationRules ? dataSetRules.data.validationRules : [] : []
                                    );
                                    setProgress(90);
                                 
                                  let ouAPI = OUStructureParams
                                  if(programBoDetails && programBoDetails.data && programBoDetails.data.orguid){
                                    ouAPI = 'organisationUnits/' + programBoDetails.data.orguid + '?includeDescendants=true&paging=false&fields=id,level,name,displayFormName,children,comment'
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

            })
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
                      const versionCheckParam =
                        "metadata?fields=:owner,displayName&programs:filter=id:eq:" +
                        loginDetails.data.programs[0] +
                        "&programs:fields=:owner,unique,playName,attributeValues[:all,attribute[id,name,displayName]]";
                      apiServices
                        .getAPI(versionCheckParam)
                        .then((versionCheck) => {
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
                            if(window.cordova){
                              let result = _.filter(versionCheck.data.programs[0].attributeValues, ['attribute.name', 'AppVersion'])
                              if(result.length > 0 && result[0].value != Configuration.mobileAppVersion){
                                appUpdate()
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
  }, [reloadData]);

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
        if (val.attribute.displayName === "IsConsent"){//} && val.value == "true") {
          if(val.value == "true"){
            setUserConsent(true);
            setUserConsentAttributeIndex(indx);
          }else{
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
  function getFlag(flag) {
    // setSwitchBoxFlag(!flag)
    return switchBoxFlag;
  }
  function setFlag(flag) {
    setSwitchBoxFlag(!flag);
  }
  function openAdherence(){
    setGlobalSpinner(true)

    OfflineDb.getDataFromPouchDB('userData')
    .then(doc => {
      setGlobalSpinner(false)
      try{
        const activeCaseDetails = {
          'trackedEntityInstance': doc.data.attributeValues[0].value,
          'enrollmentId': "",
        }
        OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
        setGlobalSpinner(false)
        history.push('/layout/registration')
      }catch(e){
        console.log("e ",e);
      }
    }).catch(e => {
      setGlobalSpinner(false)
    })
  }
  const onMenuClick = (menuName) => {
    if(menuName == "Patient Record List") {
      // OfflineDb.removeDataFromPouchDB('activeCaseDetails')
      // OfflineDb.removeDataFromPouchDB('activeCaseFormData')
      // OfflineDb.removeDataFromPouchDB('linkContactFlag')
      localStorage.setItem('showCases', true);
      history.push('/layout/registration',{showCases:true})
    }
    if(menuName == "Treatment Adherence") {
      openAdherence()
    }
    if(menuName == "Users") {
      if (window.cordova && window.cordova.InAppBrowser) {
        window.cordova.InAppBrowser.open(Configuration.apiSurvey.key+"dhis-web-user/#/",'_system')
      }else{
        window.open(Configuration.apiSurvey.key+"dhis-web-user/#/",'_blank')
      }
    }
    if(menuName == "Organisations") {
      if (window.cordova && window.cordova.InAppBrowser) {
        window.cordova.InAppBrowser.open(Configuration.apiSurvey.key+"dhis-web-maintenance/index.html#/list/organisationUnitSection/organisationUnit",'_system')
      }else{
        window.open(Configuration.apiSurvey.key+"dhis-web-maintenance/index.html#/list/organisationUnitSection/organisationUnit",'_blank')
      }
    }
  }

  function renderNewStyleMenuitems(){
    console.log(ConfigurationFromServer,"ConfigurationFromServer")
    return <Menu className="">
			{ConfigurationFromServer && ConfigurationFromServer.sidebar.menuItems.map((menuItems, index) => {
				return (
					(menuItems.showMenu) ?
            menuItems.name == "Patient Record List" ?
						<Link
								className={classes.noDeco}
								//to={menuItems.path}
								onClick={() => onMenuClick(menuItems.name)}
								key={index}
                state={{test: 'test'}}
							>
							<MenuItem
								className="menuitem"
								dataTest="dhis2-uicore-menuitem"
								icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
								label={t(menuItems.name)}
							/>
						</Link>
						:
						<Link
							className={classes.noDeco}
							to={menuItems.path}
							onClick={() => onMenuClick(menuItems.name)}
							key={index}
						>
						<MenuItem
							// className="menuitem"
							dataTest="dhis2-uicore-menuitem"
							icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
							label={t(menuItems.name)}
						/>
					</Link>
					:null
					
				)
				
				
			})}
			
    </Menu>
  }
  function renderFacilityUserComponent() {
    ConfigurationFromServer.homepage.menuItems = _.filter(ConfigurationFromServer.homepage.menuItems,function(obj){
      return obj.iconClass.includes('facilityUser')
    })
    console.log(" ConfigurationFromServer.homepage.menuItems ", ConfigurationFromServer.homepage.menuItems);
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
    return ConfigurationFromServer.homepage.menuItems.map((menuItems, index) => {
      if (index % 2 == 0) {
        flag = !flag;
      }
      flag = !flag;
      return (
        <Grid
          key={index}
          item
          xs={6}
          sm={6}
          md={6}
          className={menuItems.iconClass && menuItems.iconClass.includes('facilityUser')? "" : "hide"}
        >
          <div
            className={
              flag ? "homemenucontainer superadminhomecontainer" : "homemenucontainer background-theme superadminhomecontainer"
            }
          >
            <Link
              className={reloadData ? "anchorLink disbaledLink" : "anchorLink "}
              to={menuItems.path}
              onClick={() => onMenuClick(menuItems.name)}
            >
              <p className="zero text-center">
                <div
                  className={
                    flag
                      ? menuItems.iconClass + " background_white"
                      : menuItems.iconClass
                  }
                ></div>
              </p>
              <p
                className={
                  flag
                    ? "text-uppercase text-center"
                    : "text-uppercase color-white text-center"
                }
              >
                <Trans>{menuItems.name}</Trans>
              </p>
            </Link>
          </div>
        </Grid>
      );
    });
  }
  function rendermenuitems() {
    ConfigurationFromServer.homepage.menuItems = _.filter(ConfigurationFromServer.homepage.menuItems,{"showMenu":true})
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
    return ConfigurationFromServer.homepage.menuItems.map((menuItems, index) => {      
      if (index % 2 == 0) {
        flag = !flag;
      }
      flag = !flag;
      //if(menuItems.showMenu){
      if(menuItems.name == "Patient Record List"){
        menuItems.path = '/layout/cases'
      }
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
              flag ? "homemenucontainer background-theme" : "homemenucontainer"
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
              
    });
  } 

  function renderPatientMenuItems(){
    ConfigurationFromServer.homepage.menuItems = _.filter(ConfigurationFromServer.homepage.patientMenuItems,{"showMenu":true})
    let flag = true;
    if (ConfigurationFromServer.homepage.patientMenuItems.length % 2 != 0) {
      ConfigurationFromServer.homepage.patientMenuItems.push({
        name: "",
        icon: "",
        path: "",
        showMenu: true,
        iconClass: "",
      });
    }
    return ConfigurationFromServer.homepage.patientMenuItems.map((menuItems, index) => {      
      if (index % 2 == 0) {
        flag = !flag;
      }
      flag = !flag;
      //if(menuItems.showMenu){
      if(menuItems.name == "Patient Record List"){
        menuItems.path = '/layout/cases'
      }
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
              onClick={()=>onMenuClick(menuItems.name)}
            >
            <div
            className={
              flag ? "homemenucontainer background-theme patienthomecontainer" : "homemenucontainer patienthomecontainer"
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
              
    });
  }
  function renderSuperUserComponent() {
    // <Cases></Cases>
    ConfigurationFromServer.homepage.menuItems = _.filter(ConfigurationFromServer.homepage.menuItems,function(obj){
      return obj.iconClass.includes('superadmin')
    })
    console.log(" ConfigurationFromServer.homepage.menuItems ", ConfigurationFromServer.homepage.menuItems);
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
    return ConfigurationFromServer.homepage.menuItems.map((menuItems, index) => {
      if (index % 2 == 0) {
        flag = !flag;
      }
      flag = !flag;
      return (
        <Grid
          key={index}
          item
          xs={6}
          sm={6}
          md={6}
          className={menuItems.iconClass && menuItems.iconClass.includes('superadmin')? "" : "hide"}
        >
          <div
            className={
              flag ? "homemenucontainer superadminhomecontainer" : "homemenucontainer background-theme superadminhomecontainer"
            }
          >
            <Link
              className={reloadData ? "anchorLink disbaledLink" : "anchorLink "}
              to={menuItems.path}
              onClick={() => onMenuClick(menuItems.name)}
            >
              <p className="zero text-center">
                <div
                  className={
                    flag
                      ? menuItems.iconClass + " background_white"
                      : menuItems.iconClass
                  }
                ></div>
              </p>
              <p
                className={
                  flag
                    ? "text-uppercase text-center"
                    : "text-uppercase color-white text-center"
                }
              >
                <Trans>{menuItems.name}</Trans>
              </p>
            </Link>
          </div>
        </Grid>
      );
    });
  }
  const openAppointment = () => {
    setAppointmentPopup(true)
  }

  return (
    <div className={classes.container}>
      <main style={{ display: "flex", height: "100%", width: "100%" }}>
        <section
          className="mainsection pb-0 pT-55"
          style={{
            // backgroundColor: '#fff',
            flexGrow: 1,
            padding: 0,
          }}
        >
          <Grid container spacing={0}>
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
          <Grid item xs={12} sm={12} md={12} className="menulistingholder d-none1">
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
              <div className="homemenupageholder d-none1">
                <div className="w-100">
                  <Grid container spacing={0} className="">
                    {ConfigurationFromServer ? 
                    userrolename && userrolename.toLowerCase() == superAdmin ? 
                    renderSuperUserComponent() : 
                    userrolename && userrolename == patientRole ? 
                    renderPatientMenuItems() : 
                    userrolename == facilityUser
                    ? renderFacilityUserComponent(): 
                    rendermenuitems(): <></>
                    }
                  </Grid>
                </div>
                {userrolename && userrolename.toLowerCase() == superAdmin ?
                <></> :
                userrolename && userrolename == patientRole ?
             <div className="chatbotBoxm" onClick={()=>{window.cordova.InAppBrowser.open("whatsapp://send?text=Hello&phone=+918657024842","_system")}}>
                <div className="chatDivm">
                  <img src={imgUrl.chatbot} className="botImg" />
                </div>
                  
               </div>
               :
               <div className="appointment-box chatbotBoxm hide" onClick={() => openAppointment()}>
                    <div className="appointmentDivm">
                      <EventIcon></EventIcon>
                    </div>
                  </div>
               }
              </div>
            )}
            {
                appointmentPopup ? 
                <>
                <div className="modaloverlay eventpopup">
                    <div className="modalcardholder">
                        <Card className="modalcard">
                            <CardHeader
                                className="modalheader"
                                action={
                                    <IconButton aria-label="close">
                                        <CloseIcon onClick={() => setAppointmentPopup(null)} />
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
                :
                <></>
            }
          </Grid>
        </section>
      </main>
    </div>
  );
}

//export default MobileHomePage;
export default connect(null, {setLanguageList})(MobileHomePage);
