import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation, Trans } from "react-i18next";
import swal from "sweetalert";
import Services from "../../api/api";
import { createStore } from 'redux';
import reducer from '../../redux/reducers/appReducer';
import { logError } from '../../helpers/auth';
import OffileDb from '../../config/pouchDB';
const store = createStore(reducer);



class Forceupdate extends React.Component {

  constructor(props) {
    super(props);
    this.store = store.getState();
    this.appVersion = null;
    this.state = {
      isLoading: false,
      content: ''
    }
  }

  componentDidMount() {
    this.checkAppversion();
    this.preventScreenshot();
    this.onDeviceResume();
  }

  //softupdate logic
  checkAppversion() {
    let playstore, appstore, softupdate,forceupdate;
    const { t } = this.props;
    try {
      if (window.cordova && window.cordova.getAppVersion) {
        var that = this;
        var param = {
          id: localStorage.getItem("CommunityId")
        };
        if (navigator.onLine) {
          window.cordova.getAppVersion.getVersionNumber().then(function (version) {
            var currentVersion = Number(version.replace(/\./g, ''));
            console.log('appv', currentVersion)
            var lastVersion = localStorage.getItem('userCurrentAppVersion');
            if(currentVersion > lastVersion){
              OffileDb.deleteDatabse();
              console.log("offline db deleted")
            }
            localStorage.setItem('userCurrentAppVersion', currentVersion);
            store.dispatch({ type: 'SET_APP_VERSION', payload: version })
            let menuList = null;
            if (localStorage.getItem("menuList")) {
              menuList = JSON.parse(localStorage.getItem("menuList"));
            }
            menuList.forEach((obj) => {
              console.log(obj);
              if (obj.label == "Settings" || obj.path == "settings") {
                obj.childs.forEach((obj) => {
                  if (obj.label == "Rate Us" || obj.path == "rateus" || obj.label == "User profile" || obj.path == "userprofile") {
                    playstore = obj.playStoreLink;
                    appstore = obj.appStoreLink;
                  }
                })
              }
            })
            console.log("playstorelinkupdate::", playstore)
            console.log("appstorelinkupdate::", appstore)
            Services.getAppVersion(param).then((res) => {
              var appMinVersion = Number(res.data.data.appVersion.replace(/\./g, ''));
              console.log('appMinVersion', appMinVersion)
              softupdate = res.data.data.softUpdate;
              console.log("softupdateval::", softupdate)
              forceupdate = res.data.data.forceUpdate;
              console.log("forceupdateval::", forceupdate)
              console.log("currentVersion,appMinVersion::", currentVersion, appMinVersion)
              //forceupdate logic
              if ((currentVersion < appMinVersion) && forceupdate == true) {
                OffileDb.deleteDatabse();
                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                  document.addEventListener("backbutton", function (e) {
                    e.preventDefault();
                  }, false);
                }
                document.addEventListener('deviceready', function () {
                  document.addEventListener("resume", function (e) {
                    e.preventDefault();
                  }, false);
                })
                swal({
                  title: t("Update Available"),
                  text: t("The current version of the application is no longer supported Kindly update the same"),
                  icon: "success",
                  button: t("Update"),
                  closeOnClickOutside: false,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                }).then((val) => {
                  if (window.cordova && window.cordova.platformId == "android") {
                    window.open(playstore, '_system');
                  } else if (window.cordova && window.cordova.platformId == "ios") {
                    window.open(appstore, '_system');
                  }
                });
              }
              //softupdate logic
              else if (appMinVersion > currentVersion) {
                OffileDb.deleteDatabse();
                swal({
                  title: t("Update Available"),
                  text: t("An updated version of the application is now available"),
                  icon: "success",
                  button: t("Update"),
                }).then((val) => {
                  if (window.cordova && window.cordova.platformId == "android") {
                    window.open(playstore, '_system');
                  } else if (window.cordova && window.cordova.platformId == "ios") {
                    window.open(appstore, '_system');
                  }
                });
              }
            })
          });
        }
      }
    } catch (err) {
      console.log(err);
      var errorObj = {
        component: 'CommunityList',
        method: 'getAppVersion',
        error: err
      }
      logError(errorObj);
    }
  }

  onDeviceResume() {
    var that = this;
    if (window.cordova) {
      document.addEventListener('deviceready', function () {
        document.addEventListener("resume", function () {
          that.checkAppversion()
        }, false);
      })
    }
  }



  render() {
    const { t } = this.props;
    let content = this.state.content;
    return ('');
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

let newTest = withTranslation()(Forceupdate);
export default connect(mapStateToProps, {})(newTest)