import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import axios from "axios";
import "./Searchbar.css";

const SearchBar = () => {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
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
      const response = await axios.get("http://localhost:5000/api/properties/search-locations", {
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

  return (
    <div className="search-page">
      <div className="search-bar-container">
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

      <div className="search-bar-container">
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

      <div className="category-filters">
        {["All", ...categories].map((category) => (
          <Button
            key={category}
            variant={selectedCategories.includes(category) ? "contained" : "outlined"}
            onClick={() => handleCategoryChange(category)}
            style={{ margin: "5px" }}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="search-results">
        {properties.length > 0 ? (
          <div className="property-list">
            {properties.map((property) => (
              <div key={property._id} className="property-card">
                <img src={property.images[0]} alt={property.name} className="property-image" />
                <div className="property-details">
                  <h3>{property.name}</h3>
                  <p>{property.category}</p>
                  <p>{property.address}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
