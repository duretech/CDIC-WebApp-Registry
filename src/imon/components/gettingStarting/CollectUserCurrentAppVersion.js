import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation, Trans } from "react-i18next";
import swal from "sweetalert";
import Services from "../../api/api";
import { createStore } from 'redux';
import reducer from '../../redux/reducers/appReducer';
import { logError } from '../../helpers/auth';
const store = createStore(reducer);



class CollectUserCurrentAppVersion extends React.Component {

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
    this.checkUserAppversion();
  }

  checkUserAppversion() {
    const { t } = this.props;
    try {
      if (window.cordova) {
        var param = {
          id: localStorage.getItem("CommunityId")
        };
        var setUserAppVersionparams = {
          communityId: localStorage.getItem("CommunityId"),
          currentAppVersion: localStorage.getItem('userCurrentAppVersion').toString(),
          userId: JSON.parse(localStorage.getItem("obj")).userId,
        };
        var getUserAppVersionparams = {
          communityId: localStorage.getItem("CommunityId"),
          userId: JSON.parse(localStorage.getItem("obj")).userId,
        };
        console.log("setUserAppVersionparams::",setUserAppVersionparams);
        console.log("getUserAppVersionparams::",getUserAppVersionparams);
        if (navigator.onLine) {
          window.cordova.getAppVersion.getVersionNumber().then(function (version) {
            var currentVersion = Number(version.replace(/\./g, ''));
            console.log('appv', currentVersion)
            localStorage.setItem('userCurrentAppVersion', currentVersion);
            store.dispatch({ type: 'SET_APP_VERSION', payload: version })
            Services.getAppVersion(param).then((res) => {
              var appMinVersion = Number(res.data.data.appVersion.replace(/\./g, ''));
              console.log('appMinVersion', appMinVersion)
              console.log("currentVersion,appMinVersion::", currentVersion, appMinVersion)
              //user currentappversion set
              Services.setUserAppVersion(setUserAppVersionparams).then((res) => {
              })
              //user currentappversion get
              Services.getUserAppVersion(getUserAppVersionparams).then((res) => {
              })
            })
          });
        }
      }
    } catch (err) {
      console.log(err);
      var errorObj = {
        component: 'CollectUserCurrentAppVersion',
        method: 'checkUserAppversion',
        error: err
      }
      logError(errorObj);
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

let UserVersion = withTranslation()(CollectUserCurrentAppVersion);
export default connect(mapStateToProps, {})(UserVersion)