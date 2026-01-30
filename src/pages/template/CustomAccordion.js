import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomList from './CustomList.js'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingBottom:'0px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '20%',
    flexShrink: 0,
    color: '#333',
    fontWeight:'bold',
    // fontFamily: 'IBM Plex Sans',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: '#fff',
    // fontFamily: 'IBM Plex Sans',
  },
  customaccordionheader: {
    marginBottom:'15px',
    backgroundColor: '#61a6bf',
    borderRadius:'4px',
  },
  summarycontainer:{
    backgroundColor: '#fff',
    padding:'10px',
  },
}));

export default function ControlledAccordions() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Accordion className={classes.customaccordionheader} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
         
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Case</Typography>
          <Typography className={classes.secondaryHeading}>Fernandes , Alvaro</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.summarycontainer}>
          <Typography>
            <CustomList>

              </CustomList>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.customaccordionheader} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Contact</Typography>
          <Typography className={classes.secondaryHeading}>
            Doe , John
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.summarycontainer}>
          <Typography>
            <CustomList>

              </CustomList>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.customaccordionheader} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>Case</Typography>
          <Typography className={classes.secondaryHeading}>
            William , Drake
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.summarycontainer}>
          <Typography>
             <CustomList>

              </CustomList>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.customaccordionheader} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>Case</Typography>
          <Typography className={classes.secondaryHeading}>
            Johnson , Janet
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.summarycontainer}>
          <Typography>
             <CustomList>

              </CustomList>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}