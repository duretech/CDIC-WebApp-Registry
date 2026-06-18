import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EventNoteIcon from '@material-ui/icons/EventNote';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import CallIcon from '@material-ui/icons/Call';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import EmailIcon from '@material-ui/icons/Email';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Grid from '@material-ui/core/Grid';
import AccordionContentList from './AccordionContent'
import OfflineDb from '../../db'

import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'

import { useTranslation } from 'react-i18next';

import { Button } from '@dhis2/ui';

import { red } from '@material-ui/core/colors';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
      margin: '0 auto',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));

function AccordianList ({AccordionLabel, FollowUpDate,AccordionContent, AccordionDataObject, TrackEntityId, Component, PropsArray,ClientName, AlertName,StageAccess}) {
    const { t } = useTranslation();
    const history = useHistory();
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [expanded2, setExpanded2] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const listOfFields = PropsArray && PropsArray.progarmData ? PropsArray.progarmData.programs[0].programTrackedEntityAttributes : ''
    const fieldsToDisplay = listOfFields ? listOfFields.filter(obj => obj.displayInList == true) : ''

    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded2(isExpanded ? panel : false);
      };

    const seeIndividualRecordClick = () => {
    localStorage.setItem('trackedEntityInstance', TrackEntityId) // Update TrackentityId here
    localStorage.setItem('linkContact', false)
    localStorage.setItem('hidebutton', true)


    setAnchorEl(null);
    setGlobalSpinner(true)
    history.push('/layout/individualrecord', { 'trackedEntityInstance': TrackEntityId }); // Update TrackentityId here
    }

    function UpdateRecordClick() {
        setGlobalSpinner(true)
    
        const formDataMassaged = {}
        const activeCaseDetails = {
          'trackedEntityInstance':  TrackEntityId,//PropsArray.instance,
          'enrollmentId': "",
          "type": PropsArray.type,
          "stageinstanceuid": PropsArray.stageinstanceuid,
          "stageuid": PropsArray.stageuid,
          "redirectionTrue":true
        }
        const activeCaseFormData = {
          'formFormat': null, //formDataMassaged,
          'dhisFormat': null
        }
        const linkContact = {
          "enabled": false,
          "linkTrackedEntityInstance": TrackEntityId,
        }
        
        OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
        OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
        localStorage.setItem("stagesShow",true);
        if(Component == "FollowUp" || "TransferOut") {
          const transfer = {
            "type": PropsArray.type,
            "stageinstanceuid": PropsArray.stageinstanceuid,
            "stageuid": PropsArray.stageuid
          }
          OfflineDb.setDataIntoPouchDB('transferFlag', transfer)
        }
        setGlobalSpinner(false)
        history.push('/layout/registration')
      }

    function dialPhone(){
      try{
        let filtered_array = _.find(
          fieldsToDisplay, function(o) {
            return o.trackedEntityAttribute && o.trackedEntityAttribute.description == "Phone number (permanent)";
          }
        );
        let phoneUID = null;
        if(filtered_array){
          phoneUID = filtered_array.trackedEntityAttribute.id
          let phoneNumber = phoneUID ? PropsArray.alertdata[phoneUID] : ''
          if(phoneNumber){
              window.open(`tel:${phoneNumber}`, '_system')
          }
        }
      }catch(e){

      }
    }

    function openEmail(){
      window.open('mailto:', '_system')
    }

    return (
            <Grid item xs={12} sm={12} md={12} className="knowkedgelistcontainer">
              {/* <div className="alertsdetailholder">
                <Customcaseslist row={row} viewType={row.viewType}></Customcaseslist>
                <p className="alerts_profilebtn_holder caselistviewbtnholder myClientsCaseList">
                  <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={seeIndividualRecordClick}>
                    <VisibilityIcon /><span className="ml-10px">{t('See Individual Record')}</span>
                  </Button>
                  <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={UpdateRecordClick}>
                    <EditIcon /> <span className="ml-10px">{t('New/Update Individual Record')}</span>
                  </Button>
                  {clientType.toLocaleLowerCase() == 'index' ?
                    <>
                      <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={getIndividualsList}>
                        <GroupIcon /><span className="ml-10px">{t('Linked contacts')}</span>
                      </Button>
                      <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={addContcat}>
                        <AddIcon /> <span className="ml-10px">{t('Add contact')}</span>
                      </Button>
                    </>
                  :<></>
                  }
                </p>
              </div> */}
              <Accordion expanded={expanded2 === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{margin:"0px"}}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  alignItems: 'center',
                  width: '100%',
                  gap: '8px'
                  }}>
                <Typography className={classes.heading} style={{paddingTop:"10px"}}><EventNoteIcon /></Typography>
                {/* Text area (label + follow up date stacked) */}
                  <div
                    style={{
                      display: "flex",
                      //flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    
                        <Typography style={{
                          padding: '10px 15px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          flex: "1 1 auto", // flexible width
                        }}>
                            {Component && (Component).trim() == 'Alert' && ClientName && AlertName ?
                              <><span>{ClientName}</span> - <span className='cl-red'>{AlertName}</span></>
                              :AccordionLabel
                            }
                            {/* {AccordionLabel} */}
                        </Typography>
                        {FollowUpDate && (
                          <Typography style={{
                            padding: '0px 15px 10px', 
                            fontSize: '0.9em', 
                            color: '#666',
                            fontStyle: 'italic',
                            whiteSpace: 'nowrap'
                          }} className="followup-date">
                            {t("Follow up Date")}: {FollowUpDate}
                          </Typography>
                      )}
                    
                   </div>
                </div>
              </AccordionSummary>
              
                <AccordionDetails>
                    <div className="">
                        <AccordionContentList FromComponent={'Alert'} DataArray={AccordionDataObject} />
                        <p className="alerts_profilebtn_holder caselistviewbtnholder myClientsCaseList">
                          {Component && Component!= "FollowUp" &&
                          <>
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={seeIndividualRecordClick}>
                            <VisibilityIcon /><span className="ml-10px"></span>
                        </Button>
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={UpdateRecordClick}>
                            <EditIcon /> <span className="ml-10px"></span>
                        </Button>
                        </>
                        }
                        {Component && Component == "FollowUp" && StageAccess &&
                          <>
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={UpdateRecordClick}>
                            <ArrowRightAltIcon /> {t("Follow Up")}  <span className="ml-10px"></span>
                        </Button>
                        </>
                        }
                        {
                          Component && Component == 'Alert' &&
                          <>
                          <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={dialPhone}>
                            <CallIcon /> <span className="ml-10px"></span>
                          </Button>
                          <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={openEmail}>
                              <EmailIcon /> <span className="ml-10px"></span>
                          </Button>
                          {/* <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={UpdateRecordClick}>
                              <WhatsAppIcon /> <span className="ml-10px">{t('Share')}</span>
                          </Button> */}
                          </>
                        }
                    </p> 
                    </div> 
                      
              </AccordionDetails>
              
            </Accordion>
            </Grid>
        
    )

}

export default AccordianList