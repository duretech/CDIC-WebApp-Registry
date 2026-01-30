import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withTranslation, Trans } from "react-i18next";
import swal from "sweetalert";
import { auth } from "../../service/firebase";
import Services from "../../api/api";
import ChatMenuList from "./ChatMenuList";
import { removeSpacetoLowerCase } from '../../api/helper';
import { signup, signin, signInAnonymously, logError } from "../../helpers/auth";

import imgUrl from "../../assets/images/imageUrl.js";
import GavelIcon from "@material-ui/icons/Gavel";
import PeopleIcon from "@material-ui/icons/People";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import Avatar from "@material-ui/core/Avatar";
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';




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

import InnerHeader from "../Layout/InnerHeader";
import Loader from "../loaders/loader";
import DialogBox from '../DialogBox/DialogBox';
import DialogBoxUseAuth from '../DialogBox/DialogBoxUseAuth';
import { setFirebaseUserDetail } from '../../redux/actions/appActions';

//import '../../assets/css/customstyles.css';

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

class PendingApplicantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      applicantObj: {},
      isLoading: true,
      open: false,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.getUserList();
  }

  getUserList() {
    let userId = JSON.parse(localStorage.getItem('obj')).userId;
    let params = {
      communityId: localStorage.getItem("CommunityId"),
      forumChatApproval: false,
      userId: userId
    };

    console.log(params)

    Services.getListApplicantForChatApproval(params).then((res) => {
      try{
        console.log("res>>", res);
        if (res.data.status == 200) {
          console.log("res>>", res.data.data.responseForumList);
          if (res.data.data.responseForumList && res.data.data.responseForumList.length > 0) {
            this.setState({
              list: res.data.data.responseForumList,
              isLoading: false,
            });
          }
        }
      }catch(err){
        console.log("err::", err)
        var errorObj = {
          component: 'PendingApplicantList',
          method: 'getUserList',
          error: err
        }
        logError(errorObj);
      }
    });
  }

  buttonClick() {
    this.props.changeTab()
  }

  closeDialog() {
    this.setState({ open: false })
  }

  closeDialogAuth() {
    this.setState({ openAuth: false })
  }


  render() {
    var self = this;
    const { classes, theme } = this.props;
    const { t } = this.props;
    var self = this;
    if (this.props.compChatType == '') {
      return null
    }

    const swipeLeftOptions = (myUserObj,forumobj) => ({
      content: <div label="Confirm" position="right" className="self-conform-bg">Approve</div>,
      action: () => itemSwipedLeft(myUserObj,forumobj)
    });
    const swipeRightOptions = (myUserObj,forumobj) => ({
      content: <div label="Not Confirm" position="right" className="self-conform-bg self-not-conform-bg">Decline</div>,
      action: () => itemSwipedRight(myUserObj, forumobj)
    });

    function itemSwipedLeft(userParam, forumobj) {
      console.log("item swiped left", userParam, forumobj);
      var params = {
        approvedBy: JSON.parse(localStorage.getItem("obj")).userId,
        forumId: forumobj.forumId,
        communityId: localStorage.getItem("CommunityId"),
        forumChatApproval: true,
        "userList": [
          userParam.userId
        ]
      };
      Services.approveApplicantForForumChat(params).then((res) => {
        try{
          if (res.data.status == 200) {
            swal({
              text: t("The user has been authorized"),
              icon: "success",
              button: t("Ok"),
            }).then((val) => {
              self.getUserList();
            });
          }
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'PendingApplicantList',
            method: 'itemSwipedLeft',
            error: err
          }
          logError(errorObj);
        }
      });
    }

    function itemSwipedRight(userParam, forumobj) {
      console.log("item swiped left", userParam, forumobj);
      var params = {
        approvedBy: JSON.parse(localStorage.getItem("obj")).userId,
        forumId: forumobj.forumId,
        communityId: localStorage.getItem("CommunityId"),
        forumChatApproval: false,
        "userList": [
          userParam.userId
        ]
      };
      Services.approveApplicantForForumChat(params).then((res) => {
        try{
          if (res.data.status == 200) {
            swal({
              text: t("The user has been decline"),
              icon: "info",
              button: t("Ok"),
            }).then((val) => {
              self.getUserList();
            });
          }
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'PendingApplicantList',
            method: 'itemSwipedRight',
            error: err
          }
          logError(errorObj);
        }
      });
    }

    return (
      <div>
        {this.state.isLoading ? (
          <Loader isLoading={this.state.isLoading} />
        ) : (
          this.state.list &&
          this.state.list.map((forumobj) => {
            return (<div className="pendinguserlist">
              <div className="forumname">{forumobj.forumLabel}</div>
              { forumobj.userList.length > 0 && forumobj.userList.map((rowObj) => {
                return (
                  <SwipeableList>
                    <SwipeableListItem
                      swipeLeft={swipeLeftOptions(rowObj,forumobj)}
                      swipeRight={swipeRightOptions(rowObj, forumobj)}
                    >
                      <Grid
                        container
                        spacing={3}
                        className="gridcontainer pendinguserlistdiv borderbottomgrey"
                      >
                        <Grid item xs={2} className="zero">
                          <p className="zero color-green text-center forumicon">
                            {rowObj.avtaar ?
                              <Avatar src={imgUrl[rowObj.avtaar]} />
                              : <Avatar src="/static/images/avatar/1.jpg" />
                            }
                          </p>
                        </Grid>
                        <Grid item xs={7} className="zero">
                          <p className="zero color-green chatusername">{rowObj.userId}</p>
                          {/* <p className="zero chatlastactive">{JSON.stringify(rowObj.forumChatApproval)}</p> */}
                        </Grid>
                      </Grid>
                    </SwipeableListItem>
                  </SwipeableList>
                );
              })
              }
            </div>)
          })
        )}
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
  };
};

const transPendingApplicantList = withTranslation()(PendingApplicantList);
const ThemePendingApplicantList = withTheme(transPendingApplicantList);
const FinalThemePendingApplicantList = withStyles(useStyles)(ThemePendingApplicantList);
const routePendingApplicantList = withRouter(FinalThemePendingApplicantList);
export default connect(mapStateToProps)(routePendingApplicantList);
