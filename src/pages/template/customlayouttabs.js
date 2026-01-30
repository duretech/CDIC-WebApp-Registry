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

import Gkinfolist from './Gkinfolist.js';
import Gkinfolist1 from './Gkinfolist1.js';
import Link from "@material-ui/core/Link";

import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import LinkIcon from "@material-ui/icons/Link";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import MapIcon from "@material-ui/icons/Map";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          <Tab label={t("Knowledge")} icon={<LocalLibraryIcon />} {...a11yProps(0)} />
          <Tab label={t("User Manual")} icon={<MenuBookIcon />} {...a11yProps(1)} />
          <Tab label={t("Video")} icon={<VideocamIcon />} {...a11yProps(2)} />
          {/* <Tab label={t("Quiz")} icon={<LiveHelpIcon />} {...a11yProps(3)} /> */}
          
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className="regscrolltabs layoutscrolltabs">
        <Grid container spacing={3}>
       
        <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
          <Gkinfolist1></Gkinfolist1>
        </Grid>
         <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
          <Gkinfolist></Gkinfolist>
        </Grid>
        
        
      
        
        </Grid>

        
      </TabPanel>

      <TabPanel value={value} index={1} className="regscrolltabs layoutscrolltabs">
        <Grid container spacing={3}>
       
        <Grid item xs={12} sm={12} md={12} className="">
        <div className="usermanualcontainer">
           <div className="infolinkcontainer">
                <Link href="#" onClick="">
                  <BookmarkBorderIcon />
                </Link>
                <Link href="#" onClick="">
                  <LinkIcon />
                </Link>
                <Link href="#" onClick="">
                  <ChatBubbleOutlineIcon />
                </Link>
                <Link href="#" onClick="">
                  <ThumbUpAltIcon />
                </Link>
              </div>
              <div className="scrollablepost">
              <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={4} lg={2} className="">
        <div className="avatarholder">
                    <p className="zero text-center">
                      <img className="oneimpactlogoimg" src={imgUrl.coughing} />
                    </p>
                  </div>
        </Grid>
        <Grid item xs={12} sm={8} md={8} lg={10} className="">
        <div className="infodetailedpostcontainer">
                  
                  <div className="postcontainer">
                    <p className="posttitle">What should a person newly diagnosed with HIV infection do?</p>
                    <p className="postinfo">
                      If you were diagnosed with HIV, you should contact a medical specialist specializing in HIV infection at the "Trust" office or AIDS center as soon as possible (the best way – within the first three days after receiving a positive HIV test) and undergo corresponding examination. You should not postpone passing the tests because the state of health can deteriorate very quickly in some cases.
                    </p>
                    <p className="postinfo">
                      HIV infection is a disease that develops when the human immunodeficiency virus (HIV) enters the bloodstream. Immunodeficiency is a condition in which body can not resist various infections. HIV lives and multiplies only in human body, destroying cells responsible for protecting the body from various infectious diseases, benign and malignant tumors.
                    </p>
                    <p className="infoupdatedate">Last update: 27 Aug 2020</p>
                  </div>
                </div>
                <div className="posticoncontainer">
                  <p className="postinfo">
                    Click the icon below to access all HIV Testing Center nearby
                  </p>
                  <p className="mapiconcontainer">
                    <MapIcon />
                    <span>GET ACCESS</span>
                  </p>
                </div>
        </Grid>
        </Grid>
                
              </div>
              </div>
        </Grid>
        
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2} className="regscrolltabs layoutscrolltabs">
        <Grid container spacing={3}>
       
        <Grid item xs={12} sm={12} md={4} className="">
          <div class='embed-container'><iframe src='https://www.youtube.com/embed/L-hsaSgzdNg' frameborder='0' allowfullscreen></iframe></div>
        </Grid>
         <Grid item xs={12} sm={12} md={4} className="hide">
          <div class='embed-container'><iframe src='https://www.youtube.com/embed/Ory6peTgTEo' frameborder='0' allowfullscreen></iframe></div>
        </Grid>
        <Grid item xs={12} sm={12} md={4} className="hide">
         <div class='embed-container'><iframe src='https://www.youtube.com/embed/Ory6peTgTEo' frameborder='0' allowfullscreen></iframe></div>
        </Grid>
        
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={3} className="regscrolltabs layoutscrolltabs">
         <Grid container spacing={3}>
       
        <Grid item xs={12} sm={12} md={4} lg={3} className="progresscontainer text-center">
          <p><Customcircularprogress1></Customcircularprogress1></p>
               <p className="quizprogresstext">Course Completion</p>
        </Grid>
         <Grid item xs={12} sm={12} md={4} lg={4} className="quizinfomainholder">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={6} className="">
              <div className="quizinfoholder">
              <p className="quizinfomain">34</p>
              <p className="quizinfosub">Courses</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} className="">
              <div className="quizinfoholder">
              <p className="quizinfomain">23</p>
              <p className="quizinfosub">Completed</p>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={6} className="">
              <div className="quizinfoholder">
              <p className="quizinfomain">5</p>
              <p className="quizinfosub">New</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} className="">
              <div className="quizinfoholder">
              <p className="quizinfomain">7/10</p>
              <p className="quizinfosub">Score</p>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={5} className="">
        
        </Grid>
        
        </Grid>
      </TabPanel>
      
    </div>
  );
}
