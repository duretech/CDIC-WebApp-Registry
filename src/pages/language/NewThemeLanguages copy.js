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
import OfflineDb from '../../db'
import i18n from "i18next";
import { apiServices } from '../../services/apiServices';
import { useTranslation } from 'react-i18next';

import imgUrl from '../../assets/images/imageUrl.js';
import classes from '../../App.module.css'
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'
//import { withRouter, Link } from "react-router-dom";
import { useHistory } from "react-router";
import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'
import { Typography } from '@material-ui/core';
import { initReactI18next } from "react-i18next";

export default function SelectLanguages({ onSuccess }) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState('en');
  const history = useHistory();
  const [resources, setResources] = React.useState({});
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null)
  //const [loading, setGlobalSpinner] = React.useState(false);
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  const [Configuration,setConfiguration] = React.useState(null);

  async function getUserBo() {
    let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
    setSessionUserBoValue(loginDetails.data)
    
    let configurations = await OfflineDb.getDataFromPouchDB('configurations')
    //console.log("configurations48",configurations)
    setConfiguration(configurations.data.configuration)
  }

  useEffect(() => {
    //get use details from localdb
    getUserBo()

    OfflineDb.getDataFromPouchDB('translationResource')
    .then(translationResource => {
      if(translationResource.data != undefined) {
        setResources(translationResource.data)
      } else {
        setGlobalSpinner(true)
        apiServices.getAPI('dataStore/translations/translations').then(res=>{
          OfflineDb.setDataIntoPouchDB('translationResource',res.data)      
          setResources(res.data)
          setGlobalSpinner(false)
          localStorage.setItem("translations",JSON.stringify(res.data))      
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
    if(sessionUserBoValue != null) {
      //setDeviceDetails()
    }
  }, [sessionUserBoValue])

  const handleChange = (event) => {
    setValue(event.target.value);
    //i18n.changeLanguage(event.target.value);
  };
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
      onSuccess()
      // history.push("/layout/home");

    }
    return;
  };
  function setDeviceDetails(){
    var deviceInfo = {};
    if(window.cordova){
      deviceInfo.name = window.device.model;
      deviceInfo.cordova = window.device.cordova;
      deviceInfo.platform = window.device.platform;
      deviceInfo.uuid = window.device.uuid;
      deviceInfo.version = window.device.version;
      deviceInfo.manufacturer = window.device.manufacturer;
      deviceInfo.isVirtual = window.device.isVirtual;
      deviceInfo.serial = window.device.serial;
    }else{
      if(navigator){
        deviceInfo.platform = navigator.platform;
        deviceInfo.uuid = navigator.appCodeName;
        deviceInfo.version = navigator.appVersion;
        deviceInfo.name = navigator.appName;
      }
    }
    //deviceInfo
    sessionUserBoValue.attributeValues.map(item=>{
      if(item.attribute.displayName == "Device Info"){
        item.value = JSON.stringify(deviceInfo);
      }
    })
    //OfflineDb.setDataIntoPouchDB('loginDetails', sessionUserBoValue)
    setGlobalSpinner(true)
    apiServices.putAPI(`users/${sessionUserBoValue.id}`,sessionUserBoValue).then(res=>{
        setGlobalSpinner(false)
    }).catch(err=>{
      setGlobalSpinner(false)
      swal({'title':err})
    })
  }

  return (
    <div className={classes.container}>
      <main
        style={{ display: 'flex', height: '100%', width: '100%' }}
      >
        <section
          className="mainsection pb-0 langwebapp"
          style={{
            flexGrow: 1,
            padding: 12,
          }}
        >
          {/* {loading ?
                  <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
                      <CircularLoader large dataTest="dhis2-uicore-circularloader" />
                  </CenteredContent>
                  :""
              } */}
          <Grid container spacing={3} className="">
            <Grid item xs={12} sm={12} md={7} className="pageupperpart">
              <div className="innerdiv userwebapp">
                <p className="zero text-center">
                  <div className="useravtarimg" />
                </p>
                <p className="zero text-center">
                  <h3 className="text-uppercase">Language Preference</h3>
                </p>
              </div>
              <div className='migrantlogin'>
                                
                            </div>
            </Grid>
            <Grid item xs={12} sm={12} md={5} className="pagelaterpart">
              <div class="custom-shape-divider-top-1612935135">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" class="shape-fill"></path>
                </svg>
              </div>
              <div className="langprefpageformholder">
              <div className=''>
              {/* <div className="useravtarimgapp" /> */}
                                    <Typography variant='h4' className='mb-30px'>Language Preference</Typography>
               </div>
                <div className="w-100 langitems">
                  <FormControl component="fieldset">
                    {/* <FormLabel component="legend">{t('Choose Language')}</FormLabel> */}
                    <RadioGroup aria-label="language" name="languages" value={value} onChange={handleChange}>
                      {Configuration && Configuration.language.languageList.map((languageList, i) => {
                        return (languageList.showHide != undefined && languageList.showHide) ? <FormControlLabel key={i} value={languageList.value} control={<Radio />} label={t(languageList.name)} />: ""
                      })}
                      {/* <FormControlLabel value="en" control={<Radio />} label="English" />
                            <FormControlLabel value="my" control={<Radio />} label="Burmese" /> */}
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="mt-20px buttons">
                  {/* <FormControl component="fieldset">
                    <Button className="regformsubmitbtn loginsubmitbtn" onClick={submit}>{t('Submit')}</Button>
                  </FormControl> */}
                  <Button
                    onClick={submit}
                    className="loginsubmitbtn"
                    >
                    {t('Submit')}
                  </Button>
                </div>
              </div>
            </Grid>
          </Grid>
        </section>
      </main>
    </div>
  );
}
