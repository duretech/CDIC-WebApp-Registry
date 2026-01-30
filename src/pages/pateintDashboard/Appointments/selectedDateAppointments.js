import React from "react";
//Plugins Import
import moment from "moment";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Grid from '@material-ui/core/Grid';
import EventBusyTwoToneIcon from '@material-ui/icons/EventBusyTwoTone';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import ClearIcon from '@material-ui/icons/Clear';
import { apiServices } from "../../../services/apiServices";
import swal from "sweetalert";
import { useGlobalSpinnerActionsContext } from "../../../context/GlobalSpinnerContext";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={0}>
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

const SelectedDateAppointments = (props) => {
    const setGlobalSpinner = useGlobalSpinnerActionsContext();
    const getCalenderDate = props.selectedCalenderDate
    const appointmentData = props.appointmentData;
    const filteredAppoinments = props.filteredAppoinments;

    
    const programuid = props.programBoDetails.programuid

    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const cancelAppointment = (id,date,userId) => {
        setGlobalSpinner(true);
        let pJson = {
            "programuid": programuid,
            "date": moment(date).format("YYYY-MM"),
            "eventid": id,
            "status": userId && userId.length > 0 ? "exists" : "New"
        }

        swal("Are you sure?", {
            dangerMode: true,
            buttons: true,
        }).then(function(result) {
            if(result) {
                apiServices
                .postAPI('dashboardIndicator/cancelAppointment',pJson)
                .then(
                    response => {
                        if(response.status == 200) {
                            swal({
                                title: "Done",
                                text: "Appointment Cancelled!",
                                icon: "success",
                                button: "Close",
                            })
                            props.closeDrawer(); 
                            props.updateCalender();
                        }
                        setGlobalSpinner(false);
                    }
                )
            } else {
                props.closeDrawer();
                setGlobalSpinner(false);
            }
        });
    }

    function showTodaysAppointmentCards(appointmentArr) {
        if(filteredAppoinments.length === 0 && (moment(new Date()).format("YYYY-MM-DD") == moment(getCalenderDate).format("YYYY-MM-DD"))) {
            return (
                <div>
                    <h5 style={{ marginTop: '20px' }}>Nothing planned for the day</h5>
                    <div style={{width: '300px'}}><EventBusyTwoToneIcon style={{fontSize: '10rem'}}/></div>
                </div>
            )
        }

        return appointmentArr && appointmentArr.length > 0 && appointmentArr.map(element => {
            if(moment(element.dateofappointment).format("YYYY-MM-DD") == moment(getCalenderDate).format("YYYY-MM-DD")) {
                return (
                    <div className={element.uic && element.uic.length > 0 ? 'singleappointmentcard newpatientborder' : 'singleappointmentcard newpatientadd'}>
                        <Grid container spacing={0} className='m-0'>
                            <Grid item xs={12}>
                                <Grid container spacing={0} className='m-0'>
                                    <Grid item xs={7} className='p20px' id={element.uic}>
                                        <p class="innercardtitle text-left">{ `${element.fisrtname} ${element.lastname}` }</p>
                                        <p class="alertname fw-400 mt-10px">{ element.reasonappointment }</p>
                                    </Grid>
                                    <Grid item xs={5} className='px2010 appcarddetails'>
                                        <p className='alertdescription d-flex align-items-center color-black'>
                                            <span className='appointmenticon nextappointmentcolor d-flex'><CalendarTodayOutlinedIcon></CalendarTodayOutlinedIcon></span>
                                            <span className='color-grey'>{ moment(element.dateofappointment).format("LL") }</span>
                                        </p>
                                        <p className='alertdescription d-flex align-items-center mt-5px'>
                                            <span className='appointmenticon color-yellow d-flex'><ScheduleIcon></ScheduleIcon></span>
                                            <span className='color-grey'> {element.fromtime + '-' + element.totime}</span>
                                        </p>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className="cancel-container">
                                <button onClick={()=> cancelAppointment(element.eventid, element.dateofappointment, element.uic)}><ClearIcon /> <span>Cancel</span></button>
                            </Grid>
                        </Grid>
                    </div>
                )
            } 
        });
    }
    

    return (
        <Grid container spacing={2} className='m-0'>
            <Grid item xs={12}>
                <div className='todayappointmentdiv'>
                    <p class="cardtitlesmall color-darkblue mt-20px">
                    {t("Appointment details")}
                    </p>
                    <div className='mt-20px appointmenttabsholder'>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} dir={theme.direction}>
                                <div className='appointmentcardlist' style={{minWidth: '300px'}}>
                                    { filteredAppoinments && filteredAppoinments.length > 0 ? showTodaysAppointmentCards(filteredAppoinments) : (moment(getCalenderDate).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) ? showTodaysAppointmentCards(appointmentData) : <div>
                                        <h5 style={{ marginTop: '20px' }}>Nothing planned for the day</h5>
                                        <div style={{width: '300px'}}><EventBusyTwoToneIcon style={{fontSize: '10rem'}}/></div>
                                        </div>  }

                                </div>
                            </TabPanel>

                        </SwipeableViews>
                    </div>
                </div>
            </Grid>
        </Grid>
    )

}

export default SelectedDateAppointments;