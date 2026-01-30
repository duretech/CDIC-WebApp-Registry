import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import imgUrl from "../../assets/images/imageUrl";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMediaQuery } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function LabValues() {

  const oBasicTests = {
    chart: {
      type: "bar",
      backgroundColor: null,
      height: "320",
    },
    title: {
      text: "",
    },
    xAxis: {
      lineColor: "#ffffff",
      tickLength: 0,
      gridLineColor: "#ffffff",
      categories: [
        "Total Cholestrol (mg/dl)",
        "LDL         Cholestrol (mg/dl)",
        "HDL Cholestrol (mg/dl)",
        "Triglyceride (mg/dl)",
      ],
      labels: {
        style: {
          whiteSpace: "normal",
          width: "80px",
          // Set a fixed width
          overflow: "visible",
        },
      },
    },
    yAxis: {
      lineColor: "#ffffff",
      tickLength: 0,
      gridLineColor: "#ffffff",
      min: 0,
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointWidth: 40,
        stacking: "percent",
        // dataLabels: {
        //     enabled: true,
        //     position: "bottom",
        //     inside: false,
        // }
      },
    },
    series: [
      {
        name: "",
        color: "#FE769D",
        data: [
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          { y: 213, color: "#FE769D" },
        ],
      },
      {
        name: "",
        color: "#CAD095",
        data: [
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
        ],
      },
      {
        name: "",
        color: "#00ABB1",
        data: [
          {
            y: 213,
            color: "#00ABB1",
            dataLabels: {
              enabled: true,
            },
          },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
        ],
      },
      {
        name: "",
        color: "#CAD095",
        data: [
          { y: 213, color: "#CAD095" },
          {
            y: 213,
            color: "#CAD095",
            dataLabels: {
              enabled: true,
            },
          },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
        ],
      },
      {
        name: "",
        color: "#FE769D",
        data: [
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
        ],
      },
    ],
  };

  const oBasicTests1 = {
    chart: {
      type: "bar",
      backgroundColor: null,
      height: "320",
    },
    title: {
      text: "",
    },
    xAxis: {
      lineColor: "#ffffff",
      tickLength: 0,
      gridLineColor: "#ffffff",
      categories: [
        "TSH (µg/ml)",
        "Free T4 (IU/ml)",
        "Thyroid Peroxidase Antibodies (IU/ml)",
      ],
      labels: {
        style: {
          whiteSpace: "normal",
          width: "80px",
          // Set a fixed width
          overflow: "visible",
        },
      },
    },
    yAxis: {
      lineColor: "#ffffff",
      tickLength: 0,
      gridLineColor: "#ffffff",
      min: 0,
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointWidth: 40,
        stacking: "percent",
        // dataLabels: {
        //     enabled: true,
        //     position: "bottom",
        //     inside: false,
        // }
      },
    },
    series: [
      {
        name: "",
        color: "#FE769D",
        data: [
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
        ],
      },
      {
        name: "",
        color: "#CAD095",
        data: [
          {
            y: 213,
            color: "#CAD095",
            dataLabels: {
              enabled: true,
            },
          },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
        ],
      },
      {
        name: "",
        color: "#00ABB1",
        data: [
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
        ],
      },
      {
        name: "",
        color: "#CAD095",
        data: [
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
        ],
      },
      {
        name: "",
        color: "#FE769D",
        data: [
          { y: 213, color: "#FE769D" },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
        ],
      },
    ],
  };

  const oBasicTests2 = {
    chart: {
      type: "bar",
      backgroundColor: null,
      height: "320",
    },
    title: {
      text: "",
    },
    xAxis: {
      lineColor: "#ffffff",
      tickLength: 0,
      gridLineColor: "#ffffff",
      categories: [
        "Blood glucose - Fasting (mg/dl))",
        "Blood glucose - Random (mg/dl)",
        "HbA1C(%)",
        "Microalbuminuria test for nephropathy (mg/dl)",
        "Creatinine (mg/dl)"
      ],
      labels: {
        style: {
          whiteSpace: "normal",
          width: "80px",
          // Set a fixed width
          overflow: "visible",
        },
      },
    },
    yAxis: {
      lineColor: "#ffffff",
      tickLength: 0,
      gridLineColor: "#ffffff",
      min: 0,
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointWidth: 40,
        stacking: "percent",
        // dataLabels: {
        //     enabled: true,
        //     position: "bottom",
        //     inside: false,
        // }
      },
    },
    series: [
      {
        name: "",
        color: "#FE769D",
        data: [
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },

        ],
      },
      {
        name: "",
        color: "#CAD095",
        data: [
          {
            y: 213,
            color: "#CAD095",
            dataLabels: {
              enabled: true,
            },
          },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },

        ],
      },
      {
        name: "",
        color: "#00ABB1",
        data: [
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
        ],
      },
      {
        name: "",
        color: "#CAD095",
        data: [
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
        ],
      },
      {
        name: "",
        color: "#FE769D",
        data: [
          { y: 213, color: "#FE769D" },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
        ],
      },
    ],
  };

  const oBasicTests3 = {
    chart: {
      type: "bar",
      backgroundColor: null,
      height: "320",
    },
    title: {
      text: "",
    },
    xAxis: {
      lineColor: "#ffffff",
      tickLength: 0,
      gridLineColor: "#ffffff",
      categories: [
        "pH",
        "Serum Bicarbonate",
        "Urine Creatinine",
        "Complete Blood Count",
        "Oral Glucose Tolerance Test",
        "Pancreatic autoantibodies",
        "C- peptide",
        "Genetic Testing"
      ],
      labels: {
        style: {
          whiteSpace: "normal",
          width: "80px",
          // Set a fixed width
          overflow: "visible",
        },
      },
    },
    yAxis: {
      lineColor: "#ffffff",
      tickLength: 0,
      gridLineColor: "#ffffff",
      min: 0,
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointWidth: 40,
        stacking: "percent",
        // dataLabels: {
        //     enabled: true,
        //     position: "bottom",
        //     inside: false,
        // }
      },
    },
    series: [
      {
        name: "",
        color: "#FE769D",
        data: [
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
          { y: 213, color: "#FE769D" },
        ],
      },
      {
        name: "",
        color: "#CAD095",
        data: [
          {
            y: 213,
            color: "#CAD095",
            dataLabels: {
              enabled: true,
            },
          },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
        ],
      },
      {
        name: "",
        color: "#00ABB1",
        data: [
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
          { y: 213, color: "#00ABB1" },
        ],
      },
      {
        name: "",
        color: "#CAD095",
        data: [
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
          { y: 213, color: "#CAD095" },
        ],
      },
      {
        name: "",
        color: "#FE769D",
        data: [
          { y: 213, color: "#FE769D" },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
          {
            y: 213,
            color: "#FE769D",
            dataLabels: {
              enabled: true,
            },
          },
        ],
      },
    ],
  };


  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Use MUI useMediaQuery hook to check for iPad resolution
  const isiPad = useMediaQuery("(max-width: 1024px)");

  // Set the orientation based on the screen size
  const orientation = isiPad ? "horizontal" : "vertical";

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
      }}
      className="treatment-tabs"
    >
      <Tabs
        // orientation="vertical"
        orientation={orientation}
        scrollButtons="auto"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        // sx={{ borderRight: 1, borderColor: "divider"  }}
        sx={{ height: 330 }}
        className="treatmentregime-tabs"
      >
        <Tab label="24.08.2023" {...a11yProps(0)} />
        <Tab label="04.07.2023" {...a11yProps(1)} />
        <Tab label="14.06.2023" {...a11yProps(2)} />
        <Tab label="22.04.2023" {...a11yProps(3)} />
        <Tab label="02.03.2023" {...a11yProps(4)} />
        <Tab label="03.03.2023" {...a11yProps(4)} />
      </Tabs>

      <div className="mx-24px w-80 treatmentregime-right-tab">
        <TabPanel value={value} index={0}>
          <div>

            {/* Basic Tests */}
            {/* <div className="main-second-section mb-2">
            <div className="labvalues_heading">
                <h5 className="mt-0 mb-0">Basic Tests</h5>
              </div>
              <div className="main-icon">
                <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button>
              </div>
            </div>
            <HighchartsReact highcharts={Highcharts} options={oBasicTests2} /> */}



            {/* Lipid Profile Test */}
            {/* <div className="main-second-section mb-2"> */}
              <div className="labvalues_heading">
                <h5 className="mt-0 mb-0">Lipid Profile Test</h5>
              </div>
              <div className="main-icon">
                {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
              </div>
            {/* </div> */}
            <HighchartsReact highcharts={Highcharts} options={oBasicTests} />


            {/*Thyroid Functioning Test  */}
            {/* <div className="main-second-section mb-2">             */}
            <div className="labvalues_heading">
              <h5 className="mt-0 mb-0">Thyroid Functioning Test</h5>
            </div>
            <div className="main-icon">
              {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
            </div>
            {/* </div> */}
            <HighchartsReact highcharts={Highcharts} options={oBasicTests1} />


            {/*Referred Tests*/}
            {/* <div className="main-second-section mb-2">            
            <div className="labvalues_heading">
              <h5 className="mt-0 mb-0">Referred Tests</h5>
            </div>
            <div className="main-icon">
              <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button>
            </div>
            </div>
            <HighchartsReact highcharts={Highcharts} options={oBasicTests3} /> */}


          </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <div>
            <div className="main-second-section mb-2">
              <div className="labvalues_heading">
                <h5 className="mt-0 mb-0">Lipid Profile Test</h5>
              </div>
              <div className="main-icon">
                {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
              </div>
            </div>
            <HighchartsReact highcharts={Highcharts} options={oBasicTests} />
            {/* <div className="main-second-section mb-2">             */}
            <div className="labvalues_heading">
              <h5 className="mt-0 mb-0">Thyroid Functioning Test</h5>
            </div>
            <div className="main-icon">
              {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
            </div>
            {/* </div> */}
            <HighchartsReact highcharts={Highcharts} options={oBasicTests1} />
          </div>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <div>
            <div className="main-second-section mb-2">
              <div className="labvalues_heading">
                <h5 className="mt-0 mb-0">Lipid Profile Test</h5>
              </div>
              <div className="main-icon">
                {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
              </div>
            </div>
            <HighchartsReact highcharts={Highcharts} options={oBasicTests} />
            {/* <div className="main-second-section mb-2">             */}
            <div className="labvalues_heading">
              <h5 className="mt-0 mb-0">Thyroid Functioning Test</h5>
            </div>
            <div className="main-icon">
              {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
            </div>
            {/* </div> */}
            <HighchartsReact highcharts={Highcharts} options={oBasicTests1} />
          </div>
        </TabPanel>

        <TabPanel value={value} index={3}>
          <div>
            <div className="main-second-section mb-2">
              <div className="labvalues_heading">
                <h5 className="mt-0 mb-0">Lipid Profile Test</h5>
              </div>
              <div className="main-icon">
                {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
              </div>
            </div>
            <HighchartsReact highcharts={Highcharts} options={oBasicTests} />
            {/* <div className="main-second-section mb-2">             */}
            <div className="labvalues_heading">
              <h5 className="mt-0 mb-0">Thyroid Functioning Test</h5>
            </div>
            <div className="main-icon">
              {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
            </div>
            {/* </div> */}
            <HighchartsReact highcharts={Highcharts} options={oBasicTests1} />
          </div>
        </TabPanel>

        <TabPanel value={value} index={4}>
          <div>
            <div className="main-second-section mb-2">
              <div className="labvalues_heading">
                <h5 className="mt-0 mb-0">Lipid Profile Test</h5>
              </div>
              <div className="main-icon">
                {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
              </div>
            </div>
            <HighchartsReact highcharts={Highcharts} options={oBasicTests} />
            {/* <div className="main-second-section mb-2">             */}
            <div className="labvalues_heading">
              <h5 className="mt-0 mb-0">Thyroid Functioning Test</h5>
            </div>
            <div className="main-icon">
              {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
            </div>
            {/* </div> */}
            <HighchartsReact highcharts={Highcharts} options={oBasicTests1} />
          </div>
        </TabPanel>

        <TabPanel value={value} index={5}>
          <div>
            <div className="main-second-section mb-2">
              <div className="labvalues_heading">
                <h5 className="mt-0 mb-0">Lipid Profile Test</h5>
              </div>
              <div className="main-icon">
                {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
              </div>
            </div>
            <HighchartsReact highcharts={Highcharts} options={oBasicTests} />
            {/* <div className="main-second-section mb-2">             */}
            <div className="labvalues_heading">
              <h5 className="mt-0 mb-0">Thyroid Functioning Test</h5>
            </div>
            <div className="main-icon">
              {/* <InfoIcon className="info-icon"></InfoIcon>
                    <Button variant="contained" className="blue-icon">%</Button>
                    <Button variant="contained" className="gray-icon">#</Button> */}
            </div>
            {/* </div> */}
            <HighchartsReact highcharts={Highcharts} options={oBasicTests1} />
          </div>
        </TabPanel>
      </div>
    </Box>
  );
}
