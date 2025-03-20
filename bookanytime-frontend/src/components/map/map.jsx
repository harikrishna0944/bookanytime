import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { FaMapMarkedAlt } from "react-icons/fa"; // Airbnb-style map icon

const mapContainerStyle = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100vh", // Full screen map
  zIndex: "1000",
};

function MapComponent() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const mapRef = useRef(null); // Reference to the Google Map instance

  // Fetch properties when map is shown
  useEffect(() => {
    if (showMap) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/properties`)
        .then((response) => {
          if (Array.isArray(response.data) && response.data.length > 0) {
            setProperties(response.data);
          } else {
            setError("No properties found.");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching properties:", error);
          setError("Failed to load properties.");
          setLoading(false);
        });
    }
  }, [showMap]);

  const handleGoogleMapsApiLoaded = () => {
    setGoogleLoaded(true);
  };

  const mapCenter =
    properties.length > 0
      ? { lat: parseFloat(properties[0].latitude), lng: parseFloat(properties[0].longitude) }
      : { lat: 20.5937, lng: 78.9629 }; // Default center (India)

  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;
  };

  const handleMapUnmount = () => {
    if (mapRef.current) {
      google.maps.event.clearInstanceListeners(mapRef.current); // Clean up listeners
      mapRef.current = null; // Reset map reference
    }
  };

  const renderMap = () => {
    if (window.google) {
      return (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={10}
          onLoad={handleMapLoad}
          onUnmount={handleMapUnmount}
        >
          {properties.map((property, index) => (
            <Marker
              key={index}
              position={{
                lat: parseFloat(property.latitude),
                lng: parseFloat(property.longitude),
              }}
              onClick={() => setSelectedProperty(property)}
              title={property.name} // Display property name when hovering over the marker
              label={{
                text: property.name,
                color: "royalblue",
                fontSize: "16px",
                fontWeight: "bold",
                position: "absolute",
                pixelOffset: new google.maps.Point(0, -30),
              }}
            />
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedProperty.latitude),
                lng: parseFloat(selectedProperty.longitude),
              }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div>
                <h4>{selectedProperty.name}</h4>
                <p>{selectedProperty.address}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedProperty.latitude},${selectedProperty.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      );
    }
    return <p>Google Maps is not available.</p>;
  };

  return (
    <>
      <button
        onClick={() => setShowMap(!showMap)}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 20px",
          fontSize: "16px",
          backgroundColor: "white",
          border: "1px solid #ddd",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: "1100",
        }}
      >
        <FaMapMarkedAlt size={20} color="#FF5A5F" />
        {showMap ? "Hide Map" : "Show Map"}
      </button>

      {/* Full-screen map when visible */}
      {showMap && (
        <div style={mapContainerStyle}>
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            onLoad={handleGoogleMapsApiLoaded}
          >
            {loading ? (
              <p>Loading map...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              renderMap()
            )}
          </LoadScript>
        </div>
      )}
    </>
  );
}

export default MapComponent;
