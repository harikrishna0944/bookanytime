import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { FaHeart, FaFilter, FaSort, FaStar } from "react-icons/fa";
import WishlistModal from "../categories/WishlistModal";
import { Button, Badge, Dropdown } from "react-bootstrap";
import Filter from "../categories/Filter";
import "./Searchbar.css";
import { FaUser, FaRupeeSign } from "react-icons/fa";

const SearchBar = () => {
  // State variables
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [isWishlisted, setIsWishlisted] = useState({});
  const [userId, setUserId] = useState(null);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [propertyRatings, setPropertyRatings] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: undefined,
    bedrooms: undefined,
    adults: undefined,
    amenities: undefined
  });
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [sortOptions, setSortOptions] = useState([]);

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

  // Search properties when search criteria change
  useEffect(() => {
    searchProperties();
  }, [searchText, locationSearch, selectedCategories]);

  // Fetch ratings for properties
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

  // Fetch wishlist status for properties
  useEffect(() => {
    if (!userId || properties.length === 0) return;

    const fetchWishlists = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`
        );
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

  // Apply filters and sorting when they change
  useEffect(() => {
    filterAndSortProperties();
  }, [filters, sortOptions, properties]);

  // Filter and sort properties based on current criteria
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

  // Search properties based on current criteria
  const searchProperties = async () => {
    if (!searchText.trim() && !locationSearch.trim() && selectedCategories.includes("All")) {
      setProperties([]);
      setFilteredProperties([]);
      return;
    }
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/search-locations`, {
        params: {
          query: locationSearch.trim(),
          propertyName: searchText.trim(),
          category: selectedCategories.includes("All") ? "" : selectedCategories.join(","),
        },
      });
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }    
  };

  // Handle search input changes
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleFocus = () => setIsTyping(true);
  const handleBlur = () => setIsTyping(false);

  // Handle category selection
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

  // Handle location search input
  const handleLocationChange = (event) => {
    setLocationSearch(event.target.value);
  };

  // Handle wishlist actions
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
        setShowWishlistModal(true);
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

  // Handle filter actions
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

  // Handle sort actions
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

  const clearAllSorting = () => {
    setSortOptions([]);
  };

  return (
    <div className="search-page ">
      <div className="search-inputs-container container-fluid">
        <div className="search-bar-container left">
          <TextField
            type="text"
            className="search-input"
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

        <div className="search-bar-container right">
          <TextField
            type="text"
            className="search-input"
            placeholder="Search By Location"
            value={locationSearch}
            onChange={handleLocationChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <div className="category-filters-container d-flex">
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
        <div className="gap-3">
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
                onClick={clearAllSorting}
                className="text-danger"
              >
                Clear All Sorting
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        </div>
      </div>

      <div className="search-results">
        {filteredProperties.length > 0 ? (
          <div className="row">
            {filteredProperties.map((property) => (
              <div 
                key={property._id} 
                className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="property-item shadow-sm p-2 position-relative">
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
                      size={20}
                      color={isWishlisted[property._id] ? "red" : "white"}
                    />
                  </div>

                  <img
                    src={property.images && property.images.length > 0 ? property.images[0] : "https://via.placeholder.com/150"}
                    alt={property.name}
                    className="img-fluid"
                    onClick={() => window.open(`/property/${property._id}`, "_blank")}
                  />

                  <div className="property-details text-center p-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="fw-bold mb-0 fs-6 text-start">{property.name}</h6>
                      {propertyRatings[property._id] && (
                        <div className="d-flex align-items-center">
                          <FaStar className="text-warning me-1" style={{ fontSize: "0.8rem" }} />
                          <span className="small text-muted">
                            {propertyRatings[property._id].toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted small mb-1 text-start">
                      {property.city}, {property.address}
                    </p>
                    
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
            ))}
          </div>
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No properties match your filters.</p>
          </div>
        )}
      </div>

      {/* <div className="fixed-bottom d-flex justify-content-center gap-3 mb-3">
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
                onClick={clearAllSorting}
                className="text-danger"
              >
                Clear All Sorting
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div> */}

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
        show={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
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
            // background: white;
            // box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
          }
          .dropdown-item.active {
            background-color: rgba(15, 245, 7, 0.5);
          }
          .Dropdown.Menu{
          backgroung-color:white;
          }
        `}
      </style>
    </div>
  );
};

export default SearchBar;