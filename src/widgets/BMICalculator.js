import React, { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import Grid from "@material-ui/core/Grid";
import Globalclasses from "../App.module.css";
import "../assets/css/customstyles.css";
import Typography from '@material-ui/core/Typography';
import { apiServices } from "../services/apiServices";
import { CircularLoader, CenteredContent } from "@dhis2/ui";
import { columnConfig, pieConf, semiPieConf } from "../component/highchart/chartconfig";
import ChartComponent from "../component/highchart/ChartComponent";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Pagination from "@material-ui/lab/Pagination";
import SearchBar from "../component/searchbar/SearchBar";
import Button from "@material-ui/core/Button";

import _ from "lodash";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useGlobalSpinnerActionsContext } from "../context/GlobalSpinnerContext";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
//import { Configuration } from "../../assets/data/config";
import OfflineDb from "../db";
import "../assets/css/customstyles.css";
//import "../assets/css/theme_grey.css";
import "../assets/css/theme_blue.css";
//import "../assets/css/theme_green.css";
//import "../assets/css/theme_red.css";
import FooterMenu from '../component/layout/FooterMenu'
import { Paper } from "@material-ui/core";
import ButtonBase from "@material-ui/core/ButtonBase";
import { styled } from "@material-ui/styles";
import imgUrl from "../assets/images/imageUrl";
import Popup from 'react-animated-popup'
import {
  InputFieldFF,
  ReactFinalForm,
  hasValue
} from '@dhis2/ui';
import {
  Radios,
} from 'mui-rff';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
const { Form, Field } = ReactFinalForm

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '30px',
  maxHeight: '30px',
});

