import React, { Component } from "react";
import { withTranslation, Trans } from "react-i18next";
import Grid from "@material-ui/core/Grid";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Onboardinglanguage from "./Onboardinglanguage";

class Langpref extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <div className="gridcontainer">
          <Grid container spacing={3} className="gridcontainer">
            <Grid item xs={12} className="onboardingsliderdivcontent2">
              <div className="onboardingslider-container">
                <div>
                  <Onboardinglanguage></Onboardinglanguage>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Langpref);
