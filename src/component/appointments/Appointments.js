import React, { useEffect, useState } from "react";

//Plugins Import
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import moment from "moment";
import {useTranslation } from 'react-i18next';
import swal from "sweetalert";

// import applogo from '../img/cdiclogo.png';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import _, { conforms } from "lodash";
import OfflineDb from "../../db";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import { apiServices } from "../../services/apiServices";

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
//import Files
import AddAppointments from './AddAppointments';
import SelectedDateAppointments from "./selectedDateAppointments";
import FooterMenu from '../../component/layout/FooterMenu';
import { useHistory } from "react-router-dom";


import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    root: {
        display: 'flex',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { t, i18n } = useTranslation();   
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
});
  
const Appointments = () => {
    const { t, i18n } = useTranslation();   
    const setGlobalSpinner = useGlobalSpinnerActionsContext();
    const calenderRef = React.useRef(null);
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
    const [Configuration, setConfiguration] = React.useState(null);
    const [progarmData, setProgarmData] = React.useState(null);
    const [maxWidth, setMaxWidth] = React.useState('md');
    const [programBoDetails, setProgramBoDetails] = React.useState(null);
    const [allPatientData,setAllPatientData] = useState([]);
    const [eventData,setEventData] = useState([]);
    const [appointmentData,setAppointmentData] = useState([]);
    const [selectedCalenderDate,setSelectedCalenderDate] = useState(new Date());
    const [filteredAppoinments,setFilteredAppoinments] = useState([]);
    const [calendarMonth,setCalendarMonth] = useState(moment(new Date()).format("YYYY-MM"))
    const isMobile = window.innerWidth < 768;

    // Drawer states and functions
    const [state, setState] = React.useState({ right: false });
    const history = useHistory();
    
    const toggleDrawer = (anchor, open) => (event) => {
        // if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) { return; }
        setState({ ...state, [anchor]: open });
    };

    async function getMetaData() {
        let metadata = await OfflineDb.getDataFromPouchDB("metaData");
        setProgarmData(metadata.data);
    
        let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
        setSessionUserBoValue(loginDetails.data);
    
        let configurations = await OfflineDb.getDataFromPouchDB("configurations");
        setConfiguration(configurations.data.configuration);

        let programBoDetails = await OfflineDb.getDataFromPouchDB("programBoDetails");
        setProgramBoDetails(programBoDetails.data);
        console.log(programBoDetails,"programBoDetails")
    }

    const getAllPatientData = () => {
        setGlobalSpinner(true);
        let URL = 'dashboardIndicator/getUicDetails?programuid=' + programBoDetails?.programuid;

        apiServices
        .getAPI(URL)
        .then(
        response => {
            if(response.status == 200) {
                setAllPatientData(response.data.data)
            }
            setGlobalSpinner(false);
        })
    }

    const getAllAppointments = () => {
        setGlobalSpinner(true);
        let URL = 'dashboardIndicator/getAppointment';

        apiServices
        .postAPI(URL, {
            "programuid":programBoDetails?.programuid,
            "date": calendarMonth
        })
        .then(
        response => {
            if(response.status == 200) {
                setAppointmentData(response.data.data)
                let events = []
                if(response.data.data && response.data.data.length > 0) {
                    let allData = response.data.data;
                    allData.forEach(element => {
                        let obj = {}
                        let getDate = moment(element.dateofappointment).format("YYYY-MM-DD")
                        let getFromTime = element.fromtime && element.fromtime !== "null" && element.fromtime.length > 0 ? element.fromtime + ':00' : '00:00:00';
                        let getToTime = element.totime && element.totime !== "null" && element.totime.length > 0 ? element.totime + ':00' : '00:00:00';
                        obj.title = element.fisrtname;
                        obj.start = `${getDate}T${getFromTime}` //'2024-04-01 12:34:56';
                        obj.end = `${getDate}T${getToTime}` //'2024-04-01 12:34:56';
                        events.push(obj);
                    });
                }
                setEventData(events);
            }
            setGlobalSpinner(false);
        })
    }

    useEffect(() => {
        if(navigator.onLine){
            getAllAppointments();
        }else{
            swal({
                title: "This operation is not available while offline. Please go online to proceed.",
                icon: "warning",
                button: "OK",
                // className: "custom-swalwarning"
            });
            history.push("/layout/home");
        }
    },[calendarMonth])

    useEffect(() => {
        if(navigator.onLine){
            getMetaData();
        }else{
            swal({
                title: "This operation is not available while offline. Please go online to proceed.",
                icon: "warning",
                button: "OK",
                // className: "custom-swalwarning"
            });
            history.push("/layout/home");
        }
    }, []);
    useEffect(() => {
        if(navigator.onLine){
            getAllPatientData();
            getAllAppointments();
        }else{
            swal({
                title: "This operation is not available while offline. Please go online to proceed.",
                icon: "warning",
                button: "OK",
                // className: "custom-swalwarning"
            });
            history.push("/layout/home");
        }

    }, [programBoDetails]);
    const updateCalenderData = () => {
        getAllPatientData();
        getAllAppointments();
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleClickNext = () => {
        calenderRef.current.getApi().next();
        const Date = calenderRef.current.getApi().currentDataManager.data.currentDate;
        const getMonthDate = moment(Date).format("YYYY-MM")
        setCalendarMonth(getMonthDate);
        activeTodayBtn(getMonthDate)
    }

    const handleClickPrev = () => {
        calenderRef.current.getApi().prev();
        const Date = calenderRef.current.getApi().currentDataManager.data.currentDate;
        const getMonthDate = moment(Date).format("YYYY-MM")
        setCalendarMonth(getMonthDate);
        activeTodayBtn(getMonthDate)
    }

    const handleClickToday = () => {
        calenderRef.current.getApi().today();
        const getMonthDate = moment(new Date()).format("YYYY-MM")
        setCalendarMonth(getMonthDate)
        
        setSelectedCalenderDate(new Date())
        let getFilteredAppoinments = appointmentData.filter((data) => {
            if(moment(data.dateofappointment).format("YYYY-MM-DD") == moment(new Date()).format("YYYY-MM-DD")) {
                return data;
            }
        })
        setFilteredAppoinments(getFilteredAppoinments)
    }

    const handleDateClick = (arg,event) => {
        setSelectedCalenderDate(arg.date)
        let getFilteredAppoinments = appointmentData.filter((data) => {
            if(moment(data.dateofappointment).format("YYYY-MM-DD") == arg.dateStr) {
                return data;
            }
        })
        setFilteredAppoinments(getFilteredAppoinments)
        toggleDrawer('right', true)(event)
    }

    function activeTodayBtn(date) {
        // Disabled today button when you are in current/active month
        let todayBtn = document.querySelector('.fc-todayButton-button.fc-button');
        if(moment(new Date()).format("YYYY-MM") === date && todayBtn) {
            todayBtn.setAttribute("disabled","disabled")
        } else {
            todayBtn.removeAttribute("disabled")
        }
    }

    const renderEventContent = (eventInfo) => {
        activeTodayBtn(calendarMonth);
        const { title, startStr, endStr } = eventInfo.event;

        let timeText = "N/A";

        const formatTime = (str) => str ? moment(str).format('HH:mm') : null;

        const startTime = formatTime(startStr);
        const endTime = endStr ? formatTime(endStr) : null;

        // All-day / midnight-only event → N/A
        if (!startStr || startTime === '00:00') {
            timeText = "N/A";
        } else if (endTime && endTime !== '00:00') {
            // Both times are valid and non-midnight
            timeText = `${startTime} - ${endTime}`;
        } else {
            // end is missing or same as start (FullCalendar strips endStr when equal to startStr)
            // Show start time twice to reflect the actual single-point time
            timeText = `${startTime} - ${startTime}`;
        }

        return (
            <div style={{ overflow: 'hidden' }} className="showEventPopup">
                <p>
                    <b>{t(title)}</b>
                    <i style={{ marginLeft: "6px" }}>{timeText}</i>
                </p>
            </div>
        );
    }

    return (
        
        <main spacing={""} className="appointmentpage">
            <div className={classes.drawerHeader} />
            <Grid container spacing={2} className='mt-30px w-100'>
                <Grid item xs={12} className="pl-0">
                    <div className='px-20px'>
                        <Grid container spacing={2} className='m-0'>
                            <Grid item xs={12} lg={4} style={{ paddingLeft: "0" }}>
                                <div className=''>
                                    <p class="cardtitlesmall color-darkblue">{t("Overview")}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} lg={8} className='d-flex justify-content-end'>
                                <div className='d-flex align-items-center'>
                                    <a href='#' style={{color: '#fff'}} className='dashboardheaderbtn addnewaptbtn' onClick={handleClickOpen}><AddOutlinedIcon></AddOutlinedIcon> {t("Add New")}</a>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                    <div className='mt-20px px-20px pl-16px appointment-calenadar-block'>
                  {/* {console.log("FullCalendar",calenderRef,eventData)} */}
                        <FullCalendar       
                            ref={calenderRef}
                            selectable={true}
                            plugins={[dayGridPlugin, interactionPlugin ]}
                            initialView={"dayGridMonth"}
                            moreLinkContent={(arg) =>
                                `+${arg.num} ${t('more')}`
                            }
                            height="auto"
                            contentHeight="auto"
                            eventDisplay="block"
                            //moreLinkClick={isMobile ? "day" : "popover"}
                            weekends={true}
                            events={eventData}
                            dateClick={handleDateClick}
                            dayMaxEvents={0}
                            customButtons={{
                                prevButton: {
                                text: t("Previous"),
                                click: handleClickPrev,
                                },
                                nextButton: {
                                    text: t("Next"),
                                    click: handleClickNext,
                                },
                                todayButton: {
                                    text: t("Today"),
                                    click: handleClickToday,
                                },
                            }}
                            headerToolbar={{
                                center: "",
                                left: "title",
                                right: "todayButton prevButton,nextButton",
                            }}
                            eventContent = {renderEventContent}
                            themeSystem="Simplex"
                            eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                        />
                      
                    </div>
                    
                    <Dialog maxWidth={maxWidth} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} className="addAppointmentsDiv">
                        <DialogTitle id="customized-dialog-title" onClose={handleClose} className="appointName">
                            {t("Add Appointments")}
                        </DialogTitle>
                        <AddAppointments allPatientData={allPatientData} programData={progarmData} Configuration={Configuration} programBoDetails={programBoDetails} sessionUserBoValue={sessionUserBoValue} closeDialog={handleClose} updateCalender={updateCalenderData}/>
                    </Dialog>
                </Grid>
                <Grid item xs={4}>
                    <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
                        <SelectedDateAppointments programBoDetails={programBoDetails} selectedCalenderDate={selectedCalenderDate} appointmentData={appointmentData} filteredAppoinments={filteredAppoinments} closeDrawer={toggleDrawer('right', false)} updateCalender={updateCalenderData}/>
                    </Drawer>
                </Grid>
            </Grid>
            <FooterMenu/>

        </main>
    )
}

export default Appointments