import React, { useEffect, useState } from "react";
import { apiServices } from "../../services/apiServices";
import moment from "moment";

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";

import Avatar from "@material-ui/core/Avatar";
import DescriptionIcon from "@material-ui/icons/Description";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import Box from "@material-ui/core/Box";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import swal from "sweetalert";
import { useHistory } from "react-router";

import "../../assets/css/customstyles.css";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import OfflineDb from "../../db";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import { useTranslation } from "react-i18next";
import {getDateFormat} from '../../config/validationutils'
import GetInsulinTableDetail from "./GetInsulinTableDetail";
import { format } from 'date-fns';
import { array } from "yup";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "#4DB6AC",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

function RecordHistory(props) {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [GroupArr, serGroupArr] = useState([])
  const sessionMetaData = props.programData;
  const currentStage = props.currentStage;
  const trackentityInstanceDetails = props.trackentityInstanceDetails;
  const values = props.values;
  const customfieldobj = props.customfieldobj;
  const typeofMeds = customfieldobj.typeOfMedicationHistory;
  const isSidebarOpen = props.isSidebarOpen;
  const managementStageId = props.managementStageId;

  const eventsData =
    navigator.onLine &&
    props.trackentityInstanceDetails &&
    props.trackentityInstanceDetails.enrollments &&
    props.trackentityInstanceDetails.enrollments.length > 0 &&
    props.trackentityInstanceDetails.enrollments[0].events
      ? props.trackentityInstanceDetails.enrollments[0].events
      : !navigator.onLine
      ? props.trackentityInstanceDetails
      : [];
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  const GroupEventData = (arrayData) => {
    arrayData.forEach((element) => {
      element.groupDate = element?.lastUpdated?.split("T")[0]; //manually added new Date key for grouping
    });

    let GroupArrData = arrayData.reduce(function (r, a) {
      r[a.groupDate] = r[a.groupDate] || [];
      r[a.groupDate].push(a);
      return r;
    }, Object.create(null));

    //return GroupArrData;
     // Sort keys latest date first
    const sortedGroupArrData = Object.keys(GroupArrData)
      .sort((a, b) => new Date(b) - new Date(a))
      .reduce((result, key) => {
        result[key] = GroupArrData[key];
        return result;
      }, {});

    return sortedGroupArrData;
  };
  
  function formatDateToDDMMYYYY(dateString) {
    const dataFormat1 = getDateFormat("dateformat");
    const formattedValue = format(new Date(dateString), dataFormat1);
    // console.log("DateString",dateString)
    // const [year, month, day] = dateString.split("-");
    // return `${day}-${month}-${year}`;
    return formattedValue;
  }

  useEffect(() => {
  const uniqueEvents = removeDuplicates(eventsData)
  const GroupArr = GroupEventData(removeDuplicates(uniqueEvents));
  serGroupArr(GroupArr)
  console.log(uniqueEvents, 'eventsdata')
  }, [eventsData])

  // Handle accordion expansion
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const isEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) return false;
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) return false;
  
    for (let key of keys1) {
      if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) return false;
    }
  
    return true;
  };


  const removeDuplicates = (array) => {
    return array.filter((item, index) => {
    return array.findIndex((other) => isEqual(item.dataValues, other.dataValues)) === index;
  });
  };

  const getTranslatedLabels = (attribute) => {
    if (localStorage.getItem("locale") === "en") {
      return (
        attribute.formName || attribute.displayName || attribute.description
      );
    } else if (attribute.translations && attribute.translations.length > 0) {
      const label = attribute.translations.filter(
        (translation) =>
          translation.property === "NAME" &&
          translation.locale === localStorage.getItem("locale")
      );
      if (label.length > 0) {
        return label[0].value;
      } else {
        return (
          attribute.formName || attribute.displayName || attribute.description
        );
      }
    }
    return attribute.formName || attribute.displayName || attribute.description;
  };

  // ===============for Insulin Table================//
  const [insulinHeader, setInsulinHeader] = useState({});
  const [nonInsulinHeader, setNonInsulinHeader] = useState({});
  const [insulinTable, setinsulinTable] = useState([]);
  const [nonInsulinTable, setNonInsulinTable] = useState([]);
  const [downloading, setDownloading] = useState({});
  // =================================================//
  
  const handleDownload = async (key,eventId) => {
      try {
        setGlobalSpinner(true)
        setDownloading(prev => ({ ...prev, [key]: true }));
        const fileurl = "events/files?eventUid=" +
                  eventId +
                  "&dataElementUid=" +
                  key
        const response = await apiServices.getBlobAPI(fileurl)
        const blob = response.data; 
        
        // 🔥 Detect file type
    const contentType =
      response.headers?.["content-type"] || blob.type;

    // 🔥 Extract filename from header (if backend sends it)
    let fileName = "download";

    const contentDisposition = response.headers?.["content-disposition"];

    if (contentDisposition && contentDisposition.includes("filename")) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);

      if (match && match[1]) {
        fileName = match[1]
          .split(";")[0]          // 🔥 removes ;charset=UTF-8
          .trim();
      }
    } else {
      // fallback
      const contentType =
      response.headers?.["content-type"] || blob.type;

      if (contentType.includes("pdf")) {
        fileName = "download.pdf";
      } else if (contentType.includes("image")) {
        // 🔥 remove charset if present
        const cleanType = contentType.split(";")[0];   // removes ;charset=UTF-8
        const extension = cleanType.split("/")[1];

        fileName = `download.${extension}`;
      }
    }
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setGlobalSpinner(false);
      setDownloading(prev => ({ ...prev, [key]: false }));
    }
  };

  function createStructure(events) {
    return events.dataValues.map((values, i) => {
      return sessionMetaData?.programs[0]?.programStages.map((stages) => {
        // console.log("createStructure",stages)
        let filterFieldData = _.sortBy(
          stages?.programStageDataElements,
          "sortOrder"
        ).filter(
          (obj) =>
            stages.id === events.programStage &&
            obj.dataElement.id === values.dataElement
        );
        let fieldValue = values.value;

        if (filterFieldData.length > 0) {
          try {
            
            if (filterFieldData[0].dataElement.valueType === "DATE") {
              // fieldValue = moment(values.value).format("DD-MM-YYYY");
              fieldValue = formatDateToDDMMYYYY(values.value)
            }
            if (
              filterFieldData[0].dataElement.valueType === "ORGANISATION_UNIT"
            ) {
              let orgObj = sessionMetaData.programs[0].organisationUnits.find(
                (o) => o.id === values.value
              );
              if (orgObj) {
                fieldValue = orgObj.displayName;
              }
            }
            if (filterFieldData[0].dataElement.optionSet) {
              filterFieldData[0].dataElement.optionSet.options.map((option) => {
                if (option.code === values.value) {
                  fieldValue = getTranslatedLabels(option);
                }
              });
            }

            if((filterFieldData[0].dataElement.valueType === "IMAGE" || filterFieldData[0].dataElement.valueType === "FILE_RESOURCE") && fieldValue){
              fieldValue = (
                    <>
                      <span>{t("Download File ")}</span>
                    <FileDownloadOutlined
                      className="viewdownloadIcon"
                      sx={{
                        cursor: downloading?.[filterFieldData[0].dataElement.id] ? "not-allowed" : "pointer",
                        opacity: downloading?.[filterFieldData[0].dataElement.id] ? 0.6 : 1,
                        fontSize: 20,
                        color: "#1976d2",
                        "&:hover": { color: "#0d47a1" },
                      }}
                      onClick={!downloading?.[filterFieldData[0].dataElement.id] ? () => handleDownload(filterFieldData[0].dataElement.id,events.event) : undefined}
                    />
                    </>
                    
                  )
            }
          } catch (e) {}

          if (
            filterFieldData[0].dataElement &&
            filterFieldData[0].dataElement.valueType === "BOOLEAN"
          ) {
            if (fieldValue === "true") {
              // If fieldValue is true, display "Yes"
              fieldValue = "Yes";
            } else {
              // If fieldValue is false, skip rendering this element
              return null;
            }
        }
          // Condition to exclude 'type of medication' variable from the record history
          if(filterFieldData[0]?.dataElement.id!= customfieldobj.typeOfMedicationHistory &&
            filterFieldData[0]?.dataElement.id!=customfieldobj.typeOfMedication
          )
          {
            return (
              <ListItem key={i}>
                <ListItemAvatar>
                  <Avatar>
                    <DescriptionIcon />
                  </Avatar>
                </ListItemAvatar>
                <Typography>
                  <span className="zero servicequestiontitle">
                    {getTranslatedLabels(filterFieldData[0].dataElement)}:
                  </span>
                  &nbsp;
                  <span className="zero servicequestionanswer">{fieldValue}</span>
                </Typography>
              </ListItem>
            );
          }
         
        }
      });
    });
  }

  function getEntityData(events, i, dateVal,currentStage) {
    let findFlag = false;
    const classes = makeStyles((theme) => ({
      root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
      },
    }));

    const allStages = props.programData.programs[0].programStages;
    const filterStageEvent = allStages.filter(
      (obj) =>
        obj.id === events.programStage &&
        currentStage.id === obj.id &&
        events.status !== "SCHEDULE"
    );

    if (!filterStageEvent.length) {
      return null;
    }
    let combinedTableHeaders = []
      currentStage.programStageDataElements.map((de) => {
          if (
            _.find(de.dataElement.attributeValues, {
              attribute: { name: "ShowInInsulinTable" },
            }) &&
            _.find(de.dataElement.attributeValues, {
              attribute: { name: "ShowInInsulinTable" },
            }).value == "true"
          ) {
            combinedTableHeaders.push(de.dataElement.id)
          }
      
          if (
            _.find(de.dataElement.attributeValues, {
              attribute: { name: "ShowInNon-InsulinTable" },
            }) &&
            _.find(de.dataElement.attributeValues, {
              attribute: { name: "ShowInNon-InsulinTable" },
            }).value == "true"
          ) {
            combinedTableHeaders.push(de.dataElement.id)
          }

          
          findFlag = events.dataValues?.some((dataValue) =>
            combinedTableHeaders?.includes(dataValue.dataElement)
          );
        });
    if (events.dataValues.length > 0 && !findFlag) {
      return (
        <div className="appointment-card">
          <h4>{moment(dateVal).format("LT")}</h4>
          {/* {console.log("appointment-card",moment(dateVal).format("LT"),events )} */}
          <List className={classes.root}>{createStructure(events)}</List>
        </div>
      );
    }
  }

  return (
    // history section previous visits section
    <Grid container spacing={2}>
     <Grid
      item
      xs={currentStage.id === managementStageId ? 12 : isSidebarOpen ? 12 : 12}
      sm={currentStage.id === managementStageId ? 12 : isSidebarOpen ? 6 : 11}
      md={currentStage.id === managementStageId ? 12 : isSidebarOpen ? 8 : 11}
      lg={currentStage.id === managementStageId ? 12 : isSidebarOpen ? 8 : 12}
      className="previousGridSection">
    <section
      className="individualrecord"
      style={{ flexGrow: 1, padding: 0 }}
    >
      <div className="searchformcontainer">
        <Grid style={{ marginBottom: "50px" }} className="previous-section">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              className="visit-bg"
            >
              <Typography>{t("Previous Visits")}</Typography>
            </AccordionSummary>
            {GroupArr &&
            Object.keys(GroupArr).length > 0 &&
            Object.keys(GroupArr).map((key) => {
              // Filter GroupArr[key] based on programStage matching currentStage.id
              const currentStageData = GroupArr[key].filter(
                (item) => item.programStage === props?.currentStage.id
              );
            
              return (
                <AccordionDetails key={key} className="data-container pt-0">
                  <Grid container className="mt-10px mb-10px">
                    <Grid item xs={12} sm={12} md={12} className="mb-10px">
                      <Accordion
                        expanded={
                          expanded ===
                          `${moment(GroupArr[key][0].lastUpdated).format(
                            "MMMM Do YYYY"
                          )}-${GroupArr[key][0].event}`
                        }
                        onChange={handleChange(
                          `${moment(GroupArr[key][0].lastUpdated).format(
                            "MMMM Do YYYY"
                          )}-${GroupArr[key][0].event}`
                        )}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                          className="visit-bg second-visit-accordion"
                        >
                          <Typography>
                            {moment(GroupArr[key][0].lastUpdated).format("MMMM Do YYYY")}
                          </Typography>
                        </AccordionSummary>
                        {currentStage &&
                        _.find(currentStage.attributeValues, {
                          attribute: { name: "InsulinTable" },
                        }) &&
                        _.find(currentStage.attributeValues, {
                          attribute: { name: "InsulinTable" },
                        }).value === "true" ? (
                          <>
                            <GetInsulinTableDetail
                              currentStage={props.currentStage}
                              currentStageData={currentStageData}
                            />
                            {currentStageData
                            .slice()
                            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
                            .map((events, i) => (
                              <CardContent key={i}>
                                {getEntityData(
                                  events,
                                  i,
                                  events.lastUpdated,
                                  currentStage
                                )}
                              </CardContent>
                            ))}
                          </>
                        ) : (
                          <>
                            {currentStageData 
                            .slice()
                            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
                            .map((events, i) => (
                              <AccordionDetails key={i}>
                                {getEntityData(
                                  events,
                                  i,
                                  events.lastUpdated,
                                  currentStage
                                )}
                              </AccordionDetails>
                            ))}
                          </>
                        )}
                      </Accordion>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              );
            })}
          </Accordion>
        </Grid>
      </div>
    </section>
    </Grid>
    {/* <Grid item xs={12} sm={6} lg={4} md={4}></Grid> */}
    <Grid
      item
      xs={currentStage.id === managementStageId ? 12 : isSidebarOpen ? 12 : 4}
      sm={currentStage.id === managementStageId ? 12 : isSidebarOpen ? 6 : 1}
      md={currentStage.id === managementStageId ? 12 : isSidebarOpen ? 8 : 1}
      lg={currentStage.id === managementStageId ? 12 : isSidebarOpen ? 8 : 12}
      ></Grid>
    </Grid>
  );
}
export default RecordHistory;
