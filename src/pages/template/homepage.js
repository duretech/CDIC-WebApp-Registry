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



const MyApp = () => (
    <div className={classes.container}>
          <main
        style={{
            display: 'flex',
            height: '100%',
            width: '100%'
        }}
    >
        <aside style={{ width: 200, height: '100%', flexGrow: 0 }}>
            <Menu>
                
                <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faHome} />}

			      label="Home"
			    />
			    <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faUserPlus} />}
			      label="Add New Client"
			    />
			    <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faSearch} />}
			      label="Search"
			    />
			    <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faBullhorn} />}
			      label="Alerts"
			    />
			    <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faFileAlt} />}
			      label="Task List"
			    />
			    <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faUsers} />}
			      label="Cases"
			    />
			    <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faFileInvoice} />}
			      label="Dispatch Details"
			    />
			    <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faEdit} />}
			      label="Feedback"
			    />
			    <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faWifi} />}
			      label="Offline Registrations"
			    />
			    <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faCog} />}
			      label="Settings"
			    />
			    <MenuItem
			      dataTest="dhis2-uicore-menuitem"
			      icon={<FontAwesomeIcon icon={faSignOutAlt} />}
			      label="Logout"
			    />
            </Menu>
        </aside>
        <section className={classes.homepagemainsection}
            style={{
                backgroundColor: '#3f4e63',
                flexGrow: 1,
                padding: 20,
                borderLeft: '1px solid grey',
            }}
        >

            <div className={classes.homepagemenucontainer}>

            <div className={classes.homepagemenu}>

              <div>
              <Link  
                className='nav-link'
                to='/layout/registration' >
              <p className={classes.homepageicon}><FontAwesomeIcon icon={faUserPlus} /></p>
              <p className={classes.homepageicondesc}>Add New Client</p>
              </Link>
              </div>

              <div>
              <Link  
                className='nav-link'
                to='/layout/search' >
              <p className={classes.homepageicon}><FontAwesomeIcon icon={faSearch} /></p>
              <p className={classes.homepageicondesc}>Search</p>
              </Link>
              </div>

              <div>
              <p className={classes.homepageicon}><FontAwesomeIcon icon={faBullhorn} /></p>
              <p className={classes.homepageicondesc}>Alerts</p>
              </div>

              
             
            </div>

            <div className={classes.homepagemenu}>
            <div>
              <p className={classes.homepageicon}><FontAwesomeIcon icon={faFileAlt} /></p>
              <p className={classes.homepageicondesc}>Task List</p>
              </div>

             <div>
             <Link
                className='nav-link'
                to='/layout/cases'>
              <p className={classes.homepageicon}><FontAwesomeIcon icon={faUsers} /></p>
              <p className={classes.homepageicondesc}>Cases</p>
              </Link>
              </div>

              

              <div>
              <p className={classes.homepageicon}><FontAwesomeIcon icon={faEdit} /></p>
              <p className={classes.homepageicondesc}>Feedback</p>
              </div>

             
             
            </div>

            </div>
           
        </section>

    </main>
    </div>
)

export default MyApp
