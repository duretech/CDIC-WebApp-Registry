import React, { useState, useEffect} from "react";
import { apiServices } from "../../services/apiServices";
import SearchBar from "../../component/searchbar/SearchBar";
import CaseList from "./NewThemeCaseList";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Pagination from "@material-ui/lab/Pagination";
import { useHistory } from "react-router";
import { Button, ReactFinalForm } from "@dhis2/ui";
import { Trans, useTranslation } from "react-i18next";
import swal from "sweetalert";
import { Grid, Tooltip, Select, MenuItem, FormControl, InputLabel,TextField, Box, Stack } from "@mui/material";
import OfflineDb from "../../db";
import { useGlobalSpinnerActionsContext} from "../../context/GlobalSpinnerContext";
//import {Configuration} from '../../assets/data/config'
import "../../assets/css/customstyles.css";
//import '../../assets/css/theme_grey.css'
import "../../assets/css/theme_blue.css";
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'
import _ from "lodash";
import FooterMenu from "../../component/layout/FooterMenu";
import CaseListInTableView from "./CaseListInTableView";
import moment from "moment";
import CVDCalculator from "../../component/CVDCalculator/CVDCalculator";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import PatientCard from "../patientcard/PatientCard";
import html2canvas from "html2canvas";
import PersonIcon from "@material-ui/icons/Person";
import CloseIcon from "@material-ui/icons/Close";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
// import { getHeaderNames,getDateFormat,getHeaderCheckSettings,checkColumn,checkRoleBasedAccess } from '../../config/validationutils'
import { decryptData, encryptData } from "../../imon/encryption/AesEnc";
import {
  getDateFormat,
  checkRoleBasedAccess,
  maskText,
} from "../../config/validationutils";
import DOMPurify from "dompurify";
import { APP_LOCALE } from "../../assets/data/config";
import { convertToGC, toEthiopianDateString } from "gc-to-ethiopian-calendar";
import { Accordion, AccordionSummary, AccordionDetails, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const { Form, Field } = ReactFinalForm;

function Cases() {
  const searchToken = React.useRef(0);
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [progarmData, setProgarmData] = useState(null);
  const [customSearch, setCustomSearch] = useState([]);
  const [unfilterdTableList, setUnfilteredTablelist] = useState([]);
  const [UICSearch, setUICSearch] = useState([]);
  const [input, setInput] = useState("");
  const [patientnameinput, setPatientNameInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchAllResult, setSearchAllResult] = useState([]);
  const [selectedHeaderNames, setSelectedHeaderNames] = useState([]);
  const [value, setValue] = useState([]);
  // const [loading,setGlobalSpinner] = useState(false)
  const { t, i18n } = useTranslation();

  const [viewType, setViweType] = useState("list");
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const history = useHistory();
  //pagination code
  //const itemsPerPage = Configuration.pagination.itemsPerPage
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);
  const [Configuration, setConfiguration] = useState(null);
  const [openPatientCard, setOpenPatientCard] = useState(null);
  const [trackedEntityInstanceId, setTrackedEntityInstanceId] = useState(null);
  const [columnHeader, setColumnHeader] = useState([]);
  const dateFormat = getDateFormat("dateformat");
  //const correctFormat = moment().format(dateFormat.replace(/d/g, 'D').replace(/y/g, 'Y'));
  const correctFormat = dateFormat.replace(/d/g, "D").replace(/y/g, "Y");
  const headerName = [
    "Patient Name",
    "Gender",
    "Age",
    "Date of registration",
    "UIC",
    "phone number (permanent)",
    "instance",
  ];
  // const columnHeader = [
  // {
  //   name: t("Patient Name"),
  //   selector: (row) => (row["patientName"] ? row["patientName"] : "-"),
  // },
  // {
  //   name: t("Gender"),
  //   selector: (row) => (row["gender"] ? row["gender"] : "-"),
  // },
  // {
  //   name: t("Age"),
  //   selector: (row) => (row["age"] ? row["age"] : "-"),
  // },
  // {
  //   name: t("Date of registration"),
  //   selector: (row) =>
  //     row["regDate"] ? moment(row["regDate"]).format("YYYY-MM-DD") : "-",
  // },
  // {
  //   name: t("UIC"),
  //   selector: (row) => (row["uic"] ? row["uic"] : "-"),
  // },
  // {
  //   name: t("Contact number"),
  //   selector: (row) => (row["contactNumber"] ? row["contactNumber"] : "-"),
  // },
  // {
  //   name: "Edit",
  //   selector: (row) => row.edit,
  // },
  // {
  //   name: "View",
  //   selector: (row) => row.view,
  // },
  // {
  //   name: "Patient Card",
  //   selector: (row) => row.patientcard,
  // },
  // const columnHeader = [
  //   {
  //     name: t("Patient Name"),
  //     selector: (row) => (row["patientName"] ? row["patientName"] : "-"),
  //   },
  //   {
  //     name: t("Gender"),
  //     selector: (row) => (row["gender"] ? row["gender"] : "-"),
  //   },
  //   {
  //     name: t("Age"),
  //     selector: (row) => (row["age"] ? row["age"] : "-"),
  //   },
  //   {
  //     name: t("Date of registration"),
  //     selector: (row) =>
  //       row["regDate"] ? moment(row["regDate"]).format(correctFormat) : "-",
  //   },
  //   {
  //     name: t("UIC"),
  //     selector: (row) => (row["uic"] ? row["uic"] : "-"),
  //   },
  //   {
  //     name: t("Contact number"),
  //     selector: (row) => (row["contactNumber"] ? row["contactNumber"] : "-"),
  //   },
  //   {
  //     name: t("Edit"),
  //     selector: (row) => row.edit,
  //   },
  //   {
  //     name: t("View"),
  //     selector: (row) => row.view,
  //   },
  //   {
  //     name: t("Patient Card"),
  //     selector: (row) => row.patientcard,
  //   },
  // {
  //     name: 'CDV Score',
  //     selector: row => row.cdv
  // },
  // ];
  const [datatableList, setDatatableList] = useState([]);

  const [openCVDRisk, setopenCVDRisk] = useState(null);
  const [smokingId, setsmokingId] = useState(null);
  const [filteredidsArr, setFileterdIdsArr] = useState([]);
  const [smoking, setsmoking] = useState(null);
  const [diabetesId, setdiabetesId] = useState(null);
  const [diabetes, setdiabetes] = useState(null);
  const [systolicBloodPressureId, setsystolicBloodPressureId] = useState(null);
  const [systolicBloodPressure, setsystolicBloodPressure] = useState(null);
  const [totalCholesterolId, settotalCholesterolId] = useState(null);
  const [totalCholesterol, settotalCholesterol] = useState(null);
  const [hdlCholesterolId, sethdlCholesterolId] = useState(null);
  const [hdlCholesterol, sethdlCholesterol] = useState(null);
  const [screeningstageId, setscreeningstageId] = useState(null);
  const [patientProfileStageId, setPatientProfileStageId] = useState(null);
  const [managementStageId, setmanagementStageId] = useState(null);
  const [advancedinvestigationstageId, setadvancedinvestigationstageId] =
    useState(null);
  const [summaryStageId, summarycomeStageId] = useState(null);
  const [clietName, setclientName] = useState(null);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [region, setRegion] = useState("");
  const [bmiCategory, setBmiCategory] = useState("");
  const [bmiZ, setBmiZ] = useState("");
  const [hba1c, setHba1c] = useState("");
  const [userrolename, setuserrolename] = React.useState(null);
  const isMobile = window.document.body.clientWidth < 800 || window.cordova;

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
    createHeadersObject();
    OfflineDb.removeDataFromPouchDB("activeCaseDetails");
    OfflineDb.removeDataFromPouchDB("activeCaseFormData");
    OfflineDb.removeDataFromPouchDB("linkContactFlag");
    OfflineDb.setDataIntoPouchDB("transferFlag", { type: null });
  }, []);

  useEffect(() => {
    if (progarmData != null) {
      getCustomVariableIds();
    }
  }, [progarmData]);

  useEffect(() => {
    // Skip first render if you don't want immediate call
    if (
      age !== "" ||
      gender !== "" ||
      region !== "" ||
      bmiCategory !== "" ||
      bmiZ !== "" ||
      hba1c !== ""
    ) {
      applyFilter();
    }
  }, [age, gender, region, bmiCategory, bmiZ, hba1c]); // dependencies

  useEffect(() => {
    const updatedColumnHeader = [];
    
   if (APP_LOCALE === "PRODUCT") {
       selectedHeaderNames.forEach((header) => {
       
          if (header && header.column) {
           const obj = {
             name: t(header.column),
             selector: (row) => {
               const value = row[header.column]
                 ? row[header.column]
                 : "-";
   
               // Check if value is a date and format it
               if (APP_LOCALE === "CC008") {
                 if (header.column !== "UIC") {
                   if (
                     moment(value, moment.ISO_8601, true).isValid() ||
                     moment(value, "DD-MM-YYYY", true).isValid() ||
                     moment(value, "YYYY-MM-DD", true).isValid()
                   ) {
                     return moment(value).format(correctFormat);
                   }
                 }
               } else if (APP_LOCALE === "CC004") {
                 let value = row[header.column]
                   ? row[header.column]
                   : "-";
   
                 if (
                   moment(value, moment.ISO_8601, true).isValid() ||
                   moment(value, "DD-MM-YYYY", true).isValid() ||
                   moment(value, "YYYY-MM-DD", true).isValid()
                 ) {
                   const [year, month, day] = value.split("-").map(Number);
   
                   // Create date object at noon to avoid timezone issues
                   const date = new Date(year, month - 1, day, 12, 0, 0);
   
                   // Convert Gregorian to Ethiopian
                   const ethiopianDate = toEthiopianDateString(date);
   
                   const ethiopianDateParts = ethiopianDate.split(" ");
                   const formattedEthiopianDate = `${ethiopianDateParts[2]} ${ethiopianDateParts[1]}/${ethiopianDateParts[3]}`;
                   value = formattedEthiopianDate;
                   return value;
                 }
               } else {
                 if (
                   moment(value, moment.ISO_8601, true).isValid() ||
                   moment(value, "DD-MM-YYYY", true).isValid() ||
                   moment(value, "YYYY-MM-DD", true).isValid()
                 ) {
                   return moment(value).format(correctFormat);
                 }
               }
   
               return value;
             },
           };
   
           updatedColumnHeader.push(obj);
         } else {
           console.warn("Invalid header or obj:", header); // Log a warning if the header is invalid
         }
       })
     }
     else{
       selectedHeaderNames.forEach((header) => {
         // const obj = {
         //   name: t(header[0].obj.column),
         //   selector: (row) => (row[header[0].obj.column] ? row[header[0].obj.column] : "-")
         // };
         if (header[0] && header[0].obj && header[0].obj.column) {
           const obj = {
             name: t(header[0].obj.column),
             selector: (row) => {
               const value = row[header[0].obj.column]
                 ? row[header[0].obj.column]
                 : "-";
   
               // Check if value is a date and format it
               if (APP_LOCALE === "CC008") {
                 if (header[0].obj.column !== "UIC") {
                   if (
                     moment(value, moment.ISO_8601, true).isValid() ||
                     moment(value, "DD-MM-YYYY", true).isValid() ||
                     moment(value, "YYYY-MM-DD", true).isValid()
                   ) {
                     return moment(value).format(correctFormat);
                   }
                 }
               } else if (APP_LOCALE === "CC004") {
                 let value = row[header[0].obj.column]
                   ? row[header[0].obj.column]
                   : "-";
   
                 if (
                   moment(value, moment.ISO_8601, true).isValid() ||
                   moment(value, "DD-MM-YYYY", true).isValid() ||
                   moment(value, "YYYY-MM-DD", true).isValid()
                 ) {
                   const [year, month, day] = value.split("-").map(Number);
   
                   // Create date object at noon to avoid timezone issues
                   const date = new Date(year, month - 1, day, 12, 0, 0);
   
                   // Convert Gregorian to Ethiopian
                   const ethiopianDate = toEthiopianDateString(date);
   
                   const ethiopianDateParts = ethiopianDate.split(" ");
                   const formattedEthiopianDate = `${ethiopianDateParts[2]} ${ethiopianDateParts[1]}/${ethiopianDateParts[3]}`;
                   value = formattedEthiopianDate;
                   return value;
                 }
               } else {
                 if (
                   moment(value, moment.ISO_8601, true).isValid() ||
                   moment(value, "DD-MM-YYYY", true).isValid() ||
                   moment(value, "YYYY-MM-DD", true).isValid()
                 ) {
                   return moment(value).format(correctFormat);
                 }
               }
   
               return value;
             },
           };
   
           updatedColumnHeader.push(obj);
         } else {
           console.warn("Invalid header or obj:", header); // Log a warning if the header is invalid
         }
       });
     }

    const isHealthWorker = sessionUserBoValue?.userRoles?.find(
      (role) => role.name === "healthworker"
    );

    const isDrop = sessionUserBoValue?.userRoles?.find(
      (role) => role.name === "DROP-HCP"
    );

    let defaultHeaders = [];

    if (progarmData && sessionUserBoValue && patientProfileStageId && stageAccessCheck(patientProfileStageId)) {
      defaultHeaders.push({
        name: isMobile ? "Patient Dashboard" : t("Patient Dashboard"),
        selector: (row) => row.view,
      });
    }

    if (progarmData && sessionUserBoValue && managementStageId && stageAccessCheck(managementStageId)) {
      defaultHeaders.push({
        name: t("Follow up"),
        selector: (row) => row.followup,
      });
    }

    //if (isHealthWorker || isDrop) {  //Removing conditaion as its available for all role as per JIRA ticket: CDIC-1020 ->1102
      defaultHeaders = [
        {
          name: isMobile ? "Edit" : t("Edit"),
          selector: (row) => row.edit,
          // width: "80px", // Fixed width for icon column
          // center: true, // Center the content
        },
        ...defaultHeaders, // Adds "View" to the list
        {
          // name: (
          //   <div
          //     style={{
          //       whiteSpace: "pre-line",
          //       lineHeight: "1.2",
          //       fontSize: "12px", // Slightly smaller font if needed
          //     }}
          //   >
          //     {t("Patient\nCard")}
          //   </div>
          // ),
          name: isMobile ?  "Patient Card" : t("Patient Card"),
          selector: (row) => row.patientcard,
          // width: "80px", // Same width as other action columns
          // center: true,
          // style: {
          //   padding: "8px 4px",
          // },
        },
      ];
    //}
    defaultHeaders.map((ele) => {
      updatedColumnHeader.push(ele);
    });
    setColumnHeader(updatedColumnHeader);
 
  }, [selectedHeaderNames, t, i18n.language]);

  const createHeadersObject = async () => {
    // getHEADER IDS ARRAY FROM METADATA
    let metadata = await OfflineDb.getDataFromPouchDB("metaData");
    const filteredHeadersMetadata =
      metadata.data.programs[0].programTrackedEntityAttributes.filter(
        (ele) => ele.displayInList
      );
    const filteredHeaderIdsMetadata = filteredHeadersMetadata.map((ele) => {
      return ele.trackedEntityAttribute.id;
    });
    setFileterdIdsArr(filteredHeaderIdsMetadata);
  };

  const getCustomVariableIds = () => {
    try {
      progarmData.programs[0].programStages.map((stage) => {
        let stageName = stage.description
          ? stage.description
          : stage.displayName;

        if (stageName.trim() == "History & Screening") {
          setscreeningstageId(stage.id);
        }
        if (stageName.trim() == "Advanced Investigations") {
          setadvancedinvestigationstageId(stage.id);
        }
        if (stageName.trim() == "Summary") {
          summarycomeStageId(stage.id);
        }
        if (stageName.trim() == "Patient Dashboard") {
          setPatientProfileStageId(stage.id);
        }
        if (stageName.trim() == "Examination") {
          setmanagementStageId(stage.id);
        }
        stage.programStageDataElements.map((de) => {
          let fieldname = de.dataElement.description
            ? de.dataElement.description
            : de.dataElement.formName
            ? de.dataElement.formName
            : de.dataElement.displayName;
          if (fieldname) {
            if (fieldname.trim() == "Tobacco use - Smoking") {
              setsmokingId(de.dataElement.id);
            }
            if (fieldname.trim() == "History of Diabetes") {
              setdiabetesId(de.dataElement.id);
            }
            if (fieldname.trim() == "SBP at Registration") {
              setsystolicBloodPressureId(de.dataElement.id);
            }
            if (fieldname.trim() == "Total Cholesterol (mg/dl)") {
              settotalCholesterolId(de.dataElement.id);
            }
            if (fieldname.trim() == "HDL Cholesterol (mg/dl)") {
              sethdlCholesterolId(de.dataElement.id);
            }
          }
        });
      });
    } catch (e) {}
  };
  //once user bco is set call getContactList function
  useEffect(() => {
    if (sessionUserBoValue != null && Configuration != null) {
      const roleBasedAccessEnabled = checkRoleBasedAccess("roleBasedSections");

      if (roleBasedAccessEnabled) {
        let userrole = sessionUserBoValue.userRoles[0].name
          ? sessionUserBoValue.userRoles[0].name
          : sessionUserBoValue.userRoles[0].displayName;
        setuserrolename(
          sessionUserBoValue.userRoles[0].name ||
            sessionUserBoValue.userRoles[0].displayName
        );
          APP_LOCALE == "PRODUCT"? getCasesListWithFilters(userrole) : getCasesList(userrole) 
        } else {
          APP_LOCALE == "PRODUCT"? getCasesListWithFilters() : getCasesList() 
      }
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
    setGlobalSpinner(true);
    let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
      programID = sessionUserBoValue.programs[0], //`nSy7PFqQykt`,
      searchQuery = ``;

    const roleBasedAccessEnabled = checkRoleBasedAccess("roleBasedSections");

    let subURL;
    if (APP_LOCALE === "CC008") {
      subURL =
        "trackedEntityInstances/query.json?ou=" +
        orgID +
        "&ouMode=DESCENDANTS&program=" +
        programID +
        "&pageSize=" +
        Configuration.pagination.fetchNoOfRecords +
        "&page=1&totalPages=false&skipPaging=true";
    } else {
      subURL =
        "trackedEntityInstances/query.json?ou=" +
        orgID +
        "&ouMode=DESCENDANTS&program=" +
        programID +
        "&pageSize=" +
        Configuration.pagination.fetchNoOfRecords +
        "&page=1&totalPages=false&skipPaging=true";
    }

    for (var i in param) {
      searchQuery += `&attribute=${i}:LIKE:${param[i]}`;
    }

    let tempHolder = {
      type: "GET",
      url: subURL,
      data: null,
    };
    const encryptedData = encryptData(tempHolder);
    apiServices
      .postAPI("commonencryption/getDecrypt", { data: encryptedData })
      .then((res) => {
        res.data = decryptData(res.data);
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
        //  Mpdified code for GDPR
        const isHealthWorker = sessionUserBoValue?.userRoles?.find(
          (role) => role.name === "healthworker"
        );
        const isDrop = sessionUserBoValue?.userRoles?.find(
          (role) => role.name === "DROP-HCP"
        );
        let headers_ = res.data.headers;
        let program = progarmData.programs[0];
        let filteredHeaders = [];
        let encryptedAttributes = [];
        let maskableAttributes = [];
        let isEncryptedAttribute;
        let isMaskableAttribute;
        if (progarmData) {
          // Iterate through the headers from API response
          headers_.forEach((header) => {
            let headerId = header.name;
            let isEncrypted = false;
            let isMaskable = false;
            program.programSections.forEach((section) => {
              // Iterate through trackedEntityAttributes within each section
              section.trackedEntityAttributes.forEach((attribute) => {
                if (attribute.id === headerId) {
                  // Check if the attribute has attributeValues and contains 'IsEncrypted' and 'isMaskable' with value 'true'
                  // if (!(isHealthWorker || isDrop)) {
                  //   isEncryptedAttribute = attribute.attributeValues.find(
                  //     (attrValue) =>
                  //       attrValue.attribute.name === "IsEncrypted" &&
                  //       attrValue.value === "true"
                  //   );

                  //   isMaskableAttribute = attribute.attributeValues.find(
                  //     (attrValue) =>
                  //       attrValue.attribute.name === "isMaskable" &&
                  //       attrValue.value === "true"
                  //   );
                  // }

                  // If IsEncrypted is found and true, log the data
                  if (isEncryptedAttribute) {
                    isEncrypted = true;
                    encryptedAttributes.push(headerId);
                    header.isEncrypted = true;
                  }

                  // If isMaskable is found and true, log the data
                  if (isMaskableAttribute) {
                    isMaskable = true;
                    maskableAttributes.push(headerId);
                    header.isMaskable = true;
                  }
                }
              });
            });

            filteredHeaders.push(header);
          });
        }
        let filteredIdsWithoutEncrypted = filteredidsArr.filter(
          (id) => !encryptedAttributes.includes(id)
        );
        searchArray.push(filteredHeaders);

        // Process row data based on filtered headers
        let filteredRows = res.data.rows.map((row) => {
          let newRow = [];

          // Add data to the newRow, but check if the header is encrypted
          filteredHeaders.forEach((header, index) => {
            if (header.isEncrypted) {
              newRow.push("ENCRYPTED");
            } else if (header.isMaskable) {
              newRow.push(maskText(row[index]));
            } else {
              newRow.push(row[index]); // Regular non-encrypted column data
            }
          });

          return newRow;
        });

        try {
          searchArray.push(filteredRows.reverse());
        } catch (e) {
          // searchArray.push(res.data.rows);
          searchArray.push(filteredRows);
        }
        setGlobalSpinner(false);
        setSearchResult(searchArray);
        setSearchAllResult(searchArray);
        OfflineDb.setDataIntoPouchDB("myclients", searchArray);
        let filterData = [];

        //finding indexes from headers object and metadata ids where display inlist = true

        let selectedHeaderNames = filteredIdsWithoutEncrypted?.map((ele) => {
          const temp = filteredHeaders
            .map((obj, i) => (obj.name === ele ? { obj, index: i } : null))
            .filter((item) => item !== null);
          return temp;
        });

        setSelectedHeaderNames(selectedHeaderNames);

        filteredRows.forEach((row, i) => {
          let obj = {}; // To store filtered row data

          // Loop through filtered headers and align them with row data
          selectedHeaderNames.forEach((el) => {
            if (el.length > 0 && el[0].obj && el[0].obj.column !== undefined) {
              const headerColumn = el[0].obj.column;
              const columnIndex = el[0].index; // The index in the row for this header

              // Handle encrypted columns: skip or use placeholder
              if (filteredHeaders[columnIndex].isEncrypted) {
                obj[headerColumn] = "ENCRYPTED"; // Placeholder for encrypted data
              } else if (filteredHeaders[columnIndex].isMaskable) {
                obj[headerColumn] = maskText(row[columnIndex]); // Apply masking
              } else {
                obj[headerColumn] = row[columnIndex]; // Assign row value to corresponding header
              }
            }
          });

          const patientNameIndex = filteredHeaders.findIndex(
            (header) => header.column.trim() === "Patient Name"
          );
          const ageIndex = filteredHeaders.findIndex(
            (header) => header.column.trim() === "Age"
          );
          const genderIndex = filteredHeaders.findIndex(
            (header) => header.column.trim() === "Sex at birth"
          );

          // Add extra fields like action buttons that are not dependent on headers
          //if (isHealthWorker || isDrop) { //Removing conditaion as its available for all role as per JIRA ticket: CDIC-1020 ->1102
            obj["edit"] = (
              <EditIcon onClick={(e) => UpdateRecordClick(e, row[0])} />
            );
          //}
          // obj['view'] = (
          //   <VisibilityIcon
          //     onClick={(e) => seeIndividualRecordClick(row[0], obj[selectedHeaderNames[0]?.[0]?.obj?.column], obj[selectedHeaderNames[2]?.[0]?.obj?.column], obj[selectedHeaderNames[1]?.[0]?.obj?.column])}
          //   />
          // );
          obj.followup = (
            <AssignmentTurnedInIcon
              onClick={(e) => {
                // Extract values based on the header column name
                let nameValue = filteredHeaders[patientNameIndex]?.isEncrypted
                  ? ""
                  : row[patientNameIndex]; // Get Patient Name from row

                let ageValue = filteredHeaders[ageIndex]?.isEncrypted
                  ? ""
                  : row[ageIndex]; // Get Age from row

                let genderValue = filteredHeaders[genderIndex]?.isEncrypted
                  ? ""
                  : row[genderIndex]; // Get Gender from row

                directToExamination(row[0]);
              }}
            />
          );
          obj["view"] = (
            <VisibilityIcon
              onClick={(e) => {
                // Extract values based on the header column name
                let nameValue = filteredHeaders[patientNameIndex]?.isEncrypted
                  ? ""
                  : row[patientNameIndex]; // Get Patient Name from row

                let ageValue = filteredHeaders[ageIndex]?.isEncrypted
                  ? ""
                  : row[ageIndex]; // Get Age from row

                let genderValue = filteredHeaders[genderIndex]?.isEncrypted
                  ? ""
                  : row[genderIndex]; // Get Gender from row

                // Pass the extracted values to the next page
                // seeIndividualRecordClick(row[0], nameValue, ageValue, genderValue);
                directToSummary(row[0]);
              }}
            />
          );
          //if (isHealthWorker || isDrop) { //Removing conditaion as its available for all role as per JIRA ticket: CDIC-1020 ->1102
            obj["cdv"] = (
              <LocalHospitalIcon
                onClick={(e) => getCVDRisk(row[0], filteredHeaders)}
              />
            );
            obj["patientcard"] = (
              <PersonIcon
                onClick={(e) => getPatientCard(row[0], filteredHeaders)}
              />
            );
          //}

          // Add the filtered row to the final filterData array
          filterData.push(obj);
        });
        setUnfilteredTablelist(filterData);
        setDatatableList(filterData);
      })
      .catch((error) => {
        setGlobalSpinner(false);
        swal({
          title: "Error",
          text: navigator.onLine
            ? t("Sorry, something went wrong.")
            : t("Client list could not be shown in offline mode."),
          icon: "error",
          button: t("Close"),
        });
      });
  }

  function stageAccessCheck(stageUID) {
    const stages = progarmData?.programs?.[0]?.programStages.find(
      (stage) => stage.id === stageUID
    );
    const userList = stages.userAccesses;
    const userGroups = stages.userGroupAccesses;
    let stageAcsess = false;
    const getUSerBo = sessionUserBoValue;
    const userGroupID =
      getUSerBo.userGroups && getUSerBo.userGroups.length > 0
        ? getUSerBo.userGroups[0].id
        : getUSerBo.id;
    const filterUserIdInMeta =
      userList && userList.length > 0
        ? userList.filter((obj) => obj.id == getUSerBo.id)
        : [];
    const filterUserGroupInMeta =
      userGroups && userGroups.length > 0
        ? userGroups.filter((obj) => obj.id == userGroupID)
        : [];
    if (filterUserIdInMeta.length > 0) {
      const filteredUserList = filterUserIdInMeta[0].access;
      if (filteredUserList == "rw------" || filteredUserList == "rwrw----") {
        stageAcsess = true;
      }
    } else if (filterUserGroupInMeta.length > 0) {
      const filteredUserList = filterUserGroupInMeta[0].access;
      if (filteredUserList == "rw------" || filteredUserList == "rwrw----") {
        stageAcsess = true;
      }
    }
    return stageAcsess;
  }

  function getCasesListWithFilters(param) {
      //localStorage.removeItem('trackedEntityInstance')
      setGlobalSpinner(true);
      let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
        programID = sessionUserBoValue.programs[0]//`nSy7PFqQykt`,
  
      let requestPayload = {
          "orguid": orgID, 
          "programuid": programID,
          "age": param?.age || "",
          "gender": param?.gender || "",
          "region": param?.region || "",
          "bmi": param?.bmi || "",
          "bmiz": param?.bmiz || "",
          "hba1c": param?.hba1c || ""
      };
  
       let tempHolder = {
          type: "POST",
          url: "filter/getcustomlinelist",
          data: requestPayload,
      };
      const encryptedData = encryptData(tempHolder);
      apiServices
        .postAPI("filter/getcustomlinelist", requestPayload)
        .then((res) => {
          //  res.data = decryptData(res.data);
          let responseData = res.data|| res;
          let searchArray = [];
          let headers_ = [];
          let rows = [];
          
          // Validate that response is an array
          if (!Array.isArray(responseData)) {
            console.error("Expected array response from API, got:", typeof responseData);
            throw new Error("Invalid API response format - expected array");
          }
          
          // Extract headers and rows from array of objects
          if (responseData.length > 0) {
            const firstRecord = responseData[0];
            // Create headers from the first object's keys - SET ONCE
            headers_ = Object.keys(firstRecord).map(key => ({
              name: key,
              column: key, // Use key as initial column name
              type: typeof firstRecord[key]
            }));

            //console.log("firstRecord ",firstRecord,headers_)

            // if(window.document.body.clientWidth < 800 || window.cordova){
            //    responseData = responseData.map(obj => {
            //     const { instanceuid, ...rest } = obj;
            //     return { instanceuid, ...rest };
            //   });
            // }
  
          // Map headers to proper display names from program metadata - DO THIS ONCE HERE
            try {
              if (progarmData && progarmData.trackedEntityAttributes && Array.isArray(progarmData.trackedEntityAttributes)) {
                headers_.forEach((header) => {
                  if (header.column) {
                    let fieldBO = _.find(progarmData.trackedEntityAttributes, {
                      displayName: header.column,
                    });
                    if (fieldBO && fieldBO.description && header.column !== fieldBO.description) {
                      header.column = fieldBO.description;
                    }
                  }
                });
              }
            } catch (e) {
              console.log("Error mapping headers:", e);
            }
          
         // Convert array of objects to rows array format
            rows = responseData
          } else {
            console.warn("Empty response data from API");
            // Set empty arrays for no data scenario
            headers_ = [];
            rows = [];
          }
          
          // Process GDPR and encryption flags
          const isHealthWorker = sessionUserBoValue?.userRoles?.find(
            (role) => role.name === "healthworker"
          );
          const isDrop = sessionUserBoValue?.userRoles?.find(
            (role) => role.name === "DROP-HCP"
          );
          
          let program = progarmData?.programs?.[0];
          let filteredHeaders = [];
          let encryptedAttributes = [];
          let maskableAttributes = [];
          
          // if(window.document.body.clientWidth < 800 || window.cordova){
          //   filteredHeaders.push({
          //     name: "Instance",
          //     column: "Instance", // Use key as initial column name
          //     type: "string"
          //   })
          // }
          if (progarmData && program && program.programSections && Array.isArray(program.programSections)) {
            // Process each header for encryption and masking flags
            headers_.forEach((header) => {
              let headerId = header.name;
              let isEncryptedAttribute = false;
              let isMaskableAttribute = false;
              
              // Search through program sections for attribute settings
              program.programSections.forEach((section) => {
                if (section.trackedEntityAttributes && Array.isArray(section.trackedEntityAttributes)) {
                  section.trackedEntityAttributes.forEach((attribute) => {
                    if (attribute.id === headerId) {
                      // Only check encryption/masking for non-health workers
                      if (!(isHealthWorker || isDrop) && attribute.attributeValues && Array.isArray(attribute.attributeValues)) {
                        isEncryptedAttribute = attribute.attributeValues.find(
                          (attrValue) =>
                            attrValue.attribute && 
                            attrValue.attribute.name === "IsEncrypted" &&
                            attrValue.value === "true"
                        );
  
                        isMaskableAttribute = attribute.attributeValues.find(
                          (attrValue) =>
                            attrValue.attribute && 
                            attrValue.attribute.name === "isMaskable" &&
                            attrValue.value === "true"
                        );
                      }
  
                      // Apply flags to header
                      if (isEncryptedAttribute) {
                        encryptedAttributes.push(headerId);
                        header.isEncrypted = true;
                      }
  
                      if (isMaskableAttribute) {
                        maskableAttributes.push(headerId);
                        header.isMaskable = true;
                      }
                    }
                  });
                }
              });
              if(header?.name != 'instanceuid'){
              filteredHeaders.push(header);
              }
            });
          } else {
            console.warn("Program data not available - using headers without encryption/masking flags");
            filteredHeaders = headers_.map(header => ({ ...header }));
          }
          
          // Filter out encrypted attributes from display list
          let filteredIdsWithoutEncrypted = [];
          if (typeof filteredidsArr !== 'undefined' && Array.isArray(filteredidsArr)) {
            filteredIdsWithoutEncrypted = filteredidsArr.filter(
              (id) => !encryptedAttributes.includes(id)
            );
          } else {
            console.warn("filteredidsArr not defined - using all non-encrypted headers");
            filteredIdsWithoutEncrypted = filteredHeaders
              .filter(header => !header.isEncrypted)
              .map(header => header.name);
          }
          console.log("filteredHeaders",filteredHeaders)
          // Add headers to search array
          searchArray.push(filteredHeaders);
  
          // if(!window.cordova){
          //   rows.forEach((row, i) => {
          //       row["instanceuid"] = 
          //   })
          // }

          // Add processed rows to search array
          try {
              if (rows && rows.length > 0) {
              //   const sortedData = [...rows].sort((a, b) => {
              //   const dateA = new Date(a["Date of Registration"]);
              //   const dateB = new Date(b["Date of Registration"]);
              //   return dateB - dateA; // latest first
              // });
              // console.log("sortedData ",sortedData)
              // searchArray.push(sortedData); // Reverse to show latest first
              // const sortedData = [...rows.reverse()].sort((a, b) => {
              //   const dateA = new Date(a["Date of Registration"]);
              //   const dateB = new Date(b["Date of Registration"]);
              //   return dateB - dateA; // latest first
              // });
              searchArray.push(rows); // Reverse to show latest first
              //searchArray.push(sortedData); // Reverse to show latest first
            } else {
              searchArray.push([]);
            }
          } catch (e) {
            console.log("Error processing rows:", e);
            searchArray.push([]);
          }
          //console.log("searchArray ",searchArray)
          setGlobalSpinner(false);
          setSearchResult(searchArray);
          if(searchAllResult.length == 0){
              setSearchAllResult(searchArray);
          }
          
          OfflineDb.setDataIntoPouchDB("myclients", searchArray);
          let filterData = [];
  
          //finding indexes from headers object and metadata ids where display inlist = true
          let selectedHeaderNames =filteredHeaders
          
          setSelectedHeaderNames(selectedHeaderNames);
  
          rows.forEach((row, i) => {
            let obj = {}; // To store filtered row data
            // Loop through filtered headers and align them with row data
            if (selectedHeaderNames && Array.isArray(selectedHeaderNames)) {
              selectedHeaderNames.forEach((el) => {
                if (el.length > 0 && el && el.column !== undefined) {
                  const headerColumn = el.column;
                  const columnIndex = el.index; // The index in the row for this header
  
                  // Ensure row has data at this index
                  if (row && columnIndex < row.length) {
                    // Handle encrypted columns: skip or use placeholder
                    if (filteredHeaders[columnIndex] && filteredHeaders[columnIndex].isEncrypted) {
                      obj[headerColumn] = "ENCRYPTED"; // Placeholder for encrypted data
                    } else if (filteredHeaders[columnIndex] && filteredHeaders[columnIndex].isMaskable) {
                      obj[headerColumn] = typeof maskText === 'function' ? maskText(row[columnIndex]) : row[columnIndex];
                    } else {
                      obj[headerColumn] = row[columnIndex]; // Assign row value to corresponding header
                    }
                  }
                }
              });
            }
            const patientNameIndex = filteredHeaders.findIndex(
              (header) => header.column && header.column.trim() === "First name"
            );
            const ageIndex = filteredHeaders.findIndex(
              (header) => header.column && header.column.trim() === "Age"
            );
            const genderIndex = filteredHeaders.findIndex(
              (header) => header.column && header.column.trim() === "Sex At Birth"
            );
  
            // Add extra fields like action buttons that are not dependent on headers
            //if (isHealthWorker || isDrop) { //Removing conditaion as its available for all role as per JIRA ticket: CDIC-1020 ->1102
              obj["edit"] = (
                <EditIcon onClick={(e) => UpdateRecordClick(e, row[`instanceuid`])} />
              );
            //}
  
            obj.followup = (
              <AssignmentTurnedInIcon
                onClick={(e) => {
                  // Extract values based on the header column name
                  let nameValue = (patientNameIndex >= 0 && filteredHeaders[patientNameIndex]?.isEncrypted)
                    ? ""
                    : (row && patientNameIndex >= 0 && patientNameIndex < row.length ? row[patientNameIndex] : "");
  
                  let ageValue = (ageIndex >= 0 && filteredHeaders[ageIndex]?.isEncrypted)
                    ? ""
                    : (row && ageIndex >= 0 && ageIndex < row.length ? row[ageIndex] : "");
  
                  let genderValue = (genderIndex >= 0 && filteredHeaders[genderIndex]?.isEncrypted)
                    ? ""
                    : (row && genderIndex >= 0 && genderIndex < row.length ? row[genderIndex] : "");
  
                  directToExamination(row && row[`instanceuid`] ? row[`instanceuid`] : null);
                }}
              />
            );
            
            obj["view"] = (
              <VisibilityIcon
                onClick={(e) => {
                  // Extract values based on the header column name
                  let nameValue = (patientNameIndex >= 0 && filteredHeaders[patientNameIndex]?.isEncrypted)
                    ? ""
                    : (row && patientNameIndex >= 0 && patientNameIndex < row.length ? row[patientNameIndex] : "");
  
                  let ageValue = (ageIndex >= 0 && filteredHeaders[ageIndex]?.isEncrypted)
                    ? ""
                    : (row && ageIndex >= 0 && ageIndex < row.length ? row[ageIndex] : "");
  
                  let genderValue = (genderIndex >= 0 && filteredHeaders[genderIndex]?.isEncrypted)
                    ? ""
                    : (row && genderIndex >= 0 && genderIndex < row.length ? row[genderIndex] : "");
  
                  // Pass the extracted values to the next page
                  // seeIndividualRecordClick(row[0], nameValue, ageValue, genderValue);
                  directToSummary(row && row[`instanceuid`] ? row[`instanceuid`] : null);
                }}
              />
            );
            
            //if (isHealthWorker || isDrop) { //Removing conditaion as its available for all role as per JIRA ticket: CDIC-1020 ->1102
              obj["cdv"] = (
                <LocalHospitalIcon
                  onClick={(e) => getCVDRisk(row && row[`instanceuid`] ? row[`instanceuid`] : null, filteredHeaders)}
                />
              );
              obj["patientcard"] = (
                <PersonIcon
                  onClick={(e) => getPatientCard(row && row[`instanceuid`] ? row[`instanceuid`] : null, filteredHeaders)}
                />
              );
            //}
  
            //  if(window.document.body.clientWidth < 800 || window.cordova){
            //       // Add the filtered row to the final filterData array
            //       filterData.push({ ...row});
            //  }else{
            //       // Add the filtered row to the final filterData array
            //       filterData.push({ ...row, ...obj });
            //  }
            filterData.push({ ...row, ...obj });
            
          });
          // const sortedData = [...filterData].sort((a, b) => {
          //   const dateA = new Date(a["Date of Registration"]);
          //   const dateB = new Date(b["Date of Registration"]);
          //   return dateB - dateA; // latest first
          // });

          setUnfilteredTablelist(filterData); //sortedData
          setDatatableList(filterData); //sortedData
         
          // if(window.document.body.clientWidth < 800 || window.cordova){
          //   setSearchResult([])
          //   //setSearchAllResult([])
          //   searchArray = []
          //   searchArray.push(filteredHeaders);
          //   searchArray.push(sortedData)
          //   //console.log("searchArray ",searchArray,"sortedData",sortedData)
          //   setSearchResult(searchArray)
          //   //setSearchAllResult(searchArray);
          //   OfflineDb.setDataIntoPouchDB("myclients", searchArray);
          // }
        })
        .catch((error) => {
          console.error("getcustomlinelist API Error:", error);
          setGlobalSpinner(false);
          swal({
            title: "Error",
            text: navigator.onLine
              ? t("Failed to load client list. Please try again.")
              : t("Client list could not be shown in offline mode."),
            icon: "error",
            button: t("Close"),
          });
        });
    }

  const applyFilter = async () => {
    setPatientNameInput(""); // reset search
    let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
      programID = sessionUserBoValue.programs[0]
  try {
    let requestPayload = {
      orguid: orgID,       // dynamic orgID
      programuid: programID,
      age: age === "-" ? "" : age || "",
      gender: gender === "-" ? "" : gender || "",
      region: region === "-" ? "" : region || "",
      bmi: bmiCategory === "-" ? "" : bmiCategory || "",
      bmiz: bmiZ === "-" ? "" : bmiZ || "",
      hba1c: hba1c === "-" ? "" : hba1c || ""
    };

    getCasesListWithFilters(requestPayload); // Call with filter parameters
    
  } catch (error) {
    console.error("Error applying filters:", error);
  }
};

const resetFilters = (resetPatientName) => {
  if(!resetPatientName || patientnameinput){ // if user search then reset filter option
      setAge("");
      setGender("");
      setRegion("");
      setBmiCategory("");
      setBmiZ("");
      setHba1c("");
  }else{
    setPatientNameInput("");
    setAge("");
    setGender("");
    setRegion("");
    setBmiCategory("");
    setBmiZ("");
    setHba1c("");
    // 🔄 Reload default data (replace with your API or default dataset logic)
      let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
        programID = sessionUserBoValue.programs[0]
    try {
      let requestPayload = {
        orguid: orgID,       // dynamic orgID
        programuid: programID,
        age: "",
        gender: "",
        region: "",
        bmi: "",
        bmiz: "",
        hba1c:  ""
      };

      getCasesListWithFilters(requestPayload, 'reset'); // Call with filter parameters
      
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  }
};


  function UpdateRecordClick(e, instanceuid) {
    setGlobalSpinner(true);

    const formDataMassaged = {};
    const activeCaseDetails = {
      trackedEntityInstance: instanceuid,
      enrollmentId: "",
      type: "case",
      //   "stageinstanceuid": PropsArray.stageinstanceuid,
      //   "stageuid": PropsArray.stageuid
    };
    const activeCaseFormData = {
      formFormat: null, //formDataMassaged,
      dhisFormat: null,
    };
    const linkContact = {
      enabled: false,
      linkTrackedEntityInstance: instanceuid,
    };
    OfflineDb.setDataIntoPouchDB("activeCaseDetails", activeCaseDetails);
    OfflineDb.setDataIntoPouchDB("linkContactFlag", linkContact);
    setGlobalSpinner(false);
    history.push("/layout/registration");
  }

  const seeIndividualRecordClick = (instanceuid, name, age, gender) => {
    localStorage.setItem("trackedEntityInstance", instanceuid);
    localStorage.setItem("linkContact", false);
    localStorage.setItem("hidebutton", true);

    setGlobalSpinner(true);
    history.push("/layout/individualrecord", {
      trackedEntityInstance: instanceuid,
      name: name,
      age: age,
      gender: gender,
    });
  };

  function directToSummary(instanceuid) {
    setGlobalSpinner(true);

    const formDataMassaged = {};
    const activeCaseDetails = {
      trackedEntityInstance: instanceuid,
      enrollmentId: "",
      type: "case",
      //   "stageinstanceuid": PropsArray.stageinstanceuid,
      stageuid: patientProfileStageId,
    };
    const activeCaseFormData = {
      formFormat: null, //formDataMassaged,
      dhisFormat: null,
    };
    const linkContact = {
      enabled: false,
      linkTrackedEntityInstance: instanceuid,
    };
    OfflineDb.setDataIntoPouchDB("activeCaseDetails", activeCaseDetails);
    OfflineDb.setDataIntoPouchDB("linkContactFlag", linkContact);
    setGlobalSpinner(false);
    history.push("/layout/registration");
  }

  function directToExamination(instanceuid) {
    if(!stageAccessCheck(managementStageId)){
      swal({
          title: t("Alert"),
          text: t("You do not have access to view this module. Please check with the Administrator."),
          icon: "waring",
          button: t("Close"),
        });
      return;
    }
    setGlobalSpinner(true);

    const formDataMassaged = {};
    const activeCaseDetails = {
      trackedEntityInstance: instanceuid,
      enrollmentId: "",
      type: "case",
      //   "stageinstanceuid": PropsArray.stageinstanceuid,
      stageuid: managementStageId,
      redirectionTrue: true,
    };
    const activeCaseFormData = {
      formFormat: null, //formDataMassaged,
      dhisFormat: null,
    };
    const linkContact = {
      enabled: false,
      linkTrackedEntityInstance: instanceuid,
    };
    OfflineDb.setDataIntoPouchDB("activeCaseDetails", activeCaseDetails);
    OfflineDb.setDataIntoPouchDB("linkContactFlag", linkContact);
    sessionStorage.setItem("fromDirectToExamination", "true");
    setGlobalSpinner(false);
    history.push("/layout/registration");
  }

  const getCVDRisk = (instanceId, headerEle) => {
    try {
      setsmoking(null);
      setdiabetes(null);
      setsystolicBloodPressure(null);
      sethdlCholesterol(null);
      settotalCholesterol(null);
      setGlobalSpinner(true);
      const getURL =
        "trackedEntityInstances/" +
        instanceId +
        ".json?program=" +
        progarmData.programs[0].id +
        "&fields=*?";
      apiServices.getAPI(getURL).then((res) => {
        setGlobalSpinner(false);
        const findfName = headerEle.find(
          (obj) => obj.column.trim() == headerName[0]
        );
        const findGender = headerEle.find(
          (obj) => obj.column.trim() == headerName[1]
        );
        const findAge = headerEle.find(
          (obj) => obj.column.trim() == headerName[2]
        );
        let cName = findfName
          ? _.find(res.data.attributes, { attribute: findfName["name"] })
          : "";
        let ageVal = findAge
          ? _.find(res.data.attributes, { attribute: findAge["name"] })
          : "";
        let genderVal = findGender
          ? _.find(res.data.attributes, { attribute: findGender["name"] })
          : "";
        setclientName(cName ? cName.value : "");
        setAge(ageVal ? ageVal.value : "");
        setGender(genderVal ? genderVal.value : "");
        let allEvents = res.data.enrollments[0].events;
        let screeningStage = _.filter(allEvents, {
          programStage: screeningstageId,
        });
        let investigationStage = _.filter(allEvents, {
          programStage: advancedinvestigationstageId,
        });
        if (screeningStage.length > 0) {
          let dataValues = screeningStage[screeningStage.length - 1].dataValues;
          let smokingVal = _.find(dataValues, { dataElement: smokingId })
            ? _.find(dataValues, { dataElement: smokingId }).value &&
              _.find(dataValues, { dataElement: smokingId }).value == "Yes"
              ? 1
              : 0
            : null;
          let diabetesVal = _.find(dataValues, { dataElement: diabetesId })
            ? _.find(dataValues, { dataElement: diabetesId }).value &&
              (_.find(dataValues, { dataElement: diabetesId }).value == "1" ||
                _.find(dataValues, { dataElement: diabetesId }).value == "2")
              ? 1
              : 0
            : null;
          let sbpVal = _.find(dataValues, {
            dataElement: systolicBloodPressureId,
          })
            ? _.find(dataValues, { dataElement: systolicBloodPressureId }).value
            : null;
          setsmoking(smokingVal);
          setdiabetes(diabetesVal);
          setsystolicBloodPressure(sbpVal);
        }
        if (investigationStage.length > 0) {
          let investigationStagedataValues =
            investigationStage[investigationStage.length - 1].dataValues;
          let totalCholesterolVal = _.find(investigationStagedataValues, {
            dataElement: totalCholesterolId,
          })
            ? _.find(investigationStagedataValues, {
                dataElement: totalCholesterolId,
              }).value
            : null;
          let hdlCholesterolVal = _.find(investigationStagedataValues, {
            dataElement: hdlCholesterolId,
          })
            ? _.find(investigationStagedataValues, {
                dataElement: hdlCholesterolId,
              }).value
            : null;
          sethdlCholesterol(hdlCholesterolVal);
          settotalCholesterol(totalCholesterolVal);
        }
        setTimeout(function () {
          setopenCVDRisk(true);
        }, 500);
      });
    } catch (e) {}
  };

  function getPatientCard(instanceId) {
    //history.push('/layout/patientcard',{"trackedEntityInstance": row.row[0]})
    setOpenPatientCard(true);
    setTrackedEntityInstanceId(instanceId);
  }

  function printQRCards() {
    var contents_unsanitized = document.getElementById("printQRDiv").innerHTML;
    var contents = DOMPurify.sanitize(contents_unsanitized);
    var frame1 = document.createElement("iframe");
    frame1.name = "frame1";
    frame1.style.position = "absolute";
    // frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);
    var frameDoc = frame1.contentWindow
      ? frame1.contentWindow
      : frame1.contentDocument.document
      ? frame1.contentDocument.document
      : frame1.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write(`<html><head><title>Patient Card</title>`);
    frameDoc.document.write(`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
    </head><body>`);
    //frameDoc.document.write('<link href="../assets/css/card.css" rel="stylesheet" type="print" />');
    frameDoc.document.write(contents);
    frameDoc.document.write(`</body>
    <style>
        @media print {
            .makeStyles-root-38 {
                width: 100%;
                max-width: 500px;
            }

            .MuiAvatar-root{
              border-radius: 0;
              width: 100px;
              height: 100px;
              margin-right: 20px;
          }

            .MuiCard-root{
                border: 1px solid #ccc; !important;
            }

            .MuiGrid-container{
                display: flex;
                flex-wrap: wrap;
                box-sizing: border-box;
            }

            .MuiCardHeader-root {
                display: flex;
                padding: 16px;
                align-items: center;
            }

            .MuiCardHeader-avatar {
                flex: 0 0 auto;
                margin-right: 16px;
            }
            .MuiCardHeader-content span {
                color: #000;
                font-size: 20px;
                font-weight: bold;
            }

            .logobg {
                  width: 100px;
                  height: 100px;
                  background-repeat: no-repeat;
                  background-size: contain;
                  margin-top: 31px;
            }
            .alerts_description_fields {
                padding-left: 5px;
            }
            .MuiTypography-displayBlock {
                display: block;
            }
            .MuiTypography-body2 {
                
                // font-family: IBM Plex Sans;
                
                line-height: 1.43;
            }

            .MuiCardHeader-subheader {
                font-size: 14px !important;
                color: gray !important;
            }
            .MuiCardContent-root {
                padding: 16px;
            }

            .MuiCardContent-root:last-child {
                padding-bottom: 24px;
            }

            .pT0 {
                padding-top: 0px !important;
            }

            .alerts_description_fields{
                font-size: 20px;
            }

            .alerts_description_fields {
                font-size: 0.875rem;
                // font-family: IBM Plex Sans;
                font-weight: 400;
                line-height: 1.43;
                color: #212529;
                margin: 10px 0px;
            }

            .alerts_description_fields{
                font-size: 20px;
            }
            // body, .MuiTypography, button, .MuiTypography-body1 {
            //     font-family: 'Open Sans', sans-serif !important;
            // }

            .MuiGrid-spacing-xs-3 {
                width: calc(100% + 24px);
                margin: -12px;
            }

            .MuiGrid-container {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                box-sizing: border-box;
            }

            .MuiGrid-grid-sm-8 {
                flex-grow: 0;
                max-width: 66.666667%;
                flex-basis: 66.666667%;
            }

            .MuiGrid-grid-xs-8 {
                flex-grow: 0;
                max-width: 66.666667%;
                flex-basis: 66.666667%;
            }

            .MuiGrid-grid-md-4 {
                flex-grow: 0;
                max-width: 33.333333%;
                flex-basis: 33.333333%;
            }
            .MuiGrid-grid-xs-7 {
              flex-grow: 0;
              max-width: 58.333333%;
              flex-basis: 58.333333%;
          }
            .MuiGrid-grid-xs-5 {
              flex-grow: 0;
              max-width: 41.666667%;
              flex-basis: 41.666667%;
          }

          .MuiGrid-spacing-xs-3 > .MuiGrid-item {
            padding: 12px;
          }
        }
</style>
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script></html>`);
    frameDoc.document.close();
    setTimeout(function () {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      document.body.removeChild(frame1);
    }, 1000);
    //setOpenPatientCard(false)
    return false;
  }

  function shareQRCards() {
    //setGlobalSpinner(true)
    html2canvas(document.querySelector("#printQRDiv"), {
      allowTaint: true,
      useCORS: true,
    })
      .then((canvas) => {
        setGlobalSpinner(false);
        //const imageScreen = new Image();
        //imageScreen.src = canvas.toDataURL();
        //imageScreen.onload = () => setiscreenshotContinue(imageScreen)
        window.plugins.socialsharing.share(
          null,
          null,
          canvas.toDataURL("image/png"),
          null
        );
      })
      .catch((error) => {
        setGlobalSpinner(false);
      });
  }

  function renderPatientCard() {
    return (
      <div className="modaloverlay">
        <div className="modalcardholder">
          <Card className="modalcard">
            <CardHeader
              className="modalheader"
              action={
                <IconButton aria-label="close">
                  <CloseIcon onClick={() => setOpenPatientCard(false)} />
                </IconButton>
              }
              title={t("Patient Card")}
            />
            <CardContent className="modalbodycontent">
              <PatientCard
                trackedEntityInstance={trackedEntityInstanceId}
              ></PatientCard>
            </CardContent>
            <CardActions className="modalfooter">
              {window.cordova ? (
                <Button
                  className="modalactionbtn"
                  onClick={() => shareQRCards()}
                >
                  {t("Share")}
                </Button>
              ) : (
                <Button
                  className="modalactionbtn"
                  onClick={() => printQRCards()}
                >
                  {t("Print")}
                </Button>
              )}
              <Button
                className="modalactionbtn"
                onClick={() => setOpenPatientCard(false)}
              >
                {t("Cancel")}
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
    );
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

const transformRowsToTableData = (rows) => {
  const isMobile = window.document.body.clientWidth < 800 || window.cordova;
  
  return rows.map((ele) => {
    const obj = {};
    
    // Copy selected header columns
    selectedHeaderNames.forEach((header) => {
      const columnName = header.column;
        obj[columnName] = isMobile 
          ? ele[columnName] 
          : (ele[columnName] || "-");
    });
    
    // Add action icons for desktop
    //if (!isMobile) {
      obj.edit = <EditIcon onClick={(e) => UpdateRecordClick(e, ele.instanceuid)} />;
      obj.followup = <AssignmentTurnedInIcon onClick={(e) => directToExamination(ele.instanceuid)} />;
      obj.view = <VisibilityIcon onClick={(e) => directToSummary(ele.instanceuid)} />;
      obj.cdv = <LocalHospitalIcon onClick={(e) => getCVDRisk(ele.instanceuid, searchAllResult[0])} />;
      obj.patientcard = <PersonIcon onClick={(e) => getPatientCard(ele.instanceuid, searchAllResult[0])} />;
    //}
    
    return obj;
  });
};


const updatePatientNameWithFilter = (patientnameinput) => {
  const trimmedInput = patientnameinput?.trim() || "";
  setPatientNameInput(patientnameinput);
  resetFilters(false)
  // Empty input — reset results quickly
  if (!trimmedInput) {
    const resetData = transformRowsToTableData(searchAllResult[1]);
    setDatatableList(resetData)
    setGlobalSpinner(false);
    return;
  }

  // Skip filtering for <3 chars
  if (trimmedInput.length < 3) {
    setGlobalSpinner(false);
    return;
  }

  // Show spinner while filtering
  setGlobalSpinner(true);

  // Do the actual filtering (no extra setTimeout)
  const filteredList = searchAllResult[1].filter((row) =>
    (row["First name"] || "").toLowerCase().includes(trimmedInput.toLowerCase())
  );

  const filterData = transformRowsToTableData(filteredList);
  setDatatableList(filterData);

  // Stop spinner right after setting data
  setTimeout(() => setGlobalSpinner(false), 150);
};


const updatePatientName_old = (patientnameinput) => {
    const trimmedInput = patientnameinput?.trim() || "";
    setPatientNameInput(patientnameinput);
    let filteredList = [];
    setGlobalSpinner(true);

    if (patientnameinput && patientnameinput.length > 2) {
      if (!patientnameinput || patientnameinput.trim() === "") {
        setGlobalSpinner(false);
        return;
      }
      searchAllResult[1].map(function (objectKey) {
        // Iterate through each field in the row (objectKey) and check if any field matches the search input
        let matchFound = selectedHeaderNames.some((header) => {
          const columnName = header[0].obj.column;
          const data = objectKey[header[0].index];

          // Convert date formats before searching if the value is a date
          if (
            moment(data, moment.ISO_8601, true).isValid() ||
            moment(data, "DD-MM-YYYY", true).isValid() ||
            moment(data, "YYYY-MM-DD", true).isValid()
          ) {
            const formattedDate = moment(data).format("DD-MM-YYYY");
            const searchDate = moment(
              patientnameinput,
              "DD-MM-YYYY",
              true
            ).isValid()
              ? moment(patientnameinput).format("YYYY-MM-DD")
              : patientnameinput;

            return (
              data.toLowerCase().includes(searchDate.toLowerCase()) ||
              formattedDate.includes(patientnameinput.toLowerCase())
            );
          }

          // Search in visible columns only
          if (typeof data === "string" || typeof data === "number") {
            return data
              .toString()
              .toLowerCase()
              .includes(patientnameinput.toLowerCase());
          }
          return false;
        });

        if (matchFound) {
          filteredList.push(objectKey);
        }
      });
      let filterData = [];
      filteredList.map((ele) => {
        let obj = {};
        let nameValue = "";
        let ageValue = "";
        let genderValue = "";

        // Dynamically map the fields from selectedHeaderNames
        selectedHeaderNames.forEach((header) => {
          const columnName = header[0].obj.column;
          const value = ele[header[0].index] || "-";

          // Handle encrypted fields
          if (header[0].obj.isEncrypted) {
            obj[columnName] = "Data Encrypted"; // Placeholder for encrypted data
          } else {
            // Check if value is a date and format it
            if (
              moment(value, moment.ISO_8601, true).isValid() ||
              moment(value, "DD-MM-YYYY", true).isValid() ||
              moment(value, "YYYY-MM-DD", true).isValid()
            ) {
              obj[columnName] = value; // Store original value
              obj[`${columnName}_formatted`] =
                moment(value).format("DD-MM-YYYY"); // Store formatted value
            } else {
              obj[columnName] = value; // If not a date keep the original value
            }
          }
          if (columnName === "Patient Name") {
            nameValue = value; // Store the value of Patient Name
          } else if (columnName === "Age") {
            ageValue = value; // Store the value of Age
          } else if (columnName === "Sex at birth") {
            genderValue = value; // Store the value of Gender
          }
        });

        // Add other static fields like edit, view, etc.
        obj.edit = <EditIcon onClick={(e) => UpdateRecordClick(e, ele[0])} />;
        obj.followup = (
          <AssignmentTurnedInIcon
            onClick={(e) => directToExamination(ele[0])}
          />
        );
        obj.view = (
          <VisibilityIcon
            onClick={(e) => {
              directToSummary(ele[0]);
              //   seeIndividualRecordClick(
              //     ele[0],  // Unique ID
              //     nameValue,  // Name value
              //     ageValue,   // Age value
              //     genderValue // Gender value (Sex at birth)
              // );
            }}
          />
        );
        obj.cdv = (
          <LocalHospitalIcon
            onClick={(e) => getCVDRisk(ele[0], searchAllResult[0])}
          />
        );
        obj.patientcard = (
          <PersonIcon
            onClick={(e) => getPatientCard(ele[0], searchAllResult[0])}
          />
        );

        filterData.push(obj);
      });

      setDatatableList([]);
      setTimeout(() => {
        setGlobalSpinner(false);
        setDatatableList(filterData);
      }, 500);
    } else {
      if (patientnameinput.length === 0) {
        let filterData = [];
        searchAllResult[1].map((ele) => {
          let obj = {};
          let nameValue = "";
          let ageValue = "";
          let genderValue = "";
          // Dynamically map the fields from selectedHeaderNames
          selectedHeaderNames.forEach((header) => {
            const columnName = header[0].obj.column;
            const value = ele[header[0].index] || "-";

            // Handle encrypted fields
            if (header[0].obj.isEncrypted) {
              obj[columnName] = "Data Encrypted"; // Placeholder for encrypted data
            } else {
              if (
                moment(value, moment.ISO_8601, true).isValid() ||
                moment(value, "DD-MM-YYYY", true).isValid() ||
                moment(value, "YYYY-MM-DD", true).isValid()
              ) {
                obj[columnName] = value;
                obj[`${columnName}_formatted`] =
                  moment(value).format("DD-MM-YYYY");
              } else {
                obj[columnName] = value;
              }
            }
            if (columnName === "Patient Name") {
              nameValue = value; // Store the value of Patient Name
            } else if (columnName === "Age") {
              ageValue = value; // Store the value of Age
            } else if (columnName === "Sex at birth") {
              genderValue = value; // Store the value of Gender
            }
          });
          obj.edit = <EditIcon onClick={(e) => UpdateRecordClick(e, ele[0])} />;
          obj.followup = (
            <AssignmentTurnedInIcon
              onClick={(e) => UpdateRecordClick(e, ele[0])}
            />
          );
          obj.view = (
            <VisibilityIcon
            //         onClick={(e) =>
            //             // seeIndividualRecordClick(
            //             //     ele[0],
            //             //     obj[selectedHeaderNames[0][0]?.obj.column],
            //             //     obj[selectedHeaderNames[2][0]?.obj.column],
            //             //     obj[selectedHeaderNames[1][0]?.obj.column]
            //             // )
            //               seeIndividualRecordClick(
            //                 ele[0],  // Unique ID
            //                 nameValue,  // Name value
            //                 ageValue,   // Age value
            //                 genderValue // Gender value (Sex at birth)
            // )
            //         }
            />
          );
          obj.cdv = (
            <LocalHospitalIcon
              onClick={(e) => getCVDRisk(ele[0], searchAllResult[0])}
            />
          );
          obj.patientcard = (
            <PersonIcon
              onClick={(e) => getPatientCard(ele[0], searchAllResult[0])}
            />
          );

          filterData.push(obj);
        });

        setUnfilteredTablelist(filterData);
        setDatatableList(filterData);
        setGlobalSpinner(false);
      } else {
        setGlobalSpinner(false);
      }
    }
  };

const updatePatientName = (input) => {
  const text = input?.trim() || "";
  setPatientNameInput(input);

  const token = Date.now();
  searchToken.current = token;

  setGlobalSpinner(true);

  // Reset when input empty or short
  if (text.length < 3) {
    if (text.length === 0) {
      const resetData = buildTableRows(searchAllResult[1]);
      // Ensure this reset is the latest request
      if (searchToken.current === token) {
        setUnfilteredTablelist(resetData);
        setDatatableList(resetData);
      }
    }
    setGlobalSpinner(false);
    return;
  }

  // Perform search
  const filtered = searchAllResult[1].filter((row) =>
    selectedHeaderNames.some((header) => {
      const val = row[header[0].index];
      if (!val) return false;

      const search = text.toLowerCase();
      const value = val.toString().toLowerCase();

      const isDate =
        moment(value, moment.ISO_8601, true).isValid() ||
        moment(value, "DD-MM-YYYY", true).isValid() ||
        moment(value, "YYYY-MM-DD", true).isValid();

      if (isDate) {
        const formatted = moment(value).format("DD-MM-YYYY");
        return formatted.includes(search) || value.includes(search);
      }

      return value.includes(search);
    })
  );

  const results = buildTableRows(filtered);

  // Check token before updating UI
  setTimeout(() => {
    if (searchToken.current === token) {
      setDatatableList(results);
      setGlobalSpinner(false);
    }
  }, 250);
};



const buildTableRows = (list) => {
  return list.map((row) => {
    let obj = {};
    let name = "", age = "", gender = "";

    selectedHeaderNames.forEach((header) => {
      const column = header[0].obj.column;
      const value = row[header[0].index] || "-";

      if (header[0].obj.isEncrypted) {
        obj[column] = "Data Encrypted";
      } else {
        const isDate =
          moment(value, moment.ISO_8601, true).isValid() ||
          moment(value, "DD-MM-YYYY", true).isValid() ||
          moment(value, "YYYY-MM-DD", true).isValid();

        obj[column] = value;
        if (isDate) obj[`${column}_formatted`] = moment(value).format("DD-MM-YYYY");
      }

      if (column === "Patient Name") name = value;
      if (column === "Age") age = value;
      if (column === "Sex at birth") gender = value;
    });

    obj.edit = <EditIcon onClick={(e) => UpdateRecordClick(e, row[0])} />;
    obj.followup = (
      <AssignmentTurnedInIcon onClick={(e) => directToExamination(row[0])} />
    );
    obj.view = (
      <VisibilityIcon onClick={(e) => directToSummary(row[0])} />
    );
    obj.cdv = (
      <LocalHospitalIcon onClick={(e) => getCVDRisk(row[0], searchAllResult[0])} />
    );
    obj.patientcard = (
      <PersonIcon onClick={(e) => getPatientCard(row[0], searchAllResult[0])} />
    );

    return obj;
  });
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

  const patientFilter = () => {
      return(
       <Box className="patient-filter" sx={{ flexGrow: 1, borderRadius: '8px' }}>
  <Grid container spacing={0.5} alignItems="center">

    {/* Age Filter */}
    <Grid item xs={12} sm={6} md={1}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="age-label" shrink>{t("Age")}</InputLabel>
        <Select
          labelId="age-label"
          id="age-select"
          value={age}
          label={t("Age")}
          onChange={(e) => setAge(e.target.value)}
        >
          <MenuItem value="-"><em>{t("None")}</em></MenuItem>
          <MenuItem value="Below 5">{t("Below 5")}</MenuItem>
          <MenuItem value="6 to 11">{t("6 to 11")}</MenuItem>
          <MenuItem value="12 to 18">{t("12 to 18")}</MenuItem>
          <MenuItem value="19 to 44">{t("19 to 44")}</MenuItem>
          <MenuItem value="45 to 59">{t("45 to 59")}</MenuItem>
          <MenuItem value="60 and above">{t("60 and above")}</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Gender Filter */}
    <Grid item xs={12} sm={6} md={1}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="gender-label" shrink>{t("Gender")}</InputLabel>
        <Select
          labelId="gender-label"
          id="gender-select"
          value={gender}
          label={t("Gender")}
          onChange={(e) => setGender(e.target.value)}
        >
          <MenuItem value="-"><em>{t("None")}</em></MenuItem>
          <MenuItem value="Male">{t("Male")}</MenuItem>
          <MenuItem value="Female">{t("Female")}</MenuItem>
          <MenuItem value="Other">{t("Other")}</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Region Filter */}
    <Grid item xs={12} sm={6} md={2}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="region-label" shrink>{t("Region Type")}</InputLabel>
        <Select
          labelId="region-label"
          id="region-select"
          value={region}
          label={t("Region Type")}
          onChange={(e) => setRegion(e.target.value)}
        >
          <MenuItem value="-"><em>{t("None")}</em></MenuItem>
          <MenuItem value="Urban">{t("Urban")}</MenuItem>
          <MenuItem value="Rural">{t("Rural")}</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* BMI Category Filter */}
    <Grid item xs={12} sm={6} md={3}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="bmi-category-label" shrink>{t("BMI Category")}</InputLabel>
        <Select
          labelId="bmi-category-label"
          id="bmi-category-select"
          value={bmiCategory}
          label={t("BMI Category")}
          onChange={(e) => setBmiCategory(e.target.value)}
        >
          <MenuItem value="-"><em>{t("None")}</em></MenuItem>
          <MenuItem value="Underweight: Less than 18.5">{t("Underweight- Less than 18.5")}</MenuItem>
          <MenuItem value="Healthy Weight: 18.5 to less than 25">{t("Healthy Weight- 18.5 to < 25")}</MenuItem>
          <MenuItem value="Overweight: 25 to less than 30">{t("Overweight- 25 to < 30")}</MenuItem>
          <MenuItem value="Obese: 30 or greater">{t("Obese- 30 or greater")}</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* BMI-Z Filter */}
    <Grid item xs={12} sm={6} md={2}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="bmi-z-label" shrink>{t("BMI-Z")}</InputLabel>
        <Select
          labelId="bmi-z-label"
          id="bmi-z-select"
          value={bmiZ}
          label={t("BMI-Z")}
          onChange={(e) => setBmiZ(e.target.value)}
        >
          <MenuItem value="-"><em>{t("None")}</em></MenuItem>
          <MenuItem value="Severely Underweight">{t("Severely Underweight")}</MenuItem>
          <MenuItem value="Underweight">{t("Underweight")}</MenuItem>
          <MenuItem value="Normal (Healthy weight)">{t("Normal (Healthy weight)")}</MenuItem>
          <MenuItem value="Overweight">{t("Overweight")}</MenuItem>
          <MenuItem value="Obese">{t("Obese")}</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* HbA1c Filter */}
    <Grid item xs={12} sm={6} md={2}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="hba1c-label" shrink>{t("HbA1c")}</InputLabel>
        <Select
          labelId="hba1c-label"
          id="hba1c-select"
          value={hba1c}
          label={t("HbA1c")}
          onChange={(e) => setHba1c(e.target.value)}
        >
          <MenuItem value="-"><em>{t("None")}</em></MenuItem>
          <MenuItem value="Normal: Below 5.7%">{t("Normal: Below 5.7%")}</MenuItem>
          <MenuItem value="Pre-diabetic: 5.7% to 6.4%">{t("Pre-diabetic: 5.7% to 6.4%")}</MenuItem>
          <MenuItem value="Diabetic: 6.5% or higher">{t("Diabetic: 6.5% or higher")}</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Buttons */}
    <Grid
      className="filter-button"
      item
      xs={12}
      sm={6}
      md={1} // Changed from 1
      sx={{
        display: "flex",
        justifyContent: { xs: 'center', sm: 'flex-end', md: 'flex-end' },
        gap: 2,
        mt: { xs: 2, md: 0 }
      }}
    >
      <Button className={!age && !gender && !region && !bmiCategory && !bmiZ && !hba1c ? "disabled": ""} variant="contained" disabled={!age && !gender && !region && !bmiCategory && !bmiZ && !hba1c ? true: false} onClick={() => resetFilters(true)}>{t("Reset")}</Button>
      {/* <Box sx={{ display: 'flex', gap: 2 }}>
        <Button className={!age && !gender && !region && !bmiCategory && !bmiZ && !hba1c ? "disabled": ""} variant="contained" disabled={!age && !gender && !region && !bmiCategory && !bmiZ && !hba1c ? true: false} onClick={applyFilter}>{t("Apply")}</Button>
        <Button className={!age && !gender && !region && !bmiCategory && !bmiZ && !hba1c ? "disabled": ""} variant="contained" disabled={!age && !gender && !region && !bmiCategory && !bmiZ && !hba1c ? true: false} onClick={() => resetFilters(true)}>{t("Reset")}</Button>
      </Box> */}
    </Grid>
  </Grid>
</Box>
      )
  }
  return (
    <section
      className="searchcustombg searchtabmaindiv myclientspage"
      style={{
        // backgroundColor: '#fff',
        flexGrow: 1,
        padding: 0,
      }}
    >
      <FooterMenu></FooterMenu>
      <div className="searchformcontainer patientlistsection">
        <p className="searchformheading">
          <span>
            <Trans>{t("Patient Record List")}</Trans>
          </span>
        </p>
        {searchResult.length > 0 &&
          progarmData != null &&
          Configuration != null ? (
          <>
            <Grid container spacing={3}>
              {/* <Grid item xs={2}>Search:</Grid> */}
              <Grid item xs={12}>
                <Tooltip title={t("Search")} arrow>
                  <SearchBar
                    keyword={patientnameinput}
                    setKeyword={APP_LOCALE==="PRODUCT"? updatePatientNameWithFilter : updatePatientName}
                    placeholder={t("Search")}
                  />
                </Tooltip>
              </Grid>
              {APP_LOCALE === "PRODUCT"?
                //patientFilter()
                <Box sx={{ width: "100%", px: { xs: 1, sm: 2 }, mb: { xs: 3, sm: 0 },}}>
                  <Accordion
                        //defaultExpanded
                        sx={{
                          ml: "20px !important", 
                          mr: "9px", 
                          boxShadow: 1, 
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            minHeight: "36px !important", // smaller header height
                            backgroundColor: "#001965 !important", 
                            color: "#fff !important",
                            "& .MuiAccordionSummary-content": {
                              margin: 0,
                              alignItems: "center",
                            },
                          }}
                        >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {t("Filters")}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{
                        p: { xs: 1, sm: 2 },
                        mt: { xs: 0.5, sm: 1 }
                      }}
                    >
                      { patientFilter() }
                    </AccordionDetails>
                  </Accordion>
                </Box>
              :
              <></>
              }
              



              {/* <Grid item xs={3}>
                            <SearchBar 
                                input={input} 
                                setKeyword={updateConatctNumber}
                                placeholder={"Contact Number"}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <SearchBar 
                                input={input} 
                                setKeyword={updateUIC}
                                placeholder={"UIC"}
                            />
                        </Grid> */}
            </Grid>
            <CaseListInTableView columns={columnHeader} data={datatableList} itemsPerPage={Configuration.pagination.itemsPerPage}/>
          </>
        ) : null}
      </div>
      {openCVDRisk && searchResult.length > 0 ? (
        <CVDCalculator
          name={clietName}
          age={age}
          gender={gender ? gender.toLowerCase() : ""}
          smoking={smoking}
          diabetes={diabetes}
          systolicBloodPressure={systolicBloodPressure}
          totalCholesterol={totalCholesterol}
          hdlCholesterol={hdlCholesterol}
          setopenCVDRisk={setopenCVDRisk}
        />
      ) : (
        <></>
      )}
      {openPatientCard && trackedEntityInstanceId ? renderPatientCard() : <></>}
    </section>
  );
}
export default Cases;
