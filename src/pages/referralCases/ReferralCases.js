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
    const [referralList, setReferralList] = useState({});
    const [tabPanelValue, setTabPanelValue] = useState(0);
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [input, setInput] = useState('');
    const [searchAllResult,setSearchAllResult] = useState([])
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

    useEffect(() => {
        if (sessionUserBoValue != null && progarmData != null) {
            const subURL = `referral/list?ouid=${sessionUserBoValue.organisationUnits[0].id}&programid=${sessionUserBoValue.programs[0]}&pageSize=50&skipPaging=true&paging=true`;
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
                    setReferralList(response.data.data);
                    setSearchAllResult(response.data.data)
                }
                
                setGlobalSpinner(false);
            }).catch(err => {
                swal({
                    title: t("Error"),
                    text: t(err),
                    icon: "error",
                    button: "Close",
                  });
                setGlobalSpinner(false);
            });
        }

    }, [sessionUserBoValue, progarmData])

    const handleChange = (event, newValue) => {
        setTabPanelValue(newValue);
    };
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
                    <p className="alerts_profilebtn_holder">
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={()=>UpdateRecordClick(props.instanceid)}>
                            Edit Profile
                        </Button>
                    </p>
                </div>
            </Grid>
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
    return (
        <div className={classes.container}>
            <main
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }}
            >
                <section className="tutorialbg"
                    style={{
                        backgroundColor: '#fff',
                        flexGrow: 1,
                        padding: 0,
                    }}
                >
                    {/* {loading ?
                        <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
                            <CircularLoader large dataTest="dhis2-uicore-circularloader" />
                        </CenteredContent>
                        : ""
                    } */}

                    <Grid container spacing={3} className="mt-30px mb-30px">
                        <Grid item xs={12} sm={12} md={12} className="registration-page">
                            <SearchBar 
                                input={input} 
                                setKeyword={updateInput}
                            />
                            <div className={localClasses.root}>
                                <AppBar position="static" color="default" className="registrationtabs layouttabs ">
                                    <Tabs
                                        value={tabPanelValue}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons="on"
                                        indicatorColor="primary"
                                        textColor="primary"
                                        aria-label="scrollable force tabs example"
                                    >
                                        {referralList != null ?
                                        Object.entries(referralList).map(([key, val], index) => {
                                            return (<Tab label={key} {...a11yProps(index)} />)
                                        }):''}
                                    </Tabs>
                                </AppBar>
                            </div>
                        </Grid>
                        {referralList != null ?
                        Object.entries(referralList).map(([key, val], idx) => {
                            return (
                                <TabPanel value={tabPanelValue} index={idx} className="regscrolltabs layoutscrolltabs referalscrolltabs">
                                    <Grid container spacing={3}>
                                        {
                                            val.map((item, index) => {
                                                return (renderRefferalCard(item, index))
                                            })
                                        }
                                    </Grid>
                                </TabPanel>
                            )
                        }): ''}

                    </Grid>
                </section>
            </main>
        </div>
    )
};
export default ReferralCases;