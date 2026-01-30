import swal from "sweetalert";
import Services from "../api/api";
import { createStore } from 'redux';
import reducer from '../redux/reducers/appReducer';
const store = createStore(reducer);


class cordovaConfigClass {
  constructor(props) {
    //console.log(store)
    this.store = store.getState();
    this.appVersion = null;
  }

  init(){
    // this.checkAppversion()
    // this.ForceUpdate()
    this.preventScreenshot()
    // this.onDeviceResume()   
  }

  // //softupdate logic
  // checkAppversion() {
  //   let playstore,appstore,softupdate;
  //   try {
  //     var that = this;
  //     var param = {
  //       id: this.store.communityId
  //     };
  //     window.cordova.getAppVersion.getVersionNumber().then(function (version) {
  //       var currentVersion = Number(version.replace(/\./g, ''));
  //       console.log('appv', currentVersion)
  //       store.dispatch({type: 'SET_APP_VERSION', payload:version})
  //       let menuList = null;
  //       if(localStorage.getItem("menuList")){
  //         menuList = JSON.parse(localStorage.getItem("menuList"));
  //       }
  //       menuList.forEach((obj) => {
  //           console.log(obj);
  //           if(obj.label == "Settings" || obj.path == "settings") {
  //             obj.childs.forEach((obj) =>{
  //               if(obj.label == "Rate Us" || obj.path == "rateus" ){
  //                 playstore = obj.playStoreLink;
  //                 appstore = obj.appStoreLink;
  //               }
  //             })
  //           }
  //       })
  //       console.log("playstorelinkupdate::",playstore)
  //       console.log("appstorelinkupdate::",appstore)
  //       Services.getAppVersion(param).then((res) => {
  //         var appMinVersion = Number(res.data.data.appVersion.replace(/\./g, ''));
  //         console.log('appMinVersion', appMinVersion)
  //         softupdate = res.data.data.softUpdate;
  //         console.log("softupdateval::",softupdate)
  //         console.log("currentVersion,appMinVersion::",currentVersion,appMinVersion)
  //         if(appMinVersion > currentVersion){
  //         // const {t} = this.props;
  //           swal({
  //             title: ("Update Available"),
  //             text:("A new version of the application is available. Kindly update to use the same!"),
  //             icon: "success",
  //             button: ("Download"),
  //           }).then((val) => {
  //             if(window.cordova && window.cordova.platformId == "android")
  //             {
  //               window.open(playstore, '_system');
  //             }else if (window.cordova && window.cordova.platformId == "ios")
  //             {
  //               window.open(appstore, '_system');
  //             }               
  //           });
  //         }
  //       })
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  
  // //forceupdate logic
  // ForceUpdate() {
  //   let playstore,appstore,forceupdate;
  //   try {
  //     var that = this;
  //     var param = {
  //       id: this.store.communityId
  //     };
  //     window.cordova.getAppVersion.getVersionNumber().then(function (version) {
  //       var currentVersion = Number(version.replace(/\./g, ''));
  //       console.log('appv', currentVersion)
  //       store.dispatch({type: 'SET_APP_VERSION', payload:version})
  //       let menuList = null;
  //       if(localStorage.getItem("menuList")){
  //         menuList = JSON.parse(localStorage.getItem("menuList"));
  //       }        
  //       menuList.forEach((obj) => {
  //           console.log(obj);
  //           if(obj.label == "Settings" || obj.path == "settings" ) {
  //             obj.childs.forEach((obj) =>{
  //               if(obj.label == "Rate Us" || obj.path == "rateus"){
  //                 playstore = obj.playStoreLink;
  //                 appstore = obj.appStoreLink;
  //               }
  //             })
  //           }
  //       })   
  //       console.log("playstorelinkupdate::",playstore)
  //       console.log("appstorelinkupdate::",appstore)
  //       Services.getAppVersion(param).then((res) => {
  //         var appMinVersion = Number(res.data.data.appVersion.replace(/\./g, ''));
  //         console.log('appMinVersion', appMinVersion)
  //         forceupdate = res.data.data.forceUpdate;
  //         console.log("forceupdateval::",forceupdate)
  //         console.log("currentVersion,appMinVersion::",currentVersion,appMinVersion)
  //         if ((currentVersion < appMinVersion) && forceupdate == true) {
  //           // const {t} = this.props;
  //           document.addEventListener("deviceready", onDeviceReady, false);
  //           function onDeviceReady() {
  //           document.addEventListener("backbutton", function (e) {
  //           e.preventDefault();
  //           }, false );
  //           }
  //           document.addEventListener('deviceready', function () {
  //             document.addEventListener("resume", function (e) {
  //               e.preventDefault();
  //             }, false);
  //           })
  //           swal({
  //             title: ("Update Available"),
  //             text:("The current version of the application is no longer supported. Kindly update the same!"),
  //             icon: "success",
  //             button: ("Download"),
  //             closeOnClickOutside: false,
  //             allowOutsideClick: false,
  //             allowEscapeKey: false,
  //           }).then((val) => {
  //             if(window.cordova && window.cordova.platformId == "android")
  //             {
  //               window.open(playstore, '_system');
  //             }else if (window.cordova && window.cordova.platformId == "ios")
  //             {
  //               window.open(appstore, '_system');
  //             }
  //           });
  //         }
  //       })
  //     });

  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // onDeviceResume() {
  //   var that = this;
  //   if (window.cordova) {
  //     document.addEventListener('deviceready', function () {
  //       document.addEventListener("resume", function () {
  //         that.ForceUpdate()
  //       }, false);
  //     })
  //   }
  // }

  preventScreenshot(){
    if(window.plugins && window.plugins.preventscreenshot){
      window.plugins.preventscreenshot.disable()
    }
  }

}

const cordovaConfig = new cordovaConfigClass();
export default cordovaConfig;