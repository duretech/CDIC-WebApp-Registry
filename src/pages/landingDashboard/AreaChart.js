import React, { useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AreaChart = () => {
  const areaChart = {
    chart: {
      type: "area",
      backgroundColor: null,
      height:'320',
    },

    title: {
      text: "",
    },
    exporting: {
        enabled: !window.cordova
      },
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      tickInterval: 1, // Show all months
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        useHTML: true,
        text: "",
      },
      gridLineWidth: 0,
    },
    credits:{
        enabled: false,
      },
    plotOptions: {
      series: {
        pointStart: 0,
      },
      area: {
        stacking: "normal",
        lineColor: "#666666",
        lineWidth: 1,
        fillOpacity: 1, // Ensure full opacity
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "Index",
        data: [
          13234, 12729, 11533, 17798, 10398, 12811, 15483, 16196, 16214, 13500,
          14500, 15000,
        ],
        color: "#ff779e", // Custom color
      },
      {
        name: "Follow Up",
        data: [
          6685, 6535, 6389, 6384, 6251, 5725, 5631, 5047, 5039, 4900, 4800,
          4700,
        ],
        color: "#203864",
      },
    ],
  };

  return <HighchartsReact 
  highcharts={Highcharts} 
  options={areaChart} />;
};

export default AreaChart;
