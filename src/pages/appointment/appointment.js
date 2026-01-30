import React, { useState,useEffect } from 'react'
import classes from '../../App.module.css'
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation, Trans , useTranslation } from 'react-i18next';
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import swal from 'sweetalert'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//import FooterMenu from '../../component/layout/FooterMenu';
import PeopleIcon from "@material-ui/icons/People";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import { apiServices } from "../../services/apiServices";
import OfflineDb from '../../db'
import moment from 'moment'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';

function Appointment(){
    const [ConfigurationFromServer,setConfigurationFromServer] = useState(null);
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [programData,setProgramData] = useState(null)
    const {t} = useTranslation()
    const history = useHistory();
    const [fullCalendarEvents, setFullCalendarEvents] = useState([])
    const [fullCalenderSelectedDate, setFullCalenderSelectedDate] = useState(null)
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [clientPatientType, setClientPatientType] = useState(null)
    const [clientName, setClientName] = useState(null)
    const [calendarEventPopup, setCalendarEventPopup] = useState(null)
    const [appointmentData, setAppointmentData] = useState(null)
    const [clientDetails, setClientDetails] = useState(null)
    const getSelectedDays = (days) => {
        console.log(days)
    }
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    //once user bco is set call getContactList function
    
    async function getUserBo() {
      let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
      setSessionUserBoValue(loginDetails.data);
      
      let configurations = await OfflineDb.getDataFromPouchDB('configurations')
      setConfigurationFromServer(configurations.data.configuration)

      let metadata = await OfflineDb.getDataFromPouchDB('metaData')
      setProgramData(metadata.data)
    }

    useEffect(() => {
      getUserBo();
    }, []);

    useEffect(() => {
      if(programData != null && sessionUserBoValue != null){
        getAppointmentList();
      }
    }, [programData,sessionUserBoValue]);

    useEffect(() => {
      if(clientDetails != null){
        setCalendarEventPopup(true)
      }
    }, [clientDetails]);

    const getAppointmentList = () => {
      try{
      console.log("sessionUserBoValue. ",sessionUserBoValue);
      let apiUrl = '/referral/adherence/schedule/list'
      const orgUnit = sessionUserBoValue.organisationUnits[0].id
      const programId = programData.programs[0].id
      const userID = sessionUserBoValue.userCredentials.id
      let param = {
          "programid":programId,
          "ouid":orgUnit,
          "type":"ALL",
          "userid":userID
      }
      setGlobalSpinner(true)
        apiServices.postAPI(apiUrl,param)
            .then(response => {
                setGlobalSpinner(false);
                console.log("response ",response);
                let events = [];
                if(response && response.data && response.data.data){
                  setAppointmentData(response.data.data)
                  response.data.data.map(event => {
                    let obj = {};
                    obj['start'] = moment(event["scheduled_date"]).format('YYYY-MM-DD')
                    obj['end'] = moment(event["scheduled_date"]).format('YYYY-MM-DD')
                    obj['allDay'] = true
                    obj['backgroundColor'] = event.Type == 'TB' ? '#1ABC9C' : '#5DADE2'
                    obj['display'] = 'background'
                    obj['overlap'] = false
                    events.push(obj)
                  })
                }
                setFullCalendarEvents(events)
            }).catch(response => {
              setGlobalSpinner(false);
            })
    }catch(e){
      setGlobalSpinner(false);
    }
    }

    function resetEventDetails(){
      setCalendarEventPopup(null)
      setClientName(null)
      setClientPatientType(null)
  }

    const handleDateSelect = (selectInfo) =>{
      let selectedDate = selectInfo.dateStr
      let selectedEvent = appointmentData.filter(obj => {
        return moment(obj["scheduled_date"]).format('YYYY-MM-DD') == selectedDate
      })
      console.log("selectedEvent ",selectedEvent);
      if(selectedEvent && selectedEvent.length > 0){
          setClientName(selectedEvent[0]["Patientname"])
          setClientPatientType(selectedEvent[0]["Type"])
          setClientDetails(selectedEvent[0])
          //setClientPatientType(selectedEvent[0]["Type"])
      }
    }
    return (
      <>
      <div className='appointment-calendar'>
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar= {{
                left: 'prev',
                center: 'title',
                right: 'today next'}
            }
            weekends={true}
            unselectAuto={false}
            initialDate={fullCalenderSelectedDate ? fullCalenderSelectedDate : new Date()}
            events={fullCalendarEvents}
            dateClick={(env) => handleDateSelect(env)}
            selectable={true}
        />
      {/* <div className='appointment-calendar'>
      <Calendar month={currentMonth} title={t("Scheduled Meetings")} selectColor={'red'} days={['Sun','Mon','Tue','Wed','Thu','Fri','Sat']} getSelectedDays={getSelectedDays} year={currentYear} selectedDays={ {'2020-5': [{ '3': { 'info': 'testing', color :'red' } }, {'8': { 'info': 'testing2' }}] }} />
      </div> */}
      </div>
      {
            calendarEventPopup != null ? 
            <>
             <div className="modaloverlay">
                <div className="modalcardholder">
                    <Card className="modalcard">
                        <CardHeader
                            className="modalheader"
                            action={
                                <IconButton aria-label="close">
                                    <CloseIcon onClick={() => resetEventDetails(null)} 
                                    />
                                </IconButton>
                            }
                            title={"Client Details"}
                        />
                        <CardContent className="modalbodycontent">
                            <>
                                <p className="alerts_description_fields row-block">
                                <div className="fl-left"><b>{t("Client Name")}</b></div><div className="fl-left"> : {clientDetails ? clientDetails["Patientname"] : t('N/A')}</div>
                                </p>
                                <p className="alerts_description_fields row-block">
                                <div className="fl-left"><b>{t("Client Type")}</b></div><div className="fl-left"> : {clientDetails ? clientDetails["Clienttype"] : t('N/A')}</div>
                                </p>
                                <p className="alerts_description_fields row-block">
                                <div className="fl-left"><b>{t("Gender")}</b></div><div className="fl-left"> : {clientDetails ? clientDetails["Gender"] : t('N/A')}</div>
                                </p>
                                <p className="alerts_description_fields row-block">
                                <div className="fl-left"><b>{t("Phonenumber")}</b></div><div className="fl-left"> : {clientDetails ? clientDetails["PhoneNumber"] : t('N/A')}</div>
                                </p>
                                <p className="alerts_description_fields row-block">
                                <div className="fl-left"><b>{t("Type")}</b></div><div className="fl-left"> : {clientDetails ? clientDetails["Type"] : t('N/A')}</div>
                                </p>
                            </>
                        </CardContent>
                    </Card>
                </div>
            </div>
            </> 
            :
            <></>
        }
      </>
      );
    
}
export default Appointment;