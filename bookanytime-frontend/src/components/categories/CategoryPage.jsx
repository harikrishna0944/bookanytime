import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart } from "react-icons/fa"; // Import a heart icon from react-icons
import WishlistModal from "./WishlistModal"; // Import the WishlistModal component

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWishlisted, setIsWishlisted] = useState({}); // Track wishlist status for each property
  const [showModal, setShowModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null); // Track the selected property for wishlist
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties?category=${categoryName}`)
      .then((response) => {
        console.log("Fetched properties:", response.data); // Debugging
        setProperties(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties.");
        setLoading(false);
      });
  }, [categoryName]);

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
        const wishlistStatus = {};

        properties.forEach((property) => {
          const propertyExists = wishlists.some((wishlist) =>
            wishlist.properties.includes(property._id)
          );
          wishlistStatus[property._id] = propertyExists;
        });

        setIsWishlisted(wishlistStatus);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlists();
  }, [userId, properties]);

  const handleWishlistClick = async (propertyId) => {
    setSelectedPropertyId(propertyId); // Set the selected property ID
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
      const wishlists = response.data;

      // Check if the property is already in any wishlist
      const wishlistWithProperty = wishlists.find((wishlist) =>
        wishlist.properties.includes(propertyId)
      );

      if (wishlistWithProperty) {
        // Remove from the correct wishlist
        await removeFromWishlist(propertyId, wishlistWithProperty.name);
      } else {
        // Open the wishlist selection modal
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

      setIsWishlisted((prev) => ({ ...prev, [propertyId]: false })); // Update UI
      alert(`Property has been removed from "${wishlistName}".`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove the property. Please try again.");
    }
  };

  const handleWishlistUpdate = (propertyId) => {
    setIsWishlisted((prev) => ({ ...prev, [propertyId]: true })); // Update wishlist state after adding
  };

  if (loading) return <p className="text-center mt-5">Loading properties...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-3" style={{ marginLeft: "60px" }}> {/* Move the entire page to the left */}
      <button className="btn btn-outline-primary fixed-back-btn" onClick={() => navigate(-1)}>
        ← Back to Categories
      </button>

      <h4 className="text-center fw-bold mb-3">Properties in {categoryName}</h4>

      <div className="row">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div
              key={property._id}
              className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3"
              style={{ cursor: "pointer" }}
            >
                            <div className="property-item shadow-sm p-2 position-relative">
                {/* Wishlist Icon */}
                <div
                  className="position-absolute top-0 end-0 m-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the property link
                    toggleWishlist(property._id);
                  }}
                  style={{ cursor: "pointer", zIndex: 1 }}
                >
                {/* Wishlist Icon */}
                <FaHeart
    className={`ms-auto ${isWishlisted[property._id] ? "text-danger" : "text-white"}`}
    style={{
      fontSize: "1.5rem",
      cursor: "pointer",
      filter: isWishlisted[property._id] ? "none" : "drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))", // Optional shadow
    }}
    onClick={(e) => {
      e.stopPropagation();
      handleWishlistClick(property._id);
    }}
  />
                </div>
              
              {/* Property Image */}
              <img
                src={property.images && property.images.length > 0 ? property.images[0] : "https://via.placeholder.com/150"}
                alt={property.name}
                className="img-fluid"
                onClick={() => window.open(`/property/${property._id}`, "_blank")}
              />

              {/* Property Details */}
              <div className="property-details text-center p-2">
                <h6 className="fw-bold mb-1">{property.name}</h6>
                <p className="text-muted small mb-1">{property.address}</p>


              </div>
            </div>
               </div>
          ))
        ) : (
          <p className="text-center text-muted">No properties available in this category.</p>
        )}
      </div>

      {/* Wishlist Modal */}
      <WishlistModal
        show={showModal}
        onClose={() => setShowModal(false)}
        userId={userId}
        propertyId={selectedPropertyId}
        onWishlistUpdate={() => handleWishlistUpdate(selectedPropertyId)}
      />

      <style>
        {`
          .property-item {
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            text-align: center;
            margin-top: 50px;
          }

          .property-item:hover {
            transform: scale(1.05);
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
          }

          .property-item img {
            width: 100%;
            height: 140px;
            object-fit: cover;
            border-radius: 6px;
          }

          .property-details {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 8px;
            margin-top: 5px;
          }

          .fixed-back-btn {
            position: fixed;
            top: 70px;
            left: 15px;
            z-index: 1000;
            font-size: 14px;
            padding: 6px 12px;
          }
          .property-item .fa-heart {
            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
            border-radius: 50%;
            padding: 4px;
            margin-left:50px;
          }
        `}
      </style>
    </div>
  );
};

export default CategoryPage;
