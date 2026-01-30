import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import imgUrl from "../../assets/images/imageUrl";
//Desktop screen css
import '../../assets/css/customdesktop.css';
import moment from 'moment';
import swal from 'sweetalert';
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'
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
import { apiServices } from '../../services/apiServices';

function Certificatepatient() {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  var [pname,setpname] = useState('')
  var [pbirth,setpbirth] = useState('-')
  var [pgender,setpgender] =  useState('-')
  var [porg,setporg] = useState('')
  var [cert,setcert] = useState('')
  var [status,setStatus] = useState(null)
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  const [treatmentOutcomeStageId, setTreatmentOutcomeStageId] = useState(null)
  const [treatmentOutComeField, setTreatmentOutComeField] = useState(null)
  useEffect(()=>{
    gaLogEvent("My Certificates", '', '');
    gaLogScreen("My Certificates");
    OfflineDb.getDataFromPouchDB('loginDetails').then(res=>{
      console.log(res)
      setpname(res.data.name)
      setporg(res.data.organisationUnits[0].displayName)
      let yourDate = new Date()
    
      var Request=
      {"patient_full_name":res.data.name,
      "facility_name":res.data.organisationUnits[0].displayName,
      "date":yourDate.toISOString().split('T')[0],
      "DSTB":"Y",
      "DRTB":"",
      "TB":""}
      setGlobalSpinner(true)
      apiServices.postAPI('careapp/genInitiationCertif', Request)
      .then(response => {
        console.log(response)
        setGlobalSpinner(false)
        setcert(response.data.fileurl)       
      }).catch(err=>{
        setGlobalSpinner(false)
      })
    })
    OfflineDb.getDataFromPouchDB('userdetails').then(res=>{
      console.log(res)

      res.data.map((attr)=>{
        if(attr.displayName.toLowerCase().includes('gender')){
          setpgender(attr.value)
        }
        if(attr.displayName.toLowerCase().includes('birth')){
          setpbirth(moment(attr.value).format("YYYY-MM-DD"))
        }
      })
    })

    OfflineDb.getDataFromPouchDB('metaData').then(metaData=>{
      let temparr = {};                  
        metaData.data.programs[0].programStages.map(programStages => {
            let stageName = programStages.description ? programStages.description : programStages.displayName;
            // if (stageName.trim() == "Referral for treatment") {
            //     setreferralfortreatmentStageId(programStages.id);
            //     temparr = { ...temparr, referralfortreatmentStageId: programStages.id };
            // }

            if (stageName.trim() == "Treatment outcome") {
              setTreatmentOutcomeStageId(programStages.id);
              temparr = { ...temparr, treatmentOutcomeStageId: programStages.id };
          }

          programStages.programStageDataElements.map((de) => {
            let fieldname = de.dataElement.description ? de.dataElement.description : de.dataElement.formName ? de.dataElement.formName : de.dataElement.displayName
            if (fieldname) {
              if (fieldname.trim() == "Treatment outcome") {
                setTreatmentOutComeField(de.dataElement.id);
                temparr = { ...temparr, treatmentOutComeField: de.dataElement.id };
            }
            }
          })
      })
    });   
    
  },[])

  useEffect(()=>{
    console.log("res ",treatmentOutComeField);
    if(treatmentOutComeField) {
      OfflineDb.getDataFromPouchDB('enrollments').then(res=>{
        console.log("res ",res);
        //if(res && res.data && res.data[0] && res.data[0].events && res.data[0].events[0]) {
        if(res && res.data && res.data) {
          //console.log("res ",res,res.data[0].events[0].dataValues);
            res.data.map((data) => {
              data.events.map((event) => {
                //console.log(" event ",event);
                event.dataValues.map((item) => {
                  if(item.dataElement == treatmentOutComeField) {
                    setStatus(item.value)
                  }
                })
            })
          })
        }
        
      })
    }
  
}, [treatmentOutComeField])

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
      console.log("here ",cert,status);
      if(status == "Cured") {
        if (window.cordova && cert) {
          console.log("hello")
          window.open(cert, '_system')
        }else if(cert){
          window.open(cert, '_blank')
        }else{

        }
      // const link = document.getElementById('tbcertificate');
      // if (link) {
      //   link.setAttribute(
      //     'download',
      //     `FileName.pdf`,
      //   );
      //   link.setAttribute(
      //     "target",
      //     "_blank"
      //   );
      //   link.setAttribute(
      //     "href",
      //     cert
      //   );
      //   console.log(link)
        
      //     if (window.cordova) {
      //       console.log("hello")
      //       window.open(cert, '_system')
      //     }
      //   } else {
      //     swal({
      //       title: t("Warning"),
      //       text: t("You can download cerificate only if your treatcome outcome is Cured"),
      //       icon: "warning",
      //       buttons: "Close",
      //     })
      //   }
        
      }else{
        swal({
          title: t("Warning"),
          text: t("You can download certificate only if your treatcome outcome is Cured"),
          icon: "warning",
          buttons: "Close",
        })
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
            <Typography variant='subtitle1' className='regname oneuhcfont'>My Certificates</Typography>
          </Grid>
          <Grid xs={3}>
          <Typography variant='body2' className='stepname parafont'><Feedback></Feedback></Typography>
          </Grid>

        </Grid>
        <Grid container xs={12} className='clientprofile'>
          <Grid container xs={12} lg={8} className='clientprofiletext'>
            <Grid item xs={2} className='prodiv'>
              <img src={imgUrl.clientproavatar} className='proavatar' />

            </Grid>
            <Grid item xs={10}>
              <div>
                <Typography variant='h5' className='oneuhcfont'>{pname}</Typography>

              </div>
              <div className='clientsinfo'>
                <div className='clientsinfodiv clientbirthdiv'><img src={imgUrl.clientbirth} className='clientbirth' /> <Typography variant='caption'>{pbirth}</Typography></div>

                <div className='clientsinfodiv clientsexdiv'><img src={imgUrl.clientgender} className='clientsex' /> <Typography variant='caption'>{pgender}</Typography></div>

                <div className='clientsinfodiv clienttreatdiv '><img src={imgUrl.clienttreat} className='clienttreat' /> <Typography variant='caption'>Treatment</Typography></div>

              </div>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4} className='text-center clientprofiletext'>
            <div className='clientidinfo'>
              <Typography variant='subtite1' className='oneuhcfont'>CLIENT ID TAG</Typography>
              <Typography variant='body1'>ID: GA2600A2</Typography>
            </div>
          </Grid>

        </Grid>
        <Grid item xs={12} className='tbtreatcontent'>
          <div className='tbtreatcontentdiv'>
            <div className='text-center'>
              <img src={imgUrl.tbtreat} className='tbtreat' />
              <Typography variant='h6' className='oneuhcfont'>TB TREATMENT COMPLETION</Typography>
            </div>
            <div className="buttons">
              <Button
                type="button"
                onClick={() => handleTbCertifyClick()}
                className="loginbtn loginsubmitbtn loginsubmit loginb"
              >
                {/* <a id='tbcertificate' href=''>
                  {t("Download")}
                </a> */}
                {t("Download")}
              </Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} className='covidcontent'>
          <div className='covidcontentdiv hide'>
            <div className='text-center'>
              <img src={imgUrl.covid} className='covid' />
              <Typography variant='h6' className='oneuhcfont'>COVID-19 VACCINATION</Typography>
            </div>
            <div className="buttons">
              <Button
                type="button"
                // onClick={() => handleCovidCertifyClick()}
                className="loginbtn loginsubmitbtn loginsubmit loginb"
              >
                {/* <a id='covidcertificate' href=''> */}
                {t("Download")}
                {/* </a> */}
              </Button>
            </div>
          </div>
        </Grid>

        <Grid container xs={12} className="homebottomnav">
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

export default Certificatepatient