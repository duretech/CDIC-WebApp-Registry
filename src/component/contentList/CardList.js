import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { red } from '@material-ui/core/colors';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import EventNoteIcon from '@material-ui/icons/EventNote';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';
// import Customcaseslist from './Customcaseslist.js';
import CardContentList from '../../component/contentList/CardContent'
import OfflineDb from '../../db'
import { useSelector, useDispatch } from "react-redux"
import { Button } from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import '../../assets/css/customstyles.css'

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

function CardList({AccordionLabel, AccordionContent, AccordionDataObject, TrackEntityId, Component, PropsArray}) {
    const classes = useStyles();
    const history = useHistory();
    const { t } = useTranslation();

    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
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
              'trackedEntityInstance': TrackEntityId,
              'enrollmentId': "",
            }
            const activeCaseFormData = {
              'formFormat': null, //formDataMassaged,
              'dhisFormat': null
            }
            const linkContact = {
              "enabled": false,
              "linkTrackedEntityInstance": TrackEntityId
            }
            OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
            OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
            if(Component == "TransferOut") {
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
    

    return (
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.root}>
            <CardHeader
              className="casescardheader"
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  <EventNoteIcon />
                </Avatar>
              }
              action={
                <div>
                  {/* {row.hideOptions != 'true' ? <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton > : <> </>} */}
  
                  <Menu
                    id="simple-menu"
                    className="casesactionmenu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {/* <MenuItem onClick={() =>seeIndividualRecordClick()}><VisibilityIcon /> {t('See Individual Record')}</MenuItem>
                    <MenuItem onClick={() =>UpdateRecordClick()}><EditIcon /> {t('New/Update Individual Record')}</MenuItem> */}
                  </Menu>
                </div>
              }
              title={AccordionLabel}
              subheader=""
            />
  
            <CardContent className="zero caselistholder">
              <CardContentList FromComponent={'Alert'} DataArray={AccordionDataObject} />
              {/* <Customcaseslist row={row} viewType={row.viewType}></Customcaseslist> */}
            </CardContent>
            <CardActions disableSpacing className="cardactionfooter">
              <IconButton aria-label="add to favorites" onClick={seeIndividualRecordClick}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton aria-label="share" onClick={UpdateRecordClick}>
                  <EditIcon />
                </IconButton >
            </CardActions>
            
          </Card>
        </Grid>
      )
}

export default CardList