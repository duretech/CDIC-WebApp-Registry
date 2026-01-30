import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import Sectiondatepicker from './sectiondatepicker.js';

import '../../assets/css/customstyles.css'

import Sectionlayoutradio from './sectionlayoutradio.js';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function SimpleAccordion() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>D.PSYCHOSOCIAL</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div>
              <p className="sectionquestiontitle">1.Emotion</p>
            </div>
            <div>
              <Grid container spacing={3} className="">
              <Grid item xs={12} sm={6} md={6} lg={3}>
               <div className="sectionscorefirstcontainer">
                <p>Score 1</p>
                <Sectionlayoutradio></Sectionlayoutradio>
               </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
               <div className="sectionscorefirstcontainer">
                <p>Planned interventions</p>
                 <TextField
                    id="standard-helperText"
                    label=""
                    defaultValue="Default Value"
                    helperText=""
                  />
               </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
               <div className="sectionscorefirstcontainer datepicker">
                <p>Completion time</p>
                 <Sectiondatepicker></Sectiondatepicker>
               </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
              <div className="sectionscorefirstcontainer">
               <p>Monitoring of implementation status</p>
                 <TextField
                    id="standard-helperText2"
                    label=""
                    defaultValue="Default Value"
                    helperText=""
                  />
              </div>
              </Grid>
              
            </Grid>
            </div>
          </Typography>
           <Typography className="mt-30px">
            <div>
              <p className="sectionquestiontitle">2.Comportement Social </p>
            </div>
            <div>
              <Grid container spacing={3} className="">
              <Grid item xs={12} sm={6} md={6} lg={3}>
               <div className="sectionscorefirstcontainer">
                <p>Score 1</p>
                <Sectionlayoutradio></Sectionlayoutradio>
               </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
               <div className="sectionscorefirstcontainer">
                <p>Planned interventions</p>
                 <TextField
                    id="standard-helperText"
                    label=""
                    defaultValue="Default Value"
                    helperText=""
                  />
               </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
               <div className="sectionscorefirstcontainer datepicker">
                <p>Completion time</p>
                 <Sectiondatepicker></Sectiondatepicker>
               </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
              <div className="sectionscorefirstcontainer">
               <p>Monitoring of implementation status</p>
                 <TextField
                    id="standard-helperText2"
                    label=""
                    defaultValue="Default Value"
                    helperText=""
                  />
              </div>
              </Grid>
              
            </Grid>
            </div>
          </Typography>
          <Typography className="mt-30px">
            <div>
              <p className="sectionquestiontitle">3.Emotional Development</p>
            </div>
            <div>
              <Grid container spacing={3} className="">
              <Grid item xs={12} sm={6} md={6} lg={3}>
               <div className="sectionscorefirstcontainer">
                <p>Score 1</p>
                <Sectionlayoutradio></Sectionlayoutradio>
               </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
               <div className="sectionscorefirstcontainer">
                <p>Planned interventions</p>
                 <TextField
                    id="standard-helperText"
                    label=""
                    defaultValue="Default Value"
                    helperText=""
                  />
               </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
               <div className="sectionscorefirstcontainer datepicker">
                <p>Completion time</p>
                 <Sectiondatepicker></Sectiondatepicker>
               </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
              <div className="sectionscorefirstcontainer">
               <p>Monitoring of implementation status</p>
                 <TextField
                    id="standard-helperText2"
                    label=""
                    defaultValue="Default Value"
                    helperText=""
                  />
              </div>
              </Grid>
              
            </Grid>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
     
    </div>
  );
}
