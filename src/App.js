import React, { createContext, useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";
import loginRoutes from "./router/LoginRoutes";
import newThemeLoginRoutes from "./router/newthemeLoginRoutes";
import indexRoutes from "./router/indexroutes";
import { useIdleTimer } from "react-idle-timer";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";
import OfflineDb from "./db";
import GlobalSpinnerContextProvider from "./context/GlobalSpinnerContext";
import GlobalSpinner from "./component/GlobalSpinner/GlobalSpinner";
import { setLoginUser } from "./redux/actions/action";
import { Configuration } from "./assets/data/config";
import { useLocaleConfiguration } from "./hooks/useLocaleConfiguration";
import { getHtmlConfig } from './config/validationutils'; 
import CookieConsent from './pages/login/CookieConsent';
import Cookies from 'js-cookie';
// import './config/globalStorageOverride';
import { apiServices } from "./services/apiServices";
import { ConfigProvider } from './hooks/ConfigProvider';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const loading = <div className="loading"></div>;

// Create a context to manage cookie consent visibility
export const CookieConsentContext = createContext();

const App = ({ setLoginUser, storeIsLogin }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [hasLoadedConfigOnce, setHasLoadedConfigOnce] = useState(false);
  const [showConfigError, setShowConfigError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineDataExists, setOfflineDataExists] = useState(false);
  const history = useHistory();
  const { t, i18n } = useTranslation();

   // Check cookie status on initial load and show consent if needed
   useEffect(() => {
    const cookiesAccepted = Cookies.get('cookiesAccepted');
    // Show consent dialog on initial load if not already accepted
    if (!cookiesAccepted || cookiesAccepted === 'false') {
      setShowCookieConsent(true);
    }
  }, []);

  // Also show cookie consent when user logs out
  useEffect(() => {
    if (!storeIsLogin) {
      // If user is not logged in (after logout), show consent
      setShowCookieConsent(true);
    }
  }, [storeIsLogin]); 


  useEffect(() => {
    // Check if we're coming from a page refresh
    const needsCheck = localStorage.getItem('checkCookieConsent');
    if (needsCheck) {
      localStorage.removeItem('checkCookieConsent');
      setShowCookieConsent(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.remove(document.body.classList[0]);
    Configuration.theme.name == "Template1"
      ? document.body.classList.add("theme_blue", "theme_novo")
      : document.body.classList.add("theme_red", "theme_novo");
    OfflineDb.getDataFromPouchDB("loginDetails").then((doc) => {
      if (doc.status == 404 && loggedIn) {
        setLoggedIn(false);
      }
    });
  }, [storeIsLogin]);

  const handleOnIdle = (event) => {
    if (loggedIn && navigator.onLine) {
      apiServices.getAPIWithDomain('dhis-web-commons-security/logout.action').then((result) => {
          
      }).catch((err) => {
        
      });
      OfflineDb.getAllEntities().then((res) => {
        if (res == undefined || res.total_rows == 0) {
          localStorage.clear();
          OfflineDb.deleteDatabse()
            .then((res) => {
              setLoginUser(false);
            })
            .catch((err) => {
              setLoginUser(false);
            });
        } else {
          swal({
            title: t("Offline data"),
            text: t("Offline records found, please sync data before logout"),
            icon: "warning",
            buttons: t("Close"),
          });
        }
      });
    }
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 60 * 5,
    onIdle: handleOnIdle,
    // onActive: handleOnActive,
    // onAction: handleOnAction,
    // debounce: 500
  });

  OfflineDb.setPouchDBDatabase();

  const updateLoggedInStatus = () => {
    setLoggedIn(true);
    setLoginUser(true);
  };

  const aIndexRoutes = indexRoutes.map((prop, key) => {
    // if (prop.redirect) {
    //   return <Redirect from={prop.path} to={prop.to} key={key} />;
    // }
    return <Route to={prop.path} component={prop.component} key={key} />;
  });
  const aLoginRoutes = loginRoutes.map((prop, key) => {
    if (prop.redirect) {
      return <Redirect from={prop.path} to={prop.to} key={key} />;
    }
    return (
      <Route
        path={prop.path}
        key={key}
        render={(e) => <prop.component onSuccess={updateLoggedInStatus} />}
      />
    );
  });
  const aNewThemeLoginRoutes = newThemeLoginRoutes.map((prop, key) => {
    if (prop.redirect) {
      return <Redirect from={prop.path} to={prop.to} key={key} />;
    }
    return (
      <Route
        path={prop.path}
        key={key}
        render={(e) => <prop.component onSuccess={updateLoggedInStatus} />}
      />
    );
  });
  
  const { config, loading, error } = useLocaleConfiguration('App');
  
  
  useEffect(() => {
    if(!navigator.onLine){
      return;
    }

    if (loading) {
       
        if (!document.querySelector('.swal-modal')) {
            swal({
                title: t("Loading Configuration..."),
                text: t("Please wait while the configuration is being loaded."),
                icon: "info",
                buttons: false, 
                dangerMode: true,
            });
        }
    } else {
       
       if (document.querySelector('.swal-modal')) {
        swal.close();
    }
    }

    if (error) {
        swal("Error", `Failed to load configuration: ${error.message}`, "error");
    }

    if(config)
    {
      setHasLoadedConfigOnce(true);
      const htmlConfig = getHtmlConfig();
  
      // Set the title
      document.title = htmlConfig.title;
    
      // Set the meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
          metaDescription.setAttribute('content', htmlConfig.metacontent);
      } else {
          metaDescription = document.createElement('meta');
          metaDescription.name = 'description';
          metaDescription.content = htmlConfig.metacontent;
          document.head.appendChild(metaDescription);
      }
    }

}, [loading, error, config]); // React on changes in loading and error state

useEffect(() => {
  checkOfflineDataExists().then((hasData) => {
    setOfflineDataExists(hasData);
  });
}, []);

const checkOfflineDataExists = async () => {
  try {
    const [dataEntryDoc, metadataDoc] = await Promise.all([
      OfflineDb.getDataFromPouchDB("dataEntrySet"),
      OfflineDb.getDataFromPouchDB("matadata")
    ]);

    const hasData =
      (dataEntryDoc && dataEntryDoc.status !== 404) ||
      (metadataDoc && metadataDoc.status !== 404);

    return hasData; // ← true or false
  } catch {
    return false; // ← error = treat as no data
  }
};

if (!config) {
    if (loading) return null;
    if (!navigator.onLine) {
      if(!offlineDataExists){
          return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            padding: '20px'
          }}>
            {/* Offline Icon */}

            {/* Title */}
            <h2 style={{ color: '#e53e3e', marginBottom: '8px' }}>
              {t("You are Offline")}
            </h2>

            {/* Message */}
            <p style={{ color: '#555', fontSize: '16px', marginBottom: '24px', maxWidth: '400px' }}>
              {t("Application configuration could not be loaded.")} 
              {t("Please check your internet connection and go online to sync data.")}
            </p>

            {/* Retry Button */}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px',
                backgroundColor: '#3182ce',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              🔄 {t("Retry Now")}
            </button>

          </div>
        );
      }
    } // ← offline, show nothing
    else{
      if(localStorage.getItem('appConfign') && offlineDataExists){
          //do nothing
      }else{
        return <div>No configuration loaded or failed to load</div>; // ← only show when online + no config
      }
    }
}

  return (
    <ConfigProvider>
    <CookieConsentContext.Provider value={{ showCookieConsent, setShowCookieConsent }}>
      <GlobalSpinnerContextProvider>
        <GlobalSpinner />
        <ToastContainer />
        <BrowserRouter basename={window.cordova ? "/" : "/" + Configuration.basename}>
          <React.Suspense fallback={<div>Loading</div>}>
            <Switch>
              {loggedIn
                ? aIndexRoutes
                : Configuration.theme.name == "Template1"
                ? aLoginRoutes
                : aNewThemeLoginRoutes}
            </Switch>
          </React.Suspense>
        </BrowserRouter>
        {showCookieConsent && <CookieConsent/>}
      </GlobalSpinnerContextProvider>
    </CookieConsentContext.Provider>
  </ConfigProvider>
  );
};

function mapStateToProps(state) {
  const { storeState } = state;
  return { storeIsLogin: storeState.isLoggedIn };
}


export default connect(mapStateToProps, { setLoginUser })(App);

//export default App;
