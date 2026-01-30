import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation, Trans } from "react-i18next";
import parse from 'html-react-parser';
import classnames from 'classnames';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import imgUrl from '../../assets/images/imageUrl';
import Services from '../../api/api';
import { Link } from 'react-router-dom'
import { logError } from '../../helpers/auth';


class Tos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      content:''
    }
  }

  componentDidMount() {
    this.getdata()
  };

  getdata(){
    var param = {
      "componentId":18,
      "communityId": localStorage.getItem("CommunityId"),
      "staticdataType": "tos",
      "languageId": localStorage.getItem("langId")
    }
    Services.getsetupDetails(param).then(data => {
      try{
        console.log(data)
        this.setState({ content: data.data.communityStaticDataList.content})
      }catch(err){
        console.log("err::", err)
        var errorObj = {
          component: 'tos',
          method: 'getdata',
          error: err
        }
        logError(errorObj);
      }
    })
  }

  render() {
    const { t } = this.props;
    let content = this.state.content;
    return (
      <div className="tos-page">
        <AppBar position="static" className="secondary-header">
          <Toolbar>
            <Link to="/">
              <IconButton edge="start" className="menubtn" color="inherit" aria-label="menu">
                <ArrowBackIosIcon />
              </IconButton>
            </Link>

            <Typography variant="h6" className="application-title">
              <Trans> {t("Qos")}  </Trans>
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Grid container spacing={3} className="gridcontainer">
            <Grid item xs={12}>
              {parse(content)}
            </Grid>
            <Grid item xs={12} className="text-center">
              <div className="getstarted-btn-holder">
              <Link to="/layout">
                <Button variant="contained" color="primary" disableElevation className="getstarted-btn">
                  <Trans> {t("agree")}  </Trans>
                </Button>
                </Link>
              </div>
            </Grid>
            <Grid item xs={12}>
              <p className="mb-0 text-center">
                <img className="poweredbyimg" src={imgUrl.poweredby} />
              </p>
            </Grid>

          </Grid>
        </div>
      </div>

    );
  }
}

const mapStateToProps = state => {
  let { storeState } = state;
  console.log(state)
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
}

let newTos = withTranslation()(Tos);
export default connect(mapStateToProps, {})(newTos)