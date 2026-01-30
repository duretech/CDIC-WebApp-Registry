import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomList from './CustomList.js'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import LinkIcon from '@material-ui/icons/Link';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';


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
  button:{
   backgroundColor: '#1a7798 !important',
   color:'#fff',
    width:'100%',
    marginTop: '-13px',
    fontSize:'13px',
    borderRadius: '0px',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
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
          <Typography className={classes.root}>
          <Grid container spacing={3} className={classes.buttoncontainer}>
            <Grid item xs={12} md={4}>
              <Button
        variant="contained"
        disableElevation
        color="default"
        className={classes.button}
        startIcon={<LinkIcon />}
      >
        Link Contact
      </Button>
            </Grid>
            <Grid item xs={12} md={4}>
             <Button
        variant="contained"
        disableElevation
        color="default"
        className={classes.button}
        startIcon={<VisibilityIcon />}
      >
        See Individual Record
      </Button>
            </Grid>
            <Grid item xs={12} md={4}>
             <Button
        variant="contained"
        color="default"
        disableElevation
        className={classes.button}
        startIcon={<EditIcon />}
      >
        New/Update Individual Record
      </Button>
            </Grid>
            </Grid>
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
          <Typography className={classes.root}>
          <Grid container spacing={3} className={classes.buttoncontainer}>
            <Grid item xs={12} md={4}>
              <Button
        variant="contained"
        disableElevation
        color="default"
        className={classes.button}
        startIcon={<LinkIcon />}
      >
        Link Contact
      </Button>
            </Grid>
            <Grid item xs={12} md={4}>
             <Button
        variant="contained"
        disableElevation
        color="default"
        className={classes.button}
        startIcon={<VisibilityIcon />}
      >
        See Individual Record
      </Button>
            </Grid>
            <Grid item xs={12} md={4}>
             <Button
        variant="contained"
        color="default"
        disableElevation
        className={classes.button}
        startIcon={<EditIcon />}
      >
        New/Update Individual Record
      </Button>
            </Grid>
            </Grid>
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
          <Typography className={classes.root}>
          <Grid container spacing={3} className={classes.buttoncontainer}>
            <Grid item xs={12} md={4}>
              <Button
        variant="contained"
        disableElevation
        color="default"
        className={classes.button}
        startIcon={<LinkIcon />}
      >
        Link Contact
      </Button>
            </Grid>
            <Grid item xs={12} md={4}>
             <Button
        variant="contained"
        disableElevation
        color="default"
        className={classes.button}
        startIcon={<VisibilityIcon />}
      >
        See Individual Record
      </Button>
            </Grid>
            <Grid item xs={12} md={4}>
             <Button
        variant="contained"
        color="default"
        disableElevation
        className={classes.button}
        startIcon={<EditIcon />}
      >
        New/Update Individual Record
      </Button>
            </Grid>
            </Grid>
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
          <Typography className={classes.root}>
          <Grid container spacing={3} className={classes.buttoncontainer}>
            <Grid item xs={12} md={4}>
              <Button
        variant="contained"
        disableElevation
        color="default"
        className={classes.button}
        startIcon={<LinkIcon />}
      >
        Link Contact
      </Button>
            </Grid>
            <Grid item xs={12} md={4}>
             <Button
        variant="contained"
        disableElevation
        color="default"
        className={classes.button}
        startIcon={<VisibilityIcon />}
      >
        See Individual Record
      </Button>
            </Grid>
            <Grid item xs={12} md={4}>
             <Button
        variant="contained"
        color="default"
        disableElevation
        className={classes.button}
        startIcon={<EditIcon />}
      >
        New/Update Individual Record
      </Button>
            </Grid>
            </Grid>
             <CustomList>

              </CustomList>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}