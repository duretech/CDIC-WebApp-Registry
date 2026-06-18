import React, { useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";
import OfflineDb from "../../db";

const RiskFactorTreeChart = (props) => {
    const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
   
  async function getMetaData() {
    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);
  }
  React.useEffect(() => {
    getMetaData();
  }, []);

  let isDrop = sessionUserBoValue?.userRoles?.find(
      (role) => role.name === "DROP-HCP"
    );
    const { t, i18n } = useTranslation();
  const riskWiseChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
// Predefined colors for Risk categories
const riskColors = {
    "Smoking": "#001c58",
    "Celiac Disease": "#004f88",
    "Additional details": "#0070c0",
    "Mental Health Disorders": "#00b0f0",
    "Thyroid Disorder": "#00a4c9",
    "Other risks": "#8ec5d5",
  };

  const riskWiseData = riskWiseChart
    .filter(item => t(item.indiacatorname).includes('Risk Factor'))
    .map(item => {
     const indicator = item.indiacatorname.split('Risk Factor')[0].split('-')[0];
     return {name:t(indicator), value: item.count, rawName: indicator, color: riskColors[indicator] || '#cccccc' }; // Default color if not found
})
 .filter(item => {
    if (!isDrop) return true;
    const excluded = ["Mental Health Disorders", "Celiac Disease", "Thyroid Disorder", "Other risks"];
    return !excluded.includes(item.rawName);
  });

const totalCases = riskWiseData.reduce((sum, item) => sum + item.value, 0);

  const treechart = {
    chart:{
        backgroundColor: null,
    },
    colorAxis: {
        minColor: '#FFFFFF',
        backgroundColor: null,
        maxColor: Highcharts.getOptions().colors[0]
    },
    series: [{
        type: 'treemap',
        backgroundColor: null,
        layoutAlgorithm: 'squarified',
        clip: false,
        dataLabels: {
            enabled: true,
            formatter: function () {
                let percentage = totalCases > 0 ? ((this.point.value / totalCases) * 100).toFixed(1) : 0;
                return `<b>${this.point.name}</b><br/>${this.point.value} (${percentage}%)`;
            },
            style: {
                fontSize: '10px',
                fontWeight: 'bold',
                color: 'black'
            }
        },
        data: riskWiseData
    }],
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
    title: {
        text: ''
    }
,
credits:{
    enabled: false,
    },
    plotOptions: {
        treemap: {
            dataLabels: {
                style: {
                    textShadow: 'none' // Removing text shadow
                }
            }
        }
    }
}
  return <HighchartsReact 
  highcharts={Highcharts} 
  options={treechart} />;
};

export default RiskFactorTreeChart;