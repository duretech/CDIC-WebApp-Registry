import React, { useRef, useState, useEffect }  from "react";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { apiServices } from "../../services/apiServices";
import { useTranslation } from "react-i18next";


const HbA1C = (userData)=> {
  const { t, i18n } = useTranslation();
  const chartRef = useRef(null);
  const [indicatorValues, setindicatorValues] = useState([]);
  const [monthNames, setmonthNames] = useState([]);
  useEffect(() => {
    let oRequest = {
      "param1":userData?.userData?.userData?.userData?.programOwners?.[0]?.program,
      "param2":userData?.userData?.userData?.userData?.orgUnit, 
      "param3":userData?.userData?.userData?.userData?.trackedEntityInstance
    }
  apiServices.postAPI('dashboardIndicator/getPatientData/get_custom_dashboard_hba1cdetails', oRequest)
  .then((res) => {
    setindicatorValues(res?.data?.data?.map(item => parseFloat(item.indicatorvalue)));
    setmonthNames(res?.data?.data?.map(item => t(item.monthname.trim())));  
  })
  .catch((error) => {
    console.log("error",error)
  })
  }, []);
 
  const data = indicatorValues;

  // Find the index of the point with a value of 8
  const indexOfEight = data?.indexOf(8);

  // Set the marker color for the point with a value of 8 to pink
  // const seriesData = data?.map((value, index) => {
  //   const numericValue = parseFloat(value);
  // return {
  //   y: numericValue === 0 ? null : numericValue,
  //   marker: {
  //     fillColor: '#4472c4'
  //   }
  // };
  // });
  const seriesData = data?.map((value, index) => ({
  y: parseFloat(value),
  marker: {
    fillColor: index === indexOfEight ? '#4472c4' : '#4472c4'
  }
}));

  const options =  {
    title: {
      text: '',
      align: 'left',
      x: 10,
      y: 10
    },
    credits: {
        enabled: false,
   },
    xAxis: {
      categories: monthNames,
    },
    yAxis: { 
      title: {
        text: ''
      },
      labels: {
        enabled: false // Hide the labels on the y-axis
      },
      tickInterval: 3
    },
    chart: {
      zoomType: 'none',
      backgroundColor: 'transparent',
      height:'250',
      resetZoomButton: false // Disable the reset zoom button
    },
    exporting:{
      enabled:true,
  },
  legend:{
    enabled: false,
  },
    series: [{
      name: '',
      connectNulls: true,
      lineColor: '#4472c4',
      lineWidth: 5,
      data: seriesData,
      marker: {
        symbol: 'circle',
        radius: 12, // Increase the radius for big circles
        lineWidth: 3,
        lineColor: '#4472c4', // Set to null to remove the border around the circle
        states: {
          hover: {
            enabled: false
          }
        }
      },
      // Data labels to permanently display values inside the circles
      dataLabels: {
        enabled: true,
        format: '{y}', // Display the y-value inside the circle
        style: {
          color: 'white', // Black color for the text inside the circles
          textOutline: 'none', // Remove text outline for better visibility
          fontWeight: 'bold' // Make the text bold for better visibility
        },
        // Position the data labels within the markers
        align: 'center',
        verticalAlign: 'middle'
      }
    }]
  }
  useEffect(() => {
    if (!chartRef?.current) return;


  }, []);

  return (
    <div>
     <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
//   <div ref={chartRef} />

    );
}

export default HbA1C;
// ReactDOM.render(<SimpleLineChart />, document.getElementById('container'));