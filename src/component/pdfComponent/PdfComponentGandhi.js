import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useTranslation, Trans } from "react-i18next";
import "../../assets/css/customstyles.css";
import imgUrl from "../../assets/images/imageUrl.js";
import "../../assets/css/theme_blue.css";
import "../../assets/css/theme_blue.css";
import { Configuration } from "../../assets/data/config.js";

import _, { valuesIn } from "lodash";

import Grid from "@material-ui/core/Grid";
import TextField from "@mui/material/TextField";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const theme = createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            fontSize: "16px",
            fontWeight: 500,
          },
        },
      },
    },
  });

function PdfComponentGandhi({
  GroupArr,
  data,
  values,
  groupStages,
  allStages,
  getTranslatedLabels,
  GetInsulinTableDetail,
  getEntityData,
  insulinTable,
}) {
  const { t, i18n } = useTranslation();
  const [structure, setStructure] = useState([]);
  const [managementData, setManagementData] = useState(false);

  let recordsAvailable = false;
  const rows = [
    {
      name: "Insulin pump",
      type: "Intermediate acting insulin",
      insulinname: "Humuline",
      frequency: "3 times a day",
      beforemeal: "Before Meal",
      course: "60",
      doses: "12-14-16",
    },
  ];

  useEffect(() => {
    console.log(insulinTable, "insulintable");
    if (GroupArr && Object.keys(GroupArr).length > 0) {
      const tempStructure = [];

      for (const key in allStages) {
        if (
          GroupArr[allStages[key].id] &&
          GroupArr[allStages[key].id].length > 0
        ) {
          if (allStages[key]?.displayName === "Management") {
            if (GroupArr[allStages[key].id].length > 0) {
              setManagementData(true);
            }
          }
          tempStructure.push(
            <Grid container className="mt-10px mb-10px" key={key}>
              <Grid item xs={12} sm={12} md={12} className="mb-10px">
                <div>
                  {allStages[key]?.displayName === "Management" &&
                  _.find(allStages[key].attributeValues, {
                    attribute: { name: "InsulinTable" },
                  })?.value === "true" ? (
                    <GetInsulinTableDetail
                      currentStage={allStages[key]}
                      currentStageData={GroupArr[allStages[key].id]}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </Grid>
            </Grid>
          );
        }
      }
      console.log(tempStructure, "temp");
      setStructure(tempStructure);
    }
  }, [GroupArr, allStages]);

  let obj = {
    displayName: "",
    age: "",
    gender: "",
    complaints: "-",
    diagnosis: "-",
    address: "",
    other: "-",
    dateAdvise: "-",
    phoneNumber: "-",
    deg: "-",
    glar: "-",
    det: "-",
    nph: "-",
    insulinRegimen: "-",
    basalDose: "-",
    bolusDose: "-",
    reg: "-",
    esp: "-",
    fia: '-',
    glu: '-',
    lis: "-",
    roa: "-"
  };
  console.log(data,"data check")
  obj.gender = data.filter((item) => item.description === "Sex at birth").length
    ? data.filter((item) => item.description === "Sex at birth")[0].value
    : "-";
    // obj.roa = data.filter((item) => item.description === "Sex at birth").length
    // ? data.filter((item) => item.description === "Sex at birth")[0].value
    // : "-";
//   obj.displayName = data.filter(
//     (item) => item.description == "Patient Name"
//   ).length
//     ? data.filter((item) => item.description == "Patient Name")[0]
//         .value
//     : "-";
const firstName = data.find((item) => item.description === "First Name")?.value || "-";
const lastName = data.find((item) => item.description === "Last Name")?.value || "";

obj.displayName = `${firstName} ${lastName}`.trim();

  obj.date = moment(new Date()).format("YYYY-MM-DD");
  obj.age = data.filter((item) => item.description === "Age").length
    ? data.filter((item) => item.description === "Age")[0].value
    : "-";
  obj.address = data.filter(
    (item) => item.description === "Patient Address"
  ).length
    ? data.filter(
        (item) => item.description === "Patient Address"
      )[0].value
    : "-";

  console.log(allStages, GroupArr, groupStages, "consoling");

  Object.keys(GroupArr).map((key) => {
    // add fields to obj here
    if(_.find(_.find(allStages, { id: key }).programStageDataElements,{ dataElement:{description:"Diagnosis based on history and examination findings"}})){
      obj.diagnosis = _.find(GroupArr[key][0].dataValues,{dataElement:_.find(_.find(allStages, { id: key }).programStageDataElements,{ dataElement:{description:"Diagnosis based on history and examination findings"}}).dataElement.id})?.value
    }

    if(_.find(_.find(allStages, { id: key }).programStageDataElements,{ dataElement:{description:"Date of Appointment"}})){
      obj.dateAdvise = _.find(GroupArr[key][0].dataValues,{dataElement:_.find(_.find(allStages, { id: key }).programStageDataElements,{ dataElement:{description:"Date of Appointment"}}).dataElement.id})?.value
    }

    if(_.find(_.find(allStages, { id: key }).programStageDataElements,{ dataElement:{description:"Chief complaint / Primary Presenting Problem "}})){
      obj.complaints = _.find(GroupArr[key][0].dataValues,{dataElement:_.find(_.find(allStages, { id: key }).programStageDataElements,{ dataElement:{description:"Chief complaint / Primary Presenting Problem "}}).dataElement.id})?.value
    }

    if(_.find(_.find(allStages, { id: key }).programStageDataElements,{ dataElement:{description:"Reason for Appointment"}})){
      obj.roa = _.find(GroupArr[key][0].dataValues,{dataElement:_.find(_.find(allStages, { id: key }).programStageDataElements,{ dataElement:{description:"Reason for Appointment"}}).dataElement.id})?.value
    }
  })
  for (const key in allStages) {
    if (
      GroupArr[allStages[key].id] &&
      GroupArr[allStages[key].id][0] &&
      GroupArr[allStages[key].id][0].dataValues
    ) {
      if (GroupArr[allStages[key].id][0].dataValues[0]) {
        console.log("GROUPARRAY", GroupArr[allStages[key].id][0].dataValues);
        if (
          GroupArr[allStages[key].id][0].dataValues.filter(
            (ele) => ele.dataElement == "l7edxK78SGn"
          ).length > 0 &&
          GroupArr[allStages[key].id][0].dataValues.filter(
            (ele) => ele.dataElement == "l7edxK78SGn"
          )[0].value=="true"
        ) {
          obj.deg = GroupArr[allStages[key].id][0].dataValues.filter(
            (ele) => ele.dataElement == "l7edxK78SGn"
          )[0].value;
          console.log("deg", obj.deg);
        }
        else{
          console.log("deg", obj.deg,  GroupArr[allStages[key].id]);
        }

        if (
          GroupArr[allStages[key].id][0].dataValues.filter(
            (ele) => ele.dataElement == "XjF0EL5Yt2Y"
          ).length > 0 &&
          GroupArr[allStages[key].id][0].dataValues.filter(
            (ele) => ele.dataElement == "XjF0EL5Yt2Y"
          )[0].value=="true"
        ) {
          obj.glar = GroupArr[allStages[key].id][0].dataValues.filter(
            (ele) => ele.dataElement == "XjF0EL5Yt2Y"
          )[0].value;
          console.log("glar", obj.glar);
        }

        if (
          GroupArr[allStages[key].id][0].dataValues.filter(
            (ele) => ele.dataElement == "Rusd4VmV9mI"
          ).length > 0 &&
          GroupArr[allStages[key].id][0].dataValues.filter(
            (ele) => ele.dataElement == "Rusd4VmV9mI"
          )[0].value=="true"
        ) {
          obj.det = GroupArr[allStages[key].id][0].dataValues.filter(
            (ele) => ele.dataElement =="Rusd4VmV9mI"
          )[0].value;
          console.log("det", obj.det);
        }

        if (
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "vXtbjBacyoG"
            ).length > 0 &&
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "vXtbjBacyoG"
            )[0].value=="true"
          ) {
            obj.nph = GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement =="vXtbjBacyoG"
            )[0].value;
            console.log("nph", obj.nph);
          }


          //basal dosage
          if (
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "PI8S3wdVAEB"
            ).length > 0 &&
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "PI8S3wdVAEB"
            )[0].value
          ) {
            obj.basalDose = GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "PI8S3wdVAEB"
            )[0].value;
            console.log("basalDose", obj.basalDose);
          }


          //bolus Dosage
          if (
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "yQRiPPSXFxv"
            ).length > 0 &&
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "yQRiPPSXFxv"
            )[0].value
          ) {
            obj.bolusDose = GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "yQRiPPSXFxv"
            )[0].value;
            console.log("bolusDose", obj.bolusDose);
          }



