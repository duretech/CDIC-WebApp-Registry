import React, { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import Grid from "@material-ui/core/Grid";
import Globalclasses from "../../App.module.css";
import "../../assets/css/customstyles.css";
import { apiServices } from "../../services/apiServices";
import AlertList from "./AlertList";
import { CircularLoader, CenteredContent } from "@dhis2/ui";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Pagination from "@material-ui/lab/Pagination";
import SearchBar from "../../component/searchbar/SearchBar";
import Button from "@material-ui/core/Button";

import _ from "lodash";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
//import { Configuration } from "../../assets/data/config";
import OfflineDb from "../../db";
import "../../assets/css/customstyles.css";
//import "../../assets/css/theme_grey.css";
import "../../assets/css/theme_blue.css";
// import "../../assets/css/theme_green.css";
// import "../../assets/css/theme_red.css";
import FooterMenu from '../../component/layout/FooterMenu'
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Alerts = () => {
  const { t } = useTranslation();
  const [alertsList, setAlertslist] = useState([]);
  const [alertsListFiltered, setAlertsListFiltered] = useState([]);
  const [input, setInput] = useState("");
  const [searchAllResult, setSearchAllResult] = useState([]);
  // const [sessionUserBoValue, setSessionUserBoValue] = useState(
  //   JSON.parse(sessionStorage.getItem('userBO')) || JSON.parse(localStorage.getItem('userBO'))
  // )
  const [Configuration,setConfiguration] = useState(null);
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [progarmData, setProgarmData] = useState(null);
  const [viewType, setViweType] = useState("list");
  //const [loading, setGlobalSpinner] = useState(true);
  const classes = useStyles();
  const [alertType, setAlertType] = useState("");
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  //pagination code
  //const itemsPerPage = Configuration.pagination.itemsPerPage;
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);
  const [offset, setoffset] = useState(0);
  const [showLoadMore, setshowLoadMore] = useState(false);
  const [firstName, setFirstName] = useState(null);
  
  async function getMetaData() {
    let metadata = await OfflineDb.getDataFromPouchDB("metaData");
    setProgarmData(metadata.data);

    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);

    let configurations = await OfflineDb.getDataFromPouchDB('configurations')
    setConfiguration(configurations.data.configuration)
  }
  useEffect(() => {
    getMetaData();
  }, []);

  useEffect(() => {
    if (sessionUserBoValue != null && progarmData != null && Configuration != null)  {
      getAlertList();
    }
    if (progarmData?.trackedEntityAttributes?.length) {
      const firstNameAttribute = progarmData.programs[0].programTrackedEntityAttributes.find(
          (attr) => attr.trackedEntityAttribute.description === "First Name"
      );
      if (firstNameAttribute) {
          setFirstName(firstNameAttribute.trackedEntityAttribute.id);
      }
    }
  }, [sessionUserBoValue, progarmData, offset,Configuration]);

  useEffect(() => {
    if (alertsListFiltered.length > 0) {
      setNoOfPages(Math.ceil(alertsListFiltered.length / Configuration.pagination.itemsPerPage));
    }
  }, [alertsListFiltered]);

  const getAlertList = () => {
    setGlobalSpinner(true);
    // const subURL = `alerts/list?ouid=${sessionUserBoValue.organisationUnits[0].id}&programid=${sessionUserBoValue.programs[0]}&pageSize=50&skipPaging=true&paging=true`;
    const subURL = `alerts/list?ouid=${sessionUserBoValue.organisationUnits[0].id}&programid=${sessionUserBoValue.programs[0]}&pageSize=${Configuration.pagination.fetchNoOfRecords}&offset=${offset}&skipPaging=false&paging=false&page=1&totalPages=false`;

    //nw alerts/list?ouid=hraeB0GD2o8&programid=i1yaRN8esOJ&pageSize=100&page=1&totalPages=false

    //w alerts/list?ouid=hraeB0GD2o8&programid=i1yaRN8esOJ&pageSize=50&skipPaging=true&paging=true

    apiServices
      .getAPI(subURL)
      .then((response) => {
        if(response.data.data.length == 0) {
          swal({
            title: t("No record found"),
            button: t("Close"),
          });
          setGlobalSpinner(false);
          return;
        }
        // console.log('response:', response)
        setAlertslist([...alertsList, ...response.data.data]);
        setAlertsListFiltered([...alertsListFiltered, ...response.data.data]);
        setSearchAllResult([...searchAllResult, ...response.data.data]);
        setGlobalSpinner(false);
      })
      .catch((err) => {
        swal({
          title: t("Error"),
          text: navigator.onLine ? t(err) : t("Data could not be shown in offline mode."),
          icon: "error",
          button: "Close",
        });
        setGlobalSpinner(false);
      });
  };

  const handleChange = (event) => {
    if (event.target.value == "ALL") {
      setAlertsListFiltered(alertsList);
    } else {
      let filteredList = _.filter(alertsList, [
        "alertname",
        event.target.value,
      ]);

      setAlertsListFiltered(filteredList);
    }
    setAlertType(event.target.value);
  };

  const handleViewChange = (event, newValue) => {
    setViweType(newValue);
  };

  const loadMore = () => {
    setoffset(offset + 100);
  };

  const handlePageChange = (event, value) => {
    console.log("handlePageChange>>", event, value, noOfPages);
    setPage(value);

    if (value == noOfPages) {
      setshowLoadMore(true);
    } else {
      setshowLoadMore(false);
    }
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
  const updateInput = (input) => {
    setInput(input);
    let filteredList = [];
    setGlobalSpinner(true);
    if (input && input.length > 2) {
      searchAllResult.map(function (objectKey, index) {
        // console.log("searchAllResult", objectKey,firstName,objectKey[firstName]);
        //objectKey.map(function(data, j) {
        if (
          objectKey[firstName] && 
          objectKey[firstName]
            .toLowerCase()
            .indexOf(input.toLowerCase()) > -1
        ) {
          filteredList.push(objectKey);
        }
        //})
      });
      //console.log(filteredList)
      // let headerEle = searchAllResult[0]
      // let filterSearchArray = [];
      // filterSearchArray.push(headerEle)
      // filterSearchArray.push(filteredList)
      setAlertsListFiltered([]);
      setTimeout(function () {
        setGlobalSpinner(false);
        setAlertsListFiltered(filteredList);
      }, 500);
    } else {
      if (input.length == 0) {
        // let headerEle = searchAllResult[0]
        // let filterSearchArray = [];
        // filterSearchArray.push(headerEle)
        // filterSearchArray.push(searchAllResult[1])
        setAlertsListFiltered([]);
        setTimeout(function () {
          setGlobalSpinner(false);
          setAlertsListFiltered(searchAllResult);
        }, 1000);
      } else {
        setGlobalSpinner(false);
      }
    }
  };

  const filterAlerts = () => {
    const uniqueAlerts = [...new Set(alertsList.map((obj) => obj.alertname))];

    return (
      <div>
        <FormControl className={classes.formControl} style={{paddingLeft:"0px"}}>
          <InputLabel id="demo-simple-select-label">
            {/* {t("Please Select")} */}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={alertType}
            onChange={handleChange}
          >
            <MenuItem value="ALL">{t("All")}</MenuItem>
            {uniqueAlerts.map((item) => {
              return <MenuItem value={item}>{t(item)}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </div>
    );
  };
  return (
    <div className={Globalclasses.container}>
      <main
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
        {Configuration ? 
        <section
          className=" searchcustombg searchtabmaindiv searchformcontainer alertspage alertPageSection"
          style={{
            // backgroundColor: "#fff",
            flexGrow: 1,
            padding: 0,
          }}
        >
          <FooterMenu></FooterMenu>
          {/* {alertsListFiltered.length > 0 ? loadViewToggleButtons() : null} */}
          {/* {loading ?
            <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
              <CircularLoader large dataTest="dhis2-uicore-circularloader" />
            </CenteredContent>
            : ""
          } */}
          <Grid container spacing={3} className="mb-30px pl-0px alertSubMainSection">
           <Grid container spacing={2} className="d-flex justify-content-center align-items-center alertsFields">
            <Grid item xs={0} sm={4} md={6} lg={7} className="pl-0"><p className="alertformheading">{t("Alerts")}</p></Grid>
            <Grid item xs={12} sm={8} md={6} lg={5} className="alert_divFields">
              <Grid container spacing={3} className="searchBarMainSection">
                <Grid item xs={12} sm={6} md={6} className="searchBarSection pl-0px">
                  
                  <SearchBar input={input} setKeyword={updateInput} />
                </Grid>
                <Grid item xs={12} sm={6} md={6} className="pl-0px pr-0px">
                  <div className="choose_alertdiv">{filterAlerts()}</div>
                </Grid>

              </Grid>
            </Grid>
           </Grid>
           
            
            {/* {alertsListFiltered.map((alert, id) => {
              return progarmData != null ? (
                <AlertList
                  key={id}
                  alertdata={alert}
                  progarmData={progarmData}
                  viewType={viewType}
                />
              ) : (
                <> </>
              );
            })} */}

            {alertsListFiltered
              .slice((page - 1) * Configuration.pagination.itemsPerPage, page * Configuration.pagination.itemsPerPage)
              .map((alert, id) => {
                return progarmData != null ? (
                  <AlertList
                    key={id}
                    alertdata={alert}
                    progarmData={progarmData}
                    viewType={viewType}
                  />
                ) : (
                  <> </>
                );
              })}

            <Pagination
              count={noOfPages}
              page={page}
              onChange={handlePageChange}
              defaultPage={1}
              //color="primary"
              size="large"
              showFirstButton
              showLastButton
              variant="outlined"
              shape="rounded"
            />

            {showLoadMore && (
              <Button
                variant="contained"
                color="primary"
                className="btn-load-more"
                onClick={() => loadMore()}
              >
                Load More
              </Button>
            )}
          </Grid>
        </section>
        :<></>
        }
      </main>
    </div>
  );
};

export default Alerts;