const BMICalculator = () => {
  const styleObject = {
    width: '100%',
    height: '100%',
  };
  const { t } = useTranslation();
  const [alertsList, setAlertslist] = useState([]);
  const [alertsListFiltered, setAlertsListFiltered] = useState([]);
  const [input, setInput] = useState("");
  const [searchAllResult, setSearchAllResult] = useState([]);
  const [Configuration,setConfiguration] = useState(null);
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [progarmData, setProgarmData] = useState(null);
  const [viewType, setViweType] = useState("list");
  //const [loading, setGlobalSpinner] = useState(true);
  const classes = useStyles();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  //pagination code
  //const itemsPerPage = Configuration.pagination.itemsPerPage;
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);
  const [offset, setoffset] = useState(0);
  const [showLoadMore, setshowLoadMore] = useState(false);
  const [firstNameId, setFirstNameId] = useState(false);
  const [fullName, setFullName] = useState(false);
  const [ageId, setAgeId] = useState(false);
  const [age, setAge] = useState(false);
  const [genderId, setGenderId] = useState(false);
  const [gender, setGender] = useState(false);
  //
  const [regPhoneNumberId, setRegPhoneNumberId] = useState(false);
  const [regPhoneNumber, setRegPhoneNumber] = useState(false);
  const [initialValues, setinitialValues] = useState(null);
  const [bmiresult, setbmiresult] = useState(null);
  const [chartData, setchartData] = useState([
    ['Underweight', 18.4],
    ['Normal weight', 24.9],
    ['Overweight', 29.9],
    ['Obesity', 40]
  ])
  const [visible, setVisible] = useState(false)

  async function getMetaData() {
    let metadata = await OfflineDb.getDataFromPouchDB("metaData");
    setProgarmData(metadata.data);

    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);

    let configurations = await OfflineDb.getDataFromPouchDB('configurations')
    setConfiguration(configurations.data.configuration)
  }
  useEffect(() => {
    getMetaData();
  }, []);

  useEffect(() => {
    if (progarmData != null)  {
      getCustomVariableIds()
    }
  }, [progarmData]);

  useEffect(() => {
    if (sessionUserBoValue != null && firstNameId != null)  {
      getUserDetails()
    }
  }, [sessionUserBoValue,firstNameId]);

  useEffect(() => {
    if(visible){
      setTimeout(function(){
        const popupDiv = document.querySelector('.animated-popup');
        const parentDiv = popupDiv && popupDiv.parentNode;
        if(popupDiv){
          parentDiv.style.backgroundColor = "rgba(0,0,0,0.4)";
        }
      },100)
    }
}, [visible]);

  function getCustomVariableIds(){
    progarmData.programs[0].programTrackedEntityAttributes.map(regField => {
      let regFieldName = regField.trackedEntityAttribute.description ? regField.trackedEntityAttribute.description : regField.trackedEntityAttribute.displayName;
      if (
        regFieldName
          .trim()
          .toLocaleLowerCase() == "first name"
      ) {
        setFirstNameId(regField.trackedEntityAttribute.id);
      }
      if (
        regFieldName
          .trim()
          .toLocaleLowerCase() == "age"
      ) {
        setAgeId(regField.trackedEntityAttribute.id);
      }
      if (
        regFieldName
          .trim()
          .toLocaleLowerCase() == "gender"
      ) {
        setGenderId(regField.trackedEntityAttribute.id);
      }
      if (
        regFieldName
          .trim()
          .toLocaleLowerCase() == "phone number (permanent)"
      ) {
        setRegPhoneNumberId(regField.trackedEntityAttribute.id);
      }
    })
  }
  function getUserDetails(){
    try{
        if(sessionUserBoValue && sessionUserBoValue.attributeValues && sessionUserBoValue.attributeValues.length > 0){
          setFullName(sessionUserBoValue.name)
  
          const getURL = 'trackedEntityInstances/' + sessionUserBoValue.attributeValues[0].value + '.json?program=' + progarmData.programs[0].id + '&fields=*?'
          setGlobalSpinner(true)
          apiServices.getAPI(getURL)
              .then(trackentityInstanceData => {
                  setGlobalSpinner(false);
                  if (trackentityInstanceData.data) {
                      let ageVal = ageId && _.find(trackentityInstanceData.data.attributes,{attribute: ageId}) ? _.find(trackentityInstanceData.data.attributes,{attribute: ageId}).value: ''
                      setAge(ageVal)
                      let genderVal = ageId && _.find(trackentityInstanceData.data.attributes,{attribute: genderId}) ? _.find(trackentityInstanceData.data.attributes,{attribute: genderId}).value: ''
                      setGender(genderVal)
                      let phoneno = regPhoneNumberId && _.find(trackentityInstanceData.data.attributes,{attribute: regPhoneNumberId}) ? _.find(trackentityInstanceData.data.attributes,{attribute: regPhoneNumberId}).value: ''
                      setRegPhoneNumber(phoneno)
                      setinitialValues({'age':ageVal,'gender':genderVal,'name':sessionUserBoValue.name})

                  } else {

                  }

              }).catch(err => {
                  setGlobalSpinner(false)
              })
        }
    }catch(e){

    }
  }

  const handleViewChange = (event, newValue) => {
    setViweType(newValue);
  };

  function onSubmit(values){
    let results = getBMIResults(values)
    console.log(" ",results);
    setbmiresult(results)
  }

  function calculateBMI(values){
    //[weight (kg) / height (cm) / height (cm)] x 10,000
    let bmi = (values.weight/values.height/values.height)* 10000
    bmi = bmi.toFixed(2);
    console.log("bmi ",bmi);
    return bmi
  }

  function getBMIResults(values){
    let bmi = calculateBMI(values)
    let bmiResults = {
      label: '',
      value: '',
      alertClass: '',
    };
    if (bmi <= 18.5){
      bmiResults.label = t('Underweight');
      bmiResults.value = bmi;
      bmiResults.alertClass = 'alert-danger';
    }
    else if (bmi >= 18.5 && bmi <= 24.9) {
      bmiResults.label = t('Normal weight');
      bmiResults.value = bmi;
      bmiResults.alertClass = 'alert-success';
    }
    else if (bmi >= 24.9 && bmi <= 29.9){
      bmiResults.label = t('Overweight');
      bmiResults.value = bmi;
      bmiResults.alertClass = 'alert-warning';
    }
    else if (bmi >= 29.9) {
      bmiResults.label = t('Obesity');
      bmiResults.value = bmi;
      bmiResults.alertClass = 'alert-primary';
    } else {
      bmiResults.label = t('Obesity');
      bmiResults.value = bmi;
      bmiResults.alertClass = 'alert-primary';
    }
    // setchartData([
    //     ['Underweight', 18.4],
    //     ['Normal weight', 24.9],
    //     ['Overweight', 29.9],
    //     ['Obesity', 40]
    // ])
    setVisible(true)
    return bmiResults;
  }

  const GetDataForChart = (data) => { 
    console.log("data",data,bmiresult); 
  let bmiVal = bmiresult && bmiresult.value ? bmiresult.value : t("N/A")
  return semiPieConf(data,t("BMI")+" <br/>"+bmiVal);
};

  const renderChart = (chartData) => {
    return(
      <ChartComponent
          options={GetDataForChart(chartData)}
          styleObj={styleObject}
          //style={{ overflow: "scroll" }}
      />
    )
  }

  const regex = new RegExp("^[a-zA-Z0-9_@.]*$")
  const scriptBlockRegex = new RegExp("/<[^>]*>/g")
  const required = value => (value ? undefined : 'Required')
  const scriptCheck = value => (value ? value.match(scriptBlockRegex) != null ? 'Incorrect expression "< or >" added as input' : undefined : undefined)
  const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)

  return (
    <div className={Globalclasses.container}>
      <main
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
         <FooterMenu></FooterMenu>
        <section
          className="bmiCalculatePage"
          style={{
            // backgroundColor: "#fff",
            flexGrow: 1,
            padding: 0,
          }}
        >
   
    {/* <Paper
      sx={{
        p: 2,
        margin: 'auto 10px',
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
      style={{margin:"0px 10px"}}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography variant="body2" gutterBottom>
                Name:{fullName}
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Age: {age}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gender: {gender}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper> */
    
    }
    {/* <Grid container spacing={1} className="cardGridDivStart">
      <Grid item xs={12} sm={6} md={6} spacing={2}>
          <Card className={classes.root}>
          <CardHeader className="casescardheader" title="User Details"></CardHeader>
          <CardContent>
          <Typography variant="body2" gutterBottom>
                Name: {fullName}
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Age: {age}
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Gender: {gender}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone Number: {regPhoneNumber}
              </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={6} spacing={2}>
      <Card className={classes.root}>
         <CardHeader className="casescardheader" title="BMI Categories"></CardHeader>
          <CardContent>
              <Typography variant="body2" gutterBottom>
                Underweight: less than 18.5
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
               Normal weight: 18.5 – 24.9
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Overweight: 25 – 29.9
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overweight: BMI of 30 or greater
              </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid> */}

    
    <Grid container spacing={1} className="cardGridDivStart">
      <Grid item xs={12} sm={6} md={6} spacing={1}>
      <div className="widget-heading"><h3 style={{textAlign:"left"}}>{t("BMI Calculator")}</h3></div>
          <Form
              autocomplete="off"
                  onSubmit={values => onSubmit(values, null, 2)}
                  initialValues={initialValues}
                  render={({ handleSubmit, form, submitting, pristine, values }) => (
                      <form onSubmit={handleSubmit} autocomplete="off" style={{display: 'contents'}}>
                          <div className="w-100">
                           <Field
                            name='name'
                            label={t('Name')}
                            component={InputFieldFF}
                            type='text'
                            key='name'
                            // validate={composeValidators(required, scriptCheck)}
                            // required
                            disabled={fullName ? true : false}
                            />
                          </div>
                          <div className="w-100">
                           <Field
                            name='age'
                            label={t('Age')}
                            component={InputFieldFF}
                            type='number'
                            key='age'
                            // validate={composeValidators(required, scriptCheck)}
                            // required
                            disabled={age ? true : false}
                            />
                          </div>
                          <div className="w-100">
                              <Field
                                  name='height'
                                  label={t('Height')}
                                  type='number'
                                  component={InputFieldFF}
                                  key='height'
                                  validate={composeValidators(required,scriptCheck)}
                                  required
                                  placeholder="cm"

                              />
                              {/* <span className="shift-left">{"cm"}</span> */}
                          </div>
                          <div className="w-100">
                              <Field
                                  name='weight'
                                  label={t('Weight')}
                                  component={InputFieldFF}
                                  type='number'
                                  key='weight'
                                  validate={composeValidators(required,scriptCheck)}
                                  required
                                  placeholder="kg"

                              />
                              {/* <span className="shift-left">{"kg"}</span> */}
                          </div>
                          {/* <div className="w-100">
                          <Radios
                                label='Gender'
                                name='gender'
                                required={true}
                                data={[{'label':'Male','value':'Male'},{'label':'Female','value':'Female'}]}
                            // defaultValue={defaultValue}
                            />
                          </div> */}
                          <div className="" style={{margin:"20px auto",color:"#fff",textAlign:"center"}}>
                              <Button
                                  type="submit"
                                  disabled={submitting}
                                  className="generic-btn"
                              >
                                  {t("Calculate")}
                              </Button>

                          </div>
                      </form>
                  )}
          />
          {!visible && bmiresult && bmiresult.label && window.cordova?
          <div className="center-box">
            <h3>{t("BMI")}: <span className={bmiresult.alertClass}>{bmiresult.label} ({bmiresult.value} {t("kg/m2")})</span></h3>
          </div>
          :''}
      </Grid>
      {
          !window.cordova ?
            <Grid item xs={12} sm={6} md={6} spacing={1} style={{paddingTop:"80px"}}>
              {chartData != null && initialValues != null ? 
              renderChart(chartData)
              :<></>}
            </Grid>
            :<></>
      }
        {!visible && bmiresult && bmiresult.label && !window.cordova?
        <div className="center-box">
          <h3>{t("BMI")}: <span className={bmiresult.alertClass}>{bmiresult.label} ({bmiresult.value} {t("kg/m2")})</span></h3>
        </div>
        :''}
        {
          window.cordova ?
          <Grid container spacing={0} xs={12} lg={12}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
              {chartData != null && initialValues != null ? 
                renderChart(chartData)
            :<></>}
            </Grid>
          </Grid>
      :
      ''
        }

    <Popup className={window.cordova ? "animated-popup" : "animated-popup popup-width" } id="animated-popup" visible={visible} onClose={() => setVisible(false)}>
        <div className="bmibg"></div>
        <h1 align="center" className="popupbmi-title mT5 mTB">{t("Your BMI")}</h1>
        <h1 className={bmiresult && bmiresult.alertClass+ " mT5 mTB"}><p align="center" className="popupbmi-result">{bmiresult && bmiresult.value}</p></h1>
        <h3 className="mT5">{bmiresult && <p align="center" className={bmiresult.alertClass + " mT5 mTB"}>{bmiresult.label}</p>}</h3>
        <p align="center" className="mT0 mB0"><Button className="popup-btn" align="center" variant="contained" color="success" onClick={() => setVisible(false)}>{t("OK")}</Button></p>
      </Popup>
    </Grid>
    </section>
    </main>
    </div>
  );
};

export default BMICalculator;
