import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart, FaFilter, FaBed, FaUser, FaSort,FaChevronLeft } from "react-icons/fa";
import WishlistModal from "./WishlistModal";
import { Button, Badge, Dropdown } from "react-bootstrap";
import Filter from "./Filter"; // Import the Filter component

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWishlisted, setIsWishlisted] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000], // Default price range
    bedrooms: "",
    adults: "", // Replaced beds with adults
    amenities: [], // Added amenities array
  });
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0); // Track applied filters
  const [sortOption, setSortOption] = useState(null); // Track sorting option

  // Fetch properties based on category
  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/properties?category=${categoryName}`)
      .then((response) => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties.");
        setLoading(false);
      });
  }, [categoryName]);

  // Get user ID from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user ? user.id : null);
  }, []);

  // Fetch wishlist status for properties
  useEffect(() => {
    if (!userId) return;

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

  // Apply filters
  const applyFilters = () => {
    const filteredProperties = properties.filter((property) => {
      const price = property.price || 0;
      const bedrooms = property.capacity?.bedrooms || 0; // Fetch bedrooms from capacity
      const adults = property.capacity?.adults || 0; // Fetch adults from capacity
      const amenities = property.amenities || []; // Fetch amenities

      return (
        price >= filters.priceRange[0] &&
        price <= filters.priceRange[1] &&
        (!filters.bedrooms || bedrooms <= filters.bedrooms) &&
        (!filters.adults || adults <= filters.adults) &&
        (!filters.amenities?.length || filters.amenities.every((amenity) => amenities.includes(amenity))) // Filter by amenities
      );
    });

    setProperties(filteredProperties);
    setShowFilterModal(false);

    // Calculate the number of applied filters
    const count =
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 ? 1 : 0) +
      (filters.bedrooms ? 1 : 0) +
      (filters.adults ? 1 : 0) +
      (filters.amenities?.length || 0); // Include amenities in the count
    setAppliedFiltersCount(count);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      priceRange: [0, 100000], // Reset price range
      bedrooms: "",
      adults: "", // Reset adults
      amenities: [], // Reset amenities
    });
    setAppliedFiltersCount(0);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/properties?category=${categoryName}`)
      .then((response) => {
        setProperties(response.data);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
      });
  };

  // Handle sorting
  const handleSort = (option) => {
    setSortOption(option);
    let sortedProperties = [...properties];

    if (option === "priceLowToHigh") {
      sortedProperties.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (option === "priceHighToLow") {
      sortedProperties.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setProperties(sortedProperties);
  };

  if (loading) return <p className="text-center mt-5">Loading properties...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-lg-5 mt-md-4 mt-sm-3 mt-2 px-3">
      {/* Back Button */}
      <button
        className="btn btn-outline-primary position-fixed top-5 start-0 m-2 d-flex align-items-center"
        onClick={() => navigate(-1)}
      >
        <FaChevronLeft className="me-2" /> {/* Chevron icon */}
        
      </button>

      {/* Page Title */}
      <h4 className="text-center fw-bold mb-3 fs-5 fs-md-4">Properties in {categoryName}</h4>

      {/* Property Grid */}
      <div className="row">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
              <div className="property-item shadow-sm p-2 position-relative">
                {/* Wishlist Icon */}
                <div
                  className="position-absolute top-0 end-0 m-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistClick(property._id);
                  }}
                  style={{ cursor: "pointer", zIndex: 1 }}
                >
                  <FaHeart
                    className={`ms-auto ${isWishlisted[property._id] ? "text-danger" : "text-white"}`}
                    style={{
                      fontSize: "1.25rem",
                      cursor: "pointer",
                      filter: isWishlisted[property._id] ? "none" : "drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))",
                    }}
                  />
                </div>

                {/* Property Image */}
                <img
                  src={property.images && property.images.length > 0 ? property.images[0] : "https://via.placeholder.com/150"}
                  alt={property.name}
                  className="img-fluid rounded"
                  style={{ height: "200px", width: "100%", objectFit: "cover" }}
                  onClick={() => window.open(`/property/${property._id}`, "_blank")}
                />

                {/* Property Details */}
                <div className="property-details text-center p-2">
                  <h6 className="fw-bold mb-1 fs-6">{property.name}</h6>
                  <p className="text-muted small mb-1">{property.address}</p>

                  {/* Bedrooms and Adults */}
                  <div className="d-flex justify-content-center gap-3">
                    <div className="d-flex align-items-center">
                      <FaBed className="me-2" /> {/* Bedroom icon */}
                      <span>{property.capacity?.bedrooms || 0} Bedrooms</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaUser className="me-2" /> {/* Adult icon */}
                      <span>{property.capacity?.adults || 0} Adults</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No properties available in this category.</p>
        )}
      </div>

      {/* Filter and Sort Buttons */}
      <div className="fixed-bottom d-flex justify-content-center gap-3 mb-3">
        {/* Filter Button */}
        <Button
          variant="primary"
          onClick={() => setShowFilterModal(true)}
        >
          <FaFilter className="me-2" />
          Filters
          {appliedFiltersCount > 0 && (
            <Badge bg="danger" className="ms-2">
              {appliedFiltersCount}
            </Badge>
          )}
        </Button>
        {/* Sort Button */}
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-sort">
            <FaSort className="me-2" />
            Sort
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSort("priceLowToHigh")}>
              Price Low to High
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort("priceHighToLow")}>
              Price High to Low
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Filter Modal */}
      <Filter
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        filters={filters}
        setFilters={setFilters}
        appliedFiltersCount={appliedFiltersCount}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        show={showModal}
        onClose={() => setShowModal(false)}
        userId={userId}
        propertyId={selectedPropertyId}
        onWishlistUpdate={() => handleWishlistUpdate(selectedPropertyId)}
      />
    </div>
  );
};

export default CategoryPage;