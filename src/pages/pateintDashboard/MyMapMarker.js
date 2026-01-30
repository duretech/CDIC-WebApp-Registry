import React from 'react'
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
  } from "react-google-maps";


function MyMapMarker(latlongs) {
    let latlong = String(latlongs.latlongs).split(",");
    console.log("latlongs", latlong)
  return (
    <div>
        <Marker position={{ lat: Number(latlong[0]), lng: Number(latlong[1]) }} />

    </div>
  )
}

export default MyMapMarker
