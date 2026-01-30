import React, { Component, useState, useEffect } from 'react'
import { withTranslation, Trans, useTranslation } from 'react-i18next';
import classes from '../../App.module.css'
import axios from 'axios';
import _ from 'lodash';

import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'

// import "../../assets/css/customstyles.css";
// import "../../assets/css/theme_grey.css";
// import "../../assets/css/theme_blue.css";
// import "../../assets/css/theme_green.css";
// import "../../assets/css/theme_red.css";

import { Link, Redirect, useHistory } from "react-router-dom";
// import { Link, useHistory } from "react-router-dom";
import { MenuItem, Menu, Tab, TabBar, Button } from "@dhis2/ui";

import { Apps, Settings, Account, Exit, Message, AttachFile, Email, FolderOpen } from '@dhis2/ui-icons'
import OfflineDb from '../../db'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faHome, faUserPlus, faSearch, faBullhorn, faFileAlt, faUsers, faFileInvoice, faEdit, faWifi, faCog, faSignOutAlt, faFileSignature, faUserFriends, faShareSquare, faPrescriptionBottle, faFlask, faPills, faMale, faRobot, faVideo, faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons'

import Grid from '@material-ui/core/Grid';
//import { Configuration } from '../../assets/data/config'
import { apiServices } from '../../services/apiServices';
import Customcircularprogress from './Customcircularprogress.js';
import Customcircularprogress1 from './Customcircularprogress1.js';
import Customcircularprogress2 from './Customcircularprogress2.js';
import { setSidebarToggel, getPageRelaodFlag } from '../../redux/actions/action';
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Disclaimer from '../../component/disclaimer/Disclaimer'
//import swal from 'sweetalert';
import swal from '@sweetalert/with-react'
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

