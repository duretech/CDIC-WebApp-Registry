import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import imgUrl from "../../assets/images/imageUrl";
//Desktop screen css
//import '../../assets/css/customdesktop.css';
import {
  Button,
  InputFieldFF,
  ReactFinalForm,
  hasValue,
  CircularLoader,
  CenteredContent
} from '@dhis2/ui';
import { gaLogEvent, gaLogScreen } from "../../imon/helpers/analytics";
import Feedback from '../../imon/components/Feedback';
import OfflineDb from '../../db'
import { useSelector } from 'react-redux';
import _ from 'lodash';
import FormStructure from '../../component/forms/formTabs/FormStructure';
import { apiServices } from '../../services/apiServices';
import { Configuration } from '../../assets/data/config'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import { useLocation } from "react-router-dom";


function RenderStage() {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  var [pname,setpname] = useState('')
  var [pbirth,setpbirth] = useState('-')
  var [pgender,setpgender] =  useState('-')
  const DEGParams = Configuration.homepage.DEGParams
  const programRuleVariableParam = Configuration.homepage.programRuleVariableParam
  const setGlobalSpinner = useGlobalSpinnerActionsContext()

  var [meta,setmeta]= useState(null)
  var [user,setuser] = useState(null)
  var [progrule,setprogrule]= useState(null)
  var [dataele,setdataele]= useState(null)
  var [progvar,setprogvar]= useState(null)
  const [showStagesId ,setShowStagesId] = useState(null);
  const urlLocation = useLocation();
  const [stageDisplayName] = useState(urlLocation.state.stageName);

  useEffect(()=>{
    gaLogEvent("My stage", '', '');
    gaLogScreen("My stage");
    setGlobalSpinner(true)
    // OfflineDb.getDataFromPouchDB('loggedinuser').then(res=>{
    //   console.log(res)
    //   setpname(res.data.name)
    // })
    // OfflineDb.getDataFromPouchDB('userdetails').then(res=>{
    //   console.log(res)

    //   res.data.map((attr)=>{
    //     if(attr.displayName.toLowerCase().includes('gender')){
    //       setpgender(attr.value)
    //     }
    //     if(attr.displayName.toLowerCase().includes('birth')){
    //       setpbirth(attr.value)
    //     }
    //   })
    // })
    OfflineDb.getDataFromPouchDB('metaData').then(completeMetadata=>{
      let allProgarm = completeMetadata.data
      let stageIds = []
      let metaData = null
      allProgarm.programs.map((progarmData) => {
        progarmData.programStages.map((stage,stageIndex) => {
        let stageName = stage.description ? stage.description : stage.formName ? stage.formName : stage.displayName
        if (stageName.trim() == stageDisplayName) {
          stageIds.push(stage.id);
          metaData = {
            "data" : {
              "programs" : [progarmData]
            }
          }
          setmeta(metaData.data)
        }
      })
      if(stageIds && stageIds.length > 0){
        setShowStagesId(stageIds)
        // apiServices.getAPI(DEGParams)
        // .then(dataElementGroup => {
        OfflineDb.getDataFromPouchDB('dataElementGroup').then(dataElementGroup=>{
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
            setdataele(dataElementGroup.data)
            OfflineDb.setDataIntoPouchDB(
              "dataElementGroup", dataElementGroup.data
            );
        })
        }
    })

    })
    // OfflineDb.getDataFromPouchDB('metaData').then(metaData=>{
    //   setmeta(metaData.data)
    //   // let progarmData = metaData.data
    //   // let stageIds = []
    //   // progarmData.programs[0].programStages.map((stage,stageIndex) => {
    //   //   let stageName = stage.description ? stage.description : stage.formName ? stage.formName : stage.displayName
    //   //   if (stageName.trim() == stageDisplayName) {
    //   //     stageIds.push(stage.id);
    //   //   }
    //   // })
    //   // if(stageIds && stageIds.length > 0){
    //   //   setShowStagesId(stageIds)
    //   // }
    //   apiServices.getAPI(DEGParams)
    //   .then(dataElementGroup => {
    //       //sort dataElementGroup                    
    //       dataElementGroup.data.dataElementGroups.map(dataElementGroups => {
    //         metaData.data.programs[0].programStages.map(programStages => {
    //           let findDataElementInStage = programStages.programStageDataElements.find(x => x.dataElement.displayName == dataElementGroups.displayName)
    //           if(findDataElementInStage) {
    //             dataElementGroups.dataElements.map(dataElements => {
    //               let findDataElementOptionsInStage = programStages.programStageDataElements.find(x => x.dataElement.id == dataElements.id)
    //               if(findDataElementOptionsInStage) {
    //                 dataElements['sortOrder'] = findDataElementOptionsInStage.sortOrder
    //               }
    //             })
    //           }
              
    //         })
    //         dataElementGroups.dataElements = _.orderBy(dataElementGroups.dataElements, ['sortOrder'], ['asc'])
    //       })
    //       setdataele(dataElementGroup.data)
    //       OfflineDb.setDataIntoPouchDB(
    //         "dataElementGroup", dataElementGroup.data
    //       );
    //   })
    // })
    OfflineDb.getDataFromPouchDB('loginDetails').then(res=>{
      setuser(res.data)
      console.log("user",res.data)
      // const programRuleParam = 'programRules?filter=program.id:eq:' + res.data.programs[0] + '&filter=name:ne:default&fields=id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],option[id],optionGroup[id],programIndicator[id],programStage[id]]&paging=false'

      //                                                       apiServices.getAPI(programRuleParam)
      //                                                           .then(programRule => {
        OfflineDb.getDataFromPouchDB('programRules').then(programRule=>{
            setGlobalSpinner(false)
            OfflineDb.setDataIntoPouchDB('programRules', programRule.data)
            setprogrule(programRule.data)
        })
    })
    
    // apiServices.getAPI(programRuleVariableParam)
    //     .then(programRuleVariable => {
    OfflineDb.getDataFromPouchDB('programRulesVariables').then(programRuleVariable=>{
            OfflineDb.setDataIntoPouchDB('programRulesVariables', programRuleVariable.data)
            setprogvar(programRuleVariable.data)
        })
  },[])

  const handleCovidCertifyClick = () => {
    try {
      console.log("here");
      const link = document.getElementById('covidcertificate');
      if (link) {
        link.setAttribute(
          'download',
          `FileName.pdf`,
        );
        link.setAttribute(
          "target",
          "_blank"
        );
        link.setAttribute(
          "href",
          "https://uatdpcbnew.imonitorplus.com/MicrosoftTeams-image-converted.pdf"
        );
        console.log(link)
        if (window.cordova) {
          console.log("hello")
          window.open(link.href, '_system')
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleTbCertifyClick = () => {
    try {
      console.log("here");
      const link = document.getElementById('tbcertificate');
      if (link) {
        link.setAttribute(
          'download',
          `FileName.pdf`,
        );
        link.setAttribute(
          "target",
          "_blank"
        );
        link.setAttribute(
          "href",
          "https://uatdpcbnew.imonitorplus.com/MicrosoftTeams-image.pdf"
        );
        console.log(link)
        if (window.cordova) {
          console.log("hello")
          window.open(link.href, '_system')
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  function handleBack() {
    window.history.back();
  }


  return (
    <div className={window.cordova ? "certi-patientpage" : 'certi-patientpage windowdesktop'}>
      <Grid container className='certi-patientpagediv'>
        <Grid container xs={12} className='certinav'>

          <Grid xs={3} className='backimg'><img src={imgUrl.whiteback} onClick={() => handleBack()} className='backsvg' /></Grid>
          <Grid xs={6}>
            <Typography variant='subtitle1' className='regname oneuhcfont'>My History</Typography>
          </Grid>
          <Grid xs={3}>
          <Typography variant='body2' className='stepname parafont'><Feedback></Feedback></Typography>
          </Grid>

        </Grid>
        
        <Grid className='stage-block'>
         {
          user!=null && meta!=null && progrule!=null && dataele!=null && progvar!=null && showStagesId != null?(<FormStructure
            userData={user}
            programData={meta}
            programRules={progrule}
            programRulesVariables={progvar}
            dedupEnabled={''}
            searchEnabled={''}
            relationShipId={''}
            dataElementGroup={dataele}
            geolocation={''}
            currentGeolocation={''}
            stageTabValue={0}
            stageInstanceID={''}
            showStagesId = {showStagesId}
            OUJSON={''}
          />):('')
        } 
        </Grid>
        <Grid item xs={12} className='tbtreatcontent'>
          
        </Grid>
        <Grid container xs={12} className="fixed-nav homebottomnav">
                    {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="home-svg"  onClick={()=>(!window.location.pathname.includes('imonhome')?history.push('/layout/imonhome'):'')}>
                        <img src={imgUrl.homesvg} />
                        <Typography variant="caption" display="block">
                          Home
                        </Typography>
                      </Grid>:<Grid xs={4} className="home-svg" onClick={()=>(!window.location.pathname.includes('imonhome')?history.push('/layout/imonhome'):'')}>
                        <img src={imgUrl.homesvg} />
                        <Typography variant="caption" display="block">
                          Home
                        </Typography>
                      </Grid>}
                      {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="journey-svg" onClick={()=>(!window.location.pathname.includes('adherence')?history.push('/layout/adherence'):'')}>
                        <img src={imgUrl.journeysvg} />
                        <Typography variant="caption" display="block">
                          My Journey
                        </Typography>
                      </Grid>:''}
                      {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?history.push('/layout/nearme'):'')}>
                        <img src={imgUrl.nearsvg} />
                        <Typography variant="caption" display="block">
                          Near Me
                        </Typography>
                      </Grid>:<Grid xs={4} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?history.push('/layout/nearme'):'')}>
                        <img src={imgUrl.nearsvg} />
                        <Typography variant="caption" display="block">
                          Near Me
                        </Typography>
                      </Grid>}
                      {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?history.push('/layout/getknowledgeable'):'')}>
                        <img src={imgUrl.guidesvg} />
                        <Typography variant="caption" display="block">
                          Guide
                        </Typography>
                      </Grid>:<Grid xs={4} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?history.push('/layout/getknowledgeable'):'')}>
                        <img src={imgUrl.guidesvg} />
                        <Typography variant="caption" display="block">
                          Guide
                        </Typography>
                      </Grid>}
                      {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="connect-svg" onClick={()=>(!window.location.pathname.includes('peerchat')?history.push('/layout/peerchat'):'')}>
                        <img src={imgUrl.connectsvg} />
                        <Typography variant="caption" display="block">
                          Connect
                        </Typography>
                      </Grid>:''}
                      {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="screen-svg" onClick={()=>(!window.location.pathname.includes('aisurvey')?history.push('/layout/AiSurvey'):'')}>
                        <img src={imgUrl.screensvg} />
                        <Typography variant="caption" display="block">
                          Survey
                        </Typography>
                      </Grid>:""}
                    </Grid>
      </Grid>

    </div>

  );
}

export default RenderStage