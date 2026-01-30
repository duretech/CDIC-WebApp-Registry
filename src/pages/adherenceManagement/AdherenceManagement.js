import React, { useState, useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import classes from '../../App.module.css'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { apiServices } from '../../services/apiServices'
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from "@material-ui/core/Button";
import Box from '@material-ui/core/Box';
import { CircularLoader, CenteredContent } from '@dhis2/ui';
import swal from 'sweetalert';
import { useTranslation } from 'react-i18next';
import OfflineDb from '../../db'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import SearchBar from '../../component/searchbar/SearchBar';
//import {Configuration} from '../../assets/data/config'
import _ from 'lodash';
import { useHistory } from "react-router";
import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'
import AccordianList from '../../component/contentList/AccordianList'
import CardList from '../../component/contentList/CardList'
import FooterMenu from '../../component/layout/FooterMenu';
import Pagination from "@material-ui/lab/Pagination";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EventNoteIcon from '@material-ui/icons/EventNote';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import CallIcon from '@material-ui/icons/Call';
import EmailIcon from '@material-ui/icons/Email';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
//import PlaylistAddCheckCircleIcon from '@material-ui/icons/PlaylistAddCheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import CreateStageField from '../../component/fields/CreateStageField'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ListAltIcon from '@material-ui/icons/ListAlt';
import {ReactFinalForm} from '@dhis2/ui';
import DataTable from 'react-data-table-component';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import {
    TextField
} from 'mui-rff';
import moment from 'moment'
import Tooltip from '@material-ui/core/Tooltip';
const { Form, Field, FormSpy } = ReactFinalForm
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '30px',
    },
}));


