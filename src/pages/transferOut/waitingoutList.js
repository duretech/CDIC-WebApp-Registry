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
import SearchBar from '../../component/searchbar/SearchBar';
import {Configuration} from '../../assets/data/config'
//import {useHistory} from "../../../node_modules/react-router-dom";
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import _ from 'lodash';
import { useHistory } from "react-router";
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next';
import AccordianList from '../../component/contentList/AccordianList'
import CardList from '../../component/contentList/CardList'
import FooterMenu from '../../component/layout/FooterMenu';
import Pagination from "@material-ui/lab/Pagination";

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
function WaitingOut() {
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [progarmData,setProgarmData] = useState(null)
    const [dataSets, setDataSets] = useState(null)
    const [surveyMetaData, setSurveyMetaData] = useState(null)
    const [searchResult, setTransferInData] = useState({})
    const [input, setInput] = useState('');
    const [searchAllResult,setSearchAllResult] = useState([])
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [viewType, setViweType] = useState('list')
    const { t } = useTranslation();
    const [noOfPages, setNoOfPages] = useState(0)
    const [page, setPage] = useState(1);

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

    useEffect(() => {
        if (searchResult.length > 0 && Configuration != null) {
            setNoOfPages(Math.ceil(searchResult.length / Configuration.pagination.itemsPerPage))
        }
    }, [searchResult, Configuration])

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
          'trackedEntityInstance': clientBO.instance,
          'enrollmentId': ""
        }
        const activeCaseFormData = {
          'formFormat': null, //formDataMassaged,
          'dhisFormat': null
        }
        const linkContact = {
          "enabled": false,
          "linkTrackedEntityInstance": clientBO.instance
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
        OfflineDb.setDataIntoPouchDB('transferFlag', transfer)
        setGlobalSpinner(false)
        history.push('/layout/registration')
    }

    const handlePageChange = (event, value) => {
        setPage(value);
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
        //https://undp.imonitorplus.com//service/api/referral/transfer/list?ouid=b8A6sirZqGr&programid=i1yaRN8esOJ&pageSize=50&skipPaging=true&paging=true&type=transferin
        //let subURL = 'referral/waiting/list?ouid='+ orgID +'&programid='+ programID +'&type=waitingout'
       // apiServices.getAPI(subURL).then(response => { 

           let subURL = 'dashboardIndicator/getMedicalTherapyList'
           let params = {
            "puid":programID,
            "orguid": orgID
        }
        apiServices.postAPI(subURL, params).then(response=> {
            /*let searchArray = []
            if(res.data && res.data.length > 0){
                searchArray.push(res.data.headers)
                searchArray.push(res.data.rows)
            }*/
            if(_.isEmpty(response.data.data)) {
                swal({
                    title: t("Success"),
                    text: t("No records found"),
                    icon: "success",
                    button: t("Close"),
                })
                .then(res => {
                    if(res) {
                    //history.push('layout/home')
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
                title: t("Error"),
                text: navigator.onLine ? t("Something went wrong, please try agian later.") : t("Data could not be shown in offline mode."),
                icon: "error",
                button: t("Close"),
              });
        })
        
    }
    const updateInput = (input) => {
        setInput(input);
        let filteredList = [];
        setGlobalSpinner(true);
        if (input && input.length > 3) {
            Object.values(searchAllResult).forEach((val) => {
                Object.entries(val).forEach(([key, value]) => {
                    console.log("searchAllResult",val)
                    if (typeof value === 'string' && value.toLowerCase().includes(input.toLowerCase())) {
                        filteredList.push(val);
                    }
                });
            });
            setTransferInData({});
            setTimeout(function() {
                setGlobalSpinner(false);
                setTransferInData(filteredList);
            }, 500);
        } else {
            if (input.length === 0) {
                setTransferInData({});
                setTimeout(function() {
                    setGlobalSpinner(false);
                    setTransferInData(searchAllResult);
                }, 1000);
            } else {
                setGlobalSpinner(false);
            }
        }
    };
    const renderTransferCard = (props) => {

        const labelsArr = [];
        
        
        fieldsToDisplay.forEach((item) => {
            let obj = {};
            if (props.hasOwnProperty(item.trackedEntityAttribute.id)) {
                let fieldName = item.trackedEntityAttribute.description ? item.trackedEntityAttribute.description : item.trackedEntityAttribute.formName ? item.trackedEntityAttribute.formName : item.trackedEntityAttribute.displayName
                obj[fieldName] = props[item.trackedEntityAttribute.id];
                labelsArr.push(obj);
            }
        })
        return (
            viewType == 'card'
          ?
          <CardList AccordionLabel = {labelsArr.find(x => x['Patient Name']) ? labelsArr.find(x => x['Patient Name'])['Patient Name'] : ''} AccordionContent = {<></>} AccordionDataObject = {labelsArr} TrackEntityId = {props.instance} Component={'TransferOut'} PropsArray = {props}/>
          :
          <AccordianList AccordionLabel = {labelsArr.find(x => x['Patient Name']) ? labelsArr.find(x => x['Patient Name'])['Patient Name'] : ''} AccordionContent = {<> </>} AccordionDataObject = {labelsArr} TrackEntityId = {props.instance} Component={'TransferOut'} PropsArray = {props}/>
        
        );
    }

    const handleViewChange = (event,newValue) => {
        setViweType(newValue);
    };

    const loadViewToggleButtons = ()=>{
        return (
            <div className=" customregistrationtabs regcasetabs ">
                <AppBar position="static">
                    <Tabs value={viewType} onChange={handleViewChange}>
                        <Tab value="list" label={t('List View')}></Tab>
                        <Tab value="card" label= {t('Card View')}></Tab>
                    </Tabs>
                </AppBar>
            </div>
        )
    }

    return (
        <section className="searchcustombg transferoutpage"
                style={{
                    backgroundColor: '#fff',
                    flexGrow: 1,
                    padding: 0,
                    
                }}
        >
            <FooterMenu></FooterMenu>
            <div className="searchformcontainer pt-0">
                <p className="searchformheading">
                    <span>{t('Patients awaiting initiation of Medical Theory')}</span>
                    <SearchBar 
                        input={input} 
                        setKeyword={updateInput}
                    />
                </p>

                {/* {searchResult.length > 0  && progarmData != null ? loadViewToggleButtons() : null} */}
                
                {
                    searchResult.length > 0  && progarmData != null?
                                           
                    <Grid container spacing={3} className="mb-30px">
                        {Object.entries(searchResult)
                                .slice((page - 1) * Configuration.pagination.itemsPerPage, page * Configuration.pagination.itemsPerPage)
                                .map(([key, val],idx) => {
                            
                            var res = [];
                            res.push(val)
                            return(
                                res.map((item,index)=>{
                                    return (renderTransferCard(item,index))
                                })
                            )  
                        })}
                    </Grid> : <span style={{marginLeft:"24px"}}>{t('No Result Found')}</span>
                }
                <Pagination
                    count={noOfPages}
                    page={page}
                    onChange={handlePageChange}
                    defaultPage={1}
                    //color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    variant="outlined"
                    shape="rounded"
                    class="mb-50"
                />
            </div>               
        </section>
    )
}

export default WaitingOut