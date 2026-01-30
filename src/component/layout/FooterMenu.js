import React, { useState, useEffect } from 'react'
import classes from '../../App.module.css'
import { Link, Redirect, useHistory } from "react-router-dom";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FolderIcon from '@material-ui/icons/Folder';
import ListAltIcon from '@material-ui/icons/ListAlt';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ChatIcon from '@material-ui/icons/Chat';
import MenuBookIcon from '@material-ui/icons/MenuBook';
//import { Configuration } from '../../assets/data/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withTranslation, Trans } from 'react-i18next';
import OfflineDb from '../../db'

function FooterMenu() {
    const [Configuration,setConfiguration] = useState(null);
    const [sessionUserBoValue, setSessionUserBoValue] = useState(null)
    const [userrolename, setuserrolename] = React.useState(null);
    const patientRole = "Patient Role"
    const superAdmin = 'superuser'
    async function getConfig() {
        let configurations = await OfflineDb.getDataFromPouchDB('configurations')
        setConfiguration(configurations.data.configuration)

        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)
    }
    useEffect(()=>{
        getConfig()
    },[])

    useEffect(() => {
        if (sessionUserBoValue != null) {
            /**SET USER ROLE */
            setuserrolename(sessionUserBoValue.userRoles[0].name || sessionUserBoValue.userRoles[0].displayName);
        }
    }, [sessionUserBoValue]);
    return (
        <div className="bottomnavbar">
            <BottomNavigation
                showLabels
                className={classes.root}
            >
                {Configuration &&
                    Configuration.homepage.footerMenuItems.map((menuItems, index) => {
                        if(userrolename && userrolename == patientRole && menuItems.userrole && menuItems.userrole == patientRole){
                            return (
                                <Link key={index} className={false ? 'anchorLink disbaledLink' : 'anchorLink '} to={menuItems.path}>
                                    <p className="zero text-center bottomIcons">
                                        <div className={menuItems.iconClass} />
                                    </p>
                                    <span className="MuiBottomNavigationAction-label MuiBottomNavigationAction-iconOnly" style={{ 'font-size': '0.75rem' }}>
                                        <Trans>{menuItems.name}</Trans>
                                    </span>
                                </Link>
                            )
                        }
                        else if (userrolename && userrolename.toLowerCase() == superAdmin && menuItems.userrole && menuItems.userrole.toLowerCase() == superAdmin) { 
                            return (
                                <Link key={index} className={false ? 'anchorLink disbaledLink' : 'anchorLink '} to={menuItems.path}>
                                    <p className="zero text-center bottomIcons">
                                        <div className={menuItems.iconClass} />
                                    </p>
                                    <span className="MuiBottomNavigationAction-label MuiBottomNavigationAction-iconOnly" style={{ 'font-size': '0.75rem' }}>
                                        <Trans>{menuItems.name}</Trans>
                                    </span>
                                </Link>
                            )
                        }
                        else if (userrolename && userrolename != patientRole && userrolename.toLowerCase() != superAdmin && menuItems.showMenu) { 
                            return (
                                <Link key={index} className={false ? 'anchorLink disbaledLink' : 'anchorLink '} to={menuItems.path}>
                                    <p className="zero text-center bottomIcons">
                                        <div className={menuItems.iconClass} />
                                    </p>
                                    <span className="MuiBottomNavigationAction-label MuiBottomNavigationAction-iconOnly" style={{ 'font-size': '0.75rem' }}>
                                        <Trans>{menuItems.name}</Trans>
                                    </span>
                                </Link>
                            )
                        }
                    })
                }
                {/* <Link className="anchorLink active" to="/addclientpagesecond">
                     <BottomNavigationAction label="Add Clients" icon={<PersonAddIcon />} />
                 </Link>

                 <Link className="anchorLink" to="/">
                     <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
                 </Link>

                 <Link className="anchorLink" to="/layout/cases">
                     <BottomNavigationAction label="My Clients" icon={<FolderIcon />} />
                 </Link>

                 <Link className="anchorLink" to="/mytaskspage">
                   <BottomNavigationAction label="My Tasks" icon={<ListAltIcon />} />
               </Link>
                 <Link className="anchorLink" to="/tutorialpage">
                     <BottomNavigationAction label="Tutorial" icon={<MenuBookIcon />} />
                 </Link>

                 <Link className="anchorLink" to="/chatpage">
                     <BottomNavigationAction label="Chat" icon={<ChatIcon />} />
                </Link> */}
            </BottomNavigation>
        </div>
    );
}

export default FooterMenu