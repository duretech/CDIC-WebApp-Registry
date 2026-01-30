import React, {useState, useEffect} from 'react';
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
import {Configuration} from '../../assets/data/config'
import OfflineDb from '../../db'
import i18n from "i18next";
import {apiServices} from '../../services/apiServices'; 

import classes from '../../App.module.css'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
//import { withRouter, Link } from "react-router-dom";
import { useHistory } from "react-router";
import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'

import { initReactI18next, useTranslation } from "react-i18next";

export default function SelectLanguages({onSuccess}) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState('en');
  const history = useHistory();
  const [resources, setResources] = React.useState({});
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null)
  //const [loading, setGlobalSpinner] = React.useState(false);
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  
  async function getUserBo() {
    let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
    setSessionUserBoValue(loginDetails.data)
  }
  useEffect(()=>{
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
        if(languageSelected.data != undefined) {
          setValue(languageSelected.data)
        }
        
    })    
  },[])

  useEffect(() => {
    if(sessionUserBoValue != null) {
      setDeviceDetails()
    }
  }, [sessionUserBoValue])

  const handleChange = (event) => {
    setValue(event.target.value);
    //i18n.changeLanguage(event.target.value);
  };
  const submit = ()=>{
    if(value){
        OfflineDb.setDataIntoPouchDB('languageSelected',value)
        localStorage.setItem('locale', value)
        i18n
        .use(initReactI18next) // passes i18n down to react-i18next
        .init({
          resources,
          fallbackLng: 'en',
          lng: localStorage.getItem('locale') || value,//value, //localStorage.getItem('locale') ? localStorage.getItem('locale'): 'en',          
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
            style={{display: 'flex',height: '100%',width: '100%'}}
        >
            <section 
                className="loginpagemainsection"
                style={{backgroundColor: '#fff',flexGrow: 1,padding: 20,borderLeft: '1px solid white',}}
            >
              {/* {loading ?
                  <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
                      <CircularLoader large dataTest="dhis2-uicore-circularloader" />
                  </CenteredContent>
                  :""
              } */}
                            
                <FormControl component="fieldset">
                <FormLabel component="legend">{t('Choose Language')}</FormLabel>
                <RadioGroup aria-label="language" name="languages" value={value} onChange={handleChange}>
                  {Configuration.language.languageList.map((languageList,i) => {
                    return <FormControlLabel key={i} value={languageList.value} control={<Radio />} label={t(languageList.name)} />
                  })}
                    {/* <FormControlLabel value="en" control={<Radio />} label="English" />
                    <FormControlLabel value="my" control={<Radio />} label="Burmese" /> */}
                </RadioGroup>
                </FormControl>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <FormControl component="fieldset">
                        <Button className="regformsubmitbtn" onClick={submit}>{t('Submit')}</Button>
                    </FormControl>
                  </Grid>
                </Grid>
            </section>                                
        </main>
    </div>
  );
}
