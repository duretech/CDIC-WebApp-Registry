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

import Alertsselect from './alertsselect.js';



const Tutoriallayout = () => (
    <div className={classes.container}>
          <main
        style={{
            display: 'flex',
            height: '100%',
            width: '100%'
        }}
    >
        
        <section className="tutorialbg"
            style={{
                backgroundColor: '#3f4e63',
                flexGrow: 1,
                padding: 0,
            }}
        >
            <div className="">
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
      <Grid container spacing={3} className="mt-60px mb-30px registration-page alerts_page">
        <Grid item xs={12} sm={12} md={12} className="">
        <div className="choose_alertdiv"><Alertsselect></Alertsselect></div>
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="knowkedgelistcontainer">
         <div className="alertsdetailholder">
            <p className="alerts_title">HTC Service Pending</p>
            <p className="alerts_description_fields">Nickname: John Doe</p>
            <p className="alerts_description_fields">Referred On: 20-02-2020</p>
            <p className="alerts_description_fields">Referred To: NAP-Latha</p>
            <p className="alerts_description_fields">Days Since Referral: 14</p>
            <p className="alerts_profilebtn_holder">
              <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn">
                  Client Profile
              </Button>
            </p>
         </div>
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="knowkedgelistcontainer">
         <div className="alertsdetailholder">
            <p className="alerts_title">HTC Service Pending</p>
            <p className="alerts_description_fields">Nickname: John Doe</p>
            <p className="alerts_description_fields">Referred On: 20-02-2020</p>
            <p className="alerts_description_fields">Referred To: NAP-Latha</p>
            <p className="alerts_description_fields">Days Since Referral: 14</p>
            <p className="alerts_profilebtn_holder">
              <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn">
                  Client Profile
              </Button>
            </p>
         </div>
        </Grid>
      </Grid>
    </section>

    </main>
    </div>
)

export default Tutoriallayout
