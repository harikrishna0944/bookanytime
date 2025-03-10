import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaWhatsapp, FaHeart, FaShareAlt } from "react-icons/fa"; // Import WhatsApp, Heart (Wishlist), and Share icons
import WishlistModal from "./WishlistModal";


const PropertyDetails = ( ) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllImages, setShowAllImages] = useState(false); // Modal state
  const [isWishlisted, setIsWishlisted] = useState(false); // Wishlist state
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`)
      .then((response) => {
        // console.log("API Response:", response.data);
        if (response.data) {
          setProperty(response.data);
          console.log("data from backedn",response.data._id)
        } else {
          setError("Property not found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching property details:", error);
        setError("Failed to load property details.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user ? user.id : null);
  }, []);
  
  useEffect(() => {
    if (!userId) return; // Prevent effect from running with null userId
  
    const fetchWishlists = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
        const wishlists = response.data;
        const propertyExists = wishlists.some(wishlist => wishlist.properties.includes(id));
        setIsWishlisted(propertyExists);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
  
    fetchWishlists();
  }, [userId, id]);

  if (loading) return <p className="text-center mt-5">Loading property details...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;
  if (!property) return null;

  // Function to open WhatsApp chat
  const openWhatsAppChat = () => {
    const phoneNumber = "8501888760"; // Replace with your desired number
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, "_blank");
  };


  // Function to handle wishlist click
  const handleWishlistClick = async () => {
    try {
      // Fetch user's wishlists
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
      const wishlists = response.data;
  
      // Find the wishlist that contains this property
      const wishlistWithProperty = wishlists.find(wishlist => wishlist.properties.includes(id));
  
      if (wishlistWithProperty) {
        // Remove from the correct wishlist
        await removeFromWishlist(id, wishlistWithProperty.name);
      } else {
        // Open the wishlist selection modal
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };
  
  
  // Function to remove property from wishlist
  const removeFromWishlist = async (propertyId, wishlistName) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}/remove`, {
        headers: { "Content-Type": "application/json" }, // ✅ Important for DELETE with body
        data: { propertyId, wishlistName }, // ✅ Sending correct data
      });
  
      setIsWishlisted(false); // Update UI
  
      // ✅ Show alert after successful removal
      alert(`"${property.name}" has been removed from "${wishlistName}".`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove the property. Please try again.");
    }
  };
  
  
  
  
  const handleWishlistUpdate = () => {
    setIsWishlisted(true); // Update wishlist state after adding
  };
  // Function to handle share click
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href); // Copy URL to clipboard
    alert("Link copied to clipboard!"); // Notify user
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-center mb-4">{property.name}</h2>
      {/* Image Grid Layout */}
      <div className="row g-2">
        <div className="col-md-6">
          <img src={property.images?.[0]} className="img-fluid main-image" alt="Property" />
        </div>
        <div className="col-md-6 d-flex flex-column">
          <img src={property.images?.[1]} className="img-fluid side-image mb-2" alt="Property" />
          <div className="d-flex position-relative">
            <img src={property.images?.[2]} className="img-fluid small-image me-2" alt="Property" />
            <div className="position-relative">
              <img src={property.images?.[3]} className="img-fluid small-image" alt="Property" />
              {property.images?.length > 4 && (
                <div
                  className="more-overlay d-flex align-items-center justify-content-center"
                  onClick={() => setShowAllImages(true)} // Show modal on click
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
      <div className="d-flex flex-column flex-md-row">
        <div className="p-3 bg-light rounded flex-fill me-md-3">
          <h2 className="text-primary1">{property.name}</h2>
          <h4 className="text-primary"><i className="bi bi-geo-alt-fill"></i> Address</h4>
          <p className="mb-3">{property.city}, {property.address}</p>
          <div className="d-flex align-items-center mb-3">
            <FaWhatsapp
              className="text-success me-2"
              style={{ fontSize: "5rem", cursor: "pointer", marginLeft: "900px", marginTop: "-100px" }} // Increased size to 3rem
              onClick={openWhatsAppChat}
            />
            {/* Wishlist Icon */}
            <FaHeart
  className={`me-2 ${isWishlisted ? "text-danger" : "text-secondary"}`}
  style={{ fontSize: "3rem", cursor: "pointer", marginLeft: "20px", marginTop: "-100px" }}
  onClick={handleWishlistClick} 
/>



    <WishlistModal
  show={showModal} // Controls modal visibility
  onClose={() => setShowModal(false)} // Closes modal
  userId={userId} // User's ID from localStorage
  propertyId={id} // Property ID from params
  onWishlistUpdate={handleWishlistUpdate} // Callback to update wishlist
/>

            {/* Share Icon */}
            <FaShareAlt
              className="text-primary me-2"
              style={{ fontSize: "3rem", cursor: "pointer", marginLeft: "20px", marginTop: "-100px" }}
              onClick={handleShareClick}
            />
          </div>
          <h5 className="mt-3"><i className="bi bi-list-check"></i> What this place offers</h5>
          <hr className="my-4 border-black" />
          <div className="row">
            {property.amenities?.map((amenity, index) => {
              // Define icons for common amenities
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

              // Get the correct icon or use a default check-circle
              const iconClass = amenityIcons[amenity] || "bi bi-check-circle";

              return (
                <div key={index} className="col-md-6 d-flex align-items-center mb-2">
                  <i className={`${iconClass} text-success me-2 fs-4`}></i>
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
              <h4 className="text-primary mb-3">About {property.name}</h4>
              <p className="lead">{property.description}</p>
              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-secondary">Why Choose Us?</h5>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-check-circle text-success me-2"></i>Prime Location</li>
                    <li><i className="bi bi-check-circle text-success me-2"></i>Affordable Pricing</li>
                    <li><i className="bi bi-check-circle text-success me-2"></i>24/7 Customer Support</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5 className="text-secondary">Nearby Attractions</h5>
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
          .container {
            margin-left: 60px; /* Adjust as needed */
          }

          .modal-content {
            margin-left: 60px; /* Moves modal content slightly */
          }

          .image-scroll-container {
            padding-right: 30px; /* Adds space on the right */
          }

          .main-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 10px;
          }

          .side-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
          }

          .small-image {
            width: 49%;
            height: 200px;
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

          .border-black {
            border-top: 3px solid black !important;
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
            width: 80%;
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