import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";
// import classes from '../../App.module.css' 
import Grid from '@material-ui/core/Grid';
import '../../assets/css/custom.css'
import Typography from '@material-ui/core/Typography';
import imgUrl from '../../assets/images/imageUrl.js';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {
    Button,
} from '@dhis2/ui';
import OfflineDb from '../../../db'

export default function Patientsettings() {
    const history = useHistory();
    const [user,setuser]= React.useState('')
    const [storage,setstorage]= React.useState('')
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
    // const handleChange = () => {
    //     setSelectedValue(event.target.value);
    // }; 
    return (
        <div className={window.cordova ? "certificatePage certificatePagepatient" : 'certificatePage certificatePagepatient windowdesktop'}>
            <Grid container className='certificatePagediv'>
                <Grid container xs={12} className='certinav'>

                    <Grid xs={3} className='backimg' onClick={() => handleBack()}><img src={imgUrl.whiteback} className='backsvg' /></Grid>
                    <Grid xs={6}>
                        <Typography variant='subtitle1' className='regname oneuhcfont'>Menu</Typography>
                    </Grid>
                    <Grid xs={3} className='homedoh'>
                        <img src={imgUrl.dohlogo} className='dohimg set' />
                    </Grid>

                </Grid>
                <Grid container xs={12} className='userinfo'>
                    <Grid item xs={12}>
                        <div className='logoutgreen'>
                            {/* <Typography variant='subtitle1'>Log out </Typography>
                            <img src={imgUrl.logoutedu} className='backsvggreen' /> */}
                        </div>
                    </Grid>
                    <Grid item xs={4} className='profileimg'>
                        <div>
                            <img src={imgUrl.eduuser} />
                        </div>
                        <div>
                            <Typography variant='caption' onClick={()=>(history.push('/editprofile'))}>
                                <a  className='editlink'>Edit Profile</a>
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <div>
                            <Typography variant='subtitle1'>Hello {user.name}</Typography>
                            <Typography variant='body2'>Phone: {user.phoneNumber}</Typography>
                            {/* <Typography variant='subtitle1'>Main Account</Typography> */}
                        </div>
                    </Grid>
                </Grid>
                <Grid xs={12} className='userflows'>
                    <Accordion className='general'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className='expandicon' />}
                            aria-controls="panel1a-content"
                            id="general"
                        >

                            <Typography variant='subtitle1'>GENERAL SETTINGS</Typography>
                        </AccordionSummary>
                        <AccordionDetails className='general-content'>
                            <div className='stordet'> <Typography variant='subtitle1' >Local space used</Typography><Typography>{storage} MB</Typography></div>
                            <div> <Typography variant='subtitle1' display='block'>
                                <a>Remove all local data</a> </Typography></div>
                            <div><Typography variant='subtitle1'>
                                <a>Remove local data older than 6 month</a> </Typography></div>

                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='notify'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className='expandicon' />}
                            aria-controls="panel2a-content"
                            id="notify"
                        >
                            <Typography variant='subtitle1'>NOTIFICATIONS</Typography>
                        </AccordionSummary>
                        <AccordionDetails className='notify-content'>
                            <div>
                                <FormControl component="fieldset">
                                    <FormGroup aria-label="position" row>

                                        <FormControlLabel
                                            value="start"
                                            control={<Switch color="primary" />}
                                            label="Allow push notifications (no/yes)"
                                            labelPlacement="start"
                                        />
                                        <FormControlLabel
                                            value="start"
                                            control={<Switch color="primary" />}
                                            label="Notify about new issues (no/yes)"
                                            labelPlacement="start"
                                        />

                                    </FormGroup>
                                </FormControl>
                            </div>

                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='alarms'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className='expandicon' />}
                            aria-controls="panel2a-content"
                            id="alarms"
                        >
                            <Typography variant='subtitle1'>ALARMS/SOUNDS</Typography>
                        </AccordionSummary>
                        <AccordionDetails className='alarms-content'>
                            <FormControl component="fieldset">
                                <FormGroup aria-label="position" row>

                                    <FormControlLabel
                                        value="start"
                                        control={<Switch color="primary" />}
                                        label="App Sounds (off/on)"
                                        labelPlacement="start"
                                    />

                                </FormGroup>
                            </FormControl>
                            <div> <Typography variant='subtitle1'>Alarm sound during app use when...</Typography></div>
                            <FormControl component="fieldset">
                                <FormGroup aria-label="position" row>

                                    <FormControlLabel
                                        value="start"
                                        control={<Switch color="primary" />}
                                        label="There is a new notification"
                                        labelPlacement="start"
                                    />

                                </FormGroup>
                            </FormControl>
                            <div><Typography variant='subtitle1'>Select alarm sound </Typography></div>
                        </AccordionDetails>





                    </Accordion>
                    {/* <Accordion className='feedback'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className='expandicon' />}
                            aria-controls="panel2a-content"
                            id="feedback"
                        >
                            <Typography variant='subtitle1'>FEEDBACK</Typography>
                        </AccordionSummary>
                        <AccordionDetails className='feedback-content'>
                            <div><Typography variant='subtitle1'> <a>Report issues</a> </Typography></div>
                            <div><Typography variant='subtitle1'> <a>Rate this app</a> </Typography></div>


                        </AccordionDetails>
                    </Accordion> */}

                </Grid>
                <Grid xs={12} className='certificatesbg'>
                    <div className='certificatesbgdiv'>
                        <img src={imgUrl.openeducate} className='openedu' />
                        <img src={imgUrl.dohlogo} className='dohimg' />

                    </div>
                </Grid>
            </Grid>
        </div>
    );
}