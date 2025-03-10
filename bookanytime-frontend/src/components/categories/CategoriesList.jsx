import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button } from "react-bootstrap";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    checkScroll();
  }, [categories]);

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
      scrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <>
      <style>
        {`
          .scroll-container-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            max-width: 90%;
            margin: auto;
            margin-top: -10px;
            margin-left: 40px;
          }

          .scroll-container {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            white-space: nowrap;
            scroll-behavior: smooth;
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
            max-width: 95%;
            padding-bottom: 10px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.9);
            padding: 12px;
          }

          .category-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: transform 0.3s ease-in-out;
          }
          .category-wrapper:hover {
            transform: scale(1.05);
          }

          .category-card {
            width: 140px;
            min-width: 140px;
            flex-shrink: 0;
            background: rgb(236, 229, 229);
            padding: 12px;
            border-radius: 8px;
            box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .category-card img {
            width: 85%;
            max-width: 90px;
            height: 90px;
            object-fit: cover;
            border-radius: 6px;
          }

          .no-image {
            width: 100%;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #555;
            background: #e0e0e0;
            border-radius: 6px;
          }

          .category-name {
            margin-top: 8px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
          }

          .scroll-btn {
            width: 40px;
            height: 40px;
            font-size: 18px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.3s;
            position: absolute;
            z-index: 2;
          }

          .scroll-btn:hover {
            background-color: #0056b3;
          }

          .scroll-btn.left {
            left: 10px;
          }

          .scroll-btn.right {
            right: 10px;
          }

          .black-line {
            margin-top: 15px;
            width: 85%;
            height: 2px;
            background-color:rgb(206, 63, 63);
            margin-left: 40px;
          }

          @media (max-width: 768px) {
            .category-card {
              min-width: 110px;
              padding: 10px;
            }
            .category-card img {
              max-width: 80px;
              height: 80px;
            }
            .category-name {
              font-size: 12px;
            }
            .scroll-btn {
              width: 35px;
              height: 35px;
              font-size: 16px;
            }
          }

          @media (max-width: 480px) {
            .category-card {
              min-width: 100px;
              padding: 8px;
            }
            .category-card img {
              max-width: 70px;
              height: 70px;
            }
            .category-name {
              font-size: 10px;
            }
            .scroll-btn {
              display: none;
            }
          }
        `}
      </style>

      <Container fluid className="p-3 text-center position-relative">
        <div className="scroll-container-wrapper">
          {showLeftArrow && (
            <Button className="scroll-btn left" onClick={scrollLeft}>
              &#10094;
            </Button>
          )}

          <div className="scroll-container" ref={scrollRef} onScroll={checkScroll}>
            {categories.map((category) => (
              <div key={category._id} className="category-wrapper" onClick={() => navigate(`/${category.name}`)}>
                <div className="category-card">
                  {category.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${category.image}`}
                      alt={category.name}
                      className="img-fluid rounded"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <h6 className="category-name">{category.name}</h6>
              </div>
            ))}
          </div>

          {showRightArrow && (
            <Button className="scroll-btn right" onClick={scrollRight}>
              &#10095;
            </Button>
          )}
        </div>
        <hr className="black-line" />
      </Container>
    </>
  );
};

export default CategoriesList;
