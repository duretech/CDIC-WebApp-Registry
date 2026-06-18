import React, { useRef, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { apiServices } from "../../services/apiServices";
import { useTranslation } from "react-i18next";

const Glucose = (userData) => {
  const { t, i18n } = useTranslation();
  const chartRef = useRef(null);
  const [randomindicatorValues, setrandomindicatorValues] = useState([]);
  const [fastingindicatorValues, setfastingindicatorValues] = useState([]);
  const [monthNames, setmonthNames] = useState([]);
  const [maxDates, setmaxDates] = useState([]);

  const staticMonths = [
    t("JANUARY"),
    t("FEBRUARY"),
    t("MARCH"),
    t("APRIL"),
    t("MAY"),
    t("JUNE"),
    t("JULY"),
    t("AUGUST"),
    t("SEPTEMBER"),
    t("OCTOBER"),
    t("NOVEMBER"),
    t("DECEMBER"),
  ];
  

  useEffect(() => {
    let oRequest = {
      param1: userData?.userData?.userData?.userData?.programOwners?.[0]?.program,
      param2: userData?.userData?.userData?.userData?.orgUnit,
      param3: userData?.userData?.userData?.userData?.trackedEntityInstance,
    };

    apiServices
      .postAPI(
        "dashboardIndicator/getPatientData/get_custom_dashboard_glucosedetails",
        oRequest
      )
      .then((res) => {
        if (!res?.data?.data || res.data.data.length === 0) {
          console.warn("API response is empty or invalid.");
          return;
        }

        const randomValuesMap = {};
        const fastingValuesMap = {};
        const months = [];

        res.data.data.forEach((item) => {
          const month = item.monthname.trim().toUpperCase();
          if (!months.includes(month)) months.push(month);

          if (item.indicatornames === "Blood glucose - Random") {
            randomValuesMap[month] = parseFloat(item.indicatorvalue) || 0;
          } else if (item.indicatornames === "Blood glucose - Fast") {
            fastingValuesMap[month] = parseFloat(item.indicatorvalue) || 0;
          }
        });

        const randomValues = [];
        const fastingValues = [];
        const orderedMonths = staticMonths.map((month) => {
          randomValues.push(randomValuesMap[month] || 0);
          fastingValues.push(fastingValuesMap[month] || 0);
          return month;
        });

        setrandomindicatorValues(randomValues);
        setfastingindicatorValues(fastingValues);
        setmonthNames(orderedMonths);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const data1 = fastingindicatorValues;
  const data2 = randomindicatorValues;

  const indexOfThree = data1.indexOf(125);
  const indexOfFour = data1.indexOf(140);
  const indexOfLthree = data2.indexOf(180);
  const indexOfLfour = data2.indexOf(165);

  const seriesData = data1.map((value, index) => ({
    y: value,
    marker: {
      fillColor: index === indexOfThree || index === indexOfFour ? "#4472c4" : "#4472c4",
    },
  }));

  const seriesData2 = data2.map((value, index) => ({
    y: parseFloat(value),
    marker: {
      fillColor: index === indexOfLthree || index === indexOfLfour ? "#ed7d31" : "#ed7d31",
    },
  }));

  const options = {
    title: {
      text: "",
      align: "left",
      x: 10,
      y: 10,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: monthNames,
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
      tickInterval: 3,
    },
    chart: {
      type: "line",
      zoomType: "none",
      resetZoomButton: false,
      backgroundColor: "transparent",
      height: "250",
    },
    exporting: {
      enabled: !window.cordova,
      menuItemDefinitions: {
        viewFullscreen: {
            text: t("View in full screen")
        },
        printChart: {
            text: t("Print Chart")
        },
        downloadPNG: {
            text: t("Download PNG image")
        },
        downloadJPEG: {
            text: t("Download JPEG image")
        },
        downloadPDF: {
            text: t("Download PDF document")
        },
        downloadSVG: {
            text: t("Download SVG vector image")
        }
      }
    },
    series: [
      {
        name: t("FASTING GLUCOSE"),
        connectNulls: true,
        color: "#4472c4",
        lineColor: "#4472c4",
        lineWidth: 5,
        data: seriesData,
        marker: {
          symbol: "circle",
          radius: 12,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
        dataLabels: {
          enabled: true,
          format: "{y}",
          style: {
            color: "white",
            textOutline: "none",
          },
          align: "center",
          verticalAlign: "middle",
        },
      },
      {
        name: t("RANDOM GLUCOSE"),
        color: "#ed7d31",
        connectNulls: true,
        lineColor: "#ed7d31",
        lineWidth: 5,
        data: seriesData2,
        marker: {
          symbol: "circle",
          radius: 14,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
        dataLabels: {
          enabled: true,
          format: "{y}",
          style: {
            color: "white",
            textOutline: "none",
          },
          align: "center",
          verticalAlign: "middle",
        },
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Glucose;
