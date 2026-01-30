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
import { tooltip } from "leaflet";
import DataTable from "react-data-table-component";
import Table from "react-bootstrap/Table";
import AlertsTabs from "./AlertsTabs";
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

export default function Alerts() {
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
        "HBA1C Test",
        "LDL         Cholestrol Test",
        "HDL Cholestrol Test",
        "Triglyceride Test",
      ],
    },
    yAxis: {
      min: 213,
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
    tooltip: {
      valueSuffix: " days",
    },
    series: [
      {
        name: "Pending Since",
        color: "#FF6333",

        data: [
          { y: 213, color: "#FF6333" },
          {
            y: 213,
            color: "#FF6333",
            dataLabels: {
              enabled: true,
              style: {
                color: "white",
                textOutline: "none",
                fontWeight: "bold",
              },
              formatter: function () {
                return "50 Days";
              },
            },
          },
          { y: 213, color: "#FF6333" },
          { y: 213, color: "#FF6333" },
        ],
      },
      {
        name: "Pending Since",
        color: "#FFBE34",
        data: [
          { y: 213, color: "#FFBE34" },
          { y: 213, color: "#FFBE34" },
          {
            y: 213,
            color: "#FFBE34",
            dataLabels: {
              enabled: true,
              style: {
                color: "white",
                textOutline: "none",
                fontWeight: "bold",
              },
              formatter: function () {
                return "30 Days";
              },
            },
          },
          { y: 213, color: "#FFBE34" },
        ],
      },
      {
        name: "Pending Since",
        color: "#14B34F",
        data: [
          {
            y: 213,
            color: "#14B34F",
            dataLabels: {
              enabled: true,
              style: {
                color: "white",
                textOutline: "none",
                fontWeight: "bold",
              },
              formatter: function () {
                return "10 Days";
              },
            },
          },
          { y: 213, color: "#14B34F" },
          { y: 213, color: "#14B34F" },
          {
            y: 213,
            color: "#14B34F",
            dataLabels: {
              enabled: true,
              style: {
                color: "white",
                textOutline: "none",
                fontWeight: "bold",
              },
              formatter: function () {
                return "10 Days";
              },
            },
            toolti: {
              formatter: function () {
                return;
              },
            },
          },
        ],
      },
    ],
  };
  const columnHeader = [
    {
      name: "No.",
      selector: (row) => row.id,
    },
    {
      name: "Alert for",
      selector: (row) => row.alertFor,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];

  const rows = [
    {
      id: 1,
      alertFor: "	Test results have not been updated since 45 days",
      status: "red",
    },
    {
      id: 2,
      alertFor: "Need to update treatment details since 45 days	",
      status: "amber",
    },
  ];
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Use MUI useMediaQuery hook to check for iPad resolution
  const isiPad = useMediaQuery("(max-width: 1024px)");

  // Set the orientation based on the screen size
  const orientation = isiPad ? "horizontal" : "vertical";
  const tableCustomStyles = {
    headCells: {
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        paddingLeft: "2px",
        justifyContent: "left",
        color: "#000",
        backgroundColor: "#fff",
      },
    },
    columnCells: {
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        paddingLeft: " 8px",
        justifyContent: "left",
        color: "#000",
        backgroundColor: "#fff",
      },
    },
  };
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
          {/* <div className="patientalerts-table">
            <p className="table-heading">Pending Alerts</p>
            <Table hover className="table-alert">
        <thead>
            <tr>
            <th>Category</th>
            <th>Pending Since (Days)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Test results have not been updated</td>
                <td className="bg-red">45</td>
            </tr>
            <tr>
                <td>Need to update treatment details</td>
                <td className="bg-amber">15</td>
            </tr>
            <tr>
                <td>BMI values not updated</td>
                <td className="bg-green">5</td>
            </tr>
            <tr>
                <td>Lipid test results not updated</td>
                <td className="bg-amber">15</td>
            </tr>
        </tbody>
            </Table>
          <DataTable
            //title="Line List"
            // striped="true"
            responsive="true"
            // pagination
            fixedHeader="true"
            customStyles={tableCustomStyles}
            columns={columnHeader}
            //data={casesData}
            dense
            data={rows}
            />
          <</div> */}
          <AlertsTabs />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AlertsTabs />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <AlertsTabs />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <AlertsTabs />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <AlertsTabs />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <AlertsTabs />
        </TabPanel>
      </div>
    </Box>
  );
}
