import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { withTranslation, Trans } from "react-i18next";
import classnames from "classnames";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import imgUrl from "../../assets/images/imageUrl.js";
import { Link, useHistory, withRouter } from "react-router-dom";
import Services from "../../api/api";
import parse from 'html-react-parser';
import OffileDb from '../../config/pouchDB';
import Header from "./Header";
import { logError } from "../../helpers/auth.js";

class Wecomemsgpage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      WelcomeText: "",
      Icon: "",
      logovisible: false,
      headerLogo: imgUrl.logo,
      footerLogo: imgUrl.poweredby,
    };
    this.addGuestUser = this.addGuestUser.bind(this);
    this.getContent = this.getContent.bind(this);
  }
  componentDidMount() {
    OffileDb.setDatabase()
    this.getContent();
    this.getAppLogos();
  }
  getContent() {
    this.loadOfflineData()
    if (navigator.onLine) {
      var params = {
        "communityId": localStorage.getItem("CommunityId"),
        "contentId": 76,
        "languageId": localStorage.getItem("langId"),
      };
      console.log("getWelcomeContent param>>", params);
      Services.getStaticContent(params).then((res) => {
        try{
          if (res.data.status == 200) {
            this.setState({
              WelcomeText: res.data.data.contentList[0].description,
              Icon: res.data.data.contentList[0].icon,
            })
            OffileDb.setData('welcomepage', res.data.data)
          }
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'Welcomemesgpage',
            method: 'getContent',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }

  loadOfflineData() {
    var that = this
    OffileDb.getData('welcomepage').then(function (result) {
      if (result.status && result.status == 404) {
      } else {
        that.setState({
          WelcomeText: result.data.contentList[0].description,
          Icon: result.data.contentList[0].icon,
          isLoading: false
        });
      }
    });
  }

  getAppLogos() {
    var that = this
    if (navigator.onLine) {
      OffileDb.getData('applogos').then(function (result) {
        if (!result.status && result.status != 404  && result.data.data && result.data.data.isLogoVisible) {
          let hlogo = result.data.brandingDetails.filter(o => o.tagline == "headerlogo").map(o => o.icon)[0] || imgUrl.logo;
          let flogo = result.data.brandingDetails.filter(o => o.tagline == "footerlogo").map(o => o.icon)[0] || imgUrl.poweredby;
          let logovisiblee = result.data.data.isLogoVisible;
          console.log("logovisiblee::",logovisiblee)
          that.setState({
            headerLogo: hlogo,
            footerLogo: flogo,
            logovisible: logovisiblee,
          });
        }
      });
    }
  }

  addGuestUser() {
    console.log("addGuestUser>", uuidv4());
    let uuid = uuidv4();
    localStorage.setItem("deviceuuid", uuid);
    var param = {
      communicationDetails: {
        fcmId: localStorage.getItem('fcmToken')
      },
      communityId: localStorage.getItem("CommunityId"),
      deviceDetails: {
        serialNumber: uuid,
      },
      preferredLanguageId: localStorage.getItem("langId"),
    };
    console.log(JSON.stringify(param));
    Services.addApplicant(param).then((res) => {
      try{
        console.log("blank addApplicant", res);
        if (res.data.status == 200) {
          localStorage.setItem(
            "obj",
            JSON.stringify({
              roleId: res.data.data.roleId,
              roleType: res.data.data.roleType,
              userId: res.data.data.userId,
              userType: res.data.data.userType,
            })
          );
          this.props.history.push("/Thankspage1");
        }
      }catch(err){
        console.log("err::", err)
      }
    });
  }

  redirectToNextPage(){
    var self = this;
    var contentList = JSON.parse(localStorage.getItem('contentList'));
    console.log(contentList)
    if(contentList.filter(obj=> obj.contentId == 73 && obj.isactive).length > 0){
      if(contentList.filter(obj=> obj.contentId == 73 && obj.isactive && obj.viewType == "Vertical view").length > 0){
        self.props.history.push(`/OnboardingRegVertical`);
      } else {
        self.props.history.push(`/Onboardingslider`);
      }
    } else {
      //self.props.history.push(`/Onboardingslider`);
      this.addGuestUser();
    }
    // for(var i = 0; i < contentList.length; i++){
    //   if(contentList[i].contentId == 75 && contentList[i].isactive == true){
    //     self.props.history.push(`/Onboardingslider`);
    //     break;
    //   }
    // }
  }

  redirectToBackPage(){
    var self = this;
    var contentList = JSON.parse(localStorage.getItem('contentList'));
    console.log(contentList)
    if(contentList.filter(obj=> obj.contentId == 74 && obj.isactive).length > 0){
      self.props.history.push(`/tos1`);
    } else {
      // self.props.history.push(`/Onboarding`);
    }
  }

  render() {
    const { t } = this.props;
    const { templateID } = this.props;
    return (
      <div className="onboarding-page langpref-page fulllengthpage selectlangpage">
        <div className="gridcontainer">
          <Grid container spacing={3} className="gridcontainer">
          <Header></Header>

            <Grid item xs={12} className="onboardingsliderdivcontent2">
              <div className="welcomepage onboardingslider-container text-center">
                <p className="text-center mb-0 zero mt-60px">
                  {/* <img className="oneimpactlogoimg imgmiddle w-30percent animate__animated animate__zoomIn animate__faster"
                    src={this.state.Icon}
                  /> */}
                </p>
                {/* <h3 className="color-green text-center zero animate__animated animate__zoomIn animate__faster">
                  Welcome to the
                </h3> */}
                {/* <h3 className="color-green text-center zero animate__animated animate__zoomIn animate__faster"> */}
                {parse(this.state.WelcomeText)}
                {/* </h3> */}
                <p className=" text-center mt-60px mb-20px">
                  {/* Would you want to register? */}
                </p>
                <p className="text-center">
                  <Link onClick={() => this.redirectToNextPage({})}>
                    <Button
                      color="primary"
                      disableElevation
                      className= {templateID == 1 ? "login_btn color-white" : "getstarted-btn w-50percent color-white"}
                    >
                      {t('Next')}
                      {/* {this.state.ButtonText} */}
                    </Button>
                  </Link>
                </p>
                <p className="text-center">
                </p>
              </div>
            </Grid>
            {
          this.state.logovisible ? (
            <Grid item xs={12} className="stoptblogodiv w-100">
              <p className="text-center mb-0 powertext">
                {/* <img className="oneimpactlogoimg imgmiddle" src={this.state.footerLogo} /> */}
                <img className="oneimpactlogoimg imgmiddle hide" src={imgUrl.poweredby} />
                Powered by Dure Technologies
              </p>
            </Grid>
          ) : ("")
          }
          </Grid>
        </div>
      </div>
    );
  }
}

// export default Wecomemsgpage;
const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
};

export default connect(
  mapStateToProps,
  {}
)(withTranslation()(withRouter(Wecomemsgpage)));
