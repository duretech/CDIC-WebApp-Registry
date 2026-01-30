
import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import i18n from '@dhis2/d2-i18n'
import classes from '../../App.module.css'
import axios from 'axios';
import progarmData from '../../program';
import { useLocation } from "react-router-dom";
import { apiServices } from '../../services/apiServices'
import Alert from '../../component/alert/Alert'
import { getPageRelaodFlag, AlertComponent, formValues, WorkFlowFlag, setPostResgistrationResponse, setTabHideValues } from "../../redux/actions/action";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withTranslation, Trans, useTranslation } from 'react-i18next';
import ShareIcon from '@material-ui/icons/Share';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import Grid from '@material-ui/core/Grid';

import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'

import ReceiptIcon from '@material-ui/icons/Receipt';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import PostAddIcon from '@material-ui/icons/PostAdd';
import OpacityIcon from '@material-ui/icons/Opacity';
import WcIcon from '@material-ui/icons/Wc';

import FormStrucutre from '../../component/forms/formTabs/FormStructure'

import swal from 'sweetalert'
import _ from 'lodash';
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'
import OfflineDb from '../../db'
import {
  MenuItem,
  Menu,
  // Tab,
  TabBar,
  Card,
  AlertBar,
  Button,
  CircularLoader,
  CenteredContent
} from '@dhis2/ui';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import '../../assets/css/customstyles.css'
import { Configuration } from '../../assets/data/config'
import LinearProgress from '@material-ui/core/LinearProgress';
import { Apps, Settings, Account, Exit, Message, AttachFile, Email, FolderOpen } from '@dhis2/ui-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserPlus, faSearch, faBullhorn, faFileAlt, faUsers, faFileInvoice, faEdit, faWifi, faCog, faSignOutAlt, faFileSignature, faUserFriends, faShareSquare, faPrescriptionBottle, faFlask, faPills, faMale } from '@fortawesome/free-solid-svg-icons'

import FooterMenu from '../../component/layout/FooterMenu'

import Cases from "../../pages/cases/NewThemeCasesNewList"
import HeaderNew from '../../component/layout/HeaderNew';
import MenuIcon from '@material-ui/icons/Menu';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { decryptData, encryptData } from '../../imon/encryption/AesEnc';

