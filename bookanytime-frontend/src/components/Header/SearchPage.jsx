import React, { useState } from "react";
import SearchBar from "./SearchBar";
import axios from "axios";
import "./Searchbar.css"

const SearchPage = () => {
  const [properties, setProperties] = useState([]);

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setProperties([]); // Clear results if query is too short
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/properties/search?query=${query}`);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="search-page">
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Display Search Results */}
      <div className="search-results">
        {properties.length > 0 ? (
          <div className="property-grid">
            {properties.map((property) => (
              <div key={property._id} className="property-card">
                <img src={property.image} alt={property.name} className="property-image" />
                <h3>{property.name}</h3>
                <p>{property.category}</p>
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

export default SearchPage;
