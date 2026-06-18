import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import { Button } from "@dhis2/ui";
import InfoIcon from '@material-ui/icons/Info';
import { withTranslation, Trans, useTranslation } from "react-i18next";
import Tooltip from "@material-ui/core/Tooltip";

const ThyroidProfile = (props) => {
    const { t, i18n } = useTranslation();   
const basicTestData = Array.isArray(props?.basicTestData) ? props.basicTestData : [];

  const oBasicTests = {
    chart: {
        type: 'bar',
        backgroundColor: null,
        height:'320',
    },
    title: {
        text: ''
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
            t('TSH'),
            t('Free T4'),
            t('Thyroid peroxidase antibody')
        ]
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        },
        labels: {
          enabled: false,
      },
    },
        credits: {
        enabled: false,
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'percent',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [
    {
        name: t('Above Range'),
        color:"#ff779e",
        data: [
            {y:_.find(basicTestData,{indicatornames:"TSH-Above Range"})?(_.find(basicTestData,{indicatornames:"TSH-Above Range"}).counts):0, color:"#ff779e"}, 
            {y:_.find(basicTestData,{indicatornames:"Free T4-Above Range"})?(_.find(basicTestData,{indicatornames:"Free T4-Above Range"}).counts):0, color:"#ff779e"}, 
            {y:_.find(basicTestData,{indicatornames:"Thyroid peroxidase antibody-Above Range"})?(_.find(basicTestData,{indicatornames:"Thyroid peroxidase antibody-Above Range"}).counts):0, color:"#ff779e"}, 
        ]
    }, {
        name: t('Normal Range'),
        color:"#00acb1",
        data: [
            {y:_.find(basicTestData,{indicatornames:"TSH-Normal Range"})?(_.find(basicTestData,{indicatornames:"TSH-Normal Range"}).counts):0, color:"#00acb1"}, 
            {y:_.find(basicTestData,{indicatornames:"Free T4-Normal Range"})?(_.find(basicTestData,{indicatornames:"Free T4-Normal Range"}).counts):0, color:"#00acb1"}, 
            {y:_.find(basicTestData,{indicatornames:"Thyroid peroxidase antibody-Normal Range"})?(_.find(basicTestData,{indicatornames:"Thyroid peroxidase antibody-Normal Range"}).counts):0, color:"#00acb1"}, 
        ]
    }, {
        name: t('Needs Attention'),
        color:"#002060",
        data: [
            {y:_.find(basicTestData,{indicatornames:"TSH-Needs Attention"})?(_.find(basicTestData,{indicatornames:"TSH-Needs Attention"}).counts):0, color:"#002060"}, 
            {y:_.find(basicTestData,{indicatornames:"Free T4-Needs Attention"})?(_.find(basicTestData,{indicatornames:"Free T4-Needs Attention"}).counts):0, color:"#002060"}, 
            {y:_.find(basicTestData,{indicatornames:"Thyroid peroxidase antibody-Needs Attention"})?(_.find(basicTestData,{indicatornames:"Thyroid peroxidase antibody-Needs Attention"}).counts):0, color:"#002060"}, 
        ]
    }]
  };

  return(
    <div>
            <div className="main-second-section mb-2">            
            <div className="heading">
                <h4 className="mt-0 mb-0"></h4>
            </div>   
            <div className="main-icon">
            <Tooltip title={t("Represents the count of patients tested for Free T4 and Thyroid Peroxidase Antibody.")}>
                <InfoIcon className="info-icon" />
            </Tooltip>
            </div>                   
        </div>
        <HighchartsReact highcharts={Highcharts} options={oBasicTests} />
    </div>

);
};

export default ThyroidProfile;