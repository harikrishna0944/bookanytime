import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Container, Button } from "react-bootstrap";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <Container fluid >
      <div className="scroll-container-wrapper">
        <Button variant="primary" className="scroll-btn left" onClick={scrollLeft}>
          <span className="arrow">&#10094;</span>
        </Button>
        <div className="scroll-container" ref={scrollRef}>
          {categories.map((category) => (
            <div key={category._id} className="category-wrapper">
              <div className="category-card">
                {category.image ? (
                  <img
                    src={`http://localhost:5000${category.image}`}
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
        <Button variant="primary" className="scroll-btn right" onClick={scrollRight}>
          <span className="arrow">&#10095;</span>
        </Button>
      </div>
      <hr className="black-line" />
      <style>
        {`
          .scroll-container-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            max-width: 100%;
            margin: auto;

          }
          .scroll-container {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            white-space: nowrap;
            scroll-behavior: smooth;
            scrollbar-width: thin;
            scrollbar-color: rgb(255, 255, 255) transparent;
            max-width: 90%;
            padding-bottom: 8px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.8);
            padding: 5px;
          }
          .category-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .category-card {
            width: 130px;
            min-width: 130px;
            flex-shrink: 0;
            background: rgb(236, 229, 229);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .category-card img {
            width: 80%;
            max-width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 6px;
          }
          .category-name {
            margin-top: 8px;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
          }
          .scroll-btn {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }
          @media (max-width: 768px) {
            .category-card {
              min-width: 80px;
              padding: 6px;
            }
            .category-card img {
              max-width: 100px;
              height: 70px;
            }
            .category-name {
              font-size: 11px;
            }
            .scroll-btn {
              width: 30px;
              height: 30px;
              font-size: 12px;
            }
          }
          @media (max-width: 480px) {
            .category-card {
              min-width: 90px;
              padding: 5px;
            }
            .category-card img {
              max-width: 60px;
              height: 60px;
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
    </Container>
  );
};

export default CategoriesList;