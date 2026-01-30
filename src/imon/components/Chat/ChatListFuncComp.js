import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as _ from "lodash";
import { withTranslation, Trans } from "react-i18next";
import SearchBar from "material-ui-search-bar";
import { useHistory, withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

import "../../../imon/assets/css/imon.css";
import "../../../imon/assets/css/imon_theme_royalblue.css";
import "../../../imon/assets/css/imon_theme_red.css";
import "../../../imon/assets/css/imon_theme_amber.css";
import "../../../imon/assets/css/imon_theme_purple.css";
import "../../../imon/assets/css/imon_theme_orange.css";
import "../../../imon/assets/css/imon_theme_pink.css";

function ChatListFuncComp(props) {
  const { t, i18n } = useTranslation();
  const compcolor = localStorage.getItem("componentbgcolor");
  const history = useHistory();
  const { templateID } = props;
  const theme = useTheme();
  const [list, setlist] = useState([]);
  const [orignalList, setorignalList] = useState([]);
  const [applicantObj, setapplicantObj] = useState({});
  const [limitfrom, setlimitfrom] = useState(1);
  const [limitto, setlimitto] = useState(50);
  const [refreshcounter, setrefreshcounter] = useState(0);
  const [showloadmore, setshowloadmore] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [open, setopen] = useState(false);
  let [userId, setuserId] = useState(null);
  let userobj = localStorage.getItem("obj");
  let [menuList, setmenuList] = useState(null);
  let menuobj = localStorage.getItem("menuList");
  const [apierr, setapierr] = useState(false);
  const [openAuth, setopenAuth] = useState(false);
  const [applicantLimit, setapplicantLimit] = useState(50);
  const [applicantid, setapplicantid] = useState(0);
  const [applicantusername, setapplicantusername] = useState("");
  const [filterList, setfilterList] = useState([]);
  const [searchlist, setsearchlist] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (props && props.compChatType == "peer") {
      if (!navigator.onLine) {
        setisLoading(false);
      }
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        userId: userId,
        roleType: ["GuestUser", "Applicant"],
        limitFrom: 0,
        limitTo: applicantLimit,
      };
      getApplicantList(params);
    } else if (props && props.compChatType == "admin") {
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        roleType: ["SuperAdmin"],
        limitFrom: 0,
        limitTo: 1,
      };

      getApplicantList(params);
    } else {
      if (!navigator.onLine) {
        setisLoading(false);
      }
      getChatForumList();
    }
  }, [userId]);

  const getApplicantList = (params) => {
    if (navigator.onLine) {
      const { t } = props;
      var userid = userId;
      console.log("getApplicantList params::", params);
      Services.getApplicantList(params).then((res) => {
        console.log("res::", res.data.status);
        if (res == "Request failed with status code 404") {
          setshowloadmore(false);
        }
        try {
          if (res.data.status == 200) {
            setlimitfrom(limitfrom + applicantLimit);
            setlimitto(limitto + applicantLimit);
            let applicantlst = [];
            res.data.data.map((applicant) => {
              if (applicant.isactive && applicant.id != userid) {
                // applicantlst.push(applicant);
                // setfilterList(applicantlst);
                applicantlst = res.data.data.map((ele) => {
                  return { ...ele, applicant };
                });
              }
            });
            setlist(applicantlst);
            setfilterList(applicantlst);
            setorignalList(filterList);
            setisLoading(false);
            // console.log("orignalList::", orignalList);
            // console.log("orignalListlength", orignalList?.length);
          }
        } catch (err) {
          console.log("Error::", err);
          setapierr(true);
          console.log(apierr);
          var errorObj = {
            component: "ChatList",
            method: "getApplicantList",
            error: err,
          };
          logError(errorObj);
        }
      });
    }
  };

  const loadMore = () => {
    try {
      if (navigator.onLine) {
        let params = {
          communityId: localStorage.getItem("CommunityId"),
          userId: userId,
          roleType: ["GuestUser", "Applicant"],
          limitFrom: limitfrom,
          limitTo: limitto,
        };
        getApplicantList(params);
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
  };

  const syncOnlineData = () => {
    setrefreshcounter(refreshcounter + 1);
  };

  const getChatForumList = () => {
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
              console.log(tempList);
              setlist(tempList);
            }
          } catch (err) {
            console.log("err::", err);
            setapierr(true);
            console.log(apierr);
            var errorObj = {
              component: "ChatList",
              method: "getChatForumList",
              error: err,
            };
            logError(errorObj);
          }
        })
        .catch((err) => {
          setlist([]);
          setisLoading(false);
        });
    }
  };

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

  const getChatForumListMsgCount = () => {
    if (navigator.onLine) {
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        userId: userId,
      };
      console.log("getChatForumListMsgCount", params);

      Services.getForumGroupMsgCountForUserByCommunityId(params)
        .then((res) => {
          try {
            console.log("message count", res.data.data);
            console.log("this.state.list", list);
            var myTempList = list;
            if (myTempList) {
              for (var i = 0; i < myTempList.length; i++) {
                console.log("ele::", myTempList[i]);
                if (res && res.data && res.data.data) {
                  for (var j = 0; j < res.data.data?.length; j++) {
                    console.log("myele", j);
                    if (myTempList[i].id == res.data.data[j].groupId) {
                      myTempList[i].countOfMsgs = res.data.data[j].countOfMsgs;
                    }
                  }
                }
              }
            }
            console.log("object3", myTempList);
            setlist(myTempList);
            setorignalList(myTempList);
            setisLoading(false);
          } catch (err) {
            console.log("err::", err);
            setapierr(true);
            console.log(apierr);
            var errorObj = {
              component: "ChatList",
              method: "getChatForumListMsgCount",
              error: err,
            };
            logError(errorObj);
          }
        })
        .catch((err) => {
          setlist([]);
          setisLoading(false);
        });
    }
  };

  function openChat(rowapplicantobj) {
    try {
      setapplicantObj(rowapplicantobj);
      gotoChat(auth().currentUser, rowapplicantobj);
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

  const gotoChat = (user, gotoapplicantobj) => {
    let { uid, displayName, photoURL } = { ...user };
    let myUser = {
      uid: uid,
      displayName: displayName,
      photoURL: photoURL,
    };
    console.log("gotoChat>>", user, gotoapplicantobj);
    if (user != null) {
      history.push({
        pathname: "/layout/chatwindow",
        state: {
          applicant: gotoapplicantobj,
          userObj: myUser,
          chatType: props.compChatType,
        },
      });
    } else {
      signInAnonymously();
    }
  };

  const buttonClick = () => {
    props.changeTab();
  };

  const closeDialog = () => {
    setopen(false);
  };

  const closeDialogAuth = () => {
    setopenAuth(false);
  };

  useEffect(() => {
    if (applicantObj) {
      var usertabflag = false;
      let tab = "";
      if (menuList) {
        tab = menuList.filter((obj) => obj.path == "peerchat");
      }
      if (tab && tab.length > 0) {
        var usertab = tab[0].childs.filter(
          (obj) => obj.isactive && obj.visible && obj.path == "user"
        );
        if (usertab && usertab.length > 0) {
          usertabflag = true;
        }
      }
      if (auth().currentUser == null && usertabflag) {
        setopen(true);
      } else {
        if (
          props &&
          props.compChatType != "peer" &&
          props.compChatType != "admin"
        ) {
          if (applicantObj.isModeratorRequired) {
            checkIfForumchatIsApproved(applicantObj);
          } else {
            setisLoading(true);
            // gotoChat(auth().currentUser);
          }
        } else {
          setisLoading(true);
          // gotoChat(auth().currentUser);
        }
      }
    }
  }, [applicantObj, menuList]);

  const checkIfForumchatIsApproved = (applicantObj) => {
    let params = {
      communityId: localStorage.getItem("CommunityId"),
      userId: userId,
      forumId: applicantObj.id,
      forumLabel: applicantObj.label,
    };
    Services.checkIfForumchatIsApproved(params).then((res) => {
      try {
        let forumChatApproval = res.data.data.forumChatApproval;
        if (forumChatApproval == true) {
          setisLoading(true);
          gotoChat(auth().currentUser);
        } else {
          setopen(true);
        }
      } catch (err) {
        console.log("Error::", err);
        setapierr(true);
        console.log(apierr);
        var errorObj = {
          component: "ChatList",
          method: "checkIfForumchatIsApproved",
          error: err,
        };
        logError(errorObj);
      }
    });
  };

  const createUser = async (email, password = "123456") => {
    try {
      await signup(email, password).then((res) => {
        signinWithEmail(email, password);
      });
    } catch (error) {
      if (error.code == "auth/email-already-in-use") {
        signinWithEmail(email, password);
      } else {
        var errorObj = {
          component: "ChatList",
          method: "createUser-FB",
          error: error,
        };
        logError(errorObj);
      }
    }
  };

  const signInAnonymously = async () => {
    try {
      await signInAnonymously()
        .then((res) => {
          auth().onAuthStateChanged((user) => {
            if (user) {
              gotoChat(user);
            } else {
              console.log("error>>", user);
            }
          });
        })
        .catch();
    } catch (error) {
      var errorObj = {
        component: "ChatList",
        method: "signInAnonymously",
        error: error,
      };
      logError(errorObj);
    }
  };

  const signinWithEmail = async (email, password) => {
    try {
      await signin(email, password)
        .then((res) => {
          auth().onAuthStateChanged((user) => {
            if (user) {
              gotoChat();
            } else {
              console.log("error>>", user);
            }
          });
        })
        .catch();
    } catch (error) {
      var errorObj = {
        component: "ChatList",
        method: "signInWithEmail",
        error: error,
      };
      logError(errorObj);
    }
  };

  const handleOnSearch = (e) => {
    let evalue = typeof e;
    console.log("e::", evalue);
    if (evalue == "string") {
      applicantusername = e;
    }
    if (e && e.length == 0) {
      setlist(orignalList);
    }
  };

  const handlenewsearch = () => {
    let searcharr = [];
    let searchparams = {
      communityId: localStorage.getItem("CommunityId"),
      userId: parseInt(applicantusername) ? parseInt(applicantusername) : null,
      username: parseInt(applicantusername) ? null : applicantusername,
    };
    var userid = userId;
    console.log("searchparams::", searchparams);
    Services.searchUserByName(searchparams).then((res) => {
      console.log("res::", res);
      try {
        if (res.data.status == 200 && res.data.data) {
          res.data.data.map((applicant) => {
            if (applicant.isactive && applicant.id != userid) {
              searcharr.push(applicant);
            }
          });
          setlist(searcharr);
          setshowloadmore(false);
        }
      } catch (err) {
        console.log("Error::", err);
        setapierr(true);
        console.log(apierr);
        var errorObj = {
          component: "ChatList",
          method: "handlenewsearch",
          error: err,
        };
        logError(errorObj);
      }
    });
  };

  const cancelSearch = (e) => {
    try {
      setlist(orignalList);
      setshowloadmore(false);
    } catch (err) {
      console.log(err);
    }
  };

  return apierr == false && menuList && userId && props ? (
    <div className={props.compChatType == "peer" ? "peer-list" : "group-list"}>
      {/* {this.state.isLoading ? (
        <Loader isLoading={this.state.isLoading} />
      ) : ( */}
      <>
        {navigator.onLine == true && props.compChatType == "peer" ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={9}>
                <SearchBar
                  placeholder={t("Search")}
                  className="getaccess-searchbar"
                  onChange={handleOnSearch}
                  onCancelSearch={cancelSearch}
                  style={{ borderColor: compcolor }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  type="submit"
                  variant="contained"
                  className="gobutton"
                  onClick={() => handlenewsearch()}
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
          list &&
          list.map((rowObj) => {
            return (
              <ChatMenuList
                key={rowObj.id}
                chatType={props.compChatType}
                rowObj={rowObj}
                openChat={(rowObj) => openChat(rowObj)}
              />
            );
          })}
        {props.compChatType == "group" ? <></> : ""}
        {list && list.length == 0 ? (
          navigator.onLine == false ? (
            <div className="no-internet" onClick={syncOnlineData}>
              <div className="offline-icon">
                <WifiOffIcon />
              </div>
              <div className="offline-desc">{t("You are in offline mode")}</div>
            </div>
          ) : (
            // <strong><p>{t('No Data Found')}</p></strong>
            <></>
            // <Loader isLoading={true} />
          )
        ) : props.compChatType == "peer" && showloadmore ? (
          <div className="text-center">
            <Button
              // style={{ borderColor: compcolor }}
              type="submit"
              variant="contained"
              // color = "primary"
              className="loadmore"
              onClick={() => loadMore()}
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
        open={open}
        closeDialog={() => closeDialog(false)}
        buttonClick={() => buttonClick()}
      />

      <DialogBoxUseAuth
        open={openAuth}
        closeDialog={() => closeDialogAuth(false)}
        buttonClick={() => closeDialogAuth(false)}
      />
    </div>
  ) : (
    <h3 style={{ textAlign: "center", marginTop: "200px", width: "100%" }}>
      {t("No data found")}
    </h3>
  );
}

export default ChatListFuncComp;
