import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import heartImage from "../../assets/heartImage.jpg"; // Default image for empty wishlists

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
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading wishlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Wishlists</h2>

      {wishlists.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            padding: "10px",
          }}
        >
          {wishlists.map((wishlist) => (
            <div
              key={wishlist._id}
              style={{
                textAlign: "center",
                cursor: "pointer",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={() => navigate(`/wishlist/${wishlist._id}`)} // Navigate to wishlist details page
            >
              <Image
                src={wishlist.lastPropertyImage || heartImage} // Show last property image or default heart image
                alt={wishlist.name}
                thumbnail
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <h5 className="mt-2">{wishlist.name}</h5>
              <p className="text-muted">{wishlist.properties.length} Saved</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No wishlists found.</p>
      )}
    </div>
  );
};

export default WishlistPage;