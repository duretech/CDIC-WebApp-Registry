import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LineChart from './LineChart';
import FastForwardIcon from '@material-ui/icons/FastForward';
import HBA1c from './HBA1C';
import Glucose from './Glucose';
import BasicTests from './BasicTest';
import LipidProfile from './LipidProfile';
import ThyroidProfile from './ThyroidProfile';
import { withTranslation, Trans, useTranslation } from "react-i18next";
import { useMediaQuery } from '@mui/material';
import OfflineDb from "../../db";

function CustomTabPanel(props) {
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
        <Box sx={{ p: 3 }} className="pb-5px">
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTestsTabs(props) {
  const { t, i18n } = useTranslation();   
  const [value, setValue] = React.useState(0);
  const { basicTestData, onTabChange } = props;
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
   
  async function getMetaData() {
    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);
  }
  React.useEffect(() => {
    getMetaData();
  }, []);

  let isDrop = sessionUserBoValue?.userRoles?.find(
      (role) => role.name === "DROP-HCP"
    );

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onTabChange(newValue);
  };

  // Detect if the screen size is mobile
  const isMobile = useMediaQuery('(max-width:600px)');

 

  return (
    <Box sx={{ width: '100%' }} className="insuline-chartSection insulinBasicTabs commonHomeTabs">
      <Box sx className="insuline-tabs">
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"  variant="scrollable"
  scrollButtons
  allowScrollButtonsMobile>
          <Tab label={t("BASIC TESTS")} {...a11yProps(0)} />
          {!isDrop && <Tab label={t("LIPID PROFILE")} {...a11yProps(1)} />}
          {!isDrop && <Tab label={t("THYROID PROFILE")} {...a11yProps(2)} />}
          {/* <Tab label="BMI" {...a11yProps(3)} className='pointer-none' />
          <Tab label="PULSE " {...a11yProps(4)} className='pointer-none' /> */}
         
        </Tabs>
       {/* <FastForwardIcon className='mb-10px'></FastForwardIcon> */}
      </Box>
      <CustomTabPanel value={value} index={0}>
        <BasicTests basicTestData={basicTestData?basicTestData:""}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <LipidProfile basicTestData={value && value == 1? basicTestData?basicTestData:"":""}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ThyroidProfile basicTestData={value && value == 2? basicTestData?basicTestData:"":""}/>
      </CustomTabPanel>
    </Box>
  );
}