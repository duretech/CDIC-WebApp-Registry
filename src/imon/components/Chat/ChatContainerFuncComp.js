import React, { useEffect, useState } from "react";
import Services from "../../api/api";
import { logError } from "../../helpers/auth";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import ChatProfile from "./ChatProfile";
import { connect } from "react-redux";
import ChatList from "./ChatList";
import ChatListFuncComp from "./ChatListFuncComp";
import { useTranslation } from "react-i18next";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import ChatProfileFunc from "./ChatProfileFunc";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import SwipeableViews from "react-swipeable-views";
import PendingApplicantList from "./PendingApplicantList";
import FooterMenu from "../../../component/layout/FooterMenu";
import {
  withStyles,
  makeStyles,
  useTheme,
  withTheme,
} from "@material-ui/core/styles";
import {
  setChatType,
  setSelectedComponentObject,
  setBottomNavComponentObject,
  partialSetSelectedComponentObject,
  setcomponentbgcolor,
} from "../../redux/actions/appActions";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  console.log("children", children);
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

function ChatContainerFuncComp(props) {
  const { t, i18n } = useTranslation();
  const { templateID } = props;
  const theme = useTheme();
  const classes = useStyles();
  const [compcolor, setcompcolor] = useState(
    localStorage.getItem("componentbgcolor")
  );
  const [colorStyles, setcolorStyles] = useState(
    templateID == 2 ? { background: compcolor } : {}
  );
  const [sliderArr, setsliderArr] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [apierr, setapierr] = useState(false);
  const [value, setvalue] = useState(0);
  const [chatType, setchatType] = useState("group");
  let [userId, setuserId] = useState(null);
  let userobj = localStorage.getItem("obj");
  let [menuList, setmenuList] = useState(null);
  let menuobj = localStorage.getItem("menuList");
  const [tabList, settabList] = useState(null);
  const [adminObj, setadminObj] = useState(
    JSON.parse(localStorage.getItem("adminobj")) != null
      ? JSON.parse(localStorage.getItem("adminobj"))
      : {}
  );

  useEffect(() => {
    if (userId && menuList) {
      saveUsageData();
      getTablist();
      checkActiveTab();
    }
  }, [userId, menuList]);
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    if (userobj) {
      let parseddata = JSON.parse(localStorage.getItem("obj"));
      if (parseddata.hasOwnProperty("userId")) {
        setuserId(parseddata.userId);
      }
    }
    if (menuobj) {
      let parsedmenuobj = JSON.parse(localStorage.getItem("menuList"));
      if (parsedmenuobj) {
        setmenuList(parsedmenuobj);
      }
    }
  }

  useEffect(() => {
    if (tabList && tabList.length > 0) {
      let tempslider = getSlides();
      console.log("sliderArr", tempslider);
      setsliderArr(getSlides());
    }
  }, [tabList, value]);

  const getTablist = () => {
    let tab = "";
    if (menuList) {
      tab = menuList.filter((obj) => obj.path == "peerchat");
    }
    console.log("tab::", tab);
    if (tab && tab.length > 0) {
      let tmptablist = tab[0].childs.filter(
        (obj) => obj.isactive && obj.visible
      );
      console.log("tmptablist>>>", tmptablist);
      settabList(tmptablist);
    }
  };

  const checkActiveTab = () => {
    var activetab = JSON.parse(sessionStorage.getItem("activeTab"));
    console.log("activetab::", activetab);
    if (activetab != null && activetab["chat"] != undefined) {
      props.setChatType(activetab["chat"]);
    }
  };

  const saveUsageData = () => {
    let usageData = {
      userId: userId,
      module: "Chat",
      communityId: localStorage.getItem("CommunityId"),
    };
    if (navigator.onLine) {
      Services.saveUsageData(usageData).then((data) => {
        try {
          console.log("UsageData", data);
        } catch (err) {
          console.log("err::", err);
          setapierr(true)
          console.log(apierr)
          var errorObj = {
            component: "ChatContainer",
            method: "componentDidMount",
            error: err,
          };
          logError(errorObj);
        }
      });
    }
  };

  const setChatType = (index) => {
    console.log("setChatType index", index);
    if (index == 0) {
      setchatType("group");
      setvalue(index);
    } else if (index == 1) {
      setchatType("peer");
      setvalue(index);
    } else if (index == 3) {
      setchatType("admin");
      setvalue(index);
    } else {
      setchatType("");
      setvalue(index);
    }
    sessionStorage.setItem("activeTab", JSON.stringify({ chat: index }));
  };

  const handleChange = (event, newValue) => {
    console.log("handleChange", event, newValue);
    if (value == newValue) {
      return;
    }
    if (event && event.target) {
      let eventTargetText = event.target.textContent;
    }
    props.setChatType(newValue);
    setvalue(newValue);
  };

  const handleChangeIndex = (index, indexLatest, meta) => {
    console.log("handleChangeIndex::", index);
    if (value == index) {
      return;
    }
    let chattype = "";
    switch (index) {
      case 0:
        chattype = "forum";
        setChatType(index);
        break;
      case 1:
        chattype = "peer";
        setChatType(index);
        break;
      default:
        chattype = "";
        setChatType(index);
        break;
    }
  };

  const gotoTab = (newValue) => {
    setvalue(newValue);
  };

  const goToGetInvolved = () => {
    let getInvolvedObj = {
      name: "Get Involved",
      id: 6,
      path: "services",
    };
    props.setBottomNavComponentObject(getInvolvedObj);
    props.partialSetSelectedComponentObject(getInvolvedObj);
    props.history.push(`/layout/${getInvolvedObj.path}`);
  };

  const getSlides = () => {
    console.log("getSlides::");
    var arr = [];
    var userTabIndex = 2;
    var len = tabList ? tabList.length : 0;
    var userTabObj = tabList.filter((obj) => obj.path == "user")[0];
    if (userTabObj) {
      userTabIndex = tabList.indexOf(userTabObj);
    }
    console.log("tabList::", tabList);
    if (tabList && tabList.length > 0) {
      tabList.map((tabListObj, index) => {
        var chattype =
          tabListObj.path == "adminchat"
            ? "admin"
            : tabListObj.path == "forum"
            ? "group"
            : "peer";
        arr.push(
          <TabPanel
            value={value}
            name="Forum"
            index={index}
            dir={theme.direction}
            className={"forum-container"}
            key={index}
          >
            {tabListObj.componentId == 28 || tabListObj.name == "user" ?
              (<ChatProfileFunc changeTab={(val) => handleChangeIndex(val)} />) : (
                <ChatListFuncComp compChatType={chattype} changeTab={() => handleChangeIndex(userTabIndex)} />
              )
            }
          </TabPanel>
        );
      });
    }

    if (Object.keys(adminObj) && Object.keys(adminObj).length != 0) {
      arr.push(
        <TabPanel key={4} value={value} index={len} dir={theme.direction}>
          <PendingApplicantList />
        </TabPanel>
      );
    }
    console.log("insidegogliderarr::", arr);
    return arr;
  };
  return tabList && menuList && apierr == false && userId && props ? (
    <div className="gk-page getknowledgeable_page">
      {templateID == 1 && (
        <div className="backgroundivholder">
          <div className="bgdiv1">
            <div className="welcometopcurve">
              <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
                  class="shape-fill"
                ></path>
              </svg>
            </div>
          </div>
          <div className="bgdiv2"></div>
        </div>
      )}
 <div className={window.cordova ? "getconnectpage" : 'getconnectpage windowdesktop'}>
        <FooterMenu></FooterMenu>
      <div className="gridcontainer">
        <Grid container spacing={3} className="gridcontainer">
          <Grid item xs={12} className="gkdivcontent zero chat-container">
            <AppBar
              className="tabheader"
              position="static"
              color="default"
              style={colorStyles}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                {(tabList && tabList.length > 0)
                  ? tabList.map((tabListObj, index) => {
                      return (
                        <Tab
                          label={t(tabListObj.label)}
                          {...a11yProps(index)}
                        />
                      );
                    })
                  : ""}
                {/* <Tab label={t('Forum')} {...a11yProps(0)} /> */}
                {/* <Tab label={t('Peer')} {...a11yProps(1)} /> */}
                {/* <Tab icon={<PersonAddIcon />} label="" {...a11yProps(1)} /> */}
                {/* <Tab label={t('Admin')} {...a11yProps(4)} /> */}
                {/* <Tab className={Object.keys(this.state.adminObj).length != 0 ? '' : 'hide'} label="Pending" {...a11yProps(len)} /> */}
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
              //   onTransitionEnd={checkType}
              className="infotabcontainer getaccesstabspage chat-list-swipe"
              style={{marginTop:"100px"}}
            >
              {sliderArr}
              {/* <TabPanel
                  value={this.state.value}
                  name="Forum"
                  index={0}
                  dir={theme.direction}
                  className={"forum-container"}
                >
    
                  <div className="regnotificdiv">
                    <Grid container>
                      <Grid item xs={12}>
                        <h5 className="m-0">
                          {t('Remember to report problems that you are having through')}
                        </h5>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          style={{ background: this.props.componentbgcolor }}
                          className=""
                          variant="contained"
                          color="primary"
                          disableElevation
                          onClick={() => this.goToGetInvolved()}
                        >
                          <ScheduleIcon className="mr-10" />  <span><Trans> {t("Get Involved")} </Trans></span>
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </TabPanel> */}
              {/* <TabPanel
                  value={this.state.value}
                  name="Chat"
                  index={0}
                  dir={theme.direction}
                >
                  <Suspense fallback={<div>Loading...</div>}>
                    <ChatList
                      compChatType={this.state.chatType}
                      changeTab={() => this.handleChangeIndex(2)}
                    />
                  </Suspense>
                </TabPanel>
                <TabPanel
                  value={this.state.value}
                  index={1}
                  dir={theme.direction}
                >
                  <Suspense fallback={<div>Loading...</div>}>
                    <ChatProfile changeTab={(val) => this.handleChangeIndex(val)} />
                    </Suspense>
                </TabPanel> */}
              {/* <TabPanel
                  value={this.state.value}
                  name="Chat"
                  index={3}
                  dir={theme.direction}
                >
                  <ChatList
                    compChatType={this.state.chatType}
                    changeTab={() => this.handleChangeIndex(2)}
                  />
                </TabPanel> */}

              {/* {(this.roleType == 'Admin' || this.roleType == 'SuperAdmin') ? <TabPanel
                  value={this.state.value}
                  index={4}
                  dir={theme.direction}
                >
                  <PendingApplicantList />
                </TabPanel> : ''} */}
            </SwipeableViews>
          </Grid>
        </Grid>
      </div>
      {/* <AiBot /> */}
      </div>
    </div>
  ) : (
    <h3 style={{ textAlign: "center", marginTop: "200px", width: "100%" }}>
      {t("No data found")}
    </h3>
  );
}

export default connect(null, {
  setChatType,
  setSelectedComponentObject,
  setBottomNavComponentObject,
  partialSetSelectedComponentObject,
  setcomponentbgcolor,
})(ChatContainerFuncComp);
