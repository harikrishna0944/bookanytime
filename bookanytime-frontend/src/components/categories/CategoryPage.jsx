import React, { useEffect, useState } from "react";
import { TextField, InputAdornment, Button, Badge, Dropdown } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import { FaSearch, FaStar, FaUser, FaRupeeSign, FaHeart, FaFilter, FaSort } from "react-icons/fa";
import Filter from "./Filter";
import WishlistModal from "./WishlistModal";

const CategoryPage = ({
  loading,
  error,
  searchText,
  setSearchText,
  locationSearch,
  setLocationSearch,
  handleInputChange,
  handleLocationChange,
  handleFocus,
  handleBlur,
  isTyping,
  categories,
  currentCategoryIndex,
  selectedCategories,
  handleCategoryChange,
  filteredProperties,
  categoryName,
  handleWishlistClick,
  isWishlisted,
  propertyRatings,
  userId,
  showModal,
  setShowModal,
  selectedPropertyId,
  handleWishlistUpdate,
  showFilterModal,
  setShowFilterModal,
  filters,
  setFilters,
  appliedFiltersCount,
  applyFilters,
  clearFilters,
  sortOptions,
  handleSort,
  getSortToggleText
}) => {
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
                  <div
                    onClick={(e) =>
                      e.target.parentElement.nextSibling?.focus()
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "text",
                    }}
                  >
                    <InputAdornment position="start">
                      <SearchIcon />
                      {!isTyping && categories.length > 0 && (
                        <span>
                          Search for{" "}
                          <strong>{categories[currentCategoryIndex]}</strong>
                        </span>
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
                  minWidth: "80px",
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
            <div
              key={property._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3"
            >
              <div
                className="property-item shadow-sm p-2 position-relative"
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                }}
              >
                {property.popularity && property.popularity < 5 && (
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
                    className={`ms-auto ${
                      isWishlisted[property._id] ? "text-danger" : "text-white"
                    }`}
                    style={{
                      fontSize: "1.25rem",
                      cursor: "pointer",
                      filter: isWishlisted[property._id]
                        ? "none"
                        : "drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))",
                    }}
                  />
                </div>

                <img
                  src={
                    property.images && property.images.length > 0
                      ? property.images[0]
                      : "https://via.placeholder.com/150"
                  }
                  alt={property.name}
                  className="img-fluid rounded-top"
                  style={{
                    height: "180px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  onClick={() =>
                    window.open(`/property/${property._id}`, "_blank")
                  }
                />

                <div className="property-details p-2">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-1 fs-6 text-start">
                        {property.name}
                      </h6>
                      <p className="text-muted small mb-1 text-start">
                        {property.city}, {property.address}
                      </p>
                    </div>
                    {propertyRatings[property._id] ? (
                      <div className="d-flex align-items-center">
                        <FaStar
                          className="text-warning me-1"
                          style={{ fontSize: "1.1rem" }}
                        />
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
                      <span className="small">
                        {property.capacity?.adults || 0} Adults
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="text-muted small me-1">Cost</span>
                      <span
                        className="fw-bold"
                        style={{
                          fontSize: "0.9rem",
                          color: "#28a745",
                        }}
                      >
                        <FaRupeeSign
                          className="me-1"
                          style={{ color: "black" }}
                        />
                        {property.minPrice?.toLocaleString() || "0"} -{" "}
                        {property.maxPrice?.toLocaleString() || "0"}
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
        <Button variant="primary" onClick={() => setShowFilterModal(true)}>
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
              {sortOptions.includes("priceLowToHigh") && (
                <span className="me-2">✓</span>
              )}
              Price Low to High
            </Dropdown.Item>
            <Dropdown.Item
              active={sortOptions.includes("priceHighToLow")}
              onClick={() => handleSort("priceHighToLow")}
            >
              {sortOptions.includes("priceHighToLow") && (
                <span className="me-2">✓</span>
              )}
              Price High to Low
            </Dropdown.Item>
            <Dropdown.Item
              active={sortOptions.includes("ratingHighToLow")}
              onClick={() => handleSort("ratingHighToLow")}
            >
              {sortOptions.includes("ratingHighToLow") && (
                <span className="me-2">✓</span>
              )}
              Highest Rated
            </Dropdown.Item>
            <Dropdown.Item
              active={sortOptions.includes("popularityHighToLow")}
              onClick={() => handleSort("popularityHighToLow")}
            >
              {sortOptions.includes("popularityHighToLow") && (
                <span className="me-2">✓</span>
              )}
              Most Popular
            </Dropdown.Item>
            {sortOptions.length > 0 && (
              <Dropdown.Item
                onClick={() => handleSort("clear")}
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
