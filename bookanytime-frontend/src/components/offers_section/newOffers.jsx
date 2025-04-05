import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "/home/ubuntu/bookanytime/bookanytime-frontend/src/components/offers_section/newOffers.jsx";

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
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((response) => setCategories([{ _id: "all", name: "All Offers" }, ...response.data]))
      .catch((error) => console.error("Error fetching categories:", error));
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
    <Container fluid className="offers-container">
      <div className="offers-header">
        <h2>Offers</h2>
        <div className="view-all-link">VIEW ALL →</div>
      </div>

      <div className="categories-wrapper">
        {showLeftArrow && (
          <button className="scroll-arrow left" onClick={handleScrollLeft}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="categories-list" ref={containerRef}>
          {categories.map((category) => (
            <div
              key={category._id}
              className={`category-tab ${selectedCategories.includes(category.name) ? "active" : ""}`}
              onClick={() => handleCategoryChange(category.name)}
            >
              {category.name}
            </div>
          ))}
        </div>
        {showRightArrow && (
          <button className="scroll-arrow right" onClick={handleScrollRight}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div className="offers-grid">
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredOffers.length > 0 ? (
          filteredOffers.map((offer, index) => (
            <div key={index} className="offer-card">
              <div className="offer-badge">{offer.category.toUpperCase()}</div>
              <div className="offer-highlight">
                {offer.highlightText || "T&C'S APPLY"}
              </div>
              <div className="offer-title">
                {offer.title || "Special Offer"}
              </div>
              <div className="offer-description">
                {offer.description || "Explore this amazing deal"}
              </div>
              <button 
                className="book-now-btn"
                onClick={() => navigate(`/offers/${offer._id}`)}
              >
                BOOK NOW
              </button>
            </div>
          ))
        ) : (
          <p className="no-offers-message">No Offers available</p>
        )}
      </div>
    </Container>
  );
};

export default RecentlyViewed;