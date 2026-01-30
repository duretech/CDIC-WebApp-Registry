import React, { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import Grid from "@material-ui/core/Grid";
import Globalclasses from "../App.module.css";
import "../assets/css/customstyles.css";
import Typography from '@material-ui/core/Typography';
import { apiServices } from "../services/apiServices";
import { CircularLoader, CenteredContent } from "@dhis2/ui";
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
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { columnConfig, pieConf, semiPieConf } from "../component/highchart/chartconfig";
import ChartComponent from "../component/highchart/ChartComponent";
import moment from "moment";
//import LinearProgress, { linearProgressClasses } from '@material-ui/core/Progress';
import LinearProgress, { linearProgressClasses } from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
//import SportsScoreIcon from '@material-ui/icons/SportsScore';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
      "& .MuiLinearProgress-colorPrimary": {
          backgroundColor: "#ccc",
      },
      "& .MuiLinearProgress-barColorPrimary": {
          backgroundColor: "#1a90ff",
      },
      "& .MuiLinearProgress-root": {
        borderRadius: 5,
        height: 20,
    },

    
  },
 
}));

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '30px',
  maxHeight: '30px',
});

const styles = props => ({
  colorPrimary: {
    backgroundColor: '#00695C',
  },
  barColorPrimary: {
    backgroundColor: '#B2DFDB',
  }
});

