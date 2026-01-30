import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { withTranslation, Trans } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import HomeIcon from "@material-ui/icons/Home";
import imgUrl from "../../assets/images/imageUrl.js";
import OffileDb from '../../config/pouchDB';
import Loader from "../loaders/loader";
import { setcomponentbgcolor, setSelectedComponentObject } from "../../redux/actions/appActions";
import Feedback from "../Feedback";
const Header = (props) => {
  //console.log(props.compObj)
  let history = useHistory();
  const { t } = props;
  const { templateID } = props;
  const [headerlogo, setLogo] = React.useState(imgUrl.logo);
  const [isLoading, setisLoading] = React.useState(true);
  const [disabled, setdisabled] = React.useState(false);
  let colorStyles = templateID == 2 ? { color: localStorage.getItem('componentbgcolor') } : {};
  let Obj = props.compObj.new ? !props.compObj.new.name ? "OneImpact" : props.compObj.new.name : "OneImpact";
  //const [pageTitle, setPageTitile] = React.useState(Obj);
  // const [pageTitle, setPageTitle] = React.useState(Obj);
  var compcolor = localStorage.getItem('componentbgcolor');
  // let colorStyles = templateID == 2 ? { color: compcolor } : {};

  var pageTile = localStorage.getItem('pageHeader');
  if(history.location.pathname.includes('getknowledgeableDetail') && pageTile != null){
    Obj = pageTile
  } if(history.location.pathname.includes('Knowledgechild') && pageTile != null){
    Obj = pageTile
  }  else if(history.location.pathname.includes('kyrchild')){
    Obj = 'Rights of people affected by TB'
  }  else if(history.location.pathname.includes('Notifications')){
    Obj = 'Notifications'
  } else if(history.location.pathname.includes('getknowledgeable')){
    Obj = 'Get Information'
  } 

  if(history.location.pathname.includes('services') || history.location.pathname.includes('ServiceForm') || history.location.pathname.includes('ServicesChatWindow') ) {
    Obj = 'Get Involved'
  } else if(history.location.pathname.includes('survey') || history.location.pathname.includes('SurveyForm')){
    Obj = 'Survey'
  }else if(history.location.pathname.includes('userprofile') || history.location.pathname.includes('UserProfile') || history.location.pathname.includes('settings')){
    Obj = 'Settings'
  }

  useEffect(() => {
    // Update the document title using the browser API
    OffileDb.setDatabase()
    getAppLogos();
  })

  // useEffect(() => {
  //   console.log("homedisabled", homeDisabled)

  //   if(!isLoading && !homeDisabled){
  //   console.log("homedisabled2", homeDisabled)

  //     localStorage.setItem('componentbgcolor', "#009596")
  //     props.setcomponentbgcolor("#009596")
  //     history.push("/layout");
  //   }
  // }, [homeDisabled])

  // useEffect(() => {
  //   setPageTitle(Obj)
  // }, [pageTitle])

  function getAppLogos() {
    var that = this
    if (navigator.onLine) {
      OffileDb.getData('applogos').then(function (result) {
        if (!result.status && result.status != 404) {
          let hlogo = result.data.brandingDetails.filter(o => o.tagline == "headerlogo").map(o => o.icon)[0] || imgUrl.logo;
          let flogo = result.data.brandingDetails.filter(o => o.tagline == "footerlogo").map(o => o.icon)[0] || imgUrl.poweredby;
          setLogo(hlogo);
        }
        setisLoading(false)
      });
    } else {
      setisLoading(false)
    }
  }

  function handleClickBack() {

    /**
     * CONDITIONAL GO BACK FOR LEVEL 2 ROUTING 
     * (NEED TO FIND A BETTER WAY TO HANDLE)
     * */

    //resetPageTitle()

    console.log(history, history.location.pathname)

    if (disabled) {
      return;
    }

    setdisabled(true)
    setTimeout(function () { setdisabled(false) }, 1000);

    if (history.location.pathname.includes('Knowledgechild')) {
      var cmshistroy = JSON.parse(localStorage.getItem('cmshistroy'));
      if (cmshistroy != null) {
        history.push(cmshistroy[cmshistroy.length - 1]);
        var popobj = cmshistroy.pop()
        console.log(popobj)
        if (popobj) {
          // props.setSelectedComponentObject({ name: popobj.state.contentName, id: popobj.state.contentId, componentbgcolor: '#ffffff' });
          localStorage.setItem("cmshistroy", JSON.stringify(cmshistroy))
        } else {
          history.goBack();
        }
      } else {
        history.goBack();
      }
      return
    }

    switch (history.location.pathname) {
      case '/layout/chatwindow':
        history.push("/layout/peerchat");
        // localStorage.setItem('BotInnit', "true");
        break;
      case '/layout/knowyourrights':
        history.push("/layout");
        // localStorage.setItem('BotInnit', "true");
        break;
      case '/layout/getknowledgeable':
        history.push("/layout");
        // localStorage.setItem('BotInnit', "true");
        break;
      case '/layout/information':
        history.push("/layout");
        // localStorage.setItem('BotInnit', "true");
        break;
      case '/layout/nearme':
        history.push("/layout");
        // localStorage.setItem('BotInnit', "true");
        break;
      case '/layout/peerchat':
        history.push("/layout");
        // localStorage.setItem('BotInnit', "true");
        break;
      case '/layout/services':
        history.push("/layout");
        // localStorage.setItem('BotInnit', "true");
        break;
      case '/layout/settings':
        history.push("/layout");
        // localStorage.setItem('BotInnit', "true");
        break;
      case '/layout/survey':
        history.push("/layout");
        // localStorage.setItem('BotInnit', "true");
        break;
      // case '/layout/UserProfile':
      //   history.push("/layout/settings");
      //   // localStorage.setItem('BotInnit', "true");
      //   break;
      case '/layout/getknowledgeableDetail':
        history.push("/layout/getknowledgeable");
        // localStorage.setItem('BotInnit', "true");
        break;
      default:
        history.goBack();
        break;
    }
  }


  function resetPageTitle() {
    if (history.location.pathname.includes('Knowledgechild')) {
      props.setSelectedComponentObject({ name: 'Get Information', id: 19, componentbgcolor: '#ffffff' });
    } else if (history.location.pathname.includes('getknowledgeableDetail')) {
      props.setSelectedComponentObject({ name: 'Get Information', id: 19, componentbgcolor: '#ffffff' });
    } else if (history.location.pathname.includes('ServiceForm')) {
      props.setSelectedComponentObject({ name: 'Get Involved', id: 29, componentbgcolor: '#ffffff' });
    }
  }

  function handleClickHome() {
    // setHomeDisabled(prev => !prev)
    // setTimeout(function () { setHomeDisabled(prev => !prev) }, 500);

    localStorage.setItem('componentbgcolor', "#009596")
    props.setcomponentbgcolor("#009596")
    history.push("/layout");
    // localStorage.setItem('BotInnit', "true");
  }

  if(history.location.pathname.includes('knowyourrights')){
    Obj = 'Get To Know Your Rights';
  }

  return (
    <>
      <Grid item xs={12} className="zero gk-page">
        <div className="onboardingheaderdiv homepageheaderdiv homepageInnderheaderdiv">
          <Grid container spacing={3} className="gridcontainer">
            <Grid item xs={1} className="zero">
              <IconButton
                edge="start"
                className="menubtn"
                disabled={disabled}
                color="inherit"
                aria-label="menu"
                onClick={() => handleClickBack()}
              >
                <ArrowBackIosIcon style={colorStyles} />
              </IconButton>
            </Grid>
            <Grid item xs={1} className="feedback text-center"><Feedback></Feedback></Grid>
            <Grid item xs={8} className="zero appnameholder">

              {Obj != null && templateID == 2 ? (
                <p className="zero text-center">
                  {
                    isLoading ? (
                      <Loader isLoading={isLoading} />
                    ) : (<img className="oneimpactlogoimg" src={headerlogo} />)
                  }
                </p>) : (
                <h3 className="text-center zero color-pink">{t(Obj)}</h3>)}
            </Grid>

            {/* {
              templateID == 1 ? (            
              <Grid item xs={10} className="zero appnameholder">
              <h3 className="text-center zero color-white">{t('iMonitor')}</h3>
            </Grid>) : (
                <Grid item xs={10} className="zero appnameholder">
                  <p className="zero text-center">
                    {
                      isLoading ? (
                        <Loader isLoading={isLoading} />
                      ) : (<img className="oneimpactlogoimg" src={headerlogo} />)
                    }
                  </p>
                </Grid>)
            } */}



            <Grid item xs={2} className="zero text-center">
              <IconButton
                edge="end"
                color="inherit"
                aria-label="home"
                className="homeicon-btn menubtn"
                onClick={() => handleClickHome()}
              >
                <HomeIcon style={colorStyles} />
              </IconButton>
            </Grid>
          </Grid>

          {
            templateID == 2 && (
              <>
                <p className="getonboardedtext text-center">{t(props.location.name)}</p>
                <div className="custom-shape-divider-bottom-1599722124">
                  <svg
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                  >
                    <path
                      fill={compcolor}
                      d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
                    ></path>
                  </svg>
                </div>

              </>
            )
          }
        </div>
      </Grid >
      <div className="headerdiv"></div>
    </>
  );
};

//export default (withTranslation()(KnowledgeList));
const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor,
    compObj: storeState.componentObj
  };
};


const withRouterheader = withRouter(withTranslation()(Header));

export default connect(mapStateToProps, { setcomponentbgcolor, setSelectedComponentObject })(withRouterheader);

