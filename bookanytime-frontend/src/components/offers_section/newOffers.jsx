import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert, Row, Col } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../recently_viewed/RecentlyViewed.css";

const RecentlyViewed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [offers, setOffers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Offers");
  
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const categoriesContainerRef = useRef(null);

  const categories = [
    "All Offers",
    "Bank Offers",
    "Flights",
    "Hotels",
    "Holidays",
    "Trains",
    "Cabs",
    "Bus",
    "Forex"
  ];

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

  const filteredOffers = selectedCategory === "All Offers" 
    ? offers 
    : offers.filter(offer => offer.category === selectedCategory);

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
    <Container fluid className="py-4 px-3 px-md-5">
      <h2 className="mb-4 fw-bold">Offers</h2>
      
      {/* Categories */}
      <div className="position-relative mb-4">
        <div 
          ref={categoriesContainerRef}
          className="d-flex overflow-auto hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="d-flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`btn rounded-pill px-3 py-2 text-nowrap ${
                  selectedCategory === category 
                    ? "btn-primary" 
                    : "btn-outline-primary"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* View All Link */}
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-link text-decoration-none p-0 text-primary fw-bold"
          onClick={() => setSelectedCategory("All Offers")}
        >
          VIEW ALL →
        </button>
      </div>

      {/* Offers Grid */}
      <Row className="g-3">
        {loading ? (
          <Col className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </Col>
        ) : error ? (
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        ) : filteredOffers.length > 0 ? (
          filteredOffers.map((offer, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3}>
              <div 
                className="card h-100 border-0 shadow-sm overflow-hidden"
                onClick={() => navigate(`/offers/${offer._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="position-relative" style={{ paddingTop: '75%' }}>
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${offer.image[0]}`}
                    alt={offer.name}
                    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body">
                  <h6 className="card-title fw-bold mb-1">{offer.name}</h6>
                  <p className="text-muted small mb-2">
                    <small>Valid: {new Date(offer.startDate).toLocaleDateString("en-GB")} - {new Date(offer.endDate).toLocaleDateString("en-GB")}</small>
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary">{offer.category}</span>
                    <button className="btn btn-sm btn-outline-primary">BOOK NOW</button>
                  </div>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center text-muted">No offers available in this category</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default RecentlyViewed;