import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";


const BloodPressureDash = (props) => {
const { t, i18n } = useTranslation();
const BPChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
const filteredBPChart = BPChart
  .filter(item => item.indicatornames.includes('Blood pressure'))
  .map(item => {
    // Split the indicatornames by '-' and take the first part
    const parts = item.indicatornames.split('-');
    return {
      counts: item.counts,
      indicatornames: t(parts[0])
    };
  });

const BPIndicatorNames = filteredBPChart.map(item => item.indicatornames);

// Predefined colors for BMI categories
const bpColors = {
    "Good control": "#8ec5d5",
    "Needs Attention": "#001c58",
    "Poor control": "#004f88",
    "Normal Range": "#00b0f0",
  };
  
  // Filtering and mapping BP-related entries
const BPData = BPChart
.filter(item => item.indicatornames.includes('Blood pressure'))
.map(item => {
  // Extract the part after 'Blood pressure' and split by space
  const indicator = item.indicatornames.split('Blood pressure ')[0].split('-')[0];
  return { y: item.counts, color: bpColors[indicator] || '#cccccc' }; // Default color if not found
});


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
        categories: BPIndicatorNames,
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
    name: t('Count'),
    data:BPData,
  }]
  };

  return <HighchartsReact highcharts={Highcharts} options={barChart1} />;
};

export default BloodPressureDash;