import React, { useState, useEffect } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
  CircularLoader,
  CenteredContent
} from '@dhis2/ui';
import swal from 'sweetalert';
//import { Configuration } from '../../assets/data/config'
import OfflineDb from '../../../db'
import i18n from "i18next";
import { apiServices } from '../../../services/apiServices';
import { useTranslation } from 'react-i18next';

import imgUrl from '../../assets/images/imageUrl.js';
import classes from '../../../App.module.css'
import { useGlobalSpinnerActionsContext } from '../../../context/GlobalSpinnerContext'
import { useHistory } from "react-router";
import '../../../assets/css/customstyles.css'

//import dohlogo from '../../../assets/images/dpcb-images/doh.png'
//import america from '../../../assets/images/dpcb-images/english.png'
//import bisaya from '../../../assets/images/dpcb-images/bisaya.png'
//import connect from '../../../assets/images/dpcb-images/Connect.png'
import { initReactI18next } from "react-i18next";
import { Typography } from '@material-ui/core';

import back from '../../../assets/images/back.png'
//Desktop screen css
import '../../assets/css/customdesktop.css';
import { HistoryOutlined } from '@material-ui/icons';
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
import Feedback from '../Feedback';

export default function SelectLanguages({ onSuccess }) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState('en');
  const history = useHistory();
  const [resources, setResources] = React.useState({});
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null)
  //const [loading, setGlobalSpinner] = React.useState(false);
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  const [Configuration, setConfiguration] = React.useState(null);

  // async function getUserBo() {
  //   let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
  //   setSessionUserBoValue(loginDetails.data)

  //   let configurations = await OfflineDb.getDataFromPouchDB('configurations')
  //   //console.log("configurations48",configurations)
  //   setConfiguration(configurations.data.configuration)
  // }

  useEffect(() => {
    //get use details from localdb
    // getUserBo()
    gaLogEvent("Language Selection", '', '');
    gaLogScreen("Language Selection");
    console.log(history)
    OfflineDb.getDataFromPouchDB('translationResource')
      .then(translationResource => {
        if (translationResource.data != undefined) {
          setResources(translationResource.data)
        } else {
          setGlobalSpinner(true)
          apiServices.getAPI('dataStore/translations/translations').then(res => {
            OfflineDb.setDataIntoPouchDB('translationResource', res.data)
            setResources(res.data)
            setGlobalSpinner(false)
            localStorage.setItem("translations", JSON.stringify(res.data))
          }).catch(error => {
            /*swal({
              title: t("Success"),
              text: t("No translation found"),
              icon: "success",
              button: "Close",
            })*/
            setGlobalSpinner(false)
          })
        }
      })

    OfflineDb.getDataFromPouchDB('languageSelected')
      .then(languageSelected => {
        if (languageSelected.data != undefined) {
          setValue(languageSelected.data)
        }

      })

  }, [])

  useEffect(() => {
    if (sessionUserBoValue != null) {
      //setDeviceDetails()
    }
  }, [sessionUserBoValue])

  //const handleChange = (event) => {
  const handleChange = (event) => {
    setValue(event.target.value);
    //i18n.changeLanguage(event.target.value);
  };

  const setLangaugeAndSubmit = (langaugecode) => {
    setValue(langaugecode);
    submit();
  };

  const handleclick = () => {
    console.log("clicked")
    history.push("/layout/imonhome");
  }
  const submit = () => {
    if (value) {
      OfflineDb.setDataIntoPouchDB('languageSelected', value)
      localStorage.setItem('locale', value)
      i18n
        .use(initReactI18next) // passes i18n down to react-i18next
        .init({
          resources,
          fallbackLng: 'en',
          lng: value, //localStorage.getItem('locale') ? localStorage.getItem('locale'): 'en',          
          keySeparator: false, // we do not use keys in form messages.welcome

          interpolation: {
            escapeValue: false // react already safes from xss
          },
          react: {
            useSuspense: false,
            wait: false,
          },
        });
      // onSuccess()
      if(history.location.state){
        console.log("userlist", history.location.state.userlist)
        history.push("/layout/Userprofile",{ "userlist": history.location.state.userlist });
      }else{
        history.push('/layout/imonhome')
      }

    }
    return;
  };

  function handleBack() {
    window.history.back();
  }

  function setDeviceDetails() {
    var deviceInfo = {};
    if (window.cordova) {
      deviceInfo.name = window.device.model;
      deviceInfo.cordova = window.device.cordova;
      deviceInfo.platform = window.device.platform;
      deviceInfo.uuid = window.device.uuid;
      deviceInfo.version = window.device.version;
      deviceInfo.manufacturer = window.device.manufacturer;
      deviceInfo.isVirtual = window.device.isVirtual;
      deviceInfo.serial = window.device.serial;
    } else {
      if (navigator) {
        deviceInfo.platform = navigator.platform;
        deviceInfo.uuid = navigator.appCodeName;
        deviceInfo.version = navigator.appVersion;
        deviceInfo.name = navigator.appName;
      }
    }
    //deviceInfo
    sessionUserBoValue.attributeValues.map(item => {
      if (item.attribute.displayName == "Device Info") {
        item.value = JSON.stringify(deviceInfo);
      }
    })
    //OfflineDb.setDataIntoPouchDB('loginDetails', sessionUserBoValue)
    setGlobalSpinner(true)
    apiServices.putAPI(`users/${sessionUserBoValue.id}`, sessionUserBoValue).then(res => {
      setGlobalSpinner(false)
    }).catch(err => {
      setGlobalSpinner(false)
      swal({ 'title': err })
    })
  }

  return (
    <div className={classes.container}>
      <main
        style={{ display: 'flex', height: '100%', width: '100%' }}
      >
        <section className={window.cordova ? "languagepage" : 'languagepage windowdesktop'}
          style={{
            flexGrow: 1,
            padding: 0,
          }}
        >
          {/* {loading ?
                  <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
                      <CircularLoader large dataTest="dhis2-uicore-circularloader" />
                  </CenteredContent>
                  :""
              } */}

          <Grid container className="pagelanguageselect">

            <Grid container xs={12} className='registernav'>

              <Grid xs={3} className='backimg'><img src={back} onClick={() => handleBack()} className='backsvg' /></Grid>
              <Grid xs={6}>
                <Typography variant='subtitle1' className='regname oneuhcfont'>Register</Typography>
              </Grid>
              <Grid xs={3}> <Typography variant='body2' className='stepname parafont'><Feedback></Feedback></Typography></Grid>

            </Grid>


            <Grid item xs={12} sm={12} md={12} className="pagelaterpart pagelanguage">
              <div className="langprefpageformholder langformselect">
                <div className='usermain'>
                  {/* <img src={dohlogo} className='dohimg' /> */}
                  <div>
                    <Typography variant="h5" className='dohtext oneuhcfont' component="div">
                      OneUHC
                    </Typography>
                    <Typography variant="h5" className='dohtext oneuhcfont' component="div">
                      App
                    </Typography>
                  </div>

                </div>
                <div className='langcontents'>
                <Typography variant='h6' className='selectlang oneuhcfont'>
                        Select a Langauge
                      </Typography>
                  <div className='americancontent'>
                    <div>
                     
                    </div>
                    <div onClick={() => setLangaugeAndSubmit('en')}>
                    <div className='americasection'>
                      {/* <img src={imgUrl.america} className='americaimg' /> */}
                      <Typography variant='body2' className='oneuhcfont'>
                        English
                      </Typography>
                    </div>
                      
                    </div>
                    
                  </div>
                  <div className='tagalogcontent'>
                    {/* <div className='bisayacontent'>
                      <Typography variant='body2' className='parafont'>
                        Ipaalam sa amin kung anong uri ng account ang gusto mong i-set up.
                      </Typography>
                    </div> */}
                    <div className='bisayalang'>
                      <div onClick={() => setLangaugeAndSubmit('ceb')}>
                      <div className='bisayasection'>
                      {/* <img src={imgUrl.bisaya} className='bisayaimg' /> */}
                      <Typography variant='body2' className='oneuhcfont'>
                          Bisaya
                        </Typography>
                    </div>
                        
                      </div>
                      <div onClick={() => setLangaugeAndSubmit('tl')}>
                      <div className='bisayasection'>
                      <img src={imgUrl.bisaya} className='bisayaimg' />
                      <Typography variant='body2' className='oneuhcfont'>
                          Tagalog
                        </Typography>
                     </div>
                        
                      </div>
                    </div>
                   
                  </div>
                </div>


                <div className='connectsection'>
                  <img src={imgUrl.dohlogo} className='connectimg' />
                </div>
                <div className="w-100">
                  <FormControl component="fieldset">
                    {/* <FormLabel component="legend">{t('Choose Language')}</FormLabel> */}

                    {/* <RadioGroup aria-label="language" name="languages" value={value} onChange={handleChange}>
                      {Configuration && Configuration.language.languageList.map((languageList, i) => {
                        return (languageList.showHide != undefined && languageList.showHide) ? <FormControlLabel key={i} value={languageList.value} control={<Radio />} label={t(languageList.name)} /> : ""
                      })} */}

                    {/* <FormControlLabel value="en" control={<Radio />} label="English" />
                            <FormControlLabel value="my" control={<Radio />} label="Burmese" /> */}
                    {/* </RadioGroup> */}
                  </FormControl>
                </div>
                <div className="mt-20px buttons">
                  {/* <FormControl component="fieldset">
                    <Button className="regformsubmitbtn loginsubmitbtn" onClick={submit}>{t('Submit')}</Button>
                  </FormControl> */}
                  {/* <Button
                    onClick={submit}
                    className="loginsubmitbtn"
                  >
                    {t('Submit')}
                  </Button> */}
                </div>
              </div>
            </Grid>
          </Grid>
        </section>
      </main>
    </div >
  );
}
