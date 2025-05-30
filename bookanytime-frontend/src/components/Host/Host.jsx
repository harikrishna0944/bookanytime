import React from 'react';
import { useNavigate } from 'react-router-dom';
import './host.css'; // We'll create this CSS file next

const OwnerBanner = () => {
  const navigate = useNavigate();

  const handleHostClick = () => {
    navigate('/host');
  };

  return (
    <div className="owner-banner-container">
      <div className="owner-banner-content">
        <div className="owner-banner-text">
          <h3>Are you a property owner?</h3>
          <p>List your property on our platform and reach more travelers</p>
        </div>
        <button 
          className="owner-banner-button" 
          onClick={handleHostClick}
        >
          Become a Host
        </button>
      </div>
    </div>
  );
};

export default OwnerBanner;