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
        setCategories(response.data);
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
      navigate(`/${categoryName}`);
    },
    [navigate]
  );

  const checkScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      console.log({ scrollLeft, scrollWidth, clientWidth }); // Debugging
      setShowLeftArrow(scrollLeft > 10); // Add a small threshold
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // Add a small threshold
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
      window.addEventListener("resize", checkScroll); // Add resize listener
      checkScroll(); // Initial check
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll); // Cleanup resize listener
      }
    };
  }, [checkScroll]);

  return (
    <Container fluid className="p-3 text-center position-relative">
      <div className="position-relative">
        {showLeftArrow && (
          <button className="scroll-arrow left" onClick={handleScrollLeft}>
            <ChevronLeft size={16} />
          </button>
        )}
        <div
          className="categories-container"
          ref={containerRef}
        >
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category._id}
                className="category-wrapper"
                onClick={() => handleNavigation(category.name)}
              >
                <div className="category-card">
                  {category.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${category.image}`}
                      alt={category.name}
                      draggable="false"
                    />
                  ) : (
                    <div className="text-muted text-center">No Image</div>
                  )}
                </div>
                <h6 className="category-name">{category.name}</h6>
              </div>
            ))
          ) : (
            <p className="text-muted">No categories available</p>
          )}
        </div>
        {showRightArrow && (
          <button className="scroll-arrow right" onClick={handleScrollRight}>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </Container>
  );
};

export default CategoriesList;