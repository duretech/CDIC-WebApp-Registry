import React, { Component } from "react";
import { connect } from "react-redux";
import * as _ from "lodash";
import { withTranslation, Trans } from "react-i18next";
import SearchBar from "material-ui-search-bar";
import { withRouter } from "react-router-dom";
import { auth } from "../../service/firebase";
import Button from "@material-ui/core/Button";
import Services from "../../api/api";
import ChatMenuList from "./ChatMenuList";
import { removeSpacetoLowerCase } from "../../api/helper";
import {
  signup,
  signin,
  signInAnonymously,
  logError,
} from "../../helpers/auth";

import imgUrl from "../../assets/images/imageUrl.js";

import {
  withStyles,
  makeStyles,
  useTheme,
  withTheme,
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import HomeIcon from "@material-ui/icons/Home";
import List from "@material-ui/core/List";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import InnerHeader from "../Layout/InnerHeader";
import Loader from "../loaders/loader";
import DialogBox from "../DialogBox/DialogBox";
import DialogBoxUseAuth from "../DialogBox/DialogBoxUseAuth";
import { setFirebaseUserDetail } from "../../redux/actions/appActions";
import swal from "sweetalert";
import { gaLogEvent } from "../../helpers/analytics";
import { parse } from "date-fns";
import Avatar from "@material-ui/core/Avatar";
import OfflineDb from "../../../db";

import "../../../imon/assets/css/imon.css";
import "../../../imon/assets/css/imon_theme_royalblue.css";
import "../../../imon/assets/css/imon_theme_red.css";
import "../../../imon/assets/css/imon_theme_amber.css";
import "../../../imon/assets/css/imon_theme_purple.css";
import "../../../imon/assets/css/imon_theme_orange.css";
import "../../../imon/assets/css/imon_theme_pink.css";
// import "../../assets/css/template1.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      orignalList: [],
      applicantObj: {},
      limitfrom: 1,
      limitto: 50,
      showloadmore: true,
      isLoading: true,
      open: false,
      applicantLimit: 50,
      applicantid: 0,
      applicantusername: "",
      filterList: [],
      searchlist: [],
      adminObj: {},
      provider: "",
    };
    this.openChat = this.openChat.bind(this);
    this.handleOnSearch = this.handleOnSearch.bind(this);
    this.handlenewsearch = this.handlenewsearch.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.syncOnlineData = this.syncOnlineData.bind(this);
    // this.handleClick =  this.handleClick.bind(this)
    // this.redirectToRoom = this.redirectToRoom.bind(this)
  }

  componentDidMount() {
    let communityId = localStorage.getItem("CommunityId");
    try {
      gaLogEvent("chat " + this.props.compChatType, "", "");
    } catch (err) {
      var errorObj = {
        component: "ChatList",
        method: "galogEvent-chat",
        error: err,
      };
      logError(errorObj);
      console.log("err::", err);
    }
    this.setState({ isLoading: true });
    console.log(this.props, this.state);
    if (this.props && this.props.compChatType == "peer") {
      if (!navigator.onLine) {
        this.setState({
          // list: this.props.chatConfig.chatGroup,
          isLoading: false,
        });
      }
      let userId = JSON.parse(localStorage.getItem("obj")).userId;
      let params = {
        communityId: communityId,
        userId: userId,
        roleType: ["GuestUser", "Applicant"],
        limitFrom: 0,
        limitTo: this.state.applicantLimit,
      };
      this.getApplicantList(params);
      this.getFirebaseUserList();
    } else if (this.props && this.props.compChatType == "admin") {
      let params = {
        communityId: communityId,
        roleType: ["SuperAdmin"],
        limitFrom: 0,
        limitTo: 1,
      };

      this.getApplicantList(params);
      this.getFirebaseUserList();
    } else if (this.props && this.props.compChatType == "provider") {
      this.getProvider();
    } else {
      if (!navigator.onLine) {
        this.setState({
          // list: this.props.chatConfig.chatGroup,
          isLoading: false,
        });
      }
      this.getChatForumList();
    }
  }

  getApplicantList(params) {
    let communityId = localStorage.getItem("CommunityId");
    if (navigator.onLine) {
      const { t } = this.props;
      console.log("getApplicantList params::", params);
      var userid = JSON.parse(localStorage.getItem("obj")).userId;
      Services.getApplicantList(params).then((res) => {
        // console.log("res::",res.data.status)
        if (res == "Request failed with status code 404") {
          this.setState({
            showloadmore: false,
          });
          // swal({
          //   text: t("No more users found"),
          //   icon: "warning",
          //   button: t("Ok"),
          // }).then((val) => {
          //   swal.close();
          // });
        }
        try {
          if (res.data.status == 200) {
            this.setState({
              limitfrom: this.state.limitfrom + this.state.applicantLimit,
              limitto: this.state.limitto + this.state.applicantLimit,
            });
            res.data.data.map((applicant) => {
              if (applicant.isactive && applicant.id != userid) {
                this.state.filterList.push(applicant);
              }
            });
            this.setState({
              list: this.state.filterList,
              orignalList: this.state.filterList,
              isLoading: false,
            });
            console.log("orignalList::", this.state.orignalList);
            console.log("orignalListlength", this.state.orignalList?.length);
            console.log("state::", this.state);
          }
        } catch (err) {
          console.log("Error::", err);
          var errorObj = {
            component: "ChatList",
            method: "getApplicantList",
            error: err,
          };
          logError(errorObj);
        }
      });
    }
  }

  loadMore() {
    let communityId = localStorage.getItem("CommunityId");
    try {
      if (navigator.onLine) {
        let params = {
          communityId: communityId,
          userId: JSON.parse(localStorage.getItem("obj")).userId,
          roleType: ["GuestUser", "Applicant"],
          limitFrom: this.state.limitfrom,
          limitTo: this.state.limitto,
        };
        this.getApplicantList(params);
      }
    } catch (err) {
      console.log(err);
      var errorObj = {
        component: "ChatList",
        method: "loadMore",
        error: err,
      };
      logError(errorObj);
    }
  }

  syncOnlineData() {
    this.componentDidMount();
  }

  getChatForumList() {
    let communityId = localStorage.getItem("CommunityId");
    if (navigator.onLine) {
      let params = {
        communityId: communityId,
        isactive: true,
        languageId: 1,
      };
      console.log(params);
      Services.getForumChatGroupByCommunityId(params)
        .then((res) => {
          try {
            console.log(res);
            if (res && res.data.status == 200) {
              let tempList = res.data.data.map((ele) => {
                return { ...ele, title: ele.groupName };
              });
              this.setState({
                list: tempList,
              });
            }
            // this.getChatForumListMsgCount();
          } catch (err) {
            console.log("err::", err);
            var errorObj = {
              component: "ChatList",
              method: "getChatForumList",
              error: err,
            };
            logError(errorObj);
          }
        })
        .catch((err) => {
          this.setState({
            list: [],
            isLoading: false,
          });
        });
    }
  }

  getChatForumListMsgCount() {
    let communityId = localStorage.getItem("CommunityId");
    if (navigator.onLine) {
      let params = {
        communityId: communityId,
        userId: JSON.parse(localStorage.getItem("obj")).userId,
      };
      console.log("getChatForumListMsgCount", params);

      Services.getForumGroupMsgCountForUserByCommunityId(params)
        .then((res) => {
          try {
            console.log("message count", res.data.data);
            console.log("this.state.list", this.state.list);
            var myTempList = this.state.list;
            for (var i = 0; i < myTempList.length; i++) {
              console.log("ele::", myTempList[i]);
              for (var j = 0; j < res.data.data?.length; j++) {
                console.log("myele", j);
                if (myTempList[i].id == res.data.data[j].groupId) {
                  myTempList[i].countOfMsgs = res.data.data[j].countOfMsgs;
                }
              }
            }
            console.log("object3", myTempList);
            this.setState({
              list: myTempList,
              orignalList: myTempList,
              isLoading: false,
            });
          } catch (err) {
            console.log("err::", err);
            var errorObj = {
              component: "ChatList",
              method: "getChatForumListMsgCount",
              error: err,
            };
            logError(errorObj);
          }
        })
        .catch((err) => {
          this.setState({
            list: [],
            isLoading: false,
          });
        });
    }
  }
  uid;
  displayName;
  photoURL;

  gotoChat = (user) => {
    let { uid, displayName, photoURL } = { ...user };
    let myUser = {
      uid: uid,
      displayName: displayName,
      photoURL: photoURL,
      id: JSON.parse(localStorage.getItem("obj")).userId,
    };
    ///layout/peerchat/chatwindow
    console.log("gotoChat>>", user, this.state.applicantObj);
    if (user != null) {
      this.props.history.push({
        pathname: "/layout/chatwindow",
        state: {
          applicant: this.state.applicantObj,
          userObj: myUser,
          chatType: this.props.compChatType,
        },
      });
    } else {
      this.signInAnonymously();
    }
  };

  getFirebaseUserList() {}

  getProvider() {
    var that = this;
    OfflineDb.getDataFromPouchDB("loginDetails").then((res) => {
      that.setState({
        provider: res.data.userCredentials.user.displayName,
      });
      console.log(this.state, res);
    });
  }

  buttonClick() {
    this.props.changeTab();
  }

  closeDialog() {
    this.setState({ open: false });
  }

  closeDialogAuth() {
    this.setState({ openAuth: false });
  }

  openChat(applicantObj) {
    try {
      console.log("openchat::", applicantObj);
      var usertabflag = false;
      var menuList = JSON.parse(localStorage.getItem("menuList"));
      var tab = menuList.filter((obj) => obj.path == "peerchat");
      if (tab.length > 0) {
        var usretab = tab[0].childs.filter(
          (obj) => obj.isactive && obj.visible && obj.path == "user"
        );
        if (usretab.length > 0) {
          usertabflag = true;
        }
      }
      this.setState({ applicantObj }, () => {
        if (auth().currentUser == null && usertabflag) {
          this.setState({ open: true });
        } else {
          if (
            this.props &&
            this.props.compChatType != "peer" &&
            this.props.compChatType != "admin"
          ) {
            if (applicantObj.isModeratorRequired) {
              this.checkIfForumchatIsApproved(applicantObj);
            } else {
              this.setState({ isLoading: true });
              this.gotoChat(auth().currentUser);
            }
          } else {
            this.setState({ isLoading: true });
            this.gotoChat(auth().currentUser);
          }
        }
      });
    } catch (err) {
      console.log(err);
      var errorObj = {
        component: "ChatList",
        method: "openChat",
        error: err,
      };
      logError(errorObj);
    }
  }

  checkIfForumchatIsApproved(applicantObj) {
    let communityId = localStorage.getItem("CommunityId");
    let params = {
      communityId: communityId,
      userId: JSON.parse(localStorage.getItem("obj")).userId,
      forumId: applicantObj.id,
      forumLabel: applicantObj.label,
    };
    Services.checkIfForumchatIsApproved(params).then((res) => {
      try {
        let forumChatApproval = res.data.data.forumChatApproval;
        if (forumChatApproval == true) {
          this.setState({ isLoading: true });
          this.gotoChat(auth().currentUser);
        } else {
          this.setState({ openAuth: true });
        }
      } catch (err) {
        console.log("Error::", err);
        var errorObj = {
          component: "ChatList",
          method: "checkIfForumchatIsApproved",
          error: err,
        };
        logError(errorObj);
      }
    });
  }

  async createUser(email, password = "123456") {
    try {
      await signup(email, password).then((res) => {
        this.signinWithEmail(email, password);
      });
    } catch (error) {
      if (error.code == "auth/email-already-in-use") {
        this.signinWithEmail(email, password);
      } else {
        var errorObj = {
          component: "ChatList",
          method: "createUser-FB",
          error: error,
        };
        logError(errorObj);
      }
    }
  }

  async signInAnonymously() {
    try {
      await signInAnonymously()
        .then((res) => {
          auth().onAuthStateChanged((user) => {
            if (user) {
              this.gotoChat(user);
            } else {
              console.log("error>>", user);
            }
          });
        })
        .catch();
    } catch (error) {
      this.setState({ error: error.message });
      var errorObj = {
        component: "ChatList",
        method: "signInAnonymously",
        error: error,
      };
      logError(errorObj);
    }
  }

  async signinWithEmail(email, password) {
    try {
      await signin(email, password)
        .then((res) => {
          auth().onAuthStateChanged((user) => {
            if (user) {
              this.gotoChat();
            } else {
              console.log("error>>", user);
            }
          });
        })
        .catch();
    } catch (error) {
      this.setState({ error: error.message });
      var errorObj = {
        component: "ChatList",
        method: "signInWithEmail",
        error: error,
      };
      logError(errorObj);
    }
  }

  handleOnSearch = (e) => {
    let evalue = typeof e;
    console.log("e::", evalue);
    if (evalue == "string") {
      this.state.applicantusername = e;
    }
    // let topicList = _.cloneDeep(this.state.orignalList);
    // let filtered = [];
    // filtered = topicList.filter(function (str) {
    //   return ((str.id + '').indexOf(e) !== -1 || removeSpacetoLowerCase(str.nickName + '').indexOf(removeSpacetoLowerCase(e)) !== -1);
    // });
    // if (e.length == 0) {
    //   filtered = _.cloneDeep(this.state.orignalList);
    // }
    // this.setState({
    //   list: filtered,
    // });
    if (e.length == 0) {
      this.setState({
        list: this.state.orignalList,
      });
    }
  };

  handlenewsearch() {
    let communityId = localStorage.getItem("CommunityId");
    let searcharr = [];
    let searchparams = {
      communityId: communityId,
      userId: parseInt(this.state.applicantusername)
        ? parseInt(this.state.applicantusername)
        : null,
      username: parseInt(this.state.applicantusername)
        ? null
        : this.state.applicantusername,
    };
    var userid = JSON.parse(localStorage.getItem("obj")).userId;
    console.log("searchparams::", searchparams);
    Services.searchUserByName(searchparams).then((res) => {
      console.log("res::", res);
      try {
        if (res.data.status == 200 && res.data.data) {
          res.data.data.map((applicant) => {
            if (applicant.isactive && applicant.id != userid) {
              searcharr.push(applicant);
            }
            // console.log("searchList::", this.state.searchlist)
          });
          this.setState({
            list: searcharr,
            showloadmore: false,
          });
        }
      } catch (err) {
        console.log("Error::", err);
        var errorObj = {
          component: "ChatList",
          method: "handlenewsearch",
          error: err,
        };
        logError(errorObj);
      }
    });
  }

  cancelSearch(e) {
    try {
      this.setState({
        list: this.state.orignalList,
        showloadmore: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { t } = this.props;
    const { classes, theme } = this.props;
    var compcolor = localStorage.getItem("componentbgcolor");
    if (this.props.compChatType == "") {
      return null;
    }

    //console.log(this.state.list,auth().currentUser)
    // if(this.state.list.length == 1 && auth().currentUser != null) {
    //    return <Redirect to={{
    //     pathname: "/layout/chatwindow",
    //     state: {
    //       applicant: this.state.list[0],
    //       userObj: auth().currentUser,
    //       chatType: this.props.compChatType,
    //     },
    //   }}
    //   />;
    // } else if (this.state.list.length == 1 && auth().currentUser == null){
    //   this.gotoChat(auth().currentUser)
    // }

    return (
      <div
        className={
          this.props.compChatType == "peer" ? "peer-list" : "group-list"
        }
      >
        {/* {this.state.isLoading ? (
          <Loader isLoading={this.state.isLoading} />
        ) : ( */}
        <>
          {navigator.onLine == true && this.props.compChatType == "peer" ? (
            <>
              <Grid container spacing={3}>
                <Grid item xs={9}>
                  <SearchBar
                    placeholder={t("Search")}
                    className="getaccess-searchbar"
                    onChange={this.handleOnSearch}
                    onCancelSearch={this.cancelSearch}
                    style={{ borderColor: compcolor }}
                  />
                </Grid>
                <Grid item xs={3} className="gobuttongrid">
                  <Button
                    type="submit"
                    variant="contained"
                    className="gobutton"
                    onClick={() => this.handlenewsearch()}
                    disableElevation
                  >
                    {t("Go")}
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            ""
          )}
          {navigator.onLine == true &&
            this.state.list &&
            this.state.list.map((rowObj) => {
              return (
                <ChatMenuList
                  key={rowObj.id}
                  chatType={this.props.compChatType}
                  rowObj={rowObj}
                  openChat={(rowObj) => this.openChat(rowObj)}
                />
              );
            })}
          {/* {
            this.state.adminObj ?  <ChatMenuList
            key={this.state.adminObj.id}
            chatType={this.props.compChatType}
            rowObj={this.state.adminObj}
            openChat={(adminObj) => this.openChat(adminObj)}
          /> : ''
          } */}
          {this.state.provider.length > 0 ? (
            <ChatMenuList
              key={this.state.provider}
              chatType={this.props.compChatType}
              rowObj={this.state.provider}
              openChat={(adminObj) => this.openChat(adminObj)}
            />
          ) : (
            ""
          )}
          {this.props.compChatType == "group" ? <></> : ""}
          {this.state.list?.length == 0 ? (
            navigator.onLine == false ? (
              <div className="no-internet" onClick={this.syncOnlineData}>
                <div className="offline-icon">
                  <WifiOffIcon />
                </div>
                <div className="offline-desc">
                  {t("You are in offline mode")}
                </div>
              </div>
            ) : (
              // <strong><p>{t('No Data Found')}</p></strong>
              <></>
              // <Loader isLoading={true} />
            )
          ) : this.props.compChatType == "peer" && this.state.showloadmore ? (
            <div className="text-center">
              <Button
                // style={{ borderColor: compcolor }}
                type="submit"
                variant="contained"
                // color = "primary"
                className="loadmore"
                onClick={() => this.loadMore()}
                disableElevation
              >
                {t("Load more")}
              </Button>
            </div>
          ) : (
            ""
          )}
        </>
        {/* )} */}
        <DialogBox
          open={this.state.open}
          closeDialog={() => this.closeDialog(false)}
          buttonClick={() => this.buttonClick()}
        />

        <DialogBoxUseAuth
          open={this.state.openAuth}
          closeDialog={() => this.closeDialogAuth(false)}
          buttonClick={() => this.closeDialogAuth(false)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
    userobj: storeState.userDetail,
    chatConfig: storeState.chatConfig,
    fbuserObj: storeState.fbuserObj,
    componentbgcolor: storeState.componentbgcolor,
  };
};

const transChatList = withTranslation()(ChatList);
const ThemeChatList = withTheme(transChatList);
const FinalThemeChatList = withStyles(useStyles)(ThemeChatList);
const routeChatList = withRouter(FinalThemeChatList);
export default connect(mapStateToProps, { setFirebaseUserDetail })(
  routeChatList
);
