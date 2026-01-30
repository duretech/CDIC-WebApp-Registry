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

import Customcasescard from './Customcasescard.js';



const Casesnewlayout = () => (
    <div className={classes.container}>
          <main
        style={{
            display: 'flex',
            height: '100%',
            width: '100%'
        }}
    >
        
        <section className={classes.homepagebgsection}
            style={{
                backgroundColor: '#3f4e63',
                flexGrow: 1,
                padding: 20,
            }}
        >
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
            Cases
          </Typography>
        </Toolbar>
      </AppBar>
            <Grid container spacing={3} className="mt-90px mb-30px">
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Customcasescard></Customcasescard>
              </Grid>
            </Grid>

            
        </section>

    </main>
    </div>
)

export default Casesnewlayout
