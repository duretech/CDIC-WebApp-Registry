import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { Table } from 'react-bootstrap';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className='accordion-alerttab'>
      <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Treatment Monitoring</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="patientalerts-table">
            {/* <p className="table-heading">Pending Alerts</p> */}
            <Table hover className="table-alert">
              <thead>
                <tr>
                  <th>Alert Type</th>
                  <th>Pending since (days)</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Insulin adherence not updated</td>
                  <td>3</td>
                  <td className="bg-red"></td>
                </tr>
                <tr>
                  <td>Update your latest HbA1C level</td>
                  <td>7</td>
                  <td className="bg-amber"></td>
                </tr>
                <tr>
                  <td>Incomplete daily glucose log</td>
                  <td>2</td>
                  <td className="bg-red"></td>
                </tr>
                <tr>
                  <td>Lipid profile not updated</td>
                  <td>10</td>
                  <td className="bg-amber"></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Health Assessment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="patientalerts-table">
            {/* <p className="table-heading">Pending Alerts</p> */}
            <Table hover className="table-alert">
              <thead>
                <tr>
                  <th>Alert</th>
                  <th>Pending since (days)</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Missed eye exam with Dr.Jean</td>
                  <td>15</td>
                  <td className="bg-amber"></td>
                </tr>
                <tr>
                  <td>Your insulin prescription refill is due.</td>
                  <td>1</td>
                  <td className="bg-red"></td>
                </tr>
                <tr>
                  <td>Log your latest height and weight readings</td>
                  <td>10</td>
                  <td className="bg-amber"></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
