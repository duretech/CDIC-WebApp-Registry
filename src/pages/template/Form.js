import React from 'react'
import i18n from '@dhis2/d2-i18n'
import classes from '../../App.module.css'
import {
    MenuItem, 
    Menu,
    Tab,
    TabBar
} from '@dhis2/ui';

import { Apps,Settings,Account,Exit,Message,AttachFile,Email,FolderOpen } from '@dhis2/ui-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome,faUserPlus,faSearch,faBullhorn,faFileAlt,faUsers,faFileInvoice,faEdit,faWifi,faCog,faSignOutAlt,faFileSignature,faUserFriends,faShareSquare,faPrescriptionBottle,faFlask,faPills,faMale } from '@fortawesome/free-solid-svg-icons'



const MainPage = () => (
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
        <section className={classes.mainsection}
            style={{
                backgroundColor: '#3f4e63',
                flexGrow: 1,
                padding: 20,
                borderLeft: '1px solid grey',
            }}
        >
            <div>
  <TabBar dataTest="dhis2-uicore-tabbar" className={classes.formtabbar} >
    <Tab
      dataTest="dhis2-uicore-tab"
      icon={<FontAwesomeIcon icon={faFileSignature} />}
      className={classes.formtabs}
      selected
    >
      REG
    </Tab>
    <Tab
      dataTest="dhis2-uicore-tab"
      icon={<FontAwesomeIcon icon={faUserFriends} />}
      className={classes.formtabs}
    >
      EXP-H
    </Tab>
    <Tab
      dataTest="dhis2-uicore-tab"
      icon={<FontAwesomeIcon icon={faShareSquare} />}
      className={classes.formtabs}
    >
      REF
    </Tab>
    <Tab
      dataTest="dhis2-uicore-tab"
      icon={<FontAwesomeIcon icon={faPrescriptionBottle} />}
      className={classes.formtabs}
    >
      SP-COL
    </Tab>
    <Tab
      dataTest="dhis2-uicore-tab"
      icon={<FontAwesomeIcon icon={faFlask} />}
      className={classes.formtabs}
    >
      TEST
    </Tab>
    <Tab
      dataTest="dhis2-uicore-tab"
      icon={<FontAwesomeIcon icon={faPills} />}
      className={classes.formtabs}
    >
      TREAT
    </Tab>
    <Tab
      dataTest="dhis2-uicore-tab"
      icon={<FontAwesomeIcon icon={faMale} />}
      className={classes.formtabs}
    >
      OUTCOME
    </Tab>
  </TabBar>
</div>
        </section>
    </main>
    </div>
)

export default MainPage
