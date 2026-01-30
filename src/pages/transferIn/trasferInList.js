import React, { Component, useState, useEffect } from '../../../node_modules/react'
import { withTranslation, Trans } from '../../../node_modules/react-i18next';
import OfflineDb from '../../db'
import PropTypes from 'prop-types';
import Grid from '../../../node_modules/@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from "@material-ui/core/Button";
import Box from '@material-ui/core/Box';
import classes from '../../App.module.css'
import { apiServices } from '../../services/apiServices';
//import {useHistory} from "../../../node_modules/react-router-dom";
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import SearchBar from '../../component/searchbar/SearchBar';
import {Configuration} from '../../assets/data/config'
import _ from 'lodash';
import { useHistory } from "react-router";
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next';
import FooterMenu from '../../component/layout/FooterMenu';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function TransferIn(row) {
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [progarmData,setProgarmData] = useState(null)
    const [dataSets, setDataSets] = useState(null)
    const [surveyMetaData, setSurveyMetaData] = useState(null)
    const [searchResult, setTransferInData] = useState({})
    const [input, setInput] = useState('');
    const [searchAllResult,setSearchAllResult] = useState([])
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const { t } = useTranslation();
    // constants for labels by uid
    const listOfFields = progarmData != null ? progarmData.programs[0].programTrackedEntityAttributes : [];
    const fieldsToDisplay = listOfFields.filter(obj => obj.displayInList == true)
    const history = useHistory();
    async function getMetaData(){
        let metadata = await OfflineDb.getDataFromPouchDB('metaData')
        setProgarmData(metadata.data)
        
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)
    }

    
    useEffect(()=>{
        
        getMetaData()      
    },[])

    useEffect(()=>{
        
        if(sessionUserBoValue != null){
            getCasesList()
        }
    },[sessionUserBoValue])

    function TransferRecordClick(clientBO) {
        setGlobalSpinner(true)
        
    
        /*const formDataMassaged = {}
    
        row.metaData.programs[0].programTrackedEntityAttributes.map(field => {
          const fieldId = field.trackedEntityAttribute.id
          const fieldValue = row.row[row.searchHeader.findIndex(obj => obj.name == field.trackedEntityAttribute.id)]
          
          
          formDataMassaged[fieldId]= fieldValue
        })
        */
        const activeCaseDetails = {
          'trackedEntityInstance': clientBO.instanceid,
          'enrollmentId': ""
        }
        const activeCaseFormData = {
          'formFormat': null, //formDataMassaged,
          'dhisFormat': null
        }
        const linkContact = {
          "enabled": false,
          "linkTrackedEntityInstance": clientBO.instanceid
        }
        const transfer = {
            "type": clientBO.type,
            "stageinstanceuid": clientBO.stageinstanceuid,
            "stageuid": clientBO.stageuid
          }
        OfflineDb.removeDataFromPouchDB('activeCaseDetails')
        OfflineDb.removeDataFromPouchDB('activeCaseFormData')
		OfflineDb.removeDataFromPouchDB('linkContactFlag')
        OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
        // OfflineDb.setDataIntoPouchDB('activeCaseFormData', activeCaseFormData)
        //OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
        OfflineDb.setDataIntoPouchDB('transferFlag', transfer)
        setGlobalSpinner(false)
        history.push('/layout/registration')
    }

    function getCasesList(param)  {
        
        //localStorage.removeItem('trackedEntityInstance')
        setGlobalSpinner(true)        
        let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
            programID = sessionUserBoValue.programs[0], //`nSy7PFqQykt`, 
            searchQuery = ``
        
        for (var i in param) {
            searchQuery += `&attribute=${i}:LIKE:${param[i]}`
        }
        
        let subURL = 'referral/transfer/list?ouid='+ orgID +'&programid='+ programID +'&pageSize=50&skipPaging=true&paging=true&type=transferin'
                   //'trackedEntityInstances/query.json?ou='+ orgID +'&ouMode=SELECTED&&order=created:desc&program='+ programID +'&pageSize=50&page=1&totalPages=false'
                   //&pageSize=50&page=1&totalPages=false
        apiServices.getAPI(subURL).then(response => { 
           
                if(_.isEmpty(response.data.data)) {
                    swal({
                        title: t("Success"),
                        text: t("No records found"),
                        icon: "success",
                        button: t("Close"),
                    })
                    .then(res => {
                        if(res) {
                        history.push('layout/home')
                        }
                    })
            }else {
                var resultObj = {
                    "Transfer":response.data.data
                }
                
                setTransferInData(response.data.data);
                setSearchAllResult(response.data.data)
                
            }
            setGlobalSpinner(false)
            //setTransferInData(searchArray)
            //OfflineDb.setDataIntoPouchDB('myclients',searchArray);
        }).catch(error => {
            setGlobalSpinner(false)
            swal({
                title: "Error",
                text: navigator.onLine ? error : t("Data could not be shown in offline mode."),
                icon: "error",
                button: "Close",
              });
        })
        
    }
    const updateInput = (input) => {
        setInput(input);
        let filteredList = []
        setGlobalSpinner(true)
        if(input && input.length > 3){
            Object.entries(searchAllResult).map(([key, val], idx) => {
                if(val[Configuration.searchbarfielduid] && val[Configuration.searchbarfielduid].toLowerCase().indexOf(input.toLowerCase()) > -1){
                    filteredList.push(val)
                }
            })
            setTransferInData({});
            setTimeout(function(){
                setGlobalSpinner(false)
                setTransferInData(filteredList)
            },500)
        }else{
            if(input.length == 0){
                setTransferInData({});
                setTimeout(function(){
                    setGlobalSpinner(false)
                    setTransferInData(searchAllResult)
                },1000)
            }else{
                setGlobalSpinner(false)
            }
        }
    }

    const renderTransferCard = (props) => {

        const labelsArr = [];
        
        
        fieldsToDisplay.forEach((item) => {
            let obj = {};
            if (props.hasOwnProperty(item.trackedEntityAttribute.id)) {
                
                obj[item.trackedEntityAttribute.displayName] = props[item.trackedEntityAttribute.id];
                labelsArr.push(obj);
            }
        })
        
        return (
            <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
                <div className="alertsdetailholder">
                    {
                        labelsArr.map(item => {
                            
                            for (let key in item) {
                                return (
                                    <>
                                        <p
                                            className={`${key == 'alertname' ? "alerts_title" : "alerts_description_fields"}`}
                                        >
                                            {key + ' : '}  {item[key]}
                                        </p>
                                    </>
                                )
                            }
                        })
                    }
                    <p className="alerts_profilebtn_holder hide1">
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={() => TransferRecordClick(props)}>
                        {t('Transfer In')}
              </Button>
                    </p>
                </div>
            </Grid>
        );
    }

    return (
        <section className="searchcustombg transferinpage"
                style={{
                    backgroundColor: '#fff',
                    flexGrow: 1,
                    padding: 20,
                    
                }}
        >
            <FooterMenu></FooterMenu>
            <div className="searchformcontainer pt-0">
                <p className="searchformheading">
                    <span>{t('Transfer In')}</span>
                    <SearchBar 
                        input={input} 
                        setKeyword={updateInput}
                    />
                </p>
                {
                    searchResult.length > 0  && progarmData != null?                          
                    <Grid container spacing={3} className="mt-30px mb-30px">
                        {Object.entries(searchResult).map(([key, val],idx) => {
                            
                            var res = [];
                            res.push(val)
                            return(
                                res.map((item,index)=>{
                                    return (renderTransferCard(item,index))
                                })
                            )  
                        })}
                    </Grid> : <span>{t('No Result Found')}</span>
                }
            </div>               
        </section>
    )
}

export default TransferIn