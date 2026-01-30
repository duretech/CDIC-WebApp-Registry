import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LineChart from './LineChart';
import HBA1c from './HBA1C';
import Glucose from './Glucose';
import { useTranslation } from "react-i18next";
import { APP_LOCALE } from "../../assets/data/config";

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

export default function InsulineTabs(props) {
  const { t, i18n } = useTranslation(); 

  const { dashboardLineChart, onTabChange, selectedYear } = props;
  const [value, setValue] = React.useState(0);
  
  const handleChange = (event, newValue) => {
    console.log("handleChange", newValue);
    setValue(newValue);
    onTabChange(newValue); // Calling the parent callback function
  };

  return (
    <Box sx={{ width: '100%' }} className="insuline-chartSection commonHomeTabs">
      <Box sx className="insuline-tabs">
        {/* <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        {APP_LOCALE === "CC008" ? (
          <>
            <Tab label={t("Basal Insulin")} {...a11yProps(0)} />
            <Tab label={t("Bolus Insulin")} {...a11yProps(1)} />
          </>
        ) : (
          <>
            <Tab label={t("INSULIN")} {...a11yProps(0)} />
            <Tab label={t("HBA1C")} {...a11yProps(1)} />
            <Tab label={t("GLUCOSE")} {...a11yProps(2)} />
          </>
        )}
         
         
        </Tabs> */}
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable"
  scrollButtons
  allowScrollButtonsMobile>
  {(
    APP_LOCALE === "GANDHIO"
      ? [
          { label: t("Basal Insulin"), index: 0 },
          { label: t("Bolus Insulin"), index: 1 },
        ]
      : [
          { label: t("INSULIN"), index: 0 },
          { label: t("HBA1C"), index: 1 },
          { label: t("GLUCOSE"), index: 2 },
        ]
  ).map((tab) => (
    <Tab key={tab.index} label={tab.label} {...a11yProps(tab.index)} variant="scrollable"
  scrollButtons
  allowScrollButtonsMobile />
  ))}
</Tabs>
       {/* <FastForwardIcon className='mb-10px'></FastForwardIcon> */}
      </Box>
      <CustomTabPanel value={value} index={0}>
      <LineChart dashboardLineChart={dashboardLineChart?dashboardLineChart:""}
      selectedYear={selectedYear}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <HBA1c dashboardLineChart={value && value == 1? dashboardLineChart?dashboardLineChart:"":""}
        selectedYear={selectedYear}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Glucose dashboardLineChart={value && value == 2? dashboardLineChart?dashboardLineChart:"":""}
        selectedYear={selectedYear}/>
      </CustomTabPanel>
    </Box>
  );
}

InsulineTabs.propTypes = {
  dashboardLineChart: PropTypes.array.isRequired,
  onTabChange: PropTypes.func.isRequired, // Adding PropTypes validation for the new prop
  selectedYear: PropTypes.number.isRequired
};