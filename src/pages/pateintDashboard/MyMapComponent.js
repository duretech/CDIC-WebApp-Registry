import React from "react";
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import MyMapMarker from "./MyMapMarker";

const MyMapComponent = compose(
  withProps({
    /**
     * Note: create and replace your own key in the Google console.
     * https://console.developers.google.com/apis/dashboard
     */
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=YOUR-GOOGLE-MAP-KEY&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `300px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: 19.221464, lng: 72.9814874 }}>
    { props.location ? 
    <MyMapMarker latlongs={props.location}/> : <></>}
  </GoogleMap>
));

export default MyMapComponent;
// ReactDOM.render(<MyMapComponent isMarkerShown />, document.getElementById("root"));
