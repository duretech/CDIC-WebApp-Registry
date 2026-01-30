import React, { Component } from 'react';
import i18next from 'i18next';
import { withTranslation, Trans } from "react-i18next";
import i18n from "../../config/i18n";
import classnames from 'classnames';
import Loader from '../loaders/loader';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Langselect from './Langselect.js';
import Services from '../../api/api';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setLangID } from '../../redux/actions/appActions'
import { logError } from '../../helpers/auth';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    }

    this.getTranlation = this.getTranlation.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(localStorage.getItem("langId") != nextProps.langId) {
      this.getTranlation(nextProps.langId)
      return true
    }
    return false;
  }


  componentDidMount() {
    this.getTranlation(localStorage.getItem("langId"))
  };

  getTranlation(id) {
    if (navigator.onLine) {
      console.log('acvv',this.props)
      var param = { 
        "communityId": localStorage.getItem("CommunityId"),
        labelType : 'Mobile', 
        "languageId": id 
      }
      console.log("getCommunitywiseLabelsparams::",param)
      Services.getCommunitywiseLabels(param).then(data => {
        try{
          console.log(data.data)
          console.log(i18next)
          if (data.data.status == 'SUCCESS') {
            let lan = data.data.translationList.locale;
            let tran = data.data.translationList.label;
            i18next.addResourceBundle(lan, 'translations', tran, true, true);
            i18next.changeLanguage(lan);
            this.props.setLangID(id)
          }
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'GetStarted',
            method: 'getTranlation',
            error: err
          }
          logError(errorObj);
        }
      })
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div className="getstarted-page">
        <Loader isLoading={this.state.isLoading} />
        <div>
          <Grid container spacing={3} className="gridcontainer">
            <Grid item xs={12}>
              <div>
                <p className="mb-0 text-center">

                </p>
              </div>
            </Grid>
            <Grid item xs={12} className="zero">
              <div className="zero">
                <p className="text-center mb-0 versioninfo">
                  <Trans><span>{t("versionTxt")} </span> </Trans>
                </p>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Langselect getTranlation={this.getTranlation} ></Langselect>
            </Grid>
            <Grid item xs={12} className="text-center">
              <div className="getstarted-btn-holder">
                <Link to="/tos1">
                  <Button variant="contained" color="primary" disableElevation className="getstarted-btn">
                    <Trans><span>{t("start")} </span> </Trans>
                  </Button>
                </Link>
              </div>
            </Grid>
            <Grid item xs={12}>
              <p className="mb-0 text-center">
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

let newHome = withTranslation()(Home);
export default connect(mapStateToProps, { setLangID })(newHome)