function Registration() {
  const location  = useLocation();
  const metaDataParam = Configuration.homepage.metaDataParam
  const relationshipTypeParams = Configuration.homepage.relationshipTypeParam
  const DEGParams = Configuration.homepage.DEGParams
  const OUGroupParams = Configuration.homepage.OUGroupParam
  const programRuleVariableParam = Configuration.homepage.programRuleVariableParam
  const dataSetParams = Configuration.homepage.dataSets
  const OUStructureParams = Configuration.homepage.OUStrutureParams
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null)
  const [progarmData, setProgarmData] = useState(null)
  const [programRules, setProgramRules] = useState(null)
  const [programRulesVariables, setProgramRulesVariables] = useState(null)
  const [relationshipId, setRelationshipId] = useState(null)
  const [dataElementGroup, setDataElementGroup] = useState(null)
  const [geolocation, setGeoLocation] = useState(null)
  const [currentGeolocation, setCurrentGeoLocation] = useState(null)
  const [newVersionAvailable, setNewVersionFlag] = useState(false)
  const [progress, setProgress] = React.useState(0)
  const [reloadData, setReloadDataFlag] = React.useState(false)
  const [clientTypeId, setClientTypeId] = useState(null)
  const [presentlyOnAntiTBMedicationId, setPresentlyOnAntiTBMedicationId] = useState(null)
  const [linkContactFlag, setLinkContactFlag] = useState(null)
  const [stageTabValue,setStageTabValue] = React.useState(null)
  const [stageInstanceID,setStageInstanceID] = React.useState(null)
  const [transferFlag,setTransferFlag] = useState(null)
  const [OUJSON, setOUJSON] = useState(null)
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  const { t } = useTranslation()
  const [ConfigurationFromServer,setConfigurationFromServer] = useState(null);
  const showCases = localStorage.getItem("showCases") ? localStorage.getItem("showCases") : null //location && location.state && location.state.newClient ? location.state.newClient : null
  const showStages = localStorage.getItem("stagesShow") ? localStorage.getItem("stagesShow") : null //location && location.state && location.state.newClient ? location.state.newClient : null
  const [showCasesInRegistration, setShowCasesInRegistration] = useState(true)
  const [stagesInRegistration, setStagesInRegistration] = useState(true)
  let stageDefauleValue = 0;
  const [userrolename,setuserrolename] = React.useState(null)
  const patientRole = "Patient Role"
  const superAdmin = "superuser"
  const [showStagesId ,setShowStagesId] = useState(null);
  const urlLocation = useLocation();
  const [activeCaseDetails, setActiveCaseDetails] = useState(null);
  const [stageDisplayName] = useState(urlLocation && urlLocation.state ? urlLocation.state.stageName : null)
  const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
  }))(LinearProgress);

  async function getMetaData() {
    //setGlobalSpinner(true)
    let metadata = await OfflineDb.getDataFromPouchDB('metaData')
    setProgarmData(metadata.data)

    let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
    setSessionUserBoValue(loginDetails.data)

    let progRule = await OfflineDb.getDataFromPouchDB('programRules')
    setProgramRules(progRule.data)

    let progRuleVariable = await OfflineDb.getDataFromPouchDB('programRulesVariables')
    setProgramRulesVariables(progRuleVariable.data)

    let relationShipId = await OfflineDb.getDataFromPouchDB('relationshipTypeId')
    if(relationShipId.data){
      setRelationshipId(relationShipId.data)
    }else{
      setRelationshipId("")
    }

    let DEG = await OfflineDb.getDataFromPouchDB('dataElementGroup')
    setDataElementGroup(DEG.data)

    let geolocationData = await OfflineDb.getDataFromPouchDB('geolocation')
    setGeoLocation(geolocationData.data)
    //setGlobalSpinner(false)

    let ContactFlag = await OfflineDb.getDataFromPouchDB('linkContactFlag')
    setLinkContactFlag(ContactFlag)

    let TransferFlag = await OfflineDb.getDataFromPouchDB('transferFlag')
    setTransferFlag(TransferFlag)

    let OU = await OfflineDb.getDataFromPouchDB('OUStructureJSON')
    setOUJSON(OU.data)

    let configurations = await OfflineDb.getDataFromPouchDB('configurations')
    setConfigurationFromServer(configurations.data.configuration)

    let CaseDetails = await OfflineDb.getDataFromPouchDB('activeCaseDetails')
    setActiveCaseDetails(CaseDetails)
  }

  useEffect(()=>{
    if(progarmData && transferFlag && ConfigurationFromServer && activeCaseDetails){
        if(transferFlag.data){
          if(transferFlag.data.type == null){
            setStageTabValue(0)
          }else{
            progarmData.programs[0].programStages.map((stage,stageIndex) => {
              if(stage.attributeValues.length > 0){
                stage.attributeValues.map((attributeVal,index) => {
                  
                  if(attributeVal.attribute.displayName == "Transfer In" && attributeVal.value == "true" && transferFlag.data.type == "transferin"){
                      
                      let stepIncrement = ConfigurationFromServer.registrationForm.searchEnabled ? 2 : 1
                      setStageTabValue(stageIndex+stepIncrement)
                      stageDefauleValue = stageIndex+stepIncrement
                      setStageInstanceID(transferFlag.data.stageinstanceuid)
                      
                  }else if(attributeVal.attribute.displayName == "Transfer Out" && attributeVal.value == "true" && transferFlag.data.type == "transferout"){
                      
                      let stepIncrement = ConfigurationFromServer.registrationForm.searchEnabled ? 2 : 1
                      setStageTabValue(stageIndex+stepIncrement)
                      
                      stageDefauleValue = stageIndex+stepIncrement
                      setStageInstanceID(transferFlag.data.stageinstanceuid)
                  }
                })
              }
            })
          }
          //OfflineDb.removeDataFromPouchDB('transferFlag')
        }
        
      if(progarmData && stageDisplayName){
        let stageIds = []
        progarmData.programs[0].programStages.map((stage,stageIndex) => {
          let stageName = stage.description ? stage.description : stage.formName ? stage.formName : stage.displayName
          if (stageName.trim() == stageDisplayName) {
            stageIds.push(stage.id);
          }
        })
        if(stageIds && stageIds.length > 0){
          setShowStagesId(stageIds)
        }
      }

      console.log("activeCaseDetails.data ",activeCaseDetails.data,progarmData,stageDisplayName)
      if(activeCaseDetails && activeCaseDetails.data && activeCaseDetails.data.stageuid){
        let stageIds = []
        progarmData.programs[0].programStages.map((stage,stageIndex) => {
          if(stage.id == activeCaseDetails.data.stageuid){
            let stepIncrement = ConfigurationFromServer.registrationForm.searchEnabled ? 2 : 1
            setStageTabValue(stageIndex+stepIncrement)
            stageIds.push(stage.id);
          }
        })
        setShowStagesId(stageIds)
      }
        
    }
  },[progarmData,transferFlag,ConfigurationFromServer,activeCaseDetails])

  useEffect(() => {
    setGlobalSpinner(true)
    getMetaData()
    if(localStorage.getItem("showCases")){
      localStorage.removeItem("showCases")
    }
    if(localStorage.getItem("stagesShow")){
      localStorage.removeItem("stagesShow")
    }
  }, [])

  useEffect(() => {
    if (progarmData != null && programRules != null && programRulesVariables != null && sessionUserBoValue != null && relationshipId != null && dataElementGroup != null && geolocation != null && OUJSON != null && ConfigurationFromServer != null && currentGeolocation != null) {
      setGlobalSpinner(false)
    }

  }, [progarmData, programRules, programRulesVariables, sessionUserBoValue, relationshipId, dataElementGroup, geolocation,OUJSON,ConfigurationFromServer, currentGeolocation])

  useEffect(() => {
    if (navigator.geolocation && geolocation != null) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCurrentGeoLocation({ "lat": latitude, "lng": longitude })
      }, (error) => {
        setCurrentGeoLocation({ "lat": geolocation.lat, "lng": geolocation.lng })
      }, {timeout:10000});
    } else if(geolocation != null) {
      setCurrentGeoLocation({ "lat": geolocation.lat, "lng": geolocation.lng })
    }else {
      setCurrentGeoLocation({ "lat": -74.013382, "lng": 40.712742 })
      setGeoLocation({ "lat": -74.013382, "lng": 40.712742 })
    }
  }, [geolocation])

  useEffect(() => {
    if (progarmData != null && sessionUserBoValue != null) {
      if (navigator.onLine) {
        checkVersion()
      }
      if (relationshipId != '') {
        setClientTypeAndLinkingQuestionsId();
      }
      try{
        if (sessionUserBoValue != null) {
          /**SET USER ROLE */
          setuserrolename(sessionUserBoValue.userRoles[0].name || sessionUserBoValue.userRoles[0].displayName);
        }
      }catch(e){

      }

    }
  }, [progarmData, sessionUserBoValue])

  useEffect(() => {
    if (newVersionAvailable) {
      downloadNewData()
    }
  }, [newVersionAvailable])

  useEffect(() => {
    if (linkContactFlag != null && progarmData !=null) {
      setDefaultValueForClientType();
    }
  }, [clientTypeId, linkContactFlag,progarmData])

  // this code is for relationship and contact linking questions
  function setDefaultValueForClientType(){
    //linkTrackedEntityInstance
    if(linkContactFlag != null && linkContactFlag.data && linkContactFlag.data.enabled){
      //no need to set default value because user wants to link contact
      
    }else if(linkContactFlag != null && linkContactFlag.data && !linkContactFlag.data.enabled && linkContactFlag.data.linkTrackedEntityInstance){
      
    }
    else{
      const activeCaseFormData = {
        'formFormat': progarmData && progarmData.programs && progarmData.programs[0].code == "UNDP" ? { [clientTypeId]: Configuration.ltbiLinkVariables.presumptivetb } : null,
        'dhisFormat': null
      }
      OfflineDb.setDataIntoPouchDB('activeCaseFormData', activeCaseFormData)
    }

  }
  function setClientTypeAndLinkingQuestionsId() {
    progarmData.trackedEntityAttributes.map(regField => {
      if (regField.displayName == "Client type") {
        setClientTypeId(regField.id)
        //setDefaultValueForClientType()
      }/*else if(regField.displayName == "Presently on anti-TB medication?"){
          setPresentlyOnAntiTBMedicationId(regField.id)
      }*/
    })
  }

  function checkVersion() {
    const versionCheckParam = 'metadata?fields=:owner,displayName&programs:filter=id:eq:' + sessionUserBoValue.programs[0] + '&programs:fields=:owner,unique,playName,attributeValues[:all,attribute[id,name,displayName]]'
    let tempHolder = {
      "type":"GET",
      "url":versionCheckParam,
      "data":null
    }
    const encryptedData = encryptData(tempHolder);
    apiServices.postAPI("commonencryption/getDecrypt",{"data":encryptedData})
    // apiServices.getAPI(versionCheckParam)
      .then(versionCheck => {
        versionCheck.data = decryptData(versionCheck.data)
        if (progarmData != undefined && versionCheck.data != undefined && Array.isArray(versionCheck.data)) {
          if (versionCheck.data.programs[0].version != progarmData.programs[0].version) {
            
            setNewVersionFlag(true)
          }
        }
      })
  }

  function downloadNewData() {
    setReloadDataFlag(true)
    
    //First Call
    apiServices.getAPI('programs.json?fields=[id,displayFormName,publicAccess,organisationUnit[id,path,displayName]]&paging=false&filter=id:in:[' + sessionUserBoValue.programs.toString() + ']')
    .then(programsDetails => {
        const filterProgramWithAccess = programsDetails.data.programs.filter(obj => obj.publicAccess == "rwrw----")
        
        OfflineDb.getDataFromPouchDB("programBoDetails").then((programBoDetails) => {
          let metafinalurl =
            "metadata?fields=:owner,displayName&programs:filter=id:eq:" +
            programBoDetails.data.programuid +
            "&programs:fields=:owner,displayName,description,attributeValues[:all,attribute[id,name,displayName,description,formName]],organisationUnits[id,path,displayName,description,level],dataEntryForm[:owner],programSections[id,name,displayName,formName,description,translations[*],renderType,program,sortOrder,lastUpdated,trackedEntityAttributes[id,name,displayName,formName,description,code,sortOrder,attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id]]],notificationTemplates[:owner],programTrackedEntityAttributes[:owner,renderType,trackedEntityAttribute[id,displayName,formName,description,translations[*],valueType,unique,optionSet[id,options[id,code,displayName,description,translations[*],style]],attributeValues[:all,attribute[id,name,displayName,description]],domainType]],user[id,name],programStages[:owner,user[id,name],userAccesses,userGroupAccesses,displayName,description,attributeValues[:all,attribute[id,name,displayName,description]],programStageDataElements[:owner,renderType,unique,dataElement[id,displayName,description,formName,displayFormName,unique,valueType,fieldMask,translations[*],attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id,options[id,code,displayName,description,translations[*],%20style]],domainType]],notificationTemplates[:owner,displayName,description],dataEntryForm[:owner],programStageSections[:owner,displayName,description,translations[*],dataElements[id,displayName,description]]]&dataElements:fields=id,displayName,formName,description,valueType,translations[*],optionSet&dataElements:filter=domainType:eq:TRACKER&trackedEntityAttributes:fields=id,displayName,formName,description,valueType,optionSet[id,options[id,code,displayName,description,style]],unique";
          
        //Second call
        apiServices.getAPI(metafinalurl)
            .then(metaData => {
                

                metaData.data.programs.map(programs => {
                    const filterOU = programs.organisationUnits.find(array => array.id == sessionUserBoValue['organisationUnits'][0].id)
                    
                    if (filterOU != undefined) {
                        metaData.data.programs = [programs]
                        sessionUserBoValue.programs = [metaData.data.programs[0].id]
                        
                        OfflineDb.setDataIntoPouchDB('loginDetails', sessionUserBoValue)
                        setProgress(10)
                        OfflineDb.setDataIntoPouchDB('metaData', metaData.data)
                        setProgress(20)
                        //need for consent
                        //setProgramData(metaData.data)
                        metaData.data.programs[0].programTrackedEntityAttributes.map(TEAField=>{
                            if(TEAField.trackedEntityAttribute.unique && TEAField.trackedEntityAttribute.displayName.toLocaleLowerCase() == 'uic'){
                                //setUICFieldId(TEAField.trackedEntityAttribute.id)
                                let generateOfflineUICUrl = `33/trackedEntityAttributes/${TEAField.trackedEntityAttribute.id}/generateAndReserve?numberToReserve=50`
                                apiServices.getAPI(generateOfflineUICUrl)
                                .then(response => {
                                    
                                    OfflineDb.setDataIntoPouchDB('offlineUICList', response.data)
                                })
                            }
                        })
                    } else {
                      OfflineDb.setDataIntoPouchDB('metaData', metaData.data)
                      setProgress(20)
                  }

                    
                })

                //Third call
                apiServices.getAPI(relationshipTypeParams)
                .then(response => {
                    const relationshipTypes = response.data.relationshipTypes
                    if (relationshipTypes.length > 0) {
                        relationshipTypes.map(relationshipType => {

                            if (relationshipType.fromConstraint.program.id == sessionUserBoValue.programs[0]) {
                                OfflineDb.setDataIntoPouchDB('relationshipTypeId', relationshipType.id)
                                setProgress(30)
                            } /*else {
                                OfflineDb.setDataIntoPouchDB('relationshipTypeId', "")
                                setProgress(30)
                            }*/
                        })
                    } /*else {
                        OfflineDb.setDataIntoPouchDB('relationshipTypeId', "")
                        setProgress(30)
                    }*/

                    //Fourth Call
                    apiServices.getAPI(DEGParams)
                        .then(dataElementGroup => {
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
                            apiServices.getAPI(OUGroupParams)
                                .then(OUGroups => {
                                    OfflineDb.setDataIntoPouchDB('organisationUnitGroups', OUGroups.data)
                                    setProgress(50)
                                    const programRuleParam = 'programRules?filter=program.id:eq:' + sessionUserBoValue.programs[0] + '&filter=name:ne:default&fields=id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],option[id],optionGroup[id],programIndicator[id],programStage[id]]&paging=false'

                                    apiServices.getAPI(programRuleParam)
                                        .then(programRule => {
                                            OfflineDb.setDataIntoPouchDB('programRules', programRule.data)
                                            setProgress(60)
                                            

                                            apiServices.getAPI(programRuleVariableParam+'&filter=program.id:eq:'+sessionUserBoValue.programs[0])
                                                .then(programRuleVariable => {
                                                    OfflineDb.setDataIntoPouchDB('programRulesVariables', programRuleVariable.data)
                                                    setProgress(70)
                                                    apiServices.getAPI(dataSetParams)
                                                    .then(dataSet => {
                                                        OfflineDb.setDataIntoPouchDB('dataEntrySet', dataSet.data)
                                                        setProgress(80)

                                                        // axios.get('https://cdn.jsdelivr.net/gh/duretech/shared@master/OUStructureZimbabwe.json', function (req, res) {
                                                        //     res.header("Access-Control-Allow-Origin", "*");
                                                        // }) 
                                                        let ouAPI = OUStructureParams
                                                        if(programBoDetails && programBoDetails.data && programBoDetails.data.orguid){
                                                          ouAPI = 'organisationUnits/' + programBoDetails.data.orguid + '?includeDescendants=true&paging=false&fields=id,level,name,displayFormName,children,comment'
                                                        }   
                                                        apiServices
                                                        .getAPI(ouAPI)                                                                      
                                                        .then(OUStructureParams => {
                                                            
                                                            OfflineDb.setDataIntoPouchDB('OUStructureJSON', OUStructureParams.data)
                                                            setProgress(100)
                                                            setReloadDataFlag(false)
                                                        })

                                                        
                                                    })

                                                })
                                        })
                                })

                        })

                })
            })
      })
    })
  }

  const myClinetPanelClick = () => {
    if(showCasesInRegistration && showCasesInRegistration != 'panelclosed'){
      setShowCasesInRegistration("panelclosed")
    }else{
      setShowCasesInRegistration("panelopend")
    }
  }

  return (
    <div className={classes.container}>
      {userrolename && userrolename == patientRole ? <div><HeaderNew></HeaderNew> <FooterMenu></FooterMenu></div> : <FooterMenu></FooterMenu>}
      <main style={{ display: 'flex', height: '100%', width: '100%' }}>
        <section className="mainsection pb-0 customregistrationtabs regcasetabs formMainStructure "
          style={{
            flexGrow: 1,
            padding: 0,
          }}>
          
          {/* {reloadData && progress != 100 ? */}
           { reloadData && progress != 100 ? 
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <p className="homepageappdesc">Syncing data</p>
                <BorderLinearProgress variant="determinate" value={progress} />
                <p className="homepageappdesc"> {progress} % completed </p>
              </Grid>
            </Grid>
            : sessionUserBoValue != null && progarmData != null && programRules!= null && programRulesVariables!=null && relationshipId != null && dataElementGroup != null && geolocation != null && currentGeolocation!= null && OUJSON != null && ConfigurationFromServer != null?
            <>
            <Grid container spacing={0} className="mt-0px">
              {/* <Button className={showCasesInRegistration ? showCasesInRegistration != 'panelclosed' ? "myclientpanelopen" : 'myclientpanelclose' : 'hide'} onClick={()=>myClinetPanelClick()}>
              {showCasesInRegistration ? showCasesInRegistration != 'panelclosed' ?  <NavigateBeforeIcon/> : <NavigateNextIcon/> : <NavigateBeforeIcon/>}
              </Button>
              {showCasesInRegistration && showCasesInRegistration != 'panelclosed' ? 
              <Grid item xs={3}>
                <div className='listholder'>
                  <Cases />
                </div>
              </Grid>
              :
              <></>
              } */}
             
              <Grid item xs={12}>
              <FormStrucutre 
                userData = {sessionUserBoValue}
                programData = {progarmData}
                programRules = {programRules}
                programRulesVariables = {programRulesVariables}
                dedupEnabled={ConfigurationFromServer.registrationForm.deDupEnabled}
                searchEnabled = {userrolename && userrolename.toLowerCase() == superAdmin ? false : ConfigurationFromServer.registrationForm.searchEnabled}
                relationShipId={relationshipId}
                dataElementGroup={dataElementGroup}
                geolocation={geolocation}
                currentGeolocation={currentGeolocation}
                stageTabValue = {stageTabValue ? stageTabValue : 0}
                stageInstanceID = {stageInstanceID}
                showStagesId = {showStagesId}
                OUJSON = {OUJSON}
                //showCasesInRegistration={showCasesInRegistration}
                showCasesInRegistration={window.cordova || stagesInRegistration ? stagesInRegistration : showCasesInRegistration}
              />
              </Grid>
             
            </Grid>
            </>
              :
              <> </>
          }
        </section>
      </main>
    </div>


  )

}

export default Registration