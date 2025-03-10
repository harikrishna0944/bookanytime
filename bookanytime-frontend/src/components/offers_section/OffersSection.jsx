import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CCard, CCardBody, CCardImage } from "@coreui/react";
import { Button } from "react-bootstrap";
import "./OffersSection.css";

const OffersSection = () => {
  const [offers, setOffers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [categories, setCategories] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((response) => setCategories([{ _id: "all", name: "All" }, ...response.data]))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/offers`);
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

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

  const checkScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 0);
      setShowRightArrow(
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth < scrollRef.current.scrollWidth
      );
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  const filteredOffers = offers.filter(
    (offer) => selectedCategories.includes("All") || selectedCategories.includes(offer.category)
  );

  return (
    <div className="offers-section">
      <h2>Available Offers</h2>

      {/* Category Filters */}
      <div className="category-filters-container">
        <div className="d-flex flex-nowrap gap-2 overflow-auto py-2" id="sample">
          {categories.map((category) => (
            <button
              key={category._id}
              className={`btn rounded-pill ${
                selectedCategories.includes(category.name)
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => handleCategoryChange(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Slider */}
      <div className="scroll-container-wrapper">
        {showLeftArrow && (
          <Button className="scroll-btn left" onClick={scrollLeft}>
            &#10094;
          </Button>
        )}

        <div className="scroll-container" ref={scrollRef} onScroll={checkScroll}>
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer, index) => {
              const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
              const imageUrl = BASE_URL + offer.image[0];

              const startDate = new Date(offer.startDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const endDate = new Date(offer.endDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <div key={index} className="offer-wrapper">
                  <CCard className="offer-card">
                    <CCardImage orientation="top" src={imageUrl} className="offer-image" />
                    <CCardBody>
                      <h5 className="offer-name">{offer.name}</h5>
                      <h6 className="offer-category">{offer.category}</h6>
                      <p className="offer-dates">
                        Valid: {startDate} - {endDate}
                      </p>
                    </CCardBody>
                  </CCard>
                </div>
              );
            })
          ) : (
            <p>No offers available.</p>
          )}
        </div>

        {showRightArrow && (
          <Button className="scroll-btn right" onClick={scrollRight}>
            &#10095;
          </Button>
        )}
      </div>
    </div>
  );
};

export default OffersSection;