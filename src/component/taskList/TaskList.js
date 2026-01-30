import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import "../../assets/css/customstyles.css";
import _ from 'lodash';
import moment from 'moment';
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'
import { apiServices } from '../../services/apiServices'

function TaskList(props){
    
    const programData = props.programData;
    const [trackentityInstanceDetails,setTrackentityInstanceDetails] = useState({});
    const userData = props.userdetails;
    
    const [assignTaskStage, setAssignTaskStage] = useState(null);
    const [filterCurrentEvent, setFilterCurrentEvent] = useState([]);
    const [reloadData, setReloadData] = useState(false);
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    
    useEffect(() => {
        // get the stage id of `Asign Task` stage
        programData.programs[0].programStages.map(stage=>{
            if(stage.attributeValues && stage.attributeValues.length > 0) {
                stage.attributeValues.map((val)=>{
                    if(val.attribute.displayName === "Assign Task"){
                        setAssignTaskStage(stage);
                    }
                })
            }
        })
        setTrackentityInstanceDetails(props.trackentityInstanceDetails) 
       
    }, [])

    useEffect(()=>{
        
        if(assignTaskStage != null){
            const events = _.isEmpty(trackentityInstanceDetails) ? {} : trackentityInstanceDetails.enrollments[0].events
            
            //get scheduled events only
            const filterCurrentEvents = events.filter(obj => (obj.programStage == assignTaskStage.id && obj.status == "SCHEDULE"))
            setFilterCurrentEvent(filterCurrentEvents)
           
        }
        
    },[assignTaskStage,reloadData])
    
    function renderTasks(){
        //display list of all assign tasks to the current user
        if(filterCurrentEvent.length > 0){
            return filterCurrentEvent.map(event=>{
                //check is task assigned to loggedin user 
                if(_.find(event.dataValues, { 'value': userData.id}) != undefined){
                    return (
                        <Grid item xs={12} sm={12} md={12} >
                            {
                            event.dataValues.map(DE=>{
                                
                                let programDataElement = assignTaskStage.programStageDataElements.filter(obj=>obj.dataElement.id == DE.dataElement);
    
                                return (
                                    <Grid item xs={12} sm={3} md={3}>
                                        <label>
                                            {programDataElement.length > 0 ? programDataElement[0].dataElement.displayName:'N/A'}
                                            : {(DE.value == userData.id) ? userData.displayName : DE.value}
                                        </label>
                                    </Grid>
                                )
                            })
                            }
                            <Grid item xs={12} sm={3} md={3}>
                                <button 
                                type="button" 
                                onClick={()=>taskCompeleted(event.event)}
                                className='regformsubmitbtn'
                                >Complete</button>
                            </Grid>
                        </Grid>
                    )
                }
                
            })
        }
        
    }
    
    function taskCompeleted(eventid){
        
        const eventData = _.find(filterCurrentEvent, { 'event': eventid });
        const updateURL = 'events/' + eventid
        const UpdateStageInput =
        {
            "dataValues": eventData.dataValues,
            "event": eventid,
            "program": eventData.program,
            "programStage": eventData.programStage,
            "orgUnit": eventData.orgUnit,
            "trackedEntityInstance": eventData.trackedEntityInstance,
            "status": "COMPLETED",
            "dueDate": moment().format("YYYY-MM-DD"),
            "eventDate": moment().format("YYYY-MM-DD"),
            "completedDate": moment().format("YYYY-MM-DD"),
            "assignedUser":userData.id
        }
        //debugger;
        setGlobalSpinner(true)
        apiServices.putAPI(updateURL, UpdateStageInput)
        .then(response => {
            setGlobalSpinner(false)
            let removeParentIndex = _.findIndex(trackentityInstanceDetails.enrollments[0].events, { 'event': eventid });
            //trackentityInstanceDetails.enrollments[0].events.splice(removeParentIndex,1)
            //setTrackentityInstanceDetails(trackentityInstanceDetails)
            //trackentityInstanceDetails.enrollments[0].events[removeParentIndex]['status'] = "COMPLETED";
            
            props.trackentityInstanceDetails.enrollments[0].events[removeParentIndex]['status'] = "COMPLETED";
            //props.trackentityInstanceDetails['temp'] = (props.trackentityInstanceDetails['temp'] != undefined) ? !props.trackentityInstanceDetails['temp'] : true;
            setTrackentityInstanceDetails(props.trackentityInstanceDetails)
            
            setReloadData(!reloadData)
            //let removeEventIndex = _.findIndex(filterCurrentEvent, { 'event': eventid });
            //setFilterCurrentEvent(filterCurrentEvent.splice(removeEventIndex, 1));
            
        })
    }

    return(
        <>
        {renderTasks()}
            {/*(filterCurrentEvent.length > 0) ? renderTasks() : <></>*/}
        </>
    )
}
export default TaskList;