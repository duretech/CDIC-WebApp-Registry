import React, { Component } from "react";
import classnames from "classnames";
import Paper from "@material-ui/core/Paper";
import { withTranslation, Trans } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import Input from "@material-ui/core/Input";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FormControl from "@material-ui/core/FormControl";
import imgUrl from "../../assets/images/imageUrl.js";
import Loader from "../loaders/loader";
import { connect } from "react-redux";
import { useHistory, withRouter, Route, Redirect, Switch, Link } from "react-router-dom";
import { withStyles, makeStyles, useTheme, withTheme } from "@material-ui/core/styles";
import { logError, signInAnonymously } from "../../helpers/auth";
import { auth } from "../../service/firebase";
import { db, storageRef } from "../../service/firebase";
import ApiServices from "../../api/api";
import TextField from "@material-ui/core/TextField";
import Services from "../../api/api";
import swal from "sweetalert";
import OffileDb from '../../config/pouchDB';
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
import Header from "./Header";

class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userDetails: [],
      name: '',
      password: '',
      passwordVisibility: false
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.getUserDeatils = this.getUserDeatils.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  componentDidMount() {
    gaLogEvent("Onboarding User Login", '', '');
    gaLogScreen("UserLogin");

     OffileDb.setDatabase()
  }

  handleChangeName(event) {
    // console.log(event)
    this.setState({
      name: event.target.value,
    });
  }
  handleChangePassword(event) {
    // console.log(event)
    this.setState({
      password: event.target.value,
    });
  }

  handleSubmit = (event) => {
    var self = this;
    event.preventDefault();
    const { t } = this.props;
    this.setState({ isLoading: true });

    var param = {
      userName: this.state.name,
      password: this.state.password
    };

    if (param.userName != "" && param.password != "") {
      Services.dashboardLogin(param).then((res) => {
        try {
          if (res.data.status == 200) {
            OffileDb.deleteDatabse();
            setTimeout(function () {
              localStorage.setItem('healthworkerflag', true)
              localStorage.setItem('adminobj', JSON.stringify({
                ...res.data.data,
                roleId: res.data.data.roleId,
                roleType: res.data.data.masterRoleType.roleType,
                userId: res.data.data.userId,
                userType: res.data.data.userType,
                communityId: res.data.data.communityId
              }))
              localStorage.setItem('obj', JSON.stringify({
                ...res.data.data,
                roleId: res.data.data.roleId,
                roleType: res.data.data.masterRoleType.roleType,
                userId: res.data.data.userId,
                userType: res.data.data.userType,
                communityId: res.data.data.communityId
              }))
              localStorage.setItem('tempuserobj', localStorage.getItem('obj'))
              self.getUserDeatils(res.data.data.userId)
            }, 500);
          }
        } catch (err) {
          console.log("Error::", err);
          var errorObj = {
            component: 'UserLogin',
            method: 'handleSubmit',
            error: err
          }
          logError(errorObj);
        }
      });
    } else {
      swal({
        title: t("Please enter the username and password"),
        icon: "warning",
        button: t("Ok"),
      })
    }

  };

  getUserDeatils(userId) {
    var param = {
      "communityId": localStorage.getItem("CommunityId"),
      "userId": userId
    }
    ApiServices.getUserProfile(param).then((res) => {
      if (res.status == 200) {
        if(res.data.data.profile && res.data.data.profile.nickName){
          signInAnonymously().then((s) => {
            auth().onAuthStateChanged((user) => {
              if (user) {
                user.updateProfile({
                  displayName: res.data.data.profile.nickName,
                }).then(function (s) {
                    console.log("updateProfile res>>", s);
                  }).catch(function (error) {
                    console.log("updateProfile error>>", error);
                  });
              }
            });
          }).catch((err) => console.log("err>>>", err));
        }
      }
      this.props.history.push("/layout");
    });
  }

  toggleVisibility() {
    this.setState({
      passwordVisibility: !this.state.passwordVisibility
    })
  }

  render() {
    const { t } = this.props;
    const { templateID } = this.props;
    return (
      <div className="gk-page getknowledgeable_page">

        {
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
        }      
            <Header></Header>
        <form
          id="chat-profile"
          onSubmit={this.handleSubmit}

        >

          <Grid container spacing={3} className="gridcontainer">
            <Grid item xs={12} className="profileformholder">
              <TextField
                id="standard-helperText"
                label={t("Enter username")}
                onChange={this.handleChangeName}
              />
            </Grid>
            <Grid item xs={12} className="profileformholder password-wrap">
              <TextField
                id="standard-helperText"
                label={t("Enter password")}
                type={this.state.passwordVisibility ? "text" : "password"}
                onChange={this.handleChangePassword}
              >
              </TextField>
              <Button className="toggle-pw-visibility"
                id="toggle-pw-visibility"
                onClick={this.toggleVisibility}
                style={this.state.passwordVisibility ? {} : { textDecoration: "line-through" }}
              >
                👁
              </Button>
            </Grid>
            <Grid item xs={12} className="profileformholder bg-transparent">
              <div className="text-center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                  className="profilesubmitbtn"
                >
                  {t('Login')}
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
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
    selectedComponentObj: storeState.componentObj,
  };
};

const transUserLogin = withTranslation()(UserLogin);
const themeUserLogin = withTheme(transUserLogin);
const routeUserLogin = withRouter(themeUserLogin);
export default connect(mapStateToProps, {})(routeUserLogin);
