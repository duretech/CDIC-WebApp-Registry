import React, { Component } from "react";
import { withTranslation, Trans } from "react-i18next";
import { Link, useHistory, withRouter } from "react-router-dom";
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
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { setCommunityId } from "../../redux/actions/appActions";
import SearchBar from "material-ui-search-bar";
import * as _ from "lodash";
import Header from "./Header";
import { removeSpacetoLowerCase } from "../../api/helper";
import i18n from "i18next";



import { v4 as uuidv4 } from "uuid";
import swal from "sweetalert";
import { logError } from "../../helpers/auth";


class CommunityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      appversion: "1.0.0",
      headerLogo: imgUrl.logo,
      footerLogo: imgUrl.poweredby,
      brandaing: [],
      communityList: [],
      orignalCommunityList: [],
      selectedCommunity: "",
      nextButtonVisible: true
    };
    this.fetchCommunityList = this.fetchCommunityList.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    OffileDb.setDatabase()
    i18n.changeLanguage('en_US');
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
    this.fetchCommunityList();
  }

  fetchCommunityList() {
    var param = {
    };
    Services.getCommunityList(param).then((res) => {
      try {
        if (res.status == 200) {
          this.setState({
            communityList: res.data.data,
            orignalCommunityList: res.data.data,
            isLoading: false,
            selectedCommunity: localStorage.getItem('CommunityId')
          });
        }
      } catch (err) {
        console.log("err::", err)
        var errorObj = {
          component: 'CommunityList',
          method: 'fetchCommunityList',
          error: err
        }
        logError(errorObj);
      }
    })
    // var staticComList = [{
    //   communityId: "b78ff1610e1bd04a0e2358970060373b",
    //   communityName: "Uganda",
    //   communityType: ""
    // },
    // {
    //   communityId: "ace9bd89c0133c2d9a77cea2ea45c54d",
    //   communityName: "Nigeria",
    //   communityType: ""
    // },
    // {
    //   communityId: "04f3a1d75961dc94d6cf2a32744aacc9",
    //   communityName: "Generic",
    //   communityType: ""
    // },
    // {
    //   communityId: "1b60698ac49f220e96ce69062be4f3e7",
    //   communityName: "Vietnam",
    //   communityType: ""
    // }]

    // this.setState({ 
    //   communityList: staticComList, 
    //   orignalCommunityList: staticComList, 
    //   isLoading: false ,
    //   selectedCommunity: localStorage.getItem('CommunityId')
    // });
  }


  selectCommunity = (event) => {
    console.log("selectCommunity::", event.target.value);
    this.setState({
      selectedCommunity: event.target.value
    });
    this.props.setCommunityId(event.target.value);
    localStorage.setItem('CommunityId', event.target.value);
    // this.props.history.push("/Onboarding");
  };

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
            component: 'CommunityList',
            method: 'getAppVersion',
            error: err
          }
          logError(errorObj);
        }
      })
    }
  }

  redirectToNextPage() {
    const { t } = this.props;
    if (this.state.selectedCommunity) {
      // this.props.history.push("/Onboarding");
    } else {
      swal({
        text: t("Please select commnunity to proceed"),
        icon: "warning",
        button: t("Ok"),
      }).then((val) => {
      });
    }
  }

  handleOnSearch = (e) => {
    let topicList = _.cloneDeep(this.state.orignalCommunityList);
    let filtered = [];
    filtered = topicList.filter(function (str) {
      return (
        removeSpacetoLowerCase(str.communityName).indexOf(
          removeSpacetoLowerCase(e)
        ) !== -1
      );
    });


    if (e.length == 0) {
      filtered = _.cloneDeep(this.state.orignalCommunityList);
    }
    this.setState({
      communityList: filtered,
    });
  };


  cancelSearch(e) {
    this.setState({
      communityList: this.state.orignalCommunityList,
    });
  }
  handleFocus(e) {
    this.setState({
      nextButtonVisible: false
    })
    console.log("hi");
  }
  handleBlur(e) {
    this.setState({
      nextButtonVisible: true
    })
    console.log("bye");
  }

  render() {
    const { t } = this.props;
    const communityListWrap = {
      height: '45vh',
      'overflow-y': 'auto'
    };
    return (
      <div className="onboarding-page langpref-page  fulllengthpage selectlangpage communitylistpage">
        <div className="gridcontainer">
          <Grid container spacing={3} className="gridcontainer">
            <Header></Header>
            {/* <img className="oneimpactlogoimg imgmiddle mt-20px" src={imgUrl['oneimpactlogo']} /> */}


            <FormControl component="fieldset" key="1" className="communityList-conatiner">
              <div className="animate__animated animate__zoomIn animate__faster padding10">
                <Trans> {t("Please Search Community")} </Trans>
                {/* <Trans> Please Select Language </Trans> */}
              </div>
              <SearchBar
                placeholder={t('Search')}
                className="community-searchbar"
                onChange={this.handleOnSearch}
                onCancelSearch={this.cancelSearch}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                style={{ borderColor: '#000000' }}
              />
              <div style={communityListWrap}>
                <RadioGroup name="gender1" value={this.state.selectedCommunity}>
                  {this.state.communityList.length > 0 && this.state.communityList.map((name) => (
                    <FormControlLabel
                      className="animate__animated animate__zoomIn animate__faster"
                      key={name.communityId}
                      value={name.communityId}
                      checked={this.state.selectedCommunity === name.communityId}
                      control={<Radio />}
                      label={name.communityName}
                      onChange={this.selectCommunity}
                    />
                  ))}
                </RadioGroup>
                <div className="no-community">
                  {this.state.communityList.length == 0 ? 'No community found' : ''}
                </div>
              </div>
            </FormControl>

            <Grid item xs={12} className={"stoptblogodiv " + (this.state.nextButtonVisible ? 'show' : 'hide')}>
              <p className="text-center mb-0">
                {/* <img className="oneimpactlogoimg imgmiddle"  src={imgUrl.stoptblogo}/> */}
                {/* <img className="oneimpactlogoimg imgmiddle" src={this.state.footerLogo} /> */}
                {/* <img className="oneimpactlogoimg imgmiddle" src={imgUrl.poweredby} /> */}
              </p>
            </Grid>
            <Grid item xs={12} className={"text-center skipbtnholder zero " + (this.state.nextButtonVisible ? 'show' : 'hide')}>
              <div className="getstarted-btn-holder">
                {/* <Link to="/tos1"> */}
                <Link onClick={() =>
                  this.redirectToNextPage({})
                }>
                  <Button
                    color="primary"
                    disableElevation
                    className="login_btn getstarted-btn animate__animated animate__backInUp animate__faster"
                  >
                    <Trans> {t("Next")} </Trans>
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

let routeCommunityList = withRouter(CommunityList)
let transCommunityList = withTranslation()(routeCommunityList);
export default connect(mapStateToProps, { setCommunityId })(transCommunityList);

