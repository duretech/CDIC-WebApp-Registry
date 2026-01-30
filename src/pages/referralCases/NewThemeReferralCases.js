import React, { useState, useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import classes from '../../App.module.css'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { apiServices } from '../../services/apiServices'
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from "@material-ui/core/Button";
import Box from '@material-ui/core/Box';
import { CircularLoader, CenteredContent } from '@dhis2/ui';
import swal from 'sweetalert';
import { useTranslation } from 'react-i18next';
import OfflineDb from '../../db'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import SearchBar from '../../component/searchbar/SearchBar';
import {Configuration} from '../../assets/data/config'
import _ from 'lodash';
import { useHistory } from "react-router";
import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'
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

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '30px',
    },
}));


// component start here
const ReferralCases = () => {
    const { t } = useTranslation();
    const localClasses = useStyles();

    const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null)
    const [progarmData, setProgarmData] = useState(null)
    const history = useHistory();
    const [referralList, setReferralList] = useState(null);
    const [tabPanelValue, setTabPanelValue] = useState(0);
    const [viewType, setViweType] = useState('list')
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [input, setInput] = useState('');
    const [searchAllResult,setSearchAllResult] = useState([])
    const [page, setPage] = useState(1);
    const [noOfPages,setNoOfPages] = useState(0)
    // constants for labels by uid
    const listOfFields = progarmData != null ? progarmData.programs[0].programTrackedEntityAttributes : [];
    const fieldsToDisplay = listOfFields.filter(obj => obj.displayInList == true)

    async function getMetaData() {
        let metadata = await OfflineDb.getDataFromPouchDB('metaData')
        setProgarmData(metadata.data)

        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)
    }
    useEffect(() => {
        getMetaData()
    }, [])

    useEffect(()=>{
        if(referralList != null && Configuration != null && Object.keys(referralList)){   
            try{
                setNoOfPages(Math.ceil(referralList[Object.keys(referralList)[tabPanelValue]].length / Configuration.pagination.itemsPerPage))
            }catch(e){

            }
        }
    },[referralList,Configuration,tabPanelValue])

    useEffect(() => {
        if (sessionUserBoValue != null && progarmData != null) {
            const subURL = `referral/list?ouid=${sessionUserBoValue.organisationUnits[0].id}&programid=${sessionUserBoValue.programs[0]}&pageSize=50&skipPaging=true&paging=true`;
            apiServices.getAPI(subURL).then(response => {
                if(_.isEmpty(response.data.data)) {
                      swal({
                        title: t("Success"),
                        text: t("No records found"),
                        icon: "success",
                        button: "Close",
                      })
                      .then(res => {
                          if(res) {
                            history.push('layout/home')
                          }
                      })
                }else {
                    setReferralList(response.data.data);
                    setSearchAllResult(response.data.data)
                }
                
                setGlobalSpinner(false);
            }).catch(err => {
                swal({
                    title: t("Error"),
                    text: navigator.onLine ? t(err) : t("Data could not be shown in offline mode."),
                    icon: "error",
                    button: "Close",
                  });
                setGlobalSpinner(false);
            });
        }

    }, [sessionUserBoValue, progarmData])

    const handleChange = (event, newValue) => {
        setTabPanelValue(newValue);
        try{
            setPage(1);
            setNoOfPages(Math.ceil(referralList[Object.keys(referralList)[newValue]].length / Configuration.pagination.itemsPerPage))
        }catch(e){

        }
    };
    const handlePageChange = (event, value) => {
        setPage(value);
    }
    const updateInput = (input) => {
        setInput(input);
        let filteredList = {}
        setGlobalSpinner(true)
        if(input && input.length > 3){
            
            Object.entries(searchAllResult).map(([key, val], idx) => {
                filteredList[key]=[];
                val.map(function(data, j) {
                    
                    if(data[Configuration.searchbarfielduid] && data[Configuration.searchbarfielduid].toLowerCase().indexOf(input.toLowerCase()) > -1){
                        filteredList[key].push(data)
                    }
                })
            })
            setReferralList(null);
            setTimeout(function(){
                setGlobalSpinner(false)
                setReferralList(filteredList)
            },500)
        }else{
            if(input.length == 0){
                setReferralList(null);
                setTimeout(function(){
                    setGlobalSpinner(false)
                    setReferralList(searchAllResult)
                },1000)
            }else{
                setGlobalSpinner(false)
            }
        }
    }
    const renderRefferalCard = (props) => {
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
          <CardList AccordionLabel = {labelsArr.find(x => x["Patient Name"]) ? labelsArr.find(x => x["Patient Name"])['Patient Name'] : ''} AccordionContent = {<></>} AccordionDataObject = {labelsArr} TrackEntityId = {props.instanceid} Component={'Referal'} PropsArray = {props}/>
          
          :
          <AccordianList AccordionLabel = {labelsArr.find(x => x["Patient Name"]) ? labelsArr.find(x => x["Patient Name"])['Patient Name'] : ''} AccordionContent = {<> </>} AccordionDataObject = {labelsArr} TrackEntityId = {props.instanceid} Component={'Referal'} PropsArray = {props}/>
        );
    }
    function UpdateRecordClick(instanceid) {
        setGlobalSpinner(true)
        const activeCaseDetails = {
          'trackedEntityInstance': instanceid,
          'enrollmentId': "",
        }
        const linkContact = {
          "enabled": false,
          "linkTrackedEntityInstance": instanceid
        }
        OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
        OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
        setGlobalSpinner(false)
        history.push('/layout/registration')
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
        <div className={classes.container}>
            <main
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }}
            >
                <section className="searchcustombg searchtabmaindiv referalcasespage"
                    style={{
                        backgroundColor: '#fff',
                        flexGrow: 1,
                        padding: 0,
                    }}
                >
                    <FooterMenu></FooterMenu>
                    {/* {loading ?
                        <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
                            <CircularLoader large dataTest="dhis2-uicore-circularloader" />
                        </CenteredContent>
                        : ""
                    } */}
                    {/* {referralList != null ? loadViewToggleButtons() : null} */}

                    <Grid container spacing={3} className=" mb-30px">
                        <Grid item xs={12} sm={12} md={12} className="registration-page">
                            <p></p>
                            <SearchBar 
                                input={input} 
                                setKeyword={updateInput}
                            />
                            <div className=' customregistrationtabs regcasetabs taskListFooter'>
                                <AppBar position="static">
                                    <Tabs
                                        value={tabPanelValue}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons="on"
                                        indicatorColor="primary"
                                        //textColor="primary"
                                        aria-label="scrollable force tabs example"
                                    >
                                        {referralList != null ?
                                        Object.entries(referralList).map(([key, val], index) => {
                                            return (<Tab label={t(key)} {...a11yProps(index)} />)
                                        }):''}
                                    </Tabs>
                                </AppBar>
                            </div>
                        </Grid>
                        {/* {referralList != null ?
                        Object.entries(referralList).map(([key, val], idx) => {
                            return (
                                <TabPanel value={tabPanelValue} index={idx} className="regscrolltabs layoutscrolltabs referalscrolltabs margin-top-0">
                                    <Grid container spacing={3}>
                                        {
                                            val.map((item, index) => {
                                                return (renderRefferalCard(item, index))
                                            })
                                        }
                                    </Grid>
                                </TabPanel>
                            )
                        }):""} */}
                        {referralList != null  && page  && Configuration != null?
                        Object.entries(referralList)
                        .map(([key, val], idx) => {
                            return (
                                <TabPanel value={tabPanelValue} index={idx} className="regscrolltabs layoutscrolltabs referalscrolltabs margin-top-0">
                                    <Grid container spacing={3}>
                                        {
                                            val
                                            .slice((page - 1) * Configuration.pagination.itemsPerPage, page * Configuration.pagination.itemsPerPage)
                                            .map((item, index) => {
                                                return (renderRefferalCard(item, index))
                                            })
                                        }
                                    </Grid>
                                </TabPanel>
                            )
                        }):""}
                        <div style={{marginLeft:"30px"}}>
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
                        />
                        </div>
                    </Grid>
                </section>
            </main>
        </div>
    )
};
export default ReferralCases;