import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

function SimpleMap() {
  //coordinates
  const [coordinates, setcoordinates] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [zoom, setZoom] = useState({
    minZoom: 4,
    maxZoom: 20,
  });
  const [center, setCenter] = useState({
    lat: 10.502411486384645, lng: -66.89874730687619
  });

  //loader and libraries
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "",
    libraries: ["places"]
  });

  //map instance
  const [map, setMap] = React.useState(null);

  //methods
  const onLoad = React.useCallback(function callback(map) {

    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, []);

  const onLoadMarker = marker => {};

  const onDragMarker = (drg) => {
    setcoordinates({ lat: drg.latLng.lat(), lng: drg.latLng.lng() });
  }

  const onLoadAutocomplete = (autoComplete) => {
    setAutocomplete(autoComplete);
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      setCenter({ lat: autocomplete.getPlace().geometry.location.lat(), lng: autocomplete.getPlace().geometry.location.lng() })
    }
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      onLoad={onLoad}
      onUnmount={onUnmount}
      clickableIcons={false}
      options={{
        minZoom: zoom.minZoom,
        maxZoom: zoom.maxZoom,
        center: center,
        disableDefaultUI: true,
        zoomControl: true,

      }}
    >
      <MarkerF
        onLoad={onLoadMarker}
        position={center}
        draggable
        onDrag={onDragMarker}
      />
      <Autocomplete
        onLoad={onLoadAutocomplete}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Calle / Ciudad / Avenida / ..."
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `540px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: "absolute",
          }}
        />
      </Autocomplete>
    </GoogleMap>
  ) : <>Cargando...</>
}

export default SimpleMap;