import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import applogo from '../img/cdiclogo.png';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import PermContactCalendarOutlinedIcon from '@material-ui/icons/PermContactCalendarOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ScheduleIcon from '@material-ui/icons/Schedule';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Link from '@material-ui/core/Link';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import { withStyles } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';

import StopIcon from '@material-ui/icons/Stop';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import Pagination from '@material-ui/lab/Pagination';

import userimg from '../img/userimg.png';

import CallIcon from '@material-ui/icons/Call';
import EmailIcon from '@material-ui/icons/Email';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

// Import Highcharts
import Highcharts from "highcharts/highstock";
//import HighchartsReact from "./HighchartsReact.js";
import PieChart from "highcharts-react-official";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';










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
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
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
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
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

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function PersistentDrawerLeft() {

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorriskEl, setAnchorriskEl] = React.useState(null);

  const handleriskClick = (event) => {
    setAnchorriskEl(event.currentTarget);
  };

  const handleriskClose = () => {
    setAnchorriskEl(null);
  };

  const [anchorcalEl, setAnchorcalEl] = React.useState(null);

  const handlecalClick = (event) => {
    setAnchorcalEl(event.currentTarget);
  };

  const handlecalClose = () => {
    setAnchorcalEl(null);
  };

  const WhiteCheckbox = withStyles({
    root: {
      color: '#fff',
      '&$checked': {
        color: '#fff',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  const DarkblueCheckbox = withStyles({
    root: {
      color: '#002D67',
      '&$checked': {
        color: '#002D67',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
    gilad: true,
    jason: false,
    antoine: false,
  });



  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const events = [
    { title: 'Meeting', start: new Date() }
  ]





  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            CDIC
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <img src={applogo} className='applogodrawer' />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List component="nav" aria-label="main mailbox folders" className='drawermenu'>
          <Link href="dashboard" to="dashboard">


            <ListItem button >
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
          <Link href="registration" to="registration">
            <ListItem button>
              <ListItemIcon>
                <PermContactCalendarOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Registration" />
            </ListItem>
          </Link>
          {/* <ListItem button>
          <ListItemIcon>
            <SearchOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Search" />
        </ListItem> */}
          <Link href="alerts" to="alerts">
            <ListItem button >
              <ListItemIcon>
                <NotificationsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Alerts" />
            </ListItem>
          </Link>
          <Link href="patientrecord" to="patientrecord">
            <ListItem button >
              <ListItemIcon>
                <ListAltOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Patient Record List" />
            </ListItem>
          </Link>
          <Link href="followup" to="followup">
            <ListItem button className='active'>
              <ListItemIcon>
                <CalendarTodayOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Follow-up" />
            </ListItem>
          </Link>
          <Link href="tasklist" to="tasklist">
            <ListItem button>
              <ListItemIcon>
                <MailOutlineOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Task List" />
            </ListItem>
          </Link>
          <ListItem button>
            <ListItemIcon>
              <QuestionAnswerOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Offline Clients" />
          </ListItem>


        </List>



      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Grid container spacing={2} className='m-0'>
          <Grid item xs={4}>
            <div className='d-flex align-items-center'>
              <p class="cardtitlesmall">Follow-up</p>

            </div>
          </Grid>
          <Grid item xs={8}>
            <div className='dashboardrightdiv'>
              <div className='contentdiv'>
                <div className='dashboardsearchbar'>
                  <FormControl className={classes.margin}>

                    <Input
                      id="input-with-icon-adornment"
                      placeholder='Search Here'
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchOutlinedIcon />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </div>
              </div>
              <div className='contentdiv'>
                <div className='d-flex align-items-center justify-content-center'>
                  <a href='#' className='dashboardicon'>
                    <NotificationsOutlinedIcon></NotificationsOutlinedIcon>
                  </a>
                  <a href='#' className='dashboardicon'>
                    <SettingsOutlinedIcon></SettingsOutlinedIcon>
                  </a>
                </div>
              </div>
              <div className='contentdiv'>
                <div className='d-flex'>
                  <div>
                    <p className='username'>Samantha</p>
                    <p className='designation'>Admin</p>
                  </div>
                  <div>
                    <a href='#' className='usernamelink' aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>S</a>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>Profile</MenuItem>
                      <MenuItem onClick={handleClose}>My account</MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Link href="home" to="home">
                          Logout
                        </Link>
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>


        <Grid container spacing={0} className='m-0 mt-30px'>

          <Grid item xs={7}>
            <div className=''>
              <Grid container spacing={2} className='m-0'>
                <Grid item xs={4}>
                  <div className=''>
                    <p class="cardtitlesmall color-darkblue">Calendar</p>
                  </div>
                </Grid>
                <Grid item xs={8} className='d-flex justify-content-end'>
                  <div className='d-flex align-items-center w-100'>
                    <a href='#' className='dashboardheaderbtn outline w-100' aria-controls="cal-menu" aria-haspopup="true" onClick={handlecalClick}><ArrowDropDownOutlinedIcon></ArrowDropDownOutlinedIcon> January</a>


                    <Menu
                      id="cal-menu"
                      anchorEl={anchorcalEl}
                      keepMounted
                      open={Boolean(anchorcalEl)}
                      onClose={handlecalClose}
                    >
                      <MenuItem onClick={handlecalClose}>January</MenuItem>
                      <MenuItem onClick={handlecalClose}>February</MenuItem>
                      <MenuItem onClick={handlecalClose}>March</MenuItem>
                      <MenuItem onClick={handlecalClose}>April</MenuItem>
                      <MenuItem onClick={handlecalClose}>May</MenuItem>
                      <MenuItem onClick={handlecalClose}>June</MenuItem>
                      <MenuItem onClick={handlecalClose}>July</MenuItem>
                      <MenuItem onClick={handlecalClose}>August</MenuItem>
                      <MenuItem onClick={handlecalClose}>September</MenuItem>
                      <MenuItem onClick={handlecalClose}>October</MenuItem>
                      <MenuItem onClick={handlecalClose}>November</MenuItem>
                      <MenuItem onClick={handlecalClose}>December</MenuItem>

                    </Menu>

                    <a href='#' className='dashboardheaderbtn outline w-100' aria-controls="risk-menu" aria-haspopup="true" onClick={handleriskClick}><ArrowDropDownOutlinedIcon></ArrowDropDownOutlinedIcon> 2024</a>


                    <Menu
                      id="risk-menu"
                      anchorEl={anchorriskEl}
                      keepMounted
                      open={Boolean(anchorriskEl)}
                      onClose={handleriskClose}
                    >
                      <MenuItem onClick={handleriskClose}>2024</MenuItem>
                      <MenuItem onClick={handleriskClose}>2023</MenuItem>
                      <MenuItem onClick={handleriskClose}>2022</MenuItem>
                      <MenuItem onClick={handleriskClose}>2021</MenuItem>
                    </Menu>
                    <a href='#' className='dashboardheaderbtn w-100'><AddOutlinedIcon></AddOutlinedIcon> Add New</a>

                  </div>
                </Grid>

              </Grid>




            </div>
            <div className='mt-20px'>

              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView='dayGridMonth'
                weekends={false}
                events={events}

                eventContent={renderEventContent}
              />
            </div>
            <div className='callegenddiv'>
              <p className='alertdescription d-flex align-items-center color-black'>
                <span className='appointmenticon followuppatientcolor d-flex'><FiberManualRecordIcon></FiberManualRecordIcon></span>
                <span className='color-grey'>Follow - Up</span>

              </p>
              <p className='alertdescription d-flex align-items-center color-black'>
                <span className='appointmenticon newpatientcolor d-flex'><FiberManualRecordIcon></FiberManualRecordIcon></span>
                <span className='color-grey'>New Patient</span>

              </p>


            </div>

          </Grid>
          <Grid item xs={5}>
            <Grid container spacing={2} className='m-0'>
              <Grid item xs={12}>
                <div className='todayappointmentdiv'>
                  <p class="cardtitlesmall color-darkblue">
                    Today’s Follow-up Details
                  </p>
                  <p class="alertdescription mt-5px"><span class="color-grey ">Sunday, 6th Jan , 2024</span></p>
                  <div className='mt-20px appointmenttabsholder'>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                        className='appointmenttabs'
                      >
                        <Tab label="New Patient" {...a11yProps(0)} />
                        <Tab label="Follow - Up" {...a11yProps(1)} />

                      </Tabs>
                    </AppBar>
                    <SwipeableViews
                      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      index={value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        <div className='appointmentcardlist mt-30px'>
                          <div className='singleappointmentcard newpatientborder'>
                            <Grid container spacing={0} className='m-0'>

                              <Grid item xs={12}>
                                <Grid container spacing={0} className='m-0'>
                                  <Grid item xs={7} className='p20px'>
                                    <p class="innercardtitle text-left">John Doe</p>
                                    <p class="alertname fw-400 mt-10px">Symptoms of Diabetes :</p>
                                    <div className='mt-10px'>
                                      <ul className='symptomsul'>
                                        <li>Increased Thirst</li>
                                        <li>Blurry Vision</li>
                                        <li>Fatigue</li>
                                      </ul>
                                    </div>
                                  </Grid>
                                  <Grid item xs={5} className='p20px appcarddetails'>
                                    <p className='alertdescription d-flex align-items-center color-black'>
                                      <span className='appointmenticon nextappointmentcolor d-flex'><CalendarTodayOutlinedIcon></CalendarTodayOutlinedIcon></span>
                                      <span className='color-grey'>20 Feb 2024</span>

                                    </p>
                                    <p className='alertdescription d-flex align-items-center mt-5px'>
                                      <span className='appointmenticon color-yellow d-flex'><ScheduleIcon></ScheduleIcon></span>

                                      <span className='color-grey'> 09:00 AM - 10:00 AM</span>
                                    </p>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </div>
                          <div className='singleappointmentcard newpatientborder'>
                            <Grid container spacing={0} className='m-0'>

                              <Grid item xs={12}>
                                <Grid container spacing={0} className='m-0'>
                                  <Grid item xs={7} className='p20px'>
                                    <p class="innercardtitle text-left">John Doe</p>
                                    <p class="alertname fw-400 mt-10px">Symptoms of Diabetes :</p>
                                    <div className='mt-10px'>
                                      <ul className='symptomsul'>
                                        <li>Increased Thirst</li>
                                        <li>Blurry Vision</li>
                                        <li>Fatigue</li>
                                      </ul>
                                    </div>
                                  </Grid>
                                  <Grid item xs={5} className='p20px appcarddetails'>
                                    <p className='alertdescription d-flex align-items-center color-black'>
                                      <span className='appointmenticon nextappointmentcolor d-flex'><CalendarTodayOutlinedIcon></CalendarTodayOutlinedIcon></span>
                                      <span className='color-grey'>20 Feb 2024</span>

                                    </p>
                                    <p className='alertdescription d-flex align-items-center mt-5px'>
                                      <span className='appointmenticon color-yellow d-flex'><ScheduleIcon></ScheduleIcon></span>

                                      <span className='color-grey'> 09:00 AM - 10:00 AM</span>
                                    </p>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </div>
                          <div className='singleappointmentcard newpatientborder'>
                            <Grid container spacing={0} className='m-0'>

                              <Grid item xs={12}>
                                <Grid container spacing={0} className='m-0'>
                                  <Grid item xs={7} className='p20px'>
                                    <p class="innercardtitle text-left">John Doe</p>
                                    <p class="alertname fw-400 mt-10px">Symptoms of Diabetes :</p>
                                    <div className='mt-10px'>
                                      <ul className='symptomsul'>
                                        <li>Increased Thirst</li>
                                        <li>Blurry Vision</li>
                                        <li>Fatigue</li>
                                      </ul>
                                    </div>
                                  </Grid>
                                  <Grid item xs={5} className='p20px appcarddetails'>
                                    <p className='alertdescription d-flex align-items-center color-black'>
                                      <span className='appointmenticon nextappointmentcolor d-flex'><CalendarTodayOutlinedIcon></CalendarTodayOutlinedIcon></span>
                                      <span className='color-grey'>20 Feb 2024</span>

                                    </p>
                                    <p className='alertdescription d-flex align-items-center mt-5px'>
                                      <span className='appointmenticon color-yellow d-flex'><ScheduleIcon></ScheduleIcon></span>

                                      <span className='color-grey'> 09:00 AM - 10:00 AM</span>
                                    </p>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </div>
                        </div>
                        <div className='mt-30px mx-4px'>
                          <a href='#' className='blueroundbtn fw-600'>View More</a>
                        </div>
                      </TabPanel>
                      <TabPanel value={value} index={1} dir={theme.direction}>
                        <div className='appointmentcardlist mt-30px'>
                          <div className='singleappointmentcard followuppatientborder'>
                            <Grid container spacing={0} className='m-0'>

                              <Grid item xs={12}>
                                <Grid container spacing={0} className='m-0'>
                                  <Grid item xs={7} className='p20px'>
                                    <p class="innercardtitle text-left">John Doe</p>
                                    <p class="alertname fw-400 mt-10px">Types Of Insulin :</p>
                                    <div className='mt-10px'>
                                      <ul className='symptomsul'>
                                        <li>Rapid - Acting Insulin</li>
                                        <li>Long - Acting Insulin</li>
                                        <li>Short - Acting Insuline</li>
                                      </ul>
                                    </div>
                                  </Grid>
                                  <Grid item xs={5} className='p20px appcardfollowupdetails'>
                                    <div>
                                      <p class="alertname fw-600 risktext">Risk Level : Average</p>
                                    </div>
                                    <div>
                                      <p className='alertdescription d-flex align-items-center color-black'>
                                        <span className='appointmenticon nextappointmentcolor d-flex'><CalendarTodayOutlinedIcon></CalendarTodayOutlinedIcon></span>
                                        <span className='color-grey'>20 Feb 2024</span>

                                      </p>
                                      <p className='alertdescription d-flex align-items-center mt-5px'>
                                        <span className='appointmenticon color-yellow d-flex'><ScheduleIcon></ScheduleIcon></span>

                                        <span className='color-grey'> 09:00 AM - 10:00 AM</span>
                                      </p>
                                    </div>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </div>
                          <div className='singleappointmentcard followuppatientborder'>
                            <Grid container spacing={0} className='m-0'>

                              <Grid item xs={12}>
                                <Grid container spacing={0} className='m-0'>
                                  <Grid item xs={7} className='p20px'>
                                    <p class="innercardtitle text-left">John Doe</p>
                                    <p class="alertname fw-400 mt-10px">Types Of Insulin :</p>
                                    <div className='mt-10px'>
                                      <ul className='symptomsul'>
                                        <li>Rapid - Acting Insulin</li>
                                        <li>Long - Acting Insulin</li>
                                        <li>Short - Acting Insuline</li>
                                      </ul>
                                    </div>
                                  </Grid>
                                  <Grid item xs={5} className='p20px appcardfollowupdetails'>
                                    <div>
                                      <p class="alertname fw-600 risktext">Risk Level : Average</p>
                                    </div>
                                    <div>
                                      <p className='alertdescription d-flex align-items-center color-black'>
                                        <span className='appointmenticon nextappointmentcolor d-flex'><CalendarTodayOutlinedIcon></CalendarTodayOutlinedIcon></span>
                                        <span className='color-grey'>20 Feb 2024</span>

                                      </p>
                                      <p className='alertdescription d-flex align-items-center mt-5px'>
                                        <span className='appointmenticon color-yellow d-flex'><ScheduleIcon></ScheduleIcon></span>

                                        <span className='color-grey'> 09:00 AM - 10:00 AM</span>
                                      </p>
                                    </div>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </div>
                          <div className='singleappointmentcard followuppatientborder'>
                            <Grid container spacing={0} className='m-0'>

                              <Grid item xs={12}>
                                <Grid container spacing={0} className='m-0'>
                                  <Grid item xs={7} className='p20px'>
                                    <p class="innercardtitle text-left">John Doe</p>
                                    <p class="alertname fw-400 mt-10px">Types Of Insulin :</p>
                                    <div className='mt-10px'>
                                      <ul className='symptomsul'>
                                        <li>Rapid - Acting Insulin</li>
                                        <li>Long - Acting Insulin</li>
                                        <li>Short - Acting Insuline</li>
                                      </ul>
                                    </div>
                                  </Grid>
                                  <Grid item xs={5} className='p20px appcardfollowupdetails'>
                                    <div>
                                      <p class="alertname fw-600 risktext">Risk Level : Average</p>
                                    </div>
                                    <div>
                                      <p className='alertdescription d-flex align-items-center color-black'>
                                        <span className='appointmenticon nextappointmentcolor d-flex'><CalendarTodayOutlinedIcon></CalendarTodayOutlinedIcon></span>
                                        <span className='color-grey'>20 Feb 2024</span>

                                      </p>
                                      <p className='alertdescription d-flex align-items-center mt-5px'>
                                        <span className='appointmenticon color-yellow d-flex'><ScheduleIcon></ScheduleIcon></span>

                                        <span className='color-grey'> 09:00 AM - 10:00 AM</span>
                                      </p>
                                    </div>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </div>
                        </div>
                        <div className='mt-30px mx-4px'>
                          <a href='#' className='blueroundbtn fw-600'>View More</a>
                        </div>
                      </TabPanel>

                    </SwipeableViews>
                  </div>
                </div>
              </Grid>
            </Grid>


          </Grid>

        </Grid>


      </main>
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}