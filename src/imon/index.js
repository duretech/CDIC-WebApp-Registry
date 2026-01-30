import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
// import './assets/dist/leaflet.css';
import './assets/dist/animate.min.css';
import './assets/css/productfont.css';
import "./assets/css/common.css";
import "./assets/css/template1.scss";
import "./assets/css/template2.scss";
// import "./assets/css/template3.scss";
import "./assets/css/fonts.css";
import "./assets/css/backgroundImage.css";
import "./assets/css/template2menusecondstyles.css";
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import configureStore from './redux/store/configureStore';

import { I18nextProvider } from "react-i18next";
import i18n from "./config/i18n";
import OffileDb from './config/pouchDB';
import cordovaConfig from './config/cordovaConfig';
import ReactGA from './config/ReactGA';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import ErrorBoundary from './components/ErrorBoundary';
import moment from 'moment';

const themesChanges = {
  template1: './index.css',
  template2: './index.css',
  template3: './index.css',
};

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'museo_sans300',
      'museo_sans500',
      'museo_sans900',
    ].join(','),
  },
});

const store = configureStore();

const startApp = () => {
  const CHOSEN_TemplateID=localStorage.getItem('templateID')
  const colorval = JSON.parse(localStorage.getItem('colorTheme')) != null ? JSON.parse(localStorage.getItem('colorTheme')) : 1
  var CHOSEN_THEME = CHOSEN_TemplateID == 1 || CHOSEN_TemplateID == null || CHOSEN_TemplateID == 'null' ? 'template1' : (CHOSEN_TemplateID == 2 ? "template2" : "template3");
  const styleNode = document.createComment('inject-styles-here');
  document.head.insertBefore(styleNode, document.head.firstChild);
  document.getElementsByTagName("body")[0].setAttribute("data-colorTheme", colorval == 1 ? 'light' : 'dark');

  ReactDOM.render(
    <ErrorBoundary>
      <ThemeSwitcherProvider insertionPoint="inject-styles-here" defaultTheme={CHOSEN_THEME} themeMap={themesChanges}>
        <React.StrictMode>
          <I18nextProvider i18n={i18n}>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                <App />
                <div className="offline-msg">You are in offline mode.</div>
              </ThemeProvider>
            </Provider>
          </I18nextProvider>
        </React.StrictMode>
      </ThemeSwitcherProvider>
    </ErrorBoundary>
    ,
    document.getElementById('root')
  );
  setTimeout(function(){
    clearOfflineDataInADay();
  },1000)
}

function clearOfflineDataInADay(){
  let today = moment(new Date()).format("DD-MM-YYYY");
  let dataClearedDate = localStorage.getItem('datacleareddate');
  if(dataClearedDate==null){
    localStorage.setItem('datacleareddate', moment().add(1, 'd').format("DD-MM-YYYY"));
    dataClearedDate = localStorage.getItem('datacleareddate');
  }

  if(dataClearedDate == today){
    OffileDb.deleteDatabse();
    console.log("data has been cleared");
    localStorage.setItem('datacleareddate', moment().add(1, 'd').format("DD-MM-YYYY"));
  }
}

function onResume() {
  // alert('resumed');
  localStorage.setItem('BotInnit', "false");
  //FCMPluginNG.onNotification( onNotificationCallback(data), successCallback(msg), errorCallback(err) )
  //Here you define your application behaviour based on the notification data.

}
function onPause() {
  if(window.TTS){
    window.TTS.speak("");
  }
}

function onOffline() {
  // Handle the offline event
  console.log("device is in offline");
  document.querySelector('.offline-msg').style.display = 'block';
}

function checkNetwork() {
  if (window.cordova && window.navigator) {
    var networkState = window.navigator.connection.type;
    if (networkState == window.Connection.NONE) {
      document.querySelector('.offline-msg').style.display = 'block';
    }
  }
}

