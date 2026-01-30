import React, { Component, useState } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinkIcon from '@material-ui/icons/Link';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
// import SearchDetails from './SearchDetails.js'
import { useTranslation } from 'react-i18next';
import SeeIndividualRecord from '../seeIndividualRecord/SeeIndividualRecord.js'

import Customcasescard from '../cases/NewThemeCustomcasescard';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        paddingBottom: '0px',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '5%',
        flexShrink: 0,
        color: '#333',
        fontWeight: 'bold',
        // fontFamily: 'IBM Plex Sans',
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: '#fff',
        // fontFamily: 'IBM Plex Sans',
    },
    customaccordionheader: {
        marginBottom: '15px',
        backgroundColor: '#61a6bf',
        borderRadius: '4px',
    },
    summarycontainer: {
        backgroundColor: '#fff',
        padding: '10px',
    },
    button: {
        backgroundColor: '#1a7798 !important',
        color: '#fff',
        width: '100%',
        marginTop: '8px',
        fontSize: '13px',
        borderRadius: '0px',
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '4px',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
    },
}));

const LinkContact = (res) => {
    const history = useHistory();
    const classes = useStyles();
    const { t } = useTranslation();
    const handleClick = (event) => {
      
        localStorage.setItem('linkTrackedEntityInstance', res.instance)
        localStorage.setItem('linkContact', true)
        localStorage.setItem('hidebutton', false)
        //localStorage.setItem('enrollmentId', res.data.enrollments[0].enrollment)
        
        
        // return <SeeIndividualRecord instance={res.instance}/>
    };
 
    return (
        <Button
            variant="contained"
            disableElevation
            color="default"
            className={classes.button}
            startIcon={<LinkIcon />}
            onClick={handleClick}
        >
            {t('Link Contact')}
        </Button>
  );
}

const SeeIndiRecord = (res) => {
    const history = useHistory();
    const classes = useStyles();
    const { t } = useTranslation();
    const handleClick = (event) => {
      
        localStorage.setItem('trackedEntityInstance', res.instance)
        localStorage.setItem('linkContact', false)
        localStorage.setItem('hidebutton', true)
        //localStorage.setItem('enrollmentId', res.data.enrollments[0].enrollment)
        console.log("126")
        history.push('/layout/individualrecord');
    };
 
    return (
        <Button
            variant="contained"
            disableElevation
            color="default"
            className={classes.button}
            startIcon={<VisibilityIcon />}
            onClick={handleClick}
        >
            {t('See Individual Record')}
        </Button>
  );
}

const UpdateIndiRecord = (res) => {
    const history = useHistory();
    const classes = useStyles();
    const { t } = useTranslation();
    const handleClick = (event) => {
      
        localStorage.setItem('trackedEntityInstance', res.instance)
        localStorage.setItem('linkContact', false)
        localStorage.setItem('hidebutton', false)
        //localStorage.setItem('enrollmentId', res.data.enrollments[0].enrollment)
        
        history.push('/layout/registration');
    };
 
    return (
        <Button
            variant="contained"
            color="default"
            disableElevation
            className={classes.button}
            startIcon={<EditIcon />}
            onClick={handleClick}
        >
            {t('New/Update Individual Record')}
        </Button>
  );
}

export default function SearchResults(res) {
    const classes = useStyles();
    // const [expanded, setExpanded] = React.useState(false);

    // const handleChange = (panel) => (event, isExpanded) => {
    //     setExpanded(isExpanded ? panel : false);
    // };
        
    
    const searchHeader = res.searchResult[0]
    const searchResultNew = res.searchResult[1]

    const [expanded2, setExpanded2] = useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded2(isExpanded ? panel : false);
    };

    return (
        <Grid container spacing={3} className="mt-30px searchresult-margin">
            
                {searchResultNew.map((row,i) => {
                    return (
                        // <Grid item xs={12} sm={6} md={3}>
                            <Customcasescard index={i+"_"+row[0]} row={row} searchHeader={searchHeader} key={i+"_"+row[0]} viewType={res.viewType} metaData={res.metaData}
                                expanded={expanded2}
                                handleChange={(panel) => handleChange(panel)}
                                {...res}
                            ></Customcasescard>
                        // </Grid>
                    ) 
                })}
            
        </Grid>    
    )
}