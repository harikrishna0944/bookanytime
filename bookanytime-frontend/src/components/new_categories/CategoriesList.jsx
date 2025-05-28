import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./CategoryList.css";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((response) => {
        // Mock data to match the screenshot - remove this in production
        const mockCategories = [
          { _id: "1", name: "Farmhouses", count: 84 },
          { _id: "2", name: "Hotels", count: 156 },
          { _id: "3", name: "Apartments", count: 213 },
          { _id: "4", name: "Villas", count: 67 },
          { _id: "5", name: "Cottages", count: 42 },
          { _id: "6", name: "Cabins", count: 35 },
          { _id: "7", name: "Treehouses", count: 12 },
          { _id: "8", name: "Beachfront", count: 29 }
        ];
        setCategories(mockCategories);
        // In production, use this instead:
        // setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleNavigation = useCallback(
    (categoryName) => {
      navigate(`/${categoryName.toLowerCase()}`);
    },
    [navigate]
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
    <Container className="my-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Browse by Property Type</h2>
        <p className="text-muted">
          Explore different types of accommodations for your perfect stay
        </p>
      </div>

      <div className="position-relative">
        {showLeftArrow && (
          <button 
            className="scroll-arrow left bg-white rounded-circle shadow-sm" 
            onClick={handleScrollLeft}
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: "-20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              border: "none"
            }}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          className="categories-container d-flex overflow-auto py-3"
          ref={containerRef}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            gap: "16px"
          }}
        >
          {loading ? (
            <div className="w-100 text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger" className="w-100 text-center">{error}</Alert>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category._id}
                className="category-card flex-shrink-0 rounded-3 p-3"
                onClick={() => handleNavigation(category.name)}
                style={{
                  width: "180px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  border: "1px solid #e0e0e0"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
              >
                <div className="text-center mb-2">
                  {/* Placeholder for image - replace with your actual image */}
                  <div 
                    className="mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center" 
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#f8f9fa"
                    }}
                  >
                    <span className="text-muted">Icon</span>
                  </div>
                </div>
                <h6 className="fw-bold text-center mb-1">{category.name}</h6>
                <p className="text-muted text-center mb-0">
                  {category.count} properties
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted w-100 text-center">No categories available</p>
          )}
        </div>

        {showRightArrow && (
          <button 
            className="scroll-arrow right bg-white rounded-circle shadow-sm"
            onClick={handleScrollRight}
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: "-20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              border: "none"
            }}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </Container>
  );
};

export default CategoriesList;