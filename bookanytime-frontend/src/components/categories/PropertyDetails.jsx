import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaWhatsapp, FaHeart, FaShareAlt } from "react-icons/fa";
import WishlistModal from "./WishlistModal";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllImages, setShowAllImages] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);

  // Default map center (can be dynamically set based on property location)
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`)
      .then((response) => {
        if (response.data) {
          setProperty(response.data);
          console.log("data from backed in properties list", response.data)
          // Set map center based on property location
          if (response.data.latitude && response.data.longitude) {
            setMapCenter({
              lat: parseFloat(response.data.latitude),
              lng: parseFloat(response.data.longitude),
            });
          }

                    // Store recently viewed properties
                    const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

                    // Remove duplicate entries
                    const updatedList = recentlyViewed.filter((prop) => prop.id !== response.data._id);
          
                    // Add the current property to the beginning
                    updatedList.unshift({
                      id: response.data._id,
                      name: response.data.name,
                      image: response.data.images?.[0], // Store the first image
                      city: response.data.city,
                    });
          
                    // Limit the number of recently viewed properties (e.g., last 5)
                    if (updatedList.length > 10) updatedList.pop();
          
                    localStorage.setItem("recentlyViewed", JSON.stringify(updatedList));
          
          
        } else {
          setError("Property not found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching property details:", error);
        setError("No properties available.");
        setLoading(false);
      });
  }, [id]);

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user ? user.id : null);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchWishlists = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
        const wishlists = response.data;
        const propertyExists = wishlists.some((wishlist) => wishlist.properties.includes(id));
        setIsWishlisted(propertyExists);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlists();
  }, [userId, id]);

  // const openWhatsAppChat = () => {
  //   const phoneNumber = "8501888760"; // Replace with your desired number
  //   const url = `https://wa.me/${phoneNumber}`;
  //   window.open(url, "_blank");
  // };

  const openWhatsAppChat = () => {
    if (!property || !property.whatsappNumber) {
        alert("WhatsApp number not available.");
        return;
    }

    let phoneNumber = property.whatsappNumber.trim(); // Remove extra spaces
    phoneNumber = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters

    if (phoneNumber.length < 10) {
        alert("Invalid WhatsApp number.");
        return;
    }

    // Ensure the number has a country code; assume +91 (India) if missing
    if (phoneNumber.length === 10) {
        phoneNumber = "91" + phoneNumber; // Add default country code
    }

    const url = `https://wa.me/${phoneNumber}`;
    console.log("Opening WhatsApp chat:", url); // Debugging
    window.open(url, "_blank");
};


  const handleWishlistClick = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
      const wishlists = response.data;
      const wishlistWithProperty = wishlists.find((wishlist) => wishlist.properties.includes(id));

      if (wishlistWithProperty) {
        await removeFromWishlist(id, wishlistWithProperty.name);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const removeFromWishlist = async (propertyId, wishlistName) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}/remove`, {
        headers: { "Content-Type": "application/json" },
        data: { propertyId, wishlistName },
      });

      setIsWishlisted(false);
      alert(`"${property.name}" has been removed from "${wishlistName}".`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove the property. Please try again.");
    }
  };

  const handleWishlistUpdate = () => {
    setIsWishlisted(true);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) return <p className="text-center mt-5">Loading property details...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;
  if (!property) return null;

  return (
    <div className="container-fluid mt-4 custom-container">
      <h2 className="fw-bold text-center mb-4 fs-3 fs-md-2">{property.name}</h2>

      {/* Image Grid Layout */}
      <div className="row g-2">
        <div className="col-12 col-lg-8">
          <img src={property.images?.[0]} className="img-fluid main-image" alt="Property" />
        </div>
        <div className="col-12 col-lg-4 d-flex flex-column">
          <img src={property.images?.[1]} className="img-fluid side-image mb-2" alt="Property" />
          <div className="d-flex position-relative">
            <img src={property.images?.[2]} className="img-fluid small-image me-2" alt="Property" />
            <div className="position-relative">
              <img src={property.images?.[3]} className="img-fluid small-image" alt="Property" />
              {property.images?.length > 4 && (
                <div
                  className="more-overlay d-flex align-items-center justify-content-center"
                  onClick={() => setShowAllImages(true)}
                >
                  + More
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Black Line */}
      <hr className="my-4 border-black" />

      {/* Property Details */}
      <div className="d-flex flex-column flex-lg-row">
        <div className="p-3 bg-light rounded flex-fill me-lg-0">
          <h2 className="text-primary1 fs-4 fs-md-3">{property.name}</h2>
          <button
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`,
                "_blank"
              );
            }}
            className="text-primary fs-5 fs-md-4 bi bi-geo-alt-fill border-0 bg-transparent p-0"
            style={{ cursor: "pointer" }}
          >
            Address
          </button>
          <p className="mb-3">{property.city}, {property.address}</p>

          {/* WhatsApp, Wishlist, and Share Icons */}
          <div className="d-flex align-items-center justify-content-end mb-3 mt-n3">
            <FaWhatsapp
              className="text-success me-3"
              style={{ fontSize: "2.5rem", cursor: "pointer" }}
              onClick={openWhatsAppChat}
            />
            <FaHeart
              className={`me-3 ${isWishlisted ? "text-danger" : "text-secondary"}`}
              style={{ fontSize: "2.5rem", cursor: "pointer" }}
              onClick={handleWishlistClick}
            />
            <FaShareAlt
              className="text-primary"
              style={{ fontSize: "2.5rem", cursor: "pointer" }}
              onClick={handleShareClick}
            />
          </div>

          <WishlistModal
            show={showModal}
            onClose={() => setShowModal(false)}
            userId={userId}
            propertyId={id}
            onWishlistUpdate={handleWishlistUpdate}
          />

          <h5 className="mt-3 fs-5 fs-md-4"><i className="bi bi-list-check"></i> What this place offers</h5>
          <hr className="my-4 border-black" />
          <div className="row">
            {property.amenities?.map((amenity, index) => {
              const amenityIcons = {
                "Kitchen": "bi bi-house-door",
                "WiFi": "bi bi-wifi",
                "Air conditioning": "bi bi-fan",
                "Heating": "bi bi-thermometer-half",
                "Free washing machine": "bi bi-droplet",
                "Dryer": "bi bi-wind",
                "HDTV with Netflix": "bi bi-tv",
                "Iron": "bi bi-hammer",
                "Hair dryer": "bi bi-scissors",
                "Dedicated workspace": "bi bi-laptop",
                "Swimming Pool": "bi bi-water",
                "Hot tub": "bi bi-hot",
                "Free parking on premises": "bi bi-car-front",
                "Paid parking": "bi bi-credit-card",
                "Gym": "bi bi-bar-chart-line",
                "BBQ grill": "bi bi-fire",
                "Smoking allowed": "bi bi-smoke",
                "Pets allowed": "bi bi-paw",
                "Breakfast included": "bi bi-cup",
                "Security cameras": "bi bi-camera-video",
                "Fire extinguisher": "bi bi-fire-extinguisher",
                "First aid kit": "bi bi-heart-pulse",
                "Hot water": "bi bi-thermometer-sun",
                "Private back garden – Fully fenced": "bi bi-tree",
                "Window AC unit": "bi bi-snow2",
                "Patio or balcony": "bi bi-house"
              };

              const iconClass = amenityIcons[amenity] || "bi bi-check-circle";

              return (
                <div key={index} className="col-12 col-md-6 d-flex align-items-center mb-2">
                  <i className={`${iconClass} text-success me-2 fs-5`}></i>
                  <span className={`amenity-text ${amenity.includes("Not available") ? "text-decoration-line-through text-muted" : ""}`}>
                    {amenity}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Black Line */}
          <hr className="my-4 border-black" />

          {/* Dynamic Content Section */}
          <div className="row mt-4">
            <div className="col-12">
              <h4 className="text-primary mb-3 fs-5 fs-md-4">About {property.name}</h4>
              <p className="lead">{property.description}</p>
              <div className="row">
                <div className="col-12 col-md-6">
                  <h5 className="text-secondary fs-6 fs-md-5">Why Choose Us?</h5>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-check-circle text-success me-2"></i>Prime Location</li>
                    <li><i className="bi bi-check-circle text-success me-2"></i>Affordable Pricing</li>
                    <li><i className="bi bi-check-circle text-success me-2"></i>24/7 Customer Support</li>
                  </ul>
                </div>
                <div className="col-12 col-md-6">
                  <h5 className="text-secondary fs-6 fs-md-5">Nearby Attractions</h5>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-geo-alt text-primary me-2"></i>5 mins to Shopping Mall</li>
                    <li><i className="bi bi-geo-alt text-primary me-2"></i>10 mins to Beach</li>
                    <li><i className="bi bi-geo-alt text-primary me-2"></i>15 mins to Airport</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={mapCenter}
        zoom={15}
      >
        <Marker
          position={mapCenter}
          onClick={() => {
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`,
              "_blank"
            );
          }}
        />
      </GoogleMap>
    </LoadScript>


      

      {/* Scrollable Full Image Modal */}
      {showAllImages && (
        <div className="modal-overlay" onClick={() => setShowAllImages(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowAllImages(false)}>×</button>
            <h3 className="text-center">All Property Images</h3>
            <div className="image-scroll-container">
              {property.images.map((img, index) => (
                <img key={index} src={img} alt={`Property ${index}`} className="scroll-image" />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .custom-container {
            max-width: 1400px; /* Adjust as needed */
            margin: 0 auto;
          }

          .main-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
          }

          .side-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
          }

          .small-image {
            width: 49%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
          }

          .more-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            font-size: 24px;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 90%;
            max-width: 800px;
            text-align: center;
            position: relative;
          }

          .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            border: none;
            background: none;
            cursor: pointer;
          }

          .image-scroll-container {
            display: flex;
            overflow-x: auto;
            gap: 10px;
            padding: 10px;
            white-space: nowrap;
            max-width: 100%;
          }

          .image-scroll-container::-webkit-scrollbar {
            height: 8px;
          }

          .image-scroll-container::-webkit-scrollbar-thumb {
            background: #aaa;
            border-radius: 5px;
          }

          .scroll-image {
            height: 150px;
            width: auto;
            border-radius: 5px;
          }

          .amenity-text {
            font-size: 16px;
            font-weight: 500;
          }
        `}
      </style>
    </div>
  );
};



export default PropertyDetails;