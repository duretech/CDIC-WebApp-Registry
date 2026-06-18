import React, { useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Button } from "@dhis2/ui";
import InfoIcon from '@material-ui/icons/Info';
import _ from "lodash";
import Tooltip from '@mui/material/Tooltip';
import { withTranslation, Trans, useTranslation } from "react-i18next";
import { APP_LOCALE } from '../../../src/assets/data/config.js'; 

const LineChart = (props) => {
    const { t, i18n } = useTranslation();   
    const { dashboardLineChart, selectedYear } = props; 
    const insulinChart = Array.isArray(props?.dashboardLineChart) ? props.dashboardLineChart : [];

    function getInsulinData(indicatorName, color) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return {
            name: t(indicatorName),
            data: months.map(month => {
                const found = _.find(insulinChart, { indicatornames: indicatorName, months: month });
                return found ? found.counts : 0;
            }),
            color: color
        };
    }

  const lineChart = {
    chart: {
        type: APP_LOCALE === "GANDHIO" ? "column" : "spline", // Dynamically set type
        backgroundColor: null,
        height: "320",
    },
    title: {
        text: "",
        ...(APP_LOCALE === "GANDHIO" && { align: "left" }) // Add `align: 'left'` only for GANDHI
    },
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
    xAxis: {
        categories: [
            t('Jan'), 
            t('Feb'), 
            t('Mar'), 
            t('Apr'), 
            t('May'), 
            t('Jun'),
            t('Jul'),
            t('Aug'),
            t('Sep'),
            t('Oct'),
            t('Nov'),
            t('Dec')
        ],
        accessibility: {
            description: 'Months of the year'
        }
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    tooltip: {
        crosshairs: true,
        shared: true
    },
     credits: {
      enabled: false,
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: false
            },
            dataLabels: {
                enabled: false // This will hide the data labels
            }
        }
    },
    series: APP_LOCALE === "GANDHIO"
           ?  [
      getInsulinData("DEGLUDEC", "#92C5F9"),
      getInsulinData("GLARGINE", "#AFDC8F"),
      getInsulinData("DETEMIR", "#203864"),
      getInsulinData("NPH", "#F8AE54"),
    ]
  : [
      {
        name: t("Mixed Insulin"),
        data: [
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "January" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "February" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "March" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "April" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "May" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "June" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "July" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "August" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "September" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "October" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "November" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Mixed Insulin", months: "December" })?.counts || 0,
        ],
        color: "#8F00FF",
      },
      {
        name: t("Ultra long-acting Insulin"),
        data: [
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "January" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "February" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "March" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "April" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "May" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "June" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "July" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "August" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "September" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "October" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "November" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Ultra long-acting insulin", months: "December" })?.counts || 0,
        ],
        color: "#4B0082",
      },
      {
        name: t("Long-acting Insulin"),
        data: [
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "January" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "February" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "March" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "April" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "May" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "June" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "July" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "August" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "September" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "October" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "November" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Long-acting Insulin", months: "December" })?.counts || 0,
        ],
        color: "#0000FF",
      },
      {
        name: t("Intermediate-acting Insulin"),
        data: [
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "January" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "February" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "March" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "April" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "May" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "June" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "July" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "August" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "September" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "October" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "November" })?.counts || 0,
          _.find(insulinChart, { indicatornames: "Intermediate-acting Insulin", months: "December" })?.counts || 0,
        ],
        color: "#006400",
      },
      {
        name: t('Short Acting Insulin'),
        data: 
        [
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"January"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"January"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"February"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"February"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"March"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"March"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"April"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"April"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"May"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"May"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"June"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"June"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"July"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"July"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"August"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"August"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"September"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"September"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"October"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"October"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"November"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"November"}).counts):0,
            _.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"December"})?(_.find(insulinChart,{indicatornames:"Short -acting Insulin",months:"December"}).counts):0,
          ],
        color:'#FFFF00'
    },
    {
        name: t('Ultra-Rapid acting Insulin'),
        data: 
        [
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"January"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"January"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"February"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"February"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"March"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"March"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"April"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"April"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"May"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"May"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"June"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"June"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"July"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"July"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"August"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"August"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"September"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"September"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"October"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"October"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"November"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"November"}).counts):0,
            _.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"December"})?(_.find(insulinChart,{indicatornames:"Ultra-Rapid acting insulin",months:"December"}).counts):0,
          ],
        color:'#FFA500'
    },
    {
        name: t('Rapid acting Insulin'),
        data: 
        [
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"January"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"January"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"February"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"February"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"March"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"March"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"April"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"April"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"May"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"May"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"June"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"June"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"July"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"July"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"August"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"August"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"September"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"September"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"October"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"October"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"November"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"November"}).counts):0,
            _.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"December"})?(_.find(insulinChart,{indicatornames:"Rapid -acting Insulin",months:"December"}).counts):0,
          ],
        color:'#ff0000'
    },
],
    
}
let updatedLineChartOptions = lineChart;
if (APP_LOCALE === 'KIER') {
    // Completely remove "Mixed Insulin" from the series
   
    const updatedSeries = lineChart.series.filter(series => series.name !== "Mixed Insulin");

    updatedLineChartOptions = {
        ...lineChart,
        series: updatedSeries
    };

}

  return (
    <div>
        <div className="main-second-section mb-2">            
            <div className="heading">
                <h4 className="mt-0 mb-0">{t("INSULIN MONTHLY DISTRIBUTION")} {selectedYear}</h4>
            </div>   
            <div className="main-icon">
                    <Tooltip title={t("Distribution of patients based on the type of insulin they are prescribed")}>
                        <InfoIcon className="info-icon" />
                    </Tooltip>
                {/* <Button variant="contained" className="blue-icon">%</Button>
                <Button variant="contained" className="gray-icon">#</Button> */}
            </div>                   
        </div>
        <HighchartsReact 
        highcharts={Highcharts} 
        options={updatedLineChartOptions} />  
    </div>
);
};

export default LineChart;