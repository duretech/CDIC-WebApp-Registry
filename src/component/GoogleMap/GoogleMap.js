import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import Geocode from "react-geocode";
import { connect } from "react-redux";
import {setLocationAction} from "../../redux/actions/action"
import _ from 'lodash';

const PRIORITY_TYPES = [
  "street_address",
  "premise",
  "subpremise",
  "establishment",
  "point_of_interest",
  "route",
  "neighborhood",
  "sublocality_level_1",
  "sublocality_level_2",
  "sublocality",
  "locality",
  "administrative_area_level_4",
  "administrative_area_level_3",
  "administrative_area_level_2",
  "administrative_area_level_1",
  "postal_code",
  "plus_code",
  "country",
];

//export default class GoogleMaps extends Component {
function GoogleMaps(props) {
    const runtime = window.RUNTIME_CONFIG || {};
    const onMarkerDragEnd = (coord, index) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        //console.log("coord, index ",coord, lat,lng)
        let data = {
            lat:lat,
            lng:lng,
            //address:"Punawale, Pimpri-Chinchwad, Maharashtra 411033, India  "
        }
        //props.setLocationAction(data)
        Geocode.setApiKey(runtime.googleMapAPIKey)
        let address;
        Geocode.fromLatLng(lat, lng).then(
            response => {
                try{
                    //  address = _.find(response.results, function(o) {
                    //    return o.types.includes('postal_code') //o.types.includes('administrative_area_level_2')
                    //  });

                    const results = response?.results || [];

                    address =
                      PRIORITY_TYPES
                        .map(type => results.find(r => r.types?.includes(type)))
                        .find(Boolean) || results[0] || null;

                     console.log("address ",address,response.results)
                     if(address){
                        data["address"] = address?.formatted_address
                        props.setLocationAction(data)
                     }
                   }catch(e){
                       console.log(e)
                   }
                
                let value = {
                  'label': address?.formatted_address
                }
                
                const data = {
                    'value': value,
                    'fieldId': props.fieldId,
                    'lat': lat,
                    'lng': lng,
                }
                console.log("geodata", data)
                props.onGoogleLocationChange(data) 
            },
            error => {
                console.error(error);
            }
        );
      };

  const loadMap = (map, maps) => {
    const cityCircle = new window.google.maps.Circle({
    //   strokeColor: "#FF0000",
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: "#FF0000",
    //   fillOpacity: 0.35,
      map,
      center: { lat: props.geoLat, lng: props.geoLng },
      //radius: 10000,
      draggable: true
    });


 let marker = new maps.Marker({
        position: { lat: props.geoLat, lng: props.geoLng  },
        map,
        draggable:true,
      });

      marker.addListener("dragend", (coord, index) => {
        onMarkerDragEnd(coord, index)
      });

  };
  
    console.log("google map function");
    return (
        <div style={{ height: "400px", width: "100%" }}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: runtime.googleMapAPIKey }} 
            defaultCenter={{ lat: props.geoLat, lng: props.geoLng }}
            defaultZoom={10}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => loadMap(map, maps)}
        />
        </div>
    );
  
}

export default connect(null, {setLocationAction})(GoogleMaps);