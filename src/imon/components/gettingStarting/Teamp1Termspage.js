import React, { Component } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
// import classnames from "classnames";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import parse from "html-react-parser";
// import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
// import Button from "@material-ui/core/Button";
import imgUrl from "../../assets/images/imageUrl.js";
import Services from "../../api/api";
// import { Link } from "react-router-dom";
// import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
// import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import swal from "sweetalert";
import OffileDb from "../../config/pouchDB";
// import Accordion from "@material-ui/core/Accordion";
// import AccordionDetails from "@material-ui/core/AccordionDetails";
// import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
// import FormLabel from "@material-ui/core/FormLabel";
// import Toolbar from "@material-ui/core/Toolbar";
// import Dialog from "@material-ui/core/Dialog";
// import CloseIcon from "@material-ui/icons/Close";
// import AppBar from "@material-ui/core/AppBar";
import Slide from "@material-ui/core/Slide";
// import MenuBookIcon from "@material-ui/icons/MenuBook";
// import ReceiptIcon from "@material-ui/icons/Receipt";
// import Loader from "../loaders/loader";
import { v4 as uuidv4 } from "uuid";
import "react-spring-bottom-sheet/dist/style.css";
import { logError } from "../../helpers/auth.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Termspage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      content: "",
      contentName: "",
      contentPolicy: "",
      contentNamePolicy: "",
      checked: false,
      checkedtos: false,
      headerLogo: imgUrl.logo,
      footerLogo: imgUrl.poweredby,
      expandedTos: true,
      expandedPolicy: false,
      activePolicy: true,
      openTermPopup: false,
      openPrivacyPopup: false,
      bottomSheetTOSRef: React.createRef(),
      bottomSheetPPRef: React.createRef(),
    };
  }

  componentDidMount() {
    OffileDb.setDatabase();
    this.getdata(localStorage.getItem("langId"));
    this.getdataPolicy(localStorage.getItem("langId"));
    this.getAppLogos();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.langId != localStorage.getItem("langId")) {
      this.getdata(nextProps.langId);
      this.getdataPolicy(nextProps.langId);
      // this.setState({ startTime: nextProps.startTime });
    }
  }

  handleCheck = (event, isInputChecked) => {
    this.setState({ checked: isInputChecked });
    this.props.handlePrivacyCheck(isInputChecked);
  };
  handleCheckTos = (event, isInputChecked) => {
    this.setState({ checkedtos: isInputChecked });
    this.props.handleCheckTos(isInputChecked);
  };

  getAppLogos() {
    var that = this;
    if (navigator.onLine) {
      OffileDb.getData("applogos").then(function (result) {
        if (!result.status && result.status != 404) {
          let hlogo =
            result.data.brandingDetails
              .filter((o) => o.tagline == "headerlogo")
              .map((o) => o.icon)[0] || imgUrl.logo;
          let flogo =
            result.data.brandingDetails
              .filter((o) => o.tagline == "footerlogo")
              .map((o) => o.icon)[0] || imgUrl.stoptblogo;
          that.setState({
            headerLogo: hlogo,
            footerLogo: flogo,
          });
        }
      });
    }
  }

  getdata(langId) {
    if (navigator.onLine) {
      var params = {
        communityId: localStorage.getItem("CommunityId"),
        contentId: 74,
        languageId: parseInt(langId),
      };

      Services.getStaticContent(params).then((res) => {
        try {
          this.setState({
            content: res.data.data.contentList[0].shortDesc,
            contentName: res.data.data.contentName,
            isLoading: false,
          });
          OffileDb.setData("tospage", res.data.data);
        } catch (err) {
          console.log("err::", err);
          var errorObj = {
            component: 'Teamp1Termspage',
            method: 'getdata',
            error: err
          }
          logError(errorObj);
        }
      });
    } else {
      this.loadOfflinetospageData();
    }
  }

  getdataPolicy(langId) {
    if (navigator.onLine) {
      var params = {
        communityId: localStorage.getItem("CommunityId"),
        contentId: 77,
        languageId: parseInt(langId),
      };

      Services.getStaticContent(params).then((res) => {
        try {
          console.log("getStaticContent::", res);
          this.setState({
            contentPolicy: res.data.data.contentList[0].shortDesc,
            contentNamePolicy: res.data.data.contentName,
            activePolicy: res.data.data.isactive,
            isLoading: false,
          });
          OffileDb.setData("policyContent", res.data.data);
        } catch (err) {
          console.log("err::", err);
          var errorObj = {
            component: 'Teamp1Termspage',
            method: 'getdataPolicy',
            error: err
          }
          logError(errorObj);
        }
      });
    } else {
      this.loadOfflinePolicyData();
    }
  }

  loadOfflinetospageData() {
    var that = this;
    OffileDb.getData("tospage").then(function (result) {
      console.log(result);
      if (result.status && result.status == 404) {
      } else {
        that.setState({
          content: result.data.contentList[0].shortDesc,
          contentName: result.data.contentName,
          isLoading: false,
        });
      }
    });
  }

  loadOfflinePolicyData() {
    var that = this;
    OffileDb.getData("policyContent").then(function (result) {
      console.log(result);
      if (result.status && result.status == 404) {
      } else {
        that.setState({
          contentPolicy: result.data.contentList[0].shortDesc,
          contentNamePolicy: result.data.contentName,
          activePolicy: result.data.data.isactive,
          isLoading: false,
        });
      }
    });
  }

  handleChange = (panel) => (event, isExpanded) => {
    this.setState({
      expandedTos: isExpanded ? true : false,
      expandedPolicy: false,
    });
  };
  handleChangePolicy = (panel) => (event, isExpanded) => {
    this.setState({
      expandedPolicy: isExpanded ? true : false,
      expandedTos: false,
    });
  };

  addGuestUser() {
    const { t } = this.props;
    if (navigator.onLine) {
      let uuid = uuidv4();
      localStorage.setItem("deviceuuid", uuid);
      var param = {
        communicationDetails: {
          fcmId: localStorage.getItem("fcmToken"),
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
        geoLocation: false,
      };
      if (window.cordova) {
        param.deviceDetails["uuid"] = window.device.uuid;
        param.deviceDetails["cordova"] = window.device.cordova;
        param.deviceDetails["manufacturer"] = window.device.manufacturer;
        param.deviceDetails["model"] = window.device.model;
        param.deviceDetails["platform"] = window.device.platform;
        param.deviceDetails["serialNumber"] = window.device.uuid;
        param.deviceDetails["version"] = window.device.version;
        localStorage.setItem("deviceuuid", window.device.uuid);
      }
      Services.addApplicant(param)
        .then((res) => {
          try {
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
          } catch (err) {
            console.log("err::", err);
            var errorObj = {
              component: 'Teamp1Termspage',
              method: 'addGuestUser',
              error: err
            }
            logError(errorObj);
          }
        })
        .catch((error) => {
          console.log("getRequest err>>", error);
          this.checkUserExist();
        });
    } else {
      swal({
        title: t("Unstable internet connection"),
        text: t("please check network connection"),
        icon: "success",
        button: t("Ok"),
      }).then((val) => {});
    }
  }

  checkUserExist(param) {
    if(navigator.onLine){
    if (window.cordova) {
      var para = {
        communityId: localStorage.getItem("CommunityId"),
        serialNumber: window.device.uuid, //param.deviceDetails.serialNumber,
      };
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
            this.props.history.push("/layout");
          }
        } catch (err) {
          console.log("err::", err);
          var errorObj = {
            component: 'Teamp1Termspage',
            method: 'checkUserExist',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }
  }

  resetFcmToken() {
    if (window.cordova && window.FCMPlugin) {
      window.FCMPlugin.getToken(function (token) {
        localStorage.setItem('fcmToken', token);
      });
    }
  }

  redirectToNextPage() {
    const { t } = this.props;
    if (this.state.checked && this.state.checkedtos) {
      var self = this;
      var contentList = JSON.parse(localStorage.getItem("contentList"));
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
        this.addGuestUser();
      }
    } else {
      swal({
        title: t("Please agree to the terms and policies"),
        icon: "warning",
        button: t("Ok"),
      });
    }
  }

  handleClickOpen = () => {
    this.setState({ openTermPopup: true });
  };

  handleClose = () => {
    this.setState({ openTermPopup: false });
  };



  handleClickPrivacyOpen = () => {
    try {
      setTimeout(function(){
        // replace anchor with onclick
        var link = document.querySelector('p a');
        if(link){
          link.setAttribute('onclick', 'redirectMe(' + JSON.stringify(link.href) + ')');
          // set href attribute to empty anchor (#)
          link.href = 'javascript:void(0);';
        }
      },500)
      this.setState({ openPrivacyPopup: true });    
    } catch (err) {
      console.log(err);
      var errorObj = {
        component: 'Teamp1Termspage',
        method: 'handleClickPrivacyOpen',
        error: err
      }
      logError(errorObj);
    }
  };


  handleClickPrivacyClose = () => {
    this.setState({ openPrivacyPopup: false });
  };

  render() {
    const { t } = this.props;
    let content = this.state.content;
    let contentPolicy = this.state.contentPolicy;


    return (
      <>
        <Grid container spacing={0} className="gridcontainer px-30px ">
          <Grid item xs={12} className="mt-20px">
            <div className="tosbtnholder">
              <div>
                {/* <p onClick={this.handleClickOpen} className="tostitletext"> */}
                {/* <MenuBookIcon /> <span>{t('Terms of services')}</span> </p> */}

                {/* <Dialog
                  fullScreen
                  open={this.state.openTermPopup}
                  onClose={this.handleClose}
                  TransitionComponent={Transition}
                >
                  <AppBar className="modal-header">
                    <Toolbar>
                      <Typography variant="h6">
                        <span>{t("Terms of services")}</span>
                      </Typography>
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.handleClose}
                        aria-label="close"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar>
                  <Typography className="px-30px mt-60px tos-content modal-content">
                    {parse(content)}
                  </Typography>
                </Dialog> */}

                <BottomSheet
                  open={this.state.openTermPopup}
                  onDismiss={this.handleClose}
                  ref={this.state.bottomSheetTOSRef}
                  defaultSnap={({ maxHeight }) => maxHeight}
                  snapPoints={({ maxHeight }) => [
                    maxHeight - maxHeight / 10,
                    maxHeight / 4,
                    maxHeight * 0.6,
                  ]}
                >
                  {/* <AppBar className="modal-header">
                    <Toolbar>
                      <Typography variant="h6">
                        <span>{t("Terms of services")}</span>
                      </Typography>
                      {/* <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.handleClose}
                        aria-label="close"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar> */}
                  <span className="tos_header">{t("Terms of services")}</span>
                  <Typography className="tos-content modal-content">
                    {parse(content)}
                  </Typography>
                </BottomSheet>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="tosbtnholder">
              <div>
                {/* <p onClick={this.handleClickPrivacyOpen} className="tostitletext">
                  <ReceiptIcon />  <span>{t('Privacy Policy')}</span>
                </p> */}
                {/* <Dialog
                  fullScreen
                  open={this.state.openPrivacyPopup}
                  onClose={this.handleClickPrivacyClose}
                  TransitionComponent={Transition}
                >
                  <AppBar className="modal-header">
                    <Toolbar>
                      <Typography variant="h6">
                        <span>{t("Privacy Policy")}</span>
                      </Typography>
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.handleClickPrivacyClose}
                        aria-label="close"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar>
                  <Typography className="px-30px mt-60px privacy-content modal-content">
                    {parse(contentPolicy)}
                  </Typography>
                </Dialog> */}

                <BottomSheet
                  open={this.state.openPrivacyPopup}
                  onDismiss={this.handleClickPrivacyClose}
                  ref={this.state.bottomSheetPPRef}
                  defaultSnap={({ maxHeight }) => maxHeight}
                  initialFocusRef={false}
                  snapPoints={({ maxHeight }) => [
                    maxHeight - maxHeight / 10,
                    maxHeight / 4,
                    maxHeight * 0.6,
                  ]}
                >
                  {/* <AppBar className="modal-header">
                    <Toolbar>
                      <Typography variant="h6">
                        <span>{t("Privacy Policy")}</span>
                      </Typography>
                      {/* <IconButton
                        edge="start"
                        color="inherit"
                        onClick={this.handleClickPrivacyClose}
                        aria-label="close"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar> */}
                  <span className="tos_header">{t("Privacy Policy")}</span>
                  <Typography className="privacy-content modal-content">
                    {parse(contentPolicy)}
                  </Typography>
                </BottomSheet>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} className="privacy_links_holder">
            <div className="ml-10px">
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        color="primary"
                        checked={this.state.checkedtos}
                        onChange={this.handleCheckTos}
                      />
                    }
                    label={t("I agree to the")}
                    labelPlacement="end"
                  />
                  <span onClick={this.handleClickOpen} className="TOStext">
                    {t("Terms of Services")}
                  </span>
                </FormGroup>
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        color="primary"
                        checked={this.state.checked}
                        onChange={this.handleCheck}
                      />
                    }
                    label={t("I agree to the")}
                    labelPlacement="end"
                  />
                  <span
                    onClick={this.handleClickPrivacyOpen}
                    className="TOStext"
                  >
                    {t("Privacy Policy")}
                  </span>
                </FormGroup>
              </FormControl>
            </div>
          </Grid>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
};

let newTos = withTranslation()(Termspage);
export default connect(mapStateToProps, {})(newTos);

//export default Termspage;
