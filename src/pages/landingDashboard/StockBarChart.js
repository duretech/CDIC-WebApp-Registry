import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";

const StockBarChart = (data) => {
  let stockData = data?.data;
  const aData = stockData && stockData.map(item => [item.name, item.sums]);
//  const ageWiseChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];

  const barChart1 = {
    chart: {
      type: 'column',
      backgroundColor: null,
      height: '310',
      // width: '600'
    },
    credits:{
      enabled: false,
    },
    title: {
      text: ''
    },
    exporting: {
        enabled: !window.cordova
      },
    xAxis: {
      type: 'category',
      labels: {
        autoRotation: [-45, -90],
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: 'Available Quantity <b>{point.y:.1f}</b>'
    },
    series: [{
      name: 'Population',
      colors: [
        '#00acb1', '#001c58', '#8ec5d5', '#004f88', '#00b0f0', '#002060'
      ],
      colorByPoint: true,
      groupPadding: 0,
      data:  aData,
      dataLabels: {
        enabled: false,
      }
    }]
  };
  return <HighchartsReact highcharts={Highcharts} options={barChart1} />;
};


export default StockBarChart;