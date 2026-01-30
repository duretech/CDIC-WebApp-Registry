import React, {useEffect, useState} from 'react'
import {apiServices} from '../../services/apiServices'
import moment from 'moment';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';

import Avatar from '@material-ui/core/Avatar';
import DescriptionIcon from '@material-ui/icons/Description';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import swal from 'sweetalert'
import { useHistory } from "react-router";

import '../../assets/css/customstyles.css'

import { useLocation } from "react-router-dom";
import OfflineDb from '../../db'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import { useTranslation } from 'react-i18next';
import FooterMenu from '../../component/layout/FooterMenu';
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));

function SeeIndividualRecord(){
    const location = useLocation();
    const history = useHistory();
    const { t } = useTranslation();
    const [trackedEntityInstance] = useState(location.state.trackedEntityInstance);
    const [patientname] = useState(location.state.name);
    const [age] = useState(location.state.age);
    const [gender] = useState(location.state.gender);

    const [sessionUserBoValue, setSessionUserBoValue] = useState(null);
    const [sessionMetaData, setSessionMetaData] = useState(null);
    const [eventsData, setEventsData] = useState(null);
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    async function getUserMeta() {
        let userdata = await OfflineDb.getDataFromPouchDB('loginDetails');
        setSessionUserBoValue(userdata.data)

        let metadata = await OfflineDb.getDataFromPouchDB('metaData');
        setSessionMetaData(metadata.data)
    }

    useEffect(() => {
        getUserMeta();
        setGlobalSpinner(false)
    }, [])

    useEffect(()=>{
        if(sessionUserBoValue != null){
            getDetails();
        }

    },[sessionUserBoValue])

    const getTranslatedLabels = (attribute) => {
        if (localStorage.getItem("locale") == "en") {
            return attribute.displayName;
        } else if (attribute.translations && attribute.translations.length > 0) {
            //debugger;
            let label = attribute.translations.filter(tanslation => tanslation.property == "NAME" && tanslation.locale == localStorage.getItem("locale"))
            if (label.length > 0) {
                return label[0].value;
            } else {
                return attribute.displayName;
            }
        }
        return attribute.displayName;
      };

    function getDetails(){
        setGlobalSpinner(true)
        const programId = sessionUserBoValue.programs[0]
        const getURL = 'trackedEntityInstances/' + trackedEntityInstance + '.json?program='+ programId +'&fields=*?'
        apiServices.getAPI(getURL)
        .then(res => {
            setGlobalSpinner(false)
            let allEvents = res.data.enrollments[0].events;
            setEventsData(allEvents)
            if(allEvents.length == 0 ||  allEvents.length < 1) {
                swal({
                    title: t("Success"),
                    text: t("No records found"),
                    icon: "success",
                    button: t("Close"),
                  })
                  .then(res => {
                    if(res) {
                        
                        history.goBack()
                    //   history.push('layout/cases')
                    }
                })
            }
        })
        .catch(error => {
            setGlobalSpinner(false)
            swal({
                title: "Error",
                text: error,
                icon: "error",
                button: "Close",
              });
        })
    }
    function createStructure (events){

        const dataElements = sessionMetaData.dataElements
        
        return events.dataValues.map((values,i) => {
            return sessionMetaData.programs[0].programStages.map(stages => {
                let filterFieldData = stages.programStageDataElements.filter(obj => obj.dataElement.id == values.dataElement)
                if(filterFieldData.length > 0) { 
                    const filterShowFlagAttr = filterFieldData[0].dataElement.attributeValues.filter(obj => obj.attribute.displayName == "enableInIndividualRecord")
                    try{
                        if(filterFieldData[0].dataElement.valueType == "DATE") { //IF VALUE OF DATAELEMENT IS DATE 
                            values.value = moment(values.value).format("YYYY-MM-DD")
                        }
                        if(filterFieldData[0].dataElement.valueType == "ORGANISATION_UNIT") { 
                            let orgobj = sessionMetaData.programs[0].organisationUnits.find(o => o.id == values.value)
                            if(orgobj){
                                values.value = orgobj.displayName
                            }
                        }
                        if(filterFieldData[0].dataElement.optionSet){
                        filterFieldData[0].dataElement.optionSet.options.map(option => {
                            if(option.code == values.value){
                                values.value = getTranslatedLabels(option)
                            }
                        })
                        }
                    }catch(e){

                    }
                    if(filterShowFlagAttr.length > 0) {
                        
                        return (
                            <ListItem key={i}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <DescriptionIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <Typography>
                                    <span className="zero servicequestiontitle">{getTranslatedLabels(filterFieldData[0].dataElement)} : </span>&nbsp;
                                    <span className="zero servicequestionanswer">{values.value}</span>
                                </Typography>
                            </ListItem>
                        )
                    }
                }
                    
                
            })
             
        })
    }

    function getEntityData(events,i) {
        const classes = makeStyles((theme) => ({
            root: {
              width: '100%',
              maxWidth: 360,
              backgroundColor: theme.palette.background.paper,
            },
          }));
        

        const allStages = sessionMetaData.programs[0].programStages

        const filterStageEvent = allStages.filter(obj => obj.id == events.programStage)
        console.log("datattt", events, filterStageEvent,eventsData)
        
        return (

            <Grid item xs={12} sm={6} md={4} key={i}>

                <Card className={classes.root}>
                    <CardHeader
                        className="casescardheader casesheadertitle"
                        avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            <DescriptionIcon />
                        </Avatar>
                        }
                        
                        title={ moment(events.lastUpdatedAtClient).format("MMMM Do YYYY, h:mm a")}
                        subheader={filterStageEvent[0].description}
                    />
                    
                    <CardContent className="zero caselistholder serviceslist seviceslist-cardbody">
                        <List className={classes.root}>
                            {createStructure(events)}
                        </List>
                    </CardContent>
                    
                </Card>
            </Grid>
        )
    }      
    
    return (
        <>
        <FooterMenu></FooterMenu>
        <section className="searchcustombg individualRecordSection"
                style={{
                    backgroundColor: '#fff',
                    flexGrow: 1,
                    padding: 20,
                    
                }}
        >
            <div className="nameuicinfoholder" style={{marginLeft: '20px'}}>
              <Grid container spacing={0} xs={12} lg={12}>
                <Grid container spacing={0} xs={6} lg={3}>
                  <Grid item>
                    <span className="fl-left">{t("Name")}</span>:{" "}
                    {patientname
                      ? patientname
                          : ""}
                  </Grid>
                </Grid>
                <Grid container spacing={0} xs={6} lg={3}>
                  <Grid item>
                    <span className="fl-left">{t("Age")}</span>:{" "}
                    {age ? age : ""}
                  </Grid>
                </Grid>
                <Grid container spacing={0} xs={6} lg={3}>
                  <Grid item>
                    <span className="fl-left">{t("Gender")}</span>:{" "}
                    {gender ? gender: ""}
                  </Grid>
                </Grid>
                
              </Grid>
            </div>
            <div className="searchformcontainer">
            {/* <p className="searchformheading"><b>{patientname}</b></p>
            <p className="searchformheading">Age: {age}</p>
            <p className="searchformheading">Gender: {gender}</p> */}

            {(eventsData != null && eventsData.length > 0)
            ? 
                <Grid container spacing={3} className="mt-30px mb-30px p-20px">
                    {eventsData.map((events,i) => {
                        return (getEntityData(events,i))
                    })}
                </Grid>
            : 
                <></>
            }
            </div>
        </section>
        </>
    )
}
export default SeeIndividualRecord;


