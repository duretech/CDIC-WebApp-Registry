import React, { useState, useEffect } from 'react'
import { apiServices } from '../../services/apiServices'
import Customcasescard from './Customcasescard.js';
import Grid from '@material-ui/core/Grid';
import swal from 'sweetalert'
import OfflineDb from '../../db'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import { Trans , useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'


function IndividualCases(){
    const location = useLocation();
    const [sessionUserBoValue,setSessionUserBoValue] = useState(null)
    const [searchResult,setSearchResult] = useState([])
    const [trackedEntityInstance] = useState(location.state.trackedEntityInstance);
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [viewType, setViweType] = useState('card')
    const {t} = useTranslation()

    async function getMetaData(){
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)
    }
    useEffect(()=>{
        getMetaData()      
    },[])

    useEffect(()=>{
        if(sessionUserBoValue != null){
            getIndexRelations()
        }
    },[sessionUserBoValue])

    function getChildrenById(relationshipsArr, programid) {
        let p = [];
        //setGlobalSpinner(true);
        relationshipsArr.map((relobj) => {
          let url = `trackedEntityInstances/${relobj.to.trackedEntityInstance.trackedEntityInstance}.json?program=${programid}&fields=*?`;
          p.push(apiServices.getAPI(url));
        });
    
        Promise.all([...p]).then(([...res]) => {
          let childrenArr = [...res];
          setGlobalSpinner(false);
          setSearchResult(childrenArr)
        });
    }

    function getIndexRelations() {
        setGlobalSpinner(true);
                
        let programID = sessionUserBoValue.programs[0],
        url = `trackedEntityInstances/${trackedEntityInstance}.json?program=${programID}&fields=relationships`;
        apiServices.getAPI(url).then(res => {
            getChildrenById(res.data.relationships, programID);                
        }).catch(error => {
            setGlobalSpinner(false);
            swal({
                title: "Error",
                text: "",
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
                <p className="searchformheading"><Trans>Individual Registered</Trans></p>
                {searchResult.length > 0 ? loadViewToggleButtons() : null}
                {
                    searchResult.length > 0 ?                            
                    <Grid container spacing={3} className="mt-30px mb-30px">
                        {searchResult.map((objIndividual,i) => {
                            return(<Customcasescard row={objIndividual.data} viewType={viewType} page={''} key={i}></Customcasescard>)
                        })}
                    </Grid>
                    : <p><Trans>Records not found.</Trans></p>
                }                  
            </div>               
        </section>
    )
}

export default IndividualCases;