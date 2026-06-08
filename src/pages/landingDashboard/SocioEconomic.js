import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";

// Define the colors you want to use for each bar
const SocioEconomic  = (props) => {
  const { t, i18n } = useTranslation();
  const socioEconomicData = Array.isArray(props?.socioEconomicCharts) ? props.socioEconomicCharts : [];
  const counts = socioEconomicData?.map(item => item.counts);
  const indicatornames = socioEconomicData?.map(item => t(item[`Socio-economic class`]));

  const colors = {
    "Upper (I)": "#92C5F9",
    "Upper Middle (II)": "#AFDC8F",
    "Lower Middle (III)": "#B6A6E9",
    "Upper Lower (IV)": "#F8AE54" ,
    "Lower (V)": "#203864",
  };

  const romanOrder = {
    "I": 1,
    "II": 2,
    "III": 3,
    "IV": 4,
    "V": 5
};

socioEconomicData.sort((a, b) => {
    const aRoman = a["Socio-economic class"].match(/\(([^)]+)\)/)[1];
    const bRoman = b["Socio-economic class"].match(/\(([^)]+)\)/)[1];
    return romanOrder[aRoman] - romanOrder[bRoman];
});


    // Map the data to the format expected by Highcharts
   const dynamicData = socioEconomicData?.map(item => ({
    y: item.count,
    color: colors[item[`Socio-economic class`]] || "#cccccc" // Default color if not defined
  }));

    const barChart1 = {
    chart: {
        type: 'column',
        backgroundColor: null,
        height:400,
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
        allowDecimals: false,
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
            borderWidth: 2
        }
    },
    series: [
        {
            name: 'Number of Patients   ',
            data:dynamicData
        }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={barChart1} />;
};
export default SocioEconomic;