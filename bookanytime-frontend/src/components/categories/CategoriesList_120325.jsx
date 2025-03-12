import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";

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
    <>
      <style>
        {`
          .categories-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
            padding: 10px;
            width: 100%;
            max-width: 100%;
            justify-content: center;
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
            width: 100%;
            max-width: 120px;
            min-width: 90px;
            background: rgb(236, 229, 229);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .category-card img {
            width: 80%;
            height: auto;
            object-fit: cover;
            border-radius: 6px;
          }

          .no-image {
            width: 100%;
            height: 80px;
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

          @media (max-width: 768px) {
            .categories-container {
              grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	      gap: 8px;
              padding: 10px;
              width: 100%;
              display: flex;
    	      flex-wrap: wrap; /* Allows items to move to the next line */
              justify-content: center; /* Centers categories */
	    }

            .category-card {
              max-width: 50px;
              min-width: 80px;
              padding: 1px;
            }

            .category-card img {
              width: 90%;
              height: auto;
            }

            .category-name {
              font-size: 12px;
            }
          }

          @media (max-width: 480px) {
            .categories-container {
              grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
              gap: 6px;
            }

            .category-card {
              max-width: 90px;
              min-width: 70px;
              padding: 6px;
            }

            .category-card img {
              width: 60%;
              height: auto;
            }

            .category-name {
              font-size: 10px;
            }
          }
        `}
      </style>

      <Container fluid className="p-3 text-center">
        <div className="categories-container">
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
      </Container>
    </>
  );
};

export default CategoriesList;

