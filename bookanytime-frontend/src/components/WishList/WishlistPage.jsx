import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import heartImage from "../../assets/heartImage.jpg"; // Default image for empty wishlists
import "./WishlistPage.css"

const WishlistPage = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user ID from localStorage
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Redirect to login if user is not authenticated
      return;
    }

    fetchWishlists();
  }, [userId, navigate]);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
      const wishlists = Array.isArray(response.data) ? response.data : [];

      // Fetch last property details for each wishlist
      const updatedWishlists = await Promise.all(
        wishlists.map(async (wishlist) => {
          if (wishlist.properties.length > 0) {
            const lastPropertyId = wishlist.properties[wishlist.properties.length - 1];
            try {
              const propertyResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${lastPropertyId}`);
              return { ...wishlist, lastPropertyImage: propertyResponse.data.images[0] };
            } catch (error) {
              console.error("Error fetching property image:", error);
              return { ...wishlist, lastPropertyImage: null };
            }
          }
          return { ...wishlist, lastPropertyImage: null };
        })
      );

      setWishlists(updatedWishlists);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      setError("Failed to load wishlists. Please try again.");
      setWishlists([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading wishlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-heading">My Wishlists</h2>

      {wishlists.length > 0 ? (
        <div className="wishlist-grid">
          {wishlists.map((wishlist) => (
            <div
              key={wishlist._id}
              className="wishlist-card"
              onClick={() => navigate(`/wishlist/${wishlist._id}`)} // Navigate to wishlist details page
            >
              <Image
                src={wishlist.lastPropertyImage || heartImage} // Show last property image or default heart image
                alt={wishlist.name}
                thumbnail
                className="wishlist-image"
              />
              <h5 className="wishlist-name">{wishlist.name}</h5>
              <p className="wishlist-count">{wishlist.properties.length} Saved</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-wishlists">No wishlists found.</p>
      )}
    </div>
  );
};

export default WishlistPage;