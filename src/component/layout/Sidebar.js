import React, {Component} from 'react'
import { Link, Redirect } from "react-router-dom";
import {
    MenuItem, 
    Menu
} from '@dhis2/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faHome,
    faUserPlus,
    faSearch,
    faBullhorn,
    faFileAlt,
    faUsers,
    faFileInvoice,
    faEdit,
    faWifi,
    faCog,
    faSignOutAlt,
    faFileSignature,
    faUserFriends,
    faShareSquare,
    faPrescriptionBottle,
    faFlask,
    faPills,
    faMale,
    faRobot,
    faVideo,
    faEye,
    faFilePdf 
} from '@fortawesome/free-solid-svg-icons'
class Sidebar extends Component {
    
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
    }
    logout(){
        //debugger;
        
        sessionStorage.removeItem('userBO');
        this.props.history.push("/login");
    }
    render(){
        return(
            <aside style={{ width: 200, height: '100%', flexGrow: 0 }}>
                <Menu>
                    <Link  
                        className='nav-link'
                        to='/layout/home' >
                        <MenuItem
                            dataTest="dhis2-uicore-menuitem"
                            icon={
                                <FontAwesomeIcon icon={faHome} />
                            }
                            label="Home"
                        />
                    </Link>
                    <Link  
                        className='nav-link'
                        to='/layout/registration' >
                        <MenuItem
                            dataTest="dhis2-uicore-menuitem"
                            icon={
                                <FontAwesomeIcon icon={faUserPlus} />
                            }
                            label="Add New Client"
                        />
                    </Link>
                    <Link  
                        className='nav-link'
                        to='/layout/search' >
                        <MenuItem
                            dataTest="dhis2-uicore-menuitem"
                            icon={
                                <FontAwesomeIcon icon={faSearch} />
                            }
                            label="Search"
                        />
                    </Link>
                    <Link  
                        className='nav-link'
                        to='/layout/cases' >
                        <MenuItem
                            dataTest="dhis2-uicore-menuitem"
                            icon={
                                <FontAwesomeIcon icon={faUsers} />
                            }
                            label="Cases"
                        />
                    </Link>
                    
                    <MenuItem
                        dataTest="dhis2-uicore-menuitem"
                        icon={
                            <FontAwesomeIcon icon={faFileAlt} />
                        }
                        label="Task List"
                    />
                    <MenuItem
                        dataTest="dhis2-uicore-menuitem"
                        icon={
                            <FontAwesomeIcon icon={faBullhorn} />
                        }
                        label="Alerts"
                    />
                    <MenuItem
                        dataTest="dhis2-uicore-menuitem"
                        icon={
                            <FontAwesomeIcon icon={faFileInvoice} />
                        }
                        label="Dispatch Details"
                    />
                    {/* <MenuItem
                        dataTest="dhis2-uicore-menuitem"
                        icon={
                        <FontAwesomeIcon icon={faEdit} />
                        }
                        label="Feedback"
                    /> */}
                    {/* <MenuItem
                    dataTest="dhis2-uicore-menuitem"
                    icon={
                    <FontAwesomeIcon icon={faWifi} />
                    }
                    label="Offline Registrations"
                    />
                    <MenuItem
                    dataTest="dhis2-uicore-menuitem"
                    icon={
                    <FontAwesomeIcon icon={faCog} />
                    }
                    label="Settings"
                    /> */}
                    <MenuItem
                    dataTest="dhis2-uicore-menuitem"
                    icon={
                    <FontAwesomeIcon icon={faCog} />
                    }
                    label="Settings"
                    />
                    <MenuItem
                        dataTest="dhis2-uicore-menuitem"
                        icon={
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        }
                        label="Logout"
                        onClick={this.logout}
                    />
                </Menu>
            </aside>
            
        )
    }

    
}
export default Sidebar;