import React, { Component, useState, useEffect } from "react";
import { withTranslation, Trans, useTranslation } from "react-i18next";
import classes from "../../App.module.css";
import axios from "axios";
import _ from 'lodash';
import { connect } from "react-redux";
import {setLoginUser} from "../../redux/actions/action";
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
import { Typography } from "@material-ui/core";
import { setLanguageList } from "../../redux/actions/action";
import HeaderNew from "../../component/layout/HeaderNew";
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

function ImonHomePage(props) {
  const history = useHistory();
  const [ConfigurationFromServer,setConfigurationFromServer] = useState(null);
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
  const [userConsent, setUserConsent] = React.useState(null);
  const [userConsentAttributeIndex, setUserConsentAttributeIndex] =
    React.useState(null);
  const [programData, setProgramData] = React.useState(null);
  const { t, i18n } = useTranslation();
  const [switchBoxFlag, setSwitchBoxFlag] = React.useState(false);
  const progressIncrement = progress + 10;
  const [registerdClient, setRegisterdClient] = React.useState(null);
  const [alertCount, setAlertCount] = React.useState(null);
  const [transferInCount, setTransferInCount] = React.useState('0');
  const [transferOutCount, setTransferOutCount] = React.useState('0');
  const [transferInOutCount, setTransferInOutCount] = React.useState(null);
  const [referralCasesCount, setReferralCasesCount] = React.useState(null);
  const [referralCaseslist, setReferralCaseslist] = React.useState(null);
  const [myClientsCaseslist, setMyClientsCaseslist] = React.useState(null);

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
    faExchangeAlt
	  };

  async function getUserBo() {
    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);
    
    let configurations = await OfflineDb.getDataFromPouchDB('configurations')
    setConfigurationFromServer(configurations.data.configuration)
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
  }, []);

  useEffect(() => {
    if (progress == 100) {
      setReloadDataFlag(false);
    }
  }, [progress]);

  useEffect(() => {
    if (sessionUserBoValue != null) {
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
                //programBoDetails
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
                          TEAField.trackedEntityAttribute.displayName.toLocaleLowerCase() ==
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
                            .getAPI(programRuleVariableParam)
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
                      try{
                        if(loginDetails.data.programs && loginDetails.data.programs.length == 1){
                          getAlertCount(loginDetails.data.programs[0],loginDetails.data.organisationUnits[0].id)
                        }
                      }catch(e){

                      }
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
                                swal({
                                  title: t("Application update"),
                                  text: "The current version of the application is no longer supported. Kindly upgrade the same!",
                                  icon: "warning",
                                  button: t("Ok")
                                }).then(res=>{
                                  window.open(Configuration.mobileAppDownloadUrl, '_system');
                                })
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

  function getAlertCount(programId,orgId){
    let param={
      "param1":programId,"param2":orgId
    }
    apiServices.postAPI('common/getindicators/Get_customs_Clients_Alerts_counts', param)
            .then((result) => {
              if(result && result.data && result.data.data){
                let regClient = _.find(result.data.data,{"variablename":"ClientReg"})
                let alertsCount = _.find(result.data.data,{"variablename":"Alert_counts"})
                let referralCasesCount = _.find(result.data.data,{"variablename":"Referral"})
                let transferInCount = _.find(result.data.data,{"variablename":"Transfer In"})
                let transferOutCount = _.find(result.data.data,{"variablename":"Transfer Out"})
                if(regClient){
                  setRegisterdClient(regClient.numbercount)
                }
                if(alertsCount){
                  setAlertCount(alertsCount.numbercount)
                }
                if(referralCasesCount){
                  setReferralCasesCount(referralCasesCount.numbercount)
                }
                if(transferInCount){
                  setTransferInCount(transferInCount.numbercount)
                }
                if(transferOutCount){
                  setTransferOutCount(transferOutCount.numbercount)
                }
              }
            }).catch((e) => {
                console.log(e);
            })

    
    // apiServices.postAPI('dashboardIndicator/myclientsandreferrallist', {
    //   "prmuid":programId,"orguid":orgId})
    // .then((result) => {
    //     console.log("result ",result,result.data)
    //     if(result && result.data ){
    //       if(result.data.clientlist && result.data.clientlist.length > 0){
    //         setMyClientsCaseslist(result.data.clientlist)
    //       }else{
    //         setMyClientsCaseslist([])
    //       }
    //       if(result.data.clientlist && result.data.referrallist.length > 0){
    //         setReferralCaseslist(result.data.referrallist)
    //       }else{
    //         setReferralCaseslist([])
    //       }
    //     }
    // }).catch((e) => {
    //     console.log(e);
    // })
  }

  function checkUserConsent() {
    if (
      sessionUserBoValue != null &&
      sessionUserBoValue.attributeValues &&
      sessionUserBoValue.attributeValues.length > 0
    ) {
      sessionUserBoValue.attributeValues.map((val, indx) => {
        if (val.attribute.displayName === "IsConsent"){//} && val.value == "true") {
          if(val.value == "true"){
            setUserConsent(true);
            setUserConsentAttributeIndex(indx);
          }else{
            setUserConsent(false);
            setUserConsentAttributeIndex(indx);
          }
        } 
        // else {
        //   setUserConsent(false);
        //   setUserConsentAttributeIndex(indx);
        // }
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
  const onMenuClick = (menuName) => {
    if(menuName == "Logout") {
      let userrorle = localStorage.getItem('userrole')
      OfflineDb.getAllEntities().then(res=>{
      if(userrorle && userrorle == "Patient"){
        localStorage.clear()
				OfflineDb.deleteDatabse().then(res=>{
					props.setLoginUser(false)
          history.push('/onboarding')
				}).catch(err=>{
					props.setLoginUser(false)
          history.push('/onboarding')
				})
      }else if(res == undefined || res.total_rows == 0){
          localStorage.clear()
          OfflineDb.deleteDatabse().then(res=>{
            //(window.cordova) ? navigator.app.exitApp() : window.location.reload()
            props.setLoginUser(false)
          }).catch(err=>{
            //(window.cordova) ? navigator.app.exitApp() : window.location.reload()
            props.setLoginUser(false)
          }) 
        }else{
          swal({
            title: t("Offline data"),
            text: t("Offline records found, please sync data before logout"),
            icon: "warning",
            buttons: "Close",
          })/*.then(result=>{
            if(result){
              localStorage.clear()
              OfflineDb.cleanAppDB().then(response=>{
              })
              OfflineDb.deleteDatabse().then(res=>{
                //(window.cordova) ? navigator.app.exitApp() : window.location.reload()
                setLoginUser(false)
              }).catch(err=>{
                //(window.cordova) ? navigator.app.exitApp() : window.location.reload()
                setLoginUser(false)
              }) 
            }
          })*/
        }
        
      })		  
    }
    if(menuName == "My Clients") {
      // OfflineDb.removeDataFromPouchDB('activeCaseDetails')
      // OfflineDb.removeDataFromPouchDB('activeCaseFormData')
      // OfflineDb.removeDataFromPouchDB('linkContactFlag')
      localStorage.setItem('showCases', true);
      history.push('/layout/registration',{showCases:true})
    }
  }

  function renderNewStyleMenuitems(){
    return <Menu className="">
			<Link
          className={classes.noDeco}
          to="/myjourney"
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
          to="/layout/getknowledgeable"
          //onClick={() => onMenuClick(menuItems.name)}
          key={"0"}
          // state={{test: 'test'}}
        >
        <MenuItem
          // className="menuitem"
          dataTest="dhis2-uicore-menuitem"
          icon={<FontAwesomeIcon icon={faBookMedical} />}
          label={t("Disease Prevention and Control Guilde")}
        />
      </Link>
      <Link
          className={classes.noDeco}
          to="/layout/eduandknow"
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
            //to={menuItems.path}
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

  const casesList = (casesData) => {
    return (
      <div>
          <Typography variant="h6">{casesData["Name"]}</Typography>
          <Typography variant="body2">UID : {casesData["UID"]}</Typography>
          <Typography variant="body2">Client type: {casesData["ClientType"]}</Typography>
      </div>
    )
  }
  return (
    <div className={classes.container}>
      <HeaderNew></HeaderNew>
      <main style={{ display: "flex", height: "100%", width: "100%" }}>
        <section
          className="mainsection pb-0 pT-55 mainhome"
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
          <Grid item xs={12} sm={12} md={12} className="menulistingholder d-none">
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
                    {ConfigurationFromServer ? rendermenuitems(): <></>}
                  </Grid>
                </div>
              </div>
            )}
          </Grid>
          <Grid container spacing={0} className="patientModulesGrid">
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
            ) :
            <>
            <Grid item xs={2} sm={2} md={2} className="">
              <div className="leftsidebar" style={{marginTop:"50px"}}>
              {renderNewStyleMenuitems()}
              </div>
            </Grid>
            <Grid item xs={10} sm={10} md={10} className="rightsection">
                <div className="rightsectiontoppart">
                  <div className="statboxesholdermain">

                    <div className="statbox one">
                    <div className="clientBox">
                       <img src={imgUrl.clientImg} className="clientImg" />
                      </div>
                      <p className="statnumber one">{registerdClient ? registerdClient : 0}</p>
                      <p className="stattext">My Clients</p>
                    </div>
                    {/* <div className="statbox two">
                      <p className="statnumber">{referralCasesCount ? referralCasesCount : 0}</p>
                      <p className="stattext">Referral Cases</p>
                    </div>
                    <div className="statbox three">
                      <p className="statnumber">{transferInCount+" / "+transferOutCount}</p>
                      <p className="stattext">TRANSFER In / OUT</p>
                    </div> */}
                    <div className="statbox four">
                    <div className="alertBox">
                       <img src={imgUrl.alertImg} className="alertImg" />
                      </div>
                      <p className="statnumber  four">{alertCount ? alertCount : 0}</p>
                      <p className="stattext">ALERTS</p>
                    </div>
                  </div>
                </div>
            </Grid>
            <Grid container xs={12} lg={8} className="patientModules d-none">
              {/* <Grid container xs={12} lg={12}> */}
                <Grid item xs={12} md={3} className='homegriddesktop'>
                    <div className="homemenuholder_div">
                      <Link className={"anchorLink"} to={"/myjourney"}>
                        <div className="journeydiv">
                          {/* <img src={journey} className="appjourney" />
                          <img src={imgUrl.dohlogo} className="webjourney" /> */}
                          <div className="homemenutext">
                            <Typography variant="h5" className="oneuhcfont">
                              {"My Journey"}
                            </Typography>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={3} className='homegriddesktop'>
                  <div className="homemenuholder_div">
                    <Link className={"anchorLink"} to={"/layout/peerchat"}>
                      <div className="connectdiv">
                        {/* <img src={connected} /> */}
                        <div className="homemenutext">
                          {" "}
                          <Typography variant="h5" className="oneuhcfont">
                            {"Get Connected"}
                          </Typography>
                        </div>
                      </div>
                    </Link>
                  </div>
                </Grid>
                <Grid item xs={12} md={3} className='homegriddesktop'>
                <div className="homemenuholder_div">
                  <Link className={"anchorLink"} to={"/layout/nearme"}>
                    <div className="Nearmediv">
                      <div className="homemenutext">
                        {" "}
                        <Typography variant="h5" className="oneuhcfont">
                          {"Nearme"}
                        </Typography>
                      </div>
                      {/* <img src={nearrme} className="appnearme" />
                      <img src={imgUrl.nearme2x} className="webnearme" /> */}
                    </div>
                  </Link>
                </div>
              </Grid>
              <Grid item xs={12} md={3} className='homegriddesktop'>
                <div className="homemenuholder_div diseasediv">
                  <Link className={"anchorLink"} to={"/layout/getknowledgeable"}>
                    <div className='guidediv'>
                      <div className='homemenutext'> <Typography variant='h5' className='oneuhcfont'>{("Disease Prevention and control guide")}</Typography></div>
                      {/* <img src={disease} className="apptask" />
                      <img src={imgUrl.referred2x} className="webtask" /> */}
                    </div>
                  </Link>
                </div>
              </Grid>
              {/* </Grid> */}
            </Grid>
            </>
          }
          </Grid>
        </section>
      </main>
    </div>
  );
}

//export default NewThemeHomePage;
export default connect(null, {setLoginUser,setLanguageList})(ImonHomePage);

