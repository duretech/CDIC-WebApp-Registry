import React, { Component, createRef, } from 'react';
import { Map, Marker, Popup, TileLayer, Tooltip, FeatureGroup, LayerGroup, LayersControl } from 'react-leaflet';
import L from 'leaflet'
import Grid from "@material-ui/core/Grid";
import Rating from '@material-ui/lab/Rating';
import Services from '../../api/api';
import Box from '@material-ui/core/Box';
import { Icon } from "leaflet";
import NearMeIcon from '@material-ui/icons/NearMe';
import imgUrl from "../../assets/images/imageUrl";


export const pointerHospitalIcon = new L.Icon({
  iconUrl: imgUrl.mapdefult,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [50, 50],
  shadowUrl: null,
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

class Googlemarker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markerList: [],
    }

  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({ markerList: props.markerList });
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

  getMarkerList(markerList) {
    try{
      var list = []
      markerList.map((mark, i) => {
        // let skater = new Icon({
        //   iconUrl: mark.icon,
        //   iconSize: [25, 25]
        // });
        if(mark.geometry && mark.geometry.location){
          list.push(
            <Marker key={i} icon={pointerHospitalIcon} position={[mark.geometry.location.lat, mark.geometry.location.lng]}>
              <Popup>
                <h3>{mark.name} <button className="nearmebutton" onClick={() => this.handleClick(mark)}><NearMeIcon></NearMeIcon></button></h3>
                <Grid item xs={12} className="zero">
                <p className="zero listsubtext">Category: {mark.types[0]}</p>
                  <p className="zero listsubtext">Address: {mark.vicinity}</p>
                </Grid>
              </Popup>
            </Marker>
          )
        }
      })
      return list;
    }catch(err){
      console.log(err)
    }
  }


  render() {
    var list = []
    if (this.props && this.props.markerList && this.props.markerList.length > 0) {
      list = this.getMarkerList(this.props.markerList)
    }
    return (
      <div>{list}</div>
    )
  }
}

export default Googlemarker;