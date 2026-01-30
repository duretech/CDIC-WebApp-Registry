import React from "react";
import { useTranslation } from 'react-i18next';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import "../../assets/css/customstyles.css";
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import OfflineDb from '../../db'
import { useHistory } from "react-router";
import AccordianList from '../../component/contentList/AccordianList'
import CardList from '../../component/contentList/CardList'


export default function AlertItemsList(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  const listOfFields = props.progarmData.programs[0].programTrackedEntityAttributes
  const fieldsToDisplay = listOfFields.filter(obj => obj.displayInList == true)

  const renderListItem = (props)=>{
    const searchHeader = []
    const searchResult = []
    const labelArr = [];
    //push alert name first
    if(props.alertdata.hasOwnProperty('alertname')){
      labelArr.push({'Alert Name': t(props.alertdata.alertname)});
    }
    fieldsToDisplay.forEach((item)=>{
      let obj = {};
      if(props.alertdata.hasOwnProperty(item.trackedEntityAttribute.id)){
        let fieldName = item.trackedEntityAttribute.description ? item.trackedEntityAttribute.description : item.trackedEntityAttribute.formName ? item.trackedEntityAttribute.formName : item.trackedEntityAttribute.displayName
        obj[fieldName] = props.alertdata[item.trackedEntityAttribute.id];
        labelArr.push(obj);
      }
    })
    // push duedays last
    if(props.alertdata.hasOwnProperty('duedays')){
      labelArr.push({'Due Days': props.alertdata.duedays});
    }



    const accordionContent = <div className="">
    {
      labelArr.map(item=>{
        for(let key in item) {
          return (
            <>
              <p 
                className={'alerts_description_fields'} //`${key =='alertname' ? "alerts_title" : "alerts_description_fields"}`
              >
                {key+' : '}  {item[key]}
              </p>
            </>
          )
        }
      })
    }
    </div>
    {console.log("AccordionLabel",labelArr)}
    //AccordionLabel = {labelArr.find(x => x["First Name"]) ? labelArr.find(x => x["First Name"])['First Name'] : ''}
    return (
        props.viewType == 'card'
          ?
          <CardList AccordionLabel = {labelArr.find(x => x["First Name"]) ? labelArr.find(x => x["First Name"])['First Name'] : ''} AccordionContent = {accordionContent} AccordionDataObject = {labelArr} TrackEntityId = {props.alertdata.instanceid} Component={'Alert'} PropsArray = {props}/>
          
          :
          <AccordianList AccordionLabel = {props.alertdata.hasOwnProperty('alertname') ? labelArr.find(x => x["First Name"]) ? labelArr.find(x => x["First Name"])['First Name'] +" - "+ t(props.alertdata.alertname) : t(props.alertdata.alertname) : labelArr.find(x => x["First Name"]) ? labelArr.find(x => x["First Name"])['First Name'] : ''} AccordionContent = {accordionContent} AccordionDataObject = {labelArr} TrackEntityId = {props.alertdata.instanceid} Component={'Alert'} PropsArray = {props} ClientName = {labelArr.find(x => x["First Name"]) ? labelArr.find(x => x["First Name"])['First Name'] : ''} AlertName={props.alertdata.hasOwnProperty('alertname') ? t(props.alertdata.alertname) : ''}/>
        
        //
  
          
        
    )
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
    <>
      {renderListItem(props)}
    </>
  );
}
