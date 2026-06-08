import React from "react";
import Highcharts from "highcharts";

const { useRef, useEffect } = React;
 
function DeathLineChart() {
  const chartRef = useRef(null);
 
  useEffect(() => {
    if (!chartRef.current) return;
 
    const data = [2322, 3212, 2322, 3222, 2322, 3222, 1213, 3212, 2322, 5434, 1213, 3212];
 
    const firstIndexOf25 = data.indexOf(25);
 
    const secondIndexOf25 = data.indexOf(25, firstIndexOf25 + 1);
 
    const seriesData = data.map((value, index) => ({
      y: value,
      marker: {
        fillColor: index === secondIndexOf25 ? '#ff779e' : '#00acb1'
      }
    }));
 
    Highcharts.chart(chartRef.current, {
        
      title: {
        text: '',
        align: 'left',
        x: 10,
        y: 10
      },
 
            legend:{
      	enabled:false,
      },
            credits:{
      	enabled:false,
      },
      exporting: {
        enabled: !window.cordova
      },
      xAxis: {
        categories: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],
      },
      yAxis: { 
        title: {
          text: ''
        },
        labels: {
          enabled: false
        },
        tickIntervals: 5,
      },
      chart: {
        zoomType: 'none',
        resetZoomButton: false,
        backgroundColor: null,
        height:'320',
      },
 
      series: [{
        name: '',
        connectNulls: true,
        lineColor: '#ff779e',
        lineWidth: 5,
        data: seriesData,
        marker: {
          symbol: 'circle',
          radius: 15,
          states: {
            hover: {
              enabled: false
            }
          }
        },
        dataLabels: {
          enabled: true,
          format: '{y}',
          style: {
            color: 'white',
            textOutline: 'none',
            fontWeight: 'bold'
          },
          align: 'center',
          verticalAlign: 'middle'
        }
      }]
    });
  }, []);
 
  return <div ref={chartRef} />;
}
 
export default DeathLineChart;