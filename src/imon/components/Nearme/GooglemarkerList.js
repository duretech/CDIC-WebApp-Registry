import React, { Component, createRef, } from 'react';
import * as _ from "lodash";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import BusinessIcon from '@material-ui/icons/Business';
import RoomIcon from '@material-ui/icons/Room';
import Accessrating from "./Accessrating.js";
import Services from '../../api/api';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import NearMeIcon from '@material-ui/icons/NearMe';
import SearchBar from "material-ui-search-bar";
import { removeSpacetoLowerCase } from '../../api/helper';
import imgUrl from "../../assets/images/imageUrl";
import CategoryIcon from '@material-ui/icons/Category';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DirectionsIcon from '@material-ui/icons/Directions';

class GoogleMarkerList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markerList: this.props.markerList,
    }
    this.handleOnSearch = this.handleOnSearch.bind(this);
  }

  handleClick(mark, param){
    try{
      if(window.cardova){
        if(window.cordova.plugins.launchnavigator){
          window.cordova.plugins.launchnavigator.navigate(
            [this.props.userposition[0],this.props.userposition[1]], 
            [mark.geometry.location.lat, mark.geometry.location.lng],
            function() {
            },
            function(error) {
            }, {
                preferGoogleMaps: true,
                enableDebug: true
            });
        }
      } else{
        if(this.props && this.props.userposition && mark && mark.geometry && mark.geometry.location){
          var url = "http://maps.google.com/?saddr=" + this.props.userposition[0] + "," + this.props.userposition[1] + "&daddr=" + mark.geometry.location.lat + "," + mark.geometry.location.lng;
          window.open(url, "_system");
        }
      }
    }catch(err){
      console.log(err)
    }
  }

  handleOnSearch(e){
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



  render() {
    var list = []
    if (this.state && this.state.markerList && this.state.markerList.length > 0) {
      this.state.markerList.map((mark, i) => {
        list.push(
          <Grid key={i} container spacing={3} className="gridcontainer maplistcontainerdiv">
            {/*<Grid item xs={2} className="zero text-center">
              <p className="zero hospitalicon"><img src={imgUrl.mapdefult} /> </p>
            </Grid>*/}
            <Grid item xs={12} className="zero">
              <p className="zero listname mb-15px">{mark.name}</p>
               <Grid container spacing={0} className="gridcontainer mt-10px">
        <Grid item xs={1}>
          <p className="zero listsubtext"><CategoryIcon/></p>
        </Grid>
        <Grid item xs={11}>
          <p className="zero listsubtext">{mark.types[0]}</p>
        </Grid>
        </Grid>

         <Grid container spacing={0} className="gridcontainer mt-10px">
        <Grid item xs={1}>
          <p className="zero listsubtext"><LocationOnIcon/></p>
        </Grid>
        <Grid item xs={11}>
          <p className="zero listsubtext">{mark.vicinity}</p>
        </Grid>
        </Grid>
              
              
              <p className="zero mt-10px"><button className="nearmebutton" onClick={() => this.handleClick(mark)}><DirectionsIcon></DirectionsIcon> Directions</button></p>
            </Grid>
          </Grid>
        )
      })
    }
    return (
      <div>
      <SearchBar
        className="getaccess-searchbar"
        onChange={this.handleOnSearch}
      />
      <div>{list}</div>
    </div>
    )
  }
}

export default GoogleMarkerList;