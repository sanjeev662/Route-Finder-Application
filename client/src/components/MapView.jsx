import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const MapComponent = ({ polylines }) => {
  const [map, setMap] = useState(null);
  const [decodedPolylines, setDecodedPolylines] = useState([]);
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [startPoint, setStartPoint] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        lat: (lat / 1e5),
        lng: (lng / 1e5)
      });
    }
    return points;
  };

  useEffect(() => {
    const allDecodedPolylines = polylines.map(decodePolyline);
    setDecodedPolylines(allDecodedPolylines);

    if (allDecodedPolylines.length > 0 && allDecodedPolylines[0].length > 0) {
      const firstPoint = allDecodedPolylines[0][0];
      setCenter(firstPoint);
      setStartPoint(firstPoint);
    }

    if (mapRef.current && allDecodedPolylines.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      allDecodedPolylines.forEach((polyline) => {
        polyline.forEach((point) => {
          bounds.extend(point);
        });
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [polylines]);

  useEffect(() => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const onLoad = (mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {decodedPolylines.map((path, index) => (
          <Polyline
            key={index}
            path={path}
            options={{ strokeColor: '#FF0000', strokeWeight: 4 }}
          />
        ))}
        {startPoint && (
          <Marker
            position={startPoint}
            icon={{
              url: "https://maps.google.com/mapfiles/kml/paddle/blu-circle.png",
              scaledSize: { width: 24, height: 24 },
              origin: { x: 0, y: 0 },
              anchor: { x: 12, y: 12 },
            }}
          />
        )}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/kml/paddle/grn-circle.png",
              scaledSize: { width: 24, height: 24 },
              origin: { x: 0, y: 0 },
              anchor: { x: 12, y: 12 },
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
