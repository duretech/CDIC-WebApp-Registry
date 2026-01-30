import React, { useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const HyperglycemicTreeChart = (props) => {
  const hyperglycemiaChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
// Predefined colors for symptom categories
const symptomColors = {
    "Weight loss": "#001c58",
    "Polydipsia": "#004f88",
    "Polyuria": "#0070c0",
    "Vomiting": "#00b0f0",
    "Abdominal pain": "#5b9bd5",
  };

  const symptomWiseData = hyperglycemiaChart
    ?.filter(item => item.indicatorname.includes('Hyperglycemic symptoms'))
    .map(item => {
     const indicator = item.indicatorname.split('Hyperglycemic symptoms')[0].split('-')[0];
     return {name:indicator, value: item.count, color: symptomColors[indicator] || '#cccccc' }; // Default color if not found
});

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
        data: symptomWiseData
    }],
    
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

export default HyperglycemicTreeChart;