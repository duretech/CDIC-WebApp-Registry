import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  useHistory,
  withRouter,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";

import BusinessIcon from "@material-ui/icons/Business";
import RoomIcon from "@material-ui/icons/Room";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

//import "../../assets/css/customstyles.css";

import GroupChatList from "./GroupChatList";
import ApplicantChatList from "./ApplicantChatList";

import ChatList from "./ChatList";
// import MenuRoutes from "../../router/dashboardroutes";
import ChatWindow from "./ChatWindow";
import ChatProfile from './ChatProfile';

import { setChatType } from "../../redux/actions/appActions";

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
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));

function ChatTabs(props) {
  const classes = useStyles();
  const theme = useTheme();
  let history = useHistory();

  let [value, setValue] = React.useState(0);
  let [chatType] = React.useState("group");

  const setChatType = (selectedchattype) => {
    if (selectedchattype == "forum") {
      chatType = "group";
    } else {
      chatType = "peer";
    }
    props.setChatType(chatType);
    history.replace({
      pathname: "/layout/peerchat",
    });
  };

  const handleChange = (event, newValue) => {
    console.log(
      "handleChange>>",
      event.target.textContent.toLowerCase(),
      newValue
    );
    setChatType(event.target.textContent.toLowerCase());
    setValue(newValue);
  };

  const handleChangeIndex = (index, indexLatest, meta) => {
    console.log("handleChangeIndex>>", index, indexLatest, meta);
    switch (index) {
      case 0:
        setChatType("forum");
        break;
      case 1:
        setChatType("peer");
        break;
      default:
        break;
    }
    setValue(index);
  };

  const checkType = (index, type) => {
    console.log("checkType>>", index, type);
  };

  useEffect(() => {
    console.log("useEffect>>", chatType, value);
  }, [value]);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" className="gktabs">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Forum" {...a11yProps(0)} />
          <Tab label="Chat" {...a11yProps(1)} />
          {/* <Tab label="Ask Ella" {...a11yProps(2)} /> */}
          {/* <Tab icon={<PersonAddIcon />} label="" {...a11yProps(3)} /> */}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
        onTransitionEnd={checkType}
        className="infotabcontainer getaccesstabspage chat-list-swipe"
      >
        <TabPanel value={value} name="Forum" index={0} dir={theme.direction}>
          {/* <Switch> */}
            <Route
              
              path="/layout/peerchat"
              component={ChatList}
            />
            {/* <Route exact path="/layout/peerchat/chatwindow" component={ChatWindow} />
          </Switch> */}
        </TabPanel>
        <TabPanel value={value} name="Chat" index={1} dir={theme.direction}>
          {/* sasdas */}
          {/* <Switch>*/}
            <Route
              
              path="/layout/peerchat"
              component={ChatList}
            />
            {/* <Route exact path="/layout/peerchat/chatwindow" component={ChatWindow} /> */}
          {/*</Switch> */}
        </TabPanel>
        {/* <TabPanel value={value} index={2} dir={theme.direction}></TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <ChatProfile />
        </TabPanel> */}
      </SwipeableViews>
    </div>
  );
}

let routeChatTabs = withRouter(ChatTabs);
export default connect(null, { setChatType })(routeChatTabs);