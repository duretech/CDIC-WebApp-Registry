import React, { useState,useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import classes from '../../App.module.css'
import { makeStyles } from '@material-ui/core/styles';
import { apiServices } from '../../services/apiServices'
import CaseList from './CaseList'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
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
import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'

const {Form, Field } = ReactFinalForm

function TaskList(){
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [progarmData,setProgarmData] = useState(null)
    const [customSearch,setCustomSearch] = useState([])
    const [UICSearch,setUICSearch] = useState([])
    const [searchResult,setSearchResult] = useState([])
    const [value,setValue] = useState([])
    // const [loading,setGlobalSpinner] = useState(false)
    const {t} = useTranslation()
    const [viewType, setViweType] = useState('card')
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    async function getMetaData(){
        let metadata = await OfflineDb.getDataFromPouchDB('metaData')
        setProgarmData(metadata.data)
        
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)
    }
    useEffect(()=>{
        getMetaData()      
        OfflineDb.removeDataFromPouchDB('activeCaseDetails')
        OfflineDb.removeDataFromPouchDB('activeCaseFormData')
        OfflineDb.removeDataFromPouchDB('linkContactFlag')
    },[])
    
    //once user bco is set call getContactList function
    useEffect(()=>{
        if(sessionUserBoValue != null){
            getCasesList()
        }
    },[sessionUserBoValue])

    function getCasesList(param)  {
        
        //localStorage.removeItem('trackedEntityInstance')
        setGlobalSpinner(true)        
        let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
            programID = sessionUserBoValue.programs[0], //`nSy7PFqQykt`, 
            searchQuery = ``
        
        for (var i in param) {
            searchQuery += `&attribute=${i}:LIKE:${param[i]}`
        }
        
        let subURL = '30/trackedEntityInstances/query.json?ou='+ orgID +'&ouMode=SELECTED&order=created:desc&assignedUserMode=CURRENT&program='+ programID +'&pageSize=50&page=1&totalPages=false'
                   //'trackedEntityInstances/query.json?ou='+ orgID +'&ouMode=SELECTED&&order=created:desc&program='+ programID +'&pageSize=50&page=1&totalPages=false'
                   //&pageSize=50&page=1&totalPages=false
        apiServices.getAPI(subURL).then(res => { 
           
            let searchArray = []
            searchArray.push(res.data.headers)

            searchArray.push(res.data.rows)
            
            setGlobalSpinner(false)
            setSearchResult(searchArray)
            //OfflineDb.setDataIntoPouchDB('myclients',searchArray);
        }).catch(error => {
            setGlobalSpinner(false)
            swal({
                title: "Error",
                text: error,
                icon: "error",
                button: "Close",
              });
        })
        
    }
    
    const handleViewChange = (event) => {
        setViweType(event.target.value);
    };
    const loadViewToggleButtons = ()=>{
        return(
            <FormControl component="fieldset">
                <RadioGroup row aria-label="position" name="position" defaultValue="top">
                    <FormControlLabel
                        value="card"
                        control={<Radio
                            checked={viewType === 'card'}
                            onChange={handleViewChange}
                            value="card"
                            name="radio-button-layout"
                        />}
                        label={t('Card View')}
                        
                    />
                    <FormControlLabel
                        value="list"
                        control={<Radio
                            checked={viewType === 'list'}
                            onChange={handleViewChange}
                            value="list"
                            name="radio-button-layout"
                        />}
                        label={t('List View')}
            
                    />
                </RadioGroup>
            </FormControl>
        )
    }
    return (            
        <section className="searchcustombg"
                style={{
                    backgroundColor: '#fff',
                    flexGrow: 1,
                    padding: 20,
                    
                }}
        >
            <div className="searchformcontainer">
                <p className="searchformheading">
                    <span><Trans>Task List</Trans></span>
                </p>
                {searchResult.length > 0 ? loadViewToggleButtons() : null}
                {
                    searchResult.length > 0  && progarmData != null?                          
                    <CaseList
                        searchResult = {searchResult}
                        viewType={viewType}
                        metaData={progarmData}
                    /> : null
                }
            </div>               
        </section>
    )
    
}
export default TaskList;