// import React, { useState, useEffect, useRef } from "react";
// import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
// import axios from "axios";
// import { FaMapMarkedAlt } from "react-icons/fa"; // Airbnb-style map icon
// import marker from "../../assets/image.png"
// const mapContainerStyle = {
//   position: "fixed",
//   top: "0",
//   left: "0",
//   width: "100%",
//   height: "100vh", // Full screen map
//   zIndex: "1000",
// };

// function MapComponent() {
//   const [properties, setProperties] = useState([]);
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showMap, setShowMap] = useState(false);
//   const mapRef = useRef(null);

//   // Fetch properties when map is shown
//   useEffect(() => {
//     if (showMap) {
//       setLoading(true);
//       axios
//         .get(`${import.meta.env.VITE_API_BASE_URL}/api/properties`)
//         .then((response) => {
//           if (Array.isArray(response.data) && response.data.length > 0) {
//             setProperties(response.data);
//           } else {
//             setError("No properties found.");
//           }
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error fetching properties:", error);
//           setError("Failed to load properties.");
//           setLoading(false);
//         });
//     }
//   }, [showMap]);

//   const mapCenter =
//     properties.length > 0
//       ? { lat: parseFloat(properties[0].latitude), lng: parseFloat(properties[0].longitude) }
//       : { lat: 20.5937, lng: 78.9629 }; // Default center (India)

//   const handleMapLoad = (mapInstance) => {
//     mapRef.current = mapInstance;
//   };

//   const handleMapUnmount = () => {
//     if (mapRef.current) {
//       google.maps.event.clearInstanceListeners(mapRef.current);
//       mapRef.current = null;
//     }
//   };

//   const renderMap = () => {
//     if (window.google) {
//       return (
//         <GoogleMap
//           mapContainerStyle={mapContainerStyle}
//           center={mapCenter}
//           zoom={10}
//           onLoad={handleMapLoad}
//           onUnmount={handleMapUnmount}
//         >
//           {properties.map((property, index) => (
//            <Marker
//            key={index}
//            position={{
//              lat: parseFloat(property.latitude),
//              lng: parseFloat(property.longitude),
//            }}
//            onClick={() => setSelectedProperty(property)}
//            title={property.name}
//            icon={{
//              url: marker, // Use a better icon if desired
//              scaledSize: new window.google.maps.Size(40, 40), // Adjust marker size
//            }}
//            label={{
//              text: property.name,
//              color: "#2D3142	", // Bright label text
//              fontSize: "14px",
//              fontWeight: "bold",
//              className: "custom-label", // Optional: you can style it via CSS
//            }}
//          />
         
//           ))}

//           {selectedProperty && (
//             <InfoWindow
//               position={{
//                 lat: parseFloat(selectedProperty.latitude),
//                 lng: parseFloat(selectedProperty.longitude),
//               }}
//               onCloseClick={() => setSelectedProperty(null)}
//             >
//               <div style={{ textAlign: "center", maxWidth: "250px" }}>
//                 {/* Clickable Hotel Name */}
//                 <h4
//                   style={{ cursor: "pointer", color: "#007BFF", marginBottom: "8px" }}
//                   onClick={() => window.open(`/property/${selectedProperty._id}`, "_blank")}
//                 >
//                   {selectedProperty.name}
//                 </h4>

//                 {/* Clickable Image with Increased Size */}
//                 {selectedProperty.images && selectedProperty.images.length > 0 && (
//                   <img
//                     src={selectedProperty.images[0]}
//                     alt={selectedProperty.name}
//                     style={{
//                       width: "100%",
//                       maxHeight: "150px", // Increased image size
//                       objectFit: "cover",
//                       cursor: "pointer",
//                       borderRadius: "8px",
//                     }}
//                     onClick={() => window.open(`/property/${selectedProperty._id}`, "_blank")}
//                   />
//                 )}

//                 {/* Get Directions Link */}
//                 <div style={{ marginTop: "10px" }}>
//                   <a
//                     href={`https://www.google.com/maps/dir/?api=1&destination=${selectedProperty.latitude},${selectedProperty.longitude}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{ color: "#007BFF", textDecoration: "none", fontWeight: "bold" }}
//                   >
//                     Get Directions
//                   </a>
//                 </div>
//               </div>
//             </InfoWindow>
//           )}
//         </GoogleMap>
//       );
//     }
//     return <p>Google Maps is not available.</p>;
//   };

