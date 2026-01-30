import React, { Component, createRef, } from 'react';
import { withTranslation, Trans } from "react-i18next";
// import Control from 'react-leaflet-control';
import Leaflet from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, FeatureGroup, LayerGroup, LayersControl } from 'react-leaflet';
// import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import FormGroup from '@material-ui/core/FormGroup';
import Fab from '@material-ui/core/Fab';
import FilterListIcon from '@material-ui/icons/FilterList';
import Services from '../../api/api';
import Mapmarker from './Mapmarker';
import GoogleMarker from './Googlemarker';
import Mapfiltercheckbox from "./mapfiltercheckbox";
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
import Loader from "../loaders/loader";
import imgUrl from "../../assets/images/imageUrl";
import L from 'leaflet';

class NearMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mapRef: null,
      isLoading: true,
      position: [],
      keyMAP: 0,
      lat: -17.895114303749143,
      lng: 38.41781616210938,
      zoom: 2,
      markerType: [],
      checkedArr: [],
      open: false
    };
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
    // this.handleClose = this.handleClose.bind(this)
    // this.handleClickOpen = this.handleClickOpen.bind(this);
    // this.handleCheckbox = this.handleCheckbox.bind(this);
    this.resetMap = this.resetMap.bind(this);

  }

  mapRef = createRef()

  componentDidMount() {
    gaLogEvent("Get Access", '', '');
    gaLogScreen("Map");
    console.log("props>>",this.props)
    // this.getCurrentLocation()
    this.setState({
      lat: this.props.position[0],
      lng: this.props.position[1],
      position: this.props.position
    })
    this.setState({
      isLoading: false,
      zoom: 16
    })
    this.props.togglevisible(true)
    this.setmarkerChecked()
  }

  componentDidUpdate(nextProps) {
    const { markerType,position } = this.props
    if (nextProps.markerType.length != markerType.length) {
      this.setState({ markerType: this.props.markerType, checkedArr: this.props.markerType.map(obj => obj.type) })
    }
    if(nextProps.position != position){
      this.setState({
        lat: this.props.position[0],
        lng: this.props.position[1],
        position: this.props.position
      })
    }
  }

  setmarkerChecked() {
    this.setState({ checkedArr: this.props.markerType.map(obj => obj.type) })
  }


  getCurrentLocation() {
    var that = this;
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let arr = [position.coords.latitude, position.coords.longitude]
        that.setState({ lat: position.coords.latitude, lng: position.coords.longitude, zoom: 16 })
        that.setState({ position: arr })
        that.setState({
          isLoading:false
        })
        that.props.togglevisible(true) 
      }, null, options)
    } else {
      that.setState({ position: [] })
    }
    // that.setState({
    //   isLoading:false
    // })
  }

  openPopup(marker) {
    try{
      if (marker && marker.leafletElement) {
        window.setTimeout(() => {
          marker.leafletElement.openPopup()
        })
      }
    }catch(err){
      console.log(err)
    }
  }

  // handleClose() {
  //   this.setState({ open: false });
  // }

  // handleClickOpen() {
  //   this.setState({ open: true });
  // }

  // handleCheckbox(event, isChecked, value) {
  //   var array = [...this.state.checkedArr]; // make a separate copy of the array
  //   const { templateID } = this.props;
  //   var index = array.indexOf(value)
  //   if (!isChecked) {
  //     if (index !== -1) {
  //       array.splice(index, 1);
  //       this.setState({ markerType: array, checkedArr: array });
  //     }
  //   } else {
  //     array.push(value)
  //     this.setState({ markerType: array, checkedArr: array });
  //   }

  //   if(templateID == 1){
  //     this.props.filterMaplist(array)
  //   }
  // }

  resetMap() {
    try{
      let key = this.state.keyMAP + 1;
      this.setState({
        keyMAP: key
      })
    }catch(err){
      console.log(err)
    }
  }


  render() {
    const position = [this.state.lat, this.state.lng]
    console.log("position",position)
    const { t } = this.props;
    const corner1 = Leaflet.latLng(-90, -200)
    const corner2 = Leaflet.latLng(90, 200)
    const bounds = Leaflet.latLngBounds(corner1, corner2)
    const { templateID } = this.props;
    let bgStyles = templateID == 2 ? { background: this.props.componentbgcolor } : {};
    let colorStyles = templateID == 2 ? { color: this.props.componentbgcolor } : {};
    let markericons = new L.Icon({
      iconUrl: imgUrl.newmarker,
      iconAnchor: [5, 55],
      popupAnchor: [10, -44],
      iconSize: [ 45],
      shadowUrl: null,
      shadowSize: [68, 95],
      shadowAnchor: [20, 92],
    })
    return (
      <div id="nearMe-map">
        {<>
          {this.state.isLoading ? (
             <Loader isLoading={this.state.isLoading} style={{'color': 'black'}}/>
            
          ) : (
          // this.state.position != null ?
            <MapContainer
              key={this.state.keyMAP}
              center={position}
              zoom={this.state.zoom}
              ref={this.mapRef}
              maxBoundsViscosity={1.0}
              maxBounds={bounds}
              minZoom={2}
            >
              <TileLayer
                // url={templateID == 1  ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
                url={"https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"}
                attribution=""
              />
              {this.state.position.length > 0 ?
                <Marker position={this.state.position} ref={this.openPopup}>
                  <Popup>
                    {t('You are here')}
                  </Popup>
                </Marker>
                : ''
              }
              {this.props.markerText == 'imonitor' ?
                <Mapmarker userposition={position} markerList={this.props.markerList} markerType={this.state.checkedArr} markerTypeObj={this.props.markerType} ></Mapmarker>
                : <GoogleMarker userposition={position} markerList={this.props.markerList}></GoogleMarker>
              }

              {/* <Control position="topleft" >
                <button className="mapreset" onClick={() => this.resetMap()}>
                  <AutorenewIcon></AutorenewIcon>
                </button>
              </Control> */}

            </MapContainer>
              //  : '' 

              ) } 
            </>
        }

        {/* {
          templateID == 1 ? (
            <Fab color="primary" aria-label="add" className="mapfilterfloatbtn" onClick={this.handleClickOpen}>
            <FilterListIcon />
          </Fab>) : (
            <Button variant="contained" color="primary" disableElevation style={bgStyles} className="mapfilterbtn" onClick={this.handleClickOpen}> {t('Filters')}  </Button>
          )
        } */}

        {/* <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="simple-dialog-title" className="mapfilterdialogtitle"> {t('Select Filter')}</DialogTitle>
          <DialogContent>
            <div className="mapfiltercheckboxlist">
              <FormControl component="fieldset">
                <FormGroup>
                  {
                    this.props.markerType.map((element, i) => {
                      return <Mapfiltercheckbox
                        element={element}
                        key={element.id}
                        label={t(element.type)}
                        checked={this.state.checkedArr.includes(element.type)}
                        category={element.type}
                        onChange={this.handleCheckbox} ></Mapfiltercheckbox>
                    })
                  }
                </FormGroup>
              </FormControl>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>
       
                
    )
  }
}

export default withTranslation()(NearMap);