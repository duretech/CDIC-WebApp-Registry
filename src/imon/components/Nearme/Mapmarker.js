import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import { withRouter, useHistory } from "react-router-dom";
import NavigationIcon from '@material-ui/icons/Navigation';
import NearMeIcon from '@material-ui/icons/NearMe';
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
import { removeSpacetoLowerCase } from '../../api/helper';
import imgUrl from "../../assets/images/imageUrl";
import { logError } from "../../helpers/auth";



class MapMarker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markerList: [],
    };
    this.handleChangeRatings = this.handleChangeRatings.bind(this);
  }

  handleChangeRatings(newValue, id) {
    if(this.props){
      this.props.markerList.forEach((element) => {
        if (element.id == id) {
          element.avgRatings = newValue;
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

    //console.log("submitNewRatings>>>", param);
    Services.saveupdatenearmerating(param).then((data) => {
      try{
        if (data && data.data.length > 0) {
        }
      }catch(err){
        console.log("err::", err)
        var errorObj = {
          component: 'MapmarkerList',
          method: 'submitNewRatings',
          error: err
        }
        logError(errorObj);
      }
    });
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

  NewlineText(text) {
    return text.split('\n').map(str => <p className="nearmeDesc">{str}</p>);
  }

  getMarkerList(markerList) {
    var list = [];
    const { t } = this.props;

    markerList.map((mark) => {
      //console.log('getMarkerList>>', mark)
      //let iconMarkup = pointerPharmacyIcon;
      // if(removeSpacetoLowerCase(mark.type) == 'bloodbank') {
      //   iconMarkup = pointerPharmacyIcon;
      // } else if (removeSpacetoLowerCase(mark.type) == 'hospitals') {
      //   iconMarkup = pointerHospitalIcon;
      // }  else if (removeSpacetoLowerCase(mark.type) == 'psychsocialsupport') {
      //   iconMarkup = ngoIcon;
      // } else if (removeSpacetoLowerCase(mark.type) == 'nationaltbcommunitynetwork') {
      //   iconMarkup = governmentofficeIcon;
      // } else if (removeSpacetoLowerCase(mark.type) == 'laboratories') {
      //   iconMarkup = pointerPharmacyIcon;
      // } else if (removeSpacetoLowerCase(mark.type) == 'peersupportgroups') {
      //   iconMarkup = privateofficeIcon;
      // } else if (removeSpacetoLowerCase(mark.type) == 'tbdotscenters') {
      //   iconMarkup = screenningcenterIcon;
      // } else if (removeSpacetoLowerCase(mark.type) == 'testingcenter') {
      //   iconMarkup = testingcenterIcon;
      // }else if (removeSpacetoLowerCase(mark.type) == 'socialwelfareservices') {
      //   iconMarkup = treatmentcenterIcon;
      // }

      //console.log(this.props.markerTypeObj)

      var iconUrl = this.props.markerTypeObj.filter(obj => obj.type == mark.type)[0]['iconUrl']
      var iurl = iconUrl != "" ? iconUrl : imgUrl.mapdefult;
      let markericons = new L.Icon({
        iconUrl: iurl,
        iconAnchor: [5, 55],
        popupAnchor: [10, -44],
        iconSize: [50, 50],
        shadowUrl: null,
        shadowSize: [68, 95],
        shadowAnchor: [20, 92],
      })

      list.push(
        <Marker
          key={mark.id}
          icon={markericons}
          position={[parseFloat(mark.latitude), parseFloat(mark.longitude)]}
        >
          <Popup>
            <h3>{mark.name}  <button className="nearmebutton" onClick={() => this.handleClick(mark)}><NearMeIcon></NearMeIcon></button></h3>
            <Grid item xs={12} className="zero">
              {
                mark.address && (
                  <p className="zero listsubtext">
                    Address: {mark.address + " ," + mark.country}
                  </p>
                )
              }

              <p className="zero listsubtext">{t("Category")}: {mark.type}</p>
              {
                mark.email && (
                  <p className="zero listsubtext">{t("Email")} : {mark.email}</p>
                )
              }
              {
                mark.phone && (
                  <p className="zero listsubtext">{t("Contact")} : {mark.phone}</p>
                )
              }
              {
                mark.description && (
                  <p className="zero listsubtext">{t("Description")} : {this.NewlineText(mark.description)}</p>
                )
              }
            </Grid>
            <Grid item xs={12} className="zero ">
              <Box component="fieldset" mb={0} borderColor="transparent">
                <span className="zero distancetext">{t("Rating")}: </span>
                <Rating
                  name={mark.id + "-simple-controlled"}
                  value={mark.avgRatings}
                  onChange={(event, newValue) => {
                    this.handleChangeRatings(newValue, mark.id);
                  }}
                />
              </Box>
              <p className="zero distancetext">
                {t("Location")}: {mark.distance} {t("Kilometres")}
              </p>
            </Grid>
          </Popup>
        </Marker>
      );
    });
    return list;
  }

  // getControlaLayer() {
  //   var layer = [];
  //   this.props.markerType.map((t, i) => {
  //     layer.push(
  //       <LayersControl.Overlay key={i} name={t} checked={true}>
  //         <LayerGroup>
  //           {this.getMarkerList(
  //             this.props.markerList.filter((obj) => obj.type == t)
  //           )}
  //         </LayerGroup>
  //       </LayersControl.Overlay>
  //     );
  //   });
  //   return layer;
  // }

  render() {
    var list = [];
    if (this.props.markerType && this.props.markerType.length > 0) {
      var markerlist = this.props.markerList.filter((obj) => this.props.markerType.includes(obj.type))
      list = this.getMarkerList(markerlist)
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

const transMapMarker = withTranslation()(MapMarker);
const routeMapMarker = withRouter(transMapMarker);
export default connect(mapStateToProps, {})(routeMapMarker);
