import React from "react";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import HomeIcon from "@material-ui/icons/Home";
import imgUrl from "../../assets/images/imageUrl.js";

const InnerHeader = () =>  {
  let history = useHistory();

  function handleBack() {
    history.goBack();
  }
  
    return (
      <>
        <Grid item xs={12} className="zero">
          <div className="onboardingheaderdiv">
            <Grid container spacing={3} className="gridcontainer">
              <Grid item xs={1} className="zero">
                <IconButton
                  edge="start"
                  className="menubtn"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => handleBack()}
                >
                  <ArrowBackIosIcon />
                </IconButton>
              </Grid>
              <Grid item xs={10} className="zero">
                <p className="zero text-center">
                  <img
                    className="oneimpactlogoimg"
                    src={imgUrl.logo}
                  />
                </p>
              </Grid>
              <Grid item xs={1} className="zero">
                <IconButton
                  edge="end"
                  className="menubtn"
                  color="inherit"
                  aria-label="home"
                  className="homeicon-btn"
                >
                  <HomeIcon />
                </IconButton>
              </Grid>
            </Grid>
            <p className="getonboardedtext text-center">&nbsp; &nbsp; &nbsp;  </p>
            <div className="custom-shape-divider-bottom-1599722124">
              <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
                  className="shape-fill"
                ></path>
              </svg>
            </div>
          </div>
        </Grid>
      </>
    );
  
}

export default InnerHeader;
