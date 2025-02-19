"use client"; // Ensure this is a client component

import React, { useState, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api';
import "./Map.css";

const mapStyle = {
  width: "100%",
  height: '10em',
};

const mapCenter = {
  lat: 49.8258609912432, 
  lng: 18.168132684864293,
};

const Map = ({ onLocationSelect }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchInput, setSearchInput] = useState(''); // State for search bar input
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });

    // Reverse geocode to get the address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        onLocationSelect(address); // Pass the address to the parent component
        setSearchInput(address); // Update the search bar input
      } else {
        console.error('Geocoder failed:', status);
      }
    });
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarkerPosition({ lat, lng });
      const address = place.formatted_address || place.name;
      onLocationSelect(address); // Pass the address to the parent component
      setSearchInput(address); // Update the search bar input
    } else {
      console.error('No geometry found for the selected place.');
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div style={{ marginBottom: '16px' }}>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceSelect}
        >
          <input className='mapInput'
            type="text"
            placeholder="Hledejte lokaci"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            required

          />
        </Autocomplete>
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={mapStyle}
        zoom={10}
        center={markerPosition || mapCenter}
        onClick={handleMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export default Map;