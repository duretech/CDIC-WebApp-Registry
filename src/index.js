import "./cacheBuster";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./component/translation/i18n";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./assets/css/font.css"
import "./assets/css/fonts/font.js"
import "./assets/css/theme_lightgreen.css";
import "./assets/css/theme_purple.css";
import "./assets/css/theme_amber.css";
import "./assets/css/theme_orange.css";
import "./assets/css/theme_pink.css";
import "./assets/css/theme_dark.css";
import "./assets/css/theme_royalblue.css";
import "./assets/css/theme_red.css";
import "./assets/css/theme_lightblue.css";
import "./assets/css/theme_novo_n.css";
import "./assets/css/theme_novo_p.css";
//import OfflineDbClass from './db'
import axios from "axios";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { loadRuntimeConfig } from "./utils/loadRuntimeConfig";
import { patchConfigurationWithRuntime } from "./assets/data/config";
import { setApiUrls } from "./services/apiServices.js";

const theme = createMuiTheme({
  // typography: {
  //   fontFamily: ["Apis Sans-Serif"].join(","),
  // },
});

const registerAxiosAuthHeaders = () => {
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("BasicAuth");

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  });
};

const startApp = () => {
  loadRuntimeConfig().then(() => {
    patchConfigurationWithRuntime();
    setApiUrls();  
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
  serviceWorker.register();
  registerAxiosAuthHeaders();
});
};

if (window.cordova) {
  document.addEventListener(
    "deviceready",
    () => {
      startApp();
      //alert(window.QRScanner)


      // if (window.cordova && window.cordova.plugins && window.cordova.plugins.permissions) {
      //   const permissions = window.cordova.plugins.permissions;
      //   permissions.requestPermissions(
      //     [
      //       permissions.WRITE_EXTERNAL_STORAGE,
      //       permissions.READ_EXTERNAL_STORAGE,
      //     ],
      //     function (status) {
      //       if (!status.hasPermission) {
      //         alert("Storage permission is required to download PDFs.");
      //       }
      //     },
      //     function () {
      //       alert("Permission request failed.");
      //     }
      //   );
      // }

      
      // window.cordova.plugins.preventscreenshot.disable((res)=>{console.log("res",res)}, (err)=>{console.log(err)})
      // document.addEventListener(
      //   "backbutton",
      //   function (evt) {
      //     if (window.cordova.platformId !== "windows") {
      //       return;
      //     }
      //     if (!window.location.pathname.includes("home")) {
      //       window.history.back();
      //     } else {
      //       throw new Error("Exit"); // This will suspend the app
      //     }
      //   },
      //   false
      // );

      //window.plugins.preventscreenshot.disable((res)=>{}, (err)=>{})
      /*console.log(navigator.connection.type)
    document.addEventListener("offline", function(){
      alert(navigator.connection.type)
    }, false);
    document.addEventListener("online", function(){
      alert(navigator.connection.type)
    }, false);*/
    },
    false
  );
} else {
  startApp();
  //OfflineDb.setDatabase();
}
/*
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();*/
