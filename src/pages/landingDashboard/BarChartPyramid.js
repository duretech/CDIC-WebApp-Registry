import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { APP_LOCALE } from "../../assets/data/config";

const BarChartPyramid = (props) => {
  const { t } = useTranslation();
  // Using the same data structure as your original component
  const diagnosesData = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
  // Define the age categories that match the image
  const existingCategories = [
    "0-1 year",
    "1-2 years",
    "2-5 years",
    "5-10 years",
    "10-25 years",
    "25 and above"
  ];

  const maleData = existingCategories.map(age => {
    const indicatorName = `${age}${APP_LOCALE === "CC011" ? " " : "-"}Male`;
    const dataPoint = _.find(diagnosesData, { indicatorname: indicatorName });
    return dataPoint ? -Math.abs(dataPoint.counts) : 0; // Negative values for males
  });

  const femaleData = existingCategories.map(age => {
    const indicatorName = `${age}${APP_LOCALE === "CC011" ? " " : "-"}Female`;
    const dataPoint = _.find(diagnosesData, { indicatorname: indicatorName });
    return dataPoint ? dataPoint.counts : 0; // Positive values for females
  });

  const chartOptions = {
    chart: {
      type: "bar",
      backgroundColor: null,
      height: 400,
      marginBottom: 80 
    },
    credits: {
      enabled: false 
    },
    exporting: {
        enabled: !window.cordova
      },
    title: {
      text: "",
      style: {
       
        fontSize: "24px",
        fontWeight: "bold"
      },
      align: "left",
      margin: 20,
      backgroundColor: "#6A3CB5",
      widthAdjust: 0,
      x: 0
    },   legend: {
      enabled: true,
    },
    xAxis: [
      { // Primary x-axis for categories
        categories: existingCategories.map(cat => t(cat)), // Use t() for translation
        reversed: false,
        labels: {
          step: 1,
          style: {
            fontSize: "12px"
          }
        },
        lineWidth: 0,
        tickWidth: 0
      },
      { // Secondary x-axis for showing "Males" and "Females" headers
        opposite: true,
        linkedTo: 0,
        categories: existingCategories,
        reversed: false,
        labels: {
          enabled: false
        },
        lineWidth: 0,
        tickWidth: 0
      }
    ],
    yAxis: {
      title: {
        text: null
      },
      labels: {
        enabled: false
      },
      gridLineWidth: 0,
      lineWidth: 0,
      // Adjust min/max based on your data range
      min: -200,
      max: 200
    },
    // legend: {
    //   enabled: false
    // },
    plotOptions: {
      series: {
        stacking: "normal",
        borderWidth: 0,
        pointWidth: 36, // Reduced point width to make room for space
        groupPadding: 0.5,
        grouping: false,
      },
      bar: {
        dataLabels: {
          enabled: true,
          formatter: function() {
            return Math.abs(this.y);
          },
          style: {
            textOutline: "none",
            fontWeight: "normal",
            fontSize: "14px"
          }
        }
      }
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.series.name}</b><br/>${this.point.category}: ${Math.abs(this.point.y)}`;
      }
    },
    series: [
      {
        name: t("Male"),
        data: maleData,
        color: "#00acb1",
        dataLabels: {
          align: "right",
          x: -10,
          style: {
            color: "#000"
          }
        }
      },
      {
        name: t("Female"),
        data: femaleData,
        color: "#ff779e",
        dataLabels: {
          align: "left",
          x: 10,
          style: {
            color: "#000"
          }
        }
      }
    ]
  };

  // Add custom header labels for Male and Female
  // const afterRender = (chart) => {
  //   if (!chart.maleLabel) {
  //     chart.maleLabel = chart.renderer.text(t("Male"), chart.plotWidth / 4, 20)
  //       .css({
  //         color: '#2B7CE9',
  //         fontSize: '16px',
  //         fontWeight: 'bold'
  //       })
  //       .add();
  //   }
    
  //   if (!chart.femaleLabel) {
  //     chart.femaleLabel = chart.renderer.text(t("Female"), chart.plotWidth * 3/4, 20)
  //       .css({
  //         color: '#C42DEF',
  //         fontSize: '16px',
  //         fontWeight: 'bold'
  //       })
  //       .add();
  //   }
  // };
  // const afterRender = (chart) => {
  //   if (chart.maleLabel) {
  //     chart.maleLabel.destroy(); // Remove previous label
  //   }
  //   if (chart.femaleLabel) {
  //     chart.femaleLabel.destroy(); // Remove previous label
  //   }
  
  //   const chartWidth = chart.plotBox.width;
  //   const chartHeight = chart.plotBox.y - 10; // Adjust the vertical position
  
  //   chart.maleLabel = chart.renderer.text(t("Male"), chartWidth * 0.25, chartHeight)
  //     .css({
  //       color: '#2B7CE9',
  //       fontSize: '16px',
  //       fontWeight: 'bold'
  //     })
  //     .add();
  
  //   chart.femaleLabel = chart.renderer.text(t("Female"), chartWidth * 0.75, chartHeight)
  //     .css({
  //       color: '#C42DEF',
  //       fontSize: '16px',
  //       fontWeight: 'bold'
  //     })
  //     .add();
  // };

  // Highcharts.addEvent(Highcharts.Chart, 'redraw', function () {
  //   afterRender(this);
  // });

  // For debugging
  return (

        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions} 
         
        />

  );
};

export default BarChartPyramid;