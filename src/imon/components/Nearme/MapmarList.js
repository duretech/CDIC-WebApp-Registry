import React, { Component, createRef, } from 'react';
import { withTranslation, Trans } from "react-i18next";
import * as _ from "lodash";
import { connect } from "react-redux";
import Loader from '../loaders/loader.js';
import { withRouter, useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import BusinessIcon from '@material-ui/icons/Business';
import RoomIcon from '@material-ui/icons/Room';
import Accessrating from "./Accessrating.js";
import Services from '../../api/api';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SearchBar from "material-ui-search-bar";
import { removeSpacetoLowerCase } from '../../api/helper';
import NearMeIcon from '@material-ui/icons/NearMe';
import imgUrl from "../../assets/images/imageUrl";
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
import DirectionsIcon from '@material-ui/icons/Directions';
import CategoryIcon from '@material-ui/icons/Category';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import DescriptionIcon from '@material-ui/icons/Description';
import { logError } from '../../helpers/auth.js';

class MarkerList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      markerList: this.props.markerList,
      originalList: this.props.markerList,
    }
    this.handleChangeRatings = this.handleChangeRatings.bind(this);
    this.handleOnSearch = this.handleOnSearch.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
  }
  componentDidMount() {
    gaLogEvent("Map marker", '', '');
    gaLogScreen("MapList");
  }
  handleChangeRatings(newValue, id) {
    if(this.state){
      this.state.markerList.forEach((element) => {
        if (element.id == id) {
          element.avgRatings = newValue;
          console.log(element)
          this.submitNewRatings(element);
        }
      });
      this.setState({ markerList: this.state.markerList });
    }
  }

  submitNewRatings(obj) {
    var param = {
      communityId: localStorage.getItem("CommunityId"),
      applicantId: 1,
      rate: obj.avgRatings,
      nearmeId: obj.id,
      scope: "private",
    };

    console.log("submitNewRatings>>>", param);
    Services.saveupdatenearmerating(param).then((data) => {
      try{
        if (data.data.length > 0) {
        }
      }catch(err){
        console.log("err::", err)
        var errorObj = {
          component: 'MapmarList',
          method: 'submitNewRatings',
          error: err
        }
        logError(errorObj);
      }
    });
  }

  getMarkeImg(mark) {
    try{
      if(this.props){
        var iconUrl = imgUrl.mapdefult
        var classname = 'defulticon'
        if (this.props.markerType && this.props.markerType.length) {
          var filterobj = this.props.markerType.filter(obj => obj.type == mark.type)
          if (filterobj.length && filterobj.length > 0) {
            iconUrl = filterobj[0]['iconUrl'] != "" ? filterobj[0]['iconUrl'] : imgUrl.mapdefult;
            classname = filterobj[0]['iconUrl'] != "" ? '' : 'defulticon';
          }
        }
        // var iconUrl = this.props.markerType.length > 0 ? this.props.markerType.filter(obj => obj.type == mark.type)[0]['iconUrl'] : imgUrl.hospital;
        return <img src={iconUrl} className={classname} />
      }
    }catch(err){
      console.log(err)
    }
  }

  handleClick(mark, param) {
    try{
      if (window.cardova) {
        if (window.cordova.plugins.launchnavigator) {
          window.cordova.plugins.launchnavigator.navigate(
            [this.props.userposition[0], this.props.userposition[1]],
            [parseFloat(mark.latitude), parseFloat(mark.longitude)],
            function () {
            },
            function (error) {
            }, {
            preferGoogleMaps: true,
            enableDebug: true
          });
        }
      } else {
        if(this.props && this.props.userposition && mark){
          var url = "http://maps.google.com/?saddr=" + this.props.userposition[0] + "," + this.props.userposition[1] + "&daddr=" + parseFloat(mark.latitude) + "," + parseFloat(mark.longitude);
          window.open(url, "_system");
        }
      }
    }catch(err){
      console.log(err)
    }
  }

  handleOnSearch(e) {
    try{
      if(this.props){
        let topicList = _.cloneDeep(this.props.markerList);
        let filtered = [];
        filtered = topicList.filter(function (str) {
          return removeSpacetoLowerCase(str.name).indexOf(removeSpacetoLowerCase(e)) !== -1;
        });
        if (e.length == 0) {
          filtered = _.cloneDeep(this.props.markerList);
        }
        this.setState({
          markerList: filtered,
        });
      }
    }catch(err){
      console.log(err)
    }

  }

  cancelSearch(e) {
    if(this.state && this.state.originalList){
      this.setState({
        markerList: this.state.originalList,
      });
    }
  }

  NewlineText(text) {
    return text.split('\n').map(str => <p className="nearmeDesc">{str}</p>);
  }

  render() {
    const { t } = this.props;
    var list = []
    if (this.state.markerList && this.state.markerList.length > 0) {


      //   this.state.markerList.sort(function(a, b) {
      //     return parseFloat(a.distance) - parseFloat(b.distance);
      // });

      this.state.markerList.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      this.state.markerList.map((mark) => {
        list.push(
          <Grid key={mark.id} container spacing={3} className="gridcontainer maplistcontainerdiv maplistingitems">
            {/*<Grid item xs={2} className="zero text-center">
              <p className="zero hospitalicon">
                {this.getMarkeImg(mark)}
              </p>
            </Grid>*/}
            <Grid item xs={8} className="zero">
              <Grid container spacing={0} className="gridcontainer">
                <Grid item xs={3}>
                  <p className="zero hospitalicon">
                    {this.getMarkeImg(mark)}
                  </p>
                </Grid>
                <Grid item xs={9}>
                  <p className="zero listname word-break-word">{mark.name} </p>
                </Grid>
              </Grid>
              {/*<p className="zero listname">{mark.name} </p>*/}
              
              <Grid container spacing={0} className="gridcontainer mt-10px">
                <Grid item xs={3}>
                  {/* <p className="zero listsubtext"><CategoryIcon /> </p> */}
                </Grid>
                <Grid item xs={9}>
                  <p className="zero listsubtext word-break-word">{mark.type} </p>
                </Grid>
              </Grid>
              
              {
                mark.phone && (<Grid container spacing={0} className="gridcontainer mt-10px">
                  <Grid item xs={3}>
                    <p className="zero listsubtext"><PhoneIcon /></p>
                  </Grid>
                  <Grid item xs={9}>
                    <p className="zero listsubtext word-break-word">{mark.phone}</p>
                  </Grid>
                </Grid>)
              }



              {
                mark.email && (
                  <Grid container spacing={0} className="gridcontainer mt-10px">
                    <Grid item xs={3}>
                      <p className="zero listsubtext"><EmailIcon /></p>
                    </Grid>
                    <Grid item xs={9}>
                      <p className="zero listsubtext word-break-word">{mark.email}</p>
                    </Grid>
                  </Grid>

                )
              }
              {
                mark.description && (

                  <Grid container spacing={0} className="gridcontainer mt-10px">
                    <Grid item xs={3}>
                      <p className="zero listsubtext desc_icon"><DescriptionIcon /></p>
                    </Grid>
                    <Grid item xs={9}>
                      <p className="zero listsubtext word-break-word">{this.NewlineText(mark.description)}</p>
                    </Grid>
                  </Grid>

                )
              }
            </Grid>
            <Grid item xs={4} className="zero text-center">
              {/* <Accessrating rating={mark.avg_ratings} handleChangeRation={(newValue) => this.handleChangeRation(mark, newValue)}></Accessrating> */}
              <Box component="fieldset" mb={0} borderColor="transparent">
                <Rating
                  name={mark.id + "-simple-controlled"}
                  value={mark.avgRatings}
                  onChange={(event, newValue) => {
                    this.handleChangeRatings(newValue, mark.id)
                  }}
                />
              </Box>
              <p className="zero distancetext"><button className="nearmebutton" onClick={() => this.handleClick(mark)}><DirectionsIcon></DirectionsIcon></button> {mark.distance} <Trans> {t("Kilometres")} </Trans></p>
            </Grid>
          </Grid>
        )
      })
    } else {
      list.push(<div className="nodrecordfound">{t('No Record Found')}</div>)
    }
    return (
      <div>
        <SearchBar
          placeholder={t('Search')}
          className="getaccess-searchbar"
          onChange={this.handleOnSearch}
          onCancelSearch={this.cancelSearch}
        />
        <div>{list}</div>
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
};

const transMarkerList = withTranslation()(MarkerList);
const routeMarkerList = withRouter(transMarkerList);
export default connect(mapStateToProps, {})(routeMarkerList);