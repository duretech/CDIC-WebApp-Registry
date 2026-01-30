import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import classnames from "classnames";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Onboardingslider from "./Onboardingslider.js";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import imgUrl from "../../assets/images/imageUrl.js";
import { Link, useHistory, withRouter } from "react-router-dom";
import Services from "../../api/api";
import swal from "sweetalert";
import WifiOffIcon from "@material-ui/icons/WifiOff";
// import { parse } from '@babel/core';
import parse from "html-react-parser";
import OffileDb from "../../config/pouchDB";
import Header from "./Header";
import { logError } from "../../helpers/auth.js";

class Thankspage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      ThankyouTitle: "",
      ThankyouText: "",
      Icon: "",
      logovisible: false,
      headerLogo: imgUrl.logo,
      footerLogo: imgUrl.poweredby,
    };
    this.getContent = this.getContent.bind(this);
    this.syncOnlineData = this.syncOnlineData.bind(this);
  }

  componentDidMount() {
    OffileDb.setDatabase();
    this.getAppLogos();
    this.getContent();
  }

  getAppLogos() {
    if (navigator.onLine) {
      var param = {
        communityId: localStorage.getItem("CommunityId"),
      };
      Services.getCommunityBrandingByCommunityId(param).then((res) => {
        try {
          console.log(res);
          if (
            res.status == 200 &&
            res.data.data &&
            res.data.data.isLogoVisible
          ) {
            let hlogo =
              res.data.data.brandingDetails
                .filter((o) => o.tagline == "headerlogo")
                .map((o) => o.icon)[0] || imgUrl.logo;
            let flogo =
              res.data.data.brandingDetails
                .filter((o) => o.tagline == "footerlogo")
                .map((o) => o.icon)[0] || imgUrl.poweredby;
            let logovisiblee = res.data.data.isLogoVisible;
            console.log("logovisiblee::", logovisiblee);
            this.setState({
              headerLogo: hlogo,
              footerLogo: flogo,
              logovisible: logovisiblee,
            });
            OffileDb.setData("applogos", res.data.data);
          }
        } catch (err) {
          console.log("err::", err);
          var errorObj = {
            component: 'Thankspage',
            method: 'getAppLogos',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }

  syncOnlineData() {
    this.componentDidMount();
  }

  redirectToHome(flg) {
    const { t } = this.props;
    if (navigator.onLine) {
      console.log(flg);
      localStorage.setItem("isTourOpen", flg);
      this.props.history.push("/layout");
    } else {
      swal({
        text: t("Sorry you are offline"),
        icon: "warning",
        button: t("Ok"),
      }).then((val) => {});
    }
  }

  getContent() {
    this.loadOfflineData();
    if (navigator.onLine) {
      var params = {
        communityId: localStorage.getItem("CommunityId"),
        contentId: 75,
        languageId: localStorage.getItem("langId"),
      };
      console.log("getWelcomeContent param>>", params);
      Services.getStaticContent(params).then((res) => {
        try {
          if (res.data.status == 200) {
            //
            this.setState({
              ThankyouTitle: res.data.data.contentList[0].title,
              ThankyouText: res.data.data.contentList[0].description,
              Icon: res.data.data.contentList[0].icon,
            });
            OffileDb.setData("thankspage", res.data.data);
          }
        } catch (err) {
          console.log("err::", err);
          var errorObj = {
            component: 'Thankspage',
            method: 'getContent',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }

  loadOfflineData() {
    var that = this;
    OffileDb.getData("thankspage").then(function (result) {
      console.log(result);
      if (result.status && result.status == 404) {
      } else {
        that.setState({
          ThankyouTitle: result.data.contentList[0].title,
          ThankyouText: result.data.contentList[0].description,
          Icon: result.data.contentList[0].icon,
          isLoading: false,
        });
      }
    });
  }

  render() {
    const { t } = this.props;
    const { templateID } = this.props;
    return (
      <div className="onboarding-page langpref-page fulllengthpage selectlangpage">
        <div className="gridcontainer">
          <Grid container spacing={3} className="gridcontainer">
            <Header></Header>
            {navigator.onLine ? (
              <Grid
                item
                xs={12}
                className="thankspage onboardingsliderdivcontent2"
              >
                <div className="onboardingslider-container text-center">
                  <p className="text-center mb-0 zero mt-60px">
                    {/* <img className="oneimpactlogoimg imgmiddle w-30percent animate__animated animate__zoomIn animate__faster" src={this.state.Icon} /> */}
                  </p>

                  {/* <p className="zero text-center hide">Welcome to</p>
                <h3 className="color-green text-center zero animate__animated animate__zoomIn animate__faster">Thank you for your response.</h3>
                <p className=" text-center mt-60px mb-20px">We are ready to go!</p>
                <p className=" text-center">Would you like me to guide you through how the app works?</p>
                <p className="text-center"> */}
                  {parse(this.state.ThankyouTitle)}
                  {parse(this.state.ThankyouText)}
                  <div className="thanks-page-btn-div">
                    <p className="text-center">
                      <Button
                        onClick={(e) => this.redirectToHome(true)}
                        variant=""
                        color="primary"
                        disableElevation
                        className={
                          templateID == 1
                            ? "login_btn w-50percent color-white"
                            : "getstarted-btn w-50percent color-white"
                        }
                      >
                        <Trans> {t("Yes, please")} </Trans>
                      </Button>
                    </p>
                    <p className="text-center">
                      <Button
                        variant=""
                        onClick={(e) => this.redirectToHome(false)}
                        color="primary"
                        disableElevation
                        className={
                          templateID == 1
                            ? "login_btn w-50percent color-white"
                            : "getstarted-btn w-50percent color-white"
                        }
                      >
                        <Trans> {t("No, thanks")} </Trans>
                      </Button>
                    </p>
                  </div>
                </div>
              </Grid>
            ) : (
              <div className="no-internet" onClick={this.syncOnlineData}>
                <div className="offline-icon">
                  <WifiOffIcon />
                </div>
                <div className="offline-desc">
                  {t("You are in offline mode")}
                </div>
              </div>
            )}
            {this.state.logovisible ? (
              <Grid item xs={12} className="stoptblogodiv w-100">
                <p className="text-center mb-0 powertext">
                  {/* <img className="oneimpactlogoimg imgmiddle" src={this.state.footerLogo} /> */}
                  <img
                    className="oneimpactlogoimg imgmiddle hide"
                    src={imgUrl.poweredby}
                  />
                  Powered by Dure Technologies
                </p>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        </div>
      </div>
    );
  }
}

// export default withRouter(withTranslation()(Thankspage));
const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID:
      JSON.parse(localStorage.getItem("templateID")) != null
        ? JSON.parse(localStorage.getItem("templateID"))
        : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
};

export default connect(
  mapStateToProps,
  {}
)(withTranslation()(withRouter(Thankspage)));