//bolus options

          if (
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "Ut1cI8ioSKr"
            ).length > 0 &&
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "Ut1cI8ioSKr"
            )[0].value=="true"
          ) {
            obj.reg = GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == "Ut1cI8ioSKr"
            )[0].value;
            console.log("reg", obj.reg);
          }
  
          if (
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == 
              "FoXjFkfCchN"
            ).length > 0 &&
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == 
              "FoXjFkfCchN"
            )[0].value=="true"
          ) {
            obj.esp = GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == 
              "FoXjFkfCchN"
            )[0].value;
            console.log("esp", obj.esp);
          }
  
          if (
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == 
              "uFGY7uYEznO"
            ).length > 0 &&
            GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement == 
              "uFGY7uYEznO"
            )[0].value=="true"
          ) {
            obj.fia = GroupArr[allStages[key].id][0].dataValues.filter(
              (ele) => ele.dataElement ==
              "uFGY7uYEznO"
            )[0].value;
            console.log("fia", obj.fia);
          }



  
          if (
              GroupArr[allStages[key].id][0].dataValues.filter(
                (ele) => ele.dataElement == "Hh762TfVLN0"
              ).length > 0 &&
              GroupArr[allStages[key].id][0].dataValues.filter(
                (ele) => ele.dataElement == "Hh762TfVLN0"
              )[0].value=="true"
            ) {
              obj.glu = GroupArr[allStages[key].id][0].dataValues.filter(
                (ele) => ele.dataElement =="Hh762TfVLN0"
              )[0].value;
              console.log("glu", obj.glu);
            }

            if (
                GroupArr[allStages[key].id][0].dataValues.filter(
                  (ele) => ele.dataElement == 
                  "NPh3eWrWvsa"
                ).length > 0 &&
                GroupArr[allStages[key].id][0].dataValues.filter(
                  (ele) => ele.dataElement == 
                  "NPh3eWrWvsa"
                )[0].value=="true"
              ) {
                obj.lis = GroupArr[allStages[key].id][0].dataValues.filter(
                  (ele) => ele.dataElement ==
                  "NPh3eWrWvsa"
                )[0].value;
                console.log("lis", obj.lis);
              }
      }
    }
  }
