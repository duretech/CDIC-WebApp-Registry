import React, { lazy, Suspense, Component } from "react";
import { withTranslation, Trans } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Langpref from "./Langpref";
import imgUrl from "../../assets/images/imageUrl.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Services from "../../api/api";
import OffileDb from '../../config/pouchDB';
import Loader from "../loaders/loader";
import LockIcon from '@material-ui/icons/Lock';
import { v4 as uuidv4 } from "uuid";
import swal from "sweetalert";
import Header from "./Header";
import { settemplateID } from "../../redux/actions/appActions";
import Teamp1Termspage from './Teamp1Termspage';
// import ThemeSwitcher from "../ThemeSwitcher";
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
// import { signInAnonymously } from "../../helpers/auth";
// import { auth } from "../../service/firebase";
import Forceupdate from "./Forceupdate";
import WifiOffIcon from '@material-ui/icons/WifiOff';
import { logError } from "../../helpers/auth";

// const Forceupdate = lazy(() => import('./Forceupdate'));
// const Langpref = lazy(() => import('./Langpref'));
// const Header = lazy(() => import('./Header'));
// const Teamp1Termspage = lazy(() => import('./Teamp1Termspage'));



class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      templateID: props.templateID,
      appversion: "1.0.0",
      headerLogo: imgUrl.logo,
      footerLogo: imgUrl.poweredby,
      brandaing: [],
      headerBackButton: false,
      checkTosVal: false,
      checkedPrivacy: false,
      logovisible: false,
      contentList: null,
      assistedmodelflag: false
    };
    this.handleCheckTos = this.handleCheckTos.bind(this);
    this.handlePrivacyCheck = this.handlePrivacyCheck.bind(this);
    this.facilitatorLogin = this.facilitatorLogin.bind(this);
    this.syncOnlineData = this.syncOnlineData.bind(this);
    this.clearAllData = this.clearAllData.bind(this);
    this.getAssistedModelFlag = this.getAssistedModelFlag.bind(this)
  }


  componentDidMount() {
    OffileDb.setDatabase()
    gaLogEvent("Get onboarded", '', '');
    gaLogScreen("Onboarding");
    //this.getCommunityPrefrence()
    //this.getTemplateID()
    let newcom = localStorage.getItem("NewCommunityId");
    let newurl = localStorage.getItem('NewServiceUrl');
    if (newcom == "true" || newurl == "true") {
      // this.props.history.push("/Onboarding");
      this.clearAllData();

    }
    let deviceuuid = localStorage.getItem('deviceuuid');
    localStorage.removeItem("firstBleeding");
    if (!localStorage.getItem('BotInnit')) {
      localStorage.setItem('BotInnit', "false");
    }
    localStorage.setItem('isGreeted', "false");
    let userObj = localStorage.getItem('obj');
    if (deviceuuid && userObj) {
      this.props.history.push("/layout");
    } else {
      // this.checkUserExist()
    }
    // this.getAppVersion();
    this.getAppLogos();
    this.getContentListByCommunityId();
    //this.checkAuthUser();
    this.getAssistedModelFlag();
    const CommunityId = localStorage.getItem('CommunityId');
    if (CommunityId) {
      this.setState({ headerBackButton: true })
    } else {
      this.setState({ headerBackButton: false })
    }
    this.onActiveInternet();
    if (window.cordova && window.cordova.platformId == 'ios') {
      var body = document.body;
      body.classList.add("ios");
      window.cutout.has()
        .then(function (result) {
          if (result) {
            var body = document.body;
            body.classList.add("iphone");
          }
        });
    }
  }

  onActiveInternet() {
    var that = this;
    if (window.cordova) {
      document.addEventListener('deviceready', function () {
        document.addEventListener("online", function () {
          if (navigator.onLine && window.location.hash == '#/Onboarding') {
            window.location.reload();
          }
        }, false);
        document.addEventListener("offline", function () {
          setTimeout(function () {
            that.setState({ isLoading: false })
          }, 500);
        }, false);
      })
    }
  }

  clearAllData() {
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


  // checkAuthUser() {
  //   if(navigator.onLine){
  //     var self = this;
  //     var FBuser = JSON.parse(localStorage.getItem('FBuser'))
  //     let user = auth().currentUser
  //     if (user == null && FBuser != null) {
  //       signInAnonymously().then((res) => {
  //         auth().onAuthStateChanged((user) => {
  //           console.log("updateProfile error>>", user);
  //           if (user) {
  //             user.updateProfile({
  //               displayName: FBuser != null ? FBuser.displayName : "",
  //               photoURL: FBuser != null ? FBuser.photoURL : "",
  //               uid: FBuser != null ? FBuser.uid : user.uid,
  //             }).then(function (res) {
  //               console.log("updateProfile error>>", res);
  //             }).catch(function (error) {
  //               console.log("updateProfile error>>", error);
  //             });
  //           } else {
  //             console.log("error>>", user);
  //           }
  //         });
  //       }).catch((err) => console.log("err>>>", err));
  //     }
  //   }
  // }

  getCommunityPrefrence() {
    if (navigator.onLine) {
      var para = { "communityId": localStorage.getItem("CommunityId"), }
      Services.getCommunitySectionLinking(para).then((res) => {
        try {
          console.log(res.data)
          if (res && res.data && res.data.status == 200 && res.data.data.length > 0) {
            console.log(res.data.data[0].keyValueMap)
            if (Object.keys(res.data.data[0].keyValueMap).length > 0) {
              this.applyThemeColor(res.data.data[0].keyValueMap)
              OffileDb.setData('themeColor', res.data.data[0].keyValueMap)
            }
            this.setState({ isLoading: false });
          } else {
            this.setState({ isLoading: false });
          }
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'Onboarding',
            method: 'getCommunityPrefrence',
            error: err
          }
          logError(errorObj);
        }
      })
    }
  }

  applyThemeColor(colorObj) {
    console.log(colorObj)
    var r = document.querySelector(':root');
    for (var key in colorObj) {
      r.style.setProperty('--' + key, colorObj[key]);
    }
  }

  getTemplateID() {
    if (navigator.onLine) {
      var para = {
        "communityId": localStorage.getItem("CommunityId"),
      }
      console.log("getTemplateID para::", para)
      Services.getTemplatesByCommunityId(para).then((res) => {
        try {
          if (res && res.data && res.data.status == 200 && res.data.data && res.data.data.templateList.length > 0) {
            var tempid = res.data.data.templateList.filter(obj => obj.isDefault)
            console.log(tempid)
            if (tempid.length > 0 && tempid[0].templateId != this.props.templateID) {
              this.setState({ templateID: tempid[0].templateId });
              this.props.settemplateID(tempid[0].templateId)
              localStorage.setItem('templateID', tempid[0].templateId);
              document.getElementsByTagName("body")[0].setAttribute("data-theme", tempid[0].templateId == 1 ? 'template1' : 'template2');
            }
            this.setState({ isLoading: false });
          } else {
            this.setState({ isLoading: false });
          }
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'Onboarding',
            method: 'getTemplateID',
            error: err
          }
          logError(errorObj);
        }
      })
    } else {
      this.setState({ isLoading: false });
    }
  }

  checkUserExist(param) {
    if (navigator.onLine) {
      if (window.cordova) {
        var para = {
          "communityId": localStorage.getItem("CommunityId"),
          "serialNumber": window.device.uuid //param.deviceDetails.serialNumber,
        }
        Services.checkIfApplicantExists(para).then((res) => {
          try {
            if (res && res.data.status == 200) {
              localStorage.setItem(
                "obj",
                JSON.stringify({
                  roleId: res.data.data.roleId,
                  roleType: res.data.data.roleType,
                  userId: res.data.data.userId,
                  userType: res.data.data.userType,
                })
              );
              localStorage.setItem("deviceuuid", window.device.uuid);
              this.props.history.push("/Thankspage1");
            }
          } catch (err) {
            console.log("err::", err)
            var errorObj = {
              component: 'Onboarding',
              method: 'checkUserExist',
              error: err
            }
            logError(errorObj);
          }
        })
      }
    }
  }

  getAppVersion() {
    var param = {
      id: localStorage.getItem("CommunityId"),
    };
    if (navigator.onLine) {
      Services.getAppVersion(param).then((res) => {
        try {
          this.setState({ appversion: res.data.data.appVersion });
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'Onboarding',
            method: 'getAppVersion',
            error: err
          }
          logError(errorObj);
        }
      })
    }
  }

  getAppLogos() {
    if (navigator.onLine) {
      var param = {
        communityId: localStorage.getItem("CommunityId"),
      };
      Services.getCommunityBrandingByCommunityId(param).then((res) => {
        try {
          console.log(res)
          if (res.status == 200 && res.data.data && res.data.data.isLogoVisible) {
            let hlogo = res.data.data.brandingDetails.filter(o => o.tagline == "headerlogo").map(o => o.icon)[0] || imgUrl.logo;
            let flogo = res.data.data.brandingDetails.filter(o => o.tagline == "footerlogo").map(o => o.icon)[0] || imgUrl.poweredby;
            let logovisiblee = res.data.data.isLogoVisible;
            console.log("logovisiblee::", logovisiblee)
            this.setState({
              headerLogo: hlogo,
              footerLogo: flogo,
              logovisible: logovisiblee,
              isLoading: false
            });
            OffileDb.setData('applogos', res.data.data)
          }
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'Onboarding',
            method: 'getAppLogos',
            error: err
          }
          logError(errorObj);
        }
      })
    }
  }
  getContentListByCommunityId() {
    if (navigator.onLine) {
      var param = {
        communityId: localStorage.getItem("CommunityId"),
      };
      Services.contentListByCommunityId(param).then((res) => {
        try {
          console.log(res)
          if (res.status == 200) {
            console.log("contentListByCommunityId::", res.data.data.contentTypeList);
            var tempobj = res.data.data.contentTypeList;
            this.setState({ contentList: tempobj })
            localStorage.setItem('contentList', JSON.stringify(tempobj))
          }
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'Onboarding',
            method: 'getContentListByCommunityId',
            error: err
          }
          logError(errorObj);
        }
      })
    } else {

    }
  }

  addGuestUser() {
    const { t } = this.props;
    if (navigator.onLine) {
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
        profile: {
          location: {
            coordinates: [this.state.lat, this.state.lng],
            type: "point",
          },
        },
        preferredLanguageId: localStorage.getItem("langId"),
        geoLocation: false
      };
      if (window.cordova) {
        param.deviceDetails['uuid'] = window.device.uuid
        param.deviceDetails['cordova'] = window.device.cordova
        param.deviceDetails['manufacturer'] = window.device.manufacturer
        param.deviceDetails['model'] = window.device.model
        param.deviceDetails['platform'] = window.device.platform
        param.deviceDetails['serialNumber'] = window.device.uuid
        param.deviceDetails['version'] = window.device.version
        localStorage.setItem("deviceuuid", window.device.uuid);
      }
      Services.addApplicant(param).then((res) => {
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
          var contentList = JSON.parse(localStorage.getItem('contentList'));
          if (contentList.filter(obj => obj.contentId == 75 && obj.isactive).length > 0) {
            this.props.history.push("/Thankspage1");
          } else {
            this.props.history.push("/Thankspage1");
            //this.props.history.push("/layout");
          }
        }

      }).catch((error) => {
        console.log("getRequest err>>", error);
        this.checkUserExist()
      });
    } else {
      swal({
        title: t("Unstable Internet Connection"),
        text: t("Please check network connection"),
        icon: "success",
        button: t("Ok"),
      }).then((val) => {
      });
    }
  }

  handleCheckTos(val) {
    console.log(val)
    this.setState({ checkTosVal: val })
  }


  handlePrivacyCheck(val) {
    console.log(val)
    this.setState({ checkedPrivacy: val })
  }

  checkTosVal() {
    const { t } = this.props;
    const { templateID } = this.props;
    var contentList = JSON.parse(localStorage.getItem('contentList'));
    // if (templateID != 2) {
    //   this.redirectToNextPage()
    // } else {
    if (contentList && contentList.filter(obj => obj.contentId == 74 && obj.isactive).length > 0) {
      if (this.state.checkTosVal && this.state.checkedPrivacy) {
        this.redirectToNextPage()
      } else {
        swal({
          title: t(this.getErrrmsg()),
          icon: "warning",
          button: t("Ok")
        })
      }
    } else {
      this.redirectToNextPage()
    }
    //}
  }


  getErrrmsg() {
    if (!this.state.checkedPrivacy && !this.state.checkTosVal) {
      return 'Please agree to the terms of service and privacy policy'
    } else if (!this.state.checkedPrivacy) {
      return 'Please agree to the privacy policy'
    } else {
      return 'Please agree to the terms of service'
    }
  }

  // redirectToNextPage() {
  //   var self = this;
  //   const { templateID } = this.props;
  //   var contentList = JSON.parse(localStorage.getItem('contentList'));
  //   if (templateID != 2) {
  //     if (contentList.filter(obj => obj.contentId == 74 && obj.isactive).length > 0) {
  //       self.props.history.push(`/tos1`);
  //     } else if (contentList.filter(obj => obj.contentId == 76 && obj.isactive).length > 0) {
  //       self.props.history.push(`/Welcomemsgpage1`);
  //     } else if (contentList.filter(obj => obj.contentId == 73 && obj.isactive).length > 0) {
  //       if (contentList.filter(obj => obj.contentId == 73 && obj.isactive && obj.viewType == "Vertical view").length > 0) {
  //         self.props.history.push(`/OnboardingRegVertical`);
  //       } else {
  //         self.props.history.push(`/Onboardingslider`);
  //       }
  //     } else {
  //       this.addGuestUser();
  //     }
  //   } else {
  //     if (contentList.filter(obj => obj.contentId == 76 && obj.isactive).length > 0) {
  //       self.props.history.push(`/Welcomemsgpage1`);
  //     } else if (contentList.filter(obj => obj.contentId == 73 && obj.isactive).length > 0) {
  //       if (contentList.filter(obj => obj.contentId == 73 && obj.isactive && obj.viewType == "Vertical view").length > 0) {
  //         self.props.history.push(`/OnboardingRegVertical`);
  //       } else {
  //         self.props.history.push(`/Onboardingslider`);
  //       }
  //     } else {
  //       //self.props.history.push(`/Onboardingslider`);
  //       this.addGuestUser();
  //     }
  //   }
  // }

  redirectToNextPage() {
    var self = this;
    const { templateID } = this.props;
    var contentList = JSON.parse(localStorage.getItem("contentList"));
    if (templateID != 1) {
      if (
        contentList.filter((obj) => obj.contentId == 74 && obj.isactive)
          .length > 0
      ) {
        self.props.history.push(`/OnboardingRegVertical`);
      } else if (
        contentList.filter((obj) => obj.contentId == 76 && obj.isactive)
          .length > 0
      ) {
        self.props.history.push(`/Welcomemsgpage1`);
      } else if (
        contentList.filter((obj) => obj.contentId == 73 && obj.isactive)
          .length > 0
      ) {
        if (
          contentList.filter(
            (obj) =>
              obj.contentId == 73 &&
              obj.isactive &&
              obj.viewType == "Vertical view"
          ).length > 0
        ) {
          self.props.history.push(`/OnboardingRegVertical`);
        } else {
          self.props.history.push(`/Onboardingslider`);
        }
      } else {
        this.addGuestUser();
      }
    } else {
      if (
        contentList.filter((obj) => obj.contentId == 76 && obj.isactive)
          .length > 0
      ) {
        self.props.history.push(`/Welcomemsgpage1`);
      } else if (
        contentList.filter((obj) => obj.contentId == 73 && obj.isactive)
          .length > 0
      ) {
        if (
          contentList.filter(
            (obj) =>
              obj.contentId == 73 &&
              obj.isactive &&
              obj.viewType == "Vertical view"
          ).length > 0
        ) {
          self.props.history.push(`/OnboardingRegVertical`);
        } else {
          self.props.history.push(`/Onboardingslider`);
        }
      } else {
        //self.props.history.push(`/Onboardingslider`);
        this.addGuestUser();
      }
    }
  }

  facilitatorLogin() {
    console.log("facilitatorLogin")
    this.props.history.push(`/Userlogin`);
  }

  syncOnlineData() {
    this.componentDidMount();
  }

  getAssistedModelFlag() {
    if (navigator.onLine) {
      var param = {
        communityId: localStorage.getItem("CommunityId"),
      };
      Services.getAssistedModelFlag(param).then((res) => {
        try {
          console.log(res)
          if (res.status == 200) {

            this.setState({
              assistedmodelflag: res.data.data,
              isLoading: false
            })

          }
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'Onboarding',
            method: 'getAssistedModelFlag',
            error: err
          }
          logError(errorObj);
        }
      })
    }
  }

  render() {
    const { t } = this.props;
    const { templateID } = this.props;
    var contentList = this.state.contentList
    console.log(this.state.isLoading)
    let templateid = localStorage.getItem('templateID')
    return (
      <>
        {this.state.isLoading ? (
          <>
            <Loader isLoading={this.state.isLoading} />
            {/* <ThemeSwitcher chnageTheme={this.state.templateID} showcontent={false}></ThemeSwitcher> */}
          </>
        ) : (
          <div className="onboarding-page langpref-page fulllengthpage selectlangpage">
            <div className="gridcontainer">
              <Forceupdate />
              <Grid container spacing={3} className="gridcontainer">
                <Header></Header>

                {navigator.onLine == false ? (
                  <div className="no-internet" onClick={this.syncOnlineData}>
                    <div className="offline-icon"><WifiOffIcon /></div>
                    <div className="offline-desc">{t("You are in offline mode")}</div>
                  </div>
                ) : (
                  <Grid item xs={12} className="onboardingsliderdivcontent">
                    {
                      this.state.assistedmodelflag ? (
                        <div className="onborardlogin" id="iboxlogin">
                          <Link title="Forgot Password" onClick={this.facilitatorLogin}>
                            <span><Trans> {t("Login for iBox")}</Trans></span><LockIcon fontSize="large" /></Link>
                        </div>
                      ) : ("")
                    }
                    {
                      templateID == 1 || templateID == 2 ? (
                        <Grid item xs={12} className="langdivholder">
                          <div className="px-30px">
                            <h4 className="text-left zero color-darkblue fw-500"><Trans> {t("Please Select Language")} </Trans></h4>
                          </div>
                          <Langpref></Langpref>
                        </Grid>
                      ) : (
                        <Langpref ></Langpref>

                      )
                    }
                    {templateID == 1 &&
                      contentList &&
                      contentList.filter(
                        (obj) => obj.contentId == 74 && obj.isactive
                      ).length > 0 && (
                        <Teamp1Termspage
                          handleCheckTos={this.handleCheckTos}
                          handlePrivacyCheck={this.handlePrivacyCheck}
                        ></Teamp1Termspage>
                      )}
                    {
                      templateID == 2 && contentList && contentList.filter(obj => obj.contentId == 74 && obj.isactive).length > 0 && (
                        <Teamp1Termspage handleCheckTos={this.handleCheckTos} handlePrivacyCheck={this.handlePrivacyCheck} ></Teamp1Termspage>
                      )
                    }
                  </Grid>
                )}
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
                <Grid item xs={12} className="text-center skipbtnholder zero">
                  <div className="getstarted-btn-holder">
                    {navigator.onLine ? (
                      <Link onClick={() => this.checkTosVal({})}>
                        <Button
                          color="primary"
                          disableElevation
                          className="login_btn animate__animated animate__backInUp animate__faster getstarted-btn"
                        >
                          <Trans> {t("Submit")} </Trans>
                        </Button>
                      </Link>) : ('')
                    }
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        )
        }
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
    selectedComponentObj: {},
  };
};

// const ThemeKnowYourRights = withTheme(KnowYourRights);
// const FinalThemeKnowYourRights = withStyles(useStyles)(ThemeKnowYourRights);
//const routeSettings = withRouter(Settings);
//export default connect(mapStateToProps, {})(routeSettings);

//let themeSwitcherOnboarding = useThemeSwitcher(Onboarding)
let routeOnboarding = withRouter(Onboarding)
let transonboarding = withTranslation()(routeOnboarding);
export default connect(mapStateToProps, { settemplateID })(transonboarding);