// component start here
const AdherenceManagement = () => {
    const { t } = useTranslation();
    const localClasses = useStyles();
    const [Configuration,setConfiguration] = React.useState(null);
    const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null)
    const history = useHistory();
    const [clientList, setClientList] = useState(null);
    const [tabPanelValue, setTabPanelValue] = useState(0);
    const [viewType, setViweType] = useState('list')
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [input, setInput] = useState(moment().format('YYYY-MM-DD'));
    const [searchAllResult,setSearchAllResult] = useState([])
    const [page, setPage] = useState(1);
    const [noOfPages,setNoOfPages] = useState(0)
    const [expanded2, setExpanded2] = useState(false);
    const [programData, setProgramData] = useState(null)
    const [programRules, setProgramRules] = useState(null)
    const [programRulesVariables, setProgramRulesVariables] = useState(null)
    const [dataElementGroup, setDataElementGroup] = useState(null)
    const [OUJSON, setOUJSON] = useState(null)
    const [adherenceStageId, setAdherenceStageId] = useState(null)
    const [adherenceTBStageId, setAdherenceTBStageId] = useState(null)
    const [adherenceTPTStageId, setAdherenceTPTStageId] = useState(null)
    const [openMissedReasonPopup,setOpenMissedReasonPopup] = useState(null)
    const [CalendarSelectedDate, setCalendarSelectedDate] = useState(moment().format('YYYY-MM-DD'))
    const [medicineTakenDateBO, setMedicineTakenDateBO] = useState(null)
    const [reasonForMissedDoseID, setReasonForMissedDoseID] = useState(null)
    const [dateMedicineTakenId, setDateMedicineTakenId] = useState(null)
    const [medicineTakenId, setMedicineTakenId] = useState(null)
    const [medicineColorCodeId, setMedicineColorCodeId] = useState(null)
    const [medicineTakenBO, setMedicineTakenBO] = useState(null)
    const [reasonForMissedDoseBO, setReasonForMissedDoseBO] = useState(null)
    const [customfieldobj, setcustomfieldobj] = useState(null);
    const[programBoDetails,setProgramBoDetails] = React.useState(null);
    const [trackedEntityInstanceId, setTrackedEntityInstanceId] = useState(null)
    //setMissedAdherenceAllClientList
    const [missedAdherenceClientList, setMissedAdherenceClientList] = useState(null)
    const [missedAdherenceAllClientList, setMissedAdherenceAllClientList] = useState(null)
    const [treatmentInterruptionsClientList, setTreatmentInterruptionsClientList] = useState(null)
    const [treatmentInterruptionsAllClientList, setTreatmentInterruptionsAllClientList] = useState(null)
    const [clientName, setClientName] = useState(null)
    const [treatmentInterruptionActionPopup, setTreatmentInterruptionActionPopup] = useState(null)
    const [tptIntiationStageId, setTptIntiationStageId] = useState(null)
    const [missedAdherenceActionId, setMissedAdherenceActionId] = useState(null)
    const [missedAdherenceActionBO, setMissedAdherenceActionBO] = useState(null)
    const [activeClientData, setActiveClientData] = useState(null)
    const [adherenceRemarkId, setAdherenceRemarkId] = useState(null)
    const [missedDoseActionPopup, setMissedDoseActionPopup] = useState(null)
    const [missedDoseActionId, setMissedDoseActionId] = useState(null)
    const [dateforinpersonmeetingId, setDateforinpersonmeetingId] = useState(null)
    const [currentEventId, setCurrentEventId] = useState(null)
    const [adherenceFilterValue, setAdherenceFilterValue] = useState('TB')
    const [tbTretmentInitiationStageId, setTBTretmentInitiationStageId] = useState(null)
    const [regimenStageId, setRegimenStageId] = useState(null)
    const [medicineTable, setMedicineTable] = useState([])
    const [treatmentAdherenceId, setTreatmentAdherenceId] = useState(null)
    const [treatmentStartDateId, setTreatmentStartDateId] = useState(null)
    const [treatmentEndDateId, setTreatmentEndDateId] = useState(null)
    const [treatmentDoseId, setTreatmentDoseId] = useState(null)
    const [treatmentRegimenId, setTreatmentRegimenId] = useState(null)
    const [treatmentPhaseId, setTreatmentPhaseId] = useState(null)
    const [openMedicineListEventPopup, setOpenMedicineListEventPopup] = useState(null)
    const [radioValue, setRadioValue] = React.useState({})
    const [tempMedicineTakenEvent, setTempMedicineTakenEvent] = useState([])
    const [medicineList, setMedicineList] = useState(null)
    
    // constants for labels by uid
    const listOfFields = programData != null ? programData.programs[0].programTrackedEntityAttributes : [];
    const fieldsToDisplay = listOfFields.filter(obj => obj.displayInList == true)
    const columns = [
        {
            name: t('Client name'),
            selector: row => row["Clientname"]
        },
        {
            name: t('UIC'),
            selector: row => row["UIC"] ? row["UIC"] : '-',
        },
        {
            name: t('Date of t/t start'),
            selector: row => row["Date of Treatment"] ? moment(row["Date of Treatment"]).format('YYYY-MM-DD') : '-',
        },
        {
            name: t('Regimen'),
            selector: row => row["regimen"] ? row["regimen"] : '-',
        },
        {
            name: t('Total doses taken %'),
            selector: row => row.hasOwnProperty("total dose percentage") ? row["total dose percentage"] + "%" : '-',
            width: "150px",
        },
        {
            name: t('Total missed doses'),
            selector: row => row.hasOwnProperty("total missed dose") ? row["total missed dose"] + "" : '-',
        },
        {
            name: t('Remaining doses'),
            selector: row => row.hasOwnProperty("remaining dose") ? row["remaining dose"] : '-',
        },
        {
            name: t('Days remaining'),
            selector: row => row.hasOwnProperty("Days remaining") ? row["Days remaining"] : '-',
        },
        {
            name: 'Action',
            selector: row => row.edit
        },
    ];
    const [listOrder, setListOrder] = useState([])
    
    const [missedlistOrder, setMissedlistOrder] = useState([])

    async function getMetaData() {
        let metadata = await OfflineDb.getDataFromPouchDB('metaData')
        setProgramData(metadata.data)

        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)

        let progRule = await OfflineDb.getDataFromPouchDB('programRules')
        setProgramRules(progRule.data)

        let progRuleVariable = await OfflineDb.getDataFromPouchDB('programRulesVariables')
        setProgramRulesVariables(progRuleVariable.data)

        let DEG = await OfflineDb.getDataFromPouchDB('dataElementGroup')
        setDataElementGroup(DEG.data)

        let OU = await OfflineDb.getDataFromPouchDB('OUStructureJSON')
        setOUJSON(OU.data)

        let configurations = await OfflineDb.getDataFromPouchDB('configurations')
        setConfiguration(configurations.data.configuration)
    }
    useEffect(() => {
        getMetaData()
    }, [])

    useEffect(() => {
        if(programData != null){
            getCustomVariableIds()
        }
    }, [programData])

    useEffect(() => {
        if(adherenceFilterValue != null && adherenceTBStageId != null  && adherenceTPTStageId != null){
            getDataElementsVariables(adherenceFilterValue)
            setGlobalSpinner(true);
            if(tabPanelValue == 0){
                loadAdherenceList(input,'resetlist')
            }else if(tabPanelValue == 1){
                loadMissedDosesList()
            }else if(tabPanelValue == 2){
                loadTreatmentInterruptionsList()
            }
        }
    }, [adherenceFilterValue,adherenceTBStageId,adherenceTPTStageId])
    

    useEffect(()=>{
        if(clientList != null && Configuration != null){   
            try{
                setNoOfPages(Math.ceil(clientList.length / Configuration.pagination.itemsPerPage))
            }catch(e){

            }
        }
    },[clientList,Configuration])

    useEffect(() => {
        if (sessionUserBoValue != null && programData != null) {
            setGlobalSpinner(true);
            loadAdherenceList(input,'resetlist')
        }

    }, [sessionUserBoValue, programData])

    useEffect(()=>{
        console.log("medicineTable ",medicineTable,medicineList)
        if(medicineTable && medicineTable.length > 0){
            if(medicineList && medicineList == 'yes'){
                setOpenMedicineListEventPopup(true)
            }else if(medicineList && medicineList == 'no'){
                submitMedicineListEventPopup()
            }
        }
    },[medicineTable,medicineList])

    function loadAdherenceList(dateInput,listStatus){
        if (sessionUserBoValue != null && programData != null) {
            const subURL = `referral/adherencelist`;
            let param = {
                "programid":sessionUserBoValue.programs[0],
                "ouid":sessionUserBoValue.organisationUnits[0].id,
                "date":dateInput,
                "type":adherenceFilterValue
            }
            apiServices.postAPI(subURL,param).then(response => {
                if(response.data && (_.isEmpty(response.data) || _.isEmpty(response.data.data))) {
                      swal({
                        title: t("Success"),
                        text: t("No records found"),
                        icon: "success",
                        button: "Close",
                      })
                      setClientList([]);
                }else {
                    if(response.data.sortarray){
                        setListOrder(response.data.sortarray)
                    }
                    setClientList(response.data.data);
                    if((listStatus && listStatus == 'resetlist')){
                        setSearchAllResult(response.data.data)
                    }
                }   
                setGlobalSpinner(false);
            }).catch(err => {
                swal({
                    title: t("Error"),
                    text: navigator.onLine ? t(err) : t("Data could not be shown in offline mode."),
                    icon: "error",
                    button: "Close",
                  });
                setGlobalSpinner(false);
            });
        }
    }

    function loadMissedDosesList(){
        if (sessionUserBoValue != null && programData != null) {
            const subURL = `referral/missedlist`;
            let param = {
                "programid":sessionUserBoValue.programs[0],
                "ouid":sessionUserBoValue.organisationUnits[0].id,
                "type":adherenceFilterValue
            }
            apiServices.postAPI(subURL,param).then(response => {
                if(response.data && (_.isEmpty(response.data) || _.isEmpty(response.data.data))) {
                      swal({
                        title: t("Success"),
                        text: t("No records found"),
                        icon: "success",
                        button: "Close",
                      })
                      setMissedAdherenceClientList([]);
                }else {
                    if(response.data.sortarray){
                        setMissedlistOrder(response.data.sortarray)
                    }
                    setMissedAdherenceClientList(response.data.data);
                    setMissedAdherenceAllClientList(response.data.data)
                }   
                try{
                    setPage(1);
                    setNoOfPages(Math.ceil(response.data.data.length / Configuration.pagination.itemsPerPage))
                }catch(e){
        
                }
                setGlobalSpinner(false);
            }).catch(err => {
                swal({
                    title: t("Error"),
                    text: navigator.onLine ? t(err) : t("Data could not be shown in offline mode."),
                    icon: "error",
                    button: "Close",
                  });
                setGlobalSpinner(false);
            });
        }
    }

    function loadTreatmentInterruptionsList(){
        if (sessionUserBoValue != null && programData != null) {
            const subURL = `referral/adherence/management/list`;
            let param = {
                "programid":sessionUserBoValue.programs[0],
                "ouid":sessionUserBoValue.organisationUnits[0].id,
                "type":adherenceFilterValue
            }
            apiServices.postAPI(subURL,param).then(response => {
                if(response.data && (_.isEmpty(response.data) || _.isEmpty(response.data.data))) {
                      swal({
                        title: t("Success"),
                        text: t("No records found"),
                        icon: "success",
                        button: "Close",
                      })
                      setTreatmentInterruptionsClientList([]);
                }else {
                    response.data.data.map((obj,i) => {
                        response.data.data[i]["edit"] =  <Tooltip title={t("Add Required Action")} arrow><AddCircleIcon className='check-icon' onClick={(e) => addRequiredAction(e,response.data.data[i])}/></Tooltip>
                    })
                    setTreatmentInterruptionsClientList(response.data.data);
                    setTreatmentInterruptionsAllClientList(response.data.data)
                }   
                setGlobalSpinner(false);
            }).catch(err => {
                swal({
                    title: t("Error"),
                    text: navigator.onLine ? t(err) : t("Data could not be shown in offline mode."),
                    icon: "error",
                    button: "Close",
                  });
                setGlobalSpinner(false);
            });
        }
    }

    function getCustomVariableIds() {
        let tempobj = {}
        programData.programs[0].programStages.map((stage) => {
            let stageName = stage.description ? stage.description : stage.displayName;
            if(stageName.trim() == "TB Treatment Adherence"){
                setAdherenceTBStageId(stage.id);
                tempobj = {
                    ...tempobj,
                    adherenceTBStageId: stage.id,
                };
            }
            if (stageName.trim() == "TPT Adherence") {
                setAdherenceStageId(stage.id);
                setAdherenceTPTStageId(stage.id)
                tempobj = { ...tempobj, ['adherenceStageId']: stage.id };
            }
            if (stageName.trim() == "TPT  Initiation Form") {
                setTptIntiationStageId(stage.id);
                tempobj = { ...tempobj, ['tptIntiationStageId']: stage.id };
            }
            if (stageName.trim() == "TB Treatment Initiation") {
                setTBTretmentInitiationStageId(stage.id);
                tempobj = { ...tempobj, ['tbTretmentInitiationStageId']: stage.id };
            }
            // stage.programStageDataElements.map((de) => {
            //     let fieldname = de.dataElement.description ? de.dataElement.description : de.dataElement.formName ? de.dataElement.formName : de.dataElement.displayName
            //     if (fieldname) {
            //         if (fieldname.trim().toLocaleLowerCase() == "date medicine taken") { //TB Test result
            //             setDateMedicineTakenId(de.dataElement.id);
            //             setMedicineTakenDateBO(de.dataElement);
            //             tempobj = { ...tempobj, ['dateMedicineTakenId']: de.dataElement.id };
            //         }

            //         if (fieldname.trim().toLocaleLowerCase() == "medicine taken") { //TB Test result
            //             setMedicineTakenId(de.dataElement.id);
            //             setMedicineTakenBO(de.dataElement);
            //             tempobj = { ...tempobj, ['medicineTakenId']: de.dataElement.id };
            //         }

            //         if (fieldname.trim().toLocaleLowerCase() == "colour code") { //TB Test result
            //             setMedicineColorCodeId(de.dataElement.id);
            //             tempobj = { ...tempobj, ['medicineColorCodeId']: de.dataElement.id };
            //         }
            //         if (fieldname.trim() == "Reason for missed dose") { //Date of treatment completion
            //             setReasonForMissedDoseID(de.dataElement.id);
            //             setReasonForMissedDoseBO(de.dataElement);
            //             tempobj = { ...tempobj, ['reasonForMissedDoseID']: de.dataElement.id };
            //         }
            //         if (fieldname.trim() == "Missed dose_Action") { //Date of treatment completion
            //             setMissedAdherenceActionId(de.dataElement.id);
            //             setMissedAdherenceActionBO(de.dataElement);
            //             tempobj = { ...tempobj, ['missedAdherenceActionId']: de.dataElement.id };
            //         }
            //         if (fieldname.trim() == "TPTAdherence_Remarks") { //Date of treatment completion
            //             setAdherenceRemarkId(de.dataElement.id);
            //             tempobj = { ...tempobj, ['adherenceRemarkId']: de.dataElement.id };
            //         }
            //         if (fieldname.trim() == "Misseddose_Action") { //Date of treatment completion
            //             setMissedDoseActionId(de.dataElement.id);
            //             tempobj = { ...tempobj, ['missedDoseActionId']: de.dataElement.id };
            //         }
            //         if (fieldname.trim() == "TPTAdherence_Date for in-person meeting") { //Date of treatment completion
            //             setDateforinpersonmeetingId(de.dataElement.id);
            //             tempobj = { ...tempobj, ['dateforinpersonmeetingId']: de.dataElement.id };
            //         }
            //     }
            // })
        })
        setcustomfieldobj(tempobj);
    }

    const getTranslatedDataElementLabels = (dataElement) => {
        if (localStorage.getItem("locale") == "en") {
            return dataElement.formName ? dataElement.formName : dataElement.displayName ? dataElement.displayName : dataElement.description;
        } else if (dataElement.translations && dataElement.translations.length > 0) {
            let label = dataElement.translations.filter(
                (tanslation) =>
                    tanslation.property == "NAME" &&
                    tanslation.locale == localStorage.getItem("locale")
            );
            if (label.length > 0) {
                return label[0].value;
            } else {
                return dataElement.formName ? dataElement.formName : dataElement.displayName ? dataElement.displayName : dataElement.description;
            }
        }
        return dataElement.formName ? dataElement.formName : dataElement.displayName ? dataElement.displayName : dataElement.description;
      };

    const onEventSubmit = async values => {
        console.log("values ",values)
    }

    const handlePanelChange = (panel) => (event, isExpanded) => {
        setExpanded2(isExpanded ? panel : false);
      };

    const handleChange = (event, newValue) => {
        setTabPanelValue(newValue);
        //reset variables
        setClientName(null)
        setCurrentEventId(null)
        setTrackedEntityInstanceId(null)
        setActiveClientData(null)
        //loadTreatmentInterrruptionsList
        if(newValue == 2){
            setInput('');
            if(treatmentInterruptionsClientList == null){
                setGlobalSpinner(true)
                loadTreatmentInterruptionsList()
            }else{
                //setTreatmentInterruptionsClientList(treatmentInterruptionsAllClientList)
                setGlobalSpinner(true)
                loadTreatmentInterruptionsList()
            }
        }else if(newValue == 1){
            setInput('');
            if(missedAdherenceClientList == null){
                setGlobalSpinner(true)
                loadMissedDosesList()
            }else{
                //setMissedAdherenceClientList(missedAdherenceAllClientList)
                setGlobalSpinner(true)
                loadMissedDosesList()
                try{
                    setPage(1);
                    setNoOfPages(Math.ceil(missedAdherenceAllClientList.length / Configuration.pagination.itemsPerPage))
                }catch(e){
        
                }
            }
        }else{
            //setGlobalSpinner(true)
            setCalendarSelectedDate(moment().format("YYYY-MM-DD"));
            setInput(moment().format("YYYY-MM-DD"));
            //loadAdherenceList(moment().format("YYYY-MM-DD"))
            setClientList(searchAllResult)
            try{
                setPage(1);
                setNoOfPages(Math.ceil(clientList.length / Configuration.pagination.itemsPerPage))
            }catch(e){
    
            }
        }
    };
    const handlePageChange = (event, value) => {
        setPage(value);
    }
    const updateInput = (input) => {
        setInput(input);
        //console.log("input ",input,tabPanelValue);
        if(tabPanelValue === 0){
            setCalendarSelectedDate(input);
            if(input){
                setGlobalSpinner(true)
                loadAdherenceList(input)
            }else{
                setGlobalSpinner(true)
                setCalendarSelectedDate(moment().format("YYYY-MM-DD"));
                setInput(moment().format("YYYY-MM-DD"));
                loadAdherenceList(moment().format("YYYY-MM-DD"))
            }
        }else if(tabPanelValue === 1){
            let filteredList = []
            setGlobalSpinner(true)
            if(input && input.length >= 3){
                missedAdherenceAllClientList.map(data => {
                    if(data["Fullname"] && data["Fullname"].toLowerCase().indexOf(input.toLowerCase()) > -1){
                        filteredList.push(data)
                    }
                })
                setMissedAdherenceClientList(null);
                setTimeout(function(){
                    setGlobalSpinner(false)
                    setMissedAdherenceClientList(filteredList)
                },500)
            }else{
                if(input.length == 0){
                    setMissedAdherenceClientList(null);
                    setTimeout(function(){
                        setGlobalSpinner(false)
                        setMissedAdherenceClientList(missedAdherenceAllClientList)
                    },1000)
                }else{
                    setGlobalSpinner(false)
                }
            }
        }else if(tabPanelValue === 2){
            let filteredList = []
            setGlobalSpinner(true)
            if(input && input.length >= 3){
                treatmentInterruptionsAllClientList.map(data => {
                    if(data["Clientname"] && data["Clientname"].toLowerCase().indexOf(input.toLowerCase()) > -1){
                        filteredList.push(data)
                    }
                })
                setTreatmentInterruptionsClientList(null);
                setTimeout(function(){
                    setGlobalSpinner(false)
                    setTreatmentInterruptionsClientList(filteredList)
                },500)
            }else{
                if(input.length == 0){
                    setTreatmentInterruptionsClientList(null);
                    setTimeout(function(){
                        setGlobalSpinner(false)
                        setTreatmentInterruptionsClientList(treatmentInterruptionsAllClientList)
                    },1000)
                }else{
                    setGlobalSpinner(false)
                }
            }
        }
    }
    function dialPhone(porps){
        try{
            let phoneNumber = porps["Phone Number"] //&& PropsArray ? PropsArray.alertdata[phoneUID] : ''
            if(phoneNumber){
                window.open(`tel:${phoneNumber}`, '_system')
            }
        }catch(e){
  
        }
      }
  
      function openEmail(){
        window.open('mailto:', '_system')
      }
    function renderStageField(fields, values, form, stages,currentStage) {
        return <CreateStageField fieldData={fields} values={values} programRules={programRules.programRules} programData={programData.programs[0]} programRulesVariables={programRulesVariables.programRuleVariables} dataElementGroup={dataElementGroup.dataElementGroups} stages={stages} orgid={sessionUserBoValue.organisationUnits[0].id} OUJSON={OUJSON} Configuration={Configuration} customfieldobj={customfieldobj} programBoDetails={programBoDetails} customClassName={localStorage.getItem('fontSize') ? "FS"+localStorage.getItem('fontSize') : ''}/>
    }

    function submitMissedDoseAction(values){
        console.log("values ",values,currentEventId)
        if(!values.hasOwnProperty(missedDoseActionId)){
            swal({
                title: t("Alert"),
                text: t("Please select action for missed dose."),
                icon: "warning",
                button: t("Close"),
              })
            return;
        }
        if(navigator.onLine){
        setMissedDoseActionPopup(null)
        if(!currentEventId){
            return;
        }
        const getURL = 'events/'+currentEventId
        setGlobalSpinner(true)
        apiServices.getAPI(getURL)
            .then(response => {
                setGlobalSpinner(false);
                setCurrentEventId(null);
                let valuestore = []
                let eventData = response.data
                if(eventData && eventData.dataValues){
                    eventData.dataValues.map(obj => {
                        valuestore.push({"dataElement":obj["dataElement"],"value":obj["value"]})
                    })
                    if(values[missedDoseActionId] && values[missedDoseActionId] == 'Schedule in-person meeting'){
                        valuestore.push({"dataElement":missedDoseActionId,"value":values[missedDoseActionId]})
                        valuestore.push({"dataElement":adherenceRemarkId,"value":values[adherenceRemarkId]})
                        valuestore.push({"dataElement":dateforinpersonmeetingId,"value":values[dateforinpersonmeetingId]})
                    }else{
                        valuestore.push({"dataElement":missedDoseActionId,"value":values[missedDoseActionId]})
                        valuestore.push({"dataElement":adherenceRemarkId,"value":values[adherenceRemarkId]})
                    }
                    const orgUnit = sessionUserBoValue.organisationUnits[0].id
                    const programId = programData.programs[0].id
                    const referalAPIObject = { "events": [] }
                    let updateStageInput = {
                        "dataValues": valuestore,
                        "event": eventData.event,
                        "program": programId,
                        "programStage": adherenceStageId,
                        "orgUnit": orgUnit,
                        "trackedEntityInstance": trackedEntityInstanceId,
                        "status": "COMPLETED",
                        "dueDate": moment().format("YYYY-MM-DD"),
                        "eventDate": moment().format("YYYY-MM-DD"),
                        "completedDate": moment().format("YYYY-MM-DD")
                    }
                    referalAPIObject.events.push(updateStageInput)
                    const updateURL = '33/events?strategy=CREATE_AND_UPDATE'
                    if(navigator.onLine){
                        setGlobalSpinner(true)
                        apiServices.postAPI(updateURL, referalAPIObject)
                            .then(stageResponse => {
                                setGlobalSpinner(false)
                                swal({
                                    title: t("Success"),
                                    text: t("Missed dose action submitted successfully."),
                                    icon: "success",
                                    button: t("Ok"),
                                }).then(alertres => {
                                    setGlobalSpinner(true);
                                    loadMissedDosesList()
                                })
                            }).catch(err => {
                                setGlobalSpinner(false)
                            })
                    }else{
                        swal({
                            title: t("Error"),
                            text: t("Data could not be save in offline mode."),
                            icon: "error",
                            button: t("Close"),
                          });
                    }
                }
            }).catch(err => {
                setGlobalSpinner(false)
                setCurrentEventId(null);
            })
        }else{
            swal({
                title: t("Error"),
                text: t("Data could not be save in offline mode."),
                icon: "error",
                button: t("Close"),
              });
            setCurrentEventId(null);
        }
    }

    function submitTreatmentInterruptionAction(values){
        if(!values.hasOwnProperty(missedAdherenceActionId)){
            swal({
                title: t("Alert"),
                text: t("Please select action for missed dose."),
                icon: "warning",
                button: t("Close"),
              })
            return;
        }
        if(navigator.onLine){
        setTreatmentInterruptionActionPopup(null)
        const getURL = 'trackedEntityInstances/' + trackedEntityInstanceId + '.json?program=' + programData.programs[0].id + '&fields=*?'
        setGlobalSpinner(true)
        apiServices.getAPI(getURL)
            .then(trackentityInstanceData => {
                setGlobalSpinner(false);
                let trackentityInstanceDetails = trackentityInstanceData.data
                let stageData = trackentityInstanceDetails && trackentityInstanceDetails.enrollments && trackentityInstanceDetails.enrollments[0] ? trackentityInstanceDetails.enrollments[0].events : []
                let tptStageData = stageData ? _.find(stageData,{programStage:regimenStageId}) : null
                //console.log("tptStageData ",tptStageData);

                const filterEvent = stageData.filter(obj => obj.programStage == regimenStageId)
                if (filterEvent.length > 1) {
                    tptStageData = filterEvent[filterEvent.length - 1]
                } else if (filterEvent.length == 1) {
                    tptStageData = filterEvent[0]
                }
                let valuestore = []
                if(tptStageData && tptStageData.dataValues){
                    tptStageData.dataValues.map(obj => {
                        valuestore.push({"dataElement":obj["dataElement"],"value":obj["value"]})
                    })
                
                    valuestore.push({"dataElement":missedAdherenceActionId,"value":values[missedAdherenceActionId]})
                    const orgUnit = sessionUserBoValue.organisationUnits[0].id
                    const programId = programData.programs[0].id
                    const referalAPIObject = { "events": [] }
                    let updateStageInput = {
                        "dataValues": valuestore,
                        "event": tptStageData.event,
                        "program": programId,
                        "programStage": regimenStageId,
                        "orgUnit": orgUnit,
                        "trackedEntityInstance": trackedEntityInstanceId,
                        "status": "COMPLETED",
                        "dueDate": moment().format("YYYY-MM-DD"),
                        "eventDate": moment().format("YYYY-MM-DD"),
                        "completedDate": moment().format("YYYY-MM-DD")
                    }
                    referalAPIObject.events.push(updateStageInput)
                    console.log("updateStageInput ",updateStageInput);
                    const updateURL = '33/events?strategy=CREATE_AND_UPDATE'
                    if(navigator.onLine){
                        setGlobalSpinner(true)
                        apiServices.postAPI(updateURL, referalAPIObject)
                            .then(stageResponse => {
                                setGlobalSpinner(false)
                                swal({
                                    title: t("Success"),
                                    text: t("Required action submitted successfully."),
                                    icon: "success",
                                    button: t("Ok"),
                                }).then(alertres => {
                                    if(values[missedAdherenceActionId] && (values[missedAdherenceActionId] == "Restart full course" || values[missedAdherenceActionId] == "Change regimen" || values[missedAdherenceActionId] == "Refer for adherence counselling and address reason for interruption")){
                                        const activeCaseDetails = {
                                            'trackedEntityInstance': trackedEntityInstanceId,
                                            'enrollmentId': "",
                                            //"type": PropsArray.type,
                                            "stageinstanceuid": activeClientData && activeClientData.stageinstanceuid ? activeClientData.stageinstanceuid : '',
                                            "stageuid": activeClientData && activeClientData.stageID ? activeClientData.stageID : regimenStageId
                                        }
                                        const linkContact = {
                                        "enabled": false,
                                        "linkTrackedEntityInstance": trackedEntityInstanceId
                                        }
                                        OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
                                        OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
                                        setGlobalSpinner(false)
                                        history.push('/layout/registration')
                                    }else{
                                        setGlobalSpinner(true);
                                        //loadMissedDosesList()
                                        loadTreatmentInterruptionsList()
                                    }
                                })
                            }).catch(err => {
                                setGlobalSpinner(false)
                            })
                    }else{
                        swal({
                            title: t("Error"),
                            text: t("Data could not be save in offline mode."),
                            icon: "error",
                            button: t("Close"),
                          });
                    }
                }
            }).catch(err => {
                setGlobalSpinner(false)
            })
        }else{
            swal({
                title: t("Error"),
                text: t("Data could not be save in offline mode."),
                icon: "error",
                button: t("Close"),
              });
        }
    }



    function submitMissedMedicineStatus(values){
        //console.log("values ",values);
        if(reasonForMissedDoseID && !values.hasOwnProperty(reasonForMissedDoseID)){
            swal({
                title: t("Alert"),
                text: t("Please select reason for missed dose."),
                icon: "warning",
                button: t("Close"),
              })
            return;
        }
        if(adherenceFilterValue == 'TB'){
            setOpenMissedReasonPopup(null)
            getMedicinesListFromEvents(trackedEntityInstanceId,'no')
        }else{
            const orgUnit = sessionUserBoValue.organisationUnits[0].id
            const programId = programData.programs[0].id
            const referalAPIObject = { "events": [] }
            let datavalues = []
            datavalues.push({dataElement:dateMedicineTakenId,value:CalendarSelectedDate})
            datavalues.push({dataElement:medicineColorCodeId,value:"#ff4d4d"})
            datavalues.push({dataElement:medicineTakenId,value:'No'})
            datavalues.push({dataElement:reasonForMissedDoseID,value:values[reasonForMissedDoseID]})
            let saveStageInput = {
                "trackedEntityInstance": trackedEntityInstanceId,
                "program": programId,
                "programStage": adherenceStageId,
                "enrollment": '',
                "orgUnit": orgUnit,
                "notes": [],
                "dataValues": datavalues,
                "status": "COMPLETED",
                "eventDate": moment().format("YYYY-MM-DD")
            }
            referalAPIObject.events.push(saveStageInput)
            submitMedicineStatus(referalAPIObject)
        }
    }

    function submitMedicineStatus(param){
        //console.log("param ",param);
        setOpenMissedReasonPopup(null)
        if (navigator.onLine) {
            setGlobalSpinner(true)
            apiServices.postAPI('events.json', param)
                .then(stageResponse => {
                    setGlobalSpinner(false)
                    swal({
                        title: t("Success"),
                        text: t("Adherence marked successfully."),
                        icon: "success",
                        button: t("Close"),
                    });
                    loadAdherenceList(input,'resetlist')
                })
                .catch(errorResponse => {
                    setGlobalSpinner(false)
                    swal({
                        title: t("Error"),
                        text: navigator.onLine ? t("Something went wrong, please try agian later.") : t("Data could not be save in offline mode."),
                        icon: "error",
                        button: t("Close"),
                      });
                })
        }else{
            swal({
                title: t("Error"),
                text: t("Data could not be save in offline mode."),
                icon: "error",
                button: t("Close"),
              });
        }
    }

    function submitAllAdherenceAction(){
        //console.log("param ",param);
        swal({
            title: t(input),
            text: t("Do you want to mark dose taken for all?"),
            icon: "warning",
            buttons: [t("No"), t("Yes")]
        }).then((AlertRes) => {
            if (AlertRes) {
                const orgUnit = sessionUserBoValue.organisationUnits[0].id
                const programId = programData.programs[0].id
                let trackedEntityInstances = _.uniq(_.map(clientList, 'instanceuid')) //_.uniqBy(clientList, 'instanceuid') ;
                let param = {
                    "programid":programId,
                    "orgid":orgUnit,
                    "trackedEntityInstance":trackedEntityInstances,
                    "date":input,
                    "programStage":adherenceStageId
                }
                if (navigator.onLine) {
                    setGlobalSpinner(true)
                    apiServices.postAPI('common/updateadherence', param)
                        .then(stageResponse => {
                            setGlobalSpinner(false)
                            swal({
                                title: t("Success"),
                                text: t("Adherence marked successfully."),
                                icon: "success",
                                button: t("Close"),
                            });
                            loadAdherenceList(input,'resetlist')
                        })
                        .catch(errorResponse => {
                            setGlobalSpinner(false)
                            swal({
                                title: t("Error"),
                                text: navigator.onLine ? t("Something went wrong, please try agian later.") : t("Data could not be save in offline mode."),
                                icon: "error",
                                button: t("Close"),
                            });
                        })
                }else{
                    swal({
                        title: t("Error"),
                        text: t("Data could not be save in offline mode."),
                        icon: "error",
                        button: t("Close"),
                    });
                }
            }
        })
    }

    const triggerMedicineListPopup = (e,props) =>{
        e.stopPropagation();
        setClientName('')
        if(CalendarSelectedDate){
            setTrackedEntityInstanceId(props["instanceuid"])
            setClientName(props["Fullname"])
            getMedicinesListFromEvents(props["instanceuid"],'partially');
        }else{
            swal({
                title: t("Alert"),
                text: t("Please select date."),
                icon: "warning",
                button: "Close",
              })
        }
     }

     const markadherenece = (e, status,props) =>{
        e.stopPropagation();
        setClientName('')
        if(CalendarSelectedDate){
            setTrackedEntityInstanceId(props["instanceuid"])
            setClientName(props["Fullname"])
            const orgUnit = sessionUserBoValue.organisationUnits[0].id
            const programId = programData.programs[0].id
            const referalAPIObject = { "events": [] }
            let saveStageInput = {
                "trackedEntityInstance": props["instanceuid"],
                "program": programId,
                "programStage": adherenceStageId,
                "enrollment": '',
                "orgUnit": orgUnit,
                "notes": [],
                "dataValues": [],
                "status": "COMPLETED",
                "eventDate": moment().format("YYYY-MM-DD")
            }
            if(status == 'No'){
                //show popup
                setOpenMissedReasonPopup(true)
                // if(adherenceFilterValue == 'TB'){
                //     swal({
                //         title: props["Fullname"] ? props["Fullname"] : t("Alert"),
                //         text: t("Do you want to mark missed dose adherence?"),
                //         icon: "warning",
                //         buttons: [t("No"), t("Yes")]
                //         }).then((AlertRes) => {
                //             if (AlertRes) {
                //                 getMedicinesListFromEvents(props["instanceuid"],'no')
                //             }
                //         })
                // }else{
                //     setOpenMissedReasonPopup(true)
                // }
            }else if(status == 'Yes'){
                if(adherenceFilterValue == 'TB'){
                    getMedicinesListFromEvents(props["instanceuid"],'yes')
                }else{
                    swal({
                    title: props["Fullname"] ? props["Fullname"] : t("Alert"),
                    text: t("Do you want to mark adherence?"),
                    icon: "warning",
                    buttons: [t("No"), t("Yes")]
                    }).then((AlertRes) => {
                        if (AlertRes) {
                            let datavalues = []
                            datavalues.push({dataElement:dateMedicineTakenId,value:CalendarSelectedDate})
                            datavalues.push({dataElement:medicineColorCodeId,value:"#4caf50"})
                            datavalues.push({dataElement:medicineTakenId,value:'Yes'})
                            saveStageInput["dataValues"] = datavalues
                            referalAPIObject.events.push(saveStageInput)
                            submitMedicineStatus(referalAPIObject)
                        
                        }
                    })
                }
            }
        }else{
            swal({
                title: t("Alert"),
                text: t("Please select date."),
                icon: "warning",
                button: "Close",
              })
        }
     }

    const addRequiredAction = (e,props) => {
        e.stopPropagation();
        //setClientName('')
        setTreatmentInterruptionActionPopup(true)
        setClientName(props["Clientname"])
        setTrackedEntityInstanceId(props["instanceuid"])
        setActiveClientData(props)
    }

    const addManageMissedDoseAction = (e,props) => {
        e.stopPropagation();
        //setClientName('')
        setMissedDoseActionPopup(true)
        setClientName(props["Fullname"])
        setCurrentEventId(props["eventid"])
        setTrackedEntityInstanceId(props["instanceuid"])
        setActiveClientData(props)
    }
     

    const renderRefferalCard = (props,index,cardtype) => {
        return (
        //   <AccordianList AccordionLabel = {labelsArr.find(x => x["First name"]) ? labelsArr.find(x => x["First name"])['First name'] : ''} AccordionContent = {<> </>} AccordionDataObject = {labelsArr} TrackEntityId = {props.instanceid} Component={'Referal'} PropsArray = {props}/>
        <Grid item xs={12} sm={12} md={12} className="knowkedgelistcontainer adherence-monitoring">
              <Accordion expanded={expanded2 === cardtype+'-panel-'+index} onChange={handlePanelChange(cardtype+'-panel-'+index)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{margin:"0px"}}
              >
                <Typography className={classes.heading} style={{paddingTop:"10px"}}><EventNoteIcon /></Typography>
                    <Typography style={{padding: '10px 15px'}}>
                    {   
                       (window.document.body.clientWidth < 800 || window.cordova) 
                        ?
                        <div className="client-name-head">{props["Fullname"]}</div>
                        :
                        <div>{props["Fullname"]}</div>
                        
                    }
                </Typography>
                <div className={'adherence-action'}>
                   { 
                   tabPanelValue === 0 ?
                    <>
                       {/* {adherenceFilterValue === 'TB' ?
                            <Tooltip title={t("Mark Dose")} arrow>
                                <ListAltIcon className='check-icon' onClick={(e) => triggerMedicineListPopup(e,props)}/>
                            </Tooltip>
                        :<></>
                        } */}
                        <Tooltip title={t("Dose Taken")} arrow>
                            <CheckCircleIcon className='check-icon' onClick={(e) => markadherenece(e,'Yes',props)}/>
                        </Tooltip>
                        <Tooltip title={t("Missed Dose")} arrow>
                            <CancelIcon className='cancel-icon' onClick={(e) => markadherenece(e,'No',props)}/>
                        </Tooltip>
                    </>
                    :
                    <>
                        <Tooltip title={t("Add Missed Dose Action")} arrow>
                            <AddCircleIcon className='check-icon' onClick={(e) => addManageMissedDoseAction(e,props)}/>
                        </Tooltip>
                    </>
                    }
                </div>
              </AccordionSummary>
              
                <AccordionDetails>
                    <div className="">
                        { 
                            tabPanelValue === 0 ?
                            listOrder.map((field,fieldIndex) => {
                                return Object.entries(props).map(([key, val], idx) => {
                                    return field == key ? ( 
                                        <p className="alerts_description_fields row-block">
                                            <div className="fl-left">{t(key)} : </div>
                                            <div className="fl-left">&nbsp; {t(val)}</div>
                                        </p>
                                        ) : <></>
                                })
                            })
                            :
                            //missedlistOrder
                            missedlistOrder.map((field,fieldIndex) => {
                                return Object.entries(props).map(([key, val], idx) => {
                                    return field == key ? ( 
                                        <p className="alerts_description_fields row-block">
                                            <div className="fl-left">{t(key)} : </div>
                                            <div className="fl-left">&nbsp; {t(val)}</div>
                                        </p>
                                        ) : <></>
                                })
                            })

                        }
                        <p className="alerts_profilebtn_holder caselistviewbtnholder myClientsCaseList">
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={() => seeIndividualRecordClick(props)}>
                            <VisibilityIcon /><span className="ml-10px">{t('View')}</span>
                        </Button>
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={() => UpdateRecordClick(props)}>
                            <EditIcon /> <span className="ml-10px">{t('Edit')}</span>
                        </Button>
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={() => dialPhone(props)}>
                            <CallIcon /> <span className="ml-10px">{t('Call')}</span>
                          </Button>
                          <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={() => openEmail(props)}>
                              <EmailIcon /> <span className="ml-10px">{t('Email')}</span>
                          </Button>
                    </p> 
                    </div> 
                      
              </AccordionDetails>
              
            </Accordion>
            </Grid>
        );
    }
    const seeIndividualRecordClick = (PropsArray) => {
    localStorage.setItem('trackedEntityInstance', PropsArray.instanceuid) // Update TrackentityId here
    localStorage.setItem('linkContact', false)
    localStorage.setItem('hidebutton', true)


    //setAnchorEl(null);
    setGlobalSpinner(true)
    console.log("1231")
    history.push('/layout/individualrecord', { 'trackedEntityInstance': PropsArray.instanceuid }); // Update TrackentityId here
    }

    function UpdateRecordClick(PropsArray) {
        setGlobalSpinner(true)
    
        const formDataMassaged = {}
        const activeCaseDetails = {
          'trackedEntityInstance': PropsArray.instanceuid,
          'enrollmentId': "",
          "type": PropsArray.type,
          "stageinstanceuid": PropsArray.stageinstanceuid,
          "stageuid": PropsArray.stageuid
        }
        const activeCaseFormData = {
          'formFormat': null, //formDataMassaged,
          'dhisFormat': null
        }
        const linkContact = {
          "enabled": false,
          "linkTrackedEntityInstance": PropsArray.instanceuid
        }
        OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
        OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
        setGlobalSpinner(false)
        history.push('/layout/registration')
      }
    const handleViewChange = (event,newValue) => {
        setViweType(newValue);
    };

    function getMedicinesListFromEvents(currentTrackedEntityInstanceId,doseStatus) {
        if(navigator.onLine){
        const currentStage = _.find(programData.programs[0].programStages,{id:regimenStageId})
        const getURL = 'trackedEntityInstances/' + currentTrackedEntityInstanceId + '.json?program=' + programData.programs[0].id + '&fields=*?'
        setGlobalSpinner(true)
        apiServices.getAPI(getURL)
            .then(trackentityInstanceData => {
                setGlobalSpinner(false);
                let trackentityInstanceDetails = trackentityInstanceData.data
                let stageData = trackentityInstanceDetails && trackentityInstanceDetails.enrollments && trackentityInstanceDetails.enrollments[0] ? trackentityInstanceDetails.enrollments[0].events : []
                //debugger
                let sortedEvents = _.filter(stageData, { 'programStage': regimenStageId });
                console.log("sortedEvents ",sortedEvents,regimenStageId);
                if (sortedEvents.length > 0) {
                    let objTreatmentAdherence = _.find(sortedEvents[sortedEvents.length - 1].dataValues, { 'dataElement': treatmentAdherenceId });
                    let treatmentAdherenceValue = (objTreatmentAdherence != undefined) ? objTreatmentAdherence.value : "";
                    //filter events by treatmentAdherenceId 
                    let finalEvents = _.filter(sortedEvents, { dataValues: [{ dataElement: treatmentAdherenceId, value: treatmentAdherenceValue }] });
                    if(finalEvents.length == 0){
                    finalEvents = [sortedEvents[sortedEvents.length - 1]]
                    }
                    let radioObj = {}
                    if (finalEvents.length > 0) {
                        setMedicineTable([])
                        let arrTemp = [];
                        finalEvents.map(eventObj => {
                            let regmineTableObj = {}; //arrTemp=[];
                            //arrTemp=_.cloneDeep(medicineTable)
                            regmineTableObj['eventdetails'] = Object.assign({}, eventObj);
                            let objRegimen = _.find(eventObj.dataValues, { 'dataElement': treatmentRegimenId });
                            regmineTableObj[treatmentRegimenId] = objRegimen ? objRegimen.value : ''
            
                            let objPhase = _.find(eventObj.dataValues, { 'dataElement': treatmentPhaseId });
                            regmineTableObj[treatmentPhaseId] = objPhase ? objPhase.value : ''
                            eventObj.dataValues.map(DE => {
                                if (DE.dataElement == treatmentStartDateId) {
                                    regmineTableObj[treatmentStartDateId] = moment(DE.value).format('MM/DD/YYYY');
                                } else if (DE.dataElement == treatmentEndDateId) {
                                    regmineTableObj[treatmentEndDateId] = moment(DE.value).format('MM/DD/YYYY');
                                } else if (DE.dataElement == treatmentDoseId) {
                                    regmineTableObj[treatmentDoseId] = DE.value
                                } else if (DE.dataElement == treatmentAdherenceId) {
                                    regmineTableObj[treatmentAdherenceId] = DE.value
                                }
                            })
                            
                            const regimenConfigObject = _.find(Configuration.treatmentRegimens, { 'code': regmineTableObj[treatmentRegimenId], 'phase': regmineTableObj[treatmentPhaseId] });
                            //console.log("sortedEvents ",regimenConfigObject,sortedEvents,treatmentAdherenceId,finalEvents,eventObj,treatmentStartDateId,treatmentRegimenId,treatmentPhaseId);
                            
                            if (regimenConfigObject != undefined) {
                                let fieldDetails = _.filter(currentStage.programStageDataElements, ['dataElement.description', regimenConfigObject.associatedFieldName])
                                let objMedicineName = _.find(eventObj.dataValues, { 'dataElement': fieldDetails[0].dataElement.id });
                                console.log("fieldDetails ",fieldDetails,)
                                fieldDetails && fieldDetails[0] && fieldDetails[0].dataElement.optionSet.options.map(ele => {
                                    console.log("objMedicineName1 ",objMedicineName,ele.code)
                                    if (objMedicineName && objMedicineName.value == ele.code) {
                                        console.log("objMedicineName ",objMedicineName,ele.code)
                                        let obj = Object.assign({}, regmineTableObj)
                                        obj['medicine'] = Object.assign({}, ele);
                                        arrTemp.push(obj)
                                        
                                        //setMedicineTable(arrTemp)
                                        if(doseStatus == 'no'){
                                            radioObj[ele.code] = 'no'
                                        }else{
                                            radioObj[ele.code] = 'yes'
                                        }
                                    }
            
                                })
                                
                            }
            
                        })
                        setRadioValue(radioObj)
                        setTempMedicineTakenEvent([radioObj])
                        setMedicineTable(_.sortBy(arrTemp, treatmentRegimenId))
                        if(doseStatus == 'yes'){
                            setMedicineList('yes')
                        }else{
                            setMedicineList('no')
                        }
                    }else{
                    setMedicineTable([])
                    setRadioValue({})
                    setTempMedicineTakenEvent([])
                    }
                }else{
                setMedicineTable([])
                setRadioValue({})
                setTempMedicineTakenEvent([])
                }
            }).catch(err => {
                setGlobalSpinner(false)
            })
        }else{
            swal({
                title: t("Error"),
                text: t("Data could not be save in offline mode."),
                icon: "error",
                button: t("Close"),
              });
        }
    }

    const getDataElementsVariables = (type) =>{
        try{
            let stageID = type == "TPT" ? adherenceTPTStageId : adherenceTBStageId;
            let regimenStageID = type == "TPT" ? tptIntiationStageId : tbTretmentInitiationStageId;
            let currentStage = _.find(programData.programs[0].programStages,{id:stageID})
            let currentRegimeStage = _.find(programData.programs[0].programStages,{id:regimenStageID})
            setAdherenceStageId(stageID)
            setRegimenStageId(regimenStageID)
            let tempobj = {}
            currentStage.programStageDataElements.map(de => {
                let fieldname = de.dataElement.description ? de.dataElement.description : de.dataElement.formName ? de.dataElement.formName : de.dataElement.displayName
                if (fieldname) {
                    if (fieldname.trim().toLocaleLowerCase() == "date medicine taken" || fieldname.trim().toLocaleLowerCase() == "tb_date medicine taken") { //TB Test result
                        setDateMedicineTakenId(de.dataElement.id);
                        setMedicineTakenDateBO(de.dataElement);
                        tempobj = { ...tempobj, ['dateMedicineTakenId']: de.dataElement.id };
                    }

                    if (fieldname.trim().toLocaleLowerCase() == "medicine taken" || fieldname.trim().toLocaleLowerCase() == "tb_medicine taken") { //TB Test result
                        setMedicineTakenId(de.dataElement.id);
                        setMedicineTakenBO(de.dataElement);
                        tempobj = { ...tempobj, ['medicineTakenId']: de.dataElement.id };
                    }

                    if (fieldname.trim().toLocaleLowerCase() == "colour code") { //TB Test result
                        setMedicineColorCodeId(de.dataElement.id);
                        tempobj = { ...tempobj, ['medicineColorCodeId']: de.dataElement.id };
                    }
                    if (fieldname.trim() == "Reason for missed dose" || fieldname.trim() == "TBAdherence_Reason for missed dose") { //Date of treatment completion
                        setReasonForMissedDoseID(de.dataElement.id);
                        setReasonForMissedDoseBO(de.dataElement);
                        tempobj = { ...tempobj, ['reasonForMissedDoseID']: de.dataElement.id };
                    }
                    if (fieldname.trim() == "TPTAdherence_Remarks" || fieldname.trim() == "TBAdherence_Remarks") { //Date of treatment completion
                        setAdherenceRemarkId(de.dataElement.id);
                        tempobj = { ...tempobj, ['adherenceRemarkId']: de.dataElement.id };
                    }
                    if (fieldname.trim() == "TPTAdherence_Date for in-person meeting" || fieldname.trim() == "TBAdherence_Date of in-person meeting") { //Date of treatment completion
                        setDateforinpersonmeetingId(de.dataElement.id);
                        tempobj = { ...tempobj, ['dateforinpersonmeetingId']: de.dataElement.id };
                    }
                    if (fieldname.trim() == "Misseddose_Action" || fieldname.trim() == "TBAdherence_Missed dose action") { //Date of treatment completion
                        setMissedDoseActionId(de.dataElement.id);
                        tempobj = { ...tempobj, ['missedDoseActionId']: de.dataElement.id };
                    }
                    
                }
            })
            currentRegimeStage.programStageDataElements.map(de => {
                let fieldname = de.dataElement.description ? de.dataElement.description : de.dataElement.formName ? de.dataElement.formName : de.dataElement.displayName
                if (fieldname) {
                    if (fieldname.trim() == "Missed dose_Action" || fieldname.trim() == "TBAdherence_Interruption action") { //Date of treatment completion
                        setMissedAdherenceActionId(de.dataElement.id);
                        setMissedAdherenceActionBO(de.dataElement);
                        tempobj = { ...tempobj, ['missedAdherenceActionId']: de.dataElement.id };
                    }
                    if (fieldname.trim().toLocaleLowerCase() == "treatment adherence id") {
                        setTreatmentAdherenceId(de.dataElement.id)
                    }
                    if (fieldname.trim().toLocaleLowerCase() == "treatment regimen") {
                        setTreatmentRegimenId(de.dataElement.id)
                    }
                    if (fieldname.trim().toLocaleLowerCase() == "treatment phase") {
                        setTreatmentPhaseId(de.dataElement.id)
                    }
                    if (fieldname.trim().toLocaleLowerCase() == "treatment start date") {
                        setTreatmentStartDateId(de.dataElement.id)
                    } 
                    if (fieldname.trim().toLocaleLowerCase() == "treatment end date") {
                        setTreatmentEndDateId(de.dataElement.id)
                    }
                    if (fieldname.trim().toLocaleLowerCase() == "treatment dosage (mg)") {
                        setTreatmentDoseId(de.dataElement.id)
                    }
                }
            })
            setcustomfieldobj(tempobj);
        }catch(e){
            console.log(e)
        }
        
    }

    function submitMedicineListEventPopup(values){
        try{
            if(tempMedicineTakenEvent && tempMedicineTakenEvent.length > 0){
                const noArray = []
                const yesArray = []
                let events = [];
                let bgColor = '#4caf50'
    
                tempMedicineTakenEvent.map(temp1 => {
                    Object.keys(temp1).map(radio => {
                        if (temp1[radio] == 'yes') {
                            if (noArray.find(obj => obj.name == radio)) {
                                noArray = noArray.filter(obj => obj.name != radio)
                            }
                            yesArray.push({
                                'name': radio,
                                'value': 'yes'
                            })
                        } else {
                            if (yesArray.find(obj => obj.name == radio)) {
                                yesArray = yesArray.filter(obj => obj.name != radio)
                            }
                            noArray.push({
                                'name': radio,
                                'value': 'no'
                            })
                        }
                    })
                })
                
                if (noArray.length > 0) {
                    if ((noArray.length == medicineTable.length)) {
                        bgColor = '#ff4d4d'
                    } else {
                        bgColor = '#f58634'
                    }
                } else if ((yesArray.length == medicineTable.length)) {
                    bgColor = '#4caf50'
                } else {
                    bgColor = "#00bcd4";
                }
                
                if (events.length > 0) {
                    let findCurrentDateValue = events.find(obj => obj.start == CalendarSelectedDate)
                    if (findCurrentDateValue) {
                        findCurrentDateValue.backgroundColor = bgColor
                        findCurrentDateValue.medicineTaken = tempMedicineTakenEvent
                    } else {
                        events.push(
                            {
                                start: CalendarSelectedDate,
                                end: CalendarSelectedDate,
                                allDay: true,
                                backgroundColor: bgColor,
                                display: 'background',
                                overlap: false,
                                medicineTaken: tempMedicineTakenEvent
                            }
                        )
                    }
                } else {
                    events.push(
                        {
                            start: CalendarSelectedDate,
                            end: CalendarSelectedDate,
                            allDay: true,
                            backgroundColor: bgColor,
                            display: 'background',
                            overlap: false,
                            medicineTaken: tempMedicineTakenEvent
                        }
                    )
                }
                console.log("events ",events,tempMedicineTakenEvent);
                submitTBAdherence(events)
                setOpenMedicineListEventPopup(null)
            }else{
                swal({
                title: t("Info"),
                text: t("Please select medicine taken status!"),
                icon: "info",
                button: t("Close"),
                });
            }
        }catch(e){
            console.log(e);
        }
    }

    function submitTBAdherence(fullCalendarEvents){
        if (fullCalendarEvents.length > 0) {
            const updateURL = 'events.json'//'33/events?strategy=CREATE_AND_UPDATE'
            const currentStage = _.find(programData.programs[0].programStages,{id:adherenceTBStageId})
            const orgUnit = sessionUserBoValue.organisationUnits[0].id
            const programId = programData.programs[0].id
            const referalAPIObject = { "events": [] }
            let CreateStageEventInput =
            {
                "program": programId,
                "programStage": currentStage.id,
                "orgUnit": orgUnit,
                "trackedEntityInstance": trackedEntityInstanceId,
                "status": "COMPLETED",
                "notes": [],
                "enrollment": '',
                //"dueDate": moment().format("YYYY-MM-DD"),
                "eventDate": moment().format("YYYY-MM-DD"),
                //"completedDate": moment().format("YYYY-MM-DD")
            }
            fullCalendarEvents.map(event => {
                if(!event.hasOwnProperty("editmode")){
                 if(medicineTable.length > 0){
                    medicineTable.map(row => {
                        console.log("row ",row)
                        const regimenConfigObject = _.find(Configuration.treatmentRegimens, { 'code': row[treatmentRegimenId], 'phase': row[treatmentPhaseId] });
                        if (regimenConfigObject != undefined) {
                            //debugger
                            let fieldDetails = _.filter(currentStage.programStageDataElements, ['dataElement.description', regimenConfigObject.associatedFieldName])
                            let objvalueToStore = [];
                            let rowdata = Object.assign({}, row);
                            let obj = {}
                            if(fieldDetails && fieldDetails.length > 0){
                              obj = {
                                  "dataElement": fieldDetails[0].dataElement.id,
                                  "value": rowdata['medicine']['code']
                              }
                            }
                            if(!_.isEmpty(obj)){
                              objvalueToStore.push(Object.assign({}, obj))
                            }
                            let medicineTakenValue = radioValue && !_.isEmpty(radioValue) && (_.get(radioValue, rowdata['medicine']['code'])) ? _.get(radioValue, rowdata['medicine']['code']) : 'yes';
                            try{
                            if(_.isArray(event.medicineTaken)){
                                event.medicineTaken.map(med=>{
                                    Object.keys(med).map(medName => {
                                        if(rowdata['medicine']['code'] == medName){
                                            medicineTakenValue = med[medName]
                                        }
                                    })
                                })
                            }
                            }catch(e){
                                console.log(e)
                            }
                            console.log("medicineTakenValue ",medicineTakenValue)
                            objvalueToStore.push(Object.assign({},
                                {
                                    "dataElement": medicineTakenId,
                                    "value": medicineTakenValue? medicineTakenValue : radioValue && !_.isEmpty(radioValue) && (_.get(radioValue, rowdata['medicine']['code'])) ? _.get(radioValue, rowdata['medicine']['code']) : event.medicineTaken ? event.medicineTaken : 'yes'
                                }
                            ))
                            //push date medicine taken
                            objvalueToStore.push({ "dataElement": dateMedicineTakenId, "value": event.start })

                            //push color code
                            objvalueToStore.push(Object.assign({},{ "dataElement": medicineColorCodeId, "value": event.backgroundColor }))

                            //push adherenceid
                            objvalueToStore.push(Object.assign({}, { "dataElement": treatmentAdherenceId, "value": rowdata[treatmentAdherenceId] }))
                            
                            CreateStageEventInput['dataValues'] = _.uniqBy(objvalueToStore, 'dataElement');
                            referalAPIObject.events.push(Object.assign({}, CreateStageEventInput))
                            console.log("event ",event,CreateStageEventInput)
                        }
                        
                    })
                  }
                }
            })
            //console.log("referalAPIObject ",referalAPIObject);
            //return;
            if(navigator.onLine){
                setGlobalSpinner(true)
                apiServices.postAPI(updateURL, referalAPIObject)
                    .then(stageResponse => {
                        swal({
                            title: t("Success"),
                            text: t("Adherence marked successfully."),
                            icon: "success",
                            button: t("Close"),
                        });
                        setGlobalSpinner(false)
                        loadAdherenceList(input,'resetlist')
                    }).catch(err => {
                        setGlobalSpinner(false)
                    })
            }    
        }
    }
    
    function handleMedicineTakenRadioChange(event,name) {
        try{
            let radioObj = {};
            radioObj[name] = event.target.value;
            //setRadioValue(radioObj)
            //console.log("tempMedicineTakenEvent ",tempMedicineTakenEvent,[...tempMedicineTakenEvent])
            let medicineTakenEvent = [...tempMedicineTakenEvent]
            //medicineTakenEvent.push(radioObj)
            //setTempMedicineTakenEvent(medicineTakenEvent)
            if (tempMedicineTakenEvent.length > 0) {
                let findCurrentMedicine = tempMedicineTakenEvent.find(function(e) { return e.hasOwnProperty(name) })
                if (findCurrentMedicine) {
                    findCurrentMedicine[name] = event.target.value
                } else {
                    medicineTakenEvent.push(radioObj)
                }
            } else {
                medicineTakenEvent.push(radioObj)
            }
            //console.log("medicineTakenEvent ",medicineTakenEvent);
            setTempMedicineTakenEvent(null)
            setTimeout(() => {
                setTempMedicineTakenEvent(medicineTakenEvent)
                setRadioValue(medicineTakenEvent[0])
            }, 10)
        }catch(e){
            console.log(e);
        }
    }

    const handleAdherenceFilterChange = (event) =>{
        setAdherenceFilterValue(event.target.value)
        //getDataElementsVariables(event.target.value)
    }
    
    return (
        <div className={classes.container}>
            <main
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }}
            >
                <section className="searchcustombg searchtabmaindiv referalcasespage adherencemonitoringsection"
                    style={{
                        backgroundColor: '#fff',
                        flexGrow: 1,
                        padding: 0,
                    }}
                >
                    <FooterMenu></FooterMenu>
                    {/* {loading ?
                        <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
                            <CircularLoader large dataTest="dhis2-uicore-circularloader" />
                        </CenteredContent>
                        : ""
                    } */}

                    <Grid container spacing={3} className=" mb-30px">
                        <Grid item xs={12} sm={12} md={12} className="registration-page">
                            <div className='row'>
                            <p className="alertformheading fl-left">{
                                tabPanelValue === 0 ? 
                                    t("Mark Adherence") +" ("+ input +")" : 
                                tabPanelValue === 1 ?
                                    t("Manage Missed Doses") :
                                    t("Manage Treatment Interruptions")
                                }
                            </p>
                            {
                            
                            clientList && clientList.length > 0 && page  && Configuration != null && tabPanelValue === 0?
                            <div className={adherenceFilterValue == 'TB' ? 'fl-right mark-all hide' : 'fl-right mark-all'}> 
                                {/* <Tooltip title={t("Mark Aderence For All")} arrow> */}
                                    {
                                        window.document.body.clientWidth < 800 || window.cordova ?
                                            <DoneAllIcon className="markalladherence-action" onClick={() => submitAllAdherenceAction({})} />
                                        :
                                            <Button className="markalladherence-action-btn" onClick={() => submitAllAdherenceAction({})}>{t("Mark Dose Taken For All")}</Button>
                                    }
                                    
                                {/* </Tooltip> */}
                                {/* <Button className="markalladherence-action" onClick={() => submitAllAdherenceAction({})}>{t("Mark Aderence For All")}</Button> */}
                            </div>
                            :<></>
                            } 
                            </div>
                            <Grid container spacing={3} xs={12} lg={12} className="adherence-filter">
                                {/* <FormControl component="fieldset">
                                    <RadioGroup row aria-label="filter-adherence" name="filter-adherence" value={adherenceFilterValue} onChange={(env) => handleAdherenceFilterChange(env)}>
                                        <FormControlLabel value="TB" control={<Radio />} label={t("TB")} />
                                        <FormControlLabel value="TPT" control={<Radio />} label={t("TPT")} />
                                    </RadioGroup>
                                </FormControl> */}
                            </Grid>
                            <SearchBar 
                                input={input} 
                                setKeyword={updateInput}
                                fieldType={tabPanelValue === 0 ? "date" : 'text'}
                            />
                            <div className=' customregistrationtabs regcasetabs taskListFooter'>
                                <AppBar position="static">
                                    <Tabs
                                        value={tabPanelValue}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons="on"
                                        indicatorColor="primary"
                                        //textColor="primary"
                                        aria-label="scrollable force tabs example"
                                    >
                                        <Tab label={t("Mark Adherence")} {...a11yProps(0)} />
                                        <Tab label={t("Manage Missed Doses")} {...a11yProps(1)} />
                                        <Tab label={t("Manage Treatment Interruptions")} {...a11yProps(2)} />
                                    </Tabs>
                                </AppBar>
                            </div>
                        </Grid>
                        <TabPanel value={tabPanelValue} index={0} className="regscrolltabs layoutscrolltabs referalscrolltabs margin-top-0">
                            <Grid container spacing={3}>
                               {
                                clientList && clientList.length > 0 && page  && Configuration != null ?
                                    clientList
                                    .slice((page - 1) * Configuration.pagination.itemsPerPage, page * Configuration.pagination.itemsPerPage)
                                    .map((obj,i) => {
                                        return renderRefferalCard(obj,i,"marked")
                                    })
                                :
                                <></>
                               }
                                
                            </Grid>
                        </TabPanel>
                        <TabPanel value={tabPanelValue} index={1} className="regscrolltabs layoutscrolltabs referalscrolltabs margin-top-0">
                            <Grid container spacing={3}>
                            {
                                missedAdherenceClientList && missedAdherenceClientList.length > 0 && page  && Configuration != null ?
                                missedAdherenceClientList
                                    .slice((page - 1) * Configuration.pagination.itemsPerPage, page * Configuration.pagination.itemsPerPage)
                                    .map((obj,i) => {
                                        return renderRefferalCard(obj,i,"missed")
                                    })
                                :
                                <></>
                               }
                            </Grid>
                        </TabPanel>
                        <TabPanel value={tabPanelValue} index={2} className="regscrolltabs layoutscrolltabs referalscrolltabs margin-top-0">
                        {
                            treatmentInterruptionsClientList && treatmentInterruptionsClientList.length > 0 && tabPanelValue == 2 ?      
                            
                            <Grid className={"datatable-block"} container spacing={3}>
                                <DataTable
                                //title="Line List"
                                striped="true"
                                responsive="true"
                                pagination
                                fixedHeader="true"
                                columns={columns}
                                //data={casesData}
                                data={treatmentInterruptionsClientList.filter((item) => {
                                    return item;
                                })}
                                />
                            </Grid>
                            
                            : treatmentInterruptionsClientList && treatmentInterruptionsClientList.length == 0 ?<div className='no-records-block'>{t("No records found.")}</div>
                            :<></>
                        }
                        </TabPanel>
                        {
                            tabPanelValue != 2 ?
                                <div style={{marginLeft:"30px"}}>
                                <Pagination
                                    count={noOfPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    defaultPage={1}
                                    //color="primary"
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                    variant="outlined" 
                                    shape="rounded" 
                                />
                                </div>
                            :   <></>
                        }
                        {
                            openMissedReasonPopup ? 
                            <>
                            <div className="modaloverlay eventpopup">
                                <div className="modalcardholder">
                                    <Card className="modalcard">
                                        <CardHeader
                                            className="modalheader"
                                            action={
                                                <IconButton aria-label="close">
                                                    <CloseIcon onClick={() => setOpenMissedReasonPopup(null)} />
                                                </IconButton>
                                            }
                                            title={clientName ? clientName : t("Medication Adherence")}
                                        />
                                        <Form
                                        onSubmit={onEventSubmit}
                                        //initialValues={{ stooge: 'larry', employed: false }}
                                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                                        <form onSubmit={handleSubmit}> 
                                        <CardContent className="modalbodycontent">
                                        <Grid container spacing={3} className="customregistrationtabs" style={{padding:"10px"}}>
                                            <Grid xs={12} md={12}>
                                                <label class="MuiFormLabel-root">{medicineTakenDateBO ? getTranslatedDataElementLabels(medicineTakenDateBO) : t('Selected Date')}</label>
                                                <TextField
                                                    hiddenLabel
                                                    name={"medicine-date"}
                                                    id="medicine-date"
                                                    defaultValue={CalendarSelectedDate ? CalendarSelectedDate : ''}
                                                    value={CalendarSelectedDate ? CalendarSelectedDate : ''}
                                                    //variant="filled"
                                                    size="small"
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid xs={12} md={12}>
                                                &nbsp;
                                            </Grid>
                                            <Grid xs={12} md={12}>
                                            
                                                {
                                                (programData && programData.programs ?

                                                programData.programs[0].programStages.find(obj => obj.id == adherenceStageId) ?
                                                    //renderStageBySection(programData.programs[0].programStages.find(obj => obj.id == adherenceStageId),{},{},{},{})
                                                    programData.programs[0].programStages.find(obj => obj.id == adherenceStageId).programStageDataElements.map(fields => {
                                                        if(fields.dataElement && fields.dataElement.id != reasonForMissedDoseID){
                                                            return;
                                                        }else{
                                                            return renderStageField(fields, values, {}, programData.programs[0].programStages.find(obj => obj.id == adherenceStageId).programStageDataElements,programData.programs[0].programStages.find(obj => obj.id == adherenceStageId))
                                                        }
                                                    })
                                                :
                                                <></>
                                                :
                                                    <></>)
                                                }    
                                        </Grid> 
                                        </Grid>       
                                        
                                        </CardContent>
                                        <CardActions className="modalfooter">
                                            <Button className="regSearchCancelButton" onClick={() => setOpenMissedReasonPopup(null)}>{t('Cancel')}</Button>
                                            <Button className="modalactionbtn" onClick={() => submitMissedMedicineStatus(values)}>{t('Submit')}</Button>
                                        </CardActions>
                                        </form>
                                        )}
                                        />
                                    </Card>
                                </div>
                            </div>
                            </> 
                            :
                            <></>
                        }

                        {
                            treatmentInterruptionActionPopup && missedAdherenceActionId ? 
                            <>
                            <div className="modaloverlay eventpopup">
                                <div className="modalcardholder">
                                    <Card className="modalcard">
                                        <CardHeader
                                            className="modalheader"
                                            action={
                                                <IconButton aria-label="close">
                                                    <CloseIcon onClick={() => setTreatmentInterruptionActionPopup(null)} />
                                                </IconButton>
                                            }
                                            title={clientName ? clientName : t("Action")}
                                        />
                                        <Form
                                        onSubmit={onEventSubmit}
                                        //initialValues={{ stooge: 'larry', employed: false }}
                                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                                        <form onSubmit={handleSubmit}> 
                                        <CardContent className="modalbodycontent">
                                        <Grid container spacing={3} className="customregistrationtabs" style={{padding:"10px"}}>
                                            <Grid xs={12} md={12}>
                                                &nbsp;
                                            </Grid>
                                            <Grid xs={12} md={12}>
                                            
                                                {
                                                (programData && programData.programs ?

                                                programData.programs[0].programStages.find(obj => obj.id == regimenStageId) ?
                                                    //renderStageBySection(programData.programs[0].programStages.find(obj => obj.id == adherenceStageId),{},{},{},{})
                                                    programData.programs[0].programStages.find(obj => obj.id == regimenStageId).programStageDataElements.map(fields => {
                                                        if(fields.dataElement && fields.dataElement.id != missedAdherenceActionId){
                                                            return;
                                                        }else{
                                                            return renderStageField(fields, values, {}, programData.programs[0].programStages.find(obj => obj.id == regimenStageId).programStageDataElements,programData.programs[0].programStages.find(obj => obj.id == regimenStageId))
                                                        }
                                                    })
                                                :
                                                <></>
                                                :
                                                    <></>)
                                                }    
                                        </Grid> 
                                        </Grid>       
                                        
                                        </CardContent>
                                        <CardActions className="modalfooter">
                                            <Button className="regSearchCancelButton" onClick={() => setTreatmentInterruptionActionPopup(null)}>{t('Cancel')}</Button>
                                            <Button className="modalactionbtn" onClick={() => submitTreatmentInterruptionAction(values)}>{t('Submit')}</Button>
                                        </CardActions>
                                        </form>
                                        )}
                                        />
                                    </Card>
                                </div>
                            </div>
                            </> 
                            :
                            <></>
                        }

                        {
                            missedDoseActionPopup && missedDoseActionId ? 
                            <>
                            <div className="modaloverlay eventpopup">
                                <div className="modalcardholder">
                                    <Card className="modalcard">
                                        <CardHeader
                                            className="modalheader"
                                            action={
                                                <IconButton aria-label="close">
                                                    <CloseIcon onClick={() => setMissedDoseActionPopup(null)} />
                                                </IconButton>
                                            }
                                            title={clientName ? clientName : t("Action")}
                                        />
                                        <Form
                                        onSubmit={onEventSubmit}
                                        //initialValues={{ stooge: 'larry', employed: false }}
                                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                                        <form onSubmit={handleSubmit}> 
                                        <CardContent className="modalbodycontent">
                                        <Grid container spacing={3} className="customregistrationtabs" style={{padding:"10px"}}>
                                            <Grid xs={12} md={12}>
                                                &nbsp;
                                            </Grid>
                                            <Grid xs={12} md={12}>
                                                {
                                                (programData && programData.programs ?

                                                programData.programs[0].programStages.find(obj => obj.id == adherenceStageId) && 
                                                programData.programs[0].programStages.find(obj => obj.id == adherenceStageId).programStageDataElements 
                                                //&& programData.programs[0].programStages.find(obj => obj.id == adherenceStageId).programStageSections &&
                                                //programData.programs[0].programStages.find(obj => obj.id == adherenceStageId).programStageSections.find(section => section.description == "Adherence Monitoring") 
                                                ?
                                                    //renderStageBySection(programData.programs[0].programStages.find(obj => obj.id == adherenceStageId),{},{},{},{})
                                                    //programData.programs[0].programStages.find(obj => obj.id == adherenceStageId).programStageSections.find(section => section.description == "Adherence Monitoring").dataElements.map(de => {

                                                        programData.programs[0].programStages.find(obj => obj.id == adherenceStageId).programStageDataElements.map(fields => {
                                                            
                                                            if(fields.dataElement && fields.dataElement.id != adherenceRemarkId && fields.dataElement.id != missedDoseActionId && fields.dataElement.id != dateforinpersonmeetingId){
                                                                return;
                                                            }else{
                                                                //if(de.id == fields.dataElement.id){
                                                                    return renderStageField(fields, values, {}, programData.programs[0].programStages.find(obj => obj.id == adherenceStageId).programStageDataElements,programData.programs[0].programStages.find(obj => obj.id == adherenceStageId))
                                                                //}
                                                            }
                                                        })
                                                   // })
                                                :
                                                <></>
                                                :
                                                    <></>)
                                                }    
                                        </Grid> 
                                        </Grid>       
                                        
                                        </CardContent>
                                        <CardActions className="modalfooter">
                                            <Button className="regSearchCancelButton" onClick={() => setMissedDoseActionPopup(null)}>{t('Cancel')}</Button>
                                            <Button className="modalactionbtn" onClick={() => submitMissedDoseAction(values)}>{t('Submit')}</Button>
                                        </CardActions>
                                        </form>
                                        )}
                                        />
                                    </Card>
                                </div>
                            </div>
                            </> 
                            :
                            <></>
                        }

            {
            openMedicineListEventPopup ? 
            <>
             <div className="modaloverlay eventpopup">
                <div className="modalcardholder">
                    <Card className="modalcard">
                        <CardHeader
                            className="modalheader"
                            action={
                                <IconButton aria-label="close">
                                    <CloseIcon onClick={() => setOpenMedicineListEventPopup(null)} />
                                </IconButton>
                            }
                            title={t("Medication Adherence")}
                        />
                        <Form
                        onSubmit={onEventSubmit}
                        //initialValues={{ stooge: 'larry', employed: false }}
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                        <form onSubmit={handleSubmit}> 
                        <CardContent className="modalbodycontent">
                        <Grid container spacing={3} className="" style={{padding:"10px"}}>
                            <Grid xs={12} md={12}>
                                <label class="MuiFormLabel-root">{medicineTakenDateBO ? getTranslatedDataElementLabels(medicineTakenDateBO) : t("Selected Date")}</label>
                                <TextField
                                    hiddenLabel
                                    name={"medicine-date"}
                                    id="medicine-date"
                                    defaultValue={CalendarSelectedDate ? CalendarSelectedDate : ''}
                                    value={CalendarSelectedDate ? CalendarSelectedDate : ''}
                                    //variant="filled"
                                    size="small"
                                    disabled
                                />
                            </Grid>
                            
                            <Grid container spacing={3} style={{ marginTop: '10px', marginBottom: '10px' }}>
                                {medicineTable && medicineTable.length > 0 && medicineTable.map(med => {
                                    return <Grid container spacing={3} className="ml-10px mr-10px mt-10px mb-10px bg-lightgrey" component={Paper}>
                                        <Grid item xs={6} lg={6} className={'align-items-center'}>
                                            <span>{med.medicine.displayName}</span>{/*JSON.stringify(med)*/}
                                        </Grid>
                                        <Grid item xs={6} lg={6} className={'formradioholder'}>
                                            {/* <Formradio></Formradio> */}
                                            
                                            <FormControl component="fieldset">
                                                <RadioGroup row aria-label="gender" name={med.medicine.code} value={radioValue && radioValue[med.medicine.code] ? radioValue[med.medicine.code] : 'yes'} onChange={(env) => handleMedicineTakenRadioChange(env, med.medicine.code)}>
                                                    <FormControlLabel value="yes" control={<Radio />} label={t("Yes")}/>
                                                    <FormControlLabel value="no" control={<Radio />} label={t("No")} />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>

                                    </Grid>
                                })}
                            </Grid>
                        
                        </Grid>       
                        
                        </CardContent>
                        <CardActions className="modalfooter">
                            <Button className="regSearchCancelButton" onClick={() => setOpenMedicineListEventPopup(null)}>{t('Cancel')}</Button>
                            <Button className="modalactionbtn" onClick={() => submitMedicineListEventPopup(values)}>{t('Submit')}</Button>
                        </CardActions>
                        </form>
                        )}
                        />
                    </Card>
                </div>
            </div>
            </> 
            :
            <></>
        }
                                      
                    </Grid>
                </section>
            </main>
        </div>
    )
};
export default AdherenceManagement;