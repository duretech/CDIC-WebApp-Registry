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
import AddIcon from '@material-ui/icons/Add';
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
import { Configuration } from '../../assets/data/config'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import '../../assets/css/customstyles.css'

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TextField from '@material-ui/core/TextField';

import PersonIcon from '@material-ui/icons/Person';
import { Link } from "react-router-dom";

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

  const [headers] = React.useState(row.searchHeader)
  const findIndexOfClientType = headers.findIndex(obj => obj.column.trim().toLocaleLowerCase() == "client type")
  const findIndexOfName = headers.findIndex(obj => obj.column.trim().toLocaleLowerCase() == "first name")
  const clientType = row.row[findIndexOfClientType] ? row.row[findIndexOfClientType] : ""
  const clientTypeId = headers[findIndexOfClientType] ? headers[findIndexOfClientType].name : '';
  const clietName = row.row[findIndexOfName] ? row.row[findIndexOfName] : ""
  //const [vType] = useState(row.viewType)
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [UserBO, setUserBO] = useState(null);
  const [metaData, setMetaData] = useState(null)
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  //redux state selector and dispatch action
  const postResgistrationResponse = useSelector(state => state.postResgistrationResponse);
  const dispatch = useDispatch();

  // async function getUserBO() {
  //   let userdata = await OfflineDb.getDataFromPouchDB('loginDetails');
  //   setUserBO(userdata.data)

  //   let metaData = await OfflineDb.getDataFromPouchDB('metaData');
  //   setMetaData(metaData.data)
  // }

  useEffect(() => {
    
    // getUserBO();
  }, [])

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

    localStorage.setItem('trackedEntityInstance', row.row[0])
    localStorage.setItem('linkContact', false)
    localStorage.setItem('hidebutton', true)


    setAnchorEl(null);
    setGlobalSpinner(true)
    console.log("124")
    history.push('/layout/individualrecord', { 'trackedEntityInstance': row.row[0] });
  }

  const addContcat = () => {

    const activeCaseFormData = {
      'formFormat': {[clientTypeId] : Configuration.ltbiLinkVariables.contact},
      'dhisFormat': null
    }
    const linkContact = {
      "enabled": true,
      "linkTrackedEntityInstance": row.row[0]
    }
    //OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
    OfflineDb.setDataIntoPouchDB('activeCaseFormData', activeCaseFormData)
    OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
    history.push('/layout/registration')
  }

  function UpdateRecordClick() {
    setGlobalSpinner(true)
    

    const formDataMassaged = {}

    row.metaData.programs[0].programTrackedEntityAttributes.map(field => {
      const fieldId = field.trackedEntityAttribute.id
      const fieldValue = row.row[row.searchHeader.findIndex(obj => obj.name == field.trackedEntityAttribute.id)]
      
      
      formDataMassaged[fieldId]= fieldValue
    })
    
    const activeCaseDetails = {
      'trackedEntityInstance': row.row[0],
      'enrollmentId': "",
    }
    const activeCaseFormData = {
      'formFormat': null, //formDataMassaged,
      'dhisFormat': null
    }
    const linkContact = {
      "enabled": false,
      "linkTrackedEntityInstance": row.row[0]
    }
    OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
    // OfflineDb.setDataIntoPouchDB('activeCaseFormData', activeCaseFormData)
    OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
    setGlobalSpinner(false)
    history.push('/layout/registration')

    // localStorage.setItem('trackedEntityInstance', row.row[0])
    // localStorage.setItem('linkContact', false)
    // dispatch({
    //   type:"REGISTRATION_RESPONSE_SAVE",
    //   payload:{
    //     'trackedEntityInstance': row.row[0],
    //     'enrollmentId': '',
    //     'showStage': true,
    //     'individualList': ""
    //   }
    // })
    // setAnchorEl(null);
    // history.push('/layout/registration');

    /* ---------------old code commented for customisation-------------- 

    const getChildrenById = (relationshipsArr, programid) => {
      let p = [];
      //this.setState({ loading: true });
      relationshipsArr.map((relobj) => {
        let url = `trackedEntityInstances/${relobj.to.trackedEntityInstance.trackedEntityInstance}.json?program=${programid}&fields=*?`;
        p.push(apiServices.getAPI(url));
      });

      return Promise.all([...p]).then(([...res]) => {
        let childrenArr = [...res];
        //this.setState({ loading: false });
        
        row.setPostResgistrationResponse({
          'trackedEntityInstance': row.row[0],
          'enrollmentId': '',
          'showStage': true,
          'individualList': childrenArr
        })
        history.push('/layout/registration');
      });
    }

    localStorage.setItem('trackedEntityInstance', row.row[0])
    localStorage.setItem('linkContact', false)



    //const UserBO = JSON.parse(localStorage.getItem('userBO'));    

    
    let orgID = UserBO.organisationUnits[0].id,
      programID = UserBO.programs[0],
      url = `trackedEntityInstances/${row.row[0]}.json?program=${programID}&fields=relationships`;
    
    if (clientType == 'Household') {
      apiServices.getAPI(url).then(res => {

        
        getChildrenById(res.data.relationships, programID)


      })
    } else {
      row.setPostResgistrationResponse({
        'trackedEntityInstance': row.row[0],
        'enrollmentId': '',
        'showStage': true
      })
      history.push('/layout/registration');
    }
    setAnchorEl(null);*/
  }
  const getIndividualsList = () => {
    localStorage.setItem('trackedEntityInstance', row.row[0]);
    history.push('/layout/individual-cases-list',{ 'trackedEntityInstance': row.row[0] });
  }
  
  const [expanded2, setExpanded2] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded2(isExpanded ? panel : false);
  };
  const caseListView = () => {
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
        >
          <Typography className={classes.heading}><div className="userFolder"></div></Typography>
            <Typography style={{padding: '10px 15px'}}>
              {clietName}
              </Typography>
        </AccordionSummary>
          <AccordionDetails>
          {/* alertsdetailholder */}
            <div className="">
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
                  <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px hide" onClick={getIndividualsList}>
                    <GroupIcon /><span className="ml-10px">{t('Linked contacts')}</span>
                  </Button>
                  <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px hide" onClick={addContcat}>
                    <AddIcon /> <span className="ml-10px">{t('Add contact')}</span>
                  </Button>
                </>
              :<></>
              }
            </p>
          </div>
        </AccordionDetails>
      </Accordion>
      </Grid>
    )
  }

  const caseCardView = () => {
    
    return (
      <Grid item xs={12} sm={6} md={row.parentPage &&  row.parentPage == "registration"? 6 : 3}>
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
                  <MenuItem onClick={() =>seeIndividualRecordClick()}><VisibilityIcon /> {t('See Individual Record')}</MenuItem>
                  <MenuItem onClick={() =>UpdateRecordClick()}><EditIcon /> {t('New/Update Individual Record')}</MenuItem>
                </Menu>
              </div>
            }
            title={clietName}
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
            {clientType.toLocaleLowerCase() == 'index' ?
              <>
                <IconButton aria-label="share" className="hide" title="Individuals List" onClick={getIndividualsList}>
                  <GroupIcon />
                </IconButton> <button className="caseSearchButton hide" type="button" onClick={addContcat}>{t('Add contact')}</button>
              </> :
              <> </>}

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

  
  return (
    
    (row.viewType == 'card') ? caseCardView() : caseListView())
}

export default CustomeCaseCard;