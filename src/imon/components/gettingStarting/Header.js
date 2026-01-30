import React, { Suspense, Component } from "react";
import { withTranslation, Trans } from "react-i18next";
import { Link, useHistory, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
// import Button from "@material-ui/core/Button";
// import Langpref from "./Langpref";
import imgUrl from "../../assets/images/imageUrl.js";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import Services from "../../api/api";
import OffileDb from '../../config/pouchDB';
import Loader from "../loaders/loader";
import Customcircularprogress from "./Customcircularprogress.js";

// import { v4 as uuidv4 } from "uuid";
// import swal from "sweetalert";

// import Checkbox from '@material-ui/core/Checkbox';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
// import Feedback from "../Feedback";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import IconButton from "@material-ui/core/IconButton";
import { logError } from "../../helpers/auth";


// const Feedback = lazy(() => import('../Feedback'));
// const Customcircularprogress = lazy(() => import('./Customcircularprogress.js'));
// const Loader = lazy(() => import('../loaders/loader'));



// const Feedback = lazy(() => import('../Feedback'));
// const Customcircularprogress = lazy(() => import('./Customcircularprogress.js'));
// const Loader = lazy(() => import('../loaders/loader'));


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      appversion: "1.0.0",
      headerLogo: imgUrl.logo,
      footerLogo: imgUrl.poweredby,
      brandaing: [],
      headerLongLogo: imgUrl.longlogo,
    };
    this.handleClickBack = this.handleClickBack.bind(this);
  }

  componentDidMount() {
    OffileDb.setDatabase()
    let deviceuuid = localStorage.getItem('deviceuuid');
    this.getAppVersion()
    //this.getAppLogos()

  }


  getAppVersion() {
    var param = {
      id: localStorage.getItem("CommunityId"),
    };
    if(navigator.onLine){
      Services.getAppVersion(param).then((res) => {
        try {
          this.setState({ appversion: res.data.data.appVersion,
            isLoading: false });
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'Header',
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
          if (res.status == 200) {
            let hlogo = res.data.data.brandingDetails.filter(o => o.tagline == "headerlogo").map(o => o.icon)[0] || imgUrl.logo;
            let flogo = res.data.data.brandingDetails.filter(o => o.tagline == "footerlogo").map(o => o.icon)[0] || imgUrl.poweredby;
            this.setState({
              headerLogo: hlogo,
              footerLogo: flogo,
              isLoading: false
            });
            OffileDb.setData('applogos', res.data.data)
          } else {
            this.setState({
              isLoading: false
            });
          }
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'Header',
            method: 'getAppLogos',
            error: err
          }
          logError(errorObj);
        }
      })
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  handleClickBack() {
    //console.log(history, history.location.pathname)
    this.props.history.goBack();
  }

  render() {
    const { t } = this.props;
    const { templateID } = this.props;
    let colorStyles = templateID == 2 ? { color: localStorage.getItem('componentbgcolor') } : {};

    return (
      <>
        {
          templateID == 1 ? (
            <div className="template1-hader">
              <Loader isLoading={this.state.isLoading} />
              <div className="gridcontainer">
                <Grid container spacing={3} className=" headerContianer">
                <Grid item xs={1}>
                  {
                    window.location.hash === '#/Userlogin' &&   
                      <IconButton
                        edge="start"
                        className="onboardingback"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => this.handleClickBack()}
                      >
                        <ArrowBackIosIcon style={{colorStyles,transform:'scale(1.5)'}} />
                      </IconButton>
                    }
                    </Grid>
                  <Grid item xs={11} >
                    {/* <Feedback></Feedback> */}
                    <p className=" text-center">
                      {this.state.isLoading ? (
                        <Loader isLoading={this.state.isLoading} />
                      ) : (<img width="251" height="60" src={this.state.headerLongLogo} />)
                      }
                    </p>
                    {/* <p className="zero text-center steptitle text-version"><span>{"V: " + this.state.appversion}</span></p> */}
                  </Grid>
                </Grid>
              </div>
            </div>) : (

            <div className="gridcontainer">
              <Grid container spacing={3} className="gridcontainer">
                <Grid item xs={12} className="zero">
                  <div className="onboardingheaderdiv homepageheaderdiv">
                  <Grid container spacing={3} className=" headerContianer">
                  <Grid item xs={1}>
                  {/* <Feedback></Feedback> */}

                    {
                      window.location.hash === '#/Userlogin' &&
                      
                        <IconButton
                          edge="start"
                          className="onboardingback"
                          color="inherit"
                          aria-label="menu"
                          onClick={() => this.handleClickBack()}
                        >
                          <ArrowBackIosIcon style={colorStyles} />
                        </IconButton>
                      }
                      </Grid>
                    <Grid item xs={11} >
                    <p className="zero text-center">
                  {this.state.isLoading?(
                    <Loader isLoading={this.state.isLoading} />
                  ): (<img className="oneimpactlogoimg" src={this.state.headerLogo} />)
                  }
                    </p>
                    </Grid>
                    </Grid>
                  {/* <p className="getonboardedtext text-center">
                      <span>{"V: " + this.state.appversion}</span>
                    </p> */}

                  {
                    window.location.hash == '#/OnboardingRegVertical' || window.location.hash == '#/Onboardingslider'?(
                    <p className="progressbarcontainer text-center">
                    <Customcircularprogress></Customcircularprogress>
                    </p>
                  ): ('')
                  }

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
                {
                  window.location.hash === '#/Onboarding' || window.location.hash === '#/Onboarding/' && <img className="oneimpactlogoimg imgmiddle mt-20px" src={this.state.footerLogo} />
                }
              </Grid>
            </div>)
        }


      </>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    langId: storeState.langId,
    selectedComponentObj: {},
  };
};

// const ThemeKnowYourRights = withTheme(KnowYourRights);
// const FinalThemeKnowYourRights = withStyles(useStyles)(ThemeKnowYourRights);
//const routeSettings = withRouter(Settings);
//export default connect(mapStateToProps, {})(routeSettings);

let routeOnboarding = withRouter(Header)
let transonboarding = withTranslation()(routeOnboarding);
export default connect(mapStateToProps, {})(transonboarding);

