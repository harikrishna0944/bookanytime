import { useState, useEffect,useCallback } from 'react';
import { useNavigate } from "react-router-dom";

import axios from 'axios';
import "./CategoryList.css";

const CategoriesGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const navigate = useNavigate();


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

   const handleNavigation = useCallback((categoryName) => {
  navigate(`/search?category=${encodeURIComponent(categoryName)}`);
}, [navigate]);


  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="categories-section">
      <h2 className="categories-title">Browse by Category</h2>
      <p className="categories-subtitle">Explore different types of listings for your perfect experience</p>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card" onClick={() => handleNavigation(category.name)}>
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${category.image}`}
              alt={category.name}
              className="category-image"
            />
            <div className="category-info">
              <h3 className="category-name">{category.name}</h3>
              {/* Optional: Add property count if available */}
              {/* <p className="category-count">{category.count} properties</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
