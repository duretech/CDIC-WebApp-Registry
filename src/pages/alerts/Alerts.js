import React, { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import Grid from "@material-ui/core/Grid";
import Globalclasses from "../../App.module.css";
import "../../assets/css/customstyles.css";
import { apiServices } from '../../services/apiServices'
import AlertList from './AlertList';
import { CircularLoader, CenteredContent } from '@dhis2/ui';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SearchBar from '../../component/searchbar/SearchBar';
import _ from 'lodash';
import swal from 'sweetalert';
import { useTranslation } from 'react-i18next';
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import {Configuration} from '../../assets/data/config'
import OfflineDb from '../../db'
import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Alerts = () => {
  const { t } = useTranslation();
  const [alertsList, setAlertslist] = useState([]);
  const [alertsListFiltered, setAlertsListFiltered] = useState([]);
  const [input, setInput] = useState('');
  const [searchAllResult,setSearchAllResult] = useState([])
  // const [sessionUserBoValue, setSessionUserBoValue] = useState(
  //   JSON.parse(sessionStorage.getItem('userBO')) || JSON.parse(localStorage.getItem('userBO'))
  // )

  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null)
  const [progarmData, setProgarmData] = useState(null)

  //const [loading, setGlobalSpinner] = useState(true);
  const classes = useStyles();
  const [alertType, setAlertType] = useState('');
  const setGlobalSpinner = useGlobalSpinnerActionsContext()

  async function getMetaData() {
    let metadata = await OfflineDb.getDataFromPouchDB('metaData')
    setProgarmData(metadata.data)

    let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
    setSessionUserBoValue(loginDetails.data)
  }
  useEffect(() => {
    getMetaData()
  }, [])

  useEffect(() => {
    if(sessionUserBoValue != null && progarmData != null){
      const subURL = `alerts/list?ouid=${sessionUserBoValue.organisationUnits[0].id}&programid=${sessionUserBoValue.programs[0]}&pageSize=50&skipPaging=true&paging=true`;
      apiServices.getAPI(subURL).then(response => {

        setAlertslist(response.data.data);
        setAlertsListFiltered(response.data.data);
        setSearchAllResult(response.data.data)
        setGlobalSpinner(false);
      }).catch(err => {
        swal({
          title: t("Error"),
          text: t(err),
          icon: "error",
          button: "Close",
        });
        setGlobalSpinner(false);
      });
    }
    
  }, [sessionUserBoValue,progarmData ])

  const handleChange = (event) => {
    console.log('handleChange>>>', event)
    if (event.target.value == "ALL") {
      setAlertsListFiltered(alertsList);
    } else {
      let filteredList = _.filter(alertsList, ['alertname', event.target.value]);
      setAlertsListFiltered(filteredList)
    }
    setAlertType([event.target.value])
  };
  const updateInput = (input) => {
    setInput(input);
    let filteredList = []
    setGlobalSpinner(true)
    if(input && input.length > 3){
        searchAllResult.map(function(objectKey, index) {
            //objectKey.map(function(data, j) {
                if(objectKey[Configuration.searchbarfielduid].toLowerCase().indexOf(input.toLowerCase()) > -1){
                    filteredList.push(objectKey)
                }
            //})
        })
        //console.log(filteredList)
        // let headerEle = searchAllResult[0]
        // let filterSearchArray = [];
        // filterSearchArray.push(headerEle)
        // filterSearchArray.push(filteredList)
        setAlertsListFiltered([]);
        setTimeout(function(){
            setGlobalSpinner(false)
            setAlertsListFiltered(filteredList)
        },500)
    }else{
        if(input.length == 0){
            // let headerEle = searchAllResult[0]
            // let filterSearchArray = [];
            // filterSearchArray.push(headerEle)
            // filterSearchArray.push(searchAllResult[1])
            setAlertsListFiltered([]);
            setTimeout(function(){
                setGlobalSpinner(false)
                setAlertsListFiltered(searchAllResult)
            },1000)
        }else{
            setGlobalSpinner(false)
        }
    }
 }

  const filterAlerts = () => {
    const uniqueAlerts = [...new Set(alertsList.map(obj => obj.alertname))];

    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">{t('Please Select')}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={alertType}
            onChange={handleChange}
          >
            <MenuItem value="ALL">{t('All')}</MenuItem>
            {uniqueAlerts.map(item => {
              return (<MenuItem value={item}>{t(item)}</MenuItem>)
            })}
          </Select>
        </FormControl>

      </div>
    );
  }
  return (
    <div className={Globalclasses.container}>
      <main
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
        <section
          className="tutorialbg"
          style={{
            backgroundColor: "#fff",
            flexGrow: 1,
            padding: 0,
          }}
        >
          {/* {loading ?
            <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
              <CircularLoader large dataTest="dhis2-uicore-circularloader" />
            </CenteredContent>
            : ""
          } */}
          <Grid container spacing={3} className="mt-60px mb-30px registration-page alerts_page">
            {/* <Grid item xs={12} sm={12} md={12} className="">
              
            </Grid> */}
            <Grid item xs={12} sm={12} md={12}>
              <SearchBar 
                input={input} 
                setKeyword={updateInput}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} className="pl-0px">
            
              <div className="choose_alertdiv">{filterAlerts()}</div>
            </Grid>
            
            {

              alertsListFiltered.map((alert, id) => {
                
                return (
                  progarmData != null ?
                  <Grid item xs={12} sm={6} md={6} className="knowkedgelistcontainer">
                    <AlertList key={id} alertdata={alert} progarmData={progarmData}/>
                  </Grid>
                  : <> </>
                )
              })

            }
          </Grid>
        </section>
      </main>

    </div>
  )
};

export default Alerts;
