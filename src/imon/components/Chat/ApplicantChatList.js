import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { auth } from "../../service/firebase";
import Services from "../../api/api";
import ChatMenuList from "./ChatMenuList";
import { signup, signin, logError } from "../../helpers/auth";

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

import InnerHeader from "../Layout/InnerHeader";
import swal from "sweetalert";

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

class ApplicantChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      applicantObj: {},
    };
  }

  componentDidMount() {
    let params = {
      communityId: localStorage.getItem("CommunityId"),
    };
    Services.getApplicantList(params).then((res) => {
      try{
        this.setState({
          list: res.data.data,
        });
      }catch(err){
        console.log("Error::", err);
        var errorObj = {
          component: 'ApplicantChatList',
          method: 'getApplicantList',
          error: err
        }
        logError(errorObj);
      }
    });
  }

  gotoChat() {
    this.props.history.push({
      pathname: "/layout/chat",
      state: this.state.applicantObj,
    });
  }

  openChat(applicantObj) {
    // auth().signOut();
    console.log("openChat>>", applicantObj);
    this.setState(
      {
        applicantObj,
      },
      () => {
        console.log(
          "openChat>>",
          auth().currentUser,
          this.props.userobj.userName
        );
        if (auth().currentUser == null) {
          console.log("user not present", this.props.userobj.userName);
          this.createUser(this.props.userobj.userName);
        } else {
          console.log("user present");
          this.gotoChat();
        }
      }
    );
  }

  async createUser(email, password = "123456") {
    try {
      await signup(email, password).then((res) => {
        console.log("signup>>", res);
        this.signinWithEmail(email, password);
      });
    } catch (err) {
      console.log("createUser>>", err);
      var errorObj = {
        component: 'ApplicantChatList',
        method: 'createUser',
        error: err
      }
      logError(errorObj);
      if (err.code == "auth/email-already-in-use") {
        this.signinWithEmail(email, password);
      }
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
        component: 'ApplicantChatList',
        method: 'signinWithEmail',
        error: error
      }
      logError(errorObj);
    }
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <>
        <div className="gk-page">
          <div className="gridcontainer">
            <Grid container spacing={3} className="gridcontainer">
              <Grid item xs={12} className="gkdivcontent zero ">
                <List className={classes.root}>
                  {this.state.list &&
                    this.state.list.map((rowObj) => {
                      return (
                        <ChatMenuList
                          key={rowObj.id}
                          chatType={this.props.chatConfig.chatType}
                          rowObj={rowObj}
                          openChat={(rowObj) => this.openChat(rowObj)}
                        />
                      );
                    })}
                </List>
              </Grid>
            </Grid>
          </div>
        </div>
      </>
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
    componentbgcolor: storeState.componentbgcolor
  };
};

const ThemeApplicantChatList = withTheme(ApplicantChatList);
const FinalThemeApplicantChatList = withStyles(useStyles)(ThemeApplicantChatList)
const routeApplicantChatList = withRouter(FinalThemeApplicantChatList);
export default connect(mapStateToProps, {})(routeApplicantChatList);
