import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';

import Getaccesstabs from './Getaccesstabs';

class Getaccess extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    }
  }

  render() {
    return (
      <div className="getaccess-page red-page">
        <div>
          <Grid container spacing={3} className="gridcontainer">
            <Grid item xs={12} className="zero">
              <Getaccesstabs></Getaccesstabs>
            </Grid>
          </Grid>
        </div>
        <Fab color="primary" aria-label="add" className="getaccess-floatingbtn">
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

export default Getaccess;