console.log("Object--->",obj)
  return (
    <div className="prescriptioninfo">
    <ThemeProvider theme={theme}>
      <Grid container spacing={2} className="prescription">
        <div className="prescipheaderdiv" id="prescriptionHeaderDiv">
          <Grid item xs={3} md={3} className="prescripheader">
            <img src={`${Configuration.baseUrl}/media/logo.png`} alt="Logo" />
          </Grid>

          <Grid item xs={9} md={9} className="headertext">
         
            <p style={{ textAlign: "center" }}>
            Gandhi Hospital  <br /> Hyderabad,Diabetes Mellitus
              </p>
          </Grid>
        </div>
      </Grid>

      <div className="presriptionform" style={{ padding: "30px" }}>
        <h3 className="notetext">Prescription note</h3>

        <Grid container spacing={2} item xs={12}>
          <Grid item xs={10} className="d-flex justify-content-end">
            <label className="datetext">Date</label>
          </Grid>
          <Grid item xs={2} className="prestextfield">
            <TextField
              id="standard-basic"
              label=""
              InputProps={{
                classes: {
                  input: "custom-input",
                },
              }}
              variant="standard"
              value={obj.date}
              placeholder={obj.date}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={0}
          item
          xs={12}
          className="presinputfields mt-30px"
        >
          <Grid item xs={2} className="prescdate">
            <label className="datetext">Patient's Name</label>
          </Grid>
          <Grid item xs={10} className="prestextfield">
            <TextField
              id="standard-basic"
              label=""
              InputProps={{
                classes: {
                  input: "custom-input",
                },
              }}
              variant="standard"
              value={obj.displayName}
              placeholder={obj.displayName}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          item
          xs={12}
          className="presinputfields mt-30px"
        >
          <Grid item xs={1} className="prescdate">
            <label className="datetext">Age</label>
          </Grid>
          <Grid item xs={1} className="prestextfield">
            <TextField
              id="standard-basic"
              label=""
              InputProps={{
                classes: {
                  input: "custom-input",
                },
              }}
              variant="standard"
              value={obj.age}
              placeholder={obj.age}
            />
          </Grid>

          <Grid item xs={1} className="prescdate">
            <label className="datetext" style={{marginLeft: "25px"}}>Gender</label>
          </Grid>
          <Grid item xs={1} className="prestextfield">
            <TextField
              id="standard-basic"
              label=""
              InputProps={{
                classes: {
                  input: "custom-input",
                },
              }}
              variant="standard"
              value={obj.gender}
            />
          </Grid>

          <Grid item xs={1} className="prescdate">
            <label className="datetext" style={{marginLeft: "2px"}}>Diagnosis</label>
          </Grid>
          <Grid item xs={7} className="prestextfield">
            <TextField
              id="standard-basic"
              label=""
              InputProps={{
                classes: {
                  input: "custom-input",
                },
              }}
              variant="standard"
              value={obj.diagnosis}
              placeholder={obj.diagnosis}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          item
          xs={12}
          className="presinputfields mt-30px"
        >
          <Grid item xs={1} className="prescdate">
            <label className="datetext">Address</label>
          </Grid>
          <Grid item xs={11} className="prestextfield">
            <TextField
              id="standard-basic"
              label=""
              InputProps={{
                classes: {
                  input: "custom-input",
                },
              }}
              variant="standard"
              value={obj.address}
              placeholder={obj.address}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          item
          xs={12}
          className="presinputfields mt-30px"
        >
          <Grid item xs={3} className="prescdate">
            <label className="datetext">Current complaints/Findings</label>
          </Grid>
          <Grid item xs={9} className="prestextfield">
            <TextField
              id="standard-basic"
              label=""
              InputProps={{
                classes: {
                  input: "custom-input",
                },
              }}
              variant="standard"
              value={obj.complaints}
            />
          </Grid>
        </Grid>

        {GroupArr && Object.keys(GroupArr).length > 0 ? (
          <Grid
            spacing={0}
            xs={12}
            lg={12}
            style={{ marginBottom: "50px" }}
            className="previous-section"
          >
            {structure}
          </Grid>
        ) : (
          <div className="no-data-message">{t("No stage data found.")}</div>
        )}

        {/* {!managementData && ( */}
          <div>
            <h3 className="insulintext">Basal Prescription</h3>
            <div className="insulintable">
              <TableContainer className="insulinbordertable">
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {/* <TableCell>Regimen Type</TableCell> */}
                      <TableCell align="right">Present Basal</TableCell>
                      <TableCell align="right">Basal Dosage</TableCell>
                     
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {obj.deg != "-" && <TableRow key={"test"}>
                    {/* <TableCell>{"test"}</TableCell> */}
                    <TableCell>{"Degludec"}</TableCell>
                    <TableCell>{obj.basalDose}</TableCell>
                </TableRow>
}               {obj.glar != "-" && 
                <TableRow key={"test1"}>
                    {/* <TableCell>{"test"}</TableCell> */}
                    <TableCell>{"Glargine"}</TableCell>
                    <TableCell>{obj.basalDose}</TableCell>
                </TableRow>
                }
                {obj.det != "-" && 
                <TableRow key={"test2"}>
                    {/* <TableCell>{"test"}</TableCell> */}
                    <TableCell>{"Detemir"}</TableCell>
                    <TableCell>{obj.basalDose}</TableCell>
                </TableRow>
                }
                 {obj.nph != "-" && 
                <TableRow key={"test3"}>
                    {/* <TableCell>{"test"}</TableCell> */}
                    <TableCell>{"NPH"}</TableCell>
                    <TableCell>{obj.basalDose}</TableCell>
                </TableRow>
}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <h3 className="insulintext">Bolus Prescription</h3>

            <div className="insulintable">
              <TableContainer
                component={Paper}
                className="mt-20px insulinbordertable"
              >
                <Table  aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {/* <TableCell>
                       Regimen Type
                      </TableCell> */}
                      <TableCell align="right">Present Bolus</TableCell>
                      <TableCell align="right">Bolus Dosage</TableCell>
                      
                    
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {obj.reg != "-" && <TableRow key={"test"}>
                    {/* <TableCell>{"test"}</TableCell> */}
                    <TableCell>{"Regular"}</TableCell>
                    <TableCell>{obj.bolusDose}</TableCell>
                </TableRow>
}               {obj.esp != "-" && 
                <TableRow key={"test1"}>
                    {/* <TableCell>{"test"}</TableCell> */}
                    <TableCell>{"Aspart"}</TableCell>
                    <TableCell>{obj.bolusDose}</TableCell>
                </TableRow>
                }
                {obj.fia != "-" && 
                <TableRow key={"test2"}>
                    {/* <TableCell>{"test"}</TableCell> */}
                    <TableCell>{"Fiasp"}</TableCell>
                    <TableCell>{obj.bolusDose}</TableCell>
                </TableRow>
                }
                 {obj.glu != "-" && 
                <TableRow key={"test3"}>
                    {/* <TableCell>{"test"}</TableCell> */}
                    <TableCell>{"Glulisine"}</TableCell>
                    <TableCell>{obj.bolusDose}</TableCell>
                </TableRow>
}
{obj.lis != "-" && 
                <TableRow key={"test3"}>
                    {/* <TableCell>{"test"}</TableCell> */}
                    <TableCell>{"Lispro"}</TableCell>
                    <TableCell>{obj.bolusDose}</TableCell>
                </TableRow>
}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        {/* )} */}

        <Grid
          container
          spacing={0}
          item
          xs={12}
          className="presinputfields mt-30px"
        >
          <Grid item xs={2} className="prescdate">
            <label className="datetext">Follow Up Date</label>
          </Grid>
          <Grid item xs={2} className="prestextfield">
            <TextField
              id="standard-basic"
              label=""
              InputProps={{
                classes: {
                  input: "custom-input",
                },
              }}
              variant="standard"
              value={obj.dateAdvise &&  obj.dateAdvise !== "-" ? moment(obj.dateAdvise).format("YYYY-MM-DD") : "-"}
              placeholder={obj.dateAdvise &&  obj.dateAdvise !== "-" ? moment(obj.dateAdvise).format("YYYY-MM-DD") : "-"}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={0}
          item
          xs={12}
          className="presinputfields mt-30px"
        >
          <Grid item xs={3} className="prescdate">
            <label className="datetext">Reason for appointment</label>
          </Grid>
          <Grid item xs={9} className="prestextfield" style={{marginLeft: "-20px"}}>
            <TextField id="standard-basic" label="" variant="standard"
         InputProps={{
            classes: {
              input: "custom-input",
            },
          }}
             
          value={obj.roa}
       
        
          />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={0}
          item
          xs={12}
          className="presinputfields mt-80px"
        >
          <Grid item xs={3} className="prestextfield doctorssignfield">
            <TextField id="standard-basic" label="" variant="standard" />
          </Grid>
          <Grid item xs={9}></Grid>
        </Grid>

        <Grid
          container
          spacing={0}
          item
          xs={12}
          className="presinputfields mt-10px"
        >
          <Grid item xs={6} className="prescdate">
            <label className="datetext doctorsign">Doctor's Signature</label>
          </Grid>
          {/* <Grid item xs={2}>
            <label className="datetext phoneno">Phone No:</label>
          </Grid>
          <Grid item xs={4} className="prestextfield">
            <TextField id="standard-basic" label="" variant="standard" />
          </Grid> */}
        </Grid>
      </div>
      </ThemeProvider>
    </div>
  );
}

export default PdfComponentGandhi;