import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import imgUrl from "../../assets/images/imageUrl";
import HeaderNew from '../../component/layout/HeaderNew';
import FooterMenu from '../../component/layout/FooterMenu';
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
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'

function MyJourney() {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  var [pname,setpname] = useState('')
  var [pbirth,setpbirth] = useState('-')
  var [pgender,setpgender] =  useState('-')
  const setGlobalSpinner = useGlobalSpinnerActionsContext()

  // useEffect(()=>{
  //   gaLogEvent("My Certificates", '', '');
  //   gaLogScreen("My Certificates");
  //   OfflineDb.getDataFromPouchDB('loggedinuser').then(res=>{
  //     console.log(res)
  //     setpname(res.data.name)
  //   })
  //   OfflineDb.getDataFromPouchDB('userdetails').then(res=>{
  //     console.log(res)

  //     res.data.map((attr)=>{
  //       if(attr.displayName.toLowerCase().includes('gender')){
  //         setpgender(attr.value)
  //       }
  //       if(attr.displayName.toLowerCase().includes('birth')){
  //         setpbirth(attr.value)
  //       }
  //     })
  //   })
  // },[])

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

  return (
    <div className="certi-patientpage">
      <FooterMenu></FooterMenu>
      <Grid container className='certi-patientpagediv'>
        {/* <Grid container xs={12} className='certinav'>

          <Grid xs={3} className='backimg'><img src={imgUrl.whiteback} onClick={() => handleBack()} className='backsvg' /></Grid>
          <Grid xs={6}>
            <Typography variant='subtitle1' className='regname oneuhcfont'>My Journey</Typography>
          </Grid>
          <Grid xs={3}>
          <Typography variant='body2' className='stepname parafont'><Feedback></Feedback></Typography>
          </Grid>

        </Grid> */}
        <br/>
        <Grid container className='journeyDiv'>
        <Grid xs="12" md="6" className='journeyDivinner'>
        <div className='journeyItems' onClick={()=>openAdherence()}>
          <div className='clientBox treatmentBg'>
            {/* <img src={imgUrl.treatment} className="journeyImage"/> */}
          </div>
           
            <Typography variant='h6'>
              Treatment Adherence
            </Typography>
         </div>
        </Grid>
        {/* <Grid xs="12" md="6" className='journeyDivinner'>
        <div className='journeyItems' onClick={()=>history.push('/patientcertificate')}>
            <img src={imgUrl.diseaseadvi} className="journeyImage"/>
            <Typography variant='h6'>
              My Certificates
            </Typography>
         </div>
        </Grid> */}
        <Grid xs="12" md="6" className='journeyDivinner'>
        <div className='journeyItems' onClick={()=>history.push('/historypatient')}>
        <div className='clientBox myhistoryBg'>
           {/* <img src={imgUrl.history} className="journeyImage"/> */}
        </div>
           
            <Typography variant='h6'>
              My History
            </Typography>
         </div>
        </Grid>
        {/* <Grid xs="12" md="6" className='journeyDivinner'>
        <div className='journeyItems' onClick={()=>localStorage.getItem('reminders') ? history.push('/reminderList') : history.push('/reminder')}>
            <img src={imgUrl.diseaseadvi} className="journeyImage"/>
            <Typography variant='h6'>
              Reminder
            </Typography>
         </div>
        </Grid>
        <Grid xs="12" md="6" className='journeyDivinner'>
        <div className='journeyItems' onClick={()=>history.push('/patientsettings')}>
            <img src={imgUrl.diseaseadvi} className="journeyImage"/>
            <Typography variant='h6'>
              My Profile
            </Typography>
         </div>
        </Grid> */}
        
         
        </Grid>
        

        {/* <Grid container xs={12} className="homebottomnav">
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
        </Grid> */}
      </Grid>

    </div>

  );
}

export default MyJourney