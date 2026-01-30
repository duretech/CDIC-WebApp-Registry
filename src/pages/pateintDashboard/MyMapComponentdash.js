import React, { useEffect, useState, useRef } from 'react'
// import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
// import { addressPoints } from './realworld.10000.js';
import L from "leaflet"
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import { APP_LOCALE } from '../../../src/assets/data/config.js'; 
import MarkerClusterGroup from './react-leaflet-markercluster';
require("react-leaflet-markercluster/dist/styles.min.css");


const containerStyle = {
  width: '100%',
  height: '339px'
};

const defaultIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [20, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
});

function MyMapComponentdash(props) {
  const dashboardMap = Array.isArray(props?.homePageMap) ? props.homePageMap : [];

  const isValidLatLong = (lat, long) => {
    return (
      !isNaN(lat) &&
      !isNaN(long) &&
      lat >= -90 &&
      lat <= 90 &&
      long >= -180 &&
      long <= 180
    );
  };

  const convertedData =
  APP_LOCALE === "CC008"
    ? dashboardMap
        .map((item) => {
          const lat = parseFloat(item.lat);
          const long = parseFloat(item.long);
          const counts = item.counts;
          if (isValidLatLong(lat, long)) {
            return { lat, long, counts, ...item };
          }
          return null;
        })
        .filter((item) => item !== null)
    : dashboardMap.map((item) => [parseFloat(item.lat), parseFloat(item.long), item.counts]);

  const mapRef = useRef();

  const heatmapOptions = {
    radius: 20,
    blur: 20,
    maxZoom: 22,
    minOpacity: 0.5,
    maxOpacity: 1
  };

  return (
    <MapContainer  ref={mapRef}
    center={APP_LOCALE === "CC008" ? [20.5937, 78.9629] : [7.099097, 9.2596502]}
    zoom={APP_LOCALE === "CC008" ? 4 : 2}  maxZoom={18} style={containerStyle}>
        {/* GANDHI-specific Marker Clustering */}
        {APP_LOCALE === "CC008" && (
        <MarkerClusterGroup>
          {convertedData.map((point, index) => (
            <Marker key={index} position={[point.lat, point.long]} icon={defaultIcon}>
              <Tooltip>
                <p>UIC: {point.uic} </p>
                <p>Name: {point.fullname} {point.lastname}</p>
                <p>Gender: {point.gender}</p>
              </Tooltip>
            </Marker>
          ))}
        </MarkerClusterGroup>
      )}

      <HeatmapLayer
            fitBoundsOnUpdate
            points={convertedData}
            longitudeExtractor={(point) => point[1]}
            latitudeExtractor={(point) => point[0]}
            key={Math.random() + Math.random()}
            intensityExtractor={(point) => parseFloat(point[2])}
            {...heatmapOptions}
          />
    <TileLayer
      url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
      
    />
  </MapContainer>
  );
}

export default MyMapComponentdash;