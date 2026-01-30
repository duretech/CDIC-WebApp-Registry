import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import '../../assets/css/customstyles.css'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function BasicTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className="primarytableheading">
            <TableCell colspan="3">NARRATIVE REPORT OF EVALUATIONS</TableCell>
          </TableRow>
          <TableRow className="secondarytableheading">
            <TableCell>Areas of Individual Needs Assessment</TableCell>
            <TableCell align="left">Priority Problems Observed (Assessment 1)</TableCell>
            <TableCell align="left">Comments (Rating 2)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="sectiontable">
            <TableRow>
              <TableCell component="th" scope="row">
               A.FOOD & NUTRITION
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
               B.HEALTH
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
               C.EDUCATION & PERFORMANCE
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
               D.PSYCHOSOCIAL
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
               E.ECONOMIC STRENGTHENING
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
               F.SHELTER/CARE
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
               G.PROTECTION
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
               H.PREVENTION
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
