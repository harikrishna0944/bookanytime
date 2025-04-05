import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../recently_viewed/RecentlyViewed.css";

const RecentlyViewed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [offers, setOffers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["All Offers"]);
  const [categories, setCategories] = useState([]);
  
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    // Replace with your actual categories from the screenshot
    const staticCategories = [
      { _id: "all", name: "All Offers" },
      { _id: "bank", name: "Bank Offers" },
      { _id: "flights", name: "Flights" },
      { _id: "hotels", name: "Hotels" },
      { _id: "holidays", name: "Holidays" },
      { _id: "trains", name: "Trains" },
      { _id: "cabs", name: "Cabs" },
      { _id: "bus", name: "Bus" },
      { _id: "forex", name: "Forex" }
    ];
    setCategories(staticCategories);
  }, []);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/offers`);
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError("Failed to load offers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    if (category === "All Offers") {
      setSelectedCategories(["All Offers"]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes("All Offers")
          ? [category]
          : prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    }
  };

  const filteredOffers = offers.filter(
    (offer) => selectedCategories.includes("All Offers") || selectedCategories.includes(offer.category)
  );

  const checkScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      checkScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [checkScroll]);

  return (
    <Container fluid className="recently-viewed-container">
      <h2>Offers</h2>
      
      {/* Categories */}
      <div className="recently-viewed-wrapper">
        {showLeftArrow && (
          <button className="scroll-arrow left" onClick={handleScrollLeft}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="recently-viewed-items">
          {categories.map((category) => (
            <button
              key={category._id}
              className={`btn rounded-pill ${selectedCategories.includes(category.name) ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => handleCategoryChange(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
        {showRightArrow && (
          <button className="scroll-arrow right" onClick={handleScrollRight}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* View All Link */}
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-link text-decoration-none p-0 text-primary fw-bold"
          onClick={() => setSelectedCategories(["All Offers"])}
        >
          VIEW ALL →
        </button>
      </div>

      {/* Offers */}
      <div className="recently-viewed-wrapper">
        {showLeftArrow && (
          <button className="scroll-arrow left" onClick={handleScrollLeft}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="recently-viewed-items" ref={containerRef}>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : filteredOffers.length > 0 ? (
            filteredOffers.map((offer, index) => (
              <div key={index} className="offer-viewed-item">
                <div className="offer-viewed-card">
                  <div className="property-image-container" onClick={() => navigate(`/offers/${offer._id}`)}>
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${offer.image[0]}`}
                      alt={offer.name}
                      className="property-image"
                      draggable="false"
                    />
                  </div>
                  <div className="property-details">
                    <h6 className="property-name">{offer.name}</h6>
                    <h6 className="font-bold text-lg text-blue-600">{offer.category}</h6>
                    <p className="text-gray-500 mb-2">
                      Valid: {new Date(offer.startDate).toLocaleDateString("en-GB")} - {new Date(offer.endDate).toLocaleDateString("en-GB")}
                    </p>
                    <button className="btn btn-sm btn-outline-primary">BOOK NOW</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-categories-message">No Offers available</p>
          )}
        </div>
        {showRightArrow && (
          <button className="scroll-arrow right" onClick={handleScrollRight}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </Container>
  );
};

export default RecentlyViewed;