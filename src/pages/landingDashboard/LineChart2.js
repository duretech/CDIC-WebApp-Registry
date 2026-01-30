import React, { useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Button } from "@dhis2/ui";
import InfoIcon from '@material-ui/icons/Info';
import _ from "lodash";
import Tooltip from '@mui/material/Tooltip';
import { withTranslation, Trans, useTranslation } from "react-i18next";


const LineChart2 = (props) => {
    const { t, i18n } = useTranslation();   
  const followUpChart = Array.isArray(props?.followUpChart) ? props.followUpChart : [];

  const lineChart = {
    chart: {
        type: 'spline',
        backgroundColor: null,
        height:'320',
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: [t('Jan'), t('Feb'), t('Mar'), t('Apr'), t('May'), t('Jun'),t('Jul'), t('Aug'), t('Sep'), t('Oct'), t('Nov'), t('Dec')],
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
    series: [{
        name: t('Registered patients'),
        data: 
        [
          _.find(followUpChart,{months:"January"})?(_.find(followUpChart,{months:"January"}).counts):0,
          _.find(followUpChart,{months:"February"})?(_.find(followUpChart,{months:"February"}).counts):0,
          _.find(followUpChart,{months:"March"})?(_.find(followUpChart,{months:"March"}).counts):0,
          _.find(followUpChart,{months:"April"})?(_.find(followUpChart,{months:"April"}).counts):0,
          _.find(followUpChart,{months:"May"})?(_.find(followUpChart,{months:"May"}).counts):0,
          _.find(followUpChart,{months:"June"})?(_.find(followUpChart,{months:"June"}).counts):0,
          _.find(followUpChart,{months:"July"})?(_.find(followUpChart,{months:"July"}).counts):0,
          _.find(followUpChart,{months:"August"})?(_.find(followUpChart,{months:"August"}).counts):0,
          _.find(followUpChart,{months:"September"})?(_.find(followUpChart,{months:"September"}).counts):0,
          _.find(followUpChart,{months:"October"})?(_.find(followUpChart,{months:"October"}).counts):0,
          _.find(followUpChart,{months:"November"})?(_.find(followUpChart,{months:"November"}).counts):0,
          _.find(followUpChart,{months:"December"})?(_.find(followUpChart,{months:"December"}).counts):0,
        ],
        color: '#002060'
    }, 
],
    
}
  return (
    <div>
        <div className="main-second-section mb-2">            
            <div className="main-icon">
                    {/* <Tooltip title="Distribution of patients based on the type of insulin they are prescribed">
                        <InfoIcon className="info-icon" />
                    </Tooltip> */}
                {/* <Button variant="contained" className="blue-icon">%</Button>
                <Button variant="contained" className="gray-icon">#</Button> */}
            </div>                   
        </div>
        <HighchartsReact 
        highcharts={Highcharts} 
        options={lineChart} />  
    </div>
);
};

export default LineChart2;