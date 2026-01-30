import React from 'react'
import i18n from '@dhis2/d2-i18n'
import classes from '../../App.module.css'
import { Link, Redirect } from "react-router-dom";
import {
    MenuItem, 
    Menu,
    Tab,
    TabBar,
    Button
} from '@dhis2/ui';

import { Apps,Settings,Account,Exit,Message,AttachFile,Email,FolderOpen } from '@dhis2/ui-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome,faUserPlus,faSearch,faBullhorn,faFileAlt,faUsers,faFileInvoice,faEdit,faWifi,faCog,faSignOutAlt,faFileSignature,faUserFriends,faShareSquare,faPrescriptionBottle,faFlask,faPills,faMale,faRobot,faVideo,faEye,faFilePdf } from '@fortawesome/free-solid-svg-icons'

import Grid from '@material-ui/core/Grid';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'

import Customcasescard from './Customcasescard.js';
import Customdatepicker from './customdatepicker.js';
import Customtasksaccordion from './customtasksaccordion.js';
import Customtasksaccordion1 from './customtasksaccordion1.js';
import Customtasksaccordion2 from './customtasksaccordion2.js';
import Customtasksaccordion3 from './customtasksaccordion3.js';
import Customtasksaccordion4 from './customtasksaccordion4.js';


const Tasklistlayout = () => (
    <div className={classes.container}>
          <main
        style={{
            display: 'flex',
            height: '100%',
            width: '100%'
        }}
    >
        
        <section className="tasklistbgsection"
            style={{
                backgroundColor: '#fff',
                flexGrow: 1,
                padding: 20,
            }}
        >
            <div className="hide">
            <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick=""
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className="pt-0px">
            My Tasks
          </Typography>
        </Toolbar>
      </AppBar>
      </div>
            <Grid container spacing={3} className="mt-90px mb-30px">
              <Grid item xs={12} sm={6} md={2} className="datepicker">
                <Customdatepicker></Customdatepicker>
              </Grid>
              <Grid item xs={0} sm={6} md={10}> 
              </Grid>
            </Grid>

             <Grid container spacing={3} className="mb-30px tasklistcontainer">
             <Grid item xs={12} sm={12} md={12}>
                <p className="zero mytaskstitle">My Tasks</p>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customtasksaccordion></Customtasksaccordion>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customtasksaccordion1></Customtasksaccordion1>
              </Grid>
               <Grid item xs={12} sm={6} md={3}>
                <Customtasksaccordion2></Customtasksaccordion2>
              </Grid>
               <Grid item xs={12} sm={6} md={3}>
                <Customtasksaccordion3></Customtasksaccordion3>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customtasksaccordion4></Customtasksaccordion4>
              </Grid>
              
              
             

              </Grid>

        </section>

    </main>
    </div>
)

export default Tasklistlayout
