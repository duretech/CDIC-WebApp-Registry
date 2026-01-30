import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import L from 'leaflet';
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  FeatureGroup,
  LayerGroup,
  LayersControl,
} from "react-leaflet";
import Grid from "@material-ui/core/Grid";
import Rating from "@material-ui/lab/Rating";
import Services from "../../api/api";
import Box from "@material-ui/core/Box";

import { renderToStaticMarkup } from 'react-dom/server';
import {removeSpacetoLowerCase} from '../../api/helper';
import imgUrl from "../../assets/images/imageUrl";


export const pointerHospitalIcon = new L.Icon({
  iconUrl: imgUrl.hospital,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [50, 50],
  shadowUrl: null,
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

export const pointerPharmacyIcon = new L.Icon({
  iconUrl: imgUrl.pharmacy,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [50, 50],
  shadowUrl: null,
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

export const ngoIcon = new L.Icon({
  iconUrl: imgUrl.ngo,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [50, 50],
  shadowUrl: null,
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

export const governmentofficeIcon = new L.Icon({
  iconUrl: imgUrl.governmentoffice,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [50, 50],
  shadowUrl: null,
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

export const privateofficeIcon = new L.Icon({
  iconUrl: imgUrl.privateoffice,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [50, 50],
  shadowUrl: null,
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

export const screenningcenterIcon = new L.Icon({
  iconUrl: imgUrl.screenningcenter,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [50, 50],
  shadowUrl: null,
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

export const testingcenterIcon = new L.Icon({
  iconUrl: imgUrl.testingcenter,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [50, 50],
  shadowUrl: null,
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

export const treatmentcenterIcon = new L.Icon({
  iconUrl: imgUrl.treatmentcenter,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [50, 50],
  shadowUrl: null,
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})

// var myIcon = L.divIcon({className: 'my-div-icon'});

class MapMarker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markerList: [],
    };
    this.handleChangeRatings = this.handleChangeRatings.bind(this);
  }

 
  handleChangeRatings(newValue, id) {
    this.state.markerList.forEach((element) => {
      if (element.id == id) {
        element.avgRatings = newValue;
        console.log(element);
        this.submitNewRatings(element);
      }
    });
    this.setState({ markerList: this.state.markerList });
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
        console.log("saveupdatenearmerating>>", data);
        if (data.data.length > 0) {
        }
      }catch(err){
        console.log("err::", err)
      }
    });
  }

  getMarkerList(markerList) {
    var list = [];

    markerList.map((mark) => {
      console.log('getMarkerList>>', mark)
      let iconMarkup = null;
      if(removeSpacetoLowerCase(mark.type) == 'bloodbank') {
        iconMarkup = pointerPharmacyIcon;
      } else if (removeSpacetoLowerCase(mark.type) == 'hospital') {
        iconMarkup = pointerHospitalIcon;
      }  else if (removeSpacetoLowerCase(mark.type) == 'NGO') {
        iconMarkup = ngoIcon;
      } else if (removeSpacetoLowerCase(mark.type) == 'Govt. Office') {
        iconMarkup = governmentofficeIcon;
      } else if (removeSpacetoLowerCase(mark.type) == 'Pharmacies') {
        iconMarkup = pointerPharmacyIcon;
      } else if (removeSpacetoLowerCase(mark.type) == 'Private Office') {
        iconMarkup = privateofficeIcon;
      } else if (removeSpacetoLowerCase(mark.type) == 'Screening Center') {
        iconMarkup = screenningcenterIcon;
      } else if (removeSpacetoLowerCase(mark.type) == 'Testing Center') {
        iconMarkup = testingcenterIcon;
      }else if (removeSpacetoLowerCase(mark.type) == 'Treatment Center') {
        iconMarkup = treatmentcenterIcon;
      }
      
      // const customMarkerIcon = L.divIcon({
      //   html: iconMarkup,
      // });

      // var redMarker = L.AwesomeMarkers.icon({
      //   icon: 'coffee',
      //   markerColor: 'red'
      // });

      list.push(
        <Marker
          key={mark.id}
          icon={iconMarkup}
          position={[parseFloat(mark.latitude), parseFloat(mark.longitude)]}
        >
          <Popup>
            <h3>{mark.name}</h3>
            <Grid item xs={12} className="zero">
              <p className="zero listsubtext">
                Address: {mark.address + " ," + mark.country}
              </p>
              <p className="zero listsubtext">Category: {mark.type}</p>
              <p className="zero listsubtext">Contact : {mark.phone}</p>
            </Grid>
            <Grid item xs={12} className="zero ">
              <Box component="fieldset" mb={0} borderColor="transparent">
                <span className="zero distancetext">Rating: </span>
                <Rating
                  name={mark.id + "-simple-controlled"}
                  value={mark.avgRatings}
                  onChange={(event, newValue) => {
                    this.handleChangeRatings(newValue, mark.id);
                  }}
                />
              </Box>
              <p className="zero distancetext">
                Location: {mark.distance} Miles away
              </p>
            </Grid>
          </Popup>
        </Marker>
      );
    });
    return list;
  }

  getControlaLayer() {
    var layer = [];
    this.props.markerType.map((t, i) => {
      layer.push(
        <LayersControl.Overlay key={i} name={t} checked={true}>
          <LayerGroup>
            {this.getMarkerList(
              this.props.markerList.filter((obj) => obj.type == t)
            )}
          </LayerGroup>
        </LayersControl.Overlay>
      );
    });
    return layer;
  }

  render() {
    var list = [];
    if (this.props.markerType.length > 0) {
      list.push(
        <LayersControl key="123" position="topleft" collapsed={false}>
          {this.getControlaLayer()}
        </LayersControl>
      );
    }
    return <div>{list}</div>;
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
};

const routeMapMarker = withRouter(MapMarker);
export default connect(mapStateToProps, {})(routeMapMarker);
