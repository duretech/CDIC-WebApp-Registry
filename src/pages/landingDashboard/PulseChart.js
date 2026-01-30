import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";


const PulseChart = (props) => {
  const { t, i18n } = useTranslation();
const PulseChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
const filteredPulseChart = PulseChart
  .filter(item => item.indicatornames.includes('Blood pressure'))
  .map(item => {
    // Split the indicatornames by '-' and take the first part
    const parts = item.indicatornames.split('-');
    return {
      counts: item.counts,
      indicatornames: t(parts[0])
    };
  });

const PulseChartIndicatorNames = filteredPulseChart.map(item => t(item.indicatornames));

// Predefined colors for BMI categories
const PulseChartColors = {
    "Good control": "#8ec5d5",
    "Needs Attention": "#001c58",
    "Poor control": "#004f88",
    "Normal Range": "#00b0f0",
  };
  
  // Filtering and mapping Pulse-related entries
const PulseChartData = PulseChart
.filter(item => item.indicatornames.includes('Pulse'))
.map(item => {
  // Extract the part after 'Blood pressure' and split by space
  const indicator = item.indicatornames.split('Pulse')[0].split('-')[0];
  return { y: item.counts, color: PulseChartColors[indicator] || '#cccccc' }; // Default color if not found
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
  xAxis: {
      categories: PulseChartIndicatorNames,
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
              let percentage = total > 0 ? ((this.y / total) * 100).toFixed(1) : 0; // Avoid NaN
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
    data: PulseChartData,
  }]
  };

  return <HighchartsReact highcharts={Highcharts} options={barChart1} />;
};

export default PulseChart;