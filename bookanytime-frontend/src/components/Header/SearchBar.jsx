import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import axios from "axios";
import { FaHeart } from "react-icons/fa"; // Import a heart icon from react-icons
import "./Searchbar.css";

const SearchBar = () => {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [wishlist, setWishlist] = useState(new Set()); // Track wishlisted properties

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        const categoryNames = data.map((category) => category.name);
        setCategories(categoryNames);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !isTyping) {
      const interval = setInterval(() => {
        setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [categories, isTyping]);

  useEffect(() => {
    searchProperties(); // Trigger search whenever filters change
  }, [searchText, locationSearch, selectedCategories]);

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

  const searchProperties = async () => {
    if (!searchText.trim() && !locationSearch.trim() && selectedCategories.includes("All")) {
      setProperties([]);
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

  const handleLocationChange = (event) => {
    setLocationSearch(event.target.value);
  };

  // Toggle wishlist for a property
  const toggleWishlist = (propertyId) => {
    setWishlist((prevWishlist) => {
      const newWishlist = new Set(prevWishlist);
      if (newWishlist.has(propertyId)) {
        newWishlist.delete(propertyId); // Remove from wishlist
      } else {
        newWishlist.add(propertyId); // Add to wishlist
      }
      return newWishlist;
    });
  };

  return (
    <div className="search-page">
      <div className="search-inputs-container">
        {/* Left Search Bar */}
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

        {/* Right Search Bar */}
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

      <div className="category-filters-container">
        <div className="d-flex flex-nowrap gap-2 overflow-auto py-2">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              className={`btn rounded-pill ${
                selectedCategories.includes(category) ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="search-results">
        {properties.length > 0 ? (
          <div className="row">
            {properties.map((property) => (
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
                    <FaHeart
                      size={20} // Decreased size
                      color={wishlist.has(property._id) ? "red" : "white"} // White color for non-wishlisted, red for wishlisted
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
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;