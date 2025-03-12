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
      {/* Scrollable container with dynamic width & smooth effect */}
      <div
        className="overflow-auto mx-auto w-50 w-md-75 w-lg-50"
        style={{
          maxHeight: "200px",
          scrollBehavior: "smooth",
          borderRadius: "8px",
          padding: "5px",
          transition: "width 0.5s ease-in-out", // Smooth width transition
	  width: "100%", // Full width initially
          maxWidth: "400px", // Prevents it from being too wide
          margin: "0 auto", // Centers container
          whiteSpace: "nowrap", // Prevents text from wrapping
	}}
      >
        <Row className="g-3 justify-content-center flex-nowrap">
          {categories.map((category) => (
            <Col key={category._id} xs="auto">
              <div
                className="d-flex flex-column align-items-center category-wrapper"
                onClick={() => navigate(`/${category.name}`)}
                style={{ cursor: "pointer", transition: "transform 0.3s" }}
              >
                <div
                  className="category-card d-flex align-items-center justify-content-center"
                  style={{
                    width: "100px",
                    height: "100px",
                    background: "rgb(236, 229, 229)",
                    borderRadius: "8px",
                    boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {category.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${category.image}`}
                      alt={category.name}
                      className="img-fluid rounded"
                      style={{ maxWidth: "80%", height: "auto" }}
                    />
                  ) : (
                    <div className="text-muted text-center">No Image</div>
                  )}
                </div>
                <h6 className="text-nowrap mt-2">{category.name}</h6>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default CategoriesList;

