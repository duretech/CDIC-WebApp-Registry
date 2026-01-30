import React from "react";
//Plugins Import
import moment from "moment";
import { useTranslation } from 'react-i18next';
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
import { apiServices } from "../../services/apiServices";
import swal from "sweetalert";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

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
    const { t, i18n } = useTranslation();   
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

        swal({
            // title: "Are you sure you want to cancel this Appointment?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            content: {
                element: "p",
                attributes: {
                    innerHTML: "Are you sure you want to cancel this Appointment?",
                    style: "text-align: center; font-size: 16px;",
                },
            },
        }).then(function(result) {
            if(result) {
                apiServices
                .postAPI('dashboardIndicator/cancelAppointment',pJson)
                .then(
                    response => {
                        if(response.status == 200) {
                            swal({
                                title: t("Done"),
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
                    <h5 style={{ marginTop: '20px' }}>{t("Nothing planned for the day")}</h5>
                    <div style={{width: '300px'}}><EventBusyTwoToneIcon style={{fontSize: '10rem'}}/></div>
                </div>
            )
        }

        return appointmentArr && appointmentArr.length > 0 && appointmentArr.map(element => {
            element.reasonappointment = (element.reasonappointment === "null" || element.reasonappointment === null || element.reasonappointment === "") ? "" : element.reasonappointment;
            if(moment(element.dateofappointment).format("YYYY-MM-DD") == moment(getCalenderDate).format("YYYY-MM-DD")) {
                return (
                    <div className={element.uic && element.uic.length > 0 ? 'singleappointmentcard newpatientborder' : 'singleappointmentcard newpatientadd'}>
                        <Grid container spacing={0} className='m-0'>
                            <Grid item xs={12}>
                                <Grid container spacing={0} className='m-0'>
                                    <Grid item xs={7} className='p20px' id={element.uic}>
                                    <p className="innercardtitle text-left">
                                        {`${t(element.fisrtname).length > 10 ? t(element.fisrtname).substring(0, 10) + '...' : t(element.fisrtname)} ${t(element.lastname).length > 6 ? t(element.lastname).substring(0, 6) + '...' : t(element.lastname)}`}
                                    </p>
                                    <p className="alertname fw-400 mt-10px">
                                        {t(element.reasonappointment).length > 10 ? t(element.reasonappointment).substring(0, 10) + '...' : t(element.reasonappointment)}
                                    </p>
                                    </Grid>
                                    <Grid item xs={5} className='px2010 appcarddetails'>
                                        <p className='alertdescription d-flex align-items-center color-black'>
                                            <span className='appointmenticon nextappointmentcolor d-flex'><CalendarTodayOutlinedIcon></CalendarTodayOutlinedIcon></span>
                                            <span className='color-grey'>{ moment(element.dateofappointment).format("LL") }</span>
                                        </p>
                                        <p className='alertdescription d-flex align-items-center mt-5px'>
                                            <span className='appointmenticon color-yellow d-flex'><ScheduleIcon></ScheduleIcon></span>
                                            <span className='color-grey'>
                                            {(element.fromtime === null || element.fromtime === "null" || element.totime === null || element.totime === "null") 
                                            ? "Time details not provided" 
                                            : element.fromtime + '-' + element.totime}
                                            </span>
                                            {/* <span className='color-grey'> 
                                                {new Date(element.fromtime).toString() !== "Invalid Date" && new Date(element.totime).toString() !== "Invalid Date" ? 
                                                    `${new Date(element.fromtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                                    To 
                                                    ${new Date(element.totime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                                                    : 'TBD'}
                                            </span> */}
                                        </p>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className="cancel-container">
                                <button onClick={()=> cancelAppointment(element.eventid, element.dateofappointment, element.uic)}><ClearIcon /> <span>{t("Cancel")}</span></button>
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
                    <div className="flex-row" style={{ justifyContent: "space-between"}}>
                        <p className="cardtitlesmall color-darkblue mt-20px">
                            Appointment details
                        </p>
                        <IconButton 
                            aria-label="close" 
                            onClick={props.closeDrawer} 
                            size="small"
                            className="mt-15px"
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
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

export default SelectedDateAppointments