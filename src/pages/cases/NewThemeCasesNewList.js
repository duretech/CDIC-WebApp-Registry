import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import i18n from "@dhis2/d2-i18n";
import classes from "../../App.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { apiServices } from "../../services/apiServices";
import SearchBar from "../../component/searchbar/SearchBar";
import CaseList from "./NewThemeCaseList";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Pagination from "@material-ui/lab/Pagination";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Fullscreen from "@material-ui/icons/Fullscreen";
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
} from "@dhis2/ui";
import { withTranslation, Trans, useTranslation } from "react-i18next";
import swal from "sweetalert";
import OfflineDb from "../../db";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
//import {Configuration} from '../../assets/data/config'
import "../../assets/css/customstyles.css";
//import '../../assets/css/theme_grey.css'
import "../../assets/css/theme_blue.css";
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'
import _ from "lodash";
import FooterMenu from "../../component/layout/FooterMenu";

const { Form, Field } = ReactFinalForm;

function Cases() {
  const history = useHistory();
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [progarmData, setProgarmData] = useState(null);
  const [customSearch, setCustomSearch] = useState([]);
  const [UICSearch, setUICSearch] = useState([]);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchAllResult, setSearchAllResult] = useState([]);
  const [value, setValue] = useState([]);
  // const [loading,setGlobalSpinner] = useState(false)
  const { t } = useTranslation();
  const [viewType, setViweType] = useState("list");
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  //pagination code
  //const itemsPerPage = Configuration.pagination.itemsPerPage
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);
  const [Configuration, setConfiguration] = useState(null);
  async function getMetaData() {
    let metadata = await OfflineDb.getDataFromPouchDB("metaData");
    setProgarmData(metadata.data);

    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);

    let configurations = await OfflineDb.getDataFromPouchDB("configurations");
    setConfiguration(configurations.data.configuration);
  }
  useEffect(() => {
    getMetaData();
    OfflineDb.removeDataFromPouchDB("activeCaseDetails");
    OfflineDb.removeDataFromPouchDB("activeCaseFormData");
    OfflineDb.removeDataFromPouchDB("linkContactFlag");
    OfflineDb.setDataIntoPouchDB("transferFlag", { type: null });
  }, []);

  //once user bco is set call getContactList function
  useEffect(() => {
    if (sessionUserBoValue != null && Configuration != null) {
      getCasesList();
    }
  }, [sessionUserBoValue, Configuration]);
  useEffect(() => {
    if (searchResult.length > 0 && Configuration != null) {
      setNoOfPages(
        Math.ceil(
          searchResult[1].length / Configuration.pagination.itemsPerPage
        )
      );
    }
  }, [searchResult, Configuration]);

  function getCasesList(param) {
    //localStorage.removeItem('trackedEntityInstance')
    setGlobalSpinner(true);
    let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
      programID = sessionUserBoValue.programs[0], //`nSy7PFqQykt`,
      searchQuery = ``;

    for (var i in param) {
      searchQuery += `&attribute=${i}:LIKE:${param[i]}`;
    }

    let subURL =
      "trackedEntityInstances/query.json?ou=" +
      orgID +
      "&ouMode=SELECTED&program=" +
      programID +
      "&pageSize=" +
      Configuration.pagination.fetchNoOfRecords +
      "&page=1&totalPages=false&skipPaging=true";
    //'trackedEntityInstances/query.json?ou='+ orgID +'&ouMode=SELECTED&&order=created:desc&program='+ programID +'&pageSize=50&page=1&totalPages=false'
    //&pageSize=50&page=1&totalPages=false
    apiServices
      .getAPI(subURL)
      .then((res) => {
        let searchArray = [];
        try {
          res.data.headers.map((ele) => {
            if (ele.column && progarmData) {
              let fieldBO = _.find(progarmData.trackedEntityAttributes, {
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
        //searchArray.push(res.data.rows)
        try {
          searchArray.push(res.data.rows.reverse());
        } catch (e) {
          searchArray.push(res.data.rows);
        }
        setGlobalSpinner(false);
        setSearchResult(searchArray);
        setSearchAllResult(searchArray);
        OfflineDb.setDataIntoPouchDB("myclients", searchArray);
      })
      .catch((error) => {
        setGlobalSpinner(false);
        swal({
          title: "Error",
          text: navigator.onLine
            ? t("Sorry, something went wrong.")
            : t("Data could not be shown in offline mode."),
          icon: "error",
          button: t("Close"),
        });
      });
  }

  const handleViewChange = (event, newValue) => {
    setViweType(newValue);
  };

  const updateInput = (input) => {
    setInput(input);
    let filteredList = [];
    setGlobalSpinner(true);
    if (input && input.length > 3) {
      searchAllResult[1].map(function (objectKey, index) {
        objectKey.map(function (data, j) {
          if (data.toLowerCase().indexOf(input.toLowerCase()) > -1) {
            filteredList.push(objectKey);
          }
        });
      });
      let headerEle = searchAllResult[0];
      let filterSearchArray = [];
      filterSearchArray.push(headerEle);
      filterSearchArray.push(filteredList);
      setSearchResult([]);
      setTimeout(function () {
        setGlobalSpinner(false);
        setSearchResult(filterSearchArray);
      }, 500);
    } else {
      if (input.length == 0) {
        let headerEle = searchAllResult[0];
        let filterSearchArray = [];
        filterSearchArray.push(headerEle);
        filterSearchArray.push(searchAllResult[1]);
        setSearchResult([]);
        setTimeout(function () {
          setGlobalSpinner(false);
          setSearchResult(filterSearchArray);
        }, 1000);
      } else {
        setGlobalSpinner(false);
      }
    }

    //if(filteredList.length > 0){
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
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <section
      className="searchcustombg searchtabmaindiv myclientspage myclientspagelist"
      style={{
        // backgroundColor: '#fff',
        flexGrow: 1,
        padding: 0,
      }}
    >
      <FooterMenu></FooterMenu>
      <div className="searchformcontainer">
        <p className="searchformheading displayFlex">
          <span>
            <Trans>Patient record list</Trans>
          </span>
          <IconButton
            aria-label="share"
            onClick={(e) => {
              history.push("/layout/caseslist");
            }}
          >
            <Fullscreen />
          </IconButton>
        </p>

        <SearchBar input={input} setKeyword={updateInput} />

        {/* {searchResult.length > 0 ? loadViewToggleButtons() : null} */}
        {/*console.log('searchResult', searchResult)*/}
        {searchResult.length > 0 &&
        progarmData != null &&
        Configuration != null ? (
          <CaseList
            searchResult={searchResult}
            viewType={viewType}
            metaData={progarmData}
            page={page}
            itemsPerPage={Configuration.pagination.itemsPerPage}
          />
        ) : null}

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
      </div>
    </section>
  );
}
export default Cases;
