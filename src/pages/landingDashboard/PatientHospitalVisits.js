import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";

// Define the colors you want to use for each bar
const PatientHospitalVisits  = (props) => {
    const { t, i18n } = useTranslation();

  const hospitalVisitTypeChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
  const counts = hospitalVisitTypeChart?.map(item => item.counts);
  const indicatornames = hospitalVisitTypeChart?.map(item => t(item.indicatorname));
  const totalVisits = hospitalVisitTypeChart.reduce((sum, item) => sum + item.counts, 0); // Get total count for percentage calculation

  const colors = {
    "Emergency": "#203864",
    "OPD": "#00acb1",
    "Referral": "#ff779e"
  };

   // Map the data to the format expected by Highcharts
   const dynamicData = hospitalVisitTypeChart?.map(item => ({
    y: item.counts,
    color: colors[item.indicatorname] || "#cccccc", // Default color if not defined
    percentage: totalVisits > 0 ? ((item.counts / totalVisits) * 100).toFixed(1) : 0
  }));

  const barChart1 = {
    chart: {
        type: 'column',
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
      categories:indicatornames,
        crosshair: true,
        accessibility: {
            description: 'Visit Types'
          }
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
        legend:{
    enabled: false,
},
    credits:{
    enabled: false,
},
    plotOptions: {
        column: {
        pointWidth:40,
            pointPadding: 5,
            borderWidth: 2,  
             dataLabels: {
                enabled: true,
                formatter: function () {
                    return `<b>${this.y}</b> (${this.point.percentage}%)`; // Show count & percentage inside the bar
                },
                style: {
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: 'black'
                }
            }
        }
    },
    series: [
        {
            name: 'Visits',
            data:dynamicData
        }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={barChart1} />;
};
export default PatientHospitalVisits;