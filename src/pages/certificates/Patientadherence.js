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
import _ from 'lodash';
import FormStructure from '../../component/forms/formTabs/FormStructure';
import { apiServices } from '../../services/apiServices';
import { Configuration } from '../../assets/data/config'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'

function Patientadherence() {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const DEGParams = Configuration.homepage.DEGParams
  const programRuleVariableParam = Configuration.homepage.programRuleVariableParam
  const setGlobalSpinner = useGlobalSpinnerActionsContext()

  var [meta,setmeta]= useState(null)
  var [user,setuser] = useState(null)
  var [progrule,setprogrule]= useState(null)
  var [dataele,setdataele]= useState(null)
  var [progvar,setprogvar]= useState(null)
  useEffect(()=>{
    gaLogEvent("Patient adherence", '', '');
    gaLogScreen("Patient adherence");
    setGlobalSpinner(true)
    OfflineDb.getDataFromPouchDB('metaData').then(metaData=>{
      setmeta(metaData.data)
      //apiServices.getAPI(DEGParams)
      //.then(dataElementGroup => {
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
          // OfflineDb.setDataIntoPouchDB(
          //   "dataElementGroup", dataElementGroup.data
          // );
      })
    })
    OfflineDb.getDataFromPouchDB('loginDetails').then(res=>{
      setuser(res.data)
      console.log("user",res.data)
      const programRuleParam = 'programRules?filter=program.id:eq:' + res.data.programs[0] + '&filter=name:ne:default&fields=id,displayName,condition,description,program[id],programStage[id],priority,programRuleActions[id,content,location,data,programRuleActionType,programStageSection[id],dataElement[id],trackedEntityAttribute[id],option[id],optionGroup[id],programIndicator[id],programStage[id]]&paging=false'

      // apiServices.getAPI(programRuleParam)
      //     .then(programRule => {
      OfflineDb.getDataFromPouchDB('programRules').then(programRule=>{
          setuser(res.data)
          setGlobalSpinner(false)
          //OfflineDb.setDataIntoPouchDB('programRules', programRule.data)
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

  useEffect(()=>{
    console.log(meta,user)
  },[meta,user])
  
  function openHistory(){
    history.push('/historypatient')
  }

  function openCerti(){
    history.push('/patientcertificate')
  }

  function handleBack() {
    window.history.back();
  }

  return (
    <div className={window.cordova ? "certi-patientpage" : 'certi-patientpage windowdesktop'}>
      <Grid container className='certi-patientpagediv'>
        <Grid container xs={12} className='certinav'>

        <Grid xs={3} className='backimg'><img src={imgUrl.whiteback} onClick={() => handleBack()} className='backsvg' /></Grid>
        <Grid xs={6}>
        <Typography variant='subtitle1' className='regname oneuhcfont'>Treatment Adherence</Typography>
        </Grid>
        <Grid xs={3}>
        <Typography variant='body2' className='stepname parafont'><Feedback></Feedback></Typography>
        </Grid>

        </Grid>
        <Grid className='adherencediv'>
         {
          user!=null && meta!=null && progrule!=null && dataele!=null && progvar!=null?(<FormStructure
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
            OUJSON={''}
          />):('')
        } 
        </Grid>
        <Grid item xs={12} className='tbtreatcontent'>
          
        </Grid>
        {/* <Grid container xs={12} >
          <Grid xs={6} className="text-center" onClick={()=>openHistory()}>
            <div>
              <img src={imgUrl.history}/>
            </div>
          </Grid>
          <Grid xs={6} className="text-center" onClick={()=>openCerti()}>
            <div>
              <img src={imgUrl.journeycerti}/>
            </div>
          </Grid>
        </Grid> */}
        
        
        

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
                      {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="journey-svg" onClick={()=>(!window.location.pathname.includes('myjourney')?history.push('/myjourney'):'')}>
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

export default Patientadherence