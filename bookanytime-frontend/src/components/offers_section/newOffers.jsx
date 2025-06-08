import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Alert } from "react-bootstrap";
import "./newOffers.css";

const RecentlyViewed = () => {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/offers`);
      setOffers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (offers.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % offers.length);
      }, 4000);
    }
    return () => clearInterval(intervalRef.current);
  }, [offers]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!offers.length) return <p>No offers available</p>;

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <button className="nav-btn left" onClick={handlePrev}>‹</button>

        <div className="carousel-slide">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${offers[currentIndex].image[0]}`}
            alt={offers[currentIndex].name}
            className="carousel-image"
            onClick={() => navigate(`/offers/${offers[currentIndex]._id}`)}
          />
        </div>

        <button className="nav-btn right" onClick={handleNext}>›</button>
      </div>

      <div className="carousel-dots">
        {offers.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
