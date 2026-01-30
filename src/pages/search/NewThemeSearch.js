import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { withTranslation, useTranslation, Trans } from "react-i18next";
import { APP_LOCALE } from '../../../src/assets/data/config.js';
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
import SearchResults from "./NewThemeSearchResults";
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
import _ from "lodash";
import FooterMenu from "../../component/layout/FooterMenu";
import { buildSearchQuery} from '../../config/validationutils';

import moment from "moment";
import { decryptData, encryptData } from "../../imon/encryption/AesEnc";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {createFormAutoFocusRef,useKeyboardAccessibility} from "../../component/fields/keyboardHelper.js";

function Search() {
  const [value, setValue] = useState(0);
  const [metaData, setMetaData] = useState(null);
  const [sessionUserBoValue, setSessionUserBoValue] = useState(null);
  const [showScanner, setshowScanner] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchFilter, setsearchFilter] = useState({});
  const [specimenSearchType, setspecimenSearchType] = useState(null);
  const { Form, Field } = ReactFinalForm;
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const [viewType, setViweType] = useState("list");
  //const searchPageMeta = Configuration.searchpage;
  const history = useHistory();
  const [stageDetail, setStageDetail] = useState(null);
  const [dataElementDetail, setdataElementDetail] = useState(null);
  const [qrDataElementDetail, setqrDataElementDetail] = useState(null);
  const [Configuration, setConfiguration] = useState(null);
  
  let customfieldobj = {
    ["regPhoneNumberCodeId"]:"VIJiZQU2PXq",
    ["patientContactNumberCodeId"]:"kJkHAwGWzUn",
    ["additionalPatientCodeId"]:"lvSkzdI31Vd",
    ["parentContactNumberCodeId"]:"kLyYgSPhomO",
    ["regPhoneNumberId"]:"yWVcgcKShNM",
    ["parentContactNumber"]:"lPFhd9VsKGB",
    ["patientContactNumber"]:"QDBh1vxjR10",
    ["additionalPatientNumber"]:"QDBh1vxjR10",
    ["uicId"]: "Ea27uAHNmEi", 
    ["genderUID"]: "kcgXITYplrR", 
    ["regPhoneNumberCodeId"]: "VIJiZQU2PXq",
    ["nationalIdNumber"]: "xOIphl6fxg8",

  }
  const uicformAutoFocusRef = createFormAutoFocusRef();
  const formAutoFocusRef = createFormAutoFocusRef();
  useKeyboardAccessibility(value);
  async function getMetaData() {
    let metadata = await OfflineDb.getDataFromPouchDB("metaData");
    setMetaData(metadata.data);

    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);

    let configurations = await OfflineDb.getDataFromPouchDB("configurations");
    setConfiguration(configurations.data.configuration);
  }

  useEffect(() => {
    getMetaData();
    OfflineDb.removeDataFromPouchDB("activeCaseDetails");
    OfflineDb.removeDataFromPouchDB("activeCaseFormData");
    OfflineDb.setDataIntoPouchDB("transferFlag", { type: null });
  }, []);

  useEffect(() => {
    //FOR SAMPLE COLLECTION
    getSampleCollectionStageDetail();
  }, [metaData, Configuration]);

  const useDeviceType = () => {
  const getType = () =>
    window.innerWidth <= 600
      ? "mobile"
      : window.innerWidth <= 1279
      ? "tablet"
      : "desktop";

  const [deviceType, setDeviceType] = useState(getType());

  useEffect(() => {
    const handleResize = () => setDeviceType(getType());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceType;
};

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

  const getSampleCollectionStageDetail = () => {
    if (metaData != null && Configuration != null) {
      metaData.programs[0].programStages.map((stage) => {
        if (
          stage.description &&
          stage.description === Configuration.searchpage.searchby.stagename
        ) {
          setStageDetail(stage);
          stage.programStageDataElements.map((field) => {
            if (
              field.dataElement.description ===
              Configuration.searchpage.searchby.dataelement
            ) {
              setdataElementDetail(field.dataElement);
            }
            if (
              field.renderType &&
              field.renderType["DESKTOP"] &&
              field.renderType["DESKTOP"].type == "QR_CODE"
            ) {
              setqrDataElementDetail(field.dataElement);
            }
          });
        }
      });
    }
  };

  function createCustomSearchForm(searchFilter) {
    const rulesObject = {
      programRule: [],
      programRuleVariable: [],
    };
    let attributes = metaData.programs[0].programTrackedEntityAttributes;
    return (
      <Form
        onSubmit={(values) => searchAPI(values, null, 2)}
        initialValues={searchFilter}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form ref={formAutoFocusRef} className="fullWidth innerdiv innerTabSearch" onSubmit={handleSubmit}>
            <div className="">
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
              {APP_LOCALE === "CC002" ? (
                // Return blank/null when locale is CAMEROON
                null
              ) : (
                // Otherwise display identification details
                <Typography component="span" className="accordionHeading">
                  {t("Identification Details")}
                </Typography>
              )}
              </AccordionSummary>
              <AccordionDetails className="searchDetailsDiv ">
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
                        customfieldobj={customfieldobj}
                      />
                    );
                    // return <CreateField fieldData ={attribute} values={values} form={form} programRules={rulesObject} key={i}/>
                  }
                })}
              </Grid>
               </AccordionDetails>
                              </Accordion>
            </div>
            <div className="buttons buttonFlex pl-0px p4-0px d-flex justify-content-end align-items-center">
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
                onClick={() => {
                  form.reset();
                  setsearchFilter({});
                  resetSearch();
                }}
                // disabled={submitting}
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

  function createUICSearchForm(searchFilter) {
    const rulesObject = {
      programRule: [],
      programRuleVariable: [],
    };
    let attributes = metaData.programs[0].programTrackedEntityAttributes;
    return (
      <Form
        onSubmit={(values) => searchAPI(values, null, 2)}
        initialValues={searchFilter}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form ref={uicformAutoFocusRef} className="fieldsearchform" onSubmit={handleSubmit}>
            <Grid container spacing={3} className="UICMainSection">
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

            <div className="buttons buttonFlex d-flex justify-content-end">
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
                onClick={() => {
                  form.reset();
                  setsearchFilter({});
                  resetSearch();
                }}
                // disabled={submitting}
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

  function handleQRScanForSpecimen(data) {
    // console.log('handleQRScanForSpecimen>>', data)
    if (data) {
      setshowScanner(false);
      let obj = {};
      metaData.programs[0].programStages.map((stage) => {
        if (
          stage.displayName &&
          stage.displayName === Configuration.searchpage.searchby.stagename
        ) {
          stage.programStageDataElements.map((field) => {
            if (
              field.renderType &&
              field.renderType["DESKTOP"] &&
              field.renderType["DESKTOP"].type == "QR_CODE"
            ) {
              // setqrDataElementDetail(field.dataElement)
              obj[field.dataElement.id] = data;
            }
          });
        }
      });

      searchBySpecimenId(obj, null, 2, "qr");
    }
  }

  const closeQrScanner = () => {
    setshowScanner(false);
  };

  function createQRForSpecimen() {
    return (
      <>
        {showScanner ? (
          <>
            <QrReader
              delay={300}
              onError={() => qrErrorhandler()}
              onScan={(e) => handleQRScanForSpecimen(e)}
              style={{ width: "50%" }}
            />
            <button onClick={() => closeQrScanner()}>Close</button>
          </>
        ) : (
          <p className="qrIcon" onClick={() => openQrSacnnerForSpecimen()}>
            <FontAwesomeIcon className="fa-5x" icon={faQrcode} />
          </p>
        )}
      </>
    );
  }

  function createSpecimenSearchForm(searchFilter) {
    return (
      <Grid container spacing={3} className="searchbyGrid">
        <Grid xs={12} md={4}>
          <Form
            onSubmit={(values) => searchBySpecimenId(values, null, 2, "id")}
            initialValues={searchFilter}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form id="searchby-specimen" onSubmit={handleSubmit}>
                <Grid xs={12} md={12}>
                  <Field
                    name={
                      dataElementDetail ? dataElementDetail.id : "specimen-id"
                    }
                    label={t("Specimen Id")}
                    component={InputFieldFF}
                    key={
                      dataElementDetail ? dataElementDetail.id : "specimen-id"
                    }
                    className=""
                    required
                  />
                </Grid>
                <Grid xs={12} md={12}>
                  <div className="buttons btn-specimen">
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
                      onClick={() => {
                        form.reset();
                        setsearchFilter({});
                        resetSearch();
                      }}
                      // disabled={submitting}
                    >
                      <Trans>Reset</Trans>
                    </Button>
                  </div>
                </Grid>
              </form>
            )}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <h4 className="text-center">OR</h4>
        </Grid>
        <Grid xs={12} md={4}>
          {createQRForSpecimen()}
        </Grid>
      </Grid>
    );
  }

  function handleQRScan(data) {
    if (data) {
      setshowScanner(false);
      let obj = {};
      metaData.programs[0].programTrackedEntityAttributes.map((attribute) => {
        if (
          attribute.renderType &&
          attribute.renderType["DESKTOP"] &&
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
    if(err == undefined){
      err = "Data could not be shown in offline mode"
    }
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

  function openQRScanner(type){
    let that = this;
    window.cordova.plugins.barcodeScanner.scan(
      function (result) {
        if(type == 'specimen'){
          handleQRScanForSpecimen(result.text);
        }else{
          handleQRScan(result.text);
        }
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
  function openCordovaQrScannerForSpecimen() {
    openQRScanner('specimen')
  }
  function openCordovaQrScanner() {
    openQRScanner('registration')
  }
  function openQrSacnner() {
    if (window.cordova) {
      openCordovaQrScanner();
    } else {
      setshowScanner(true);
    }
  }

  function openQrSacnnerForSpecimen() {
    if (window.cordova) {
      openCordovaQrScannerForSpecimen();
    } else {
      setshowScanner(true);
    }
  }

  function searchAPI(param, event) {
    if(navigator.onLine){
    console.log("searchAPI>>", param, event);
    if (!param || typeof param !== "object") {
      // Ensure param is a valid object
      swal({
          title: t("Error"),
          text: t("Invalid search parameters. Please try again."),
          icon: "error",
          button: t("Close"),
      });
      return;
  }
  const allFieldsEmpty = Object.values(param).every(
    (value) => value === null || value === undefined || value.trim() === ""
);

if (allFieldsEmpty) {
    swal({
        title: t("Error"),
        text: t("Please fill in at least one search parameter."),
        icon: "warning",
        button: t("Close"),
    });
    return; // Prevent further execution
}
    if(param && Object.keys(param).length>0)
    {
    setsearchFilter(param);
    //const metaData = JSON.parse(localStorage.getItem('metaData')) || '';
    //const sessionUserBoValue = JSON.parse(sessionStorage.getItem('userBO')) || JSON.parse(localStorage.getItem('userBO'))
    setLoading(true);
    let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
      programID = sessionUserBoValue.programs[0], //`nSy7PFqQykt`,
      searchQuery = ``;

    // for (var i in param) {
    //   if(moment(param[i]).format('YYYY-MM-DD') != 'Invalid date'){
    //     searchQuery += `&attribute=${i}:LIKE:${moment(param[i]).format('YYYY-MM-DD')}`;  
    //   }else
    //   searchQuery += `&attribute=${i}:LIKE:${param[i]}`;
    // }
    //searchQuery = buildSearchQuery(param, "newthemesearch");

    for (var i in param) {
      if(param[i]){
        if(i!= customfieldobj.uicId && i != customfieldobj.regPhoneNumberCodeId  && moment(param[i]).format('YYYY-MM-DD') != 'Invalid date'){
          searchQuery += `&attribute=${i}:LIKE:${moment(param[i]).format('YYYY-MM-DD')}`;
        }
  
        // While we use the "LIKE" parameter in the API payload for list of similar names to appear (Ex: user wants to search all the test cases,
        // he will just type "test" and all the versions ie "test0", "test1" etc will appear.)
        // However in case of gender, since the word "male" is already similar to "female", it will render all females and male patients, hence
        // we use "EQ" paramater as payload
        else if(i == customfieldobj.genderUID || i == customfieldobj.regPhoneNumberCodeId || i == customfieldobj.patientContactNumber)
          {
            searchQuery += `&attribute=${i}:EQ:${param[i]}`;
          }
        else{
            searchQuery += `&attribute=${i}:LIKE:${encodeURIComponent(param[i].trim())}`;
            console.log("param",searchQuery)
  
          }
      }
    }
    
    let subURL =
      "trackedEntityInstances/query.json?ou=" +
      orgID +
      "&ouMode=ACCESSIBLE&&order=created:desc&program=" +
      programID +
      searchQuery +
      "&pageSize=50&page=1&totalPages=false&skipPaging=true";
      let tempHolder = {
        "type":"GET",
        "url":subURL,
        "data":null
    }
    const encryptedData = encryptData(tempHolder);
    apiServices.postAPI("commonencryption/getDecrypt",{"data":encryptedData})
    // apiServices
    //   .getAPI(subURL)
      .then((res) => {
        res.data = decryptData(res.data)
        let searchArray = [];
        try {
          res.data.headers.map((ele) => {
            if (ele.column && metaData) {
              let fieldBO = _.find(metaData.trackedEntityAttributes, {
                displayName: ele.column,
              });
              if (fieldBO && ele.column != fieldBO.description) {
                ele.column = fieldBO.description;
              }
            }
          });
        } catch (e) {
          console.log(e);
        }
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
    else{
      swal({
        title: "Please fill in the search parameter",
        text: "",
        icon: "warning",
        button: "Close",
      });
    }
    }else{
      setLoading(false);
      swal({
        title: t("Error"),
        text: t(
          "Data could not be shown in offline mode"
        ),
        icon: "error",
        button: t("Close"),
      });
    }
  }

  const searchBySpecimenId = (param, event, a, searchtype) => {
    // console.log("searchBySpecimenId>>", param, event, a, searchtype, sessionUserBoValue, metaData);
    if (Object.keys(param).length > 1) {
      delete param[qrDataElementDetail.id];
    }
    if (searchtype) {
      localStorage.setItem("searchtype", searchtype);
    }
    setsearchFilter(param);
    setLoading(true);
    let orgID = sessionUserBoValue.organisationUnits[0].id,
      programID = sessionUserBoValue.programs[0],
      searchQuery = ``;
    let params = {
      orguid: orgID,
      programuid: programID,
      stageuid: stageDetail ? stageDetail.id : "",
      dataelementuid: Object.keys(param)[0],
      dataelementvalue: Object.values(param)[0],
    };
    // console.log('params>>', params)
    // setLoading(false)
    // return;
    apiServices
      .postAPI("indicators/searchdataelement", params)
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
  };

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

  const resetSearch = () => {
    setSearchResult([]);
    setsearchFilter({});
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    resetSearch();
  };
  const handleViewChange = (event, newValue) => {
    setViweType(newValue);
  };
  const loadViewToggleButtons = () => {
    return (
      <div className=" customregistrationtabs regcasetabs ">
        <AppBar position="static" className="searchviewselecttabbar">
          <Tabs value={viewType} onChange={handleViewChange}>
            <Tab value="list" label={t("List View")}></Tab>
            <Tab value="card" label={t("Card View")}></Tab>
          </Tabs>
        </AppBar>
      </div>
    );
  };
  const deviceType = useDeviceType();
  return (
    <section
    className="searchcustombg searchtabmaindiv searchMainSection  "
      style={{ flexGrow: 1, padding: 0 }}
    >
      <FooterMenu></FooterMenu>
      <div className="searchformcontainer ">
        <p className="searchformheading hide">
          <Trans>Search</Trans>
        </p>

        <div className="searchtabscontainer customregistrationtabs regcasetabs ">
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              variant="fullWidth"
              className="secondheader"
            >
              {Configuration &&
                Configuration.searchpage.tabsList.map((tabdetails, i) => {
                  if ( tabdetails.name !== "Specimen" &&
                      (tabdetails.name !== "QR Scan" || deviceType == "mobile") &&
                      tabdetails.showMenu) {
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
          </AppBar>

          <TabPanel
            value={value}
            index={0}
            style={{ padding: "0px 0px !important" }}
          >
            {metaData != null ? createCustomSearchForm(searchFilter) : null}
          </TabPanel>

          <TabPanel
            value={value}
            index={1}
            className={classes.paddingclass}
            style={{ padding: "20px 0px !important" }}
          >
            {metaData != null ? createUICSearchForm(searchFilter) : null}
          </TabPanel>

          {(deviceType == "mobile") && (
          <TabPanel
              value={value}
              index={2}
              className={classes.paddingclass}
              style={{ padding: "20px 0px !important" }}
            >
              {metaData != null ? createQRFrom() : null}
            </TabPanel>
          )}
          
          <TabPanel
            value={value}
            index={3}
            className={classes.paddingclass}
            style={{ padding: "20px 0px !important" }}
          >
            {metaData != null ? createSpecimenSearchForm(searchFilter) : null}
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
        {/* {searchResult.length > 0 ? loadViewToggleButtons() : null} */}
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
                    {t("Add New Patient")}
                  </button>{" "}
                </>
              ) : null}
            </p>
            <SearchResults
              searchResult={searchResult}
              viewType={viewType}
              metaData={metaData}
              searchFilter={searchFilter}
              caseModule={"Search"}
            />
          </>
        ) : null}
      </div>
    </section>
  );
}

export default Search;
