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

import Customcircularprogress from './Customcircularprogress.js';
import Customcircularprogress1 from './Customcircularprogress1.js';
import Customcircularprogress2 from './Customcircularprogress2.js';

import '../../assets/css/customstyles.css'



const Homenewlayoutlight = () => (
    <div className={classes.container}>
          <main
        style={{
            display: 'flex',
            height: '100%',
            width: '100%'
        }}
    >
        <div className="light-theme">
        <section className="homepagebgsection"
            style={{
                backgroundColor: '#3f4e63',
                flexGrow: 1,
                padding: 20,
            }}
        >

            <Grid container spacing={3} className="mt-30px">
              <Grid item xs={12}>
                <p className="homepageappname">Save The Children</p>
                <p className="homepageappdesc">A Community Engagement Platform Designed Monitor Barriers To Access Facilities,Communities And Civil Organisations.</p>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <p className="hide">Explore Dashboard</p>
                <Grid container spacing={3} className="progresscontainer homemenuholder">
              <Grid item xs={12} sm={6} md={4}>
               <div className="homemenudivcontainer">
               <Grid container spacing={3} className="">
              <Grid item xs={3} sm="3" md="3" lg="4">
                <p className="homemenulinkicon"><FontAwesomeIcon icon={faUserPlus} /></p>
              </Grid>
              <Grid item xs={9} sm="9" md="9" lg="8" className="vert-center">
                <p className="homemenuname">Add New Client</p>
                <p className="homemenudesc">Add Or Edit Clients As Per Requirement In System.</p>
              </Grid>
              </Grid>
              </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
               <div className="homemenudivcontainer">
               <Grid container spacing={3} className="">
              <Grid item xs={3} sm="3" md="3" lg="4">
               <p className="homemenulinkicon"><FontAwesomeIcon icon={faSearch} /></p>
              </Grid>
              <Grid item xs={9} sm="9" md="9" lg="8" className="vert-center">
                <p className="homemenuname">Search</p>
                <p className="homemenudesc">Search Or Modify Existing Cases From Available Data.</p>
              </Grid>
              </Grid>
              </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
               <div className="homemenudivcontainer">
               <Grid container spacing={3} className="">
              <Grid item xs={3} sm="3" md="3" lg="4">
                <p className="homemenulinkicon"><FontAwesomeIcon icon={faBullhorn} /></p>
              </Grid>
              <Grid item xs={9} sm="9" md="9" lg="8" className="vert-center">
                <p className="homemenuname">Alerts</p>
                <p className="homemenudesc">Check,Review,Modify Or Raise Alerts As Required.</p>
              </Grid>
              </Grid>
              </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
               <div className="homemenudivcontainer">
               <Grid container spacing={3} className="">
              <Grid item xs={3} sm="3" md="3" lg="4">
                <p className="homemenulinkicon"><FontAwesomeIcon icon={faFileAlt} /></p>
              </Grid>
              <Grid item xs={9} sm="9" md="9" lg="8" className="vert-center">
                <p className="homemenuname">Task List</p>
                <p className="homemenudesc">Review Assigned Tasks Or,Add And Assign Tasks To Users.</p>
              </Grid>
              </Grid>
              </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
               <div className="homemenudivcontainer">
               <Grid container spacing={3} className="">
              <Grid item xs={3} sm="3" md="3" lg="4">
               <p className="homemenulinkicon"><FontAwesomeIcon icon={faUsers} /></p>
              </Grid>
              <Grid item xs={9} sm="9" md="9" lg="8" className="vert-center">
                <p className="homemenuname">Cases</p>
                <p className="homemenudesc">Review,Add,Modify Existing Cases Or Raise New Cases.</p>
              </Grid>
              </Grid>
              </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
               <div className="homemenudivcontainer">
               <Grid container spacing={3} className="">
              <Grid item xs={3} sm="3" md="3" lg="4">
                <p className="homemenulinkicon"><FontAwesomeIcon icon={faEdit} /></p>
              </Grid>
              <Grid item xs={9} sm="9" md="9" lg="8" className="vert-center">
                <p className="homemenuname">Feedback</p>
                <p className="homemenudesc">Review Received Feedback Or Add/Modify Existing Feedback.</p>
              </Grid>
              </Grid>
              </div>
              </Grid>
            </Grid>
              </Grid>
            </Grid>

           

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <p className="homepageachtitle">Our Achievment</p>
                <Grid container spacing={3} className="progresscontainer">
              <Grid item xs={12} sm={4}>
               <p><Customcircularprogress></Customcircularprogress></p>
               <p className="homepageappdesc">Auto Alerts</p>
              </Grid>
              <Grid item xs={12} sm={4}>
               <p><Customcircularprogress1></Customcircularprogress1></p>
               <p className="homepageappdesc">Assigned Tasks</p>
              </Grid>
              <Grid item xs={12} sm={4}>
               <p><Customcircularprogress2></Customcircularprogress2></p>
               <p className="homepageappdesc">Pending Services</p>
              </Grid>
            </Grid>
              </Grid>
            </Grid>

            

            
           
        </section>
 </div>
    </main>
    </div>
)

export default Homenewlayoutlight
