import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import _, { valuesIn } from "lodash";
import HealthMetricIndicator from "./HealthMetric";
import imgUrl from "../../assets/images/imageUrl";
import TreatmentRegime from "./TreatmentRegime";
import { Autocomplete, TextField, Chip } from "@mui/material";
// import Appointments from "./Appointments/Appointments";
import HbA1C from "./HbA1C";
import Glucose from "./Glucose";
import BMI from "./BMI";
import BloodPressure from "./BloodPressure";
import LabDashboard from "./labValuesFilter";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { apiServices } from "../../services/apiServices";
import moment from "moment";
import LabValues from "./LabValues";

import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Alerts from "./Alerts";
import HeightChart from "./Height";
import WeightChart from "./Weight";
import SMR from "./SmrChart";
import { APP_LOCALE } from '../../../src/assets/data/config.js';
import { BatchPrediction } from "@mui/icons-material";
import { useTranslation, Trans } from "react-i18next";
import OfflineDb from "../../db";
import PouchDB from 'pouchdb';

const db = new PouchDB('myDatabase');

// a custom render function
function renderEventContent(eventInfo) {
  console.log("eventInfo", eventInfo)
  return (
    <div>
      <b>{eventInfo.timeText}</b>
      <i style={{ marginLeft: "5px" }}>{eventInfo.event.title}</i>
    </div>
  );
}
let events;
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function PatientTabs(userData) {
  const [value, setValue] = React.useState(0);
  const [labDetails, setLabDetails] = React.useState([]);
  const [bloodGlucose, setbloodGlucose] = React.useState([]);
  const [bP, setbP] = React.useState([]);
  const [bPD, setbPD] = React.useState([]);
  const [glucose, setglucose] = React.useState([]);
  const [hBA1c, sethBA1c] = React.useState([]);
  const [cholesterol, setcholesterol] = React.useState([]);
  const [triglyceride, settriglyceride] = React.useState([]);
  const [tsh, settsh] = React.useState([]);
  const [bmi, setbmi] = React.useState([]);
  const [riskData, setRiskData] = React.useState({});
  const [referenceRange, setReferenceRange] = React.useState([]);
  const [complicationsData, setComplicationsData] = React.useState({});
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [femaleIconUrl, setFemaleIconUrl] = useState(false)

  const examinationStage = userData.userData.programData.programs[0].programStages.filter((stage) => stage.description == "Examination")[0]
  const examinationStageId = examinationStage?.id;
  const examinationStageEvents = userData?.userData?.groupStages?.[examinationStageId];
  let vitalFilterElements = []
  let referenceRanges = []
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
        console.error('Attachment female-icon.png not found');
        return;
      }

      const attachment = doc._attachments['female-icon.png'];
      const blob = new Blob([attachment.data], { type: attachment.content_type });
      const imageUrl = URL.createObjectURL(blob);

      setFemaleIconUrl(imageUrl);

    } catch (err) {
      console.error('Error loading med icon:', err);
    }

  };
  useEffect(() => {
    getMetaData();
    getImgLoaded()
  }, []);

  const isDrop = sessionUserBoValue?.userRoles?.find(
    (role) => role.name === "DROP-HCP"
  );
  let filterObject = examinationStage?.programStageDataElements.filter((de) => {
    if (
      _.find(de.dataElement.attributeValues, {
        attribute: { name: "Lab_Values_Patient_Dashboard" },
      }) &&
      _.find(de.dataElement.attributeValues, {
        attribute: { name: "Lab_Values_Patient_Dashboard" },
      }).value == "true"
    ) {
      vitalFilterElements.push({ key: de.dataElement.id, displayName: de.dataElement.description })

      return de.dataElement
    }
  })

  const { t, i18n } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    let oRequest = {
      param1: userData?.userData?.userData?.programOwners?.[0]?.program,
      param2: userData?.userData?.userData?.orgUnit,
      param3: userData?.userData?.userData?.trackedEntityInstance,
    };
    apiServices
      .postAPI(
        "dashboardIndicator/getPatientData/get_custom_dashboard_labdetails",
        oRequest
      )

      .then(async (res) => {
        const jsonData = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

        // Process data safely
        const formattedData = jsonData.data.map((item) => ({
          indicatorValue: item.indicatorvalue,
          indicatorDate: String(item.indicatordate), // Convert invalid date format to string
          indicatorName: item.indicatorname
        }));

        console.log("Formatted Data:", formattedData);

        // setbloodGlucose(
        //   res.data.data.filter(
        //     (ele) => ele.indicatorname == "Blood glucose - Random"
        //   )
        // );
        // setbP(
        //   res.data.data.filter(
        //     (ele) => ele.indicatorname == "Blood pressure Systole(mmHg)"
        //   )
        // );
        // setbPD(
        //   res.data.data.filter(
        //     (ele) => ele.indicatorname == "Blood pressure Diastole(mmHg)"
        //   )
        // );
        // setglucose(
        //   res.data.data.filter(
        //     (ele) => ele.indicatorname == "Blood glucose - Fasting"
        //   )
        // );
        // sethBA1c(
        //   res.data.data.filter((ele) => ele.indicatorname == "HbA1C(%)")
        // );
        // setcholesterol(
        //   res.data.data.filter(
        //     (ele) => ele.indicatorname == "Total Cholesterol (mg/dl)"
        //   )
        // );
        // settriglyceride(
        //   res.data.data.filter((ele) => ele.indicatorname == "Triglyceride")
        // );
        // settsh(res.data.data.filter((ele) => ele.indicatorname == "TSH"));
        // setbmi(
        //   res.data.data.filter((ele) => ele.indicatorname == "BMI(Kg/m2)")
        // );
        // setLabDetails(res.data.data);

        const labData = typeof res.data === "string" ? JSON.parse(res.data).data : res.data.data;

        // Sort data by `indicatordate` (latest first)
        const sortedData = labData.sort((a, b) => new Date(b.indicatordate) - new Date(a.indicatordate));

        // Function to get the latest and previous entry
        const getPreviousAndCurrent = (indicatorName) => {
          const filtered = sortedData.filter((ele) => ele.indicatorname === indicatorName);
          console.log(indicatorName, filtered)
          return {
            current: filtered[0] || { indicatorvalue: "NA", indicatordate: "NA", indicatorname: indicatorName },
            previous: filtered[1] || { indicatorvalue: "NA", indicatordate: "NA", indicatorname: indicatorName },
          };
        };

        // Update states with the formatted data
        setbloodGlucose(getPreviousAndCurrent("Blood glucose - Random"));
        setbP(getPreviousAndCurrent("Blood pressure Systole(mmHg)"));
        setbPD(getPreviousAndCurrent("Blood pressure Diastole(mmHg)"));
        setglucose(getPreviousAndCurrent("Blood glucose - Fasting"));
        sethBA1c(getPreviousAndCurrent("HbA1C(%)"));
        setcholesterol(getPreviousAndCurrent("Total Cholesterol (mg/dl)"));
        settriglyceride(getPreviousAndCurrent("Triglyceride"));
        settsh(getPreviousAndCurrent("TSH"));
        setbmi(getPreviousAndCurrent("BMI(Kg/m2)"));

        // Store entire sorted data

        setLabDetails(sortedData);
      })
      .catch((error) => {
        console.log("error", error);
      });
    apiServices
      .postAPI(
        "dashboardIndicator/getPatientData/get_customs_dashboard_appointmentDetails",
        oRequest
      )
      .then((res) => {
        events = res.data.data.map((item) => {
          const appointmentDateTime = moment(item.dateofappointment).format(
            "YYYY-MM-DD"
          );
          const startTime = moment(
            `${appointmentDateTime} ${item.fromtime}`,
            "YYYY-MM-DD HH:mm"
          ).toDate();

          const endTime = moment(
            `${appointmentDateTime} ${item.totime}`,
            "YYYY-MM-DD HH:mm"
          ).toDate();

          const firstName = item.fisrtname || ""
          const lastName = item.lastname || ""

          return {
            // title: `${item.fromtime} - ${item.totime} ${item.reasonappointment || "No Reason Provided"}`,
            // start: startTime,
            // end: endTime,
            // title: `${item.reasonappointment || "No Reason Provided"}`,
            title: item.reasonappointment || t("No Reason Provided"),
            firstName: firstName,
            lastName: lastName,
            // numberOfVisit: "",
            start: startTime,
            end: endTime,
          };
        });
      })
      .catch((error) => {
        console.log("error", error);
      });

    //API CALL FOR RISK DATA
    apiServices
      .getAPI(
        `dashboardIndicator/patient/risk?programuid=${userData?.userData?.userData?.programOwners?.[0]?.program}&orguid=${userData.userData.userData.orgUnit}&instanceuid=${userData.userData.userData.trackedEntityInstance}`
      )
      .then((response) => {
        setRiskData(response.data.data[0])
      })
      .catch((error) => {
        console.log("error", error);
      });

    //API CALL FOR COMPLICATIONS DATA
    apiServices
      .getAPI(
        `dashboardIndicator/patient/complications?programuid=${userData?.userData?.userData?.programOwners?.[0]?.program}&orguid=${userData.userData.userData.orgUnit}&instanceuid=${userData.userData.userData.trackedEntityInstance}`
      )
      .then((response) => {
        setComplicationsData(response.data.data[0])
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  return (
    <Box sx={{ width: "100%" }} className="patient-tabs mt-20px">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          className="patient-vitalTab"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={t("VITALS/MEDICAL HISTORY")}
            wrapped
            {...a11yProps(0)}
            className="first-vital-tab"
          />
          {/* <Tab label="TREATMENT REGIMEN" wrapped {...a11yProps(1)} />  */}
          <Tab
            label={t("LAB VALUES")}
            className="first-vital-tab"
            {...a11yProps(1)}
          />
          {/* <Tab label="ALERTS" {...a11yProps(3)} /> */}
        </Tabs>
      </Box>

      <div className="mx-24px mt-20px patientSecondSection">
        <CustomTabPanel value={value} index={0}>
          <div className="first-tab">
            <Card variant="outlined">
              <CardContent className="pt-100 pb-8px">
                <div className="first-card">
                  <h5 className="mt-0">{t("Basic Lab Values")}</h5>
                  <div>
                    <Grid container spacing={2} className="lab-firstSection">
                      <Grid item xs={6} sm={3}>
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {/* <img
                              src={imgUrl.arrowup_icon}
                              className="arrow-icon"
                            ></img> */}
                            <HealthMetricIndicator prevValue={hBA1c?.previous?.indicatorvalue ? hBA1c?.previous?.indicatorvalue : 'NA'} currValue={hBA1c?.current?.indicatorvalue ? hBA1c?.current?.indicatorvalue : 'NA'} metric="hba1c" /> {/* Red Arrow Up */}

                            <img
                              src={imgUrl.labhsb_icon}
                              className="lab-icon"
                            ></img>
                            <h4 className="mt-0 mb-0">
                              {hBA1c?.current?.indicatorvalue ? hBA1c?.current?.indicatorvalue : ""}
                            </h4>
                          </div>
                          <div>
                            <h6 className="mt-15px mb-0">{t("HbA1C")}</h6>
                            <p className="mt-5px mb-0"></p>
                            <p className="mt-5px">
                              (
                              {hBA1c && hBA1c?.current?.indicatordate !== "NA"
                                ? moment(hBA1c?.current?.indicatordate).format(
                                  "DD.MM.YYYY"
                                )
                                : "NA"}
                              ){" "}
                            </p>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {/* <img
                              src={imgUrl.arrowdown_icon}
                              className="arrow-icon"
                            ></img> */}
                            <HealthMetricIndicator prevValue={glucose?.previous?.indicatorvalue ? glucose?.previous?.indicatorvalue : 0} currValue={glucose?.current?.indicatorvalue ? glucose?.current?.indicatorvalue : 0} metric="bloodGlucoseFasting" />
                            <img
                              src={imgUrl.lab_three}
                              className="lab-icon"
                            ></img>
                            <h4 className="mt-0 mb-0">
                              {glucose?.current ? glucose.current.indicatorvalue : ""}
                            </h4>
                          </div>
                          <div>
                            <h6 className="mt-15px mb-0">{t("Glucose Fasting")}</h6>
                            <p className="mt-5px mb-0">(mg/dl)</p>
                            <p className="mt-5px">
                              (
                              {glucose && glucose.current?.indicatordate !== "NA"
                                ? moment(glucose.current?.indicatordate).format(
                                  "DD.MM.YYYY"
                                )
                                : "NA"}
                              ){" "}
                            </p>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {/* <img
                              src={imgUrl.arrowup_icon}
                              className="arrow-icon"
                            ></img> */}
                            <HealthMetricIndicator prevValue={bloodGlucose?.previous?.indicatorvalue ? bloodGlucose?.previous?.indicatorvalue : 'NA'} currValue={bloodGlucose?.current?.indicatorvalue ? bloodGlucose?.current?.indicatorvalue : 'NA'} metric="randomBloodGlucose" />
                            <img
                              src={imgUrl.lab_three}
                              className="lab-icon"
                            ></img>
                            <h4 className="mt-0 mb-0">
                              {bloodGlucose
                                ? bloodGlucose?.current?.indicatorvalue
                                : ""}
                            </h4>
                          </div>
                          <div>
                            <h6 className="mt-15px mb-0">{t("Glucose Random")} </h6>
                            <p className="mt-5px mb-0">(mg/dl)</p>
                            <p className="mt-5px">
                              (
                              {bloodGlucose && bloodGlucose.current?.indicatordate !== "NA"
                                ? moment(bloodGlucose?.current?.indicatordate).format(
                                  "DD.MM.YYYY"
                                )
                                : "NA"}
                              ){" "}
                            </p>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {/* <img
                              src={imgUrl.arrowdown_icon}
                              className="arrow-icon"
                            ></img> */}

                            <img
                              src={imgUrl.lab_two}
                              style={{ marginBottom: "22px" }}
                              className="lab-icon"
                            ></img>
                            <div className="flex flex-col items-start">
                              {bP && bPD ? (
                                <>
                                  <div className="d-flex items-center">
                                    {bP.current?.indicatorvalue}
                                    <HealthMetricIndicator prevValue={bP?.previous?.indicatorvalue ? bP?.previous?.indicatorvalue : 'NA'} currValue={bP?.current?.indicatorvalue ? bP?.current?.indicatorvalue : 'NA'} metric="bloodPressureSystole" />
                                  </div>
                                  <hr></hr>
                                  <div className="d-flex items-center">
                                    {bPD.current?.indicatorvalue}
                                    <HealthMetricIndicator prevValue={bPD?.previous?.indicatorvalue ? bPD?.previous?.indicatorvalue : 'NA'} currValue={bPD?.current?.indicatorvalue ? bPD?.current?.indicatorvalue : 'NA'} metric="bloodPressureDiastole" />
                                  </div>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                            <div>

                            </div>
                          </div>
                          <div>
                            <h6 className="mb-0" style={{ marginTop: "10px" }}>{t("Blood Pressure")}</h6>
                            <p className="mt-5px">
                              (
                              {bP && bP.current?.indicatordate !== "NA"
                                ? moment(bP.current?.indicatordate).format(
                                  "DD.MM.YYYY"
                                )
                                : "NA"}
                              ){" "}
                            </p>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="outlined" className="mt-30px">
              <CardContent className="pt-100 pb-5px mt-10px">
                <div className="first-card">
                  {/* <h5 className="mt-0">BASIC LAB VALUES</h5> */}
                  <div>
                    <Grid container spacing={2} className="lab-firstSection">
                      <Grid item xs={6} sm={3}>
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {/* <img
                              src={imgUrl.arrowup_icon}
                              className="arrow-icon"
                            ></img> */}
                            <HealthMetricIndicator prevValue={bmi?.previous?.indicatorvalue ? bmi?.previous?.indicatorvalue : 'NA'} currValue={bmi?.current?.indicatorvalue ? bmi?.current?.indicatorvalue : 'NA'} metric="bmi" />
                            <img
                              src={imgUrl.lab_one}
                              className="lab-icon"
                            ></img>
                            <h4 className="mt-0 mb-0">
                              {bmi ? bmi.current?.indicatorvalue : ""}
                            </h4>
                          </div>
                          <div>
                            <h6 className="mt-15px mb-0">{t("BMI")}</h6>
                            <p className="mt-5px">
                              (
                              {bmi && bmi.current?.indicatordate !== "NA"
                                ? moment(bmi.current?.indicatordate).format(
                                  "DD.MM.YYYY"
                                )
                                : "NA"}
                              ){" "}
                            </p>
                          </div>
                        </div>
                      </Grid>
                      {!isDrop && (<Grid item xs={6} sm={3}>
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {/* <img
                              src={imgUrl.arrowdown_icon}
                              className="arrow-icon"
                            ></img> */}
                            <HealthMetricIndicator prevValue={cholesterol?.previous?.indicatorvalue ? cholesterol?.previous?.indicatorvalue : 'NA'} currValue={cholesterol?.current?.indicatorvalue ? cholesterol?.current?.indicatorvalue : 'NA'} metric="totalCholesterol" />
                            <img
                              src={imgUrl.labchol_icon}
                              className="lab-icon"
                            ></img>
                            <h4 className="mt-0 mb-0">
                              {cholesterol
                                ? cholesterol.current?.indicatorvalue
                                : ""}
                            </h4>
                          </div>
                          <div>
                            <h6 className="mt-15px mb-0">{t("Total Cholesterol")}</h6>
                            <p className="mt-5px mb-0">(mg/dl)</p>
                            <p className="mt-5px">
                              (
                              {cholesterol && cholesterol.current?.indicatordate !== "NA"
                                ? moment(cholesterol.current?.indicatordate).format(
                                  "DD.MM.YYYY"
                                )
                                : "NA"}
                              ){" "}
                            </p>
                          </div>
                        </div>
                      </Grid>)}
                      {!isDrop && (<Grid item xs={6} sm={3}>
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {/* <img
                              src={imgUrl.arrowup_icon}
                              className="arrow-icon"
                            ></img> */}
                            <HealthMetricIndicator prevValue={triglyceride?.previous?.indicatorvalue ? triglyceride?.previous?.indicatorvalue : 'NA'} currValue={triglyceride?.current?.indicatorvalue ? triglyceride?.current?.indicatorvalue : 'NA'} metric="triglycerides" />
                            <img
                              src={imgUrl.labtri_icon}
                              className="lab-icon"
                            ></img>
                            <h4 className="mt-0 mb-0">
                              {triglyceride
                                ? triglyceride.current?.indicatorvalue
                                : ""}
                            </h4>
                          </div>
                          <div>
                            <h6 className="mt-15px mb-0">{t("Triglyceride")}</h6>
                            <p className="mt-5px mb-0">(mg/dl)</p>
                            <p className="mt-5px">
                              (
                              {triglyceride && triglyceride.current?.indicatordate !== "NA"
                                ? moment(triglyceride.current?.indicatordate).format(
                                  "DD.MM.YYYY"
                                )
                                : "NA"}
                              ){" "}
                            </p>
                          </div>
                        </div>
                      </Grid>)}
                      {!isDrop && (<Grid item xs={6} sm={3}>
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {/* <img
                              src={imgUrl.arrowdown_icon}
                              className="arrow-icon"
                            ></img> */}
                            <HealthMetricIndicator prevValue={tsh?.previous?.indicatorvalue ? tsh?.previous?.indicatorvalue : 'NA'} currValue={tsh?.current?.indicatorvalue ? tsh?.current?.indicatorvalue : 'NA'} metric="tsh" />

                            <img
                              src={imgUrl.labtsh_icon}
                              className="lab-icon"
                            ></img>
                            <h4 className="mt-0 mb-0">
                              {tsh ? tsh.current?.indicatorvalue : ""}
                            </h4>
                          </div>
                          <div>
                            <h6 className="mt-15px mb-0">{t("TSH")}</h6>
                            <p className="mt-5px mb-0">(mlU/L)</p>
                            <p className="mt-5px">
                              (
                              {tsh && tsh.current?.indicatordate !== "NA"
                                ? moment(tsh.current?.indicatordate).format(
                                  "DD.MM.YYYY"
                                )
                                : "NA"}
                              ){" "}
                            </p>
                          </div>
                        </div>
                      </Grid>)}
                    </Grid>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="second-ChartSection mt-15px">
            <Grid container spacing={2} className="mt-0">
              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="bg-lightgrey">
                  <CardContent>
                    <div className="">
                      <h5 className="mt-0">{t("HbA1C Trend")}</h5>
                    </div>
                    <HbA1C userData={userData} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} className="pr-0px">
                <Card variant="outlined" className="bg-lightgrey">
                  <CardContent>
                    <div className="">
                      <h5 className="mt-0">{t("Glucose")}</h5>
                    </div>
                    <Glucose userData={userData} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid container spacing={2} className="mt-0">
              {/* BP Chart (Only for GANDHI) */}
              {APP_LOCALE === "CC008" && (
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" className="bg-lightgrey">
                    <CardContent>
                      <div className="">
                        <h5 className="mt-0">{t("Blood Pressure")}</h5>
                      </div>
                      <BloodPressure userData={userData} />
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Height Chart (Only for GANDHI) */}
              {APP_LOCALE === "CC008" && (
                <Grid item xs={12} md={6} className="pr-0px">
                  <Card variant="outlined" className="bg-lightgrey">
                    <CardContent>
                      <div className="">
                        <h5 className="mt-0">{t("Height Trend")}</h5>
                      </div>
                      <HeightChart userData={userData} />
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>

            <Grid container spacing={2} className="mt-10px">
              {/* Weight Chart (Only for GANDHI) */}
              {APP_LOCALE === "CC008" ? (
                <Grid item xs={12} md={6} className="">
                  <Card variant="outlined" className="bg-lightgrey">
                    <CardContent>
                      <div className="">
                        <h5 className="mt-0">{t("Weight Trend")}</h5>
                      </div>
                      <WeightChart userData={userData} />
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                // Display Blood Pressure Chart for other locales
                <Grid item xs={12} md={6} className="">
                  <Card variant="outlined" className="bg-lightgrey">
                    <CardContent>
                      <div className="">
                        <h5 className="mt-0">{t("Blood Pressure")}</h5>
                      </div>
                      <BloodPressure userData={userData} />
                    </CardContent>
                  </Card>
                </Grid>
              )}



              <Grid item xs={12} md={6} className="pr-0px">
                <Card variant="outlined" className="bg-lightgrey">
                  <CardContent>
                    <div className="">
                      <h5 className="mt-0">{t("BMI Chart")}</h5>
                    </div>
                    <BMI userData={userData} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {APP_LOCALE === "CC008" && (
                // Display SMR Chart for GANDHI
                <Grid item xs={12} md={12} className="pr-0px">
                  <Card variant="outlined" className="bg-lightgrey">
                    <CardContent>
                      <div className="">
                        <h5 className="mt-0">{t("Sexual Maturity Rating Chart")}</h5>
                      </div>
                      <SMR userData={userData} />
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
            {/* 
            <Grid container spacing={2} className="mt-15px">
              <Grid item xs={12} className="pr-0px">
                <Card
                  variant="outlined"
                  className="bg-lightgrey calender-patient-section"
                >
                  <CardContent className="mb-10px">
                  <div 
                    className="flex justify-between items-center" 
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", width: "45%"}}
                  >
                    {/* Left - Title + Plus Icon */}
            {/* <div 
                      className="flex items-center space-x-2" 
                      style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <h5 className="m-0" style={{ margin: 0 }}>Appointment History</h5>
                      <button 
                        className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full"
                        style={{
                          width: "24px", height: "24px", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          backgroundColor: "green", color: "white", borderRadius: "50%", border: "none"
                        }} */}
            {/* >
                        +
                      </button>
                    </div> */}

            {/* Right - View All Link */}
            {/* <a 
                      href="#" 
                      className="text-blue-500 hover:underline text-sm"
                      style={{ color: "blue", fontSize: "14px", textDecoration: "none" }}
                      onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                      onMouseOut={(e) => e.target.style.textDecoration = "none"}
                    >
                      View All
                    </a>
                  </div>
                   <AppointmentCard 
                    name="Ashutosh Diwakar" 
                    appointmentNumber={3} 
                    date="Jan 30, 2025" 
                    time="10:30 AM" 
                  />
                  <AppointmentCard 
                    name="John Doe" 
                    appointmentNumber={3} 
                    date="Jan 30, 2025" 
                    time="10:30 AM" 
                  /> */}
            {/* </CardContent>  */}
            {/* <CardContent>
                    <div className="">
                      <h5 className="mt-0 mb-0">Appointments</h5>
                    </div>
                    <FullCalendar
                      selectable={true}
                      plugins={[dayGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
                      weekends={true}
                      events={events}
                      dayMinWidth="40px"
                      contentHeight="400"
                      scrollToTime={new Date()}
                      dayMaxEvents={0}
                      eventContent={renderEventContent}
                      themeSystem="Simplex"
                      eventTimeFormat={{
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }}
                      displayEventEnd={true}
                    />
                   <Appointments/>
             </CardContent>  */}
            {/* </Card>
              </Grid> 
            </Grid> */}
          </div>
          <div className="card-risk">
            <Card variant="outlined" className="mt-30px">
              <CardContent className="pt-100 pb-8px mt-10px">
                <Grid container spacing={2} className="pb-8px">
                  <Grid
                    item
                    xs={3}
                    className="flex-direction-column left-ley-factor"
                  >
                    <h5 className="mt-0 text-right">{t("Risk Factors")} </h5>
                    <div className="tick-img-section tick-img-left-section">
                      {riskData && Object.keys(riskData).map((key) => {
                        if (key === 'Alcohol' && riskData[key] !== '' && riskData[key] !== '0 Days') {
                          riskData[key] = 'Yes';
                        }
                        if (key === 'Celiac Disease' && riskData[key] !== '' && riskData[key] == "Screened & Positive") {
                          riskData[key] = 'Yes';
                        }
                        { console.log("complicationsData", riskData, riskData[key]) }
                        const dropExcluded = ['Celiac Disease', 'Mental Health Disorders'];
                        if (isDrop && dropExcluded.includes(key)) {
                          return null;
                        }
                        if (key !== 'indicatornames' && key !== 'Last Update') {
                          return (
                            <div className="d-flex justify-content-end align-items-center" key={key}>
                              <p>{t(key.toUpperCase())}</p>
                              <img
                                src={riskData[key] === 'Yes' ? imgUrl.tick_icon : imgUrl.wrong_icon} alt={key} />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={5}
                    className="flex-direction-column middle-key-factor"
                  >
                    <h5 className="mt-0"></h5>
                    <div>
                      <div className="">
                        <div className="border-left">
                          <div className="profile-border">
                            {/* {window?.cordova?.platformId === 'ios' ?
                              <></> :
                              <img
                                src={femaleIconUrl}
                                className="profile-img"
                              ></img>} */}
                            <img
                              // src={femaleIconUrl ? femaleIconUrl :imgUrl?.female_icon}
                              src={imgUrl?.female_icon}
                              className="profile-img"
                            ></img>
                            {/* <AccountCircleIcon className="profile-user"></AccountCircleIcon> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4} className="flex-direction-column">
                    <h5 className="mt-0">{t("Complication")}</h5>
                    <div className="tick-img-section tick-right-section">
                      {complicationsData && Object.keys(complicationsData).map((key) => {
                        if (key === 'Retinopathy' && complicationsData[key] !== '' && complicationsData[key] == 'Detected') {
                          complicationsData[key] = 'Yes';
                        }
                        let lastUpdate = complicationsData['Last Update'];
                        const dropExcluded = ['dka', 'Hyperglycemic'];
                        if (isDrop && dropExcluded.includes(key)) {
                          return null;
                        }
                        if (key !== 'indicatornames' && key !== 'Last Update' && key !== 'Hyperglycemic') {
                          return (
                            <div className="d-flex align-items-center" key={key}>
                              <img
                                src={complicationsData[key] === 'Yes' ? imgUrl.tick_icon : imgUrl.wrong_icon} alt={key} />
                              <p>{t(key.toUpperCase()) + ` (${moment(lastUpdate).format("DD.MM.YYYY")})`} </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        </CustomTabPanel>
        {/* <CustomTabPanel value={value} index={1}>
          <div className="second-tab mt-20px">
            <TreatmentRegime />
          </div>
        </CustomTabPanel> */}
        <CustomTabPanel value={value} index={1}>
          <div className="second-tab mt-20px">
            <div style={{ margin: "40px 20px" }}>
              <LabDashboard labValues={vitalFilterElements} events={examinationStageEvents} filterObject={filterObject} />
            </div>
            {/* <LabValues /> */}
          </div>
        </CustomTabPanel>
        {/* <CustomTabPanel value={value} index={3}>
          <div className="second-tab mt-20px">
            <Alerts />
          </div>
        </CustomTabPanel> */}
      </div>
    </Box>
  );
}