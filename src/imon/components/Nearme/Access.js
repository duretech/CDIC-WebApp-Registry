import React, { Component } from "react";
import classnames from "classnames";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
//import "../../assets/css/customstyles.css";

import imgUrl from "../../assets/images/imageUrl.js";
import Accesstabs from "./Accesstabs.js";
import Services from "../../api/api";
import { withTranslation, Trans } from "react-i18next";
import { connect } from "react-redux";
import {
  useHistory,
  withRouter,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Feedback from "../Feedback.js";
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
import FooterMenu from "../../../component/layout/FooterMenu.js";

class Access extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  handleBack() {
    window.history.back();
  }

  componentDidMount() {
    let usageData = {
      'userId': JSON.parse(localStorage.getItem("obj")).userId,
      'module': 'Nearme',
      'communityId': localStorage.getItem("CommunityId")
    }
    if (navigator.onLine) {
      Services.saveUsageData(usageData).then((data) => {
        try {
          console.log("UsageData", data);
        } catch (err) {
          console.log("err::", err)
        }
      });
    }
    gaLogEvent("Near me", '', '');
    gaLogScreen("Near me");
  }

  render() {
    return (
      <section className="searchcustombg1"
      style={{
          backgroundColor: '#fff',
          flexGrow: 1,
          // padding: 20,
          
      }}
>
  <FooterMenu></FooterMenu>
      <div className={window.cordova ? "nearme-page" : 'nearme-page windowdesktop'}>
        <Grid container spacing={0} className="nearme-pagediv">
          {/* <Grid container xs={12} className="certinav">
            <Grid xs={3} className="backimg">
              <img src={imgUrl.whiteback} className="backsvg" onClick={() => this.handleBack()} />
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle1" className="regname oneuhcfont">
                Near Me
              </Typography>
            </Grid>
            <Grid xs={3}>
            <Typography variant='body2' className='stepname parafont'><Feedback></Feedback></Typography>
            </Grid>
          </Grid> */}
          <Grid item xs={12} className="nearmemap">
            <Accesstabs></Accesstabs>
          </Grid>
          {/* <Grid container xs={12} className="homebottomnav">
          {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="home-svg"  onClick={()=>(!window.location.pathname.includes('imonhome')?this.props.history.push('/layout/imonhome'):'')}>
              <img src={imgUrl.homesvg} />
              <Typography variant="caption" display="block">
                Home
              </Typography>
            </Grid>:<Grid xs={4} className="home-svg" onClick={()=>(!window.location.pathname.includes('imonhome')?this.props.history.push('/layout/imonhome'):'')}>
              <img src={imgUrl.homesvg} />
              <Typography variant="caption" display="block">
                Home
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="journey-svg" onClick={()=>(!window.location.pathname.includes('myjourney')?this.props.history.push('/myjourney'):'')}>
              <img src={imgUrl.journeysvg} />
              <Typography variant="caption" display="block">
                My Journey
              </Typography>
            </Grid>:''}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?this.props.history.push('/layout/nearme'):'')}>
              <img src={imgUrl.nearsvg} />
              <Typography variant="caption" display="block">
                Near Me
              </Typography>
            </Grid>:<Grid xs={4} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?this.props.history.push('/layout/nearme'):'')}>
              <img src={imgUrl.nearsvg} />
              <Typography variant="caption" display="block">
                Near Me
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?this.props.history.push('/layout/getknowledgeable'):'')}>
              <img src={imgUrl.guidesvg} />
              <Typography variant="caption" display="block">
                Guide
              </Typography>
            </Grid>:<Grid xs={4} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?this.props.history.push('/layout/getknowledgeable'):'')}>
              <img src={imgUrl.guidesvg} />
              <Typography variant="caption" display="block">
                Guide
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="connect-svg" onClick={()=>(!window.location.pathname.includes('peerchat')?this.props.history.push('/layout/peerchat'):'')}>
              <img src={imgUrl.connectsvg} />
              <Typography variant="caption" display="block">
                Connect
              </Typography>
            </Grid>:''}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="screen-svg" onClick={()=>(!window.location.pathname.includes('aisurvey')?this.props.history.push('/layout/AiSurvey'):'')}>
              <img src={imgUrl.screensvg} />
              <Typography variant="caption" display="block">
                Survey
              </Typography>
            </Grid>:""}
          </Grid> */}
        </Grid>

        <div className="nearme-ai">
          {/* <AiBot /> */}
        </div>
      </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor
  };
};

let transAccess = withTranslation()(Access);
const finalAccess =withRouter(transAccess)
export default connect(mapStateToProps, {})(finalAccess);
