import React, { useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FaBed, FaUser } from "react-icons/fa";

const Filter = ({
  showFilterModal,
  setShowFilterModal,
  filters,
  setFilters,
  appliedFiltersCount,
  applyFilters,
  clearFilters,
}) => {
  const [isSliderMoving, setIsSliderMoving] = useState(false); // Track slider movement

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseInt(value, 10), // Convert to number or keep empty
    }));
  };

  // Handle price range change
  const handlePriceRangeChange = (value) => {
    setFilters((prev) => ({ ...prev, priceRange: value }));
  };

  // Handle slider movement
  const handleSliderChange = (value) => {
    setIsSliderMoving(true); // Enable wave animation
    handlePriceRangeChange(value);
  };

  // Handle slider release
  const handleSliderAfterChange = () => {
    setIsSliderMoving(false); // Disable wave animation
  };

  // Get dynamic track style for wave animation
  const getTrackStyle = () => {
    return {
      backgroundColor: isSliderMoving ? "transparent" : "#0d6efd",
      height: "8px",
      background: isSliderMoving
        ? "linear-gradient(90deg, #0d6efd, #0d6efd, #0d6efd, #0d6efd, #0d6efd)"
        : "#0d6efd",
      backgroundSize: "200% 100%",
      animation: isSliderMoving ? "wave 3s linear infinite" : "none",
    };
  };

  return (
    <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Price Range Slider */}
          <Form.Group className="mb-4">
            <Form.Label>Price Range</Form.Label>
            <div className="d-flex justify-content-between mb-2">
              <span>Minimum: {filters.priceRange[0]}</span>
              <span>Maximum: {filters.priceRange[1]}</span>
            </div>
            <Slider
              range
              min={0}
              max={100000}
              defaultValue={[0, 100000]}
              value={filters.priceRange}
              onChange={handleSliderChange}
              onAfterChange={handleSliderAfterChange}
              trackStyle={getTrackStyle()}
              handleStyle={{
                borderColor: "#0d6efd",
                backgroundColor: "#fff",
                width: "20px",
                height: "20px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
              railStyle={{ backgroundColor: "#e9ecef", height: "8px" }}
            />
          </Form.Group>

          {/* Bedrooms */}
          <Form.Group className="mb-3">
            <div className="d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: "80px" }}>
                <FaBed className="me-2" /> {/* Bedroom icon */}
                Bedrooms
              </Form.Label>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    bedrooms: Math.max(0, (parseInt(prev.bedrooms, 10) || 0) - 1),
                  }))
                }
              >
                -
              </Button>
              <Form.Control
                type="number"
                placeholder="Any"
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="mx-2 text-center"
                style={{ width: "80px" }}
              />
              <Button
                variant="outline-secondary"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    bedrooms: (parseInt(prev.bedrooms, 10) || 0) + 1,
                  }))
                }
              >
                +
              </Button>
            </div>
          </Form.Group>

          {/* Adults */}
          <Form.Group className="mb-3">
            <div className="d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: "80px" }}>
                <FaUser className="me-2" /> {/* Adult icon */}
                Adults
              </Form.Label>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    adults: Math.max(0, (parseInt(prev.adults, 10) || 0) - 1),
                  }))
                }
              >
                -
              </Button>
              <Form.Control
                type="number"
                placeholder="Any"
                name="adults"
                value={filters.adults}
                onChange={handleFilterChange}
                className="mx-2 text-center"
                style={{ width: "80px" }}
              />
              <Button
                variant="outline-secondary"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    adults: (parseInt(prev.adults, 10) || 0) + 1,
                  }))
                }
              >
                +
              </Button>
            </div>
          </Form.Group>

          {/* Amenities */}
          <Form.Group className="mb-3">
            <div className="border-top pt-3"> {/* Black line and spacing */}
              <h6 className="fw-bold mb-3">Amenities</h6> {/* Title */}
              <div className="d-flex flex-wrap gap-2"> {/* Amenities buttons */}
                {[
                  { name: "WiFi", icon: "📶" },
                  { name: "Swimming Pool", icon: "🏊‍♂️" },
                  { name: "Parking", icon: "🅿️" },
                  { name: "Air Conditioning", icon: "❄️" },
                  { name: "Gym", icon: "💪" },
                  { name: "Pet Friendly", icon: "🐾" },
                ].map((amenity, index) => (
                  <Button
                    key={index}
                    variant={filters.amenities?.includes(amenity.name) ? "primary" : "outline-secondary"}
                    onClick={() => {
                      const updatedAmenities = filters.amenities?.includes(amenity.name)
                        ? filters.amenities.filter((a) => a !== amenity.name) // Remove if already selected
                        : [...(filters.amenities || []), amenity.name]; // Add if not selected
                      setFilters((prev) => ({ ...prev, amenities: updatedAmenities }));
                    }}
                    className="d-flex align-items-center gap-2"
                  >
                    <span>{amenity.icon}</span> {/* Amenity symbol */}
                    <span>{amenity.name}</span> {/* Amenity name */}
                  </Button>
                ))}
              </div>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={clearFilters}>
          Clear All
        </Button>
        <Button variant="primary" onClick={applyFilters}>
          Apply Filters
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Filter;