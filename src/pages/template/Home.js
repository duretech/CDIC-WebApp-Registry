import React from 'react'
import i18n from '@dhis2/d2-i18n'
import classes from '../../App.module.css'
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
            <div className={classes.toptutorialmenu}>
              <div>
              <p className={classes.icon}><FontAwesomeIcon icon={faRobot} /></p>
              <p>CHATBOT HELPDESK</p>
              </div>
              <div>
              <p className={classes.icon}><FontAwesomeIcon icon={faVideo} /></p>
              <p>VIDEO TUTORIAL</p>
              </div>
              <div>
              <p className={classes.icon}><FontAwesomeIcon icon={faEye} /></p>
              <p>GUIDED TUTORIAL</p>
              </div>
              <div>
              <p className={classes.icon}><FontAwesomeIcon icon={faFilePdf} /></p>
              <p>PDF TUTORIAL</p>
              </div>
            </div>
            <div className={classes.bottomstatsmain}>
            	<div className={classes.bottomstats}>
            		<div className={classes.tasksmainholder}>
            			<div className={classes.tasksmaincontainer}>
            				<p className={classes.maintasks}>23</p>
            				<p className={classes.maintasks}>TOTAL TASKS</p>
            				<div className={classes.subtasksmainholder}>
            				<div className={classes.subtasksmaincontainer}>
            					<p className={classes.subtasks}>60%</p>
            					<p className={classes.subtasks}>Completed</p>
            				</div>
            				<div className={classes.subtasksmaincontainer}>
            					<p className={classes.subtasks}>40%</p>
            					<p className={classes.subtasks}>Pending</p>
            				</div>
            			</div>
            			</div>
            			<Button className={classes.homemenubtn}
						  dataTest="dhis2-uicore-button"
						  name="Basic button"
						  type="button"
						  value="default">
						  GO TO MY TASKS
						</Button>
            		</div>
            		<div className={classes.tasksmainholder}>
            			<div className={classes.tasksmaincontainer}>
            			<p className={classes.maintasks}>384</p>
            			<p className={classes.maintasks}>TOTAL CLIENTS</p>
            			<div className={classes.subtasksmainholder}>
            				<div className={classes.subtasksmaincontainer}>
            					<p className={classes.subtasks}>35%</p>
            					<p className={classes.subtasks}>Cases</p>
            				</div>
            				<div className={classes.subtasksmaincontainer}>
            					<p className={classes.subtasks}>65%</p>
            					<p className={classes.subtasks}>Contacts</p>

            				</div>
            			</div>
            			</div>
            			<Button className={classes.homemenubtn}
						  dataTest="dhis2-uicore-button"
						  name="Basic button"
						  type="button"
						  value="default">
						  GO TO MY CLIENTS
						</Button>
            		</div>
            		<div className={classes.tasksmainholder}>
            			<div className={classes.tasksmaincontainer}>
            				<p className={classes.maintasks}>103</p>
            				<p className={classes.maintasks}>CONFIRMED</p>
            				<div className={classes.subtasksmainholder}>
            				<div className={classes.subtasksmaincontainer}>
            					<p className={classes.subtasks}>83%</p>
            					<p className={classes.subtasks}>Recovered</p>
            				</div>
            				<div className={classes.subtasksmaincontainer}>
            					<p className={classes.subtasks}>17%</p>
            					<p className={classes.subtasks}>Deaths</p>
            				</div>
            			</div>
            			</div>
            			<Button className={classes.homemenubtn}
						  dataTest="dhis2-uicore-button"
						  name="Basic button"
						  type="button"
						  value="default">
						  GO TO MY DASHBOARD
						</Button>
            		</div>
            	</div>
            	<div className={classes.bottomdiv}></div>
            </div>

        </section>

    </main>
    </div>
)

export default MyApp
