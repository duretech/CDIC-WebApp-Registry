import React, { useRef, useEffect }  from "react";
import Highcharts from 'highcharts'
import highchartsMore from "highcharts/highcharts-more.js";
import HighchartsReact from 'highcharts-react-official'
import solidGauge from "highcharts/modules/solid-gauge.js"
highchartsMore(Highcharts)
solidGauge(Highcharts)

const BMI = ()=> {
  const chartRef = useRef(null);

 
  const data = [6, null, 5, null, 7, null, 8, 6, 6.5, null, 5, 6];

  // Find the index of the point with a value of 8
  const indexOfEight = data.indexOf(8);

  // Set the marker color for the point with a value of 8 to pink
  const seriesData = data.map((value, index) => ({
    y: value,
    marker: {
      fillColor: index === indexOfEight ? '#ff779e' : '#00acb1'
    }
  }));

  const options =  {
 
    chart: {
        type: 'gauge',
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '270px', // Adjust the height of the chart container
     
      
        // width:'50%',
    },
    credits: {
        enabled: false,
   },
    title: {
        text: ''
    },
 
    pane: {
        startAngle: -90,
        endAngle: 89.9,
        background: null,
        center: ['50%', '70%'],
        size: '90%'
    },
 
    // the value axis
    yAxis: {
        min: 0,
        max: 100,
        tickPixelInterval: 72,
        tickPosition: null,
       tickColor: 'trnsparent',
        tickLength: 20,
        tickWidth: 2,
        minorTickInterval: null,
        labels: {
            
            distance: 20,
            style: {
                fontSize: '0px'
            }
        },
        lineWidth: 0,
        plotBands: [{
            from: 0,
            to: 15,
            color: '#14b34f', 
            thickness: 40
        }, {
            from: 15,
            to: 30,
            color: '#70c917',
            thickness: 40
        }, {
            from: 30,
            to: 45,
            color: '#c5e12d', 
            thickness: 40
        }, {
            from: 45,
            to: 60,
            color: '#ffbe34',
            thickness: 40
        }, {
            from: 60,
            to: 80,
            color: '#ff9233',
            thickness: 40
        }, {
            from: 80,
            to: 100,
            color: '#ff6333',
            thickness: 40
        }]
    },

    exporting:{
        enabled:false,
    },
    series: [{
        name: 'OverAll Fitness',
        data: [50],
        tooltip: {
            valueSuffix: ''
        },
        dataLabels: {
            y: -145, // Adjust the y position to place label above the gauge
            format: '{y} %',
            borderWidth: 0,
            color: (
                Highcharts.defaultOptions.title &&
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color
            ) || '#fff',
            style: {
                textShadow:false,
                fontSize: '16px'
            }
        },
        dial: {
            radius: '80%',
            backgroundColor: '#fff',
            baseWidth: 12,
            baseLength: '0%',
            rearLength: '0%'
        },
        pivot: {
            backgroundColor: '#ffd839',
            radius: 6
        }
 
    }]
 
}

//   const options =  {
//     title: {
//       text: '',
//       align: 'left',
//       x: 10,
//       y: 10
//     },
//     credits: {
//         enabled: false,
//    },
//     xAxis: {
//       categories: ['01.04.22', '01.06.22', '01.08.22', '01.10.22', '01.12.22','01.02.23','01.04.23','01.06.23','01.08.23','01.10.23','01.12.23','01.02.24'],
//     },
//     yAxis: { 
//       title: {
//         text: ''
//       },
//       labels: {
//         enabled: false // Hide the labels on the y-axis
//       },
//       tickInterval: 3
//     },
//     chart: {
//       zoomType: 'none',
//       resetZoomButton: false // Disable the reset zoom button
//     },
//     series: [{
//       name: '',
//       connectNulls: true,
//       lineColor: '#cbd196',
//       lineWidth: 5,
//       data: seriesData,
//       marker: {
//         symbol: 'circle',
//         radius: 15, // Increase the radius for big circles
//         lineWidth: 3,
//         lineColor: '#cbd196', // Set to null to remove the border around the circle
//         states: {
//           hover: {
//             enabled: false
//           }
//         }
//       },
//       // Data labels to permanently display values inside the circles
//       dataLabels: {
//         enabled: true,
//         format: '{y}', // Display the y-value inside the circle
//         style: {
//           color: 'white', // Black color for the text inside the circles
//           textOutline: 'none', // Remove text outline for better visibility
//           fontWeight: 'bold' // Make the text bold for better visibility
//         },
//         // Position the data labels within the markers
//         align: 'center',
//         verticalAlign: 'middle'
//       }
//     }]
//   }
  useEffect(() => {
    if (!chartRef.current) return;


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

export default BMI;
// ReactDOM.render(<SimpleLineChart />, document.getElementById('container'));
