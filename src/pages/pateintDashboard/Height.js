import React, { useRef, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { apiServices } from "../../services/apiServices";
import { useTranslation } from "react-i18next";

const HeightChart = (userData) => {
  const { t, i18n } = useTranslation();
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
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
      param1: userData?.userData?.userData?.userData?.programOwners[0]?.program,
      param2: userData?.userData?.userData?.userData?.orgUnit,
      param3: userData?.userData?.userData?.userData?.trackedEntityInstance,
    };

    apiServices
      .postAPI(
        "dashboardIndicator/getPatientData/get_custom_dashboard_heightdetails",
        oRequest
      )
      .then((res) => {
        // Process data from the API
        const apiData = res?.data?.data || [];
        const formattedData = staticMonths?.map((month) => {
          const apiMonthData = apiData?.find(
            (item) => item?.monthname.trim().toUpperCase() === month
          );
          return apiMonthData
            ? parseFloat(apiMonthData.indicatorvalue) || 0
            : 0;
        });
        setChartData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const options = {
    title: {
      text: "",
      align: "left",
      x: 10,
      y: 10,
    },
    xAxis: {
      categories: staticMonths,
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
      tickInterval: 5,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    chart: {
      zoomType: "none",
      resetZoomButton: false,
      backgroundColor: "transparent",
      height: 250, // Increased height for better visualization
      type: "line",
    },
    series: [
      {
        name: "Height Data",
        connectNulls: true,
        lineColor: "#4472c4",
        lineWidth: 5,
        data: chartData,
        marker: {
          symbol: "circle",
          radius: 12,
          fillColor: '#00acb1',
          states: {
            hover: {
              enabled: false,
            },
          },
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
          headerFormat:
            '<span style="font-size:11px"><strong>{point.y} cms</strong></span><br>',
          pointFormat:
            '',
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

export default HeightChart;
