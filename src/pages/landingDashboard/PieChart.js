import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { withTranslation, Trans, useTranslation } from "react-i18next";

const PieChart = (props) => {
  const { t, i18n } = useTranslation();   
  const GenderWiseChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
  const counts = GenderWiseChart?.map(item => item.counts);

  // Calculate the total count to get the percentage
  const totalCounts = counts?.reduce((acc, count) => acc + count, 0);

  // Map the data to the format expected by Highcharts
  const dynamicData = GenderWiseChart?.map(item => ({
    name: t(item.indicatorname),
    y: Math.round((item.counts / totalCounts) * 100),
    value: item.counts,  // Add the actual count as a value attribute
    // Add colors based on the name, you can customize as needed
    color: item.indicatorname === 'Male' ? "#00acb1" :
           item.indicatorname === 'Female' ? "#ff779e" :
           "#002060" // Default color for others
  }));

  const piechart1 = {
    chart: {
      type: "pie",
      backgroundColor: null,
      height: '400',
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
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: '{point.y}% ({point.value})',
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: window.cordova ? false : true,
          format: '<b>{point.name}</b>: {point.y}% ({point.value})',
          connectorColor: 'silver',
          color: 'black'
        },
        showInLegend: true
      }
    },
    series: [
      {
        name: "Percentage",
        colorByPoint: true,
        data: dynamicData,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={piechart1} />;
};


export default PieChart;