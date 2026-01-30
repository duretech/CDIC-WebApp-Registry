import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Button } from "@dhis2/ui";
import _ from "lodash";
import InfoIcon from '@material-ui/icons/Info';
import { withTranslation, Trans, useTranslation } from "react-i18next";
import Tooltip from "@material-ui/core/Tooltip";

const LipidProfile = (props) => {
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
    xAxis: {
        categories: [
            t('Total Cholestrol'), 
            t('LDL Cholestrol'), 
            t('HDL Cholestrol'), 
            t('Triglyceride')
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
        name: t('Very High'),
        color:"#9400D3",
        data: [
            {y:_.find(basicTestData,{indicatornames:"Total Cholesterol-Very High"})?(_.find(basicTestData,{indicatornames:"Total Cholesterol-Very High"}).counts):0, color:"#9400D3"}, 
            {y:_.find(basicTestData,{indicatornames:"LDL Cholesterol-Very High"})?(_.find(basicTestData,{indicatornames:"LDL Cholesterol-Very High"}).counts):0, color:"#9400D3"}, 
            {y:_.find(basicTestData,{indicatornames:"HDL Cholesterol-Very High"})?(_.find(basicTestData,{indicatornames:"HDL Cholesterol-Very High"}).counts):0, color:"#9400D3"}, 
            {y:_.find(basicTestData,{indicatornames:"Triglyceride-Very High"})?(_.find(basicTestData,{indicatornames:"Triglyceride-Very High"}).counts):0, color:"#9400D3"}, 
        ]
    },
    {
        name: t('Borderline High'),
        color:"#4B0082",
        data: [
            {y:_.find(basicTestData,{indicatornames:"Total Cholesterol-Borderline High"})?(_.find(basicTestData,{indicatornames:"Total Cholesterol-Borderline High"}).counts):0, color:"#4B0082"}, 
            {y:_.find(basicTestData,{indicatornames:"LDL Cholesterol-Borderline High"})?(_.find(basicTestData,{indicatornames:"LDL Cholesterol-Borderline High"}).counts):0, color:"#4B0082"}, 
            {y:_.find(basicTestData,{indicatornames:"HDL Cholesterol-Borderline High"})?(_.find(basicTestData,{indicatornames:"HDL Cholesterol-Borderline High"}).counts):0, color:"#4B0082"}, 
            {y:_.find(basicTestData,{indicatornames:"Triglyceride-Borderline High"})?(_.find(basicTestData,{indicatornames:"Triglyceride-Borderline High"}).counts):0, color:"#4B0082"}, 
        ]
    },
    {
        name: t('High'),
        color:"#0000FF",
        data: [
            {y:_.find(basicTestData,{indicatornames:"Total Cholesterol-High"})?(_.find(basicTestData,{indicatornames:"Total Cholesterol-High"}).counts):0, color:"#0000FF"}, 
            {y:_.find(basicTestData,{indicatornames:"LDL Cholesterol-High"})?(_.find(basicTestData,{indicatornames:"LDL Cholesterol-High"}).counts):0, color:"#0000FF"}, 
            {y:_.find(basicTestData,{indicatornames:"HDL Cholesterol-High"})?(_.find(basicTestData,{indicatornames:"HDL Cholesterol-High"}).counts):0, color:"#0000FF"}, 
            {y:_.find(basicTestData,{indicatornames:"Triglyceride-High"})?(_.find(basicTestData,{indicatornames:"Triglyceride-High"}).counts):0, color:"#0000FF"}, 
        ]
    },
    {
        name: t('Normal Range'),
        color:"#ff779e",
        data: [
            {y:_.find(basicTestData,{indicatornames:"Total Cholesterol-Normal Range"})?(_.find(basicTestData,{indicatornames:"Total Cholesterol-Normal Range"}).counts):0, color:"#ff779e"}, 
            {y:_.find(basicTestData,{indicatornames:"LDL Cholesterol-Normal Range"})?(_.find(basicTestData,{indicatornames:"LDL Cholesterol-Normal Range"}).counts):0, color:"#ff779e"}, 
            { 
                y: (
                    (_.find(basicTestData, { indicatornames: "HDL Cholesterol-Normal Range" })?.counts || 0) +
                    (_.find(basicTestData, { indicatornames: "HDL Cholesterol-Normal Range(Male)" })?.counts || 0) +
                    (_.find(basicTestData, { indicatornames: "HDL Cholesterol-Normal Range(Female)" })?.counts || 0)
                ),
                color: "#ff779e"
            }, 
            {y:_.find(basicTestData,{indicatornames:"Triglyceride-Normal Range"})?(_.find(basicTestData,{indicatornames:"Triglyceride-Normal Range"}).counts):0, color:"#ff779e"}, 
        ]
    }, {
        name: t('Near or Above Optimal'),
        color:"#00acb1",
        data: [
            {y:_.find(basicTestData,{indicatornames:"Total Cholesterol-Near or Above Optimal"})?(_.find(basicTestData,{indicatornames:"Total Cholesterol-Near or Above Optimal"}).counts):0, color:"#00acb1"}, 
            {y:_.find(basicTestData,{indicatornames:"LDL Cholesterol-Near or Above Optimal"})?(_.find(basicTestData,{indicatornames:"LDL Cholesterol-Near or Above Optimal"}).counts):0, color:"#00acb1"}, 
            {y:_.find(basicTestData,{indicatornames:"HDL Cholesterol-Near or Above Optimal"})?(_.find(basicTestData,{indicatornames:"HDL Cholesterol-Near or Above Optimal"}).counts):0, color:"#00acb1"}, 
            {y:_.find(basicTestData,{indicatornames:"Triglyceride-Near or Above Optimal"})?(_.find(basicTestData,{indicatornames:"Triglyceride-Near or Above Optimal"}).counts):0, color:"#00acb1"}, 
        ]
    },
    {
        name: t('Poor Control'),
        color:"#FF7F00",
        data: [
            {y:_.find(basicTestData,{indicatornames:"Total Cholesterol-Poor Control"})?(_.find(basicTestData,{indicatornames:"Total Cholesterol-Poor Control"}).counts):0, color:"#FF7F00"}, 
            {y:_.find(basicTestData,{indicatornames:"LDL Cholesterol-Poor Control"})?(_.find(basicTestData,{indicatornames:"LDL Cholesterol-Poor Control"}).counts):0, color:"#FF7F00"}, 
            { 
                y: (
                    (_.find(basicTestData, { indicatornames: "HDL Cholesterol-Poor Control" })?.counts || 0) +
                    (_.find(basicTestData, { indicatornames: "HDL Cholesterol-Poor Control(Male)" })?.counts || 0) +
                    (_.find(basicTestData, { indicatornames: "HDL Cholesterol-Poor Control(Female)" })?.counts || 0)
                ),
                color: "#FF7F00"
            }, 
            {y:_.find(basicTestData,{indicatornames:"Triglyceride Cholesterol-Poor Control"})?(_.find(basicTestData,{indicatornames:"Triglyceride Cholesterol-Poor Control"}).counts):0, color:"#FF7F00"}, 
        ]
    },]
  };

  return(
    <div>
        <div className="main-second-section mb-2">            
            <div className="heading">
                <h4 className="mt-0 mb-0"></h4>
            </div>   
            <div className="main-icon">
            <Tooltip title={t("Displays the count of patients tested for Total Cholesterol, LDL, HDL, and Triglycerides.")}>
                <InfoIcon className="info-icon" />
            </Tooltip>
            </div>                   
        </div>
        <HighchartsReact highcharts={Highcharts} options={oBasicTests} />
    </div>

);
};

export default LipidProfile;