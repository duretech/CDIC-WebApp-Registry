import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { apiServices } from '../../services/apiServices'
import { useHistory } from "react-router-dom";
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EventNoteIcon from '@material-ui/icons/EventNote';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';
import Customcaseslist from './Customcaseslist.js';
import OfflineDb from '../../db'
import { useSelector, useDispatch } from "react-redux"
import { Button } from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';
//import { Configuration } from '../../assets/data/config'
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

function CustomeCaseCard(row) {
  const history = useHistory();
  const { t } = useTranslation();
  //const [vType] = useState(row.viewType)
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const seeIndividualRecordClick = () => {
    setAnchorEl(null);
    console.log("127")
    history.push('/layout/individualrecord', { 'trackedEntityInstance': row.row.trackedEntityInstance });
  }

  function UpdateRecordClick() {
    const formDataMassaged = {}
    row.row.attributes.map(field=>{
      formDataMassaged[field.attribute]= field.value
    })

    const activeCaseDetails = {
      'trackedEntityInstance': row.row.trackedEntityInstance,
      'enrollmentId': "",
    }
    const activeCaseFormData = {
      'formFormat': formDataMassaged,
      'dhisFormat': null
    }
    const linkContact = {
      "enabled": false,
      "linkTrackedEntityInstance": row.row.trackedEntityInstance
    }
    OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
    OfflineDb.setDataIntoPouchDB('activeCaseFormData', activeCaseFormData)
    OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
    history.push('/layout/registration')
  }
  const caseListView = () => {
    return (
      <Grid item xs={12} sm={6} md={6} className="knowkedgelistcontainer">
        <div className="alertsdetailholder">
          <Customcaseslist row={row} viewType={row.viewType}></Customcaseslist>
          <p className="alerts_profilebtn_holder caselistviewbtnholder myClientsCaseList">
            <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={seeIndividualRecordClick}>
              <VisibilityIcon /><span className="ml-10px">{t('See Individual Record')}</span>
            </Button>
            <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px" onClick={UpdateRecordClick}>
              <EditIcon /> <span className="ml-10px">{t('New/Update Individual Record')}</span>
            </Button>
          </p>
        </div>
      </Grid>
    )
  }

  const caseCardView = () => {
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
                {row.hideOptions != 'true' ? <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton > : <> </>}

                <Menu
                  id="simple-menu"
                  className="casesactionmenu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={seeIndividualRecordClick}><VisibilityIcon /> {t('See Individual Record')}</MenuItem>
                  <MenuItem onClick={UpdateRecordClick}><EditIcon /> {t('New/Update Individual Record')}</MenuItem>
                </Menu>
              </div>
            }
            title=""
            subheader=""
          />

          <CardContent className="zero caselistholder">
            <Customcaseslist row={row} viewType={row.viewType}></Customcaseslist>
          </CardContent>
          <CardActions disableSpacing className="cardactionfooter">
            {row.hideOptions != 'true' ?
              <>
                <IconButton aria-label="add to favorites" onClick={seeIndividualRecordClick}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton aria-label="share" onClick={UpdateRecordClick}>
                  <EditIcon />
                </IconButton> </> : <> </>}
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    )
  }
  return ((row.viewType == 'card') ? caseCardView() : caseListView())
}

export default CustomeCaseCard;