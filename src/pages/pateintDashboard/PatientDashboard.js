import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import imgUrl from "../../assets/images/imageUrl";
import _, { valuesIn } from "lodash";
import moment from "moment";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { downloadStagePDF } from "../../component/pdfStageWiseUtil";
import { downloadStagePDFIOS } from "../../component/pdfStageWiseUtilIOS";
import AccordionDetails from "@mui/material/AccordionDetails";
import Tooltip from "@mui/material/Tooltip";
import OfflineDb from "../../db";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import BadgeIcon from "@mui/icons-material/Badge";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import WcIcon from "@mui/icons-material/Wc";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChurchIcon from "@mui/icons-material/Church";
import PushPinIcon from "@mui/icons-material/PushPin";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import LayersIcon from '@mui/icons-material/Layers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import PatientTabs from "./PatientTabs";
import { useHistory } from "react-router";
import MyMapComponent from "./MyMapComponent";
import Gauge from "./Gauge";
import axios from 'axios';
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import PropTypes from "prop-types";
import swal from "sweetalert";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { apiServices } from "../../services/apiServices";
import PouchDB from 'pouchdb';


import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { useTranslation, Trans } from "react-i18next";


function PatientDashboard(props) {

  const [patientsData, setPatientsData] = useState({});
  const [instanceuid, setInstanceUid] = useState("")
  const history = useHistory();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const [events, setEvents] = useState([])
  const [nextVisit, setNextVisit] = useState("")
  const [femaleIconUrl, setFemaleIconUrl] = useState(false)
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  // const examinationStage = props.programData.programs[0].programStages.filter((stage) => stage.description == "Examination")[0]
  // const examinationStageId = examinationStage?.id
  // const examinationStageEvents = props.groupStages[examinationStageId]
  // let vitalFilterElements = []
  // examinationStage?.programStageDataElements.map((de) => {
  //   if (
  //     _.find(de.dataElement.attributeValues, {
  //       attribute: { name: "Lab_Values_Patient_Dashboard" },
  //     }) &&
  //     _.find(de.dataElement.attributeValues, {
  //       attribute: { name: "Lab_Values_Patient_Dashboard" },
  //     }).value == "true"
  //   ) {
  //     vitalFilterElements.push({key: de.dataElement.id, displayName: de.dataElement.description})
  //   }
  // }
  // )
  // const getName = () => {
  //   let firstName = userData.userData.attributes.filter((attr) => attr.displayName == "Patient Name_First Name")

  //   let lastName = userData.userData.attributes.filter((attr) => attr.displayName == "Family name_Family name")
  //   return firstName[0].value + " " + lastName[0].value
  // }
  const { t, i18n } = useTranslation();
  const db = new PouchDB('myDatabase');

  const getName = () => {
    //console.log("Attribute", props)
    // let firstName = props?.userData?.attributes?.filter((attr) => attr.displayName === "Patient Name_First Name") || [];
    //let lastName = props?.userData?.attributes?.filter((attr) => attr.displayName === "Family name_Family name") || [];

    // Find the trackedEntityAttribute.id for "Patient Name"
    const patientNameAttribute = props?.programData?.programs?.[0]?.programTrackedEntityAttributes?.find(
      (attr) => attr.trackedEntityAttribute?.description === "First Name"
    );

    const lastNameAttribute = props?.programData?.programs?.[0]?.programTrackedEntityAttributes?.find(
      (attr) => attr.trackedEntityAttribute?.description === "Last Name"
    );


    const patientNameId = patientNameAttribute?.trackedEntityAttribute?.id;
    const lastNameId = lastNameAttribute?.trackedEntityAttribute?.id;

    // if (!patientNameId) return "NA"; // Return N/A if not found
    // if (!lastNameId) return "NA";
    // Find the matching attribute in userData.attributes
    const matchedpnAttribute = props?.userData?.attributes?.find(
      (attr) => attr.attribute === patientNameId
    );

    const matchedlnAttribute = props?.userData?.attributes?.find(
      (attr) => attr.attribute === lastNameId
    );

    let firstName = matchedpnAttribute?.value || "NA";
    let lastName = matchedlnAttribute?.value || "NA";
    // const first = firstName.length > 0 ? firstName[0]?.value || "N/A" : "N/A";
    // const last = lastName.length > 0 ? lastName[0]?.value || "N/A" : "N/A";

    return `${firstName} ${lastName}`;
  };


  async function getMetaData() {
    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);
  }


  const getImgLoaded = async () => {
    try {
      const doc = await db.get('img_female_icon', { attachments: true, binary: true });
      // const doc = await db.get('img_b', { attachments: true, binary: true });
      // const attachment = doc._attachments['user.png'];
      if (!doc._attachments || !doc._attachments['female-icon.png']) {
        console.error('Attachment female-icon.png not found', doc._attachments?.['female-icon.png'], doc);
        return;
      }

      const attachment = doc._attachments['female-icon.png'];
      const blob = new Blob([attachment.data], { type: attachment.content_type });
      const imageUrl = URL.createObjectURL(blob);

      console.log("imageUrl::>>", imageUrl);
      setFemaleIconUrl(imageUrl); // ✅ this should be a function call, not assignment

    } catch (err) {
      console.error('Error loading med icon:', err);
    }

  };

  useEffect(() => {
    getMetaData();
    // getImgStored()
    getImgLoaded();
  }, []);

  // useEffect(() => {
  //   console.log("isImgStored::>>",isImgStored)
  // }, [isImgStored]);



  const isDrop = sessionUserBoValue?.userRoles?.find(
    (role) => role.name === "DROP-HCP"
  );
  const VisitBox = () => {

    return (
      <div className="visit-box">
        {/* Next Visit */}
        <div className="visit-row">
          <span className="calendar-icon next-visit"></span>
          <strong className="visit-label next-visit">{t("Next Visit")}:</strong>
          <span className="visit-date">
            {nextVisit
              ? moment(nextVisit.date).format("DD MMMM YYYY")
              : "NA"}
          </span>
        </div>

        {/* Last Visit */}
        <div className="visit-row">
          <span className="calendar-icon last-visit"></span>
          <strong className="visit-label last-visit">{t("Last Visit")}:</strong>

          <span className="visit-date">{moment(props.userData.lastUpdatedAtClient).format("D MMMM YYYY")}</span>
        </div>
      </div>
    );

  };

  const redirectToAppointmentTab = async () => {

    const indexOfAppointmentTab = await
      props.programData.programs[0].programStages.findIndex(
        (obj) => obj.description == "Appointments"
      );
    props.setValue(indexOfAppointmentTab + 2)
  }


  useEffect(() => {
    if (!navigator.onLine) {
      swal({
        title: t("This operation is not available while offline. Please go online to proceed."),
        icon: "warning",
        button: "OK",
        // className: "custom-swalwarning"
      });
      // history.push("/layout/home");
    }
    let oRequest = {
      "param1": props?.userData?.programOwners?.[0]?.program,
      "param2": props?.userData?.orgUnit,
      "param3": props?.userData?.trackedEntityInstance
    }
    apiServices.postAPI('dashboardIndicator/getPatientData/get_custom_dashboard_registration', oRequest)
      .then((res) => {
        setPatientsData(res?.data?.data?.[0] || {});
      })
      .catch((error) => {
        console.log("error", error)
      })

    apiServices
      .postAPI(
        "dashboardIndicator/getPatientData/get_customs_dashboard_appointmentDetails",
        oRequest
      )
      .then(async (res) => {
        const allEvents = res.data.data.map((item) => {
          const appointmentDateTime = moment(item.dateofappointment).format("YYYY-MM-DD");
          return {
            title: item.reasonappointment || t("No Reason Provided"),
            firstName: item.fisrtname || "",
            lastName: item.lastname || "",
            date: appointmentDateTime,
            startTime: item.fromtime,
            endTime: item.totime,
            originalDate: item.dateofappointment, // ISO string or Date
          };
        });

        // 🔁 Get today's date using moment
        const today = moment();

        // ✅ Past Events (strictly before today)
        const pastEvents = allEvents
          .filter(event => moment(event.originalDate).isBefore(today, "day"))
          .sort((a, b) => moment(b.originalDate).diff(moment(a.originalDate))); // Descending

        // ✅ Next Visit (today or after)
        const futureEvents = allEvents
          .filter(event => moment(event.originalDate).isSameOrAfter(today, "day"))
          .sort((a, b) => moment(a.originalDate).diff(moment(b.originalDate))); // Ascending

        // ✅ Store results in state
        setEvents(pastEvents.slice(0, 3)); // Only 3 most recent past events
        setNextVisit(futureEvents[0] || null); // First upcoming visit (if any)



      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);



  const downloadPatientDiv = () => {
    if (window?.cordova?.platformId == 'ios') {
      downloadStagePDF(setGlobalSpinner, 'patientdiv')
    } else {
      downloadStagePDF(setGlobalSpinner, 'patientdiv')
    }
  }

  function UpdateRecordClick() {


    // const formDataMassaged = {};
    // const activeCaseDetails = {
    //   trackedEntityInstance: instanceuid,
    //   enrollmentId: "",
    //   type: "case",
    // };
    // const activeCaseFormData = {
    //   formFormat: null, //formDataMassaged,
    //   dhisFormat: null,
    // };
    // const linkContact = {
    //   enabled: false,
    //   linkTrackedEntityInstance: instanceuid,
    // };
    // OfflineDb.setDataIntoPouchDB("activeCaseDetails", activeCaseDetails);
    // OfflineDb.setDataIntoPouchDB("linkContactFlag", linkContact);
    // setGlobalSpinner(false);
    // history.push("/layout/registration");
    props.setValue(1)

  }

  const AppointmentCard = ({ name, chekupType, date, time, index, length }) => {
    return (

      <Box
        sx={{
          backgroundColor: "#fff",
          padding: '5px !important',
          marginLeft: "-5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #e5e5e5",
          boxShadow: 1,
          borderTopLeftRadius: index === 0 ? '8px' : 0,
          borderTopRightRadius: index === 0 ? '8px' : 0,
          borderBottomLeftRadius: index === length - 1 ? '8px' : 0,
          borderBottomRightRadius: index === length - 1 ? '8px' : 0,
        }}
      >
        {/* Left Side - Patient Name & Checkup Type */}
        <Box sx={{ maxWidth: "60%", overflow: "hidden" }}>
          <Tooltip title={name} arrow>
            <Typography
              variant="body1"
              fontWeight="bold"
              gutterBottom
              fontSize="0.875rem !important"
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                display: "block",
              }}
            >
              {name}
            </Typography>
          </Tooltip>

          <Tooltip title={chekupType} arrow>
            <Typography
              variant="body2"
              color="textSecondary"
              fontSize="0.75rem !important"
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                display: "block",
              }}
            >
              {chekupType}
            </Typography>
          </Tooltip>
        </Box>

        {/* Right Side - Date & Time */}
        <Box textAlign="right">
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CalendarTodayIcon fontSize="small" style={{ fontSize: 16 }} />
            <Typography variant="body2" fontSize="0.75rem">{date}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTimeIcon fontSize="small" style={{ fontSize: 16 }} />
            <Typography variant="body2" fontSize="0.75rem">{time}</Typography>
          </Box>
        </Box>
      </Box>

    );
  };


  return (

    <div className="patientDashboardSection" id="patientDashboardSection">
      <Grid container className="mt-57px">
        <Grid item xs={12} sm={4} md={3} className="bg-blue">
          <div>
            <div className="profile-card mt-30px">
              {/* <AccountCircleIcon className="profile-icon"></AccountCircleIcon> */}
              {/* {console.log("imgUrl.profile_user::>>",femaleIconUrl)} */}
              {/* {window?.cordova?.platformId == 'ios' ? <></> : <img src={femaleIconUrl}></img>} */}
              {/* <img src={femaleIconUrl ? femaleIconUrl : imgUrl?.female_icon}></img> */}
              <img src={imgUrl?.female_icon}></img>
              <Tooltip title={`${getName()}`} arrow>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  marginTop="10px"
                  gutterBottom
                  fontSize="0.975rem !important"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "150px" // Adjust width as needed
                  }}
                >
                  {getName()}
                </Typography>
              </Tooltip>
              <h5 style={{ color: "white", margin: "5px" }}>{patientsData?.DOB ? `${moment().diff(patientsData?.DOB, 'years')} ${t("years old")}` : "NA"},({t(patientsData?.Gender)})</h5>
              {/* <p className="mt-5px mb-0">Last visit: {moment(userData.userData.lastUpdatedAtClient).format("DD/MM/YYYY")}</p> */}


            </div>
            <div className="profile-social mt-20px">
              {/* <img src={imgUrl.file_download}></img> */}

              <FileDownloadIcon style={{ fontSize: 24, color: "white", margin: "0px 10px", cursor: 'pointer' }} onClick={downloadPatientDiv} />
              <div className="border-right"></div>
              <EditIcon style={{ fontSize: 24, color: "white", margin: "0px 10px", cursor: 'pointer' }} onClick={UpdateRecordClick} />

            </div>
            <div
              className="visitBoxSection"
              style={{
                display: "flex",
                justifyContent: "center",  // Centers horizontally
                alignItems: "center",
                marginTop: "15px"
              }}>
              {!isDrop && <VisitBox />}
            </div>


            {/* <div className="profile-stats"> */}
            {/* <img src={imgUrl.profile_stats} className="w-50"></img> */}
            {/* <Gauge/> */}

            {/* </div> */}
            <div className="profile-summary">
              {!isDrop && (
                <Grid container spacing={2} className="mt-15px">
                  <Grid item xs={12} className="pr-0px">
                    <Card
                      variant="outlined"
                      className="bg-lightgrey calender-patient-section"
                    >
                      <CardContent className="mb-10px">
                        <div
                          className="flex justify-between items-center"
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", color: "white" }}
                        >
                          {/* Left - Title + Plus Icon */}
                          <div
                            className="flex items-center space-x-2"
                            style={{ display: "flex", alignItems: "center", gap: "8px" }}
                          >
                            <h5 className="m-0" style={{ margin: 0 }}>{t("Appointment History")}</h5>
                            {/* <button 
                        className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full"
                        style={{
                          width: "24px", height: "24px", display: "flex", cursor: "pointer",
                          alignItems: "center", justifyContent: "center",
                          backgroundColor: "green", color: "white", borderRadius: "50%", border: "none"
                        }}
                        onClick={() => redirectToAppointmentTab()}
                      >
                        +
                      </button> */}
                          </div>

                          {/* Right - View All Link */}
                          {/* <div 
                      onClick={() => redirectToAppointmentTab()}
                      className="text-blue-500 hover:underline text-sm"
                      style={{fontSize: "14px", textDecoration: "none", cursor: "pointer" }}
                      onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                      onMouseOut={(e) => e.target.style.textDecoration = "none"}
                    >
                      View All
                    </div> */}
                        </div>
                        {console.log(events, 'events')}
                        {events.length > 0 ? (
                          events.map((card, index) => (
                            <AppointmentCard
                              key={index}
                              name={card.firstName + " " + card.lastName}
                              chekupType={card.title}
                              index={index}
                              length={events.length}
                              date={card.date}
                              time={card.startTime + " - " + card.endTime}
                            />
                          ))
                        ) : (
                          <Box
                            sx={{
                              // backgroundColor: "#fff",
                              padding: '5px !important',
                              marginLeft: "-5px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              maxWidth: "400px",
                              color: "white",
                              border: "1px solid #e5e5e5",
                              boxShadow: 1,
                              borderRadius: "8px",
                              height: "50px",
                            }}
                          >
                            <Typography variant="body1" color="textSecondary" sx={{ color: "#fff", fontSize: "14px" }}>
                              {t("Appointment details not found")}
                            </Typography>
                          </Box>
                        )}
                        <span style={{ fontSize: "11px", margin: "5px", color: "white" }}>{t("*Latest 3 entries are shown")}</span>
                      </CardContent>

                    </Card>
                  </Grid>
                </Grid>)}
              <Accordion defaultExpanded className="mb-0 second-accordion">
                <AccordionSummary
                  expandIcon={<KeyboardDoubleArrowUpIcon className="acc-svg" />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  {t("DEMOGRAPHICS AND CONTACT DETAILS")}
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                    <div className="mb-10px" style={{ textAlign: "center" }}>
                      <div className="profile-badge">
                        <BadgeIcon></BadgeIcon>{" "}
                        <p className="mt-15px mx-4px">{t("NAME")}: {patientsData?.Name}</p>
                      </div>
                      <div className="profile-badge">
                        <WcIcon></WcIcon>{" "}
                        <p className="mt-15px mx-4px">{t("GENDER")}: {t(patientsData?.Gender)}</p>
                      </div>
                      <div className="profile-badge">
                        <CalendarMonthIcon></CalendarMonthIcon>{" "}
                        <p className="mt-15px mx-4px">{t("DOB")}: {patientsData?.DOB}</p>
                      </div>
                      <div className="profile-badge">
                        <CalendarMonthIcon></CalendarMonthIcon>{" "}
                        <p className="mt-15px mx-4px">
                          {t("AGE")}: {patientsData?.DOB ? moment().diff(`${patientsData.DOB}`, "years") : ""}
                        </p>
                      </div>
                      {!isDrop && (<div className="profile-badge">
                        <PushPinIcon></PushPinIcon>{" "}
                        <p className="mt-15px mx-4px">{t("REGION")}: {t(patientsData?.Region)}</p>
                      </div>)}
                      {!isDrop && (<div className="profile-badge">
                        <LocationOnIcon></LocationOnIcon>{" "}
                        <p className="mt-15px mx-4px">{t("ADDRESS")}: {patientsData?.Address}</p>
                      </div>)}
                      {!isDrop && (<div className="profile-badge">
                        <PhoneInTalkIcon></PhoneInTalkIcon>{" "}
                        <p className="mt-15px mx-4px">
                          {t("PATIENT CONTACT")}: {patientsData?.Patient_Contact}
                        </p>
                      </div>)}
                      {!isDrop && (<div className="profile-badge">
                        <PhoneInTalkIcon></PhoneInTalkIcon>{" "}
                        <p className="mt-15px mx-4px">
                          {t("GUARDIAN CONTACT")}: {patientsData?.Guardian_contact}
                        </p>
                      </div>)}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded className="mt-0 mb-0 second-accordion">
                <AccordionSummary
                  expandIcon={<KeyboardDoubleArrowUpIcon className="acc-svg" />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  {t("SOCIO ECONOMIC DETAILS")}
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                    <div className="mb-10px" style={{ textAlign: "center" }}>
                      <div className="profile-badge">
                        <CalendarMonthIcon></CalendarMonthIcon>{" "}
                        <p className="mt-15px mx-4px">{t("DATE OF ENROLLMENT")}:{patientsData?.Date_enrollment}</p>
                      </div>
                      {!isDrop && (<div className="profile-badge">
                        <ChurchIcon></ChurchIcon>{" "}
                        <p className="mt-15px mx-4px">{t("RELIGION")}: {t(patientsData?.Religion)}</p>
                      </div>)}
                      <div className="profile-badge">
                        <BadgeIcon></BadgeIcon>{" "}
                        <p className="mt-15px mx-4px">{t("NATIONAL ID NO")}:{patientsData?.National_ID}</p>
                      </div>
                      {!isDrop && (<div className="profile-badge">
                        <AttachMoneyIcon></AttachMoneyIcon>{" "}
                        <p className="mt-15px mx-4px">{t("INSURANCE STATUS")}: {t(patientsData?.Insurance_status)}</p>
                      </div>)}
                      {!isDrop && (<div className="profile-badge">
                        <LayersIcon></LayersIcon>{" "}
                        <p className="mt-15px mx-4px">{t("PATIENT EDUCATION")}: {t(patientsData?.Patient_Education)}</p>
                      </div>)}
                      {!isDrop && (<div className="profile-badge">
                        <AttachMoneyIcon></AttachMoneyIcon>
                        <p className="mt-15px mx-4px">{t("HOUSEHOLD INCOME")}: {t(patientsData?.Household_Income)}</p>
                      </div>)}
                      {!isDrop && (<div className="profile-badge">
                        <MonitorHeartIcon></MonitorHeartIcon>{" "}
                        <p className="mt-15px mx-4px">{t("PARENT MORTALITY")}: {t(patientsData?.Parent_Mortality)}</p>
                      </div>)}

                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              {/* <Accordion defaultExpanded className="mt-0 mb-0 second-accordion">
                <AccordionSummary
                  expandIcon={<KeyboardDoubleArrowUpIcon className="acc-svg" />}
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  LOCATION
                </AccordionSummary> */}
              {/* <AccordionDetails>
                   <div className="location-section">
                   <div className="">
                      {/* <div className="profile-badge mb-0">
                        <LocationOnIcon></LocationOnIcon>{" "}
                        <p className="mt-15px mx-4px">{patientsData?.Address}</p>
                      </div> */}
              {/* <div>
                        <MyMapComponent location={patientsData?.Address_Location}/>
                        </div> */}

              {/* <MyMapComponent isMarkerShown />
                      <MyMapComponent isMarkerShown={false} /> */}
              {/* <div className="profile-badge pb-15px">
                        <img src={imgUrl.maplocate_icon} className="w-10"></img>
                        <p className="mt-15px mx-4px">Distance from facility : <span> 75 kms </span> </p>
                      </div> */}


              {/* </div>
                   </div>
                </AccordionDetails> */}
              {/* </Accordion>  */}
            </div>

          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <div>
            <PatientTabs userData={props} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default PatientDashboard;