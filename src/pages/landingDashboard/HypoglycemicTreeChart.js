import React, { useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const HypoglycemicTreeChart = (props) => {
  const hypoglycemiaChart = Array.isArray(props?.homePageCharts) ? props.homePageCharts : [];
// Predefined colors for symptom categories
const symptomColors = {
    "Dizziness": "#001c58",
    "Sweating": "#004f88",
    "Extreme Hunger": "#5b9bd5",
    "Blurred Vision": "#8ec5d5",
    "Weakness": "#00a4c9",
  };

  const symptomWiseData = hypoglycemiaChart
    ?.filter(item => item.indicatorname.includes('Hypoglycemic symptoms'))
    .map(item => {
     const indicator = item.indicatorname.split('Hypoglycemic symptoms')[0].split('-')[0];
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

export default HypoglycemicTreeChart;