//   return (
//     <>
//       <button
//         onClick={() => setShowMap(!showMap)}
//         style={{
//           position: "fixed",
//           bottom: "20px",
//           left: "50%",
//           transform: "translateX(-50%)",
//           padding: "12px 20px",
//           fontSize: "16px",
//           backgroundColor: "white",
//           border: "1px solid #ddd",
//           borderRadius: "30px",
//           display: "flex",
//           alignItems: "center",
//           gap: "8px",
//           cursor: "pointer",
//           boxShadow: "0 2px 6px rgba(206, 59, 59, 0.2)",
//           zIndex: "1100",
//         }}
//       >
//         <FaMapMarkedAlt size={20} color="#FF5A5F" />
//         {showMap ? "Hide Map" : "Map"}
//       </button>

//       {showMap && (
//         <div style={mapContainerStyle}>
//           <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
//             {loading ? <p>Loading map...</p> : error ? <p style={{ color: "red" }}>{error}</p> : renderMap()}
//           </LoadScript>
//         </div>
//       )}
//     </>
//   );
// }

// export default MapComponent;

import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import {
  GoogleMap,
  LoadScript,
  OverlayView
} from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100vh",
  zIndex: "1000"
};

const priceBoxStyle = {
  backgroundColor: "#000",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "10px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  userSelect: "none"
};

const popupStyle = {
  position: "absolute",
  bottom: "40px", // popup above price box
  left: "50%",
  transform: "translateX(-50%)",
  width: "280px",
  backgroundColor: "#fff",
  color: "#333",
  padding: "12px",
  borderRadius: "12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
  zIndex: 1000,
  fontSize: "14px",
  pointerEvents: "auto"
};

const imgStyle = {
  width: "100%",
  maxHeight: "150px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "8px"
};

function MapComponent() {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (showMap) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/properties`)
        .then((response) => {
          if (Array.isArray(response.data) && response.data.length > 0) {
            setProperties(response.data);
            setError(null);
          } else {
            setProperties([]);
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

  const mapCenter =
    properties.length > 0
      ? {
          lat: parseFloat(properties[0].latitude),
          lng: parseFloat(properties[0].longitude)
        }
      : { lat: 20.5937, lng: 78.9629 };

  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;

    // Close popup on map click outside
    mapInstance.addListener("click", () => {
      setSelectedPropertyIndex(null);
    });
  };

  const handleMapUnmount = () => {
    if (mapRef.current) {
      window.google.maps.event.clearInstanceListeners(mapRef.current);
      mapRef.current = null;
    }
  };

  const handlePriceBoxClick = (index, event) => {
    event.stopPropagation(); // Prevent map click closing popup immediately
    if (selectedPropertyIndex === index) {
      setSelectedPropertyIndex(null); // toggle off if already selected
    } else {
      setSelectedPropertyIndex(index);
    }
  };

  const renderMap = () => (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={10}
      onLoad={handleMapLoad}
      onUnmount={handleMapUnmount}
    >
      {properties.map((property, index) => (
        <OverlayView
          key={index}
          position={{
            lat: parseFloat(property.latitude),
            lng: parseFloat(property.longitude)
          }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            {/* Price Box */}
            <div
              style={priceBoxStyle}
              onClick={(e) => handlePriceBoxClick(index, e)}
            >
              ₹ {property.minPrice}
            </div>

            {/* Popup with details, show only if selected */}
            {selectedPropertyIndex === index && (
              <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedPropertyIndex(null)}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: "transparent",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    color: "#999"
                  }}
                  aria-label="Close popup"
                >
                  ×
                </button>
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "6px",
                    cursor: "default",
                    color: "#FF5A5F"
                  }}
                >
                  {property.name}
                </h3>
                {property.images?.length > 0 && (
                  <a
                    href={`/property/${property._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", cursor: "pointer" }}
                    aria-label={`View details for ${property.name}`}
                  >
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      style={imgStyle}
                    />
                  </a>
                )}
                <div>
                  <b>Price:</b> ₹ {property.minPrice}
                </div>
                <div>
                  <b>Location:</b> {property.address || "N/A"}
                </div>

                <div style={{ marginTop: "10px" }}>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007BFF", textDecoration: "none", fontWeight: "bold" }}
                  >
                    Get Directions
                  </a>
                </div>

                <a
                  href={`/property/${property._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: "10px",
                    display: "inline-block",
                    color: "#FF5A5F",
                    fontWeight: "bold",
                    textDecoration: "none"
                  }}
                >
                  View Details
                </a>
              </div>
            )}
          </div>
        </OverlayView>
      ))}
    </GoogleMap>
  );

  return (
    <>
      {/* <button
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
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(206, 59, 59, 0.2)",
          zIndex: "1100"
        }}
      >
        {showMap ? "Hide Map" : "Show Map"}
      </button> */}

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
          boxShadow: "0 2px 6px rgba(206, 59, 59, 0.2)",
          zIndex: "1100",
        }}
      >
        <FaMapMarkedAlt size={20} color="#FF5A5F" />
        {showMap ? "Hide Map" : "Map"}
      </button>


      {showMap && (
        <div style={mapContainerStyle}>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
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

