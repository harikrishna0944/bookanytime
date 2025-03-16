import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <Container fluid className="p-3 text-center">
      <style>
        {`
          /* Default style */
          .categories-container {
            overflow-x: auto;
            scroll-behavior: smooth;
            padding: 10px;
            border-radius: 8px;
            transition: width 0.5s ease-in-out;
            //margin-left: 20px;
            //margin-right: 30px;
            white-space: nowrap;
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
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgb(236, 229, 229);
            border-radius: 8px;
            box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
            width: 120px;
            height: 120px;
            padding: 10px;
          }

          .category-card img {
            max-width: 80%;
            height: auto;
            border-radius: 6px;
          }

          .category-name {
            margin-top: 8px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            white-space: nowrap;
          }

          /* Media Queries */
          @media (max-width: 1024px) {
            .categories-container {
              width: 70%;
              max-width: 600px;
            }
          }

          @media (max-width: 768px) {
            .categories-container {
              width:80%;
              max-width: 500px;
            }
            .category-card {
              width: 100px;
              height: 100px;
              padding: 2px;
            }
            .category-name {
              font-size: 12px;
            }
          }

          @media (max-width: 480px) {
            .categories-container {
              width: 90%;
              max-width: 350px;
            }
            .category-card {
              width: 80px;
              height: 80px;
              padding: 4px;
            }
            .category-name {
              font-size: 10px;
            }
          }
        `}
      </style>

      {/* Scrollable container with dynamic width & smooth effect */}
      <div className="categories-container mx-auto">
        <Row className="g-3 flex-nowrap">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Col key={category._id} xs="auto">
                <div
                  className="category-wrapper"
                  onClick={() => navigate(`/${category.name}`)}
                >
                  <div className="category-card">
                    {category.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${category.image}`}
                        alt={category.name}
                      />
                    ) : (
                      <div className="text-muted text-center">No Image</div>
                    )}
                  </div>
                  <h6 className="category-name">{category.name}</h6>
                </div>
              </Col>
            ))
          ) : (
            <p className="text-muted">No categories available</p>
          )}
        </Row>
      </div>
    </Container>
  );
};

export default CategoriesList;

