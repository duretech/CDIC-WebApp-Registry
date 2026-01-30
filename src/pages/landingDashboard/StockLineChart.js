import React, { useRef, useEffect } from "react";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";

const StockLineChart = (data) => {
  const aLineData = data?.data;
  const areaChart = {
    chart: {
      backgroundColor: null,
      height: '320',
      // width: '600'
    },
    title: {
      text: '',
      align: 'left'
    },

    yAxis: {
      title: {
        text: ''
      }
    },

    xAxis: {
      categories: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],
      accessibility: {
        rangeDescription: 'Range: Jan to Dec'
      }
    },

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    credits:{
      enabled: false,
    },
    // plotOptions: {
    //   series: {
    //     label: {
    //       connectorAllowed: false
    //     },
    //     pointStart: 'Jan'
    //   }
    // },

    series: aLineData,

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }

  };
  return <HighchartsReact
    highcharts={Highcharts}
    options={areaChart} />;
};

export default StockLineChart;