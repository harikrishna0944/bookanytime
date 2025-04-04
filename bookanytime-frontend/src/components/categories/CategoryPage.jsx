import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart, FaFilter, FaBed, FaUser, FaSort, FaChevronLeft, FaRupeeSign, FaStar, FaSearch } from "react-icons/fa";
import WishlistModal from "./WishlistModal";
import { Button, Badge, Dropdown } from "react-bootstrap";
import Filter from "./Filter";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([categoryName || "All"]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [isWishlisted, setIsWishlisted] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: undefined,
    bedrooms: undefined,
    adults: undefined,
    amenities: undefined
  });
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [sortOptions, setSortOptions] = useState([]); // Changed to array for multi-sort
  const [propertyRatings, setPropertyRatings] = useState({});

  // Fetch categories and user data
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        const categoryNames = data.map((category) => category.name);
        setCategories(categoryNames);
      })
      .catch((error) => console.error("Error fetching categories:", error));

    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user ? user.id : null);
  }, []);

  // Category cycling effect
  useEffect(() => {
    if (categories.length > 0 && !isTyping) {
      const interval = setInterval(() => {
        setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [categories, isTyping]);

  // Fetch properties
  useEffect(() => {
    setLoading(true);
    setError("");
    
    if (searchText.trim() || locationSearch.trim()) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/search-locations`, {
        params: {
          query: locationSearch.trim(),
          propertyName: searchText.trim(),
          category: selectedCategories.includes("All") ? "" : selectedCategories.join(","),
        },
      })
      .then((response) => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setError("Failed to load search results.");
        setLoading(false);
      });
    } else {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties?category=${categoryName}`)
      .then((response) => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties.");
        setLoading(false);
      });
    }
  }, [categoryName, searchText, locationSearch, selectedCategories]);

  // Fetch ratings
  useEffect(() => {
    if (properties.length === 0) return;

    const fetchAllRatings = async () => {
      try {
        const ratingsData = {};
        
        await Promise.all(
          properties.map(async (property) => {
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/ratings/${property._id}`
              );
              if (response.data && response.data.length > 0) {
                const sum = response.data.reduce((acc, curr) => acc + curr.rating, 0);
                ratingsData[property._id] = sum / response.data.length;
              }
            } catch (error) {
              console.error(`Error fetching ratings for property ${property._id}:`, error);
            }
          })
        );
        
        setPropertyRatings(ratingsData);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchAllRatings();
  }, [properties]);

  // Fetch wishlist status
  useEffect(() => {
    if (!userId || properties.length === 0) return;

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

  // Filter and sort properties
  useEffect(() => {
    filterAndSortProperties();
  }, [filters, sortOptions, properties]);

  const filterAndSortProperties = () => {
    let result = [...properties];

    // Apply filters
    result = result.filter((property) => {
      const price = property.minPrice || 0;
      const bedrooms = property.capacity?.bedrooms || 0;
      const adults = property.capacity?.adults || 0;
      const amenities = property.amenities || [];

      return (
        (filters.priceRange === undefined || 
          (price >= filters.priceRange[0] && price <= filters.priceRange[1])) &&
        (filters.bedrooms === undefined || bedrooms === filters.bedrooms) &&
        (filters.adults === undefined || adults === filters.adults) &&
        (filters.amenities === undefined || 
          filters.amenities.every(amenity => amenities.includes(amenity)))
      );
    });

    // Apply multiple sorting criteria
    if (sortOptions.length > 0) {
      result.sort((a, b) => {
        for (const option of sortOptions) {
          let comparison = 0;
          
          switch (option) {
            case "priceLowToHigh":
              comparison = (a.minPrice || 0) - (b.minPrice || 0);
              break;
            case "priceHighToLow":
              comparison = (b.minPrice || 0) - (a.minPrice || 0);
              break;
            case "ratingHighToLow":
              comparison = (propertyRatings[b._id] || 0) - (propertyRatings[a._id] || 0);
              break;
            case "popularityHighToLow":
              comparison = (a.popularity ?? Infinity) - (b.popularity ?? Infinity);
              break;
            default:
              comparison = 0;
          }
          
          if (comparison !== 0) {
            return comparison;
          }
        }
        return 0;
      });
    }

    setFilteredProperties(result);

    // Calculate applied filters count
    const count = [
      filters.priceRange !== undefined,
      filters.bedrooms !== undefined,
      filters.adults !== undefined,
      filters.amenities !== undefined && filters.amenities.length > 0
    ].filter(Boolean).length;

    setAppliedFiltersCount(count);
  };

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleFocus = () => setIsTyping(true);
  const handleBlur = () => setIsTyping(false);

  const handleCategoryChange = (category) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes("All")
          ? [category]
          : prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    }
  };

  const handleLocationChange = (event) => {
    setLocationSearch(event.target.value);
  };

  const handleWishlistClick = async (propertyId) => {
    if (!userId) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    setSelectedPropertyId(propertyId);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`
      );
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

  const removeFromWishlist = async (propertyId, wishlistName) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}/remove`,
        {
          headers: { "Content-Type": "application/json" },
          data: { propertyId, wishlistName },
        }
      );

      setIsWishlisted((prev) => ({ ...prev, [propertyId]: false }));
      alert(`Property has been removed from "${wishlistName}".`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove the property. Please try again.");
    }
  };

  const handleWishlistUpdate = (propertyId) => {
    setIsWishlisted((prev) => ({ ...prev, [propertyId]: true }));
  };

  const applyFilters = () => {
    filterAndSortProperties();
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: undefined,
      bedrooms: undefined,
      adults: undefined,
      amenities: undefined
    });
    setSortOptions([]);
    setAppliedFiltersCount(0);
  };

  const handleSort = (option) => {
    setSortOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const getSortToggleText = () => {
    if (sortOptions.length === 0) return "Sort";
    if (sortOptions.length === 1) {
      const option = sortOptions[0];
      return {
        priceLowToHigh: "Price: Low to High",
        priceHighToLow: "Price: High to Low",
        ratingHighToLow: "Highest Rated",
        popularityHighToLow: "Most Popular"
      }[option] || "Sort";
    }
    return `${sortOptions.length} sorts`;
  };

  if (loading) return <p className="text-center mt-5">Loading properties...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-lg-5 mt-md-4 mt-sm-3 mt-2 px-0">
      {/* Search Section */}
      <div className="search-section mb-4">
        <div className="search-inputs-container row g-2">
          <div className="col-md-6">
            <TextField
              type="text"
              className="search-input w-100"
              placeholder={isTyping ? "Search by property name" : ""}
              value={searchText}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              InputProps={{
                startAdornment: (
                  <div onClick={(e) => e.target.parentElement.nextSibling.focus()} style={{ display: "flex", alignItems: "center", cursor: "text" }}>
                    <InputAdornment position="start">
                      <SearchIcon />
                      {!isTyping && categories.length > 0 && (
                        <span>Search for <strong>{categories[currentCategoryIndex]}</strong></span>
                      )}
                    </InputAdornment>
                  </div>
                ),
              }}
            />
          </div>
          <div className="col-md-6">
            <TextField
              type="text"
              className="search-input w-100"
              placeholder="Search By Location"
              value={locationSearch}
              onChange={handleLocationChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>

        <div className="category-filters-container mt-3">
          <div className="d-flex flex-nowrap gap-2 overflow-auto py-2">
            {["All", ...categories].map((category) => (
              <button
                key={category}
                className={`btn ${
                  selectedCategories.includes(category) 
                    ? "btn-primary rounded-0"
                    : "btn-outline-primary rounded-pill"
                }`}
                onClick={() => handleCategoryChange(category)}
                style={{
                  transition: "all 0.3s ease",
                  minWidth: "80px"
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page Title */}
      {!searchText && !locationSearch && (
        <h4 className="text-center fw-bold mb-3 fs-5 fs-md-4">
          Properties in {categoryName}
        </h4>
      )}

      {/* Properties Grid */}
      <div className="row">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div key={property._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
              <div className="property-item shadow-sm p-2 position-relative" style={{ border: "1px solid #dee2e6", borderRadius: "8px" }}>

              {(property.popularity && property.popularity < 5) && (
                <div className="position-absolute top-0 start-0 m-2">
                  <Badge bg="warning" text="dark" className="shadow-sm">
                    Popular
                  </Badge>
                </div>
              )}
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

                <img
                  src={property.images && property.images.length > 0 ? property.images[0] : "https://via.placeholder.com/150"}
                  alt={property.name}
                  className="img-fluid rounded-top"
                  style={{ height: "180px", width: "100%", objectFit: "cover" }}
                  onClick={() => window.open(`/property/${property._id}`, "_blank")}
                />

                <div className="property-details p-2">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-1 fs-6 text-start">{property.name}</h6>
                      <p className="text-muted small mb-1 text-start">
                        {property.city}, {property.address}
                      </p>
                    </div>
                    {propertyRatings[property._id] ? (
                      <div className="d-flex align-items-center">
                        <FaStar className="text-warning me-1" style={{ fontSize: "1.1rem" }} />
                        <span className="fw-bold small">
                          {propertyRatings[property._id].toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="badge bg-success">New</span>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center border-top pt-2">
                    <div className="d-flex align-items-center">
                      <FaUser className="me-2 text-muted" />
                      <span className="small">{property.capacity?.adults || 0} Adults</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="text-muted small me-1">Cost</span>
                      <span className="fw-bold" style={{ fontSize: "0.9rem", color: "#28a745" }}>
                        <FaRupeeSign className="me-1" style={{ color: "black" }} />
                        {property.minPrice?.toLocaleString() || "0"} - {property.maxPrice?.toLocaleString() || "0"} 
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No properties match your filters.</p>
            <Button variant="outline-primary" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Filter and Sort Buttons */}
      <div className="fixed-bottom d-flex justify-content-center gap-3 mb-3">
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
        
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-sort">
            <FaSort className="me-2" />
            {getSortToggleText()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item 
              active={sortOptions.includes("priceLowToHigh")}
              onClick={() => handleSort("priceLowToHigh")}
            >
              {sortOptions.includes("priceLowToHigh") && <span className="me-2">✓</span>}
              Price Low to High
            </Dropdown.Item>
            <Dropdown.Item 
              active={sortOptions.includes("priceHighToLow")}
              onClick={() => handleSort("priceHighToLow")}
            >
              {sortOptions.includes("priceHighToLow") && <span className="me-2">✓</span>}
              Price High to Low
            </Dropdown.Item>
            <Dropdown.Item 
              active={sortOptions.includes("ratingHighToLow")}
              onClick={() => handleSort("ratingHighToLow")}
            >
              {sortOptions.includes("ratingHighToLow") && <span className="me-2">✓</span>}
              Highest Rated
            </Dropdown.Item>
            <Dropdown.Item 
              active={sortOptions.includes("popularityHighToLow")}
              onClick={() => handleSort("popularityHighToLow")}
            >
              {sortOptions.includes("popularityHighToLow") && <span className="me-2">✓</span>}
              Most Popular
            </Dropdown.Item>
            {sortOptions.length > 0 && (
              <Dropdown.Item 
                onClick={() => setSortOptions([])}
                className="text-danger"
              >
                Clear All Sorting
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Modals */}
      <Filter
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        filters={filters}
        setFilters={setFilters}
        appliedFiltersCount={appliedFiltersCount}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

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
            transition: transform 0.2s;
            border-radius: 8px;
            overflow: hidden;
            background: white;
          }
          .property-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          .fixed-bottom {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
            background: white;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
          }
          .search-section {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .property-item img {
            width: 100%;
            height: 190px;
            object-fit: cover;
            border-radius: 8px;
          }
          .dropdown-item.active {
            background-color: rgba(15, 245, 7, 0.5);
          }
        `}
      </style>
    </div>
  );
};

export default CategoryPage;