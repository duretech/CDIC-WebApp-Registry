import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';


import {
    MenuItem, 
    Menu,
    Tab,
    TabBar,
    InputField
} from '@dhis2/ui';

import { Apps,Settings,Account,Exit,Message,AttachFile,Email,FolderOpen } from '@dhis2/ui-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome,faUserPlus,faSearch,faBullhorn,faFileAlt,faUsers,faFileInvoice,faEdit,faWifi,faCog,faSignOutAlt,faFileSignature,faUserFriends,faShareSquare,faPrescriptionBottle,faFlask,faPills,faMale } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles({
  list: {
    width: 250,
    backgroundColor: '#3d4d61 !important',
    height: 'calc(100vh - 0px) !important',
    overflowY: 'auto',
  },
  fullList: {
    width: 'auto',

  },
  menuitem: {
    color:'#fff !important',
    fontSize: '13px !important',
    backgroundColor: '#3d4d61 !important',
  },

  whitetext: {
    color: '#fff !important',
  
  },
});

export default function TemporaryDrawer({isClicked, drawerOpen, closeDrawer}) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: drawerOpen,
    bottom: false,
    right: false,
  });

  

  // if(isClicked) {
  //   setState({['left']: drawerOpen})  
  // }
  

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={() => toggleDrawer(anchor, false)}
      onKeyDown={() => toggleDrawer(anchor, false)}
    >
        <Menu>
                
                <MenuItem
                className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faHome} />}
            label="Home"
          />
          <MenuItem
          className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faUserPlus} />}
            label="Add New Client"
          />
          <MenuItem
          className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faSearch} />}
            label="Search"
          />
          <MenuItem
          className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faBullhorn} />}
            label="Alerts"
          />
          <MenuItem
          className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faFileAlt} />}
            label="Task List"
          />
          <MenuItem
          className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faUsers} />}
            label="Cases"
          />
          <MenuItem
          className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faFileInvoice} />}
            label="Dispatch Details"
          />
          <MenuItem
          className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faEdit} />}
            label="Feedback"
          />
          <MenuItem
          className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faWifi} />}
            label="Offline Registrations"
          />
          <MenuItem
          className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faCog} />}
            label="Settings"
          />
          <MenuItem
          className={classes.menuitem}
            dataTest="dhis2-uicore-menuitem"
            icon={<FontAwesomeIcon icon={faSignOutAlt} />}
            label="Logout"
          />
            </Menu>
    </div>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button className={classes.whitetext} onClick={() => toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer anchor={anchor} open={drawerOpen} onClose={() => closeDrawer(false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
