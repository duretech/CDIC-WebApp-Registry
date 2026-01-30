import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";
// import classes from '../../App.module.css' 
import Grid from '@material-ui/core/Grid';
import '../../assets/css/custom.css'
import Typography from '@material-ui/core/Typography';
import imgUrl from '../../assets/images/imageUrl.js';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import moment from 'moment'
import { ButtonStrip, InputFieldFF, SingleSelectFieldFF, ReactFinalForm, hasValue, AlertBar, CircularLoader, CenteredContent } from '@dhis2/ui';


import {
    TextField,
    Checkboxes,
    CheckboxData,
    Radios,
    Select,
    TimePicker,
    Switches,
    KeyboardDatePicker,
    DatePicker,
    DateTimePicker,
    Autocomplete,
} from "mui-rff";
import {
    Button,
} from '@dhis2/ui';
import OfflineDb from '../../../db'

const { Form, Field, FormSpy } = ReactFinalForm

export default function Reminder() {
    var reminder = {};

    const history = useHistory();
    const [user,setuser]= React.useState('')
    const [storage,setstorage]= React.useState('')
    const [selectedDate, setDate] = React.useState(new Date());
    const [selectedEndDate, setEndDate] = React.useState(new Date());
    const [selectedTime, setTime] = React.useState('');

    useEffect(()=>{
        OfflineDb.getDataFromPouchDB('loginDetails').then(res=>{
            console.log(res)
            setuser(res.data)
        })
        setstorage(function() {
            var total = 0;
            for (var x in localStorage) {
                // Value is multiplied by 2 due to data being stored in `utf-16` format, which requires twice the space.
                var amount = (localStorage[x].length * 2) / 1024 / 1024;
                if (!isNaN(amount) && localStorage.hasOwnProperty(x)) {
                    // console.log(x, localStorage.getItem(x), amount);
                    total += amount;
                }
            }
            return total.toFixed(2);
        })
    },[])

    function handleBack() {
        window.history.back();
    }
   
    function handleSubmit() {

    }

    function onSubmit() {

        var formatedRemDate = formatAMPM(selectedTime);
            var hours = formatedRemDate[0];
            var minutes = formatedRemDate[1];
            var result = hours + ':' + minutes
            console.log("myResult", result);

        var reminderJson = {
            "date": selectedDate,
            "startDate": selectedDate,
            "endDate": selectedEndDate,
            "note": document.getElementById('rem-note').value,
            "duration": "Daily",
            "reminder": user.firstName+' : ' + document.getElementById('rem-reminder').value,
            "time": result
        }
    
        // if ($('#rem-reminder').val() == '') {
        //     application.alert(translations.translateKeyIfExist('lbl.givetitleToReminder', "Please give a title to your reminder."));
        // } else if ($('#rem-date').val() == '') {
        //     application.alert(translations.translateKeyIfExist('lbl.setaStartDate', "Please set a start date"));
        // } else if ($('#rem-end-date').val() == '') {
        //     application.alert(translations.translateKeyIfExist('lbl.setaendStartDate', "Please set a end date"));
        // } else {
            console.log("reminderJson", reminderJson);
          //  window.confirm('Are you sure want to save this reminder', function (yes) {
                var storageNot = JSON.parse(localStorage.getItem('reminders'));
                if (!storageNot)
                    storageNot = [];
                storageNot.push(reminderJson);
                localStorage.setItem('reminders', JSON.stringify(storageNot))
                setLocalNotification(reminderJson);
                
            //})
        //}
    }

    function handleDateChange(e) {
        setDate(e)
    }

    function handleEndDateChange(e) {
        setEndDate(e)
    }

    function handleTimeChange(e) {
        setTime(e)
    }

    function setLocalNotification(params) {
        console.log("reminer params::", params);
    
        if (window.cordova) {
            console.log("Plugin", window.cordova.plugin)
            console.log("Local::",window.cordova.plugins.notification)
            // set success submission local notification
            // window.cordova.plugins.notification.local.schedule([{
            //     title: params.reminder,
            //     text: 'Reminder has been set successfully.',
            //     trigger: {
            //         at: new Date()
            //     }
            // }]);
        }
        setRemArray(params);
    }

    function getNextDay(currentDate, increment) {
        var today = new Date(currentDate);
        var singleDay = 24 * 60 * 60 * 1000;
        var tomorrow = new Date(today.getTime() + (singleDay * increment) - singleDay);
        var myDate = tomorrow.getMonth() + 1 + '-' + tomorrow.getDate() + '-' + tomorrow.getFullYear();
        return myDate;
    }
   
    function setRemArray(params) {
        
        console.log("params::", params)
        var notiObject = [];
        var startDate = new Date(params.startDate);
        var endDate = new Date(params.endDate);
        params.date = moment(params.date, 'MMM-DD-YYYY').format("YYYY-MM-DD");
        if (localStorage.getItem('lastNotiId')) {
           let lastNotiId = localStorage.getItem('lastNotiId');
        } else {
            localStorage.setItem('lastNotiId', 0)
        }
        if (params.duration == "Daily") {
            var a = moment(startDate, 'D/M/YYYY');
            var b = moment(endDate, 'D/M/YYYY');
            var diffDays = b.diff(a, 'days');
            if (diffDays > 0) {
                for (let i = 1; i <= diffDays; i++) {
                    console.log("i::", i);
                    var currentDate = getNextDay(params.startDate, i)
                    console.log("getNextDay::", currentDate);
                    let year = params.date.split('-')[0];
                    let month = params.date.split('-')[1];
                    month = month - 1;
                    let day = params.date.split('-')[2];
    
                    if (params.time && params.time.length > 0) {
                        let h = params.time[0].split(':')[0];
                        let m = params.time[0].split(':')[1];
                        let time = new Date(year, month, day, h, m, 0, 0);
                        // (params.time).each(function (k, v) {
                        //     var tempObj = {};
                        //     tempObj.id = localStorage.getItem('lastNotiId') + 1;
                        //     localStorage.setItem('lastNotiId', tempObj.id)
                        //     tempObj.title = params.reminder;
                        //     tempObj.text = params.note;
                        //     tempObj.autoClear = false;
                        //     tempObj.led = true,
                                
                        //     tempObj.actions = [
                        //         {
                        //             id: 'SNOOZE',
                        //             title: 'SNOOZE',
                        //             identifier: 'SNOOZE'
                        //         }
                        //     ];
                        //     tempObj.trigger = {
                        //         at: time
                        //     };
                        //     tempObj.foreground = true;
                        //     notiObject.push(tempObj);
                        // })
                    }
                }
            } else {
                var currentDate = params.startDate
                console.log("getNextDay::", currentDate);
                const year = params.date.split('-')[0];
                let month = params.date.split('-')[1];
                month = month - 1;
                let day = params.date.split('-')[2];
    
                if (params.time && params.time.length > 0) {
                    let h = params.time[0].split(':')[0];
                    let m = params.time[0].split(':')[1];
                    let time = new Date(year, month, day, h, m, 0, 0);
                        var tempObj = {};
                        tempObj.id = localStorage.getItem('lastNotiId') + 1;
                        localStorage.setItem('lastNotiId', tempObj.id)
                        tempObj.title = params.reminder;
                        tempObj.text = params.note;
                        tempObj.autoClear = false;
                        tempObj.priority = 1;
                        tempObj.badge = 1;
                        tempObj.actions = [
                                {
                                    id: 'SNOOZE',
                                    title: 'SNOOZE',
                                    identifier: 'SNOOZE'
                                }
                            ];
                        tempObj.trigger = {
                            at: time
                        };
                        tempObj.foreground = true;
                        notiObject.push(tempObj);
                }
            }
        } 
        console.log('notiObject', notiObject);
        if (window.cordova) {
            var snoozecount = 1;
            window.cordova.plugins.notification.local.on('SNOOZE', function (notification, eopts) {
                if (notification.actions[0].identifier === 'SNOOZE') {
                    notiObject = [];
                    let year = new Date().getFullYear();
                    let month = new Date().getMonth();
                    let day = new Date().getDate();
                    let hh = new Date().getHours();
                    let mm = new Date().getMinutes() + 10;
                    var localtime = new Date(year, month, day, hh, mm, 0, 0);
                    var newId = Date.parse(localtime);
                    var tempObj = {};
                    tempObj.id = newId;
                    localStorage.setItem('lastNotiId', tempObj.id)
                    tempObj.title = notification.title;
                    tempObj.text = notification.text;
                    tempObj.autoClear = false;
                        tempObj.trigger = {
                            at: localtime
                        };
                    tempObj.actions = [
                            {
                                id: 'SNOOZE',
                                title: 'SNOOZE',
                                identifier: 'SNOOZE'
                                 }
                         ];
                        tempObj.badge = 1;
                    tempObj.foreground = true;
                    snoozecount=snoozecount+1;
                    notiObject.push(tempObj);
                    console.log('snoozeobj :: ', notiObject)
                    window.cordova.plugins.notification.local.schedule(notiObject)
                }
                 if (notification.actions[0].identifier === 'SNOOZE') {
                    notiObject = [];
                    let year = new Date().getFullYear();
                    let month = new Date().getMonth();
                    let day = new Date().getDate();
                    let hh = new Date().getHours();
                    let mm = new Date().getMinutes() + 60;
                    var localtime = new Date(year, month, day, hh, mm, 0, 0);
                    var newId = Date.parse(localtime);
                    var tempObj = {};
                    tempObj.id = newId;
                    localStorage.setItem('lastNotiId', tempObj.id)
                    tempObj.title = notification.title;
                    tempObj.text = notification.text;
                    tempObj.autoClear = false;
                        tempObj.trigger = {
                            at: localtime
                        };
                    tempObj.actions = [
                            {
                                id: 'SNOOZE',
                                title: 'SNOOZE',
                                identifier: 'SNOOZE'
                                 }
                         ];
                        tempObj.badge = 1;
                    tempObj.foreground = true;
                    notiObject.push(tempObj);
                    console.log('snoozeobj :: ', notiObject)
                    window.cordova.plugins.notification.local.schedule(notiObject)
                }
            })
            console.log('snoozenotiobj :: ' + notiObject)
            window.cordova.plugins.notification.local.schedule(notiObject);
            history.push('/reminderList')
        }
    }
   

    function formatAMPM (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return [hours, minutes, seconds, ampm];
    }

    return (
        <div className={window.cordova ? "certificatePage certificatePagepatient" : 'certificatePage certificatePagepatient windowdesktop'}>
            
            <Grid container className='certificatePagediv patientreggrid'>
            <Grid container xs={12} className='certinav'>

                <Grid xs={3} className='backimg'><img src={imgUrl.whiteback} onClick={() => handleBack()} className='backsvg' /></Grid>
                <Grid xs={6}>
                <Typography variant='subtitle1' className='regname oneuhcfont'>Reminder form</Typography>
                </Grid>
                <Grid xs={3}>
                </Grid>

            </Grid>
            <Grid item xs={12} className="reminderPage" id="registerform">
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form className="reminderForm" onSubmit={handleSubmit}>
                    <div className='remindFormDiv'>
                        <div className="remInput">
                        <Typography className="text-left fw-500" >Title</Typography> 
                            <div className="item-input item-input-field" style={{display: "inline-block", padding: "5px 0"}}>
                                {/* <input id="rem-reminder" className="remwidth remtitle" placeholder="Enter reminder title" type="text" autoComplete="off"/> */}

                                <select id="rem-reminder" className="form-control" >
                                    <option value="" data-i18n="lbl.selectTitle">Select Title</option>
                                    <option value="Visit health facility" data-i18n="lbl.visitFacility">Visit health facility</option>
                                    <option value="Take your medicine" data-i18n="lbl.takeMedicine">Take your medicine</option>
                                </select>
                            </div>
                        </div>
                        <div className="remInput">
                            <Typography className="text-left fw-500" >Start date</Typography> 
                                <div className="item-input item-input-field" style={{display: "inline-block", padding: "5px 0"}}>
                                <DatePicker
                                name="date"
                                dateFunsUtils={DateFnsUtils}
                                value={selectedDate}
                                margin="normal1"
                                variant="inline"
                                format="yyyy-MM-dd"
                                onChange={handleDateChange}
                                />
                                </div>
                        </div>
                        <div className="remInput">
                            <Typography className="text-left fw-500" >End date</Typography> 
                                <div className="item-input item-input-field" style={{display: "inline-block", padding: "5px 0"}}>
                                    <DatePicker
                                    name="date"
                                    dateFunsUtils={DateFnsUtils}
                                    value={selectedEndDate}
                                    margin="normal1"
                                    variant="inline"
                                    format="yyyy-MM-dd"
                                    onChange={handleEndDateChange}
                                    />                                
                                </div>
                        </div>
                        <div className="remInput">
                        <Typography className="text-left fw-500" >Add Time</Typography>
                            <div className="item-input item-input-field" style={{display: "inline-block", padding: "5px 0"}}>
                                <TimePicker
                                name="time"
                                dateFunsUtils={DateFnsUtils}
                                value={selectedTime}
                                margin="normal1"
                                variant="inline"
                                format="HH-mm"
                                onChange={handleTimeChange}
                                />
                            </div>
                        </div>
                        <div className="remInput">
                            <Typography className="text-left fw-500" >Enter note</Typography>
                            <div className="item-input item-input-field" style={{display: "inline-block", padding: "5px 0"}}>
                                <textarea id="rem-note" className="remwidth" type="textarea" placeholder="Enter note"></textarea>
                            </div>
                        </div>
                        <div >
                            <a href="#" class="floating-button rem-float-btn" onClick={onSubmit}>
                                    <AddCircleIcon />
                            </a>                   
                        </div>
                    </div>
                </form>
                )}
                />
            </Grid>
            <Grid container xs={12} className="homebottomnav">
          {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="home-svg"  onClick={()=>(!window.location.pathname.includes('imonhome')?this.props.history.push('/layout/imonhome'):'')}>
              <img src={imgUrl.homesvg} />
              <Typography variant="caption" display="block">
                Home
              </Typography>
            </Grid>:<Grid xs={4} className="home-svg" onClick={()=>(!window.location.pathname.includes('imonhome')?this.props.history.push('/layout/imonhome'):'')}>
              <img src={imgUrl.homesvg} />
              <Typography variant="caption" display="block">
                Home
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="journey-svg" onClick={()=>(!window.location.pathname.includes('myjourney')?this.props.history.push('/myjourney'):'')}>
              <img src={imgUrl.journeysvg} />
              <Typography variant="caption" display="block">
                My Journey
              </Typography>
            </Grid>:''}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?this.props.history.push('/layout/nearme'):'')}>
              <img src={imgUrl.nearsvg} />
              <Typography variant="caption" display="block">
                Near Me
              </Typography>
            </Grid>:<Grid xs={4} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?this.props.history.push('/layout/nearme'):'')}>
              <img src={imgUrl.nearsvg} />
              <Typography variant="caption" display="block">
                Near Me
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?this.props.history.push('/layout/getknowledgeable'):'')}>
              <img src={imgUrl.guidesvg} />
              <Typography variant="caption" display="block">
                Guide
              </Typography>
            </Grid>:<Grid xs={4} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?this.props.history.push('/layout/getknowledgeable'):'')}>
              <img src={imgUrl.guidesvg} />
              <Typography variant="caption" display="block">
                Guide
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="connect-svg" onClick={()=>(!window.location.pathname.includes('peerchat')?this.props.history.push('/layout/peerchat'):'')}>
              <img src={imgUrl.connectsvg} />
              <Typography variant="caption" display="block">
                Connect
              </Typography>
            </Grid>:''}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="screen-svg" onClick={()=>(!window.location.pathname.includes('aisurvey')?this.props.history.push('/layout/AiSurvey'):'')}>
              <img src={imgUrl.screensvg} />
              <Typography variant="caption" display="block">
                Survey
              </Typography>
            </Grid>:""}
          </Grid>
        </Grid>
        </div>
    );
}