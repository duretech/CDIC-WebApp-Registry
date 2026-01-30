import React, { Component } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { withTranslation, Trans } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  withStyles,
  makeStyles,
  useTheme,
  withTheme,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Swal from 'sweetalert2'
import Slider from "@material-ui/core/Slider";
import imgUrl from "../../assets/images/imageUrl";
import BusinessIcon from "@material-ui/icons/Business";
import RoomIcon from "@material-ui/icons/Room";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PeopleIcon from "@material-ui/icons/People";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import SendIcon from "@material-ui/icons/Send";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LinkIcon from "@material-ui/icons/Link";
import CancelIcon from '@material-ui/icons/Cancel';
import AttachmentIcon from '@material-ui/icons/Attachment';
import TextField from "@material-ui/core/TextField";

import IconButton from "@material-ui/core/IconButton";
import { setPeerToPeerChatRoom } from "../../api/helper";
import { auth } from "../../service/firebase";
import { db, storageRef, firebaseConfig } from "../../service/firebase";

import { setChatType, setcomponentbgcolor } from "../../redux/actions/appActions";
import Services from "../../api/api";
import { FlashOnRounded } from "@material-ui/icons";
import swal from "sweetalert";
import parse from 'html-react-parser';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Link, Redirect, useHistory } from "react-router-dom";

import HomeIcon from "@material-ui/icons/Home";
import * as _ from "lodash";
import moment from 'moment';
import { logError } from "../../helpers/auth";
import OfflineDb from '../../../db'

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

class ChatWindow extends Component {
  constructor(props) {
    super();
    this.state = {
      value: 0,
      applicantObj: {},
      user: auth().currentUser,
      chats: [],
      content: "",
      readError: null,
      writeError: null,
      loadingChats: false,
      authenticated: false,
      topic: '',
      progress: 0,
      isButtonDisabled: false,
      provname:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteChat = this.deleteChat.bind(this);
    this.switchToPeerChat = this.switchToPeerChat.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleImageAsFile = this.handleImageAsFile.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleImgModalOpen = this.handleImgModalOpen.bind(this);
    this.myRef = React.createRef();
    this.sendGroupAlert = this.sendGroupAlert.bind(this);
    this.sendPeerAlert = this.sendPeerAlert.bind(this);
    this.resetChatCounter = this.resetChatCounter.bind(this);
    this.getAndUpdateTheCounter = this.getAndUpdateTheCounter.bind(this);
  }

  // static getDeriveStateFromProps(props){
  //   let userObj = auth().currentUser;
  //   return {user: userObj}
  // }

  async componentDidMount() {
    try {
      console.log("componentDidMount chatwindow>>>", this.props, this.state.user, this);
      if (this.props.location.state && this.props.location.state.applicant) {
        // this.setChatArea(this.props.fbuserObj.uid, this.props.location.state.id);
        // console.log("setchatarea::", userObj.uid, this.props.location.state.applicant.id);
        if(this.props.location.state.chatType=='provider'){
          this.setChatArea(this.props.location.state.userObj.id, this.props.location.state.applicant);
        }
        else{
          this.setChatArea(this.props.location.state.userObj.uid, this.props.location.state.applicant.id);
        }
        this.resetChatCounter(this.props.location.state)
      } else {
        //this.props.history.goBack();
        this.props.history.push("/layout/peerchat");
        console.error('this.props.location.state>', this.props.location.state);
      }
      this.initKeyboard();
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'ChatWindow',
        method: 'componentDidMount',
        error: err
      }
      logError(errorObj);
    }

    OfflineDb.getDataFromPouchDB('loginDetails').then(userres=>{
      console.log(userres)
      this.setState({provname:userres.data.userCredentials.user.displayName})
    })
  }

  componentWillUnmount() {
    // this.setState({
    //   chats: []
    // })
    // this.props.setChatType('group');
  }