function LinearProgressWithLabel(props) {
  const { t } = useTranslation();
  return (
    <>
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth:500, margin:' 0px auto', marginTop:'10px' }}>
      <Box sx={{ width: '100%', maxWidth:500, mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }} className="end-box">
        {/* <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography> */}
        {/* <image src={"../../images/racing-flag.png"} width="20" /> */}
      </Box>
    </Box>
    <Box sx={{ alignItems: 'center', width: '100%', maxWidth:500, margin:' 0px auto',textAlign:"center" }}>
      {
      props.value ?
      <Typography variant="body2" color="text.secondary">{t("Congratulations! You have completed")} <span className="treatement-status-score">{`${Math.round(props.value,)}%`}</span> {t("of your treatment journey")}.</Typography>
      : ''
      }   
    </Box>
  </>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const TreatmentStatus = () => {
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
  const [regPhoneNumberId, setRegPhoneNumberId] = useState(false);
  const [regPhoneNumber, setRegPhoneNumber] = useState(false);
  const [dateMedicineTakenId, setDateMedicineTakenId] = useState(null)
  const [medicineTakenId, setMedicineTakenId] = useState(null)
  const [treatmentStartDateId, setTreatmentStartDateId] = useState(null)
  const [treatmentEndDateId, setTreatmentEndDateId] = useState(null)
  const [adherenceStageId, setAdherenceStageId] = useState(null)
  const [regimenStageId, setregimenStageId] = useState(null)
  const [startDateVal, sestartDateVal] = useState(null)
  const [endDateVal, setendDateVal] = useState(null)
  const [daysRemaining, setDaysRemaining] = useState(null)
  const [daysPassed, setDaysPassed] = useState(null)
  const [totalDays, setTotalDays] = useState(null)
  const [adherenceDateWiseData, setAdherenceDateWiseData] = useState(null)
  const [chartData, setchartData] = useState(null)
  const [progress, setProgress] = React.useState(0);
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    // [`&.${linearProgressClasses.colorPrimary}`]: {
    //   backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    // },
    // [`& .${linearProgressClasses.bar}`]: {
    //   borderRadius: 5,
    //   backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    // },
  }));

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
    if (adherenceDateWiseData != null)  {
        getAdherenceStatus()
    }
  }, [adherenceDateWiseData]);


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

    progarmData.programs[0].programStages.map((stage) => {
      let stageName = stage.description ? stage.description : stage.displayName;
      stage.programStageDataElements.map((de) => {
        let fieldname = de.dataElement.description ? de.dataElement.description : de.dataElement.formName ? de.dataElement.formName : de.dataElement.displayName
        if (fieldname) {
        }
      })
      stage.attributeValues.map((val) => {
        if (val.attribute.displayName === "Regimen" && val.value == "true") {
          setregimenStageId(stage.id)
        }
        else if (val.attribute.displayName === "showFullCalender" && val.value == "true") {
          setAdherenceStageId(stage.id)
        }
        stage.programStageDataElements.map(field => {
          let fieldname = field.dataElement.description ? field.dataElement.description : field.dataElement.formName ? field.dataElement.formName : field.dataElement.displayName
          if (fieldname.trim().toLocaleLowerCase() == "date medicine taken") {
              setDateMedicineTakenId(field.dataElement.id)
          }
          if (fieldname.trim().toLocaleLowerCase() == "medicine taken") {
              setMedicineTakenId(field.dataElement.id)
          }
          if (fieldname.trim().toLocaleLowerCase() == "treatment start date") {
            setTreatmentStartDateId(field.dataElement.id)
          }
          if (fieldname.trim().toLocaleLowerCase() == "treatment end date") {
              setTreatmentEndDateId(field.dataElement.id)
          }
      })
      })
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
                      try{
                        trackentityInstanceData.data.enrollments.map(enrollment => {
                          let adherenceData = []
                          enrollment.events.map(event => {
                              if(event.programStage == regimenStageId){
                                let startDate = _.find(event.dataValues,{dataElement:treatmentStartDateId}) ? _.find(event.dataValues,{dataElement:treatmentStartDateId}).value : null
                                sestartDateVal(startDate)
                                let endDate = _.find(event.dataValues,{dataElement:treatmentEndDateId}) ? _.find(event.dataValues,{dataElement:treatmentEndDateId}).value : null
                                setendDateVal(endDate)
                                /* Later need remove this logic*/
                                if(startDate && endDate){
                                  let dt2 = new Date(endDate);
                                  let dt1 = new Date();
                                  var a = moment(dt2);
                                  var b = moment(dt1);
                                  var days = a.diff(b, 'days')
                                  setDaysRemaining(days)
                                  if(new Date(endDate) < new Date()){
                                    setDaysRemaining(0)
                                  }

                                  let dt4 = new Date(endDate);
                                  let dt3 = new Date(startDate);
                                  var c = moment(dt4);
                                  var d = moment(dt3);
                                  var daysT = c.diff(d, 'days')
                                  let obj = {}
                                  for(let i = 0; i < (daysT - days); i++){
                                    obj["days"] = i
                                    adherenceData.push(obj)
                                  }
                                  /* end Later need remove this logic*/
                                }
                                setAdherenceDateWiseData(adherenceData) //end Later need remove this logic
                              }
                              // if(event.programStage == adherenceStageId){
                              //   let eventExist = _.find(event.dataValues,{dataElement:medicineTakenId})
                              //   // let filtered_array = _.filter(
                              //   //   eventExist.dataValues, function(o) {
                              //   //      return o.value == 'yes';
                              //   //   }
                              //   // );
                              //   if(eventExist){
                              //     let obj = {}
                              //     event.dataValues.map(dataValue => {
                              //       obj[dataValue.dataElement] = dataValue.value
                              //     })
                              //     adherenceData.push(obj)
                              //   }
                              // }
                          })
                          //setAdherenceDateWiseData(adherenceData)
                        })
                      }catch(e){
                        console.log("error ",e)
                      }
                  } else {

                  }

              }).catch(err => {
                  setGlobalSpinner(false)
              })
        }
    }catch(e){

    }
  }

  function getAdherenceStatus(){
    try{
      if(adherenceDateWiseData && adherenceDateWiseData.length > 0){
        let endDate = new Date(endDateVal);
        let currentDate = new Date();
        if(endDateVal){
          let dt2 = new Date(endDateVal);
          let dt1 = new Date(startDateVal);
          var a = moment(dt2);
          var b = moment(dt1);
          var days = a.diff(b, 'days')
          setTotalDays(days)
          setDaysPassed(days - daysRemaining)
          // if(days){
          //   setDaysRemaining(days - adherenceDateWiseData.length)
          // }

          let medicineStatusNotAdded =  days ? Number((((days - adherenceDateWiseData.length)/days)*100).toFixed(2)) : 0 ;
          let medicineStatusAdded =  medicineStatusNotAdded ? Number((100 - medicineStatusNotAdded).toFixed(2)) : 0
          console.log("days ",days,medicineStatusNotAdded,adherenceDateWiseData.length)
          setchartData([
            {
              name: 'Pending Status',
              y: medicineStatusNotAdded
            },
            {
              name: 'Completion Status',
              y: medicineStatusAdded
            }
          ])

          if(medicineStatusAdded ){
            console.log("medicineStatusAdded ",medicineStatusAdded)
            setProgress(medicineStatusAdded)
          }else if((dt2 && dt2 < currentDate)){
            setProgress(100)
          }
        }
      }
    }catch(e){

    }
  }
  const handleViewChange = (event, newValue) => {
    setViweType(newValue);
  };

  const GetDataForChart = (data) => {
    console.log("data",data);
    let textVal = data && data.length > 1 ?(data[1]['y']) + "%" : 0;
    return pieConf(data,textVal);
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
          className=" searchcustombg searchtabmaindiv searchformcontainer alertspage treatmentStatusPage"
          style={{
            // backgroundColor: "#fff",
            flexGrow: 1,
            padding: 0,
          }}
        >
    <FooterMenu></FooterMenu>
    <Grid container spacing={1} className="cardGridDivStart">
      <Grid item xs={12} sm={12} md={12} spacing={1}>
          <Card className={classes.root}>
         
          <CardHeader className="casescardheader" title={t("Patient Treatment Details")}></CardHeader>
          <CardContent>
         
              <Typography variant="body2" gutterBottom className="statussection">
              {window.cordova ?
                <img src={"../../images/user.png"} className="statusprofile" />
                :
                <img src={imgUrl.newprofile} className="statusprofile" />
              }
              <span className="statusname"><span className="spanname"> {t("Name")} : </span>  {fullName} </span>
              </Typography>
              <Typography variant="body2" gutterBottom>
              <span className="spanname">  {t("Treatment Initiation Date")} : </span> {startDateVal ? moment(startDateVal).format('MM-DD-YYYY') : 'N/A'}
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
              <span className="spanname"> Treatment Completion Date : </span>   {endDateVal ? moment(endDateVal).format('MM-DD-YYYY') : 'N/A'}
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
              <span className="spanname">  {t("Days Remaining")} : </span> {daysRemaining ? daysRemaining : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              <span className="spanname"> {t("Days Lapsed")} : </span>   {daysPassed ? daysPassed : 'N/A'}
              </Typography>
              {/* <Typography variant="body2" gutterBottom color="text.secondary">
                Age: {age}
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Gender: {gender}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone Number: {regPhoneNumber}
              </Typography> */}
          </CardContent>
        </Card>
      </Grid>
      {/* <Grid item xs={12} sm={6} md={6} spacing={2}>
      <Card className={classes.root}>
         <CardHeader className="casescardheader" title="Treatment Initiation Details"></CardHeader>
          <CardContent>
              <Typography variant="body2" gutterBottom>
                Treatment Initiation Date: {startDateVal ? moment(startDateVal).format('MM-DD-YYYY') : 'N/A'}
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
              Treatment Completion Date: {endDateVal ? moment(endDateVal).format('MM-DD-YYYY') : 'N/A'}
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Days Remaining: {daysRemaining ? daysRemaining : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days Lapsed: {daysPassed ? daysPassed : 'N/A'}
              </Typography>
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
    <br></br>
    <div className="widget-heading"><h3>{t("Treatment Status")}</h3></div>
    <Grid container spacing={0} xs={12} lg={12}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {/* {chartData != null ?
                renderChart(chartData)
              :<></>} */}
              {/* <BorderLinearProgress variant="determinate" value={50} />
              <br></br>
              <LinearProgress sx={{
                  backgroundColor: 'white',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'green'
                  }
                }}
                variant="determinate"
                value={10}/>
                <br></br> */}
                <div className={classes.root}>
                    <LinearProgressWithLabel
                    variant="determinate"
                    value={progress}/>
                </div>
          </Grid>
        </Grid>
    </section>
    </main>
    </div>
  );
};

export default TreatmentStatus;
