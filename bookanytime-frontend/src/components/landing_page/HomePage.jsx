import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/search'); // Navigate to category page with "All" category
  };

  return (
    <div className="d-flex flex-column "  style={{  height: '45vh' }}
>
      <main className="flex-grow-1">
        {/* Hero Section - full viewport height */}
<section className="position-relative  bg-dark text-white" style={{ zIndex: 1,height: '45vh' }}>
          {/* Background image with proper centering */}
          <div className="position-absolute top-0 start-0 w-100 h-100 z-0 overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Luxurious accommodation" 
              className="w-100 h-100 object-fit-cover object-position-center opacity-25"
            />
          </div>
          
          {/* Content container with responsive top margin */}
          <div className="container mx-auto h-100 d-flex align-items-center position-relative z-1">
            <div className={`row justify-content-start align-items-center
                 mt-sm-4 mt-md-3
                 pt-4 pt-md-3`}>
              <div className="col-12 col-md-8 col-lg-6 text-start">
                <h2 className="fs-1 fs-md-1 fs-lg-2 fw-bold mb-3 mb-md-4 text-nowrap" >
                  Find Your Perfect Stay
                </h2>
                <p className="lead mb-4 mb-md-5">
                  <span className="d-block d-md-inline">Discover and book accommodations and venues for any occasion.</span>
                  <span className="d-none d-md-inline"> </span>
                  <span className="d-block d-md-inline">From hotels to farmhouses, we've got you covered.</span>
                </p>
                <button 
                  className="btn btn-primary px-3 px-md-4 py-2 rounded-pill fw-medium"
                  onClick={handleExploreClick}
                >
                  Start Exploring
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;