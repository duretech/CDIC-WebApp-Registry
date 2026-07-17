import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { apiServices } from '../../services/apiServices'
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setTrackedEntityInstanceAction } from "../../redux/actions/action"
import axios from "axios";
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EventNoteIcon from '@material-ui/icons/EventNote';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import GetAppIcon from '@material-ui/icons/GetApp';
import GroupIcon from '@material-ui/icons/Group';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';
import Customcaseslist from './Customcaseslist.js';
import OfflineDb from '../../db'
import { useSelector, useDispatch } from "react-redux"
import { Button } from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';
//import { Configuration } from '../../assets/data/config'
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'
import '../../assets/css/customstyles.css'

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TextField from '@material-ui/core/TextField';
import PortraitIcon from '@material-ui/icons/Portrait';
import CloseIcon from '@material-ui/icons/Close';
import PersonIcon from '@material-ui/icons/Person';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import { Link } from "react-router-dom";
import PatientCard from '../patientcard/PatientCard';
import html2canvas from 'html2canvas';
import { setLocationAction } from "../../redux/actions/action"
import CVDCalculator from '../../component/CVDCalculator/CVDCalculator';
import _ from 'lodash'
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: '0 auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function CustomeCaseCard(row) {
  const history = useHistory();
  const { t } = useTranslation();

  const [headers] = React.useState(row.searchHeader)
  const findIndexOfClientType = headers.findIndex(obj => obj.column.trim().toLocaleLowerCase() == "client type")
  // const findIndexOfName = headers.findIndex(obj => obj.column.trim().toLocaleLowerCase() == "first name")
  const findIndexOfName = headers.findIndex(obj => obj.column.trim().toLocaleLowerCase() == "first name")
  const clientType = row.row[findIndexOfClientType] ? row.row[findIndexOfClientType] : ""
  const clientTypeId = headers[findIndexOfClientType] ? headers[findIndexOfClientType].name : '';
  const clietName = row.row[findIndexOfName] ? row.row[findIndexOfName] : ""
  const findIndexOfAddress = headers.findIndex(obj => obj.column.trim().toLocaleLowerCase() == "patient address")
  const regAddressId = headers[findIndexOfAddress] ? headers[findIndexOfAddress].name : '';
  const patientaddress = row.row[findIndexOfAddress] ? row.row[findIndexOfAddress] : ""
  const findIndexOfAddressLocation = headers.findIndex(obj => obj.column.trim().toLocaleLowerCase() == "addresslocation")
  const addressLocationId = headers[findIndexOfAddressLocation] ? headers[findIndexOfAddressLocation].name : '';
  const addressLocation = row.row[findIndexOfAddressLocation] ? row.row[findIndexOfAddressLocation] : ""
  const findIndexOfAge = headers.findIndex(obj => obj.column.trim().toLocaleLowerCase() == "age")
  const age = row.row[findIndexOfAge] ? row.row[findIndexOfAge] : ""
  const findIndexOfGender = headers.findIndex(obj => obj.column.trim().toLocaleLowerCase() == "gender")
  const gender = row.row[findIndexOfGender] ? row.row[findIndexOfGender] : ""
  //const [vType] = useState(row.viewType)
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [UserBO, setUserBO] = useState(null);
  const [metaData, setMetaData] = useState(null)
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  //redux state selector and dispatch action
  const postResgistrationResponse = useSelector(state => state.postResgistrationResponse);
  const dispatch = useDispatch();
  const [Configuration, setConfiguration] = useState(null);
  const [openPatientCard, setOpenPatientCard] = useState(null);
  const [openCVDRisk, setopenCVDRisk] = useState(null);
  const [smokingId, setsmokingId] = useState(null);
  const [smoking, setsmoking] = useState(null);
  const [diabetesId, setdiabetesId] = useState(null);
  const [diabetes, setdiabetes] = useState(null);
  const [systolicBloodPressureId, setsystolicBloodPressureId] = useState(null);
  const [systolicBloodPressure, setsystolicBloodPressure] = useState(null);
  const [totalCholesterolId, settotalCholesterolId] = useState(null);
  const [totalCholesterol, settotalCholesterol] = useState(null);
  const [hdlCholesterolId, sethdlCholesterolId] = useState(null);
  const [hdlCholesterol, sethdlCholesterol] = useState(null);
  const [screeningstageId, setscreeningstageId] = useState(null);
  const [advancedinvestigationstageId, setadvancedinvestigationstageId] = useState(null);
  const [patientProfileStageId, setPatientProfileStageId] = useState(null);
  const [currentVisitStageId, setCurrentVisitStageId] = useState(null);
  async function getUserBO() {
    // let userdata = await OfflineDb.getDataFromPouchDB('loginDetails');
    // setUserBO(userdata.data)

    // let metaData = await OfflineDb.getDataFromPouchDB('metaData');
    // setMetaData(metaData.data)

    let configurations = await OfflineDb.getDataFromPouchDB('configurations')
    setConfiguration(configurations.data.configuration)
  }


  useEffect(() => {
    getUserBO();
    try {
      row.setTrackedEntityInstanceAction(null)
      getCustomVariableIds()
    } catch (e) {
      console.log(e);
    }
  }, [])

  const getCustomVariableIds = () => {
    try {
      row.metaData.programs[0].programStages.map((stage) => {
        let stageName = stage.description ? stage.description : stage.displayName;
        if (stageName.trim() == "History & Screening") {
          setscreeningstageId(stage.id);
        }
        if (stageName.trim() == "Advanced Investigations") {
          setadvancedinvestigationstageId(stage.id);
        }
        if (stageName.trim() == "Patient Dashboard") {
          setPatientProfileStageId(stage.id);
        }
        if (stageName.trim() == "Examination") {
          setCurrentVisitStageId(stage.id);
        }
        stage.programStageDataElements.map((de) => {
          let fieldname = de.dataElement.description ? de.dataElement.description : de.dataElement.formName ? de.dataElement.formName : de.dataElement.displayName
          if (fieldname) {
            if (fieldname.trim() == "Tobacco use - Smoking") {
              setsmokingId(de.dataElement.id);
            }
            if (fieldname.trim() == "History of Diabetes") {
              setdiabetesId(de.dataElement.id);
            }
            if (fieldname.trim() == "SBP at Registration") {
              setsystolicBloodPressureId(de.dataElement.id);
            }
            if (fieldname.trim() == "Total Cholesterol (mg/dl)") {
              settotalCholesterolId(de.dataElement.id);
            }
            if (fieldname.trim() == "HDL Cholesterol (mg/dl)") {
              sethdlCholesterolId(de.dataElement.id);
            }
          }
        })
      })
    } catch (e) {

    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const seeIndividualRecordClick = () => {


    // localStorage.setItem('trackedEntityInstance', row.row[0])
    // localStorage.setItem('linkContact', false)
    // localStorage.setItem('hidebutton', true)

    // setAnchorEl(null);
    // setGlobalSpinner(true)
    // console.log("1211")
    // history.push('/layout/individualrecord', { 'trackedEntityInstance': row.row[0],
    // name: row.row[findIndexOfName],
    // age: row.row[findIndexOfAge],
    // gender: row.row[findIndexOfGender] });


    setGlobalSpinner(true);

    const formDataMassaged = {};
    const activeCaseDetails = {
      trackedEntityInstance: row.row[0],
      enrollmentId: "",
      type: "case",
      //   "stageinstanceuid": PropsArray.stageinstanceuid,
      "stageuid": patientProfileStageId || "MiH09cnBLda"
    };
    const activeCaseFormData = {
      formFormat: null, //formDataMassaged,
      dhisFormat: null,
    };
    const linkContact = {
      enabled: false,
      linkTrackedEntityInstance: row.row[0],
    };
    OfflineDb.setDataIntoPouchDB("activeCaseDetails", activeCaseDetails);
    OfflineDb.setDataIntoPouchDB("linkContactFlag", linkContact);
    setGlobalSpinner(false);
    history.push("/layout/registration");
  }

  const addContcat = () => {

    const activeCaseFormData = {
      'formFormat': {
        [clientTypeId]: Configuration.ltbiLinkVariables.contact,
        [addressLocationId]: addressLocation,
        [regAddressId]: patientaddress
      },
      'dhisFormat': null
    }
    const linkContact = {
      "enabled": true,
      "linkTrackedEntityInstance": row.row[0]
    }
    //OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
    OfflineDb.setDataIntoPouchDB('activeCaseFormData', activeCaseFormData)
    OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
    history.push('/layout/registration')
  }

  function UpdateRecordClickFollowup() {
    // setGlobalSpinner(true)
    // row.setLocationAction(null)
    // if(row.searchFilter) {// ONLY FOR SPECIMEN SEARCH
    //   localStorage.setItem('specimen', JSON.stringify(row.searchFilter))
    // }
    // const formDataMassaged = {}

    // row.metaData.programs[0].programTrackedEntityAttributes.map(field => {
    //   const fieldId = field.trackedEntityAttribute.id
    //   const fieldValue = row.row[row.searchHeader.findIndex(obj => obj.name == field.trackedEntityAttribute.id)]


    //   formDataMassaged[fieldId]= fieldValue
    // })
    // const activeCaseDetails = {
    //   'trackedEntityInstance': row.row[0],
    //   'enrollmentId': "",
    // }
    // const activeCaseFormData = {
    //   'formFormat': null, //formDataMassaged,
    //   'dhisFormat': null
    // }
    // const linkContact = {
    //   "enabled": false,
    //   "linkTrackedEntityInstance": row.row[0]
    // }
    // if(window.document.body.clientWidth < 800 || window.cordova || (row.caseModule && row.caseModule == "Search")) {
    //     OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
    //     OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
    //     localStorage.setItem("stagesShow",true);
    //     history.push('/layout/registration')
    // }else{
    //   let p = []
    //   p.push(OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails))
    //   p.push(OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact))
    //   Promise.all([...p]).then(res=>{
    //     setGlobalSpinner(false)
    //     row.setTrackedEntityInstanceAction(row.row[0])
    //   })
    // }

    setGlobalSpinner(true);

    const formDataMassaged = {};
    const activeCaseDetails = {
      trackedEntityInstance: row.row[0],
      enrollmentId: "",
      type: "case",
      //   "stageinstanceuid": PropsArray.stageinstanceuid,
      "stageuid": currentVisitStageId || "abbLBsRGdfM",
      redirectionTrue: true,
    };
    const activeCaseFormData = {
      formFormat: null, //formDataMassaged,
      dhisFormat: null,
    };
    const linkContact = {
      enabled: false,
      linkTrackedEntityInstance: row.row[0],
    };
    OfflineDb.setDataIntoPouchDB("activeCaseDetails", activeCaseDetails);
    OfflineDb.setDataIntoPouchDB("linkContactFlag", linkContact);
    sessionStorage.setItem("fromDirectToExamination", "true");
    localStorage.setItem("Followup",true)
    setGlobalSpinner(false);
    history.push("/layout/registration");
  }

  function UpdateRecordClick() {
    setGlobalSpinner(true)
    row.setLocationAction(null)
    if (row.searchFilter) {// ONLY FOR SPECIMEN SEARCH
      localStorage.setItem('specimen', JSON.stringify(row.searchFilter))
    }
    const formDataMassaged = {}

    row.metaData.programs[0].programTrackedEntityAttributes.map(field => {
      const fieldId = field.trackedEntityAttribute.id
      const fieldValue = row.row[row.searchHeader.findIndex(obj => obj.name == field.trackedEntityAttribute.id)]


      formDataMassaged[fieldId] = fieldValue
    })
    const activeCaseDetails = {
      'trackedEntityInstance': row.row[0],
      'enrollmentId': "",
    }
    const activeCaseFormData = {
      'formFormat': null, //formDataMassaged,
      'dhisFormat': null
    }
    const linkContact = {
      "enabled": false,
      "linkTrackedEntityInstance": row.row[0]
    }
    if (window.document.body.clientWidth < 800 || window.cordova || (row.caseModule && row.caseModule == "Search")) {
      OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
      OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
      localStorage.setItem("stagesShow", true);
      history.push('/layout/registration')
    } else {
      let p = []
      p.push(OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails))
      p.push(OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact))
      Promise.all([...p]).then(res => {
        setGlobalSpinner(false)
        row.setTrackedEntityInstanceAction(row.row[0])
      })
    }
    //OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
    // OfflineDb.setDataIntoPouchDB('activeCaseFormData', activeCaseFormData)
    //OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)


    //history.push('/layout/registration')

    // localStorage.setItem('trackedEntityInstance', row.row[0])
    // localStorage.setItem('linkContact', false)
    // dispatch({
    //   type:"REGISTRATION_RESPONSE_SAVE",
    //   payload:{
    //     'trackedEntityInstance': row.row[0],
    //     'enrollmentId': '',
    //     'showStage': true,
    //     'individualList': ""
    //   }
    // })
    // setAnchorEl(null);
    // history.push('/layout/registration');

    /* ---------------old code commented for customisation-------------- 

    const getChildrenById = (relationshipsArr, programid) => {
      let p = [];
      //this.setState({ loading: true });
      relationshipsArr.map((relobj) => {
        let url = `trackedEntityInstances/${relobj.to.trackedEntityInstance.trackedEntityInstance}.json?program=${programid}&fields=*?`;
        p.push(apiServices.getAPI(url));
      });

      return Promise.all([...p]).then(([...res]) => {
        let childrenArr = [...res];
        //this.setState({ loading: false });
        
        row.setPostResgistrationResponse({
          'trackedEntityInstance': row.row[0],
          'enrollmentId': '',
          'showStage': true,
          'individualList': childrenArr
        })
        history.push('/layout/registration');
      });
    }

    localStorage.setItem('trackedEntityInstance', row.row[0])
    localStorage.setItem('linkContact', false)



    //const UserBO = JSON.parse(localStorage.getItem('userBO'));    

    
    let orgID = UserBO.organisationUnits[0].id,
      programID = UserBO.programs[0],
      url = `trackedEntityInstances/${row.row[0]}.json?program=${programID}&fields=relationships`;
    
    if (clientType == 'Household') {
      apiServices.getAPI(url).then(res => {

        
        getChildrenById(res.data.relationships, programID)


      })
    } else {
      row.setPostResgistrationResponse({
        'trackedEntityInstance': row.row[0],
        'enrollmentId': '',
        'showStage': true
      })
      history.push('/layout/registration');
    }
    setAnchorEl(null);*/
  }

  const getCVDRisk = () => {
    // const age = 50;
    // const gender = "male"; // Use "female" for female
    // const smoking = 1; // 1 for smokers, 0 for non-smokers
    // const diabetes = 0; // 1 for individuals with diabetes, 0 for non-diabetics
    // const systolicBloodPressure = 130;
    // const totalCholesterol = 200;
    // const hdlCholesterol = 50;
    // setopenCVDRisk(true)
    //return <CVDCalculator age={age} gender={gender} smoking={smoking} diabetes={diabetes} systolicBloodPressure={systolicBloodPressure} totalCholesterol={totalCholesterol} hdlCholesterol={hdlCholesterol} />
    try {
      setsmoking(null)
      setdiabetes(null)
      setsystolicBloodPressure(null)
      sethdlCholesterol(null)
      settotalCholesterol(null)
      setGlobalSpinner(true)
      const getURL = 'trackedEntityInstances/' + row.row[0] + '.json?program=' + row.metaData.programs[0].id + '&fields=*?'
      apiServices.getAPI(getURL)
        .then(res => {
          setGlobalSpinner(false)
          let allEvents = res.data.enrollments[0].events
          let screeningStage = _.filter(allEvents, { programStage: screeningstageId })
          let investigationStage = _.filter(allEvents, { programStage: advancedinvestigationstageId })
          if (screeningStage.length > 0) {
            let dataValues = screeningStage[screeningStage.length - 1].dataValues
            let smokingVal = _.find(dataValues, { dataElement: smokingId }) ? _.find(dataValues, { dataElement: smokingId }).value && _.find(dataValues, { dataElement: smokingId }).value == 'Yes' ? 1 : 0 : null
            let diabetesVal = _.find(dataValues, { dataElement: diabetesId }) ? _.find(dataValues, { dataElement: diabetesId }).value && (_.find(dataValues, { dataElement: diabetesId }).value == '1' || _.find(dataValues, { dataElement: diabetesId }).value == '2') ? 1 : 0 : null
            let sbpVal = _.find(dataValues, { dataElement: systolicBloodPressureId }) ? _.find(dataValues, { dataElement: systolicBloodPressureId }).value : null
            setsmoking(smokingVal)
            setdiabetes(diabetesVal)
            setsystolicBloodPressure(sbpVal)
          }
          if (investigationStage.length > 0) {
            let investigationStagedataValues = investigationStage[investigationStage.length - 1].dataValues
            let totalCholesterolVal = _.find(investigationStagedataValues, { dataElement: totalCholesterolId }) ? _.find(investigationStagedataValues, { dataElement: totalCholesterolId }).value : null
            let hdlCholesterolVal = _.find(investigationStagedataValues, { dataElement: hdlCholesterolId }) ? _.find(investigationStagedataValues, { dataElement: hdlCholesterolId }).value : null
            sethdlCholesterol(hdlCholesterolVal)
            settotalCholesterol(totalCholesterolVal)
          }
          setTimeout(function () {
            setopenCVDRisk(true)
          }, 500)
        })
    } catch (e) {

    }
  }

  function getPatientCard() {
    //history.push('/layout/patientcard',{"trackedEntityInstance": row.row[0]})
    setOpenPatientCard(true)
  }

  function printQRCards() {

    var contents = document.getElementById("printQRDiv").innerHTML;
    var frame1 = document.createElement('iframe');
    frame1.name = "frame1";
    frame1.style.position = "absolute";
    // frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);
    var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write(`<html><head><title>Patient Card</title>`);
    frameDoc.document.write(`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
    </head><body>`);
    //frameDoc.document.write('<link href="../assets/css/card.css" rel="stylesheet" type="print" />');
    frameDoc.document.write(contents);
    frameDoc.document.write(`</body>
    <style>
        @media print {
            .makeStyles-root-38 {
                width: 100%;
                max-width: 500px;
            }

            .MuiAvatar-root{
              border-radius: 0;
              width: 100px;
              height: 100px;
              margin-right: 20px;
          }

            .MuiCard-root{
                border: 1px solid #ccc; !important;
            }

            .MuiGrid-container{
                display: flex;
                flex-wrap: wrap;
                box-sizing: border-box;
            }

            .MuiCardHeader-root {
                display: flex;
                padding: 16px;
                align-items: center;
            }

            .MuiCardHeader-avatar {
                flex: 0 0 auto;
                margin-right: 16px;
            }
            .MuiCardHeader-content span {
                color: #000;
                font-size: 20px;
                font-weight: bold;
            }

            .logobg {
                  width: 100px;
                  height: 100px;
                  background-repeat: no-repeat;
                  background-size: contain;
                  margin-top: 31px;
            }
            .alerts_description_fields {
                padding-left: 5px;
            }
            .MuiTypography-displayBlock {
                display: block;
            }
            .MuiTypography-body2 {
                
                // font-family: IBM Plex Sans;
                
                line-height: 1.43;
            }

            .MuiCardHeader-subheader {
                font-size: 14px !important;
                color: gray !important;
            }
            .MuiCardContent-root {
                padding: 16px;
            }

            .MuiCardContent-root:last-child {
                padding-bottom: 24px;
            }

            .pT0 {
                padding-top: 0px !important;
            }

            .alerts_description_fields{
                font-size: 20px;
            }

            .alerts_description_fields {
                font-size: 0.875rem;
                // font-family: IBM Plex Sans;
                font-weight: 400;
                line-height: 1.43;
                color: #212529;
                margin: 10px 0px;
            }

            .alerts_description_fields{
                font-size: 20px;
            }
            // body, .MuiTypography, button, .MuiTypography-body1 {
            //     font-family: 'Open Sans', sans-serif !important;
            // }

            .MuiGrid-spacing-xs-3 {
                width: calc(100% + 24px);
                margin: -12px;
            }

            .MuiGrid-container {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                box-sizing: border-box;
            }

            .MuiGrid-grid-sm-8 {
                flex-grow: 0;
                max-width: 66.666667%;
                flex-basis: 66.666667%;
            }

            .MuiGrid-grid-xs-8 {
                flex-grow: 0;
                max-width: 66.666667%;
                flex-basis: 66.666667%;
            }

            .MuiGrid-grid-md-4 {
                flex-grow: 0;
                max-width: 33.333333%;
                flex-basis: 33.333333%;
            }
            .MuiGrid-grid-xs-7 {
              flex-grow: 0;
              max-width: 58.333333%;
              flex-basis: 58.333333%;
          }
            .MuiGrid-grid-xs-5 {
              flex-grow: 0;
              max-width: 41.666667%;
              flex-basis: 41.666667%;
          }

          .MuiGrid-spacing-xs-3 > .MuiGrid-item {
            padding: 12px;
          }
        }
</style>
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script></html>`);
    frameDoc.document.close();
    console.log(frameDoc)
    setTimeout(function () {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      document.body.removeChild(frame1);
    }, 1000);
    //setOpenPatientCard(false)
    return false;
  }

  function shareQRCards() {
    //setGlobalSpinner(true)
    html2canvas(document.querySelector('#printQRDiv'), {
      allowTaint: true,
      useCORS: true,
    }).then(canvas => {
      setGlobalSpinner(false)
      //const imageScreen = new Image();
      //imageScreen.src = canvas.toDataURL();
      //console.log("canvas ",canvas,canvas.toDataURL('image/jpeg'));
      //imageScreen.onload = () => setiscreenshotContinue(imageScreen)
      window.plugins.socialsharing.share(null, null, canvas.toDataURL('image/png'), null)
    }).catch(error => {
      setGlobalSpinner(false)
    });
  }

  function renderPatientCard() {
    return (
      <div className="modaloverlay">
        <div className="modalcardholder">
          <Card className="modalcard">
            <CardHeader
              className="modalheader"
              action={
                <IconButton aria-label="close">
                  <CloseIcon onClick={() => setOpenPatientCard(false)} />
                </IconButton>
              }
              title={t("Patient Card")}
            />
            <CardContent className="modalbodycontent">
              <PatientCard trackedEntityInstance={row.row[0]}></PatientCard>
            </CardContent>
            <CardActions className="modalfooter">
              {window.cordova ?
                <Button className="modalactionbtn" onClick={() => shareQRCards()}>{t("Share")}</Button>
                :
                <Button className="modalactionbtn" onClick={() => printQRCards()}>{t("Print")}</Button>
              }
              <Button className="modalactionbtn" onClick={() => setOpenPatientCard(false)}>{t("Cancel")}</Button>
            </CardActions>
          </Card>
        </div>
      </div>
    )
  }

  const getIndividualsList = () => {
    localStorage.setItem('trackedEntityInstance', row.row[0]);
    history.push('/layout/individual-cases-list', { 'trackedEntityInstance': row.row[0] });
  }

  function downlaodReport() {

    const link = document.createElement('a');
    link.href = 'https://cdn.jsdelivr.net/gh/duretech/shared@master/PatientRecodDetails.pdf';
    link.setAttribute(
      'download',
      `FileName.pdf`,
    );
    link.setAttribute(
      "target",
      "_blank"
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  }




  const caseListView = () => {
    return (
      <Grid item xs={12} sm={12} md={12} className="knowkedgelistcontainer clientListMobileAccordion">
        { /*{window.document.body.clientWidth > 800 ?
          <Accordion square expanded={row.expanded === `panel1${row.index}`} onClick={UpdateRecordClick}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel1bh-content${row.index}`}
            id={`panel1bh-header${row.index}`}
            
          >
            <Typography className={classes.heading} style={{paddingTop:"10px"}}><EventNoteIcon /></Typography>
              <Typography style={{padding: '10px 15px'}}>
                {clietName}
                </Typography>
          </AccordionSummary>
          </Accordion>
        : */}
        <Accordion square expanded={row.expanded === `panel1${row.index}`} onChange={row.handleChange(`panel1${row.index}`)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel1bh-content${row.index}`}
            id={`panel1bh-header${row.index}`}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',         // Allow items to wrap on smaller screens
              width: '100%',            // Take full width of the accordion
              overflow: 'hidden'        // Prevent overflow
            }}>
              <Typography
                className={classes.heading}
                style={{ paddingTop: '10px', display: 'flex', alignItems: 'center' }}
              >
                <EventNoteIcon />
              </Typography>

              <Typography
                style={{
                  padding: '10px 15px',
                  wordBreak: 'break-word',
                  flex: 1,                // Allow this text to take remaining space
                  minWidth: 0,            // Required to make text wrap in flex container
                  overflowWrap: 'break-word'
                }}
              >
                {clietName}
              </Typography>
            </div>
          </AccordionSummary>

          <AccordionDetails>
            {/* alertsdetailholder */}
            <div className="">
              <Customcaseslist row={row} viewType={row.viewType}></Customcaseslist>
              <p className="alerts_profilebtn_holder caselistviewbtnholder myClientsCaseList">
                <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={seeIndividualRecordClick}>
                  <VisibilityIcon /><span className="ml-10px"></span>
                </Button>
                <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={UpdateRecordClick}>
                  <EditIcon /> <span className="ml-10px"></span>
                </Button>
                <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={getPatientCard}>
                  <PortraitIcon /> <span className="ml-10px"></span>
                </Button>
                <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={UpdateRecordClickFollowup}>
                  <AssignmentTurnedInIcon /> <span className="ml-10px"></span>
                </Button>
                <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn hide" onClick={getCVDRisk}>
                  <LocalHospitalIcon /> <span className="ml-10px"></span>
                </Button>
                {
                  Configuration.myclients && Configuration.myclients.enableDownloadReport
                    ?
                    <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={downlaodReport}>
                      <GetAppIcon /> <span className="ml-10px"></span>
                    </Button>
                    :
                    <> </>
                }

                {clientType && clientType.toLocaleLowerCase() == 'index' && (window.document.body.clientWidth < 800 || window.cordova) ?
                  <>
                    <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px hide" onClick={getIndividualsList}>
                      <GroupIcon /><span className="ml-10px">{t('Linked contacts')}</span>
                    </Button>
                    <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={addContcat}>
                      <PersonAddIcon />
                    </Button>
                  </>
                  : <></>
                }
              </p>
            </div>
          </AccordionDetails>
        </Accordion>
        {/* } */}
      </Grid>
    )
  }

  const caseCardView = () => {

    return (
      <Grid item xs={12} sm={6} md={row.parentPage && row.parentPage == "registration" ? 6 : 3}>
        <Card className={classes.root}>
          {console.log("clietName::>>", clietName)}
          <CardHeader
            className="casescardheader"
            // avatar={
            //   <Avatar aria-label="recipe" className={classes.avatar}>
            //     <EventNoteIcon />
            //   </Avatar>
            // }
            action={
              <div>
                {row.hideOptions != 'true' ? <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton > : <> </>}

                <Menu
                  id="simple-menu"
                  className="casesactionmenu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => seeIndividualRecordClick()}><VisibilityIcon /> {t('See Individual Record')}</MenuItem>
                  <MenuItem onClick={() => UpdateRecordClick()}><EditIcon /> {t('New/Update Individual Record')}</MenuItem>
                </Menu>
              </div>
            }
            title="{clietName}"
            subheader=""
          />

          <CardContent className="zero caselistholder">
            {console.log("clietName::>>row>>", row)}
            <Customcaseslist row={row} viewType={row.viewType}></Customcaseslist>
          </CardContent>
          <CardActions disableSpacing className="cardactionfooter">
            {row.hideOptions != 'true' ?
              <>
                <IconButton aria-label="add to favorites" onClick={seeIndividualRecordClick}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton aria-label="share" onClick={UpdateRecordClick}>
                  <EditIcon />
                </IconButton> </> : <> </>}
            {clientType && clientType.toLocaleLowerCase() == 'index' ?
              <>
                <IconButton aria-label="share" className="hide" title="Individuals List" onClick={getIndividualsList}>
                  <GroupIcon />
                </IconButton>
                <button className="caseSearchButton hide" type="button" onClick={addContcat}>
                  <AddIcon />
                </button>
              </> :
              <> </>}

            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    )
  }

  return (
    <>
      {Configuration ?
        row.viewType == 'card' ? caseCardView() : caseListView()
        : <></>}
      {openPatientCard ? renderPatientCard() : <></>}
      {openCVDRisk ?
        <CVDCalculator name={clietName} age={age} gender={gender ? gender.toLowerCase() : ''} smoking={smoking} diabetes={diabetes} systolicBloodPressure={systolicBloodPressure} totalCholesterol={totalCholesterol} hdlCholesterol={hdlCholesterol} setopenCVDRisk={setopenCVDRisk} />
        : <></>}
    </>
  )
}

export default connect(null, { setTrackedEntityInstanceAction, setLocationAction })(CustomeCaseCard);