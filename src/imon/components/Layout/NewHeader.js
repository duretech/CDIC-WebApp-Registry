import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import imgUrl from '../../assets/images/imageUrl.js';

class NewHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    }
  }

  render() {
    return (
      <>
        <AppBar position="static" className="secondary-header header">
          <Grid item xs={12} className="zero">
            <div className="homepageheaderdiv">
              <p className="zero text-center">
                <img className="oneimpactlogoimg" src={imgUrl.logo} />
              </p>
              <p className="getonboardedtext text-center">
                HOMEPAGE
            </p>
              <div className="custom-shape-divider-bottom-1599722124">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" className="shape-fill"></path>
                </svg>
              </div>
            </div>
          </Grid>
        </AppBar>
      </>
    );
  }
}

export default NewHeader;