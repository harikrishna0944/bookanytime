import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaHeart, FaBed, FaUser } from "react-icons/fa";
import "./RecentlyViewed.css";
import WishlistModal from "../categories/WishlistModal";

const RecentlyViewed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState({});
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [userId, setUserId] = useState(null);



  useEffect(() => {
    setLoading(true);
    setError("");
  
    try {
      // const now = Date.now();
      let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      // viewed = viewed.filter((prop) => now - prop.timestamp < 2 * 60 * 1000);
      setRecentlyViewed(viewed);
    } catch (err) {
      setError("Failed to load recently viewed properties.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get user ID from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user ? user.id : null);
  }, []);

// Fetch wishlist status when recentlyViewed is updated
useEffect(() => {
  if (!userId || recentlyViewed.length === 0) return;

  const fetchWishlists = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`
      );
      const wishlists = response.data;
      const wishlistStatus = {};

      recentlyViewed.forEach((property) => {
        const propertyExists = wishlists.some((wishlist) =>
          wishlist.properties.includes(property.id) // Ensure 'property.id' matches API response
        );
        wishlistStatus[property.id] = propertyExists;
      });

      setIsWishlisted(wishlistStatus);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  fetchWishlists();
}, [userId, recentlyViewed]); // Ensure `recentlyViewed` is populated before fetching wishlist


  // Handle wishlist click
  const handleWishlistClick = async (propertyId) => {
    setSelectedPropertyId(propertyId);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
      const wishlists = response.data;

      const wishlistWithProperty = wishlists.find((wishlist) =>
        wishlist.properties.includes(propertyId)
      );

      if (wishlistWithProperty) {
        await removeFromWishlist(propertyId, wishlistWithProperty.name);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Remove property from wishlist
  const removeFromWishlist = async (propertyId, wishlistName) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}/remove`, {
        headers: { "Content-Type": "application/json" },
        data: { propertyId, wishlistName },
      });

      setIsWishlisted((prev) => ({ ...prev, [propertyId]: false }));
      alert(`Property has been removed from "${wishlistName}".`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove the property. Please try again.");
    }
  };

  // Update wishlist status
  const handleWishlistUpdate = (propertyId) => {
    setIsWishlisted((prev) => ({ ...prev, [propertyId]: true }));
  };


  const checkScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      checkScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [checkScroll]);

  return (
    <Container fluid className="recently-viewed-container">
      <h2 className="recently-viewed-header">Recently Viewed</h2>
      <div className="recently-viewed-wrapper">
        {showLeftArrow && (
          <button className="scroll-arrow left" onClick={handleScrollLeft}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="recently-viewed-items" ref={containerRef}>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : recentlyViewed.length > 0 ? (
            recentlyViewed.map((property) => (
              <div
                key={property.id}
                className="recently-viewed-item"
                onClick={() => window.open(`/property/${property.id}`, "_blank")}
              >
                <div className="recently-viewed-card">
                  {/* Property Image */}
                  <div className="property-image-container">
                    <img
                      // src={property.image && property.image.length > 0 ? property.image[0] : "https://via.placeholder.com/150"}
                      src={property.image}
                      alt={property.name}
                      className="property-image"
                      draggable="false"
                    />
                    {/* Wishlist Icon */}
                    <div
                      className="wishlist-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistClick(property.id);
                      }}
                    >
                      <FaHeart
                        className={`${isWishlisted[property.id] ? "text-danger" : "text-white"}`}
                        style={{
                          fontSize: "1.25rem",
                          cursor: "pointer",
                          filter: isWishlisted[property.id] ? "none" : "drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))",
                        }}
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="property-details">
                    <h6 className="property-name">{property.name}</h6>
                    <p className="property-address">{property.city}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-categories-message">No Properties available</p>
          )}
        </div>
        {showRightArrow && (
          <button className="scroll-arrow right" onClick={handleScrollRight}>
            <ChevronRight size={24} />
          </button>
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
    </Container>
  );
};

export default RecentlyViewed;