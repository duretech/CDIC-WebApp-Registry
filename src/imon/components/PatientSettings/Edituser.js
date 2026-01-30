import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
// import classes from '../../App.module.css' 
import Grid from '@material-ui/core/Grid';
import '../../assets/css/custom.css'
import Typography from '@material-ui/core/Typography';
import imgUrl from '../../assets/images/imageUrl.js';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {
    Button,
} from '@dhis2/ui';
import serialize from "form-serialize";
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import swal from "sweetalert";
import { apiServices } from '../../../services/apiServices';
import OfflineDb from '../../../db'
import Loader from "../loaders/loader";
import EditQues from './EditQues';
import Feedback from '../Feedback';
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
import moment from 'moment'
import { render } from '@testing-library/react';
import { Configuration } from "../../../assets/data/config";
import _ from 'lodash';

var renderq=[]
function Edituser(){
    const runtime = window.RUNTIME_CONFIG || {};
    const location = useLocation();
    const history = useHistory();
    const { t } = useTranslation()
    var [loading,setLoading]= useState(true)
    var [renderques,setRenderques]= useState([])
    var [trackId,setTrackId]= useState('')
    var [userage,setuserage] = useState('')
    // var [renderq,setrenderq] = useState([])
    const [registrationProgramId, setregistrationProgramId] = useState()
    const [tbProgramId, settbProgramId] = useState('C06Q5dI7C7_2')
    const metaDataParam = Configuration.homepage.metaDataParam
    
    useEffect(()=>{
        getMetaData()
        gaLogEvent("Edit profile page", '', '');
        gaLogScreen("Edit profile page");
    },[])

    function getMetaData() {
        
        const Authorization = runtime.basicAuth
        apiServices.loginApi(Authorization).then(res => {
  
          OfflineDb.getDataFromPouchDB('completeMetadata').then(metaData=>{
            let registerProgram = _.cloneDeep(_.filter(metaData.data.programs, { "code": Configuration.registrationProgramCode }))
            let defaultRegisterProgramId = registerProgram && registerProgram.length > 0 ? registerProgram[0].id : registrationProgramId
            setregistrationProgramId(defaultRegisterProgramId)
          // var param = "metadata?programs:filter=id:eq:"+defaultRegisterProgramId+"&fields=:owner,displayName,description&programs:fields=:owner,displayName,description,attributeValues[:all,attribute[id,name,displayName,description]],organisationUnits[id,path,displayName,description,level],dataEntryForm[:owner],programSections[id,name,displayName,description,translations[*],renderType,program,sortOrder,lastUpdated,trackedEntityAttributes[id,name,displayName,description,code,sortOrder,attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id]]],notificationTemplates[:owner],programTrackedEntityAttributes[:owner,renderType,trackedEntityAttribute[id,displayName,description,translations[*],valueType,unique,optionSet[id,options[id,code,displayName,description,translations[*],style]],attributeValues[:all,attribute[id,name,displayName,description]],domainType]],user[id,name],programStages[:owner,user[id,name],userAccesses,displayName,description,attributeValues[:all,attribute[id,name,displayName,description]],programStageDataElements[:owner,renderType,unique,dataElement[id,displayName,description,formName,displayFormName,unique,valueType,fieldMask,translations[*],attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id,options[id,code,displayName,description,translations[*],%20style]],domainType]],notificationTemplates[:owner,displayName,description],dataEntryForm[:owner],programStageSections[:owner,displayName,description,translations[*],dataElements[id,displayName,description]]]&dataElements:fields=id,displayName,description,valueType,translations[*],optionSet&dataElements:filter=domainType:eq:TRACKER&trackedEntityAttributes:fields=id,displayName,description,valueType,optionSet[id,options[id,code,displayName,description,style]],unique"
          // apiServices
          //   .getAPI(param)
          //   .then(metaData => {
        
          //     var regques = metaData.data.programs.filter((p) => {
          //       console.log(p.programTrackedEntityAttributes)
          //       if (p.code && p.code == 'registration') {
          //         return p
          //       }
          //     })
          //     renderq = regques[0].programTrackedEntityAttributes
          //     console.log(regques[0].programTrackedEntityAttributes)
              getQuestion(registerProgram[0].programTrackedEntityAttributes,'',defaultRegisterProgramId)
            // }).catch(error => {
            //   console.log(error)
            // })
          })
            
        }).catch(error => {
          if (error.response) {
    
            swal({
              title: "Login failed",
              text: error.response.data.message,
              icon: "error",
              button: "Close",
            });
          } else {
            swal({
              title: "Login failed",
              text: "",
              icon: "error",
              button: "Close",
            });
          }
        })
      }

    function getUserAge(selectedDate){
      let dt2 = new Date(selectedDate);
      let dt1 = new Date();
  
      var a = moment(dt2);
      var b = moment(dt1);
  
      var years = a.diff(b, "years");
      var birth = Math.abs(years);
      var age = Math.abs(years);
      console.log("years",renderq, age);
      
      getQuestion(renderq,age,registrationProgramId)
      
    }

    function getQuestion(ques,userage,registrationProgramId) {
        console.log(ques,userage,registrationProgramId)
        OfflineDb.getDataFromPouchDB('loginDetails').then(res=>{
            console.log(res)
            setTrackId(res.data.attributeValues[0].value)
            var subURL = 'trackedEntityInstances/'+res.data.attributeValues[0].value+'.json?program='+registrationProgramId+'&fields=*?'
            apiServices.getAPI(subURL).then(searchResponse => {
                console.log(searchResponse)
                OfflineDb.setDataIntoPouchDB('usertrackid',searchResponse.data.trackedEntityInstance)
                const activeCaseDetails = {
                  'trackedEntityInstance': searchResponse.data.trackedEntityInstance,
                  'enrollmentId': "",
                }
                OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
                OfflineDb.setDataIntoPouchDB('userdetails',searchResponse.data.attributes)
                OfflineDb.setDataIntoPouchDB('providerobj',searchResponse.data.storedBy)
                var questions = ques.map((e) => {
                  var name = e.trackedEntityAttribute.displayName.toLowerCase()
                    if (name.includes("weight") || name.includes("gps") || name.includes("qr") || name.includes("testing") || name.includes("treatment") || name.includes("client type")) {
                      return null
                    }
                    
                    else {
                      return <div id={e.trackedEntityAttribute.id} className="questionRow" >
                        <EditQues
                          question={e}
                          attr={searchResponse.data.attributes}
                          calcAge={getUserAge}
                          userage={userage}
                        ></EditQues>
                      </div>
                    }
                  })
                  var intmarr = questions.filter((i) => i != null)
                  setRenderques(intmarr)
                  setLoading(false)
                  console.log("questions", questions, renderques)

            })
        })

        
      }

    function handleSubmit(){
        
        var suburl = "/trackedEntityInstances/"+trackId

        var userparams = {"created":new Date().toISOString().slice(0, 10),"orgUnit":"X6hagsDBktK","createdAtClient":new Date().toISOString().slice(0, 10),"trackedEntityInstance":"OFDIadRDfa1","lastUpdated":new Date().toISOString().slice(0, 10),"trackedEntityType":"mmeBG44SDWZ","lastUpdatedAtClient":new Date().toISOString().slice(0, 10),"inactive":false,"deleted":false,"featureType":"NONE","programOwners":[{"ownerOrgUnit":"X6hagsDBktK","program":registrationProgramId,"trackedEntityInstance":"OFDIadRDfa1"}],"relationships":[],"attributes":[],"geometry":{"type":"Point","coordinates":["",""]}}

        const form = document.querySelector('#registerform');

        var obj = serialize(form, { hash: true, disabled: true });
    
        Object.keys(obj).forEach((key, index) => {
          var att = { "attribute": key, "value": obj[key] }
    
          console.log(key, obj[key], att)
          userparams.attributes.push(att)
        });

        console.log("parem",userparams)
        apiServices.putAPI(suburl, userparams)
        .then(response => {
            console.log(response)
            if(response.data.httpStatusCode==200){
                next()
            }
        })

    }

    function next(){
        history.push('/layout/imonhome')
    }

    function handleBack() {
        window.history.back();
    }

    return (

        <>
        {loading ? (
          <div className={window.cordova ? "onboarding-page patientreg" : 'onboarding-page patientreg windowdesktop'}>

              <Grid container className="patientreggrid">
                <Grid container xs={12} className='loginnav'>

                  <Grid xs={3} className='backimg' onClick={() =>handleBack()}><img src={imgUrl.back} className='backsvg' /></Grid>
                  <Grid xs={6}>
                    <Typography variant='subtitle1' className='logname oneuhcfont'>Update Personal Profile</Typography>
                  </Grid>
                  <Grid xs={3}>
                    {/* <Typography variant='body2' className='stepname'>Step 2/5</Typography> */}
                  </Grid>

                </Grid>
                <Grid
                  item
                  xs={12}
                  className='regusercontent'
                  style={{ marginBottom: "590px" }}
                >
                  <div className='user-doh'>
                    <div><img src={imgUrl.dohlogo} className='dohimg ' /></div>
                    <div>
                      <Typography className='dohtext oneuhcfont' variant='h4'>OneUHC App</Typography>
                    </div>
                  </div>
                  <div className='user-dohreg'>
                    <div>
                      <img src={imgUrl.userpass} className='userimg' />
                    </div>
                    <div><img src={imgUrl.dohlogo} className='dohimg ' />
                      <Typography className='dohtext oneuhcfont' variant='h4'>OneUHC App</Typography>
                    </div>
                  </div>
                  <div>
                    <Typography variant="h6" className="oneuhcfont">Edit your information</Typography>
                  </div>
                </Grid>
                <Loader isLoading={loading} />


              </Grid>

            
          </div>



        ) : (
          <div className={window.cordova ? "onboarding-page patientreg" : 'onboarding-page patientreg windowdesktop'}>
            

              <Grid container className="patientreggrid">
                <Grid container xs={12} className='loginnav'>

                  <Grid xs={3} className='backimg' onClick={() =>handleBack()}><img src={imgUrl.back} className='backsvg' /></Grid>
                  <Grid xs={6}>
                    <Typography variant='subtitle1' className='logname oneuhcfont'>Update Personal Profile</Typography>
                  </Grid>
                  <Grid xs={3}>
                    <Typography variant='body2' className='stepname'><Feedback></Feedback></Typography>
                  </Grid>

                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={6}
                  className='regusercontent'
                >
                  <div className='user-doh'>
                    <div><img src={imgUrl.dohlogo} className='dohimg ' /></div>
                    <div>
                      <Typography className='dohtext oneuhcfont' variant='h4'>OneUHC App</Typography>
                    </div>
                  </div>
                  <div className='user-dohreg'>
                    <div>
                      <img src={imgUrl.userpass} className='userimg' />
                    </div>
                    <div><img src={imgUrl.dohlogo} className='dohimg ' />
                      <Typography className='dohtext oneuhcfont' variant='h4'>OneUHC App</Typography>
                    </div>
                  </div>
                  <div className="com-form">
                    <Typography variant="h6" className="oneuhcfont">Edit your information.</Typography>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  lg={6}
                  className="onboardingsliderdivcontent onboardingscrollcontent patientnewreg"
                >
                  <div className="com-form text-center">
                    <Typography variant="h6" className="oneuhcfont">Edit your information</Typography>
                  </div>
                  <form id="registerform" >
                  <div className="onboardingslider-container patientnewregdiv">
                  {renderques}
                    

                  </div>
                  

                  <div className="patienteditsubmit">
                    
                    {<Button
                      
                      color="primary"

                      className="skipbtn"
                        onClick={()=>handleSubmit()}
                    >
                      <Trans>
                        <span>{t("Submit")} </span>{" "}
                      </Trans>
                    </Button>}

                    {<Button

                    color="primary"

                    className="skipbtn"
                    onClick={() => next()}
                    >
                    <Trans>
                    <span>{t("Skip")} </span>{" "}
                    </Trans>
                    </Button>}

                  </div>
                  </form>
                </Grid>


              </Grid>

            

            
          </div>
        )}
      </>
  
      );
}

export default Edituser