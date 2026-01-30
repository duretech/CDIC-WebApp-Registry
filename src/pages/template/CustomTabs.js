import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {
    MenuItem, 
    Menu,
    TabBar,
    InputField,
    Button
} from '@dhis2/ui';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    padding:'0px 0px !important',
  },
  paddingclass: {
    padding:'20px 0px !important',
  },
  searchformfielddiv: {
  backgroundColor: '#adb9ca',
    color: '#000',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '15px',
     },
searchformbtn: {
     backgroundColor: '#1a7798 !important',
    color: '#fff !important',
    marginTop: '10px',
    marginBottom: '20px',
    },
    whitetext: {
    color: '#fff !important',
    },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" variant="fullWidth">
          <Tab className={classes.whitetext} label="Custom Search" {...a11yProps(0)} />
          <Tab className={classes.whitetext} label="Case Number" {...a11yProps(1)} />
          <Tab className={classes.whitetext} label="UIC" {...a11yProps(2)} />
        </Tabs>
     
      <TabPanel value={value} index={0} className={classes.paddingclass}>
       <InputField className={classes.searchformfielddiv}
                dataTest="dhis2-uiwidgets-inputfield"
                label="Last Name"
                name="LastName"
                value=""
              />

              <InputField className={classes.searchformfielddiv}
                dataTest="dhis2-uiwidgets-inputfield"
                label="First Name"
                name="FirstName"
                value=""
              />

              <InputField className={classes.searchformfielddiv}
                dataTest="dhis2-uiwidgets-inputfield"
                label="Middle Name"
                name="MiddleName"
                value=""
              />

              <Button className={classes.searchformbtn}
                dataTest="dhis2-uicore-button"
                name="Basic button"
                type="button"
                value="default"
              >
                Search
              </Button>
      </TabPanel>
      <TabPanel value={value} index={1} className={classes.paddingclass}>
         <InputField className={classes.searchformfielddiv}
                dataTest="dhis2-uiwidgets-inputfield"
                label="Case Number"
                name="CaseNumber"
                value=""
              />

              <Button className={classes.searchformbtn}
                dataTest="dhis2-uicore-button"
                name="Basic button"
                type="button"
                value="default"
              >
                Search
              </Button>
      </TabPanel>
      <TabPanel value={value} index={2} className={classes.paddingclass}>
        <InputField className={classes.searchformfielddiv}
                dataTest="dhis2-uiwidgets-inputfield"
                label="Enter UIC"
                name="UIC"
                value=""
              />
              <Button className={classes.searchformbtn}
                dataTest="dhis2-uicore-button"
                name="Basic button"
                type="button"
                value="default"
              >
                Search
              </Button>
      </TabPanel>
    </div>
  );
}