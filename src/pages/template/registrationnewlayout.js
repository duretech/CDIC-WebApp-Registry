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

import Customregistration from './Customregistration.js';

import '../../assets/css/customstyles.css'



const Registrationnewlayout = () => (
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

            <Grid container spacing={3} className="mt-30px registration-page">
              
              <Grid item xs={12}>
                <Customregistration></Customregistration>
              </Grid>
            </Grid>

            
        </section>

    </main>
    </div>
)

export default Registrationnewlayout
