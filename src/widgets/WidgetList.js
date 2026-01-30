import React, { useState, useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import Globalclasses from "../App.module.css";
import "../assets/css/customstyles.css";
import Typography from '@material-ui/core/Typography';
import { apiServices } from "../services/apiServices";
import { CircularLoader, CenteredContent } from "@dhis2/ui";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Pagination from "@material-ui/lab/Pagination";
import SearchBar from "../component/searchbar/SearchBar";
import Button from "@material-ui/core/Button";

import _ from "lodash";
import swal from "sweetalert";
import { useTranslation } from "react-i18next";
import { useGlobalSpinnerActionsContext } from "../context/GlobalSpinnerContext";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
//import { Configuration } from "../../assets/data/config";
import OfflineDb from "../db";
import "../assets/css/customstyles.css";
//import "../assets/css/theme_grey.css";
import "../assets/css/theme_blue.css";
//import "../assets/css/theme_green.css";
//import "../assets/css/theme_red.css";
import FooterMenu from '../component/layout/FooterMenu'
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const WidgetList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [alertsList, setAlertslist] = useState([]);
  const [alertsListFiltered, setAlertsListFiltered] = useState([]);
  const [input, setInput] = useState("");
  const [searchAllResult, setSearchAllResult] = useState([]);
  const [Configuration,setConfiguration] = useState(null);
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [progarmData, setProgarmData] = useState(null);
  const [viewType, setViweType] = useState("list");
  //const [loading, setGlobalSpinner] = useState(true);
  const classes = useStyles();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  //pagination code
  //const itemsPerPage = Configuration.pagination.itemsPerPage;
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);
  const [offset, setoffset] = useState(0);
  const [showLoadMore, setshowLoadMore] = useState(false);
  
  
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
      
    }
  }, [sessionUserBoValue, progarmData, offset,Configuration]);


  const handleViewChange = (event, newValue) => {
    setViweType(newValue);
  };

  return (
    <div className="certi-patientpage">
      <FooterMenu></FooterMenu>
      <Grid container className='certi-patientpagediv-nobg'>
      <br/>
        <Grid container className='journeyDiv'>
        <Grid xs="6" md="6" className='journeyDivinner'>
        <div className='widgetItems' onClick={()=>history.push('/layout/treatmentstatus')}>
          <div className='clientFullWidthBox treatmentStatusBg'>
            {/* <img src={imgUrl.treatment} className="journeyImage"/> */}
          </div>
           
            <Typography variant='h6'>
              {t("Treatment Status")}
            </Typography>
         </div>
        </Grid>
        <Grid xs="6" md="6" className='journeyDivinner'>
        <div className='widgetItems' onClick={()=>history.push('/layout/bmicalculator')}>
        <div className='clientFullWidthBox bmiCalculatorBg'>
           {/* <img src={imgUrl.history} className="journeyImage"/> */}
        </div>
           
            <Typography variant='h6'>
            {t("BMI Calculator")}
            </Typography>
         </div>
        </Grid>
        </Grid>
      </Grid>
      </div>
  );
};

export default WidgetList;
