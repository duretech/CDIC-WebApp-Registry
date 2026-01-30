import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withTranslation, Trans } from "react-i18next";
import parse from 'html-react-parser';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import imgUrl from '../../assets/images/imageUrl.js';
import Services from '../../api/api';
import { Link } from 'react-router-dom'
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from '@material-ui/core/Checkbox';
import swal from "sweetalert";
import OffileDb from '../../config/pouchDB';
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Loader from "../loaders/loader";
import { v4 as uuidv4 } from "uuid";
import { logError } from '../../helpers/auth.js';


class Termspage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      content: '',
      contentName: '',
      contentPolicy: '',
      contentNamePolicy: '',
      checked: true,
      checkedtos: true,
      headerLogo: imgUrl.logo,
      footerLogo: imgUrl.poweredby,
      expandedTos: true,
      expandedPolicy: false,
      activePolicy: true,
    }
  }

  componentDidMount() {
    OffileDb.setDatabase();
    this.getdata();
    this.getdataPolicy();
    this.getAppLogos();
  };
  handleCheck = (event, isInputChecked) => {
    this.setState({ checked: isInputChecked })
  }
  handleCheckTos = (event, isInputChecked) => {
    this.setState({ checkedtos: isInputChecked })
  }


  getAppLogos() {
    var that = this
    if (navigator.onLine) {
      OffileDb.getData('applogos').then(function (result) {
        if (!result.status && result.status != 404) {
          let hlogo = result.data.brandingDetails.filter(o => o.tagline == "headerlogo").map(o => o.icon)[0] || imgUrl.logo;
          let flogo = result.data.brandingDetails.filter(o => o.tagline == "footerlogo").map(o => o.icon)[0] || imgUrl.stoptblogo;
          that.setState({
            headerLogo: hlogo,
            footerLogo: flogo
          });
        }
      });
    }
  }

  getdata() {
    if (navigator.onLine) {
      var params = {
        "communityId": localStorage.getItem("CommunityId"),
        "contentId": 74,
        "languageId": parseInt(localStorage.getItem("langId")),
      }


      Services.getStaticContent(params).then(res => {
        try{
          this.setState({
            content: res.data.data.contentList[0].shortDesc,
            contentName: res.data.data.contentName,
            isLoading: false
          })
          OffileDb.setData('tospage', res.data.data)
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'Termspage',
            method: 'getdata',
            error: err
          }
          logError(errorObj);
        }
      })
    } else {
      this.loadOfflinetospageData()
    }
  }
  getdataPolicy() {

    if (navigator.onLine) {
      var params = {
        "communityId": localStorage.getItem("CommunityId"),
        "contentId": 77,
        "languageId": parseInt(localStorage.getItem("langId")),
      }

      Services.getStaticContent(params).then(res => {
        try{
          console.log(res)
          this.setState({
            contentPolicy: res.data.data.contentList[0].shortDesc,
            contentNamePolicy: res.data.data.contentName,
            activePolicy: res.data.data.isactive,
            isLoading: false
          })
          OffileDb.setData('policyContent', res.data.data)
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'Termspage',
            method: 'getdataPolicy',
            error: err
          }
          logError(errorObj);
        }
      })
    } else {
      this.loadOfflinePolicyData()
    }
  }

  loadOfflinetospageData() {
    var that = this
    OffileDb.getData('tospage').then(function (result) {
      console.log(result)
      if (result.status && result.status == 404) {
      } else {
        that.setState({
          content: result.data.contentList[0].shortDesc,
          contentName: result.data.contentName,
          isLoading: false
        });
      }
    });
  }

  loadOfflinePolicyData() {
    var that = this
    OffileDb.getData('policyContent').then(function (result) {
      console.log(result)
      if (result.status && result.status == 404) {
      } else {
        that.setState({
          contentPolicy: result.data.contentList[0].shortDesc,
          contentNamePolicy: result.data.contentName,
          activePolicy: result.data.data.isactive,
          isLoading: false
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
      expandedTos: false
    });
  };

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
        try{
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
          var errorObj = {
            component: 'Termspage',
            method: 'addGuestUser',
            error: err
          }
          logError(errorObj);
        }
      }).catch((error) => {
        console.log("getRequest err>>", error);
        this.checkUserExist()
      });
    } else {
      swal({
        title: t("Unstable internet connection"),
        text: t("please check network connection"),
        icon: "success",
        button: t("Ok"),
      }).then((val) => {
      });
    }
  }

  checkUserExist(param) {
    if(navigator.onLine){
    if (window.cordova) {
      var para = {
        "communityId": localStorage.getItem("CommunityId"),
        "serialNumber": window.device.uuid //param.deviceDetails.serialNumber,
      }
      Services.checkIfApplicantExists(para).then((res) => {
        try{
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
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'Termspage',
            method: 'checkUserExist',
            error: err
          }
          logError(errorObj);
        }
      })
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
      var contentList = JSON.parse(localStorage.getItem('contentList'));
        if(contentList.filter(obj=> obj.contentId == 76 && obj.isactive).length > 0) {
          self.props.history.push(`/Welcomemsgpage1`);
        } else if(contentList.filter(obj=> obj.contentId == 73 && obj.isactive).length > 0){
          if(contentList.filter(obj=> obj.contentId == 73 && obj.isactive && obj.viewType == "Vertical view").length > 0){
            self.props.history.push(`/OnboardingRegVertical`);
          } else {
            self.props.history.push(`/Onboardingslider`);
          }
        } else {
          //self.props.history.push(`/Onboardingslider`);
          this.addGuestUser();
        }
          
      // for (var i = 0; i < contentList.length; i++) {
      //   console.log(contentList[i])
      //   if (contentList[i].contentId == 76 && contentList[i].isactive == true) {
      //     //self.props.history.push(`/Welcomemsgpage1`);
      //     break;
      //   } else if (contentList[i].contentId == 75 && contentList[i].isactive == true) {
      //     //self.props.history.push(`/Onboardingslider`);
      //     break;
      //   } else if ((contentList[i].contentId == 75 && contentList[i].isactive == false) || contentList[i].contentId == 73 && contentList[i].isactive == false) {
      //     //this.addGuestUser();
      //     break;
      //   }
      // }
    } else {
      swal({
        title: t("Please agree to the terms and policies"),
        icon: "warning",
        button: t("Ok")
      })
    }
  }

  render() {
    const { t } = this.props;
    let content = this.state.content;
    let contentPolicy = this.state.contentPolicy;

    return (
      <div className="onboarding-page">
        <div className="gridcontainer tospageconetainer">
          <Grid container spacing={3} className="gridcontainer">
            <Grid item xs={12} className="zero">
              <div className="onboardingheaderdiv homepageheaderdiv">
                <Grid container spacing={3} className="gridcontainer">
                  <Grid item xs={1} className="zero">
                    <Link to="/">
                      <IconButton
                        edge="start"
                        className="menubtn"
                        color="inherit"
                        aria-label="menu"
                      >
                        <ArrowBackIosIcon />
                      </IconButton>
                    </Link>
                  </Grid>
                  <Grid item xs={10} className="zero">
                    <p className="zero text-center">
                      <img className="oneimpactlogoimg" src={this.state.headerLogo} />
                    </p>
                  </Grid>
                  <Grid item xs={1} className="zero"></Grid>
                </Grid>
                {/* <p className="getonboardedtext text-center">
                <Trans> {t("Qos")}  </Trans>
              </p> */}
                <p className="zero text-center">&nbsp;</p>

                <div className="custom-shape-divider-bottom-1599722124">
                  <svg
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
                      className="shape-fill"
                    ></path>
                  </svg>
                </div>
              </div>
            </Grid>

            {/* <Grid item xs={12} className="termsdivcontent">
              {parse(content)}
            </Grid> */}
            {!this.state.isLoading ? (
              <div className="accordian-container" style={{ marginBottom: "155px" }}>
                <Accordion
                  className="accordian-detail"
                  key={1}
                  expanded={this.state.expandedTos}
                  onChange={this.handleChange('panel1')}
                  style={{ margin: "10px" }}
                // onClick={() => this.handleOnClickAccordian(knowledgeObj, index)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    className="gklistdetails-accordion-headerlink"
                  >
                    <Typography className="gklistdetails-accordion-header">
                      {/* <span>{this.state.contentName}</span> */}
                      <span>{t('Terms of Services')}</span>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="gklistdetails-summary termpage-deatils">
                    <Typography>
                      {parse(content)}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                {
                  this.state.activePolicy ? (
                    <Accordion
                      className="accordian-detail"
                      key={1}
                      expanded={this.state.expandedPolicy}
                      onChange={this.handleChangePolicy('panel2')}
                      style={{ margin: "10px", marginBottom: "53px" }}
                    // onClick={() => this.handleOnClickAccordian(knowledgeObj, index)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        className="gklistdetails-accordion-headerlink"
                        style={{ marginBottom: '57px' }}
                      >
                        <Typography className="gklistdetails-accordion-header">
                          <span>{t('Privacy Policy')}</span>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails className="gklistdetails-summary termpage-deatils">
                        <Typography>
                          {parse(contentPolicy)}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ) : ('')
                }

              </div>
            ) : (
                <Loader isLoading={this.state.isLoading} />
              )}


            <Grid item xs={12} className="tosPage skipbtnholder">
              <div className="getstarted-btn-holder">
                <Checkbox checked={this.state.checkedtos} onChange={this.handleCheckTos} name="gilad" />
                <Trans> {t("I agree to the terms of service")} </Trans>

                <br />
                {
                  this.state.activePolicy ? (
                    <>
                      <Checkbox checked={this.state.checked} onChange={this.handleCheck} name="gilad" />
                      <Trans> {t("I agree to the privacy policy")} </Trans>
                    </>
                  ) : ('')
                }

                <Link onClick={() =>
                  this.redirectToNextPage({})
                }>
                  <Button variant="contained" color="primary" disableElevation className="getstarted-btn">
                    <Trans> {t("Submit")}  </Trans>
                  </Button>

                </Link>
  
              </div>
            </Grid>

          </Grid>
        </div>
      </div>

    );
  }
}


const mapStateToProps = state => {
  let { storeState } = state;
  console.log(state)
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
}

let newTos = withTranslation()(Termspage);
export default connect(mapStateToProps, {})(newTos)

//export default Termspage;