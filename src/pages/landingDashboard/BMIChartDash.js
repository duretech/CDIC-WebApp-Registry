import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";



const BMIChartDash = (props) => {
    const { t, i18n } = useTranslation();
    const BMIChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
    const BMICategories = BMIChart.filter(item => item.indicatornames.includes("BMI"))
                             .map(item => {
                              const parts = item.indicatornames.split('-');
                              return {
                                count: item.counts,
                                indicator: t(parts[0])
                              };
                             });
                

    const BMIIndicatorNames = BMICategories.map(item => item.indicator);
    // Predefined colors for BMI categories
    const bmiColors = {
    "Good": "#8ec5d5",
    "Needs Attention": "#001c58",
    "Poor Control": "#004f88"
    };
  
  // Extract BMI related data
const BMIData = BMIChart.filter(item => item.indicatornames.includes("BMI"))
                         .map(item => {
                           const indicator = item.indicatornames.split("BMI")[0].split('-')[0];
                           return { y: item.counts, color: bmiColors[indicator]|| '#cccccc' };
                         });
// Define the colors you want to use for each bar
  const barChart1 = {
    chart: {
      type: 'bar',
      backgroundColor: null,
      height:'320',
  },
  title: {
      text: '',
      align: 'left'
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
  xAxis: {
        categories: BMIIndicatorNames,
      title: {
          text: null
      },
      gridLineWidth: 1,
      lineWidth: 0
  },
  yAxis: {
      min: 0,
      title: {
          text: '',
          align: 'high'
      },
      labels: {
          enabled: false,
      },
      gridLineWidth: 0
  },
  tooltip: {
  },
  plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          formatter: function () {
              let total = this.series.data.reduce((sum, point) => sum + point.y, 0); // Get total count
              let percentage = total > 0 ? ((this.y / total) * 100).toFixed(1) : 0; // Avoid NaN by checking total
              return `<span style="font-size:10px; font-weight:bold;">${this.y} (${percentage}%)</span>`; 
          },
          style: {
              fontWeight: 'bold',
              color: 'black',
              fontSize: '10px' 
          }
      },
          groupPadding: 0,
      }
  },
  legend: {
      enabled: false
  },
  credits: {
      enabled: false
  },
  series: [{
    name: 'Count',
      data:BMIData,
  }]
  };

  return <HighchartsReact highcharts={Highcharts} options={barChart1} />;
};

export default BMIChartDash;