function onOnline() {
  // Handle the online event
  console.log("device is in online");
  document.querySelector('.offline-msg').style.display = 'none';
}
//ReactGA.initialize()
if (!window.cordova) {
  startApp()
  OffileDb.setDatabase()
  ReactGA.webappInit();
} else {
  document.addEventListener('deviceready', () => {
    startApp();
    OffileDb.setDatabase()
    cordovaConfig.init()
    checkNetwork();
    if(window.cordova.InAppBrowser){
      window.open = window.cordova.InAppBrowser.open;
    }
    ReactGA.webappInit()

    if(window.cordova && window.cordova.plugins.diagnostic){
      window.cordova.plugins.diagnostic.requestRemoteNotificationsAuthorization({
        successCallback: function(){
            console.log("Successfully requested remote notifications authorization");
        },
        errorCallback: function(err){
           console.error("Error requesting remote notifications authorization: " + err);
        },
        types: [
          window.cordova.plugins.diagnostic.remoteNotificationType.ALERT,
          window.cordova.plugins.diagnostic.remoteNotificationType.SOUND,
          window.cordova.plugins.diagnostic.remoteNotificationType.BADGE
        ],
        omitRegistration: false
      });
    }
    // if(window.cordova.plugins.firebase.messaging){
    //   window.cordova.plugins.firebase.messaging.requestPermission().then(function() {
    //     console.log("Push messaging is allowed");
    //   });
    //   // window.cordova.plugins.firebase.messaging.requestPermission({forceShow: true}).then(function() {
    //   //   console.log("You'll get foreground notifications when a push message arrives");
    //   // });
    //   window.cordova.plugins.firebase.messaging.getToken().then(function(token) {
    //     console.log("Got device token: ", token);
    //     localStorage.setItem('fcmToken', token);
    //   });
      
    //   window.cordova.plugins.firebase.messaging.onMessage(function(payload) {
    //     console.log("New foreground FCM message: ", payload);
    //     store.dispatch({ type: 'SET_FORE_GROUND_NOTI', payload: payload })
    //   });
    //   window.cordova.plugins.firebase.messaging.onBackgroundMessage(function(payload) {
    //     console.log("New background FCM message: ", payload);
    //     localStorage.setItem('notiRedPage', JSON.stringify(payload));
    //   });
    // }
    if(window.FirebasePlugin){
      window.FirebasePlugin.onTokenRefresh(function(fcmToken) {
        console.log("fcmToken", fcmToken);
        if(fcmToken){
          localStorage.setItem('fcmToken', fcmToken);
        }
      }, function(error) {
          console.error(error);
      });

      window.FirebasePlugin.hasPermission(function(hasPermission){
        console.log("Permission is " + (hasPermission ? "granted" : "denied"));
        if(!hasPermission){
          window.FirebasePlugin.grantPermission(function(hasPermission){
            console.log("Permission was " + (hasPermission ? "granted" : "denied"));
          });
        }
      });

      window.FirebasePlugin.onMessageReceived(function(message) {
        console.log("Message type: " + message.messageType);
        if(message.messageType === "notification"){
            console.log("Notification message received");
            store.dispatch({ type: 'SET_FORE_GROUND_NOTI', payload: message })
            if(message.tap){
                console.log("Tapped in " + message.tap);
            }
        }
        console.dir(message);
      }, function(error) {
          console.error(error);
      });
    }
    // if(window.FCMPlugin){
    //   window.FCMPlugin.getToken(function (token) {
    //     console.log(token)
    //     localStorage.setItem('fcmToken', token);
    //     // if (window.cordova) {
    //     //   window.FCMPlugin.getToken(function (token) {
    //     //     localStorage.setItem('fcmToken', token);
    //     //   });
    //     // }
    //   });
    //   window.FCMPlugin.onNotification(function (data) {
    //     console.log("forgran1: ", data)
    //     var notiApplicantId = '';
    //     var myApplicantId = '';
    //     if(data.applicant){
    //       notiApplicantId = JSON.parse(data.applicant).id;
    //     }
    //     if(localStorage.getItem('obj')){
    //       myApplicantId = JSON.parse(localStorage.getItem('obj')).userId;
    //     }
    //     // data['date'] = new Date();
    //     // var notificationList = JSON.parse(localStorage.getItem('notificationList'))
    //     // if (notificationList != null) {
    //     //   notificationList.push(data)
    //     //   localStorage.setItem('notificationList', JSON.stringify(notificationList))
    //     // } else {
    //     //   localStorage.setItem('notificationList', JSON.stringify([data]))
    //     // }
    //     // var counter  = JSON.parse(localStorage.getItem('notiCounter')) +1
    //     // localStorage.setItem('notiCounter', counter)
    //     // store.dispatch({ type: 'SET_NOTI_COUNTER', payload: counter})
    //     var myNotiData = {
    //       page: data.page
    //     }
    //     if (data.wasTapped) {
    //       //Notification was received on device tray and tapped by the user.
    //       localStorage.setItem('notiRedPage', JSON.stringify(data));
    //     } else {
    //       //Notification was received in foreground. Maybe the user needs to be notified.
    //       // localStorage.setItem('notiRedPage', JSON.stringify(data));
    //       // if(notiApplicantId != myApplicantId){
    //       // store.dispatch({ type: 'SET_FORE_GROUND_NOTI', payload: JSON.stringify(data) })
    //       // console.log("SET_FORE_GROUND_NOTI Dispatch called")
    //       if(1){
    //         window.cordova.plugins.notification.local.schedule({
    //           title: data.title,
    //           text: data.body,
    //           page: data.page,
    //           msgid: data.msgid,
    //           chatType: data.chatType ? data.chatType : '',
    //           caseId: data.caseId ? data.caseId : '',
    //           senderObj: data.senderObj ? data.senderObj : '',
    //           applicant: data.applicant ? data.applicant : '',
    //           additionalInfo: data.additionalInfo ? data.additionalInfo : '',
    //           foreground: true
    //         });
    //       }
    //     }
    //   });
    //   // Foreground Local notification clicked
    //   // window.cordova.plugins.notification.local.on("click", function (notification) {
    //   //   console.log("forgran2: ", notification)
    //   //   if (window.location.hash != "#/layout/peerchat" || window.location.hash != "#/layout/chatwindow") {
    //   //     store.dispatch({ type: 'SET_NOTI_OBJ', payload: JSON.stringify(notification) })
    //   //   }
    //   // });
    // }
    navigator.splashscreen.hide();
    document.addEventListener("resume", onResume, false);
    document.addEventListener("pause", onPause, true);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
  }, false);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
