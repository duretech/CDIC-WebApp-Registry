import React, { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import PropTypes from "prop-types";
import classnames from "classnames";
import imgUrl from "../../assets/images/imageUrl";
import {
  useHistory,
  withRouter,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import {
  withStyles,
  makeStyles,
  useTheme,
  withTheme,
} from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import SwipeableViews from "react-swipeable-views";
import { logError } from "../../helpers/auth";
import BusinessIcon from "@material-ui/icons/Business";
import RoomIcon from "@material-ui/icons/Room";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ScheduleIcon from "@material-ui/icons/Schedule";

import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import ChatProfile from "./ChatProfile";
import PendingApplicantList from "./PendingApplicantList";
import Services from "../../api/api";

import {
  setChatType,
  setSelectedComponentObject,
  setBottomNavComponentObject,
  partialSetSelectedComponentObject,
  setcomponentbgcolor
} from "../../redux/actions/appActions";
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
import Feedback from "../Feedback";
import ChatTabs from "./ChatTabs";
import FooterMenu from "../../../component/layout/FooterMenu";
// const ChatList = React.lazy(() => import('./ChatList'));
// const ChatProfile = React.lazy(() => import('./ChatProfile'));
// const ChatList = lazy(() => {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(import("./ChatList")), 500);
//   });
// });
// const ChatProfile = lazy(() => {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(import("./ChatProfile")), 500);
//   });
// });

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

class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      value: 0,
      chatType: "group",
      tabList: [],
      adminObj: JSON.parse(localStorage.getItem('adminobj')) != null ? JSON.parse(localStorage.getItem('adminobj')) : {},
      openProf:false
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.roleType = JSON.parse(localStorage.getItem('obj')).roleType;
  }

  componentDidMount() {
    gaLogEvent("Get Connected", '', '');
    gaLogScreen("ChatWindow");
    this.getTablist()
    this.checkActiveTab()
    console.log("chat component did mount");
    let usageData = {
      'userId': JSON.parse(localStorage.getItem("obj")).userId,
      'module': 'Chat',
      'communityId': localStorage.getItem("communityid")
    }
    if (navigator.onLine) {
      Services.saveUsageData(usageData).then((data) => {
        try {
          console.log("UsageData", data);
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'ChatContainer',
            method: 'componentDidMount',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }

  getTablist() {
    var menuList = JSON.parse(localStorage.getItem("menuList"));
    var tab = menuList.filter(obj => obj.path == 'peerchat');
    if (tab && tab.length > 0) {
      this.setState({
        tabList: tab[0].childs.filter(obj => obj.isactive && obj.visible),
      });
    }

    // var self = this;
    // var myNotiRedPage = localStorage.getItem('notiRedPage');
    // if (myNotiRedPage) {
    //   myNotiRedPage = JSON.parse(myNotiRedPage);
    //   if (myNotiRedPage.page == '/layout/chatwindow') {
    //     self.handleChange(self, 1);
    //     localStorage.setItem('notiRedPage', '');
    //   }else if (myNotiRedPage.page == '/layout/adminchat') {
    //     self.handleChange(self, 3);
    //     localStorage.setItem('notiRedPage', '');
    //   }
    // }
  }

  checkActiveTab() {
    var activetab = JSON.parse(sessionStorage.getItem('activeTab'))
    if (activetab != null && activetab['chat'] != undefined) {
      this.setChatType(activetab['chat']);
    }
  }

  setChatType = (index) => {
    console.log("setChatType index", index);
    if (index == 0) {
      this.setState(
        {
          chatType: "group",
          value: index,
        },
        () => {
        }
      );
    } else if (index == 1) {
      this.setState(
        {
          chatType: "peer",
          value: index,
        },
      );
    } else if (index == 3) {
      this.setState(
        {
          chatType: "provider",
          value: index,
        }
      );
    } else {
      this.setState({
        chatType: "",
        value: index,
      });
    }

    sessionStorage.setItem('activeTab', JSON.stringify({ 'chat': index }))
  };

  handleChange(event, newValue) {

    console.log("handleChange", event, newValue);
    if (this.state.value == newValue) {
      return;
    }

    let self = this;
    if (event && event.target) {
      let eventTargetText = event.target.textContent;
    }
    self.setChatType(newValue);

    // this.setState({
    //   value: newValue,
    // });
  }

  handleChangeIndex(index, indexLatest, meta) {
    this.setState({
      openProf:false
    })
    console.log("handleChangeIndex::", index)
    if (this.state.value == index) {
      return;
    }
    let chattype = "";
    switch (index) {
      case 0:
        chattype = "forum";
        // this.setState(
        //   {
        //     chatType: "forum",
        //     value: index,
        //   },
        //   () => {
        // if (this.state.value !== index) {
        this.setChatType(index);
        // }
        // }
        // );
        break;
      case 1:
        chattype = "peer";
        // this.setState(
        //   {
        //     chatType: "peer",
        //     value: index,
        //   },
        //   () => {
        // if (this.state.value !== index) {
        this.setChatType(index);
        // }
        //   }
        // );
        break;
      case 3:
        chattype="provider";
        this.setChatType(index)
      default:
        chattype = "";
        this.setChatType(index);
        break;
    }
  }

  gotoTab(newValue) {
    this.setState({
      value: newValue,
    });
  }

  goToGetInvolved() {
    let getInvolvedObj = {
      name: "Get Involved",
      id: 6,
      path: "services",
    };
    this.props.setBottomNavComponentObject(getInvolvedObj);
    this.props.partialSetSelectedComponentObject(getInvolvedObj);
    this.props.history.push(`/layout/${getInvolvedObj.path}`);
  }

  getSlides() {
    var arr = [];
    var userTabIndex = 2;
    const { t } = this.props;
    const { classes, theme } = this.props;
    var len = this.state?.tabList?.length || 0;
    var userTabObj = this.state.tabList.filter(obj => obj.path == 'user')[0];
    if (userTabObj) {
      userTabIndex = this.state.tabList.indexOf(userTabObj);
    }
    if (this.state?.tabList?.length > 0) {
      this.state.tabList.map((tabListObj, index) => {
        var chattype = tabListObj.path == 'chatwithprovider' ? 'provider':(tabListObj.path == 'adminchat' ?'admin' : (tabListObj.path == 'forum' ? "group" : 'peer'))
        arr.push(
          <TabPanel
            value={this.state.value}
            name="Forum"
            index={index}
            dir={theme.direction}
            className={"forum-container"}
            key={index}
          >
            {tabListObj.componentId == 28 || tabListObj.name == "user" ?
              (<ChatProfile changeTab={(val) => this.handleChangeIndex(val)} />) : (
                <ChatList compChatType={chattype} changeTab={() => this.handleChangeIndex(userTabIndex)} />
              )
            }
          </TabPanel>
        )
      })
    }

    if (this?.state?.adminObj && Object.keys(this.state?.adminObj).length != 0) {
      arr.push(
        <TabPanel key={4} value={this.state.value} index={len} dir={theme.direction}>
          <PendingApplicantList />
        </TabPanel>
      )
    }

    return arr;
  }

  openProfile(){
    this.setState({
      openProf:true
    })
  }

  handleBack() {
    window.history.back();
  }

  render() {
    const { t } = this.props;
    const { classes, theme } = this.props;
    const { templateID } = this.props;
    var len = this.state?.tabList?.length;
    //console.log("this.state.tabList", this.state.tabList);
    var compcolor = localStorage.getItem('componentbgcolor')
    let colorStyles = templateID == 2 ? { background: compcolor } : {};
    let bgStyles = templateID == 2 ? { background: `url(${this.state.background})` } : {};
    var sliderArr = []
    if (this.state?.tabList?.length > 0) {
      sliderArr = this.getSlides()
    }

    return (
      <div className={window.cordova ? "getconnectpage" : 'getconnectpage windowdesktop'}>
        <FooterMenu></FooterMenu>
        {/* {
          templateID == 1 && (
            <div className="backgroundivholder">
              <div className="bgdiv1">
                <div className="welcometopcurve">
                  <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" className="shape-fill"></path>
                  </svg>
                </div>
              </div>
              <div className="bgdiv2"></div>
            </div>
          )
        } */}

        <Grid container className="gridcontainer  getconnectmain">
          <Grid container xs={12} className='certinav'>

            <Grid xs={3} className='backimg' onClick={() => this.handleBack()}><img src={imgUrl.whiteback} className='backsvg' /></Grid>
            <Grid xs={6}>
              <Typography variant='subtitle1' className='regname oneuhcfont'>Get Connected</Typography>
            </Grid>
            <Grid xs={3}>
            <Typography variant='body2' className='stepname'><Feedback></Feedback></Typography>
            </Grid>

          </Grid>
          <Grid item xs={12} className="get-connectheader">
            <div className="get-connectheaderdiv">
              <div className={!this.state.openProf ? "profileDivmain" : "hide profileDivmain"} onClick={()=>this.openProfile()}>
                <div className="profileDiv">
                  <img src={imgUrl.eduuser} className="eduUser"/>
                  <Button variant="body1" className="getProfile">User Profile</Button>
                </div>
                
              </div>
              {!this.state.openProf ? <AppBar className="tabheader" position="static" color="default" style={colorStyles}>
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="inherit"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  {
                    this.state?.tabList?.length > 0 ? (
                      this.state.tabList.map((tabListObj, index) => {
                        return (<Tab label={t(tabListObj.label)} {...a11yProps(index)} />)
                      })
                    ) : ('')
                  }
                  {/* <Tab label={t('Forum')} {...a11yProps(0)} /> */}
                  {/* <Tab label={t('Peer')} {...a11yProps(1)} /> */}
                  {/* <Tab icon={<PersonAddIcon />} label="" {...a11yProps(1)} /> */}
                  {/* <Tab label={t('Admin')} {...a11yProps(4)} /> */}
                  {/* <Tab className={Object.keys(this.state.adminObj).length != 0 ? '' : 'hide'} label="Pending" {...a11yProps(len)} /> */}

                </Tabs>
              </AppBar> : <AppBar className="tabheader" position="static" color="default" style={colorStyles}></AppBar>}
              <div className="text-center">
                <img src={imgUrl.connected} className='getconnect' />
                <Typography variant='h6' className="oneuhcfont">Find your community!</Typography>
              </div>
            </div>

          </Grid>
          <Grid item xs={12} className='get-content'>
          {!this.state.openProf ? <SwipeableViews

              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={this.state.value}
              onChangeIndex={this.handleChangeIndex}
              onTransitionEnd={this.state.checkType}
              className="get-connectlist"
            >
              {sliderArr}
            </SwipeableViews> : <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
            onTransitionEnd={this.state.checkType}
            className="get-connectlist">
            <ChatProfile changeTab={(val) => this.handleChangeIndex(val)} />
            </SwipeableViews>}
          </Grid>
          {/* <Grid container xs={12} className="homebottomnav">
          {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="home-svg"  onClick={()=>(!window.location.pathname.includes('imonhome')?this.props.history.push('/layout/imonhome'):'')}>
              <img src={imgUrl.homesvg} />
              <Typography variant="caption" display="block">
                Home
              </Typography>
            </Grid>:<Grid xs={4} className="home-svg" onClick={()=>(!window.location.pathname.includes('imonhome')?this.props.history.push('/layout/imonhome'):'')}>
              <img src={imgUrl.homesvg} />
              <Typography variant="caption" display="block">
                Home
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="journey-svg" onClick={()=>(!window.location.pathname.includes('myjourney')?this.props.history.push('/myjourney'):'')}>
              <img src={imgUrl.journeysvg} />
              <Typography variant="caption" display="block">
                My Journey
              </Typography>
            </Grid>:''}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?this.props.history.push('/layout/nearme'):'')}>
              <img src={imgUrl.nearsvg} />
              <Typography variant="caption" display="block">
                Near Me
              </Typography>
            </Grid>:<Grid xs={4} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?this.props.history.push('/layout/nearme'):'')}>
              <img src={imgUrl.nearsvg} />
              <Typography variant="caption" display="block">
                Near Me
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?this.props.history.push('/layout/getknowledgeable'):'')}>
              <img src={imgUrl.guidesvg} />
              <Typography variant="caption" display="block">
                Guide
              </Typography>
            </Grid>:<Grid xs={4} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?this.props.history.push('/layout/getknowledgeable'):'')}>
              <img src={imgUrl.guidesvg} />
              <Typography variant="caption" display="block">
                Guide
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="connect-svg" onClick={()=>(!window.location.pathname.includes('peerchat')?this.props.history.push('/layout/peerchat'):'')}>
              <img src={imgUrl.connectsvg} />
              <Typography variant="caption" display="block">
                Connect
              </Typography>
            </Grid>:''}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="screen-svg" onClick={()=>(!window.location.pathname.includes('aisurvey')?this.props.history.push('/layout/AiSurvey'):'')}>
              <img src={imgUrl.screensvg} />
              <Typography variant="caption" display="block">
                Survey
              </Typography>
            </Grid>:""}
          </Grid> */}


        </Grid>

        {/* <AiBot /> */}
      </div>
    );
  }
}

// export default ChatContainer;

ChatContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor
  };
};

const TransChatContainer = withTranslation()(ChatContainer);
const ThemeChatContainer = withTheme(TransChatContainer);
const FinalChatContainer = withStyles(useStyles)(ThemeChatContainer);
const routeChatContainer = withRouter(FinalChatContainer);

export default connect(mapStateToProps, {
  setChatType,
  setSelectedComponentObject,
  setBottomNavComponentObject,
  partialSetSelectedComponentObject,
  setcomponentbgcolor
})(routeChatContainer);
