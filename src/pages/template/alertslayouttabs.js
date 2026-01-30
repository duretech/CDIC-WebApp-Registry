import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import HelpIcon from '@material-ui/icons/Help';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ReceiptIcon from '@material-ui/icons/Receipt';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import VideocamIcon from '@material-ui/icons/Videocam';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';

import Button from '@material-ui/core/Button';

import Alertslist from './alertslist.js';
import Alertslist1 from './alertslist1.js';
import Alertslist2 from './alertslist2.js';
import Alertslist3 from './alertslist3.js';
import Link from "@material-ui/core/Link";

import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import LinkIcon from "@material-ui/icons/Link";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import MapIcon from "@material-ui/icons/Map";

import TimelapseIcon from '@material-ui/icons/Timelapse';
import InvertColorsIcon from '@material-ui/icons/InvertColors';

import imgUrl from "../../assets/images/imageUrl.js";

import Customcircularprogress1 from './Customcircularprogress1.js';


import '../../assets/css/customstyles.css'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
  },
}));

export default function ScrollableTabsButtonForce() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" className="registrationtabs layouttabs">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab label="HTC Service Pending" icon={<TimelapseIcon />} {...a11yProps(0)} />
          <Tab label="Eligible for Retesting" icon={<InvertColorsIcon />} {...a11yProps(1)} />
          
          
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className="regscrolltabs layoutscrolltabs">
        <Grid container spacing={3}>
       
        <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
          <Alertslist></Alertslist>
        </Grid>
         <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
          <Alertslist1></Alertslist1>
        </Grid>
        
        </Grid>

      </TabPanel>

      <TabPanel value={value} index={1} className="regscrolltabs layoutscrolltabs">
       <Grid container spacing={3}>
       
        <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
          <Alertslist2></Alertslist2>
        </Grid>
         <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
          <Alertslist3></Alertslist3>
        </Grid>
        
        </Grid>
      </TabPanel>
     
      
    </div>
  );
}
