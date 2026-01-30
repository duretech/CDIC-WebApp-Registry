import React, { useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";

const ComplicationTreeChart = (props) => {
    const { t, i18n } = useTranslation();
    const complicationChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
    // Predefined colors for Complications categories
const complicationsColors = {
    "Ever diagnosed with CKD-Diabetes": "#004f88",
    "Receiving Thyrostatic agent Treatment for Basedows disease": "#5b9bd5",
    'Receiving lipid lowering agents': "#00a4c9",
    "Ever diagnosed with Retinopathy": "#00b0f0",
    'Nephropathy': "#00b0f0",
    'Retinopathy': "#001c58",
    'Neuropathy': "#8ec5d5",
    'DKA since last visit': "#0070c0",
    "Severe hypoglycemia": "#5b9bd5",
    "Hypoglycemic symptoms":"#5b9bd5",
    "Hyperglycemic symptoms":"#0070c0",
    "Ever dignosed with peripheral Neuropathy": "#0070c0",
  };

  const complicationsData = complicationChart
    .filter(item => t(item.indiacatorname).includes('Complications'))
    .map(item => {
     const indicator = t(item.indiacatorname).split('Complications')[0].split('-')[0];
     return {name:t(indicator), value: item.count, color: complicationsColors[indicator] || '#cccccc' }; // Default color if not found
});
// console.log("ComplicationTreeChart",complicationsData)


const totalCases = complicationsData.reduce((sum, item) => sum + item.value, 0);

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
     
        data:complicationsData
    }],
    title: {
        text: ''
    }
,
credits:{
    enabled: false,
    },
}
  return <HighchartsReact 
  highcharts={Highcharts} 
  options={treechart} />;
};

export default ComplicationTreeChart;