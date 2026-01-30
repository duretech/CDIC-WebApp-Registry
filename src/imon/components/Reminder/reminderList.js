import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";
// import classes from '../../App.module.css' 
import Grid from '@material-ui/core/Grid';
import '../../assets/css/custom.css'
import Typography from '@material-ui/core/Typography';
import imgUrl from '../../assets/images/imageUrl.js';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import moment from 'moment'
import { ButtonStrip, InputFieldFF, SingleSelectFieldFF, ReactFinalForm, hasValue, AlertBar, CircularLoader, CenteredContent } from '@dhis2/ui';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
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


export default function ReminderList() {
    const history = useHistory();
    const [user,setuser]= React.useState('')
    const [reminders,setReminder]= React.useState([])
    const [selectedDate, setDate] = React.useState(new Date());
    const [selectedEndDate, setEndDate] = React.useState(new Date());
    const [selectedTime, setTime] = React.useState('');

    useEffect(()=>{
        OfflineDb.getDataFromPouchDB('loginDetails').then(res=>{
            console.log(res)
            setuser(res.data)
        })
        setReminder(JSON.parse(localStorage.getItem('reminders')))
    },[])

    function handleBack() {
        window.history.back();
    }

    return (
      <div className={window.cordova ? "certificatePage certificatePagepatient" : 'certificatePage certificatePagepatient windowdesktop'}>
      <Grid container className='reminderPagediv'>

      <Grid container xs={12} className='certinav'>

        <Grid xs={3} className='backimg'><img src={imgUrl.whiteback} onClick={() => handleBack()} className='backsvg' /></Grid>
        <Grid xs={6}>
        <Typography variant='subtitle1' className='regname oneuhcfont'>Reminders</Typography>
        </Grid>
        <Grid xs={3}>
        </Grid>

        </Grid>
            <Grid className="reminderListPage">
            <a href="#" className="floating-button create-reminder rem-float-btn" onClick={()=>history.push('/reminder')}>
            <AddCircleIcon />
            </a>
                
                <div className="list-block">
                    <div className="list-group">
                        <ul className="reminders">
                        {reminders ? reminders.map((item, i) => (
                          <Accordion className='general1'>
                          <AccordionSummary
                              expandIcon={<ExpandMoreIcon className='expandicon' />}
                              aria-controls="panel1a-content"
                              id="general1"
                          >
                              <Typography variant='subtitle1'>{item.reminder}</Typography>
                          </AccordionSummary>
                          <AccordionDetails className='general-content'>
                            <div> <Typography variant='subtitle1' display='block'>
                                <a>{item.note}</a> </Typography></div>
                        </AccordionDetails>
                          </Accordion>
                       )) : <></>}
                           
                        </ul>
                    </div>
                </div>
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