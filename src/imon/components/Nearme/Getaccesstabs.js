import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";

import SearchBar from "material-ui-search-bar";

import RoomIcon from "@material-ui/icons/Room";
import InfoIcon from "@material-ui/icons/Info";
import SettingsIcon from "@material-ui/icons/Settings";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import Map from "./Map";
import Getaccesssettings from "./Getaccesssettings";
import Getaccesssources from "./Getaccesssources";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"div"}>{children}</Typography>
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
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const useEffect =
    (() => {
      console.log("j");
    },
    []);

  return (
    <div className="">
      <AppBar
        position="static"
        color="default"
        className="bottom-tabs-bar-appbar"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
          className="bottom-tabs-bar"
        >
          <Tab label="Nearme" icon={<RoomIcon />} {...a11yProps(0)} />
          <Tab label="Information" icon={<InfoIcon />} {...a11yProps(1)} />
          <Tab label="Settings" icon={<SettingsIcon />} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel
          value={value}
          index={0}
          dir={theme.direction}
          className="getaccesstabs-container zero"
        >
          <Map />
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          dir={theme.direction}
          className="getaccesstabs-container zero"
        >
          <SearchBar className="getaccess-searchbar" />
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
          dir={theme.direction}
          className="getaccesstabs-container zero"
        >
          <div>
            <p className="mb-2 mt-3 ml-3 mr-3 fs-0_9375rem">Nearme Sources</p>
            <div className="mb-2 mt-3 ml-3 mr-3">
              <Getaccesssources></Getaccesssources>
            </div>
          </div>
          <div>
            <p className="mb-2 mt-3 ml-3 mr-3 fs-0_9375rem">Proximity</p>
            <div className="proximity-slidercontainer ml-3 mr-3">
              <Slider
                defaultValue={0}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={50}
                className="proximityslider"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 mt-3 ml-3 mr-3 fs-0_9375rem">Tags</p>
            <div className="mb-2 mt-3 ml-3 mr-3">
              <Getaccesssettings></Getaccesssettings>
            </div>
          </div>
          <div className="mb-2 mt-3 ml-3 mr-3 text-left">
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              className="mb-3 mr-3 getaccess-settings-actionbtn"
              startIcon={<CheckIcon />}
            >
              Apply
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              className="mb-3 getaccess-settings-actionbtn"
              startIcon={<CloseIcon />}
            >
              Reset
            </Button>
          </div>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
