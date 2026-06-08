import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";

// Define the colors you want to use for each bar
const PatientStatusBarChart  = (props) => {
  const { t, i18n } = useTranslation();
  const patientWiseChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
  const counts = patientWiseChart?.map(item => item.counts);
  const indicatornames = patientWiseChart?.map(item => t(item.indicatorname));
    
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
        enabled: !window.cordova
      },
    xAxis: {
        categories: indicatornames,
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
                align: 'low',
        },
        labels: {
        		enabled: false,
        },
        gridLineWidth: 0
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style=";padding:0">{series.name}: </td>' +
                     '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true,
                formatter: function () {
                    let totalCount = this.series.data.reduce((sum, point) => sum + point.y, 0);
                    let percentage = totalCount > 0 ? ((this.y / totalCount) * 100).toFixed(1) : 0;
                    return `<b>${this.y}</b> (${percentage}%)`; // Display count & percentage
                },
                style: {
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: 'black'
                }
            },
            color:"#00b0f0",
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
        data: counts
    }]
  };

  return <HighchartsReact highcharts={Highcharts} options={barChart1} />;
};
export default PatientStatusBarChart;