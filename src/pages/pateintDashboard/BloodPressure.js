import React, { useRef, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { apiServices } from "../../services/apiServices";
import { useTranslation } from "react-i18next";

const BloodPressure = (userData) => {
  const { t, i18n } = useTranslation();
  const chartRef = useRef(null);
  const [systoleValues, setsystoleValues] = useState([]);
  const [diastoleValues, setdiastoleValues] = useState([]);
  const [monthNames, setmonthNames] = useState([]);

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
        "dashboardIndicator/getPatientData/get_custom_dashboard_bdpdetails",
        oRequest
      )
      .then((res) => {
        if (!res?.data?.data || res.data.data.length === 0) {
          console.warn("API response is empty or invalid.");
          return;
        }

        const systolicMap = {};
        const diastolicMap = {};
        const months = [];

        res.data.data.forEach((item) => {
          const month = item.monthname.trim().toUpperCase();
          if (!months.includes(month)) months.push(month);

          if (item.indicatornames === "Blood pressure Systole") {
            systolicMap[month] = parseInt(item.indicatorvalue) || 0;
          } else if (item.indicatornames === "Blood pressure Diastole") {
            diastolicMap[month] = parseInt(item.indicatorvalue) || 0;
          }
        });

        const systolicValues = [];
        const diastolicValues = [];
        const orderedMonths = staticMonths.map((month) => {
          systolicValues.push(systolicMap[month] || 0);
          diastolicValues.push(diastolicMap[month] || 0);
          return month;
        });

        setsystoleValues(systolicValues);
        setdiastoleValues(diastolicValues);
        setmonthNames(orderedMonths);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const options = {
    title: {
      text: "",
      align: "left",
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
      backgroundColor: "transparent",
      height: 250,
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
        name: t("SYSTOLIC PRESSURE"),
        color: "#4472c4",
        connectNulls: true,
        lineColor: "#4472c4",
        lineWidth: 5,
        data: systoleValues.map((value) => ({ y: value, marker: { radius: 14 } })),
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
        name: t("DIASTOLIC PRESSURE"),
        color: "#ed7d31",
        connectNulls: true,
        lineColor: "#ed7d31",
        lineWidth: 5,
        data: diastoleValues.map((value) => ({ y: value, marker: { radius: 14 } })),
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

export default BloodPressure;
