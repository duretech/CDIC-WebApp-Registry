import React, { useState,useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import classes from '../../App.module.css'
import { makeStyles } from '@material-ui/core/styles';
import { apiServices } from '../../services/apiServices'
import SearchBar from '../../component/searchbar/SearchBar';
import CaseList from './NewThemeCaseList'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Pagination from "@material-ui/lab/Pagination";
import Grid from '@material-ui/core/Grid';
import AccordianList from '../../component/contentList/AccordianList'
import CardList from '../../component/contentList/CardList'
import {
    Button, 
    ButtonStrip,
    Divider,
    InputFieldFF, 
    SingleSelectFieldFF, 
    ReactFinalForm,
    hasValue,
    InputField,
    CircularLoader,
    CenteredContent
} from '@dhis2/ui';
import { withTranslation, Trans , useTranslation } from 'react-i18next';
import swal from 'sweetalert'
import OfflineDb from '../../db'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
//import {Configuration} from '../../assets/data/config'
import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'
import _ from "lodash"
import FooterMenu from '../../component/layout/FooterMenu'

const {Form, Field } = ReactFinalForm

function Followup(){
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [progarmData,setProgarmData] = useState(null)
    const [customSearch,setCustomSearch] = useState([])
    const [UICSearch,setUICSearch] = useState([])
    const [input, setInput] = useState('');
    const [searchResult,setSearchResult] = useState([])
    const [searchAllResult,setSearchAllResult] = useState([])
    const [value,setValue] = useState([])
    // const [loading,setGlobalSpinner] = useState(false)
    const {t} = useTranslation()
    const [viewType, setViweType] = useState('list')
    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    //pagination code
    //const itemsPerPage = Configuration.pagination.itemsPerPage
    const [page, setPage] = useState(1);
    const [noOfPages,setNoOfPages] = useState(0)
    const [Configuration,setConfiguration] = useState(null);
    const [currentVisitStageId,setCurrentVisitStageId] = useState(null);

    const listOfFields = progarmData != null ? progarmData.programs[0].programTrackedEntityAttributes : [];
    const fieldsToDisplay = listOfFields.filter(obj => obj.displayInList == true)

    async function getMetaData(){
        let metadata = await OfflineDb.getDataFromPouchDB('metaData')
        setProgarmData(metadata.data)
        
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)

        let configurations = await OfflineDb.getDataFromPouchDB('configurations')
        setConfiguration(configurations.data.configuration)
    }

    const getCustomVariableIds = () => {
        try {
            progarmData.programs[0].programStages.map((stage) => {
                let stageName = stage.description
                ? stage.description
                : stage.displayName;

                if (stageName.trim() == "Examination") {
                    setCurrentVisitStageId(stage.id);
                }
            });
        } catch (e) {}
    };

    useEffect(()=>{
        getMetaData()      
        OfflineDb.removeDataFromPouchDB('activeCaseDetails')
        OfflineDb.removeDataFromPouchDB('activeCaseFormData')
        OfflineDb.removeDataFromPouchDB('linkContactFlag')
        OfflineDb.setDataIntoPouchDB('transferFlag', {type:null})
    },[])

    useEffect(() => {
        if (progarmData != null) {
          getCustomVariableIds();
        }
    }, [progarmData]);
    
    //once user bco is set call getContactList function
    useEffect(()=>{
        if(sessionUserBoValue != null && Configuration != null){
            getCasesList()
        }
    },[sessionUserBoValue, Configuration])
    useEffect(()=>{
        if(searchResult && searchResult.length > 0 && Configuration != null){
            if(searchResult[1] && searchResult[1].length>0)
            {
                setNoOfPages(Math.ceil(searchResult[1].length / Configuration.pagination.itemsPerPage))
            }
        }
    },[searchResult,Configuration])

    function stageAccessCheck(stageUID) {
        const stages = progarmData?.programs?.[0]?.programStages.find(
        (stage) => stage.id === stageUID
        );
        const userList = stages.userAccesses;
        const userGroups = stages.userGroupAccesses;
        let stageAcsess = false;
        const getUSerBo = sessionUserBoValue;
        const userGroupID =
        getUSerBo.userGroups && getUSerBo.userGroups.length > 0
            ? getUSerBo.userGroups[0].id
            : getUSerBo.id;
        const filterUserIdInMeta =
        userList && userList.length > 0
            ? userList.filter((obj) => obj.id == getUSerBo.id)
            : [];
        const filterUserGroupInMeta =
        userGroups && userGroups.length > 0
            ? userGroups.filter((obj) => obj.id == userGroupID)
            : [];
        if (filterUserIdInMeta.length > 0) {
        const filteredUserList = filterUserIdInMeta[0].access;
        if (filteredUserList == "rw------" || filteredUserList == "rwrw----") {
            stageAcsess = true;
        }
        } else if (filterUserGroupInMeta.length > 0) {
        const filteredUserList = filterUserGroupInMeta[0].access;
        if (filteredUserList == "rw------" || filteredUserList == "rwrw----") {
            stageAcsess = true;
        }
        }
        return stageAcsess;
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
        
        // let subURL = 'trackedEntityInstances/query.json?ou='+ orgID +'&ouMode=SELECTED&program='+ programID +'&pageSize='+Configuration.pagination.fetchNoOfRecords+'&page=1&totalPages=false&skipPaging=true'
                   //'trackedEntityInstances/query.json?ou='+ orgID +'&ouMode=SELECTED&&order=created:desc&program='+ programID +'&pageSize=50&page=1&totalPages=false'
                   //&pageSize=50&page=1&totalPages=false
        let subURL = 'indicators/getFollowupList'
        let  payload = {
            puid:programID,
            orguid:orgID}
        


        apiServices.postAPI(subURL,payload)
        .then(response => {
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
                setSearchResult(response.data.data);
                setSearchAllResult(response.data.data)
                
            }
            setGlobalSpinner(false)
        }).catch(error => {
            setGlobalSpinner(false)
            swal({
                title: "Error",
                text: navigator.onLine ? t("Sorry, something went wrong.") : t("Client list could not be shown in offline mode."),
                icon: "error",
                button: "Close",
              });
        })
        
    }

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
        if(props.hasOwnProperty('followupdate') ) {
            let obj = {};
            obj['followupdate'] = props.followupdate;
            labelsArr.push(obj);
        }
        const firstName = labelsArr.find(x => x['First Name'])?.['First Name'] || '';
        const followupDate = labelsArr.find(x => x['followupdate'])?.['followupdate'] || '';
        // const accordionLabel = firstName + (followupDate ? ` - Follow up Date: ${followupDate}` : '');
        const accordionLabel = firstName;

        return (
            viewType == 'card'?
          <CardList 
          AccordionLabel = {labelsArr.find(x => x['First Name']) ? labelsArr.find(x => x['First Name'])['First Name'] : ''} 
          AccordionContent = {<></>} 
          AccordionDataObject = {labelsArr} 
          TrackEntityId = {props.instanceuid} 
          Component={'TransferOut'} 
          PropsArray = {props}/>
          :
          <AccordianList 
        //   AccordionLabel = {labelsArr.find(x => x['First Name']) ? labelsArr.find(x => x['First Name'])['First Name'] : ''} 
          AccordionLabel = {accordionLabel} 
          AccordionContent = {<> </>} 
          AccordionDataObject = {labelsArr} 
          TrackEntityId = {props.instanceuid} 
          Component={'FollowUp'} 
          PropsArray = {props}
          FollowUpDate = {followupDate} 
          StageAccess = {stageAccessCheck(currentVisitStageId)}
          />
        );
    }
    
    const handleViewChange = (event,newValue) => {
        setViweType(newValue);
    };
    
    const updateInput = (input) => {
        setInput(input);
        setGlobalSpinner(true);
        if (input && input.length > 3) {
            const filteredList = searchAllResult.filter((object) => {
                return Object.values(object).some((value) => {
                    return typeof value === 'string' && value.toLowerCase().includes(input.toLowerCase());
                });
            });
            const filterSearchArray = filteredList;
            setSearchResult([]);
            setTimeout(() => {
                setGlobalSpinner(false);
                setSearchResult(filterSearchArray);
            }, 500);
        } else {
            if (input.length === 0) {
                const filterSearchArray = searchAllResult;
                setSearchResult([]);
                setTimeout(() => {
                    setGlobalSpinner(false);
                    setSearchResult(filterSearchArray);
                }, 1000);
            } else {
                setGlobalSpinner(false);
            }
        }
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
    const handlePageChange = (event, value) => {
        setPage(value);
    }
    return (            
        <section className="searchcustombg searchtabmaindiv myclientspage"
                style={{
                    // backgroundColor: '#fff',
                    flexGrow: 1,
                    padding: 0,
                    
                }}
        >
            
            <FooterMenu></FooterMenu>
            <div className="searchformcontainer followUpSection">
                <p className="searchformheading">
                    <span><Trans>Follow up</Trans></span>
                </p>
                
                <SearchBar 
                input={input} 
                setKeyword={updateInput}
                />
                
                {/* {searchResult.length > 0 ? loadViewToggleButtons() : null} */}
                {/*console.log('searchResult', searchResult)*/}
                {
                    
                    searchResult.length > 0  && progarmData != null && Configuration != null?                          
                    <Grid container spacing={3} className="mb-30px mt-15px">
                    {/* {Object.entries(searchResult).map(([key, val],idx) => { */}
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
                />
                
            </div>
                          
        </section>
    )
    
}
export default Followup;