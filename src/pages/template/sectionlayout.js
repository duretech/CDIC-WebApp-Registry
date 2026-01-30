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
import Customsectionaccordion from './customsectionaccordion.js';
import Customsectionaccordion1 from './customsectionaccordion1.js';
import Customsectionaccordion2 from './customsectionaccordion2.js';
import Customsectionaccordion3 from './customsectionaccordion3.js';
import Customsectionaccordion4 from './customsectionaccordion4.js';
import Customsectionaccordion5 from './customsectionaccordion5.js';
import Customsectionaccordion6 from './customsectionaccordion6.js';
import Customsectionaccordion7 from './customsectionaccordion7.js';


const Sectionlayout = () => (
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
            

             <Grid container spacing={3} className="mt-90px mb-30px tasklistcontainer sectiondivmaincontainer">

              <Grid item xs={12} sm={12} md={12}>
                <Customsectionaccordion></Customsectionaccordion>
              </Grid>
             
             <Grid item xs={12} sm={12} md={12}>
                <Customsectionaccordion1></Customsectionaccordion1>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Customsectionaccordion2></Customsectionaccordion2>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Customsectionaccordion3></Customsectionaccordion3>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Customsectionaccordion4></Customsectionaccordion4>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Customsectionaccordion5></Customsectionaccordion5>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Customsectionaccordion6></Customsectionaccordion6>
              </Grid>

               <Grid item xs={12} sm={12} md={12}>
                <Customsectionaccordion7></Customsectionaccordion7>
              </Grid>
              
              </Grid>

        </section>

    </main>
    </div>
)

export default Sectionlayout
