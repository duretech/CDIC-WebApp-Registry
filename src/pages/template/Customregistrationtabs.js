import React from 'react';
import { withTranslation, Trans } from 'react-i18next';
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

import Button from '@material-ui/core/Button';


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
      <AppBar position="static" color="default" className="registrationtabs">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab label="Registration" icon={<ReceiptIcon />} {...a11yProps(0)} />
          <Tab label="HIV Testing and Counselling" icon={<ReceiptIcon />} {...a11yProps(1)} />
          <Tab label="Sexsually Transmitted" icon={<ReceiptIcon />} {...a11yProps(2)} />
          <Tab label="Tuberculosis" icon={<ReceiptIcon />} {...a11yProps(3)} />
          <Tab label="Condoms" icon={<ReceiptIcon />} {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className="regscrolltabs">
        <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="Father's Last Name"
          defaultValue=""
        />
        </Grid>
        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="Mother's Last Name"
          defaultValue=""
        />
        </Grid>
        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="State/Region of Birth"
          defaultValue=""
        />
        </Grid>

        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="Township of Birth"
          defaultValue=""
        />
        </Grid>
        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="Gender"
          defaultValue=""
        />
        </Grid>
        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="Year of Birth"
          defaultValue=""
        />
        </Grid>

        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="Nickname"
          defaultValue=""
        />
        </Grid>
        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="Mobile Number"
          defaultValue=""
        />
        </Grid>
        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="Key Population"
          defaultValue=""
        />
        </Grid>

        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="Place of Birth"
          defaultValue=""
        />
        </Grid>
        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="QR Code"
          defaultValue=""
        />
        </Grid>
        <Grid item xs={12} sm={4}>
           <TextField
          id="standard-helperText"
          label="UIC"
          defaultValue=""
        />
        </Grid>
        </Grid>

        <Grid container spacing={3} className="mt-10px">
        <Grid item xs={12} sm={12}>
        <Button variant="contained" color="primary" disableElevation className="regsubmit-btn">
      <Trans>Submit</Trans>
    </Button>
    <Button variant="contained" color="primary" disableElevation className="regformreset-btn">
    <Trans>Reset</Trans>
    </Button>
        </Grid>
        </Grid>

      </TabPanel>

      <TabPanel value={value} index={1} className="regscrolltabs">
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2} className="regscrolltabs">
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3} className="regscrolltabs">
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4} className="regscrolltabs">
        Item Five
      </TabPanel>
    </div>
  );
}
