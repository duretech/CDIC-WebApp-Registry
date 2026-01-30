import React, { lazy,Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import IdleTimer from 'react-idle-timer'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Header from "./header";
import NewHeader from './NewHeader';
import Bottomnav from "./Bottomnav";
import MenuRoutes from "../../router/dashboardroutes";
import swal from "sweetalert";
import ChatWindow from '../Chat/ChatWindow';
import Home from '../Homepage';

import {withRouter} from "react-router-dom";
import { connect } from "react-redux";
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
import {
  setSelectedComponentObject,
  resetSelectedCompnentObject,
  setBottomNavComponentObject,
  partialSetSelectedComponentObject,
  setcomponentbgcolor
} from "../../redux/actions/appActions";
// import { auth } from "../../service/firebase";
import ApiServices from "../../api/api";
import OffileDb from '../../config/pouchDB';

import Services from '../Services/Services'
//import PatientSearch from '../PatientSearch/PatientSearch'
import { db, storageRef } from "../../service/firebase";
import ActionAlerts from '../../components/Alert';
import configureStore from '../../redux/store/configureStore';
import { logError } from "../../helpers/auth";

const PatientSearch = lazy(() => import('../PatientSearch/PatientSearch'));


// {
//   path: "/layout/question",
//   name: "Services",
//   component: Services
// },
// {
//   path: "/layout/services",
//   name: "PatientSearch",
//   component: PatientSearch
// },

const store = configureStore();

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aMenuRoutes: [],
      isLoading: false,
    };
    this.idleTimer = null
    this.handleOnAction = this.handleOnAction.bind(this)
    this.handleOnActive = this.handleOnActive.bind(this)
    this.handleOnIdle = this.handleOnIdle.bind(this)
    this.getcomponetColor = this.getcomponetColor.bind(this);
    this.notificationRedirect = this.notificationRedirect.bind(this);
    this.notificationRedirectPeerchat = this.notificationRedirectPeerchat.bind(this);
    this.decreaseAlertCount = this.decreaseAlertCount.bind(this);
    this.checkBackgroundNotifi = this.checkBackgroundNotifi.bind(this);
    this.clearAllData = this.clearAllData.bind(this);
    this.redirectToCms = this.redirectToCms.bind(this);
  }

  componentDidMount() {
    let newcom = localStorage.getItem("NewCommunityId");
    let newurl = localStorage.getItem('NewServiceUrl');
    if(newcom == "true" || newurl == "true"){
      // this.props.history.push("/Onboarding");
      this.clearAllData();
      
    }
    OffileDb.setDatabase()
    this.onDeviceResume()
    this.triggerNotiBackButton()
    localStorage.removeItem('pageHeader');
    gaLogEvent('Home', '', '');
    gaLogScreen("Home");

    this.setRouteMenu()
    
    var self = this;
    console.log('LAYPUT',this.props)
    if (window.cordova) {
      self.triggerDeviceBackButton();
      setTimeout(function () {
        self.checkBackgroundNotifi()
      }, 1000);
    }
    document.addEventListener('deviceready', () => {
      if(window.cordova && window.FirebasePlugin){
        window.FirebasePlugin.onTokenRefresh(function(fcmToken) {
          console.log("fcmToken", fcmToken);
          if(fcmToken){
            localStorage.setItem('fcmToken', fcmToken);
          }
        }, function(error) {
            console.error(error);
        });

        window.FirebasePlugin.hasPermission(function(hasPermission){
          console.log("Permission is " + (hasPermission ? "granted" : "denied"));
          if(!hasPermission){
            window.FirebasePlugin.grantPermission(function(hasPermission){
              console.log("Permission was " + (hasPermission ? "granted" : "denied"));
            });
          }
        });

        window.FirebasePlugin.onMessageReceived(function(message) {
          console.log("Message: " + JSON.stringify(message));
          if(message.messageType === "notification"){
              console.log("Notification message received");
              // store.dispatch({ type: 'SET_FORE_GROUND_NOTI', payload: message })
              if(message.tap){
                  console.log("Tapped in " + message.tap);
                  if (message.page == '/layout/chatwindow' || message.page == '/layout/adminchat') {
                    if (window.location.hash != "#/layout/chatwindow") {
                      self.getcomponetColor('peerchat', message)
                      self.setActiveTab(message)
                      //self.props.history.push("/layout/peerchat");
                      self.notificationRedirectPeerchat(message)
                    } 
                  } else {
                    console.log("myNotiRedPage2::", message.page);
                    // if (!window.location.hash.includes(message.page)) {
                      self.getcomponetColor(message.page, message)
                      self.setActiveTab(message)
                      self.notificationRedirect(message)
                    // }
                  }
              }else if(window.cordova.platformId == "ios"){
                //this local notification is for ios forground mode only
                window.cordova.plugins.notification.local.schedule({
                  title: message.title,
                  text: message.body,
                  page: message.page,
                  msgid: message.msgid,
                  chatType: message.chatType ? message.chatType : '',
                  caseId: message.caseId ? message.caseId : '',
                  senderObj: message.senderObj ? message.senderObj : '',
                  applicant: message.applicant ? message.applicant : '',
                  additionalInfo: message.additionalInfo ? message.additionalInfo : '',
                  foreground: true
                });
              }
          }
          console.dir(message);
        }, function(error) {
            console.error(error);
        });
      }
    }, false);
    if(window.cordova && window.cordova.platformId == 'ios'){
      var body = document.body;
      body.classList.add("ios");
      window.cutout.has()
        .then(function (result) { 
          if(result){
            var body = document.body;
            body.classList.add("iphone");
          }
        });
    }
  }

  clearAllData(){
    var currentid = localStorage.getItem("templateID");
    var fcmToken = localStorage.getItem('fcmToken');
   // auth().signOut();
    OffileDb.deleteDatabse();
    //localStorage.clear();
    this.clearLocalStorage();
    // this.props.history.push("/Onboarding");
    localStorage.setItem('langId', localStorage.getItem("langId"));
    localStorage.setItem("templateID", currentid);
    localStorage.setItem('fcmToken', fcmToken);
  
    // this.props.history.push("/Onboarding");
    const myState = store.getState();
    // if (myState.communityId) {
    //   this.props.history.push("/Onboarding");
    // } else {
    //   this.props.history.push("/CommunityList");
    // }
  }

  clearLocalStorage() {
    var removeKeys = [
      'contentList', 
      'cmshistroy', 
      'datacleareddate', 
      'isGreeted', 
      "obj", 
      "adminobj", 
      "tempuserobj", 
      "i18nextLng", 
      'BotInnit', 
      '_pouch_oneImpactDb', 
      "menuList", 
      "componentbgcolor", 
      "isTourOpen", 
      "_pouch_check_localstorage",
      'healthworkerflag',
      'isVoiceBotEnabled',
      'mapfilters',
      'NewCommunityId',
      'NewServiceUrl',
      'Proximity',
      'GoogleProximity'
    ]
    removeKeys.forEach(obj => {
      localStorage.removeItem(obj)
    })
  }

  setRouteMenu() {
    let aMenuRoutes = MenuRoutes.map((prop, key) => {

      /**
       * CONDITION TO SHOW/HIDE ASSISTANCE MODEL
       */
      let ishealthWorker = JSON.parse(localStorage.getItem('healthworkerflag'))
      if(ishealthWorker && prop.nickname == 'services') {
        prop.component = PatientSearch;
      } else if(prop.nickname == 'services') {
        prop.component = Services;
      }
      /**
       * 
       */
      /**
       * 
       */
      // if(ishealthWorker && prop.name == 'Survey') {
      //   return null
      // }

      if (prop.redirect) {
        return <Redirect from={prop.path} name={prop.name} to={prop.to} key={key} />;
      }
      return (
        <Route path={prop.path} name={prop.name} render={() => <prop.component />} key={key} />
      );
    });
    this.setState({ aMenuRoutes: aMenuRoutes })
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED", this.props);
    if(this.props.location.pathname == "/layout") {
      this.setRouteMenu()
    }
  }

  onDeviceResume() {
    var that = this;
    if (window.cordova) {
      document.addEventListener('deviceready', function () {
        document.addEventListener("resume", function () {
          that.checkBackgroundNotifi()
        }, false);
      })
    }
  }

  decreaseAlertCount(notification){
    console.log("decreaseAlertCount", notification);
    var userId = JSON.parse(localStorage.getItem('obj')).userId;
    let { communityuid, chatConfig, location } = { ...this.props };
    let alertroom = `${communityuid}/mobilealert/${userId}`;
    if(notification && notification.msgid){
      db.ref(alertroom + '/' + notification.msgid).transaction(function (msg) {
        let myMsg = msg;
        myMsg.read = msg + 1;
        return myMsg;
      });
    }
  }

  checkBackgroundNotifi() {
    var self = this;
    var myNotiRedPage = localStorage.getItem('notiRedPage');
    if (myNotiRedPage) {
      myNotiRedPage = JSON.parse(myNotiRedPage);
      console.log("myNotiRedPage::", myNotiRedPage);

      // self.decreaseAlertCount(myNotiRedPage);
      if (myNotiRedPage.page == '/layout/services' && myNotiRedPage.chatType == 'service' && window.location.hash.includes('ServicesChatWindow')) {
        return false;
      }else if (myNotiRedPage.page == '/layout/services' && myNotiRedPage.chatType == 'service' && !window.location.hash.includes('ServicesChatWindow')) {
        // this.notificationRedirectPeerchat();
        console.log("myNotiRedPage 2::", myNotiRedPage);
        if(localStorage.getItem("FBuser")){
          this.props.history.push({
            pathname: "/layout/ServicesChatWindow",
            state: {
              caseObj: { caseId: myNotiRedPage.caseId, chatType: "peer", userId: JSON.parse(localStorage.getItem("obj")).userId },
              userObj: { caseId: myNotiRedPage.caseId, chatType: "peer", uid: JSON.parse(localStorage.getItem("FBuser")).uid },
              chatType: 'peer'
            }
          });
        }else{
          this.props.history.push({
            pathname: "/layout/ServicesChatWindow",
            state: {
              caseObj: { caseId: myNotiRedPage.caseId, chatType: "peer", userId: JSON.parse(localStorage.getItem("obj")).userId },
              userObj: { caseId: myNotiRedPage.caseId, chatType: "peer", uid: JSON.parse(localStorage.getItem("obj")).userId },
              chatType: 'peer'
            }
          });
        }
      }else if (myNotiRedPage.page == '/layout/chatwindow' || myNotiRedPage.page == '/layout/adminchat') {
        if (window.location.hash != "#/layout/chatwindow") {
          self.getcomponetColor('peerchat' , myNotiRedPage)
          self.setActiveTab(myNotiRedPage)
          self.notificationRedirectPeerchat(myNotiRedPage)
        }
      } else {
        // if (!window.location.hash.includes(myNotiRedPage.page)) {
          self.getcomponetColor(myNotiRedPage.page , myNotiRedPage)
          self.setActiveTab(myNotiRedPage)
          self.notificationRedirect(myNotiRedPage)

        // }
      }
      localStorage.removeItem('notiRedPage')
    }
  }


  triggerDeviceBackButton() {
    var that = this;
    const { t } = this.props;
    if (window.cordova) {
      document.addEventListener('deviceready', function () {
        document.addEventListener("backbutton", function () {
          console.log("test pathname", that.props.history.location.pathname)
          switch (that.props.history.location.pathname) {
            case '/layout':
              swal({
                title: "",
                text: t("Do you want to exit the application"),
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
                .then((willDelete) => {
                  if (willDelete) {
                    if (navigator.app) {
                      navigator.app.exitApp();
                    } else if (navigator.device) {
                      navigator.device.exitApp();
                    } else {
                      window.close();
                    }
                  } else {
                    //  console.log('hi') 
                  }
                });

              break;
            case '/layout/knowyourrights':
              that.props.history.push("/layout");
              // localStorage.setItem('BotInnit', "true");
              break;
            case '/layout/getknowledgeable':
              that.props.history.push("/layout");
              // localStorage.setItem('BotInnit', "true");
              break;
            case '/layout/information':
              that.props.history.push("/layout");
              // localStorage.setItem('BotInnit', "true");
              break;
            case '/layout/nearme':
              that.props.history.push("/layout");
              // localStorage.setItem('BotInnit', "true");
              break;
            case '/layout/peerchat':
              that.props.history.push("/layout");
              // localStorage.setItem('BotInnit', "true");
              break;
            case '/layout/services':
              that.props.history.push("/layout");
              // localStorage.setItem('BotInnit', "true");
              break;
            case '/layout/settings':
              that.props.history.push("/layout");
              // localStorage.setItem('BotInnit', "true");
              break;
            default:
              that.props.history.goBack();
              break;
            // }
          }
        }, false);
      })
    }
  }

  triggerNotiBackButton() {
    var that = this;
    if (window.cordova) {
      document.addEventListener('deviceready', function () {
        // Foreground Local notification clicked
        if(window.cordova.plugins && window.cordova.plugins.notification){
          window.cordova.plugins.notification.local.on("click", function (notification) {
            console.log("forgran2 layoutpage3: ", window.location.hash, notification);
            if (notification.page == '/layout/chatwindow' || notification.page == '/layout/adminchat') {
              if (window.location.hash != "#/layout/chatwindow") {
                that.getcomponetColor('peerchat', notification)
                that.setActiveTab(notification)
                //that.props.history.push("/layout/peerchat");
                that.notificationRedirectPeerchat(notification)
              } 
            } else {
              console.log("myNotiRedPage2::", notification.page);
              // if (!window.location.hash.includes(notification.page)) {
                that.getcomponetColor(notification.page, notification)
                that.setActiveTab(notification)
                that.notificationRedirect(notification)
              // }
            }
            // setTimeout(function(){
            //   that.decreaseAlertCount(notification);
            // },2000);
          })
        }
      })
    }
  }


  notificationRedirectPeerchat(notification) {
    console.log("notificationRedirectPeerchat", notification)
    // let user = auth().currentUser
    let FBuser = JSON.parse(localStorage.getItem("FBuser"))
    // this.decreaseAlertCount(notification);
    if (!window.location.hash.includes(notification.page)) {
      if (FBuser != null && !window.location.hash.includes('chatwindow') && notification.senderObj) {
        let senderObj = JSON.parse(notification.senderObj)
        this.props.history.push({
          pathname: "/layout/chatwindow",
          state: {
            applicant: { id: senderObj.id, urlOfIcon:senderObj.imgsrc, fcmId: senderObj.fcmId, title: notification.title },
            userObj: FBuser,
            chatType: "peer",
          }
        });
      } else if (FBuser != null && !window.location.hash.includes('chatwindow') && notification.applicant && notification.chatType == "group") {
        let grpObj = JSON.parse(notification.applicant)
        this.props.history.push({
          pathname: "/layout/chatwindow",
          state: {
            applicant: { id: grpObj.id, urlOfIcon:grpObj.imgsrc, title: notification.title, groupName: notification.title },
            userObj: FBuser,
            chatType: "group",
          }
        });
      } else if (notification && notification.chatType == "admin") {
        // let myMenuList = JSON.parse(localStorage.getItem("menuList"))
        // myMenuList.map(function(data){
        //   if(data.path == "peerchat"){
        //     console.log(data)
        //   }
        // })
        // sessionStorage.setItem('activeTab', JSON.stringify({ 'chat': 2 }))
        // this.props.history.push("/layout/peerchat");
        let senderObj = notification
        this.props.history.push({
          pathname: "/layout/chatwindow",
          state: {
            applicant: { id: senderObj.id, urlOfIcon:senderObj.imgsrc, fcmId: senderObj.fcmId, title: notification.title },
            userObj: FBuser,
            chatType: "admin",
          }
        });
      } else {
        this.props.history.push("/layout/peerchat");
      }
    }
  }


  notificationRedirect(notification) {
    if(notification.additionalInfo && ((typeof notification.additionalInfo) === "string")){
      let additionalInfoParsed = JSON.parse(notification.additionalInfo);
      notification.additionalInfo = additionalInfoParsed;
    };
    // let user = auth().currentUser
    // if (!window.location.hash.includes(notification.page)) {
      if (notification.page == '/layout/services' && notification.chatType == 'service' && !window.location.hash.includes('ServicesChatWindow')) {
        console.log("noti redirect", notification);
        if(localStorage.getItem("FBuser")){
          this.props.history.push({
            pathname: "/layout/ServicesChatWindow",
            state: {
              caseObj: { caseId: notification.caseId, chatType: "peer", userId: JSON.parse(localStorage.getItem("obj")).userId },
              userObj: { caseId: notification.caseId, chatType: "peer", uid: JSON.parse(localStorage.getItem("FBuser")).uid },
              chatType: 'peer'
            }
          });
        }else{
          this.props.history.push({
            pathname: "/layout/ServicesChatWindow",
            state: {
              caseObj: { caseId: notification.caseId, chatType: "peer", userId: JSON.parse(localStorage.getItem("obj")).userId },
              userObj: { caseId: notification.caseId, chatType: "peer", uid: JSON.parse(localStorage.getItem("obj")).userId },
              chatType: 'peer'
            }
          });
        }
      } else if (notification.additionalInfo && notification.page == "/layout/information") {
        if (!window.location.hash.includes(notification.page)) {
          this.redirectToCms(notification)
        }
      } else if (notification.additionalInfo && (notification.page == "/layout/services" || notification.page == "/layout/survey")) {
        this.redirectTOServiecSurveyForm(notification)
      } else if(notification.page == '/layout/services' && notification.chatType == 'service' && window.location.hash.includes('ServicesChatWindow')){
        return false;
      } else {
        this.props.history.push(notification.page);
      }
    // }
  }

  redirectTOServiecSurveyForm(notification) {
    let additionalInfo = notification.additionalInfo;
    if(notification.additionalInfo && ((typeof notification.additionalInfo) === "string")){
      let additionalInfoParsed = JSON.parse(notification.additionalInfo);
      notification.additionalInfo = additionalInfoParsed;
    };
    console.log("additionalInfo", additionalInfo)
    if (additionalInfo.type == "update" && notification.page == "/layout/services") {
      this.props.history.push({
        pathname: "/layout/ServiceForm",
        state: { id: additionalInfo.id, communityId: localStorage.getItem("CommunityId") },
      });
    } else if (additionalInfo.type == "update" && notification.page == "/layout/survey") {
      this.props.history.push({
        pathname: "/layout/SurveyForm",
        state: { id: additionalInfo.id, isSectionEnabled: false },
      });
    } else {
      this.props.history.push(notification.page);
    }
  }

  redirectToCms(notification){
    let additionalInfo = notification.additionalInfo
    if(additionalInfo && ((typeof additionalInfo) == "string")){
      let additionalInfoParsed = JSON.parse(additionalInfo);
      additionalInfo = additionalInfoParsed;
    };
    console.log(additionalInfo)
    if ((additionalInfo.root == "28" || additionalInfo.contentId == 28) && !window.location.hash.includes('knowyabdbdourrights')) {
      console.log("layur knowyourrights")
      this.redirectToKnowYouRyt(notification)
    } else if ((additionalInfo.root == "51" || additionalInfo.contentId == 51) && !window.location.hash.includes('getknowledgeable')) {
      console.log("layur getknowledgeable")
      this.redirectToGetKnow(notification)
    } else {
      console.log("layur information")
      this.redirectToInfo(notification)
    }
  }

  redirectToInfo(notification) {
    var that = this
    let additionalInfo = notification.additionalInfo
    if(additionalInfo && ((typeof additionalInfo) == "string")){
      let additionalInfoParsed = JSON.parse(additionalInfo);
      additionalInfo = additionalInfoParsed;
    };
    let path = additionalInfo.path;
    var menuobj = JSON.parse(localStorage.getItem("menuList")).filter(obj => obj.path == "information" && obj.isactive && obj.visible);
    var contentid = additionalInfo.root == "" ? additionalInfo.contentId : additionalInfo.root
    sessionStorage.setItem('notiAccording', JSON.stringify(path.map(boj=> parseInt(boj))))
    if(path.length == 1 && additionalInfo.parentId == 1 ){
      that.props.history.push({
        pathname: "/layout/information",
        state: {
          name: menuobj[0].name,
          id: menuobj[0].componentId,
          componentbgcolor: menuobj[0].layout.componentbgcolor,
        },
      });
    } else if (path.length <= 2) {
      OffileDb.getData('KnowledgeableTabDetail').then(function (result) {
        console.log(result)
        if (!result.status && result.status != 404) {
          var dataobj = result.data.childs.filter(obj => obj.contentId == contentid)
          if (dataobj.length > 0) {
            localStorage.setItem('pageHeader', dataobj[0].contentName)
            that.props.history.push({
              pathname: "/layout/getknowledgeableDetail",
              state: dataobj[0],
            });
          }
        } else if (menuobj.length > 0) {
          that.getInfoApiDetail(menuobj[0].componentId, contentid)
        }
      });
    } else {
      this.redirectToInfoChild(path)
    }
  }

  redirectToInfoChild(path){
    var ParentID = path[path.length - 3]
    var contentid = path[path.length - 2]
    var that = this
    var dbId = 'KnowledgeableDetail-' + ParentID;
    OffileDb.getData(dbId).then(function (result) {
      console.log(result)
      if (!result.status && result.status != 404) {
        var dataobj = result.data.childs.filter(obj => obj.contentId == contentid)
        if (dataobj.length > 0) {
          localStorage.setItem('pageHeader', dataobj[0].contentName)
          that.props.history.push({
            pathname: `/layout/Knowledgechild/${contentid}`,
            state: dataobj[0],
          });
        } 
      } else {
        that.getInfoApiChild(ParentID, contentid)
      }
    });
  }

  getInfoApiChild(ParentID, contentid){
    if (navigator.onLine) {
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        contentId: ParentID,
        languageId: localStorage.getItem("langId"),
        roleId: JSON.parse(localStorage.getItem("obj")).roleId,
        userId: JSON.parse(localStorage.getItem("obj")).userId,
      };
      console.log("getrolewise params::", params);
      var dbId = 'KnowledgeableDetail-' + ParentID;
      ApiServices.getRoleWiseContent(params).then((res) => {
        try {
          if (res.data.status == 200) {
            if (res.data.data.childs && res.data.data.childs.length > 0) {
              var dataobj = res.data.data.childs.filter(obj => obj.contentId == contentid)
              if (dataobj.length > 0) {
                localStorage.setItem('pageHeader', dataobj[0].contentName)
                this.props.history.push({
                  pathname: `/layout/Knowledgechild/${contentid}`,
                  state: dataobj[0],
                });
              }
              OffileDb.setData(dbId, res.data.data)
            }
          }
        } catch (err) {
          console.log("err::", err);
          var errorObj = {
            component: 'Layout',
            method: 'getInfoApiChild',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }

  getInfoApiDetail(contentid, childId){
    console.log(contentid)
    if (navigator.onLine) {
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        contentId: 1,
        languageId: localStorage.getItem("langId"),
        roleId: JSON.parse(localStorage.getItem("obj")).roleId,
        userId: JSON.parse(localStorage.getItem("obj")).userId,
      };
      console.log("getrolewise params::", params);
      ApiServices.getRoleWiseContent(params).then((res) => {
        try{
          if (res.data.status == 200) {
            if (res.data.data.childs && res.data.data.childs.length > 0) {
              var dataobj = res.data.data.childs.filter(obj=> obj.contentId == childId)
              if(dataobj.length > 0) {
                localStorage.setItem('pageHeader', dataobj[0].contentName)
                this.props.history.push({
                  pathname: "/layout/getknowledgeableDetail",
                  state: dataobj[0],
                });
              }
              OffileDb.setData('KnowledgeableTabDetail', res.data.data)
            }
          }
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'Layout',
            method: 'getInfoApiDetail',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }
  
  redirectToGetKnow(notification) {
    let additionalInfo = notification.additionalInfo
    if(additionalInfo && ((typeof additionalInfo) == "string")){
      let additionalInfoParsed = JSON.parse(additionalInfo);
      additionalInfo = additionalInfoParsed;
    };
    let path = additionalInfo.path;
    const { templateID } = this.props;
    console.log(path)
    if (path.length == 1 || path.length == 2 ) {
      if(path.length == 2 && path[path.length - 1] == '417'){
        sessionStorage.setItem('activeTab', JSON.stringify({ 'getknowledgeable': 1 }))
      }
      this.props.history.push({
        pathname: "/layout/getknowledgeable",
        state: {
          id: 51
        }
      });
    } else if(path.length == 3 || templateID == 2){
      var that = this
      var parentid = path[1]
      var contentid = path[2]
      sessionStorage.setItem('notiAccording', JSON.stringify(path.map(boj=> parseInt(boj))))
      OffileDb.getData('KnowledgeableSectionDetail-' + parentid).then(function (result) {
        if (!result.status && result.status != 404) {
          var dataobj = result.data.childs.filter(obj => obj.contentId == contentid)
          if (dataobj.length > 0 && dataobj[0].contentList.length > 0) {
            // localStorage.setItem('pageHeader', dataobj[0].contentName)
            // that.props.history.push({
            //   pathname: "/layout/getknowledgeableDetail",
            //   state: dataobj[0],             
            // });
            that.getKnowledgeablSectionApiData(contentid, '', false, 'KnowledgeableSectionDetail-')
          } else {
            that.getKnowledgeablSectionApiData(contentid, '', false, 'KnowledgeableSectionDetail-')
          }
        } else {
          that.getKnowledgeablSectionApiData(parentid, contentid, true, 'KnowledgeableSectionDetail-')
        }
      });
    } else if(templateID == 1){
      var that = this
      var parentid = additionalInfo.parentId
      var contentid = additionalInfo.contentId
      that.getKnowledgeablSectionApiData(parentid, contentid, true,'KnowledgeableDetail-')
      // OffileDb.getData('KnowledgeableDetail-' + parentid).then(function (result) {
      //   if (!result.status && result.status != 404) {
      //     var dataobj = result.data.childs.filter(obj => obj.contentId == contentid)
      //     if (dataobj.length > 0 && dataobj[0].hasChild) {
      //       localStorage.setItem('pageHeader', dataobj[0].contentName)
      //       that.props.history.push({
      //         pathname: "/layout/Knowledgechild/"+dataobj[0].contentId,
      //         state: dataobj[0],
      //       });
      //     } else if(dataobj.length > 0 && !dataobj[0].hasChild) {
      //       sessionStorage.setItem('notiAccording', JSON.stringify(dataobj[0]))
      //       localStorage.setItem('pageHeader', result.data.contentName)
      //       that.props.history.push({
      //         pathname: "/layout/Knowledgechild/"+result.data.contentId,
      //         state: {
      //           contentId: result.data.contentId,
      //           contentList: result.data.contentList,
      //           contentName: result.data.contentName,
      //           hasChild: true,
      //           isLiked: false,
      //           totalComments: result.data.totalComments,
      //           totalLikes: result.data.totalLikes,
      //           totalViews: result.data.totalViews
      //         },
      //       });
      //     } else {
      //       that.getKnowledgeablSectionApiData(parentid, contentid, true,'KnowledgeableDetail-')
      //     }
      //   } else {
      //     that.getKnowledgeablSectionApiData(parentid, contentid, true, 'KnowledgeableDetail-')
      //   }
      // });
    }
  }

  getKnowledgeablSectionApiData(id, childId , flag, dbID){
    console.log(id)
    const { templateID } = this.props;
    if (navigator.onLine) {
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        contentId: id,
        languageId: localStorage.getItem("langId"),
        roleId: JSON.parse(localStorage.getItem("obj")).roleId,
        userId: JSON.parse(localStorage.getItem("obj")).userId,
      };
      ApiServices.getRoleWiseContent(params).then((res) => {
        try{
          if (res.data.status == 200) {
            if (res.data.data.childs) {
              if(flag){
                var dataobj = res.data.data.childs.filter(obj=> obj.contentId == childId)
              } else {
                var dataobj = [res.data.data]
              }
              console.log(dbID)
              OffileDb.setData(dbID + id, res.data.data)
              if(dataobj.length > 0 && templateID == 2) {
                localStorage.setItem('pageHeader', dataobj[0].contentName)
                this.props.history.push({
                  pathname: "/layout/getknowledgeableDetail",
                  state: dataobj[0],
                });
              }  else if(templateID == 1){
                if (dataobj.length > 0 && dataobj[0].hasChild) {
                  localStorage.setItem('pageHeader', dataobj[0].contentName)
                  this.props.history.push({
                    pathname: "/layout/Knowledgechild/"+dataobj[0].contentId,
                    state: dataobj[0],
                  });
                } else if(dataobj.length > 0 && !dataobj[0].hasChild) {
                  sessionStorage.setItem('notiAccording', JSON.stringify(dataobj[0]))
                  localStorage.setItem('pageHeader', res.data.data.contentName)
                  this.props.history.push({
                    pathname: "/layout/Knowledgechild/"+res.data.data.contentId,
                    state: {
                      contentId: res.data.data.contentId,
                      contentList: res.data.data.contentList,
                      contentName: res.data.data.contentName,
                      hasChild: true,
                      isLiked: false,
                      totalComments: res.data.data.totalComments,
                      totalLikes: res.data.data.totalLikes,
                      totalViews: res.data.data.totalViews
                    },
                  });
                }
              }
              //OffileDb.setData('KnowledgeableSectionDetail-' + id, res.data.data)
            }
          }
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'Layout',
            method: 'getKnowledgeablSectionApiData',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }


  redirectToKnowYouRyt(notification) {
    let additionalInfo = notification.additionalInfo
    if(additionalInfo && ((typeof additionalInfo) == "string")){
      let additionalInfoParsed = JSON.parse(additionalInfo);
      additionalInfo = additionalInfoParsed;
    };
    const { templateID } = this.props;
    let path = additionalInfo.path;
    console.log(path)
    var that = this
    if (additionalInfo.contentId == 28) {
      this.props.history.push({
        pathname: "/layout/knowyourrights",
        state: {
          id: 28
        }
      });
    } else if (additionalInfo.contentId == 97) {
      this.props.setSelectedComponentObject({ id: 97 });
      this.props.history.push({
        pathname: "/layout/kyrchild",
        state: {
          id: 97
        }
      });
    } else if (additionalInfo.parentId == 97) {
      that.loadKnowYourApiData(additionalInfo.parentId, additionalInfo.contentId)
      // OffileDb.getData('KnowYourRightsDetail-97').then(function (result) {
      //   if (!result.status && result.status != 404) {
      //     var dataobj = result.data.childs.filter(obj => obj.contentId == additionalInfo.contentId)
      //     if (dataobj.length > 0 && templateID == 2) {
      //       that.props.history.push({
      //         pathname: "/layout/getknowyourrightsdetail",
      //         state: dataobj[0],
      //       });
      //     } else if (dataobj.length > 0 && templateID == 1){
      //       sessionStorage.setItem('notiAccording', JSON.stringify(dataobj[0]))
      //       that.props.setSelectedComponentObject({ id: 97 });
      //       that.props.history.push({
      //         pathname: "/layout/kyrchild",
      //         state: {
      //           id: 97
      //         }
      //       });
      //     }
      //   } else {
      //     that.loadKnowYourApiData(additionalInfo.parentId, additionalInfo.contentId)
      //   }
      // });
    } else{
      var that = this
      var parentid = path[0]
      var contentid = path[1]
      sessionStorage.setItem('notiAccording', JSON.stringify(path.map(boj=> parseInt(boj))))
      that.loadKnowYourApiData(parentid,contentid)
      // OffileDb.getData('KnowYourRightsDetail-'+parentid).then(function (result) {
      //   console.log(result)
      //   if (!result.status && result.status != 404) {
      //     var dataobj = result.data.childs.filter(obj => obj.contentId == contentid)
      //     if (dataobj.length > 0 && templateID == 2) {
      //       localStorage.setItem('pageHeader', dataobj[0].contentName)
      //       that.props.history.push({
      //         pathname: "/layout/getknowyourrightsdetail",
      //         state: dataobj[0],
      //       });
      //     } else if(dataobj.length > 0 && parentid == 28 && templateID == 1) {
      //       sessionStorage.setItem('notiAccording', JSON.stringify(dataobj[0]))
      //       that.props.history.push({
      //         pathname: "/layout/knowyourrights",
      //         state: {
      //           id: 28
      //         }
      //       });
      //     }
      //   } else {
      //     that.loadKnowYourApiData(parentid,contentid)
      //   }
      // })
    }
  }

  loadKnowYourApiData(contentid, childId) {
    console.log(contentid)
    const { templateID } = this.props;
    if (navigator.onLine) {
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        contentId: contentid,
        languageId: parseInt(localStorage.getItem("langId")),
        roleId: JSON.parse(localStorage.getItem("obj")).roleId,
        userId: JSON.parse(localStorage.getItem("obj")).userId,
      };
      ApiServices.getRoleWiseContent(params).then((res) => {
        try{
          if (res.data.status == 200) {
            if (res.data.data.childs) {
              OffileDb.setData('KnowYourRightsDetail-'+contentid, res.data.data)
              var dataobj = res.data.data.childs.filter(obj=> obj.contentId == childId)
              if(dataobj.length > 0 && templateID == 2) {
                localStorage.setItem('pageHeader', dataobj[0].contentName)
                this.props.history.push({
                  pathname: "/layout/getknowyourrightsdetail",
                  state: dataobj[0],
                });
              } else if (dataobj.length > 0 && templateID == 1){
                sessionStorage.setItem('notiAccording', JSON.stringify(dataobj[0]))
                this.props.setSelectedComponentObject({ id: 97 });
                this.props.history.push({
                  pathname: "/layout/kyrchild",
                  state: {
                    id: 97
                  }
                });
              }
            }
          }
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'Layout',
            method: 'loadKnowYourApiData',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }

  setActiveTab(obj) {
    console.log('activeTanchech:', obj)
    if (obj.page.includes('services')) {
      sessionStorage.setItem('activeTab', JSON.stringify({ 'service': 1 }))
    } else if (obj.page.includes('peerchat') || obj.page.includes('chatwindow')) {
      if (obj.chatType == 'peer') {
        sessionStorage.setItem('activeTab', JSON.stringify({ 'chat': 1 }))
      }
    }
  }


  getcomponetColor(linkpath , notification) {
    var that = this;
    let additionalInfo = notification.additionalInfo;
   
    if(notification && notification.additionalInfo && ((typeof notification.additionalInfo) == "string")){
      let additionalInfoParsed = JSON.parse(notification.additionalInfo);
      additionalInfo = additionalInfoParsed;
    };
    var menulist = JSON.parse(localStorage.getItem("menuList"));
    if (menulist &&  linkpath != "/layout/information") {
      var obj = menulist.filter(obj => linkpath.includes(obj.path));
      if (obj.length > 0) {
        let bgcolor = obj[0].layout.componentbgcolor
        let id = obj[0].componentId
        let name = obj[0].name
        localStorage.setItem('componentbgcolor', bgcolor)
      }
    }  else if (notification.additionalInfo && notification.page == "/layout/information") {
      if ((additionalInfo.root == "28" || additionalInfo.contentId == 28) && !window.location.hash.includes('knowyabdbdourrights')) {
        console.log("layur knowyourrights")
        localStorage.setItem('componentbgcolor', '#d50032')
      } else if ((additionalInfo.root == "51" || additionalInfo.contentId == 51) && !window.location.hash.includes('getknowledgeable')) {
        console.log("layur getknowledgeable")
        localStorage.setItem('componentbgcolor', '#2366a7')
      } else {
        console.log("layur information")
      }
    }
  }

  handleOnAction (event) {
    // console.log('user did something', event)
  }

  handleOnActive (event) {
    // console.log('user is active', event)
    // console.log('time remaining', this.idleTimer.getRemainingTime())
  }

  handleOnIdle (event) {
    // console.log('user is idle', event)
    // console.log('last active', this.idleTimer.getLastActiveTime())
    let patientobj = localStorage.getItem('patientobj')
    if(patientobj) {
      localStorage.removeItem('patientobj')
      this.props.history.push("/layout");
    }
  }

  render() {
    const { templateID } = this.props;
    var chatwindflg = templateID ==  1 && (window.location.hash == "#/layout/chatwindow" || window.location.hash == "#/layout/switch-to-peer" ) ? false : true;
    return (
      <>
        {
          window.location.hash === '#/layout' || window.location.hash === '#/layout/' ?
            <Switch><Route path="/" component={Home} /></Switch> :
            <>
              <div className="fullpage">
               {chatwindflg && <Header />} 
                <Grid container spacing={0} className="gridcontainer">
                  <Grid item xs={12}>
                    <Switch>
                      {this.state.aMenuRoutes}
                    </Switch>
                  </Grid>
                </Grid>
                {chatwindflg && <Bottomnav />} 
              </div>
            </>
        }
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          timeout={1000 * 60 * 5}
          onActive={this.handleOnActive}
          onIdle={this.handleOnIdle}
          onAction={this.handleOnAction}
          debounce={250}
        />
        				<ActionAlerts />

      </>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    notiObj: storeState.notiObj
  };
};

const MyLayout = withRouter(Layout);

export default connect(mapStateToProps, {
  setSelectedComponentObject,
  resetSelectedCompnentObject,
  setBottomNavComponentObject,
  partialSetSelectedComponentObject,
  setcomponentbgcolor
})(MyLayout);
