import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Button } from "@dhis2/ui";
import InfoIcon from '@material-ui/icons/Info';
import _ from "lodash";
import Tooltip from "@material-ui/core/Tooltip";
import { withTranslation, Trans, useTranslation } from "react-i18next";
import OfflineDb from "../../db";
import { APP_LOCALE } from "../../assets/data/config";

const BasicTests = (props) => {
    const { t, i18n } = useTranslation();   
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
    !isDrop && t('CREATININE'),
    !isDrop && APP_LOCALE != "CC006" && t('MICROALBUMINURIA'),
    t('HBA1C'),
    t('Blood Glucose(RANDOM)'),
    t('Blood Glucose(FASTING)')
  ].filter(Boolean)
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
        },
        showInLegend: true
    },
    series: [
    {
        name: t('Good control'),
        color:"#ff779e",
        data: [
            !isDrop && {y:_.find(basicTestData,{indicatornames:"Good control-Creatinine"})?(_.find(basicTestData,{indicatornames:"Good control-Creatinine"}).counts):0, color:"#ff779e"}, 
            !isDrop && APP_LOCALE != "CC006" && {y:_.find(basicTestData,{indicatornames:"Good control-Microalbuminuria"})?(_.find(basicTestData,{indicatornames:"Good control-Microalbuminuria"}).counts):0, color:"#ff779e"}, 
            {y:_.find(basicTestData,{indicatornames:"Good control-HbA1c"})?(_.find(basicTestData,{indicatornames:"Good control-HbA1c"}).counts):0, color:"#ff779e"}, 
            {y:_.find(basicTestData,{indicatornames:"Good control-Random Blood Glucose"})?(_.find(basicTestData,{indicatornames:"Good control-Random Blood Glucose"}).counts):0, color:"#ff779e"}, 
            {y:_.find(basicTestData,{indicatornames:"Good control-Fast Blood Glucose"})?(_.find(basicTestData,{indicatornames:"Good control-Fast Blood Glucose"}).counts):0, color:"#ff779e"}
        ].filter(Boolean)
    }, {
        name: t('Poor control'),
        color:"#00acb1",
        data: [
            !isDrop && {y:_.find(basicTestData,{indicatornames:"Poor control-Creatinine"})?(_.find(basicTestData,{indicatornames:"Poor control-Creatinine"}).counts):0, color:"#00acb1"}, 
            !isDrop && APP_LOCALE != "CC006" && {y:_.find(basicTestData,{indicatornames:"Poor control-Microalbuminuria"})?(_.find(basicTestData,{indicatornames:"Poor control-Microalbuminuria"}).counts):0, color:"#00acb1"}, 
            {y:_.find(basicTestData,{indicatornames:"Poor control-HbA1c"})?(_.find(basicTestData,{indicatornames:"Poor control-HbA1c"}).counts):-0, color:"#00acb1"}, 
            {y:_.find(basicTestData,{indicatornames:"Poor control-Random Blood Glucose"})?(_.find(basicTestData,{indicatornames:"Poor control-Random Blood Glucose"}).counts):0, color:"#00acb1"}, 
            {y:_.find(basicTestData,{indicatornames:"Poor control-Fast Blood Glucose"})?(_.find(basicTestData,{indicatornames:"Poor control-Fast Blood Glucose"}).counts):0, color:"#00acb1"}
        ].filter(Boolean)
    }, {
        name: t('Needs Attention'),
        color:"#002060",
        data: [
            !isDrop && {y:_.find(basicTestData,{indicatornames:"Needs Attention-Creatinine"})?(_.find(basicTestData,{indicatornames:"Needs Attention-Creatinine"}).counts):0, color:"#002060"}, 
            !isDrop && APP_LOCALE != "CC006" && {y:_.find(basicTestData,{indicatornames:"Needs Attention-Microalbuminuria"})?(_.find(basicTestData,{indicatornames:"Needs Attention-Microalbuminuria"}).counts):0, color:"#002060"}, 
            {y:_.find(basicTestData,{indicatornames:"Needs Attention-HbA1c"})?(_.find(basicTestData,{indicatornames:"Needs Attention-HbA1c"}).counts):0, color:"#002060"}, 
            {y:_.find(basicTestData,{indicatornames:"Needs Attention-Random Blood Glucose"})?(_.find(basicTestData,{indicatornames:"Needs Attention-Random Blood Glucose"}).counts):0, color:"#002060"}, 
            {y:_.find(basicTestData,{indicatornames:"Needs Attention-Fast Blood Glucose"})?(_.find(basicTestData,{indicatornames:"Needs Attention-Fast Blood Glucose"}).counts):0, color:"#002060"}
        ].filter(Boolean)
    }]
  };

  return(
    <div>
            <div className="main-second-section mb-2">            
            <div className="heading">
                <h4 className="mt-0 mb-0"></h4>
            </div>   
            <div className="main-icon">
            <Tooltip title={t("Results of basic tests including fasting blood glucose, random blood glucose, HbA1C, microalbuminuria, and creatinine")}>
                <InfoIcon className="info-icon" />
            </Tooltip>
                {/* <Button variant="contained" className="blue-icon">%</Button>
                <Button variant="contained" className="gray-icon">#</Button> */}
            </div>                   
        </div>
        <HighchartsReact highcharts={Highcharts} options={oBasicTests} />
    </div>

);
};

export default BasicTests;