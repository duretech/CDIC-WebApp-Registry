import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { withTranslation, useTranslation, Trans } from "react-i18next";
import QrReader from "react-qr-reader";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faTimes } from "@fortawesome/free-solid-svg-icons";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CreateField from "../../component/fields/CreateSearchField";
import swal from "sweetalert";
import SearchResults from "./SearchResults";
import { apiServices } from "../../services/apiServices";
import OfflineDb from "../../db";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import AppBar from "@material-ui/core/AppBar";
import {
  Button,
  ButtonStrip,
  Divider,
  InputFieldFF,
  SingleSelectFieldFF,
  ReactFinalForm,
  hasValue,
  InputField,
  CircularLoader,
  CenteredContent,
  SingleSelect,
  SingleSelectOption,
} from "@dhis2/ui";
//import { Configuration } from "../../assets/data/config";

function Search() {
  const [value, setValue] = useState(0);
  const [metaData, setMetaData] = useState(null);
  const [sessionUserBoValue, setSessionUserBoValue] = useState(null);
  const [showScanner, setshowScanner] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const { Form, Field } = ReactFinalForm;
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const [viewType, setViweType] = useState("list");
  //const searchPageMeta = Configuration.searchpage;
  const [Configuration,setConfiguration] = useState(null);
  const history = useHistory();

  async function getMetaData() {
    let metadata = await OfflineDb.getDataFromPouchDB("metaData");
    setMetaData(metadata.data);

    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);
    
    let configurations = await OfflineDb.getDataFromPouchDB('configurations')
    setConfiguration(configurations.data.configuration)
  }

  useEffect(() => {
    //OfflineDb.removeDataFromPouchDB('transferFlag')
    OfflineDb.setDataIntoPouchDB("transferFlag", { type: null });
    getMetaData();
  }, []);
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        className="reginnertabcontainer"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  // TabPanel.propTypes = {
  //     children: PropTypes.node,
  //     index: PropTypes.any.isRequired,
  //     value: PropTypes.any.isRequired,
  // };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }));
  const classes = useStyles();

  function createCustomSearchForm() {
    const rulesObject = {
      programRule: [],
      programRuleVariable: [],
    };
    let attributes = metaData.programs[0].programTrackedEntityAttributes;
    return (
      <Form
        onSubmit={(values) => searchAPI(values, null, 2)}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form className="fullWidth" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {attributes.map((attribute, i) => {
                if (
                  attribute.searchable &&
                  attribute.trackedEntityAttribute.displayName
                    .trim()
                    .toLowerCase() != "qr code"
                ) {
                  return (
                    <CreateField
                      fieldData={attribute}
                      values={values}
                      programRules={[]}
                      programData={metaData.programs[0]}
                      programRulesVariables={[]}
                    />
                  );
                  // return <CreateField fieldData ={attribute} values={values} form={form} programRules={rulesObject} key={i}/>
                }
              })}
            </Grid>

            <div className="buttons">
              <Button
                className="regformsubmitbtn"
                type="submit"
                // disabled={submitting}
              >
                <Trans>Submit</Trans>
              </Button>
              <Button
                className="regformsubmitbtn regformresetbtn"
                type="button"
                onClick={() => form.reset()}
                // disabled={submitting || pristine}
              >
                <Trans>Reset</Trans>
              </Button>
            </div>

            {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
          </form>
        )}
      />
    );
  }

  function createUICSearchForm() {
    const rulesObject = {
      programRule: [],
      programRuleVariable: [],
    };
    let attributes = metaData.programs[0].programTrackedEntityAttributes;
    return (
      <Form
        onSubmit={(values) => searchAPI(values, null, 2)}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form className="fullWidth" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {attributes.map((attribute, i) => {
                if (attribute.trackedEntityAttribute.unique) {
                  return (
                    <CreateField
                      key={i}
                      fieldData={attribute}
                      values={values}
                      form={form}
                      programRules={rulesObject}
                    />
                  );
                }
              })}
            </Grid>

            <div className="buttons">
              <Button
                className="regformsubmitbtn"
                type="submit"
                disabled={submitting}
              >
                <Trans>Submit</Trans>
              </Button>
              <Button
                className="regformsubmitbtn regformresetbtn"
                type="button"
                onClick={() => form.reset()}
                // disabled={submitting || pristine}
              >
                <Trans>Reset</Trans>
              </Button>
            </div>

            {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
          </form>
        )}
      />
    );
  }

  function handleQRScan(data) {
    if (data) {
      setshowScanner(false);
      let obj = {};
      metaData.programs[0].programTrackedEntityAttributes.map((attribute) => {
        if (
          attribute.renderType &&
          attribute.renderType["DESKTOP"].type == "QR_CODE"
        ) {
          obj[attribute.trackedEntityAttribute.id] = data;
        }
      });
      searchAPI(obj);
    }
  }

  function qrErrorhandler(err) {
    setshowScanner(false);
    alert(err);
  }
  function openCordovaQrScannerOldNotInUse() {
    window.QRScanner.prepare(onDone); // show the prompt

    function onDone(err, status) {
      if (err) {
        // here we can handle errors and clean up any loose ends.
        alert("QRSacnner prepare Err: ", err);
      }
      if (status.authorized) {
        // W00t, you have camera access and the scanner is initialized.
        // QRscanner.show() should feel very fast.
        window.QRScanner.scan(displayContents);
        window.QRScanner.resumePreview(function (status) {});
        // Make the webview transparent so the video preview is visible behind it.
        window.QRScanner.show(function (status) {});
        window.document.querySelector("body").style.opacity = 0;
      } else if (status.denied) {
        alert("access denied");
        // The video preview will remain black, and scanning is disabled. We can
        // try to ask the user to change their mind, but we'll have to send them
        // to their device settings with `QRScanner.openSettings()`.
      } else {
        // we didn't get permission, but we didn't get permanently denied. (On
        // Android, a denial isn't permanent unless the user checks the "Don't
        // ask again" box.) We can ask again at the next relevant opportunity.
      }
    }
    function displayContents(err, text) {
      if (err) {
        alert("displayContentsErr", err);
        // an error occurred, or the scan was canceled (error code `6`)
      } else {
        // The scan completed, display the contents of the QR code:

        //setTimeout(function(){
        window.QRScanner.hide();
        window.document.querySelector("body").style.opacity = "";
        //}, 3000);
        handleQRScan(text);
      }
    }
  }
  function openCordovaQrScanner() {
    let that = this;
    window.cordova.plugins.barcodeScanner.scan(
      function (result) {
        handleQRScan(result.text);
      },
      function (error) {},
      {
        preferFrontCamera: false, // iOS and Android
        showFlipCameraButton: true, // iOS and Android
        showTorchButton: false, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        prompt: "Place a barcode inside the scan area", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        //orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations: true, // iOS
        disableSuccessBeep: false, // iOS
      }
    );
  }
  function openQrSacnner() {
    if (window.cordova) {
      openCordovaQrScanner();
    } else {
      setshowScanner(true);
    }
  }

  function searchAPI(param) {
    //const metaData = JSON.parse(localStorage.getItem('metaData')) || '';
    //const sessionUserBoValue = JSON.parse(sessionStorage.getItem('userBO')) || JSON.parse(localStorage.getItem('userBO'))
    setLoading(true);
    let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
      programID = sessionUserBoValue.programs[0], //`nSy7PFqQykt`,
      searchQuery = ``;

    for (var i in param) {
      searchQuery += `&attribute=${i}:LIKE:${param[i]}`;
    }
    let subURL =
      "trackedEntityInstances/query.json?ou=" +
      orgID +
      "&ouMode=ACCESSIBLE&&order=created:desc&program=" +
      programID +
      searchQuery +
      "&pageSize=50&page=1&totalPages=false";

    apiServices
      .getAPI(subURL)
      .then((res) => {
        let searchArray = [];
        searchArray.push(res.data.headers);
        searchArray.push(res.data.rows);
        setSearchResult(searchArray);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        swal({
          title: t("Error"),
          text: t(
            "At least 1 attributes should be mentioned in the search criteria."
          ),
          icon: "error",
          button: t("Close"),
        });
      });
  }

  function createQRFrom() {
    return (
      <div
        className="searchformcontainer qrreaderholder"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showScanner ? (
          <QrReader
            delay={300}
            onError={() => qrErrorhandler()}
            onScan={() => handleQRScan()}
            style={{ width: "50%" }}
          />
        ) : (
          <p className="qrIcon" onClick={() => openQrSacnner()}>
            <FontAwesomeIcon className="fa-5x" icon={faQrcode} />
          </p>
        )}
      </div>
    );
  }

  function newCaseClick() {
    OfflineDb.removeDataFromPouchDB("activeCaseDetails");
    OfflineDb.removeDataFromPouchDB("activeCaseFormData");
    OfflineDb.removeDataFromPouchDB("linkContactFlag");
    OfflineDb.setDataIntoPouchDB("transferFlag", { type: null });
    history.push("/layout/registration");
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleViewChange = (event) => {
    setViweType(event.target.value);
  };

  const loadViewToggleButtons = () => {
    return (
      <div className=" customregistrationtabs regcasetabs ">
        <AppBar position="static">
          <Tabs value={viewType} onChange={handleViewChange}>
            <Tab value="list" label={t("List View")}></Tab>
            <Tab value="card" label={t("Card View")}></Tab>
          </Tabs>
        </AppBar>
      </div>
    );
  };

  return (
    <section className="searchcustombg" style={{ flexGrow: 1, padding: 20 }}>
      <div className="searchformcontainer">
        <p className="searchformheading">
          {/* <Trans>Search</Trans> */}
          {t("Search")}
        </p>

        <div className="searchtabscontainer">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            variant="fullWidth"
          >
            {Configuration && Configuration.searchpage.tabsList.map((tabdetails, i) => {
              if (tabdetails.showMenu) {
                return (
                  <Tab
                    className="whitetext"
                    key={i}
                    style={{ color: "#fff !important" }}
                    label={t(tabdetails.name)}
                    {...a11yProps(i)}
                  />
                );
              }
            })}
          </Tabs>

          <TabPanel
            value={value}
            index={0}
            className={classes.paddingclass}
            style={{ padding: "20px 0px !important" }}
          >
            {metaData != null ? createCustomSearchForm() : null}
          </TabPanel>

          <TabPanel
            value={value}
            index={1}
            className={classes.paddingclass}
            style={{ padding: "20px 0px !important" }}
          >
            {metaData != null ? createUICSearchForm() : null}
          </TabPanel>

          <TabPanel
            value={value}
            index={2}
            className={classes.paddingclass}
            style={{ padding: "20px 0px !important" }}
          >
            {metaData != null ? createQRFrom() : null}
          </TabPanel>
        </div>
        {loading ? (
          <CenteredContent
            dataTest="dhis2-uicore-centeredcontent"
            position="middle"
          >
            <CircularLoader large dataTest="dhis2-uicore-circularloader" />
          </CenteredContent>
        ) : (
          ""
        )}
        {searchResult.length > 0 ? loadViewToggleButtons() : null}
        {searchResult.length > 0 ? (
          <>
            <p className="searchformheading">
              {t("Search Results")} :
              {searchResult[1].length == 0 ? (
                <>
                  {t("No result found. Do you want to register the client?")}
                  <button
                    style={{ marginLeft: "20px" }}
                    className="regformsubmitbtn"
                    onClick={() => newCaseClick()}
                  >
                    {t("Add New Client")}
                  </button>{" "}
                </>
              ) : null}
            </p>
            <SearchResults
              searchResult={searchResult}
              viewType={viewType}
              metaData={metaData}
            />
          </>
        ) : null}
      </div>
    </section>
  );
}

export default Search;