function NewHomePage() {
    const [Configuration,setConfiguration] = useState(null);
    const metaDataParam = Configuration.homepage.metaDataParam
    const relationshipTypeParams = Configuration.homepage.relationshipTypeParam
    const DEGParams = Configuration.homepage.DEGParams
    const OUGroupParams = Configuration.homepage.OUGroupParam
    const programRuleVariableParam = Configuration.homepage.programRuleVariableParam
    const dataSetParams = Configuration.homepage.dataSets
    const OUStructureParams = Configuration.homepage.OUStrutureParams
    const [reloadData, setReloadDataFlag] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [userConsent,setUserConsent] = React.useState(null)
    const [userConsentAttributeIndex,setUserConsentAttributeIndex] = React.useState(null)
    const [programData,setProgramData] = React.useState(null)
    const {t,i18n} = useTranslation()
    const progressIncrement = progress + 10
    
    async function getUserBo(){
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)
        
        let configurations = await OfflineDb.getDataFromPouchDB('configurations')
        setConfiguration(configurations.data.configuration)
    }
    useEffect(()=>{
        getUserBo()
        i18n.changeLanguage(localStorage.getItem('locale'));
    },[])
    useEffect(() => {
        if(progress == 100) {
            setReloadDataFlag(false)
        }
    }, [progress])
    useEffect(()=>{
        if(sessionUserBoValue != null){
            checkUserConsent()
        }
    },[sessionUserBoValue])
    
    useEffect(() => {
        OfflineDb.removeDataFromPouchDB('activeCaseDetails')
        OfflineDb.removeDataFromPouchDB('activeCaseFormData')
        OfflineDb.removeDataFromPouchDB('linkContactFlag')
        //OfflineDb.removeDataFromPouchDB('transferFlag')
        OfflineDb.setDataIntoPouchDB('transferFlag', {type:null})
        
        OfflineDb.setDataIntoPouchDB('transferFlag', {type:null})
        if (reloadData == true) {
            OfflineDb.getDataFromPouchDB('loginDetails')
                .then(loginDetails => {
                    if (loginDetails.data != undefined) {
                        //First Call
                        apiServices.getAPI('programs.json?fields=[id,displayFormName,publicAccess,organisationUnit[id,path,displayName]]&paging=false&filter=id:in:[' + loginDetails.data.programs.toString() + ']')
                            .then(programsDetails => {
                                const filterProgramWithAccess = programsDetails.data.programs.filter(obj => obj.publicAccess == "rwrw----")
                                

                                //Second call
                                apiServices.getAPI(metaDataParam)
                                    .then(metaData => {

                                        metaData.data.programs.map(programs => {
                                            const filterOU = programs.organisationUnits.find(array => array.id == loginDetails.data['organisationUnits'][0].id)
                                            
                                            if (filterOU != undefined) {
                                                metaData.data.programs = [programs]
                                                loginDetails.data.programs = [metaData.data.programs[0].id]
                                                
                                                OfflineDb.setDataIntoPouchDB('loginDetails', loginDetails.data)
                                                setProgress(10)
                                                OfflineDb.setDataIntoPouchDB('metaData', metaData.data)
                                                setProgress(20)
                                                //need for consent
                                                //setProgramData(metaData.data)
                                                metaData.data.programs[0].programTrackedEntityAttributes.map(TEAField=>{
                                                    if(TEAField.trackedEntityAttribute.unique && TEAField.trackedEntityAttribute.displayName.toLocaleLowerCase() == 'uic'){
                                                        //setUICFieldId(TEAField.trackedEntityAttribute.id)
                                                        let generateOfflineUICUrl = `33/trackedEntityAttributes/${TEAField.trackedEntityAttribute.id}/generateAndReserve?numberToReserve=100`
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

                                                    if (relationshipType.fromConstraint.program.id == loginDetails.data.programs[0]) {
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
                                                            const programRuleParam = 'programRules?filter=program.id:eq:' + loginDetails.data.programs[0] + '&filter=name:ne:default&fields=id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],option[id],optionGroup[id],programIndicator[id],programStage[id]]&paging=false'

                                                            apiServices.getAPI(programRuleParam)
                                                                .then(programRule => {
                                                                    OfflineDb.setDataIntoPouchDB('programRules', programRule.data)
                                                                    setProgress(60)
                                                                    

                                                                    apiServices.getAPI(programRuleVariableParam)
                                                                        .then(programRuleVariable => {
                                                                            OfflineDb.setDataIntoPouchDB('programRulesVariables', programRuleVariable.data)
                                                                            setProgress(70)
                                                                            apiServices.getAPI(dataSetParams)
                                                                            .then(dataSet => {
                                                                                OfflineDb.setDataIntoPouchDB('dataEntrySet', dataSet.data)
                                                                                setProgress(80)

                                                                                axios.get('https://cdn.jsdelivr.net/gh/duretech/shared@master/OUStructureZimbabwe.json', function (req, res) {
                                                                                    res.header("Access-Control-Allow-Origin", "*");
                                                                                })                                                                          
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

                    }
                })
        } else {              

            if (reloadData == false) {
                OfflineDb.getDataFromPouchDB('dataElementGroup')
                    .then(dataElementGroup => {
                        if (dataElementGroup.data == undefined) {
                            if(!reloadData) {
                                setReloadDataFlag(true)
                            }
                        }

                        if (reloadData == false) {
                            OfflineDb.getDataFromPouchDB('metaData')
                                .then(metaData => {
                                    
                                    if (metaData.data == undefined) {
                                        if(!reloadData) {
                                            setReloadDataFlag(true)
                                        }    
                                        
                                    }
                                    //need for consent
                                    setProgramData(metaData.data)

                                    OfflineDb.getDataFromPouchDB('loginDetails')
                                        .then(loginDetails => {
                                            if (loginDetails.data != undefined) {
                                                const versionCheckParam = 'metadata?fields=:owner,displayName&programs:filter=id:eq:' + loginDetails.data.programs[0] + '&programs:fields=:owner,unique,playName,attributeValues[:all,attribute[id,name,displayName]]'
                                                apiServices.getAPI(versionCheckParam)
                                                    .then(versionCheck => {
                                                        
                                                        if (metaData.data != undefined && versionCheck.data != undefined && Array.isArray(versionCheck.data)) {
                                                            if (versionCheck.data.programs[0].version != metaData.data.programs[0].version) {
                                                                if(!reloadData) {
                                                                    setReloadDataFlag(true)
                                                                }    
                                                            }

                                                        }
                                                    })
                                            }
                                        })

                                    if (reloadData == false) {
                                        OfflineDb.getDataFromPouchDB('organisationUnitGroups')
                                            .then(organisationUnitGroups => {
                                                if (organisationUnitGroups.data == undefined) {
                                                    if(!reloadData) {
                                                        setReloadDataFlag(true)
                                                    }    
                                                }

                                                if (reloadData == false) {
                                                    OfflineDb.getDataFromPouchDB('programRules')
                                                        .then(programRules => {
                                                            if (programRules.data == undefined) {
                                                                if(!reloadData) {
                                                                    setReloadDataFlag(true)
                                                                }    
                                                            }

                                                            if (reloadData == false) {
                                                                OfflineDb.getDataFromPouchDB('dataEntrySet')
                                                                    .then(dataEntrySet => {
                                                                        if (dataEntrySet.data == undefined) {
                                                                            if(!reloadData) {
                                                                                setReloadDataFlag(true)
                                                                            }    
                                                                        }
                                                                    })
                                                            }
                                                            
                                                        })
                                                }
                                                
                                            })
                                    }

                                })
                        }
                        
                    })
            }

        }

    }, [reloadData])


    function checkUserConsent(){
        if(sessionUserBoValue != null && sessionUserBoValue.attributeValues && sessionUserBoValue.attributeValues.length > 0){
            sessionUserBoValue.attributeValues.map((val,indx)=>{
                if(val.attribute.displayName === "IsConsent" && val.value == "true"){
                    setUserConsent(true)
                    setUserConsentAttributeIndex(indx)
                    //alert("consent submitted")
                }else{
                    setUserConsent(false)
                    setUserConsentAttributeIndex(indx)
                }
            })
        }
    }
    function setConset(){
        setUserConsent(true)
    }

    return (
        <div className={classes.container}>
            <main style={{ display: 'flex', height: '100%', width: '100%' }}>
                <section className="homepagebgsection"
                    style={{
                        backgroundColor: '#fff',
                        flexGrow: 1,
                        padding: 20,
                    }}
                >

                    <Grid container spacing={3} className="mt-80px">
                        <Grid item xs={12}>
                            {/* <p className="homepageappname">{programName}</p> */}
                            <p className="homepageappdesc" style={{ display: 'none' }}>A Community Engagement Platform Designed Monitor Barriers To Access Facilities,Communities And Civil Organisations.</p>
                        </Grid>
                    </Grid>
                    
                    { 
                       Configuration && reloadData && progress != 100 ?
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    {/* <Grid container spacing={3}> */}

                                    <p className="homepageappdesc">{t('Syncing data')}</p>
                                    <BorderLinearProgress variant="determinate" value={progress} />
                                    <p className="homepageappdesc"> {progress} % {t("completed")} </p>
                                    {/* </Grid> */}
                                </Grid>
                            </Grid> 
                            :
                            (!userConsent && userConsent!=null && sessionUserBoValue != null && sessionUserBoValue.attributeValues)?
                                <Grid item xs={12} sm={12} md={12} className="">
                                    <div className="choose_alertdiv">
                                        <Disclaimer 
                                            disclaimerContents={(programData != null)? programData.programs[0].description: "N/A"}
                                            sessionUserBoValue={sessionUserBoValue}
                                            userConsentAttributeIndex={userConsentAttributeIndex}
                                            userConsent={setConset}
                                        />
                                    </div>
                                </Grid>
                                
                                :
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Grid container spacing={3} className="progresscontainer homemenuholder">
                                            {
                                                Configuration.homepage.menuItems.map((menuItems, index) => {
                                                    return (
                                                        <Grid key={index} item xs={12} sm={6} md={4} className={menuItems.showMenu ? "" : 'hide'}>

                                                            <Link className={reloadData ? 'anchorLink disbaledLink' : 'anchorLink '} to={menuItems.path}>
                                                                <div className="homemenudivcontainer">
                                                                    <Grid container spacing={3} className="">
                                                                        <Grid item xs={3} sm={3} md={3} lg={4}>
                                                                            <p className="homemenulinkicon"><FontAwesomeIcon icon={menuItems.icon} /></p>
                                                                        </Grid>
                                                                        <Grid item xs={9} sm={9} md={9} lg={8} className="vert-center">
                                                                            <p className="homemenuname">{t(menuItems.name)}</p>
                                                                        </Grid>
                                                                    </Grid>
                                                                </div>
                                                            </Link>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                    }

                </section>
            </main>
        </div>
    )
}

export default NewHomePage