  resetChatCounter(Data) {
    try {
      var communityid = localStorage.getItem("CommunityId")
      if (Data.chatType == "peer") {

        var counterParams = {
          communityId: communityid,
          msgSenderUserId: Data.applicant.id,
          msgRecieverUserId: JSON.parse(localStorage.getItem("obj")).userId,
          noOfMsgsSend: 0,
          type: 'peer'
        }
        console.log("counterParams", counterParams)
        Services.addChatHistoryUsingUserId(counterParams);

      }
      else {

        var counterParams = {
          communityId: communityid,
          msgRecieverUserId: JSON.parse(localStorage.getItem("obj")).userId,
          type: 'group',
          groupId: Data.applicant.id
        }
        console.log("group chat rest counter::", counterParams);
        Services.updateChatHistoryOnGroupUsingUserId(counterParams);

      }
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'ChatWindow',
        method: 'resetChatCounter',
        error: err
      }
      logError(errorObj);
    }

  }

  async sendGroupAlert(responseData, mtitle, mbody, imgsrc) {
    try {
      var userId = JSON.parse(localStorage.getItem('obj')).userId;
      let { communityuid, chatConfig, location } = { ...this.props };
      let alertroom = `${communityuid}/mobilealert/`;
      var array = [];
      for (const item in responseData) {
        if (array.indexOf(responseData[item].userid) === -1) {

          if (responseData[item].userid != userId) {
            array.push(responseData[item].userid);

            let data = {
              title: mtitle,
              body: mbody,
              page: "/layout/chatwindow",
              timestamp: Date.now(),
              userid: JSON.parse(localStorage.getItem("obj")).userId,
              systemuid: '',
              read: 0,
              applicant: { id: location.state.applicant.id, imgsrc: imgsrc },
              chatType: 'group'
            };
            var newPostKey = db.ref().child(alertroom).push().key;
            data.msgid = newPostKey;

            var updates = {};
            updates[alertroom + responseData[item].userid + '/' + newPostKey] = data;


            await db.ref().update(updates);
          }

        }
      }
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'ChatWindow',
        method: 'sendGroupAlert',
        error: err
      }
      logError(errorObj);

    }
  }

  async sendPeerAlert(notiParmas) {
    try {
      var userId = JSON.parse(localStorage.getItem('obj')).userId;
      let { communityuid, chatConfig, location } = { ...this.props };
      let alertroom = `${communityuid}/mobilealert/`;

      let data = {
        title: notiParmas.title,
        body: notiParmas.message,
        page: "/layout/chatwindow",
        timestamp: Date.now(),
        userid: userId,
        systemuid: '',
        read: 0,
        applicant: { id: location.state.applicant.id },
        chatType: 'peer',
        senderObj: { id: JSON.parse(localStorage.getItem("obj")).userId, imgsrc: location.state.userObj.photoURL, fcmId: localStorage.getItem('fcmToken') },
      };
      var newPostKey = db.ref().child(alertroom).push().key;
      data.msgid = newPostKey;

      var updates = {};
      updates[alertroom + location.state.applicant.id + '/' + newPostKey] = data;

      await db.ref().update(updates);

      // set parameters and then send notification: peer to peer
      var pushNotiParmas = {
        to: location.state.applicant.fcmId,
        title: location.state.userObj.displayName ? location.state.userObj.displayName : JSON.parse(localStorage.getItem("obj")).userId,
        message: notiParmas.message,
        page: '/layout/chatwindow',
        applicant: { id: location.state.applicant.id },
        senderObj: { id: JSON.parse(localStorage.getItem("obj")).userId, imgsrc: location.state.userObj.photoURL, fcmId: localStorage.getItem('fcmToken') },
        msgid: data.msgid,
        chatType: 'peer'
      }
      console.log("pushNotiParmas", pushNotiParmas);
      Services.sendPushNotification(pushNotiParmas);
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'ChatWindow',
        method: 'sendPeerAlert',
        error: err
      }
      logError(errorObj);

    }


  }

  async getAndUpdateTheCounter(adminchatroom, userId) {
    let messagescountdata = {
      adminunread: 1,
      userunread: 0
    }
    var fbparams = {
      url: firebaseConfig.databaseURL + '/' + adminchatroom + '/' + 'admin' + '/messagescount/' + userId + ".json",
    }
    Services.getDataFromUrl(fbparams).then((response) => {
      try {
        if (response.status && response.status == 200) {
          console.log("getAndUpdateTheCounter fb data::", response.data);
          if (response && response.data && response.data.adminunread) {
            messagescountdata.adminunread = response.data.adminunread + 1
          }
          db.ref(adminchatroom + '/' + 'admin' + '/messagescount/' + userId + '/').set(messagescountdata);
        } else {
          console.log('err')
          db.ref(adminchatroom + '/' + 'admin' + '/messagescount/' + userId + '/').set(messagescountdata);
        }
      } catch (err) {
        console.log(err)
        var errorObj = {
          component: 'ChatWindow',
          method: 'getAndUpdateTheCounter',
          error: err
        }
        logError(errorObj);
      }
    })

  }

  initKeyboard() {
    var self = this;
    if (window.cordova) {
      document.addEventListener('deviceready', function () {
        window.addEventListener('keyboardDidShow', function () {
          console.log("keyboard shown");
          self.scrollToBottom('chatBox');
        });
      })
    }
  }

  // scrollToBottom(id) {
  //   setTimeout(function () {
  //     try {
  //       var element = document.getElementById('chatBox');
  //       console.log("element.scrollHeight - element.clientHeight", element.scrollHeight, element.clientHeight);
  //       element.scrollTop = element.scrollHeight - element.clientHeight;
  //     } catch (err) {
  //       console.log("err::", err);
  //     }
  //   }, 500);
  // }

  setChatRoom(senderId, receiptId) {
    try {
      let {  chatConfig, location } = { ...this.props };
      let communityuid =localStorage.getItem("CommunityId")
      let chatroom = `${communityuid}`;
      if (location.state.chatType == "peer") {
        return (chatroom = `${chatroom}/${location.state.chatType
          }/${setPeerToPeerChatRoom(senderId, receiptId)}`);
      } else if (location.state.chatType == "admin") {
        return (chatroom = `${chatroom}/${location.state.chatType
          }/${'messages/' + senderId}`);
      } 
      else if (location.state.chatType == "provider") {
        return (chatroom = `${chatroom}/${location.state.chatType
          }/${'messages/' + senderId}`);
      } else {
        this.setState({ topic: `${chatroom}-${location.state.chatType}-${receiptId}` },
          () => {
            if (window.cordova) {
              // if(window.FCMPlugin){
              //   window.FCMPlugin.subscribeToTopic(this.state.topic);
              // }else if(window.cordova.plugins.firebase && window.cordova.plugins.firebase.messaging){
              //   window.cordova.plugins.firebase.messaging.subscribe(this.state.topic);
              // }else 
              if (window.FirebasePlugin) {
                window.FirebasePlugin.subscribe(this.state.topic, function () {
                  console.log("Subscribed to topic");
                }, function (error) {
                  console.error("Error subscribing to topic: " + error);
                });
              }
            }
          });

        return (chatroom = `${chatroom}/${location.state.chatType}/${receiptId}`);
      }
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'ChatWindow',
        method: 'setChatRoom',
        error: err
      }
      logError(errorObj);

    }
  }

  setChatArea(senderId, receiptId) {
    let {  location } = { ...this.props };
    let communityuid = localStorage.getItem("CommunityId")
    this.setState({ readError: null, loadingChats: true });
    const chatArea = this.myRef.current;
    try {
      var sender = JSON.parse(localStorage.getItem("obj")).userId
      console.log(receiptId, senderId);
      let chatroom = this.setChatRoom(sender, receiptId);


      db.ref(chatroom).on("value", (snapshot) => {
        let chats = [];
        snapshot.forEach((snap) => {
          var chatNode = {};
          chatNode = snap.val();
          chatNode.key = snap.key;
          chats.push(chatNode);
        });
        chats.sort(function (a, b) {
          return a.timestamp - b.timestamp;
        });
        this.setState({
          chats,
          user: location.state.userObj,
        });
        setTimeout(function () {
          chatArea.scrollBy(0, chatArea.scrollHeight);
        }, 200);
        this.setState({ loadingChats: false });
      });
      // bell icon chat count reset
      let alertroom = `${communityuid}/mobilealert/${sender}/`;
      setTimeout(function () {
        try {
          console.log("location.state", location.state.chatType)
          db.ref(alertroom).once("value", (snapshot) => {
            snapshot.forEach((snap) => {
              let tempObj = snap.val();
              console.log("snap::", tempObj);
              if (tempObj.read == 0) {
                if (tempObj && tempObj.chatType == "peer") {
                  if (tempObj.userid == location.state.applicant.id) {
                    tempObj.read = 1;
                    db.ref(alertroom + tempObj.msgid).update(tempObj);
                  }
                } else if (tempObj && tempObj.chatType == "admin") {
                  tempObj.read = 1;
                  db.ref(alertroom + tempObj.msgid).update(tempObj);
                } else if (tempObj && tempObj.chatType == "group") {
                  if (tempObj.applicant.id == location.state.applicant.id) {
                    tempObj.read = 1;
                    db.ref(alertroom + tempObj.msgid).update(tempObj);
                  }
                }
              }
            });
          })
        } catch (err) {
          console.log("err::", err);
          var errorObj = {
            component: 'ChatWindow',
            method: 'setChatArea',
            error: err
          }
          logError(errorObj);
        }
      }, 500)
    } catch (error) {
      console.error(error);
      var errorObj = {
        component: 'ChatWindow',
        method: 'setChatArea',
        error: error
      }
      logError(errorObj);
      this.setState({ readError: error.message, loadingChats: false });
    }
  }

  async handleTextAreaChange(event) {
    this.setState({
      content: event.target.value,
    });
  }

  async deleteChat(params) {
    try {
      const { t } = this.props;
      swal({
        text: t("Are you sure want to delete this chat?"),
        icon: "warning",
        dangerMode: true,
        buttons: [t("Cancel"), t("Ok")]
      })
        .then((willDelete) => {
          if (willDelete) {
            let myKey = params;
            let chatroom = this.setChatRoom(JSON.parse(localStorage.getItem("obj")).userId, this.props.location.state.applicant.id);
            // remove item from database
            let my_db_ref = db.ref(chatroom + '/' + myKey);
            my_db_ref.once('value', function (snapshot) {
              let myChatObj = {};
              myChatObj = snapshot.val();
              myChatObj.key = snapshot.key;
              myChatObj.archieve = true;
              console.log("myChatObj::", myChatObj);
              my_db_ref.set(myChatObj);
            });
          }
        });
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'ChatWindow',
        method: 'deleteChat',
        error: err
      }
      logError(errorObj);
    }
  }
  async switchToPeerChat(peerUserId, nickname, avatarurl, fcmid) {
    var applicantObj = {
      // avtaar: null,
      // communityId: "d4904bc7a56e0dfc285d8fd19b31d062",
      // countOfMsgs: 0,
      // deviceSerialNumber: "58a5f0d3-7daa-4607-8b37-844ab295bdc7",
      // fcmId: null,
      id: peerUserId,
      isactive: true,
      nickName: nickname,
      roleId: JSON.parse(localStorage.getItem("obj")).roleId,
      roleType: JSON.parse(localStorage.getItem("obj")).roleType,
      title: peerUserId,
      userName: null,
      avtaar: avatarurl,
      fcmId: fcmid
    }
    // auth().signOut();
    // this.setState({open: true})
    // this.setState({isLoading: true})

    this.setState({ applicantObj, }, () => {

      if (auth().currentUser == null) {
        this.setState({ open: true });
      } else {
        this.setState({ isLoading: true });
        this.gotoChat(auth().currentUser);
      }
    }
    );
  }

  gotoChat(user) {
    ///layout/peerchat/chatwindow
    console.log("gotoChat>>", this.state.applicantObj);
    this.props.history.push({
      pathname: "/layout/switch-to-peer",
      state: {
        applicant: this.state.applicantObj,
        userObj: user,
        chatType: 'peer',
      },
    });
  }

  async handleSubmit(event) {
    console.log("chat handleSubmit clicked");

    if (this.state.isButtonDisabled) {
      return;
    }

    if (this.state.content) {
      this.setState({ isButtonDisabled: true });
      let { userObj, location, fbuserObj } = { ...this.props };
      let communityuid = localStorage.getItem("CommunityId")
      var imgsrc = location.state.applicant.avtaar ? location.state.applicant.avtaar : location.state.applicant.urlOfIcon
      let chatType = location.state.chatType;
      let adminUnreadCount = 0;
      console.log("chatType", chatType);
      if (chatType == 'admin') {
        adminUnreadCount = 1;
      }
      console.log("adminUnreadCount", adminUnreadCount)
      event.preventDefault();
      this.setState({ writeError: null });
      const chatArea = this.myRef.current;
      try {
        let userId = JSON.parse(localStorage.getItem("obj")).userId;
        let chatroom;
        if(this.props.location.state.chatType=='provider'){

          chatroom= this.setChatRoom(userId, location.state.applicant);
        }
        else{
          chatroom = this.setChatRoom(userId, location.state.applicant.id);

        }
        let data = {
          content: this.state.content,
          timestamp: Date.now(),
          userid: userId,
          fbuid: location.state.userObj.uid,
          systemuid: '',
          name: location.state.userObj.displayName,
          avatarurl: location.state.userObj.photoURL,
          adminunread: adminUnreadCount,
          fcmid: localStorage.getItem('fcmToken')
        };
        await db.ref(chatroom).push(data);

        this.setState({ content: "", isButtonDisabled: false });
        chatArea.scrollBy(0, chatArea.scrollHeight);

        if (chatType == 'admin') {
          let adminAlertData = {
            content: this.state.content,
            timestamp: Date.now(),
            userid: userId,
            name: location.state.userObj.displayName
          }
          let adminchatroom = `${communityuid}`;
          this.getAndUpdateTheCounter(adminchatroom, userId);
          await db.ref(adminchatroom + '/' + chatType + '/adminalert').push(adminAlertData);
        } else if (location.state.chatType == 'peer') {
          // set parameters and then send notification: peer to peer
          var notiParmas = {
            to: location.state.applicant.fcmId,
            title: location.state.userObj.displayName ? location.state.userObj.displayName : JSON.parse(localStorage.getItem("obj")).userId,
            message: data.content,
            page: '/layout/chatwindow',
            applicant: { id: location.state.applicant.id },
            senderObj: { id: JSON.parse(localStorage.getItem("obj")).userId, imgsrc: location.state.userObj.photoURL, fcmId: localStorage.getItem('fcmToken') },
            chatType: 'peer'
          }
          console.log("notiParmas", notiParmas);
          // Services.sendPushNotification(notiParmas);

          // send alert count to other member in peer

          this.sendPeerAlert(notiParmas);

          // increament chat counter for the msgRecieverUserId
          var counterParams = {
            communityId: localStorage.getItem("CommunityId"),
            msgRecieverUserId: location.state.applicant.id,
            msgSenderUserId: JSON.parse(localStorage.getItem("obj")).userId,
            noOfMsgsSend: 1,
            type: 'peer',
          }
          console.log("counterParams", counterParams)
          Services.addChatHistoryUsingUserId(counterParams);

        } else if (location.state.chatType == 'provider') {
          // set parameters and then send notification: peer to peer
          var notiParmas = {
            to: location.state.applicant.fcmId,
            title: location.state.userObj.displayName ? location.state.userObj.displayName : JSON.parse(localStorage.getItem("obj")).userId,
            message: data.content,
            page: '/layout/chatwindow',
            applicant: { id: location.state.applicant },
            senderObj: { id: JSON.parse(localStorage.getItem("obj")).userId, imgsrc: location.state.userObj.photoURL, fcmId: localStorage.getItem('fcmToken') },
            chatType: 'peer'
          }
          console.log("notiParmas", notiParmas);
          // Services.sendPushNotification(notiParmas);

          // send alert count to other member in peer

          this.sendPeerAlert(notiParmas);

          // increament chat counter for the msgRecieverUserId
          var counterParams = {
            communityId: localStorage.getItem("CommunityId"),
            msgRecieverUserId: location.state.applicant,
            msgSenderUserId: JSON.parse(localStorage.getItem("obj")).userId,
            noOfMsgsSend: 1,
            type: 'peer',
          }
          console.log("counterParams", counterParams)
          Services.addChatHistoryUsingUserId(counterParams);

        }else {
          // set paramenter and then send notification in group-chat
          let usersroom = `${localStorage.getItem("CommunityId")}/users/`;
          var fcmList = [];
          db.ref(usersroom).once("value", (userListSnap) => {
            console.log("userListSnap", userListSnap.val())
            this.sendGroupAlert(userListSnap.val(), location.state.applicant.groupName, data.content, imgsrc);
            userListSnap.forEach((item) => {
              let myItem = item.val();
              if (myItem.userid != userId) {
                fcmList.push(myItem.fcmid);
              }
            });
            var notiParmas = {
              to: '',
              multipleids: fcmList,
              title: location.state.applicant.groupName,
              message: data.content,
              page: '/layout/chatwindow',
              applicant: { id: location.state.applicant.id, imgsrc: imgsrc },
              chatType: 'group'
            }

            console.log(notiParmas)
            console.log("notiParmas::", notiParmas)
            Services.sendPushNotification(notiParmas);
          })

          // send alert count to other member in group
          // var fbparams = {
          //   url: firebaseConfig.databaseURL + '/' + localStorage.getItem("CommunityId") + "/group/" + location.state.applicant.id + ".json",
          // }
          // Services.getDataFromUrl(fbparams).then((response) => {
          //   try{
          //     if (response.status && response.status == 200) {
          //       console.log("fb data::", response.data);

          //       this.sendGroupAlert(response.data, location.state.applicant.groupName, data.content, imgsrc);

          //     } else {
          //       console.log('err')
          //     }
          //   }catch(err){
          //     console.log(err)
          //     var errorObj = {
          //       component: 'ChatWindow',
          //       method: 'handleSubmit',
          //       error: err
          //     }
          //     logError(errorObj);
          //   }
          // })


          // increament group chat counter for the msgRecieverUserId
          var counterParams = {
            communityId: localStorage.getItem("CommunityId"),
            groupId: location.state.applicant.id, //group id
            msgSenderUserId: JSON.parse(localStorage.getItem("obj")).userId,
            noOfMsgsSend: 1,
            type: "group",
            moderatorApprovedUsers: location.state.applicant.isModeratorRequired
          }
          console.log("addChatHistoryOnGroupUsingUserId counterParams", counterParams)
          Services.addChatHistoryOnGroupUsingUserId(counterParams);
        }

      } catch (error) {
        console.error(error);
        var errorObj = {
          component: 'ChatWindow',
          method: 'handleSubmit',
          error: error
        }
        logError(errorObj);
        this.setState({ writeError: error.message });
      }
    }
  }

  handleLogout() {
    this.setState(
      {
        authenticated: false,
      },
      () => {
        auth().signOut();
      }
    );
  }

  handleChange = (event, newValue) => {
    try {
      if (newValue) {
        this.setState({
          value: newValue,
        });
      }
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'ChatWindow',
        method: 'handleChange',
        error: err
      }
      logError(errorObj);
    }
  };

  handleChangeIndex = (index) => {
    this.setState({
      value: index,
    });
  };

  handleImageAsFile(e) {
    var that = this;
    try {
      if (e.target.files[0]) {
        const image = e.target.files[0];
        console.log(image)
        const uploadTask = storageRef.ref(`/images/${image.name}`).put(image)
        //initiates the firebase side uploading 
        uploadTask.on('state_changed', (snapShot) => {
          //takes a snap shot of the process as it is happening

          const progress = Math.round((snapShot.bytesTransferred / snapShot.totalBytes) * 100);
          this.setState({ progress });
        }, (err) => {
          //catches the errors
          console.log(err)
        }, () => {
          // gets the functions from storage refences the image storage in firebase by the children
          // gets the download url then sets the image from firebase as the value for the imgUrl key:
          storageRef.ref('images').child(image.name).getDownloadURL().then(fireBaseUrl => {
            console.log(fireBaseUrl)
            this.setState({ progress: 0 });
            that.handleImageUpload(fireBaseUrl)
            //setImageAsUrl(prevObject => ({...prevObject, imgUrl: fireBaseUrl}))
          })
        })
      }
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'ChatWindow',
        method: 'handleImageAsFile',
        error: err
      }
      logError(errorObj);
    }
  }

  async handleImageUpload(fireBaseUrl) {
    try {
      let { userObj, location, fbuserObj } = { ...this.props };
      this.setState({ writeError: null });
      const chatArea = this.myRef.current;
      let messageContent = '';
      let userId = JSON.parse(localStorage.getItem("obj")).userId;
      let chatroom = this.setChatRoom(JSON.parse(localStorage.getItem("obj")).userId, location.state.applicant.id);
      let data = {
        content: fireBaseUrl,
        type: "image",
        timestamp: Date.now(),
        userid: userId,
        fbuid: location.state.userObj.uid,
        systemuid: '',
        name: location.state.userObj.displayName,
        avatarurl: location.state.userObj.photoURL,
      };


      await db.ref(chatroom).push(data);
      this.setState({ content: "" });
      chatArea.scrollBy(0, chatArea.scrollHeight);
      if (data.type == 'image') {
        messageContent = 'Sent Image';
      } else {
        messageContent = data.content;
      }
      if (location.state.chatType == 'peer') {
        // set parameters and then send notification: peer to peer
        var notiParmas = {
          to: location.state.applicant.fcmId,
          title: location.state.userObj.displayName ? location.state.userObj.displayName : JSON.parse(localStorage.getItem("obj")).userId,
          message: "Sent an image",
          page: '/layout/chatwindow',
          applicant: { id: location.state.applicant.id },
          senderObj: { id: JSON.parse(localStorage.getItem("obj")).userId, fcmId: localStorage.getItem('fcmToken') },
          chatType: 'peer'
        }
        Services.sendPushNotification(notiParmas);

        // increament chat counter for the msgRecieverUserId
        var counterParams = {
          communityId: localStorage.getItem("CommunityId"),
          msgRecieverUserId: location.state.applicant.id,
          msgSenderUserId: JSON.parse(localStorage.getItem("obj")).userId,
          noOfMsgsSend: 1,
          type: 'peer',
        }
        console.log("counterParams", counterParams)
        Services.addChatHistoryUsingUserId(counterParams);
      } else {
        // set paramenter and then send notification in group-chat
        var notiParmas = {
          to: "/topics/" + this.state.topic,
          title: location.state.applicant.groupName,
          message: "Sent an image",
          page: '/layout/chatwindow',
          applicant: { id: location.state.applicant.id },
          chatType: 'group'
        }

        console.log(notiParmas)
        Services.sendPushNotification(notiParmas);

        // increament group chat counter for the msgRecieverUserId
        var counterParams = {
          communityId: localStorage.getItem("CommunityId"),
          groupId: location.state.applicant.id, //group id
          msgSenderUserId: JSON.parse(localStorage.getItem("obj")).userId,
          noOfMsgsSend: 1,
          type: "group",
          moderatorApprovedUsers: location.state.applicant.isModeratorRequired
        }
        console.log("addChatHistoryOnGroupUsingUserId counterParams", counterParams)
        Services.addChatHistoryOnGroupUsingUserId(counterParams);
      }

    } catch (error) {
      console.error(error);
      var errorObj = {
        component: 'ChatWindow',
        method: 'handleImageUpload',
        error: error
      }
      logError(errorObj);
      this.setState({ writeError: error.message });
    }
  }


  linkify(inputText) {
    try {
      var replacedText, replacePattern1, replacePattern2, replacePattern3;

      //URLs starting with http://, https://, or ftp://
      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

      //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

      //Change email addresses to mailto:: links.
      replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
      replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

      return replacedText;
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'ChatWindow',
        method: 'linkify',
        error: err
      }
      logError(errorObj);
    }
  }

  handleImgModalOpen(chat) {
    const { t } = this.props;
    if (chat.type && chat.type == "image") {
      // swal({
      //   title: "",
      //   text: "",
      //   icon: chat.content,
      //   showCloseButton: true,
      //   button: t("CLOSE"),
      // }).then(function() {
      //     swal.close();
      // });
      Swal.fire({
        title: '',
        text: '',
        imageUrl: chat.content,
        imageWidth: 200,
        imageHeight: 400,
        imageAlt: '',
        showCloseButton: true,
        showConfirmButton: false,
      })
    }
  }

  handleClickBack() {
    this.props.history.goBack();
  }

  handleClickHome() {
    localStorage.setItem('componentbgcolor', "#009596")
    this.props.setcomponentbgcolor("#009596")
    this.props.history.push("/layout/imonhome");
    // localStorage.setItem('BotInnit', "true");
  }

  formatTime(timestamp, type) {
    // const d = new Date(timestamp);
    // var time = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    if (type == 'time') {
      //time = `${d.getHours()}:${d.getMinutes()}`;
      var time = moment(timestamp).format('LT');
    } else if (type == 'day') {
      //time = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} `;
      var time = moment(timestamp).format('LL');
    }
    return time;
  }

  getDateDiff() {
    let groupedResults = _.groupBy(this.state.chats, (result) => moment(new Date(result['timestamp']), 'DD/MM/YYYY').startOf('day'));
    return groupedResults
  }

  render() {
    const { t } = this.props;
    const { classes, theme, chatConfig, location } = this.props;
    const roleId = JSON.parse(localStorage.getItem("obj")).roleId;
    const roleType = JSON.parse(localStorage.getItem("obj")).roleType;
    const sentuserId = JSON.parse(localStorage.getItem("obj")).userId;
    var compcolor = localStorage.getItem('componentbgcolor')
    const templateID = 1;
    let bgStyles = templateID == 2 ? { background: compcolor } : {};

    if (location.state == undefined) {
      return <div>data not found</div>
    }

    var userUid = null;
    if (localStorage.getItem('obj')) {
      userUid = JSON.parse(localStorage.getItem('obj')).userId
    } else {
      userUid = this.state.user.uid
    }
    var tabtilte = location.state.chatType == "provider" ? this.state.provname : (this.props.location.state.applicant.nickName != null ? this.props.location.state.applicant.nickName : this.props.location.state.applicant.title);
    var username = location.state.userObj.displayName ? location.state.userObj.displayName : sentuserId
    var imgsrc = this.props && this.props.location && this.props.location.state && this.props.location.state.applicant && this.props.location.state.applicant.avtaar ? this.props.location.state.applicant.avtaar : this.props.location.state.applicant.urlOfIcon

    var chats = []
    if (this.state.chats.length > 0) {
      chats = this.getDateDiff()
    }
    return (
      <div className={classes.root + " ChatWindow getknowledgeable_page chatwindowpage chatwindowdesktop"}>
        {
          templateID == 1 && (
            <div className="backgroundivholder">
              <div className="bgdiv1">
                <div className="welcometopcurve">
                  <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" class="shape-fill"></path>
                  </svg>
                </div>
              </div>
              <div className="bgdiv2"></div>
            </div>

          )
        }
        <Grid container xs={12} className="homenav">
          <Grid xs={2} className="backimg" onClick={() => this.handleClickBack()}>
            <img src={imgUrl.whiteback} className="backsvg" />
          </Grid>
          <Grid xs={8}>
            <Typography variant="subtitle1" className="regname oneuhcfont">
              Get Connected
            </Typography>
          </Grid>
          <Grid xs={2}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="home"
              className="homeicon-btn menubtn"
              onClick={() => this.handleClickHome()}
            >



              <HomeIcon />
            </IconButton>
          </Grid>
        </Grid>


        <AppBar className="chatheader" position="static" style={bgStyles}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="#fff"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label={t(tabtilte)} {...a11yProps(0)} />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          className="infotabcontainer getaccesstabspage forum-chat-window forum_chat_page"
        >
          <TabPanel className="chatmsglistholdermain" value={this.state.value} index={0} dir={theme.direction}>
            {
              templateID == 1 && (
                <Grid item xs={12}>
                  {/* <Grid container spacing={3} className="gridcontainer border-bottom-grey white_bg border-topleftradius-10px border-toprightradius-10px">
                    <Grid item xs={2} className="text-center hospitaliconholder color-darkblue">
        
                    </Grid>
                    <Grid item xs={10} className="text-left">
                      <p className="forumtitle color-darkblue">{t(tabtilte)}</p>
                    </Grid>
                  </Grid> */}

                  <Grid container spacing={0} className="gridcontainer chatheader_holder px-12px">
                    {/* <Grid item xs={1} className="pt-8px pb-8px vert-center justify-center">
                      <IconButton
                        edge="start"
                        className="menubtn back_arrow_btn"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => this.handleClickBack()}
                      >

                        <ArrowBackIosIcon />
                      </IconButton>

                    </Grid> */}
                    <Grid item xs={12} className="avatarchatgrid pt-8px pb-8px">
                      <div className="avatarchat">
                        <div> <h3 className="text-center zero chatuserimg">
                          {
                            imgsrc != null ? (
                              <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                <image href={imgsrc} width="25" height="25" />
                              </svg>) : (
                              <AccountCircleIcon />
                            )
                          }
                        </h3></div>
                        <div><h3 className="text-center zero chat_username forumtitle">{t(tabtilte)}</h3></div>
                      </div>



                    </Grid>
                    {/* <Grid item xs={1} className="pt-8px pb-8px vert-center justify-center">
                      <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="home"
                        className="homeicon-btn menubtn"
                        onClick={() => this.handleClickHome()}
                      >

                        <HomeIcon />
                      </IconButton>
                    </Grid> */}
                  </Grid>
                  <div className="chatheader_background_div"></div>
                </Grid>
              )
            }

            <div id="frame" className={location.state.chatType == "group" ? 'showgroupaction' : 'peeraction'}>
              <div className="content">
                <div className="messages" id="chatBox" ref={this.myRef}>
                  <ul >
                    {this.state.chats.length == 0 ?
                      <div></div>
                      :
                      Object.keys(chats).map((key) => {
                        return <>
                          <li className="chatDate text-center"> <span>{this.formatTime(key, 'day')}</span></li>
                          {
                            chats[key].map((chat) => {
                              return userUid === chat.userid ? (
                                <li className={`sent ${chat.archieve ? "hide" : ""}`}>
                                  <div className="msg-wrap">
                                    <div className="msg">
                                      {/* <span className="msg-del-btn" onClick={() => this.deleteChat(chat.key)}>{<CancelIcon />}</span> */}
                                      <div onClick={() => this.handleImgModalOpen(chat)}>
                                        <svg className="MuiSvgIcon-root chatavatar" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style={{ float: 'left' }}
                                        >
                                          <image href={chat.avatarurl} width="25" height="25" />
                                        </svg>
                                        <div className="msg-info">{username ? username : chat.userid}</div>
                                        <div className="msg-txt">
                                          {
                                            chat.type && chat.type == "image" ? (
                                              <img className="chatimag" src={chat.content} alt="image tag" />

                                            ) : (
                                              <span>{parse(this.linkify(chat.content))}</span>
                                            )
                                          }
                                        </div>
                                        <div className="chat-time">
                                          {this.formatTime(chat.timestamp, 'time')}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ) : (
                                <li className={`replies ${chat.archieve ? "hide" : ""}`}>
                                  <div className="msg-wrap">
                                    <div className="msg">
                                      {(roleType == 'Admin' || roleType == 'SuperAdmin') ? (<span className="msg-del-btn" onClick={() => this.deleteChat(chat.key)}>{<CancelIcon />}</span>) : ''}
                                      <div onClick={() => this.handleImgModalOpen(chat)}>
                                        <svg className="MuiSvgIcon-root chatavatar" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style={{ float: 'left' }}
                                        >
                                          <image href={chat.avatarurl} width="25" height="25" />
                                        </svg>
                                        <div className="msg-info">{tabtilte == "admin" ? "admin" : (chat.name ? chat.name : chat.userid)}
                                          {location.state.chatType == "group" ?
                                            <span className="fa fa-comments" onClick={() => this.switchToPeerChat(chat.userid, chat.name, chat.avatarurl, chat.fcmid)}></span>
                                            : ''}
                                        </div>
                                        <div className="msg-txt" >
                                          {
                                            chat.type && chat.type == "image" ? (
                                              <img className="chatimag" src={chat.content} alt="image tag" />

                                            ) : (
                                              <span>{parse(this.linkify(chat.content))}</span>
                                            )
                                          }
                                        </div>
                                        <div className="chat-time">
                                          {this.formatTime(chat.timestamp, 'time')}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })
                          }
                        </>
                      })
                      // this.state.chats.map((chat) => {

                      // })
                    }
                  </ul>
                  {
                    this.state.progress > 0 && (
                      <div className="text-center"><progress value={this.state.progress} max="100" className="progress"></progress></div>
                    )
                  }

                </div>
              </div>
            </div>
            <div className="chatbtmmenu">
              {
                templateID == 1 ? (
                  <Grid item xs={12} className="text-center">
                    <Grid container spacing={3} className="gridcontainer border-top-grey white_bg">
                      <Grid item xs={2} className="text-center hospitaliconholder color-darkblue">
                        <Button
                          variant="contained"
                          component="label"
                          className="menubtn  chatgallerybutton"
                        >
                          <AttachmentIcon />
                          <input
                            onChange={this.handleImageAsFile}
                            type="file"
                            hidden
                          />
                        </Button>

                      </Grid>

                      <Grid item xs={8} className="text-left">
                        <p className="zero chatmsgtextboxholder">
                          <TextField
                            id="standard-basic"
                            label=""
                            placeholder={t("Type here")}
                            helperText=""
                            value={this.state.content}
                            onChange={this.handleTextAreaChange}
                            style={{ 'margin-top': '5px' }}
                          />
                        </p>
                      </Grid>

                      <Grid item xs={2} className="text-center hospitaliconholder color-darkblue">
                        <IconButton
                          edge="start"
                          className="menubtn"
                          color="inherit"
                          aria-label="menu"
                          disabled={this.state.isButtonDisabled}
                          onClick={this.handleSubmit}
                        >
                          <SendIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={0} className="gridcontainer">
                    <Grid item xs={8} className="zero">
                      <TextField
                        id="standard-helperText"
                        label=""
                        placeholder={t("Type here")}
                        helperText=""
                        value={this.state.content}
                        onChange={this.handleTextAreaChange}
                        style={{ 'margin-left': '10px' }}
                      />
                    </Grid>
                    <Grid item xs={2} className="zero text-center">
                      <Button
                        variant="contained"
                        component="label"
                        className="menubtn  chatgallerybutton"
                      >
                        <CameraAltIcon />
                        <input
                          onChange={this.handleImageAsFile}
                          type="file"
                          hidden
                        />
                      </Button>
                    </Grid>
                    <Grid item xs={2} className="zero text-center">
                      <IconButton
                        edge="start"
                        className="menubtn"
                        color="inherit"
                        aria-label="menu"
                        disabled={this.state.isButtonDisabled}
                        onClick={this.handleSubmit}
                      >
                        <SendIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )
              }

            </div>
          </TabPanel>

        </SwipeableViews>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    userObj: storeState.userDetail,
    chatConfig: storeState.chatConfig,
    fbuserObj: storeState.fbuserObj,
    componentbgcolor: storeState.componentbgcolor
  };
};

const tChatWindow = withTranslation()(ChatWindow);
const ThemeChatWindow = withTheme(tChatWindow);
const FinalThemeChatWindow = withStyles(useStyles)(ThemeChatWindow);
const routeChatWindow = withRouter(FinalThemeChatWindow);
export default connect(mapStateToProps, { setChatType, setcomponentbgcolor })(routeChatWindow);
