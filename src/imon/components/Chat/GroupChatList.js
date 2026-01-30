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

class GroupChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      applicantObj: {},
    };
  }

  componentDidMount() {
    // let params = {
    //   communityId: localStorage.getItem("CommunityId"),
    // };
    // Services.getApplicantList(params).then((res) => {
    //   console.log("res>>", res);
    //   this.setState({
    //     list: res.data.data,
    //   });
    // });
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
    } catch (error) {
      console.log("createUser>>", error);
      if (error.code == "auth/email-already-in-use") {
        this.signinWithEmail(email, password);
      }else{
        var errorObj = {
          component: 'GroupChatList',
          method: 'createUser',
          error: error
        }
        logError(errorObj);
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
        component: 'GroupChatList',
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
                  {this.props.chatConfig &&
                    this.props.chatConfig.chatGroup.map((rowObj) => {
                      return (
                        <ChatMenuList
                          key={rowObj.id}
                          chatType={this.props.chatConfig.chatType}
                          rowObj={rowObj}
                          openChat={(rowObj) =>
                            this.openChat(rowObj)
                          }
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
    chatConfig: storeState.chatConfig
  };
};

const ThemeGroupChatList = withTheme(GroupChatList);
const FinalThemeGroupChatList = withStyles(useStyles)(ThemeGroupChatList)
const routeGroupChatList = withRouter(FinalThemeGroupChatList);
export default connect(mapStateToProps, {})(routeGroupChatList);
