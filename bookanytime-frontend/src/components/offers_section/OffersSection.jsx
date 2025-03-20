import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CCard, CCardBody, CCardImage } from "@coreui/react";
import ItemsSlider from "../recently_viewed/ItemsSlider";
import "./OffersSection.css";

const OffersSection = () => {
  const [offers, setOffers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [categories, setCategories] = useState([]);
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
      <div style={{marginTop:"-50px", position:"relative", left:"1%", marginLeft:"-10px", marginRight:"-10px" }} className="below-slider">
      <ItemsSlider>
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
              <span key={index} style={{ height: "280px" }}>
                <CCard style={{ width: "200px", height: "280px" }}>
                  <CCardImage
                    orientation="top"
                    src={imageUrl}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <CCardBody>
                    <div>
                      <h5 className="font-bold text-lg text-gray-800 mb-1">{offer.name}</h5>
                      <h6 className="font-bold text-lg text-blue-600">{offer.category}</h6>
                      <p className="text-gray-500 mb-2">
                        Valid: {startDate} - {endDate}
                      </p>
                    </div>
                  </CCardBody>
                </CCard>
              </span>
            );
          })
        ) : (
          <p>No offers available.</p>
        )}
      </ItemsSlider>
      </div>
    </div>
  );
};

export default OffersSection;
