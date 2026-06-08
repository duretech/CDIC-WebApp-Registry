import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import swal from "sweetalert";
import { Favorite, Opacity, Accessibility } from "@material-ui/icons";
import PersonIcon from "@mui/icons-material/Person";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import OfflineDb from "../../../db";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import InsulinSummaryDisplay from "../../../pages/seeIndividualRecord/InsulinSummaryDisplay";
import { useTranslation, Trans } from "react-i18next";
import imgUrl from "../../../assets/images/imageUrl";
import WaterDropSharpIcon from "@mui/icons-material/WaterDropSharp";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Button } from "react-bootstrap";
import { APP_LOCALE } from "../../../assets/data/config";
import { convertToGC, toEthiopianDateString } from "gc-to-ethiopian-calendar";
import { useGlobalSpinnerActionsContext} from "../../../context/GlobalSpinnerContext";

import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";

const TabPanel = ({ children, value, index }) => {
  return (
    <Box hidden={value !== index} p={2}>
      {value === index && <Typography>{children}</Typography>}
    </Box>
  );
};

export default function ProfileFormSection({
  initialValues,
  trackentityInstanceDetails,
  historyStageId,
  programData,
  managementStage,
  onClose,
  examinationStageId,
  labvaluesStageId,
  dataElementGroup,
  activeCaseFormData,
  eventsData_,
  uicId,
  uicIdattribute,
  glucometerFieldMap,
  customfieldobj,
  className,
  userData,
  userrolename
}) {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const runtime = window.RUNTIME_CONFIG || {};
  let basicAuth = runtime.basicAuth; // fallback
  const apiServiceKey =
    runtime.apiServiceKey ||
    "https://stagingcdic.imonitorplus.com/service/api/";
  const [firstNameId, setFirstNameId] = useState(null);
  const [genderId, setGenderId] = useState(null);
  const [ageId, setAgeId] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [latestHistoryValue, setLatestHistoryValue] = useState("N/A");
  const [matchedFormNames, setMatchedFormNames] = useState("N/A");
  const [latestDate, setLatestDate] = useState("N/A");

  const [familyhistory, setfamilyhistory] = useState("N/A");
  const [familyhistorycard, setfamilyhistorycard] = useState("N/A");
  const [tsh, settsh] = useState("N/A");
  const [celiacd, setceliacd] = useState("N/A");
  const [autoimmune, setautoimmune] = useState("N/A");
  const [kfstrokeskin, setkfstrokeskin] = useState("N/A");
  const [GroupArr, serGroupArr] = useState([]);

  // ---------------------------------------
  const [weightde, setweightde] = useState("N/A");
  const [heightde, setheightde] = useState("N/A");
  const [bmide, setbmide] = useState("N/A");
  const [bpde, setbpde] = useState("N/A");
  const [pulsede, setpulsede] = useState("N/A");
  const [neuropathy, setNeuropathy] = useState("N/A");
  const [neuropathydate, setNeuropathydate] = useState("N/A");
  const [neuropathydetect, setNeuropathydetect] = useState("N/A");
  const [nepropathy, setNepropathy] = useState("N/A");
  const [nepropathydate, setNepropathydate] = useState("N/A");
  const [retinopathy, setRetinopathy] = useState("N/A");
  const [retinopathydate, setRetinopathydate] = useState("N/A");
  const [retinopathydetect, setRetinopathydetect] = useState("N/A");
  const [dra, setDra] = useState("N/A");
  const [fastingde, setfastingde] = useState("N/A");
  const [randomde, setrandomde] = useState("N/A");
  const [hba1cde, sethba1cde] = useState("N/A");

  const [creatininede, setcreatinine] = useState("N/A");
  const [totalCholesterolde, setTotalCholesterol] = useState("N/A");
  const [ldlCholesterolde, setLdlCholestrol] = useState("N/A");
  const [hdlCholesterolde, sethdlCholesterol] = useState("N/A");
  const [triglyceridede, setTriglyceride] = useState("N/A");
  const [tsh_de, settsh_] = useState("N/A");
  const [freeT4de, setfreeT4] = useState("N/A");
  const [thyroidPeroxidaseAntibodyde, setThyroidPeroxidaseAntibody] =
    useState("N/A");
  const [urinecreatininede, seturinecreatinine] = useState("N/A");
  const [micro, setmicro] = useState("N/A");
  const [lab, setLab] = useState("N/A");
  const [labURL, setLabURL] = useState(null);
  const [hba1cdrop, sethba1cdrop] = useState("N/A");
  const [hba1c, sethba1cyear] = useState("N/A");
  const [ph, setph] = useState("N/A");
  const [eventsdatas, setEvents] = useState();
  const [matchedRows, setmatchedRows] = useState("N/A");
  const [advices, setAdvices] = useState("N/A");
  const [dateofdoagnosis, setDateOfdoagnosis] =useState("N/A");
  const dataElementMap = glucometerFieldMap
  const { t, i18n } = useTranslation();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const chartRef = useRef(null);
  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  // We first compare the uicid obtained from the formStructure with the one stored in local storage.
  // If they match, it indicates the user has already visited before. In this case, we directly retrieve a single entry from the database using the trackedEntityInstance and update the events and matched rows accordingly.
  // If the uicid is either not present in local storage or does not match the one from formStructure, it indicates a first-time user. In this case, we fetch all records from the database, identify the corresponding trackedEntityInstance using the provided uicid, and proceed accordingly.
  useEffect(() => {
    if (!navigator.onLine) {
      const LOCAL_KEY = "offlineMatchedRow"; // Customize key if needed

      const cachedData = localStorage.getItem(LOCAL_KEY);
      if (cachedData) {
        const parsed_value = JSON.parse(cachedData);
        const uiid = parsed_value.uicIdToMatch;

        if (uiid == uicId) {
          const parsed = JSON.parse(cachedData);
          const matchedRow = parsed.matchedRow;
          const trackedEntityInstance = parsed.trackedEntityInstance;

          OfflineDb.getSingleEntity(trackedEntityInstance)
            .then((res) => {
              // Handle different possible response structures
              let documents = [];

              if (res.rows && Array.isArray(res.rows)) {
                // CouchDB/PouchDB style response with rows
                documents = res.rows.map((row) => row.doc);
              } else if (res.registration || res.services) {
                // Direct document response
                documents = [res];
              } else if (Array.isArray(res)) {
                // Array of documents
                documents = res;
              } else {
                return;
              }

              // Find document with matching UIC ID
              const matchedDocument = documents.find((doc) => {
                return doc.registration?.attributes?.some(
                  (attr) =>
                    attr.attribute === uicIdattribute && attr.value === uicId
                );
              });

              if (matchedDocument) {
                setmatchedRows(matchedDocument);

                // Extract events from services
                const matchedEvents =
                  matchedDocument.services?.flatMap(
                    (service) => service.events || []
                  ) || [];
                // setEvents(matchedEvents);
                if (Array.isArray(matchedEvents) && matchedEvents.length > 0) {
                  setEvents(matchedEvents);
                }
                return;
              } else {
                //   id: doc._id,
                //   attributes: doc.registration?.attributes
                // })));
              }
            })
            .catch((err) => {
              console.error("Error fetching single entity:", err);
            });
          //return;
        }
      }

      // If no cached data, run DB fetch
      OfflineDb.getAllEntities()
        .then((res) => {
          const matchedRow = res?.rows?.find((row) => {
            return row?.doc?.registration?.attributes?.some(
              (attr) =>
                attr.attribute === uicIdattribute && attr.value === uicId
            );
          });

          if (matchedRow) {
            setmatchedRows(matchedRow);
            const matchedEvents =
              matchedRow.services?.flatMap((service) => service.events || []) ||
              [];

            // setEvents(matchedEvents);
            if (Array.isArray(matchedEvents) && matchedEvents.length > 0) {
              setEvents(matchedEvents);
            }

            // Store to localStorage
            const toStore = {
              uicIdToMatch: uicId,
              trackedEntityInstance: matchedRow.id,
            };
            localStorage.setItem(LOCAL_KEY, JSON.stringify(toStore));
          } else {
            console.warn("No matching row found for UIC ID:", uicId);
          }
        })
        .catch((err) => {
          console.error("Error fetching entities:", err);
        });
    }
  }, [uicId, uicIdattribute]);

  // We call this if we get event as undefined . It again fetches the single entry based on trackedEntityInstance and return the data.
  const fetchOfflineMatchedData = async (
    uicId,
    uicIdattribute,
    setmatchedRows,
    setEvents
  ) => {
    const LOCAL_KEY = "offlineMatchedRow";

    if (!navigator.onLine) {
      const cachedData = localStorage.getItem(LOCAL_KEY);

      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (parsed.uicIdToMatch === uicId) {
            const trackedEntityInstance = parsed.trackedEntityInstance;

            const res = await OfflineDb.getSingleEntity(trackedEntityInstance);
            let documents = [];

            if (res.rows && Array.isArray(res.rows)) {
              documents = res.rows.map((row) => row.doc);
            } else if (res.registration || res.services) {
              documents = [res];
            } else if (Array.isArray(res)) {
              documents = res;
            } else {
              return;
            }

            const matchedDocument = documents.find((doc) =>
              doc.registration?.attributes?.some(
                (attr) =>
                  attr.attribute === uicIdattribute && attr.value === uicId
              )
            );

            if (matchedDocument) {
              setmatchedRows(matchedDocument);
              const matchedEvents =
                matchedDocument.services?.flatMap(
                  (service) => service.events || []
                ) || [];
              // setEvents(matchedEvents);
              if (Array.isArray(matchedEvents) && matchedEvents.length > 0) {
                setEvents(matchedEvents);
              }
              return matchedEvents;
            }
          }
        } catch (err) {
          console.error(
            "Error parsing cached data or fetching offline entity:",
            err
          );
        }
      }

      // Fallback if not found in localStorage
      try {
        const res = await OfflineDb.getAllEntities();
        const matchedRow = res?.rows?.find((row) =>
          row?.doc?.registration?.attributes?.some(
            (attr) => attr.attribute === uicIdattribute && attr.value === uicId
          )
        );

        if (matchedRow) {
          setmatchedRows(matchedRow);
          const matchedEvents = matchedRow?.doc?.services?.[0]?.events || [];
          //  setEvents(matchedEvents);
          if (Array.isArray(matchedEvents) && matchedEvents.length > 0) {
            setEvents(matchedEvents);
          }

          localStorage.setItem(
            LOCAL_KEY,
            JSON.stringify({
              uicIdToMatch: uicId,
              trackedEntityInstance: matchedRow.id,
            })
          );
        } else {
          console.warn("No matching entity found in OfflineDb.");
        }
      } catch (err) {
        console.error("Error fetching all entities:", err);
      }
    }
  };

  let eventsData = [];

  if (navigator.onLine) {
    if (
      trackentityInstanceDetails &&
      trackentityInstanceDetails.enrollments &&
      trackentityInstanceDetails.enrollments.length > 0 &&
      trackentityInstanceDetails.enrollments[0].events
    ) {
      eventsData = trackentityInstanceDetails.enrollments[0].events;
    }
  } else {
    if (eventsdatas) {
      eventsData = eventsdatas;
    }
  }

  function stageAccessCheck(stageUID) {
    const stages = programData?.programs?.[0]?.programStages.find(
      (stage) => stage.id === stageUID
    );
    const userList = stages.userAccesses;
    const userGroups = stages.userGroupAccesses;
    let stageAcsess = false;
    const getUSerBo = userData;
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

  useEffect(() => {
    const uniqueEvents = removeDuplicates(eventsData);
    const GroupArr = GroupEventData(removeDuplicates(uniqueEvents));
    serGroupArr((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(GroupArr)) {
        return GroupArr;
      }
      return prev; // Prevents infinite loop
    });
  }, [eventsData]);

  const removeDuplicates = (array) => {
    return array.filter((item, index) => {
      return (
        array.findIndex((other) =>
          isEqual(item.dataValues, other.dataValues)
        ) === index
      );
    });
  };


  const GroupEventData = (arrayData) => {
    arrayData.forEach((element) => {
      element.groupDate = element?.lastUpdated?.split("T")[0]; //manually added new Date key for grouping
    });

    let GroupArrData = arrayData.reduce(function (r, a) {
      r[a.groupDate] = r[a.groupDate] || [];
      r[a.groupDate].push(a);
      return r;
    }, Object.create(null));

    return GroupArrData;
  };

  const isEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      obj1 == null ||
      obj2 == null
    )
      return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  };

  const relevantDataElements = [
    "t2zhaaUgocG",
    "PRAP6OiKl0O",
    "PXYTQc7rZ97",
    "GgzuTC5v9AL",
    "UhVeUtrWxl6",
    "d8YKakMjVPo",
    "OgFBxxYeHuz",
    "M0U6rejW6Pj",
    "ZGBa2vAajV8",
    "r2jcZoSDSku",
    "rdmEJn49JBt",
    "H7ZwJpQRC1p",
    "baQLL4oNZY0",
    "pnqkVipr607",
    "CRmg9XJycNm",
    "DKJPtZqpwhD",
    "RPwVUT1DoQD",
    "uuXaPpJSH8R",
    "LTIv3XOyZYu",
  ];

  // const relevantDataElements_ = [
  //   "An9mxQAXSv6", "me0wVTtBvYe", "eNY5pzWQuQu", "k5mBd1nMwAF", "TrOTg1S1Xyq",
  //   "EgrkMAtfzFQ", "QggXgtF5HHC", "YzpLwM49Wfd", "vRcn3U4cWnI", "Wll0ZP5DxlW",
  //   "m5Dr8Yw2cyi", "kUdl5hJfol7", "hpO0hsS52Gp", "iLGP8zgUhtZ", "k73SLbQnlb7",
  //   "vpFGRQl3XBm", "YRGjy6sHTNe", "hyk3MFbkCC5"
  // ];

  const currentSymptomGroup = dataElementGroup.find(
    (group) => group.description === "Current Symptoms"
  );
  let relevantDataElements_;
  if (currentSymptomGroup) {
    relevantDataElements_ =
      currentSymptomGroup?.dataElements?.map((el) => el.id) || [];
  } else {
  }
  useEffect(() => {
    const runEffect = async () => {
      let updatedEventsData;
      if (!eventsdatas || eventsdatas.length === 0) {
        updatedEventsData = await fetchOfflineMatchedData(
          uicId,
          uicIdattribute,
          setmatchedRows,
          setEvents
        );
      }
      if (
        (navigator.onLine &&
          trackentityInstanceDetails?.enrollments?.length > 0) ||
        !navigator.onLine
      ) {
        //if(trackentityInstanceDetails?.enrollments?.length > 0){
        const firstNameAttribute =
          programData.programs[0].programTrackedEntityAttributes.find(
            (attr) => attr.trackedEntityAttribute.description === "First Name"
          );
        const genderAttribute =
          programData.programs[0].programTrackedEntityAttributes.find(
            (attr) => attr.trackedEntityAttribute.description === "Sex at birth"
          );
        const ageAttribute =
          programData.programs[0].programTrackedEntityAttributes.find(
            (attr) => attr.trackedEntityAttribute.description === "Age"
          );
        if (firstNameAttribute) {
          setFirstNameId(firstNameAttribute.trackedEntityAttribute.id);
        }
        if (genderAttribute) {
          setGenderId(genderAttribute.trackedEntityAttribute.id);
        }
        if (ageAttribute) {
          setAgeId(ageAttribute.trackedEntityAttribute.id);
        }
        // Extract events from the first enrollment (assuming one enrollment per entity)
        // const events = trackentityInstanceDetails.enrollments[0].events || [];
        let events;
        if (navigator.onLine) {
          events = trackentityInstanceDetails.enrollments[0].events || [];
        } else {
          events = updatedEventsData || [];
        }
        setLatestDate(
          APP_LOCALE === "CC004" && trackentityInstanceDetails.lastUpdated
            ? (() => {
                const gregorianDate = new Date(
                  trackentityInstanceDetails.lastUpdated
                );
                if (!isNaN(gregorianDate.getTime())) {
                  const ethiopianDate = toEthiopianDateString(gregorianDate);
                  const timeStr = gregorianDate.toTimeString().substring(0, 5);
                  return `${ethiopianDate} ${timeStr}`;
                }
                return formatDate(trackentityInstanceDetails.lastUpdated);
              })()
            : formatDate(trackentityInstanceDetails.lastUpdated)
        );
        // Filter events matching the historyStageId
        const matchingEvents = events.filter(
          (event) => event.programStage === historyStageId
        );

        if (matchingEvents.length > 0) {
          // Sort matching events by lastUpdated timestamp (descending order)
          const latestEvent = matchingEvents.sort(
            (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
          )[0];
          //setLatestDate(latestEvent.lastUpdated ? new Date(latestEvent.lastUpdated).toLocaleDateString() : "N/A");

          // Extract the value from dataValues where dataElement is "PEPE6hEp8ds"
          const dataValue = latestEvent.dataValues.find(
            (dv) => dv.dataElement === "PEPE6hEp8ds"
          );

          if (dataValue) {
            setLatestHistoryValue(dataValue.value);
          }

          //   const trueDataElements = latestEvent.dataValues
          //   .filter(dv => relevantDataElements.includes(dv.dataElement) && dv.value === "true")
          //   .map(dv => dv.dataElement);
          // // Map these dataElements to their formName from programData
          // const matchingFormNames = programData.dataElements
          //   .filter(de => trueDataElements.includes(de.id))
          //   .map(de => de.formName)
          //   .join(", ");
          // setMatchedFormNames(matchingFormNames || "N/A");
          const thyroiddisorderid = findDataElementIdByProgramStage(
            programData,
            "Thyroid Disorder",
            historyStageId
          );
          const thyroiddisorder = latestEvent.dataValues.find(
            (dv) => dv.dataElement === thyroiddisorderid
          );
          const thyroiddisordervalue = thyroiddisorder?.value;
          settsh(thyroiddisordervalue);

          const celiacid = findDataElementIdByProgramStage(
            programData,
            "Celiac Disease_Celiac Disease",
            historyStageId
          );
          const celiacdis = latestEvent.dataValues.find(
            (dv) => dv.dataElement === celiacid
          );
          const celiacdisvalue = celiacdis?.value;
          setceliacd(celiacdisvalue);

          const autoimm = findDataElementIdByProgramStage(
            programData,
            "Type of Autoimmune Thyroid Disease",
            historyStageId
          );
          const autoimmis = latestEvent.dataValues.find(
            (dv) => dv.dataElement === autoimm
          );
          const autoimmisvalue = autoimmis?.value;
          setautoimmune(autoimmisvalue);

          const dod = findDataElementIdByProgramStage(
            programData,
            "Date of diagnosis/ treatment initiation",
            historyStageId
          );
          const doddata = latestEvent.dataValues.find(
            (dv) => dv.dataElement === dod
          );
          const dodid = doddata?.value;
          setDateOfdoagnosis(dodid);
        }
        const currentvisits = events.filter(
          (event) => event.programStage === examinationStageId
        );
        const managementstages = events.filter(
          (event) => event.programStage === managementStage.id
        );
        const labvalues = events.filter(
          (event) => event.programStage === labvaluesStageId
        );
        if (currentvisits.length > 0) {
          const latestEvent_ = currentvisits.sort(
            (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
          )[0];
          //------------------------
          const weight_id = findDataElementIdByProgramStage(
            programData,
            "Weight(Kg)",
            examinationStageId
          );

          const weight = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === weight_id
          );
          const weightValue = weight?.value;
          setweightde(weightValue);
          //-------------------------
          const height_id = findDataElementIdByProgramStage(
            programData,
            "Height(cm)",
            examinationStageId
          );
          const height = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === height_id
          );
          const heightvalue = height?.value;
          setheightde(heightvalue);
          //-------------------------
          const bmi_id = findDataElementIdByProgramStage(
            programData,
            "BMI(Kg/m2)",
            examinationStageId
          );
          const bmi = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === bmi_id
          );
          const bmivalue = bmi?.value;
          setbmide(bmivalue);
          //-------------------------
          const bp_id = findDataElementIdByProgramStage(
            programData,
            "Blood pressure Systole(mmHg)",
            examinationStageId
          );
          const bp = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === bp_id
          );
          const bpvalue = bp?.value;
          setbpde(bpvalue);
          //-------------------------
          const pulse_id = findDataElementIdByProgramStage(
            programData,
            "Pulse(bpm)",
            examinationStageId
          );
          const pulse = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === pulse_id
          );
          const pulsevalue = pulse?.value;
          setpulsede(pulsevalue);
          //------------------"Neuropathy"
          const neuropathy_id = findDataElementIdByProgramStage(
            programData,
            "Neuropathy",
            examinationStageId
          );
          const neuropathy = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === neuropathy_id
          );
          const neuropathyvalue = neuropathy?.value;
          setNeuropathy(neuropathyvalue);
          //------------------Date & Detected / Not
          const neuropathy_dateid = findDataElementIdByProgramStage(
            programData,
            "Date of Diagnosis(Neuropathy)",
            examinationStageId
          );
          const neuropathydate = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === neuropathy_dateid
          );
          const neuropathydatevalue = neuropathydate?.value;
          setNeuropathydate(neuropathydatevalue);

          const neuropathydetect_id = findDataElementIdByProgramStage(
            programData,
            "Neuropathy Detection?",
            examinationStageId
          );
          const neuropathydetected = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === neuropathydetect_id
          );
          const neuropathydetectedvalue = neuropathydetected?.value;
          setNeuropathydetect(neuropathydetectedvalue);
          //------------------"Nephropathy"
          const nepropathy_id = findDataElementIdByProgramStage(
            programData,
            "Nephropathy",
            examinationStageId
          );
          const nepropathy = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === nepropathy_id
          );
          const nepropathyvalue = nepropathy?.value;
          setNepropathy(nepropathyvalue);
          // //------------------Date
          const nepropathy_dateid = findDataElementIdByProgramStage(
            programData,
            "Date of Diagnosis(Nephropathy)",
            examinationStageId
          );
          const nepropathydate = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === nepropathy_dateid
          );
          const nepropathydatevalue = nepropathydate?.value;
          setNepropathydate(nepropathydatevalue);
          //------------------"Retinopathy"
          const retinopathy_id = findDataElementIdByProgramStage(
            programData,
            "Retinopathy",
            examinationStageId
          );
          const retinopathy = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === retinopathy_id
          );
          const retinopathyvalue = retinopathy?.value;
          setRetinopathy(retinopathyvalue);
          // //------------------Date
          const retinopathydetected_id = findDataElementIdByProgramStage(
            programData,
            "Retinopathy Detection?",
            examinationStageId
          );
          const retinopathydetected = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === retinopathydetected_id
          );
          const retinopathydetectedvalue = retinopathydetected?.value;
          setRetinopathydetect(retinopathydetectedvalue);

          const retinopathydate_id = findDataElementIdByProgramStage(
            programData,
            "Date of Retinopathy Diagnosis",
            examinationStageId
          );
          const retinopathydate = latestEvent_.dataValues.find(
            (dv) => dv.dataElement === retinopathydate_id
          );
          const retinopathydatevalue = retinopathydate?.value;
          setRetinopathydate(retinopathydatevalue);
          //--------------Diabetes Related Admission to Diabetes
          let fasting_id;
          let fasting;

          if (APP_LOCALE == "CC007" || APP_LOCALE == "CC006") {
          } else {
            fasting_id = findDataElementIdByProgramStage(
              programData,
              "Blood glucose - Fasting",
              examinationStageId
            );
            fasting = latestEvent_.dataValues.find(
              (dv) => dv.dataElement === fasting_id
            );
            const fastingvalue = fasting?.value;
            setfastingde(fastingvalue);
          }

          //-------------------------
          let random_id;
          let random;
          if (APP_LOCALE == "CC007" || APP_LOCALE == "CC006") {
          } else {
            random_id = findDataElementIdByProgramStage(
              programData,
              "Blood glucose - Random",
              examinationStageId
            );
            random = latestEvent_.dataValues.find(
              (dv) => dv.dataElement === random_id
            );
            const randomvalue = random?.value;
            setrandomde(randomvalue);
          }

          const reasonfadmi = dataElementGroup.find(
            (group) =>
              group.description === "Reason for admission" &&
              Array.isArray(group.dataElements) &&
              group.dataElements.length > 0
          );

          let dra_ids = [];

          if (reasonfadmi) {
            dra_ids = reasonfadmi.dataElements.map((el) => el.id);
          } else {
          }
          const matchedIds = dra_ids.filter((id) => initialValues[id] === true);

          // Find formNames where the ID matches
          const matchedForms_ = programData.dataElements
            .filter((element) => matchedIds.includes(element.id))
            .map((element) => element.formName);

          // Update state with comma-separated values
          setDra(matchedForms_.length > 0 ? matchedForms_.join(", ") : "N/A");

          // const valueMapping = {
          //   "x7ZklVrGDyB": "Kidney Failure",
          //   "HmsBFcoKFAH": "Stroke",
          //   "HhBYb2B315x": "Skin Infection",
          //   "NzURGlIJlmO": "Urinary Infection"
          // };

          // const draValues = latestEvent_.dataValues
          //   .filter(dv => dra_ids.includes(dv.dataElement) && dv.value === "true")
          //   .map(dv => valueMapping[dv.dataElement])
          //   .filter(Boolean)
          //   .join(", ");
          // setDra(draValues)

          //-----------Sx
          let trueDataElements_;
          if (!navigator.onLine) {
            trueDataElements_ = latestEvent_.dataValues
              .filter(
                (dv) =>
                  relevantDataElements_?.includes(dv.dataElement) &&
                  dv.value === true
              )
              .map((dv) => dv.dataElement);
          } else {
            trueDataElements_ = latestEvent_.dataValues
              .filter(
                (dv) =>
                  relevantDataElements_?.includes(dv.dataElement) &&
                  dv.value === "true"
              )
              .map((dv) => dv.dataElement);
          }
          // Map these dataElements to their formName from programData
          const matchingFormNames_ = programData.dataElements
            .filter((de) => trueDataElements_.includes(de.id))
            .map((de) => de.formName)
            .join(", ");
          setMatchedFormNames(matchingFormNames_ || "N/A");
        }
        if (labvalues.length > 0) {
          const latestEvent_1 = labvalues.sort(
            (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
          )[0];
          //-------------------------

          //---------------------------
          const hba1c_id = findDataElementIdByProgramStage(
            programData,
            "HBA1C  1",
            labvaluesStageId
          );
          const hba1c = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === hba1c_id
          );
          const hba1cvalue = hba1c?.value;
          sethba1cde(hba1cvalue);
          //-----------"Creatinine1"
          const creatinine_id = findDataElementIdByProgramStage(
            programData,
            "Creatinine1",
            labvaluesStageId
          );
          const creatinine = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === creatinine_id
          );
          const creatininevalue = creatinine?.value;
          setcreatinine(creatininevalue);
          //-----------"Total Cholesterol (mg/dl)"
          const totalcholesterol_id = findDataElementIdByProgramStage(
            programData,
            "Total Cholesterol (mg/dl)",
            labvaluesStageId
          );
          const totalcholesterol = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === totalcholesterol_id
          );
          const totalcholesterolvalue = totalcholesterol?.value;
          setTotalCholesterol(totalcholesterolvalue);
          //----------"LDL Cholesterol1"
          const ldlcholesterol_id = findDataElementIdByProgramStage(
            programData,
            "LDL Cholesterol1",
            labvaluesStageId
          );
          const ldlcholesterol = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === ldlcholesterol_id
          );
          const ldlcholesterolvalue = ldlcholesterol?.value;
          setLdlCholestrol(ldlcholesterolvalue);
          //----------"HDL Cholesterol (mg/dl)1"
          const hdlcholesterol_id = findDataElementIdByProgramStage(
            programData,
            "HDL Cholesterol (mg/dl)1",
            labvaluesStageId
          );
          const hdlcholesterol = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === hdlcholesterol_id
          );
          const hdlcholesterol_idvalue = hdlcholesterol?.value;
          sethdlCholesterol(hdlcholesterol_idvalue);
          //----------"Triglyceride"
          const triglyceride_id = findDataElementIdByProgramStage(
            programData,
            "Triglyceride",
            labvaluesStageId
          );
          const triglyceride = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === triglyceride_id
          );
          const triglyceride_idvalue = triglyceride?.value;
          setTriglyceride(triglyceride_idvalue);
          //----------"TSH"
          const tsh_id = findDataElementIdByProgramStage(
            programData,
            "TSH",
            labvaluesStageId
          );
          const tsh = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === tsh_id
          );
          const tsh_value = tsh?.value;
          settsh_(tsh_value);
          //----------"Free T41"
          const freet4_id = findDataElementIdByProgramStage(
            programData,
            "Free T41",
            labvaluesStageId
          );
          const freet4 = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === freet4_id
          );
          const freet4_value = freet4?.value;
          setfreeT4(freet4_value);
          //----------"Thyroid peroxidase antibody1"
          const tpa_id = findDataElementIdByProgramStage(
            programData,
            "Thyroid peroxidase antibody1",
            labvaluesStageId
          );
          const tpa = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === tpa_id
          );
          const tpa_value = tpa?.value;
          setThyroidPeroxidaseAntibody(tpa_value);
          //---------"Urine Creatinine1"
          const uc_id = findDataElementIdByProgramStage(
            programData,
            "Urine Creatinine1",
            labvaluesStageId
          );
          const uc = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === uc_id
          );
          const uc_value = uc?.value;
          seturinecreatinine(uc_value);
          //---------"Microalbuminuria test for nephropathy1"
          const micro_id = findDataElementIdByProgramStage(
            programData,
            "Microalbuminuria test for nephropathy1",
            labvaluesStageId
          );
          const micro = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === micro_id
          );
          const micro_value = micro?.value;
          setmicro(micro_value);
          //----------"HBa1C"
          const hba1c_iddrop = findDataElementIdByProgramStage(
            programData,
            "HBA1C  1",
            labvaluesStageId
          );
          const hba1cdrop = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === hba1c_iddrop
          );
          const hba1c_id_value = hba1cdrop?.value;
          sethba1cdrop(hba1c_id_value);

          const hba1c_idyear = findDataElementIdByProgramStage(
            programData,
            "HbA1C Year - pak_lab_values",
            labvaluesStageId
          );
          const hba1cyear = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === hba1c_idyear
          );
          const hba1c_idyear_value = hba1cyear?.value;
          sethba1cyear(hba1c_idyear_value);

          const phid = findDataElementIdByProgramStage(
            programData,
            "Ph - pak_lab_values",
            labvaluesStageId
          );
          const ph = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === phid
          );
          const ph_value = ph?.value;
          setph(ph_value);

          let fasting_id;
          let fasting;
          if (APP_LOCALE == "CC007") {
            fasting_id = findDataElementIdByProgramStage(
              programData,
              "Blood glucose - Fasting",
              labvaluesStageId
            );
            fasting = latestEvent_1.dataValues.find(
              (dv) => dv.dataElement === fasting_id
            );
            const fastingvalue = fasting?.value;
            setfastingde(fastingvalue);
          }
          if (APP_LOCALE == "CC006") {
            fasting_id = findDataElementIdByProgramStage(
              programData,
              "Blood glucose - Fasting",
              labvaluesStageId
            );
            fasting = latestEvent_1.dataValues.find(
              (dv) => dv.dataElement === fasting_id
            );
            const fastingvalue = fasting?.value;
            setfastingde(fastingvalue);
          }
          let random_id;
          let random;
          if (APP_LOCALE == "CC007") {
            random_id = findDataElementIdByProgramStage(
              programData,
              "Blood glucose - Random",
              labvaluesStageId
            );

            random = latestEvent_1.dataValues.find(
              (dv) => dv.dataElement === random_id
            );
            const randomvalue = random?.value;
            setrandomde(randomvalue);
          }
          if (APP_LOCALE == "CC006") {
            random_id = findDataElementIdByProgramStage(
              programData,
              "Blood glucose - Random",
              labvaluesStageId
            );

            random = latestEvent_1.dataValues.find(
              (dv) => dv.dataElement === random_id
            );
            const randomvalue = random?.value;
            setrandomde(randomvalue);
          }
          //---------"Lab Report Upload"
          const labId = findDataElementIdByProgramStage(
            programData,
            "Lab Report Upload",
            labvaluesStageId
          );
          const lab = latestEvent_1.dataValues.find(
            (dv) => dv.dataElement === labId
          );
          const lab_value = lab?.value;
          if (lab_value) {
            setLab(moment(latestEvent_1.created).format("DD-MM-YYYY"));
            setLabURL(
              apiServiceKey +
                "events/files?eventUid=" +
                latestEvent_1.event +
                "&dataElementUid=" +
                labId
            );
          }
        }
        if (managementstages.length > 0) {
          const managementstages_ = managementstages.sort(
            (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
          )[0];
          const advice_id = findDataElementIdByProgramStage(
            programData,
            "Patient Advice / Notes/ Suggestion",
            managementStage.id
          );
          const advicedata = managementstages_.dataValues.find(
            (dv) => dv.dataElement === advice_id
          );
          const advice = advicedata?.value;
          setAdvices(advice);
        }
      }

      function findDataElementIdFromProgram(programData, targetDescription) {
        if (!programData || !programData.programs) {
          console.error("Invalid programData");
          return null;
        }

        if (!targetDescription) {
          console.error("Target description not provided");
          return null;
        }

        const matchingElement = programData.dataElements.find(
          (element) => element.description === targetDescription
        );

        return matchingElement ? matchingElement.id : null;
      }

      function findDataElementIdByProgramStage(
        programData,
        targetDescription,
        programStageId
      ) {
        if (
          !programData ||
          !programData.programs ||
          !programData.programs[0].programStages
        ) {
          console.error("Invalid programData");
          return null;
        }

        if (!targetDescription || !programStageId) {
          console.error("Target description or programStageId not provided");
          return null;
        }

        // Find the program stage where the id matches the given programStageId
        const matchingStage = programData.programs[0].programStages.find(
          (stage) => stage.id === programStageId
        );

        if (!matchingStage || !matchingStage.programStageDataElements) {
          console.error(
            "Matching program stage not found or it has no data elements"
          );
          return null;
        }

        // Find the dataElement inside programStageDataElements where description matches targetDescription
        const matchingElement = matchingStage.programStageDataElements.find(
          (element) =>
            element.dataElement &&
            element.dataElement.description === targetDescription
        );

        return matchingElement ? matchingElement.dataElement.id : null;
      }
      //
      // const idsToCheck = [
      //   "pFk29homghy",
      //   "yQi6UEJdgDX",
      //   "rPndUJpQcTh",
      //   "F3MDsy7zwZY",
      //   "zSzVqNekPRa",
      //   "wgCSWv9MYQp",
      // ];

      const familyhistorytype1 = dataElementGroup.find(
        (group) =>
          (group.code === "Select Family Member" ||
            group.description === "Select Family Member" ||
           group.description === "Select Family Member_1") &&
          Array.isArray(group.dataElements) &&
          group.dataElements.length > 0
      );

      let idsToCheck = [];

      if (familyhistorytype1) {
        idsToCheck = familyhistorytype1.dataElements.map((el) => el.id);
      } else {
      }

      // Get IDs where the value is true
      const matchedIds = idsToCheck.filter((id) => initialValues[id] === true);

      // Find formNames where the ID matches
      const matchedForms = programData.dataElements
        .filter((element) => matchedIds.includes(element.id))
        .map((element) => element.formName);

      // Update state with comma-separated values
      setfamilyhistory(
        matchedForms.length > 0 ? matchedForms.join(", ") : "N/A"
      );
      //Familyhistory cardiovac

      // const idsToCheck_1 = [
      //   "yo2nx9Lfsq4",
      //   "hX4WZ0nGFbH",
      //   "lJYFDv9EnMu",
      //   "rhfDDFu9scP",
      //   "yvddlBY0sBB",
      //   "oYJZpHsYj3t",
      // ];
      const familyhistorycardio = dataElementGroup.find(
        (group) =>
          group.description === "FH_Select Family Member" &&
          Array.isArray(group.dataElements) &&
          group.dataElements.length > 0
      );

      let idsToCheck_1 = [];

      if (familyhistorycardio) {
        idsToCheck_1 = familyhistorycardio.dataElements.map((el) => el.id);
      } else {
      }

      // Get IDs where the value is true
      const matchedIds_1 = idsToCheck_1.filter(
        (id) => initialValues[id] === true
      );

      // Find formNames where the ID matches
      const matchedForms_11 = programData.dataElements
        .filter((element) => matchedIds_1.includes(element.id))
        .map((element) => element.formName);

      // Update state with comma-separated values
      setfamilyhistorycard(
        matchedForms_11.length > 0 ? matchedForms_11.join(", ") : "N/A"
      );

      // //Thyroid check
      // const idchecktsh = ["ag8Okol1JKa", "S0PVwBwHoX4", "otziHsjmrA8"];
      // const matchedIds_ = idchecktsh.filter((id) => initialValues[id] === "Yes");

      // // Find formNames where the ID matches
      // const matchedForms_ = programData.dataElements
      //   .filter((element) => matchedIds_.includes(element.id))
      //   .map((element) => element.formName);

      // // Update state with comma-separated values
      // settsh(matchedForms_.length > 0 ? matchedForms_.join(", ") : "N/A");

      //Kidney Failure / Stroke /Skin
      const selectedIds = Array.isArray(initialValues?.ZXsN3NWHNNT)
        ? initialValues.ZXsN3NWHNNT
        : [];

      if (!programData?.dataElements) {
        console.error("programData.dataElements is missing or undefined");
        return;
      }
      // Find matching formNames where dataElements ID matches the selected IDs
      const matchedForms_1 = programData.dataElements
        .filter((element) => selectedIds.includes(element.id)) // Match IDs
        .map((element) => element.formName); // Extract formName

      // Update state with comma-separated form names
      setkfstrokeskin(
        matchedForms_1.length > 0 ? matchedForms_1.join(", ") : "N/A"
      );
      buildGlucoseData(initialValues);
    };

    runEffect();
  }, [trackentityInstanceDetails, initialValues, programData]);

  useEffect(() => {
  if (tabIndex === 3 && chartRef.current) {
    setTimeout(() => {
      chartRef.current.chart.reflow();
    }, 100);
  }
}, [tabIndex]);
  // Code for glucose logs Start

  // const dataElementMap = {
  //   Monday: {
  //     Breakfast: {
  //       Before: 'CrMRQxaV8Td',
  //       After: 'jHWyviHiKYw',
  //     },
  //     Lunch: {
  //       Before: 'kuAWwVqWxFA',
  //       After: 'NKMKyTf6Bn0',
  //     },
  //     Dinner: {
  //       Before: 'F20FMv2nR7u',
  //       After: 'wvnATUmMlZt',
  //     },
  //     Bedtime: {
  //       Before: 'rums2B8WtVq',
  //       After: 'wBp0jeKUixI',
  //     },
  //   },
  //   Tuesday: {
  //     Breakfast: {
  //       Before: 'CWslEsakpiX',
  //       After: 'V0ifM25ofnm',
  //     },
  //     Lunch: {
  //       Before: 'MjvUWCgNIl3',
  //       After: 'HUSO4zu3HJr',
  //     },
  //     Dinner: {
  //       Before: 'L0SqmO48PPz',
  //       After: 'Z2ArjOqe45i',
  //     },
  //     Bedtime: {
  //       Before: 'SBlvjzkKJ3o',
  //       After: 'fUnvKBTX0sK',
  //     },
  //   },
  //   Wednesday: {
  //     Breakfast: {
  //       Before: 'N41CSrZVMD3',
  //       After: 'WdpxMABiU27',
  //     },
  //     Lunch: {
  //       Before: 'ZhiDdpWHtoM',
  //       After: 'ZhiDdpWHtoM', // same UID for before and after!
  //     },
  //     Dinner: {
  //       Before: 'SHpE2rC8m6a',
  //       After: 'PW2nlfJJQZ1',
  //     },
  //     Bedtime: {
  //       Before: 'xHE0qKIAkY6',
  //       After: 'tKd6h7o4i3F',
  //     },
  //   },
  //   Thursday: {
  //     Breakfast: {
  //       Before: 'EtmgzOzfEzg',
  //       After: 'vJ92bJqSCyw',
  //     },
  //     Lunch: {
  //       Before: 'jeqPLF6mkkb',
  //       After: 'iP4lBlo2RSx',
  //     },
  //     Dinner: {
  //       Before: 'Hm8VCo97mJe',
  //       After: 'ER0l2GMI5gi',
  //     },
  //     Bedtime: {
  //       Before: 'FgOBtHC9SpX',
  //       After: 'W0PuaSZXdtX',
  //     },
  //   },
  //   Friday: {
  //     Breakfast: {
  //       Before: 'MlLry59Twws',
  //       After: 'fMCNv8z2OZl',
  //     },
  //     Lunch: {
  //       Before: 'lIqrRVFtKie',
  //       After: 'NhPS23B9r34',
  //     },
  //     Dinner: {
  //       Before: 'CwUOVfnu8vo',
  //       After: 'eepvFkESauC',
  //     },
  //     Bedtime: {
  //       Before: 'LSwBSRoNJYa',
  //       After: 'IIZauyxLelQ',
  //     },
  //   },
  //   Saturday: {
  //     Breakfast: {
  //       Before: 'dy5SCpVYoou',
  //       After: 'Pqes813E7tQ',
  //     },
  //     Lunch: {
  //       Before: 'J5zkGKqX0Y0',
  //       After: 'fq0Y1nIC0BN',
  //     },
  //     Dinner: {
  //       Before: 'lYS92MCc2ZP',
  //       After: 'bETvVkK24OM',
  //     },
  //     Bedtime: {
  //       Before: 'RVEluJZrziv',
  //       After: 'eO0ZUrUAqtr',
  //     },
  //   },
  //   Sunday: {
  //     Breakfast: {
  //       Before: 'CCb9GhqrSVt',
  //       After: 'SH0NJ4nR2pk',
  //     },
  //     Lunch: {
  //       Before: 'LtMdKR2nhkl',
  //       After: 'QdpMGuZc9GW',
  //     },
  //     Dinner: {
  //       Before: 'G0m3b1TjJA5',
  //       After: 'kXQbUatCtII',
  //     },
  //     Bedtime: {
  //       Before: 'Me2JBghMjnV',
  //       After: 'WzdlWdNTKZT',
  //     },
  //   },
  // }
  const [glucoseChartOption, setGlucoseChartOption] = useState({});
  const buildGlucoseData = (valuesObj) => {
    const newGlucoseData = {};

    Object.keys(dataElementMap).forEach((day) => {
      newGlucoseData[day] = {};

      Object.keys(dataElementMap[day]).forEach((meal) => {
        const beforeUID = dataElementMap[day][meal].Before;
        const afterUID = dataElementMap[day][meal].After;

        newGlucoseData[day][meal] = {
          Before: valuesObj[beforeUID] || "",
          After: valuesObj[afterUID] || "",
        };
      });
    });
    const VALID_DAYS = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const days = VALID_DAYS.filter((day) => day in newGlucoseData);
    const daysTranslated = Object.keys(days).map((key) => t(key));
    // const days = Object.keys(newGlucoseData);
    const categories = ["Breakfast", "Lunch", "Dinner", "Bedtime"];
    const times = ["Before", "After"];
    const series = [];
 
    categories.forEach((meal) => {
      times.forEach((timing) => {
        series.push({
          name: `${t(meal)} ${t(timing) }`,
          data: days.map((day) => {
            const val = parseInt(newGlucoseData[day][meal][timing]);
            return isNaN(val) || val === 0 ? 0 : val;
          }),
        });
      });
    });
    const options = {
      title: {
        text: "",
      },
      exporting: {
        enabled: !window.cordova
      },
      xAxis: {
        categories: daysTranslated,
        title: { text: t("Days") },
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        title: { text: t("Reading Value") },
      },
      tooltip: {
        valueSuffix: " mg/dL",
      },
      legend: {
        // layout: 'vertical',
        // align: 'bottom',
      },
      plotOptions: {
        line: {
          marker: { enabled: true },
        },
      },
      series: series,
    };
    setGlucoseChartOption(options);
  };
  // // Code for glucose logs END
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      date
    );
    const year = date.getFullYear();

    // Function to get ordinal suffix for the day
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // Covers 4th-20th
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
  };

  const currentStageData = Object.keys(GroupArr).reduce((acc, key) => {
    const filtered = GroupArr[key].filter(
      (item) => item.programStage === managementStage.id
    );
    return [...acc, ...filtered];
  }, []);

  //Advice Code

  const targetDescription = "Patient Advice / Notes/ Suggestion";

  // const advice = getDataElementValue("Patient Advice / Notes/ Suggestion");
  // const dateofdoagnosis = getDataElementValue("Date of diagnosis/ treatment initiation")

  // function getDataElementValue(targetDescription) {
  //   const targetDataElement = programData.dataElements.find(
  //     el => el.description === targetDescription
  //   );
  //   const targetDataElement1 = managementStage.programStageDataElements.find(
  //       element => element.dataElement && element.dataElement.description === targetDescription
  //     );
  //   if (targetDataElement) {
  //     const targetId = targetDataElement.id;
  //     const targetValue = initialValues[targetId];
  //     return targetValue;
  //   } else {
  //     return null;
  //   }
  // }

  const getValueFromDescription = (description, programData, initialValues) => {
    const matchedElement = programData.dataElements.find(
      (el) => el.description === description
    );

    if (matchedElement) {
      const id = matchedElement.id;
      return initialValues[id] || "N/A";
    }

    return "N/A";
  };

  const isDrop = sessionStorage.getItem("userRoles") === "DROP-HCP";

  const abiRightLimbValue = getValueFromDescription(
    "A.B.I - Right Limb - pak_lab_values",
    programData,
    initialValues
  );

  const abiLeftLimbValue = getValueFromDescription(
    "A.B.I - Left Limb - pak_lab_values",
    programData,
    initialValues
  );

  const Bicarbonate = getValueFromDescription(
    "Serum Bicarbonate - pak_lab_values",
    programData,
    initialValues
  );

  return (
    <Card className="profileFormSection">
      <CardContent className="mobileFormSection">
        <Grid
          container
          spacing={2}
          alignItems="start"
          className="drawerDiv justify-content-start"
        >
          <Grid item xs={2} className="pt-0">
            <div>
              <PersonIcon className="profileIcon"></PersonIcon>
            </div>
          </Grid>
          <Grid item xs={8} className="profileCard">
            <Typography
              variant="h6"
              title={initialValues?.[firstNameId] || "N/A"}
            >
              {(() => {
                const value = initialValues?.[firstNameId] || "N/A";
                if (typeof window !== "undefined" && window.cordova) {
                  return value.length > 8 ? `${value.substring(0, 8)}…` : value;
                }
                return value;
              })()}
            </Typography>
            {/* <Typography variant="h6">{initialValues?.[firstNameId] || "N/A"}</Typography> */}
            <Typography color="textSecondary">
              {initialValues?.[genderId] ? t(initialValues[genderId]) : "N/A"} |{" "}
              {initialValues?.[ageId] || "N/A"}Y
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <div className="d-flex justify-content-end align-items-center">
              <CloseIcon
                className="closeIcon"
                onClick={onClose} // <-- Close the drawer
                style={{ cursor: "pointer" }} // Make it clickable
              />
            </div>
          </Grid>
        </Grid>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          className="drawerDiv"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label={t("Summary")} />
          <Tab label={t("History")} />
          <Tab label={t("Lab Tests")} />
          <Tab label={t("Glucose Log")} />
          {/* <Tab label="Notes" /> */}
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          <p className="dateUpdated">
            {t("Last Updated")}: {latestDate}
          </p>
          <Grid container spacing={2} className="TabsSectionWise">
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Grid item xs={3} className="justify-content-icon">
                      <MonitorWeightIcon />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        {t("Weight")} <br /> {weightde || "N/A"} (kg)
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        {t("Height")} <br /> {heightde || "N/A"} (cm)
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        {t("BMI")} <br /> {bmide || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <Grid item xs={3} className="justify-content-icon">
                      {/* <HeartBrokenIcon /> */}
                      <img
                        src={imgUrl.pulseNewIcon}
                        style={{ width: "2.3em", height: "2.3em" }}
                      ></img>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        {t("BP(Sys)")} <br /> {bpde || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        {t("Pulse")} <br /> {pulsede || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {/* <Grid item xs={1}></Grid> */}
                    <Grid item xs={3} className="justify-content-icon">
                      <WaterDropSharpIcon />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        {t("Fasting")} <br /> {fastingde || "N/A"} (mg/dl)
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        {t("Random")}
                        <br /> {randomde || "N/A"} (mg/dl)
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        {t("HbA1C")} <br /> {hba1cde || "N/A"} (%)
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box mt={2}>
            <Typography variant="h6" className="visitUpdate">
              {t("Last Visit")}: {latestDate}{" "}
            </Typography>

            {/* <Grid container spacing={0} className="d-flex justify-content-start align-items-center mt-15px VisitGridCount">
                <Grid item xs={2}>
                    <Typography className="valuePrescripe">Cx</Typography>
                </Grid>
                <Grid item xs={10} className="secondValueDescription">
                    <Typography>{latestHistoryValue}</Typography>
                </Grid>               
            </Grid> */}
            <Grid
              container
              spacing={0}
              className="d-flex justify-content-start align-items-start mt-15px VisitGridCount"
            >
              <Grid item xs={2}>
                <Typography className="valuePrescripe value2">
                  {t("Sx")}
                </Typography>
              </Grid>
              <Grid item xs={10} className="secondValueDescription">
                <Typography>{matchedFormNames}</Typography>
              </Grid>
            </Grid>
            {userrolename !== "DROP-HCP" && (
              <Grid
              container
              spacing={0}
              className="d-flex justify-content-start align-items-start mt-15px VisitGridCount"
            >
              <Grid item xs={2}>
                <Typography className="valuePrescripe value3">
                  {t("Mx")}
                </Typography>

              </Grid>
              {currentStageData.length > 0 && (
                <Grid item xs={10} className="secondValueDescription">
                  <div>
                    <InsulinSummaryDisplay
                      currentStage={managementStage}
                      currentStageData={currentStageData}
                      customfieldobj={customfieldobj}
                    />
                  </div>
                </Grid>
              )}
              {/* <Grid item xs={10}>
    <div>
      <Typography>Basal Bolus Regimen:</Typography>
      <Typography>
        Insulin (long acting)
        <br />
        10 mg | Before meal | 1-0-1 | 45 days
      </Typography>
      <Typography className="mt-10px">
        Actrapid (short acting)
        <br />
        10 mg | Before meal | 1-0-1 | 45 days
      </Typography>
    </div>
  </Grid> */}
            </Grid>
              )}
            

            <div className="mt-10px">
              <Typography className="notesPara">
                <strong>{t("Advice / Notes")}:</strong> {advices || "N/A"}
              </Typography>
            </div>
            <div className="mt-15px d-flex justify-content-start align-items-center">
              <ArrowBackIosIcon></ArrowBackIosIcon>
              <Typography className="cursor-pointer previousVisit">
                {" "}
                {t("Previous Visit")}{" "}
              </Typography>
            </div>
          </Box>
        </TabPanel>
        <TabPanel value={tabIndex} index={1} className="pt-0">
          <Typography variant="h6" className="mt-10px mb-10px">
            {t("Patient History")}
          </Typography>

          <Grid
            container
            spacing={2}
            className="TabsSectionWise MainHistoryTab"
          >
            {/* Date of Diagnosis */}
            <Grid item xs={12} className="">
              <Card variant="outlined">
                <CardContent>
                  <Typography>
                    <strong>{t("Date Of Diagnosis")}:</strong>{" "}
                    {dateofdoagnosis
                      ? moment(dateofdoagnosis).format("DD-MM-YYYY")
                      : "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Family History */}
            <Grid item xs={12} className="pt-0">
              <Card variant="outlined">
                <CardContent>
                  <Typography>
                    <strong>{APP_LOCALE === "CC005" ? t("Family History of Diabetes") : t("Family History of Type 1 Diabetes")}:</strong>
                  </Typography>
                  <Typography>{familyhistory}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Cardiovascular Disease */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>
                        {t("Family History of Cardiovascular Disease")}:
                      </strong>{" "}
                      {familyhistorycard || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Autoimmune Disorders */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>
                        {t(
                          "Thyroid Disease, Celiac Disease, Other Autoimmune Disorders"
                        )}
                        :
                      </strong>
                      {tsh || "N/A"}, {celiacd || "N/A"}, {autoimmune || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Previous Diabetes-Related Admissions */}
            {/* <Grid item xs={12}>
      <Card variant="outlined">
        <CardContent>
          <Typography><strong>Any Previous Diabetes-Related Admissions:</strong> Yes, in 2021</Typography>
        </CardContent>
      </Card>
    </Grid> */}

            {/* ICU Admission History */}
            {/* <Grid item xs={12}>
      <Card variant="outlined">
        <CardContent>
          <Typography><strong>History of ICU Admission:</strong> No</Typography>
        </CardContent>
      </Card>
    </Grid> */}

            {/* Nephropathy, Neuropathy, Retinopathy */}
            <Grid item xs={12} className="pt-0">
              <Card variant="outlined">
                <CardContent>
                  <Typography>
                    <strong>
                      {t("Nephropathy, Neuropathy, Retinopathy")}:
                    </strong>
                  </Typography>
                  <Typography>
                    {t("Neuropathy")}: {neuropathy} ({neuropathydetect}) -
                    {moment(neuropathydate).isValid()
                      ? moment(neuropathydate).format("DD-MM-YYYY")
                      : "N/A"}
                  </Typography>
                  <Typography>
                    {t("Retinopathy")}: {retinopathy} ({retinopathydetect}) -
                    {moment(retinopathydate).isValid()
                      ? moment(retinopathydate).format("DD-MM-YYYY")
                      : "N/A"}
                  </Typography>
                  <Typography>
                    {t("Nephropathy")}: {nepropathy} -
                    {moment(nepropathydate).isValid()
                      ? moment(nepropathydate).format("DD-MM-YYYY")
                      : "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Other Conditions */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>
                        {t(
                          "Kidney Failure, Stroke, Skin or Urinary Infections"
                        )}
                        :
                      </strong>
                    </Typography>
                    <Typography>{dra}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          <Typography variant="h6" className="mt-10px mb-10px">
            {t("Lab Test Results")}
          </Typography>

          <Grid
            container
            spacing={2}
            className="TabsSectionWise MainHistoryTab"
          >
            {/* Lab report image */}
            {!isDrop && labURL && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent className="uploadViewReport">
                    <Typography>
                      <strong>{t("Last Lab Report Uploaded")}:</strong>{" "}
                      {lab || "NA"}{" "}
                    </Typography>
                    {/* {labURL && ( */}
                    <FileDownloadOutlined
                      className="viewdownloadIcon"
                      onClick={(e) => {
                         if (window.cordova) {
                            if(!navigator.onLine){
                                swal({
                                  title: t("Alert"),
                                  text: t("No internet connection. This feature is unavailable."),
                                  icon: "waring",
                                  button: t("Close"),
                                });
                                return;
                            }
                            setGlobalSpinner(true);
                            // Mobile
                            const token = basicAuth;
                            const filePath = window.cordova.platformId === "ios"
                                  ? window.cordova.file.documentsDirectory + "Report.pdf"
                                  : window.cordova.file.externalDataDirectory + "Report.pdf";

                            window.cordova.plugin.http.downloadFile(
                              labURL,
                              {},
                              {
                                Authorization: token
                              },
                              filePath,

                              function (entry, response) {
                                console.log("Downloaded:", entry.toURL(),entry.nativeURL);
                                setGlobalSpinner(false);
                                // ✅ open file
                                window.cordova.plugins.fileOpener2.open(
                                  entry.nativeURL,
                                  "application/pdf"
                                );
                              },

                              function (error) {
                                setGlobalSpinner(false);
                                console.error("Download failed:", error);
                              }
                            );
                          } else {
                              const link = document.createElement("a");
                              link.href = labURL;
                              link.setAttribute("target", "_blank");
                              link.setAttribute("download", `Report.pdf`);
                              // Append to html link element page
                              document.body.appendChild(link);
                              // Start download
                              link.click();
                              // Clean up and remove the link
                              link.parentNode.removeChild(link);
                            }}
                    }
                    />
                    {/* )} */}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Creatinine */}
            {/* {!isDrop && (<Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography><strong>{t("Creatinine")}:</strong> {creatininede} mg/dl</Typography>
                </CardContent>
              </Card>
            </Grid>)} */}

            {/* Microalbuminuria Test */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("Microalbuminuria Test")}:</strong>{" "}
                      {micro || "NA"} mg/dl
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Urine Creatinine */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("Urine Creatinine")}:</strong>
                      {urinecreatininede || "NA"} mg/g
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Total Cholesterol */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("Total Cholesterol")}:</strong>{" "}
                      {totalCholesterolde || "NA"} mg/dl
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* LDL Cholesterol */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("LDL Cholesterol")}:</strong>{" "}
                      {ldlCholesterolde || "NA"} mg/dl
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* HDL Cholesterol */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("HDL Cholesterol")}:</strong>{" "}
                      {hdlCholesterolde || "NA"} mg/dl
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Triglycerides */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("Triglycerides")}:</strong>{" "}
                      {triglyceridede || "NA"} mg/dl
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* TSH */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("TSH")}:</strong> {tsh_de || "NA"} μIU/mL
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Free T4 */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("Free T4")}:</strong> {freeT4de || "NA"} ng/dL
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Thyroid Peroxidase Antibody */}
            {!isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("Thyroid Peroxidase Antibody")}:</strong>{" "}
                      {thyroidPeroxidaseAntibodyde || "NA"} IU/mL
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("Ph")}:</strong> {ph || "NA"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("Serum Bicarbonate")}:</strong>{" "}
                      {Bicarbonate || "NA"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("A.B.I - Left Limb")}:</strong>{" "}
                      {abiLeftLimbValue || "NA"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {isDrop && (
              <Grid item xs={12} className="pt-0">
                <Card variant="outlined">
                  <CardContent>
                    <Typography>
                      <strong>{t("A.B.I - Right Limb")}:</strong>{" "}
                      {abiRightLimbValue || "NA"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tabIndex} index={3}>
          <Typography variant="h6" className="mt-10px mb-10px">
            {t("Glucose Log")}
          </Typography>
          <Grid
            container
            spacing={2}
            className="TabsSectionWise MainHistoryTab"
          >
            <div className="chart-container-glucose">
              <HighchartsReact
                highcharts={Highcharts}
                options={glucoseChartOption}
                ref={chartRef}
              />
            </div>
          </Grid>
        </TabPanel>
      </CardContent>
    </Card>
  );
}
