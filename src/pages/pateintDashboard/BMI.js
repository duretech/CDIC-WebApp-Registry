import React, { useRef, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { apiServices } from "../../services/apiServices";
import { APP_LOCALE } from '../../../src/assets/data/config.js'; 
import { useTranslation } from "react-i18next";

const BMI = (userData) => {
  const { t, i18n } = useTranslation();
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [monthNames, setMonthNames] = useState([]);
  const [maxDates, setMaxDates] = useState([]);

  // Define static months for CC008
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
    const oRequest = {
      param1: userData?.userData?.userData?.userData?.programOwners?.[0]?.program,
      param2: userData?.userData?.userData?.userData?.orgUnit,
      param3: userData?.userData?.userData?.userData?.trackedEntityInstance,
    };

    apiServices
      .postAPI(
        "dashboardIndicator/getPatientData/get_custom_dashboard_BMIdetails",
        oRequest
      )
      .then((res) => {
        const responseData = res?.data?.data || [];

        if (APP_LOCALE === "CC008") {
          // Map API response to static months order for CC008
          const mappedData = staticMonths.map((month) => {
            const apiData = responseData?.find(
              (item) => item.monthname.trim() === month
            );
            return apiData
              ? {
                  y: parseFloat(apiData?.indicatorvalue) || 0,
                  marker: { fillColor: "#00acb1" },
                  date: apiData?.maxdate,
                }
              : { y: null, marker: { fillColor: "#00acb1" }, date: "" };
          });
          setChartData(mappedData);
        } else {
          // Non-CC008 logic
          const sortedData = responseData.sort((a, b) => {
            const monthAIndex = staticMonths.indexOf(a.monthname.trim());
            const monthBIndex = staticMonths.indexOf(b.monthname.trim());
            return monthAIndex - monthBIndex;
          });

          setChartData(
            sortedData.map((item) => ({
              y: parseFloat(item.indicatorvalue) || 0, // Convert to number
              monthname: item.monthname.trim(),
              date: item.maxdate || "",
            }))
          );
          setMonthNames(sortedData.map((item) => t(item.monthname.trim())));
          setMaxDates(sortedData.map((item) => item.maxdate));
        }
      })
      .catch((error) => console.error("Error fetching BMI data:", error));
  }, []);

  // Find second occurrence of 25 in data for non-CC008
  const firstIndexOf25 = chartData.indexOf(25);
  const secondIndexOf25 = chartData.indexOf(25, firstIndexOf25 + 1);

  // Process data series
  const seriesData =
    APP_LOCALE === "CC008"
      ? chartData
      : chartData.map((value, index) => ({
          y: parseFloat(value.y),
          marker: {
            fillColor: index === secondIndexOf25 ? "#4472c4" : "#4472c4",
          },
          date: maxDates[index],
        }));

  const options = {
    title: {
      text: "",
      align: "left",
      x: 10,
      y: 10,
    },
    exporting: {
        enabled: !window.cordova
      },
    xAxis: {
      categories: APP_LOCALE === "CC008" ? staticMonths : monthNames,
    },
    yAxis: {
      title: { text: "" },
      labels: { enabled: false },
      tickInterval: 5,
    },
    credits: { enabled: false },
    legend: { enabled: false },
    chart: {
      zoomType: "none",
      resetZoomButton: false,
      backgroundColor: "transparent",
      height: APP_LOCALE === "CC008" ? 300 : 250,
      type: "line",
    },
    series: [
      {
        name: "",
        connectNulls: true,
        lineColor: "#4472c4",
        lineWidth: 5,
        data: seriesData,
        marker: {
          symbol: "circle",
          radius: 15,
          states: { hover: { enabled: false } },
        },
        dataLabels: {
          enabled: true,
          format: `{y}`,
          style: {
            color: "white",
            textOutline: "none",
            fontWeight: "bold",
          },
          align: "center",
          verticalAlign: "middle",
        },
        tooltip: {
          headerFormat: '<span style="font-size:11px"><strong>{point.y}</strong></span><br>',
          pointFormat: APP_LOCALE === "CC008" ? "" : '<span style="color:{point.lineColor}">{point.date}</span>: ',
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

export default BMI;
