import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaWhatsapp, FaHeart, FaShareSquare, FaInstagram, FaPhone } from "react-icons/fa";
import WishlistModal from "./WishlistModal";
import { Typography } from "@mui/material";
import Footer from "/home/ubuntu/bookanytime/bookanytime-frontend/src/Footer";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllImages, setShowAllImages] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const [ratings, setRatings] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const ratingsRef = useRef(null);
  const containerRef = useRef(null);

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
  };

  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`)
      .then((response) => {
        if (response.data) {
          setProperty(response.data);
          if (response.data.latitude && response.data.longitude) {
            setMapCenter({
              lat: parseFloat(response.data.latitude),
              lng: parseFloat(response.data.longitude),
            });
          }

          const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
          const updatedList = recentlyViewed.filter((prop) => prop.id !== response.data._id);
          updatedList.unshift({
            id: response.data._id,
            name: response.data.name,
            image: response.data.images?.[0],
            city: response.data.city,
            maxPrice: response.data.maxPrice,
            minPrice: response.data.minPrice,
            adults: response.data.capacity.adults,
            bedroom: response.data.bedrooms,
            category: response.data.category
          });

          if (updatedList.length > 10) updatedList.pop();
          localStorage.setItem("recentlyViewed", JSON.stringify(updatedList));
        } else {
          setError("Property not found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching property details:", error);
        setError("No properties available.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!property?._id) return;

    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/ratings/${property._id}`
        );
        setRatings(response.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [property]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    setUserId(user ? user.id : null);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchWishlists = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
        const wishlists = response.data;
        const propertyExists = wishlists.some((wishlist) => wishlist.properties.includes(id));
        setIsWishlisted(propertyExists);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlists();
  }, [userId, id]);

  function openCall() {
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    
    if (!property || !property.phoneNumber) {
      alert("Phone number not available.");
      return;
    }

    let phoneNumber = property.phoneNumber.trim();
    phoneNumber = phoneNumber.replace(/\D/g, "");
    
    if (phoneNumber.length < 10) {
      alert("Invalid Phone number.");
      return;
    }

    if (phoneNumber.length === 10) {
      phoneNumber = "91" + phoneNumber;
    }
    window.location.href = `tel:+${phoneNumber}`;
  }

  const openWhatsAppChat = async () => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    if (!property || !property.whatsappNumber) {
      alert("WhatsApp number not available.");
      return;
    }

    let phoneNumber = property.whatsappNumber.trim();
    phoneNumber = phoneNumber.replace(/\D/g, "");

    if (phoneNumber.length < 10) {
      alert("Invalid WhatsApp number.");
      return;
    }

    if (phoneNumber.length === 10) {
      phoneNumber = "91" + phoneNumber;
    }

    const contactData = {
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      userPhoneNumber: user.phoneNumber,
      propertyId: property._id,
      propertyName: property.name,
      propertyAddress: property.address,
      contactDate: new Date().toISOString(),
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/trackdata/contacts`, contactData);
    } catch (error) {
      console.error("Error saving contact data:", error);
    }

    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, "_blank");
  };

  const openInstagram = async () => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    let instagram = property.instagram.trim();
    const url = `https://www.instagram.com/${instagram}`;
    window.open(url, "_blank");
  };

  const handleWishlistClick = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
      const wishlists = response.data;
      const wishlistWithProperty = wishlists.find((wishlist) => wishlist.properties.includes(id));

      if (wishlistWithProperty) {
        await removeFromWishlist(id, wishlistWithProperty.name);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const removeFromWishlist = async (propertyId, wishlistName) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}/remove`, {
        headers: { "Content-Type": "application/json" },
        data: { propertyId, wishlistName },
      });

      setIsWishlisted(false);
      alert(`"${property.name}" has been removed from "${wishlistName}".`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove the property. Please try again.");
    }
  };

  const handleWishlistUpdate = () => {
    setIsWishlisted(true);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) return <p className="text-center mt-5">Loading property details...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;
  if (!property) return null;

  return (
    <div className="container-fluid mt-4 custom-container" ref={containerRef}>
      {/* Header Section */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 mt-4"
        style={{
          position: 'sticky',
          top: '55px',
          zIndex: '1000',
          backgroundColor: '#fff',
          padding: '5px'
        }}
      >
        <h1
          className="m-0 fw-bold fs-3 fs-md-2"
          style={{
            letterSpacing: '0.5px',
            maxWidth: 'calc(100% - 300px)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <div
            className="search-section mb-1 p-1 bg-white rounded "
            style={{ display: window.innerWidth >= 1024 ? 'block' : 'none' }}
          >
            {property.name}
          </div>
          <div

            style={{ display: window.innerWidth >= 1024 ? 'block' : 'none' }}
          >
            <h6><i className="bi bi-geo-alt me-2"></i>{property.city}, {property.address}</h6>
          </div>
        </h1>

        <div
          className="d-flex align-items-center gap-3"
          style={{
            flexShrink: 0
          }}
        >    
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-link p-0 text-decoration-none d-flex align-items-center justify-content-center rounded-circle"
              onClick={openInstagram}
              style={{
                width: '46px',
                height: '46px',
                backgroundColor: 'rgba(0, 0, 0, 0.05)'
              }}
            >
              <FaInstagram 
                style={{ 
                  fontSize: '1.25rem', 
                  color: '#000' 
                }} 
              />
            </button>

            <button
                className="btn btn-link p-0 text-decoration-none d-flex align-items-center justify-content-center rounded-circle"
                onClick={handleShareClick}
                style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)'
                }}
              >
              <FaShareSquare 
                style={{ 
                  fontSize: '1.25rem', 
                  color: '#000' 
                }} 
              />
            </button>

            <button
              className="btn btn-link p-0 text-decoration-none d-flex align-items-center justify-content-center rounded-circle"
              onClick={handleWishlistClick}
              style={{
                width: '46px',
                height: '46px',
                backgroundColor: 'rgba(0, 0, 0, 0.05)'
              }}
            >
              <FaHeart 
                style={{ 
                  fontSize: '1.25rem', 
                  color: isWishlisted ? '#ff0000' : '#000',
                  transition: 'color 0.2s ease'
                }} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Image Grid Section */}
      <div className="d-flex flex-column" style={{ height: "500px" }}>
        <div 
          className="w-100 mb-2" 
          style={{ 
            height: "80%",
            borderRadius: "10px",
            overflow: "hidden"
          }}
        >
          <img
            src={property.images?.[currentImageIndex] || property.images?.[0]}
            alt="Property"
            className="img-fluid h-100 w-100"
            style={{ 
              objectFit: "cover",
              cursor: "pointer"
            }}
            onClick={() => setShowAllImages(true)}
          />
        </div>
        
        <div 
          className="w-100 d-flex" 
          style={{ 
            height: "20%", 
            gap: "4px",
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none" /* For Firefox */
          }}
        >
          {property.images?.map((img, index) => (
            <div 
              key={index}
              className="flex-shrink-0 position-relative"
              style={{
                width: "calc(25% - 3px)", /* Adjust width accounting for gap */
                height: "100%",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                minWidth: "calc(25% - 3px)" /* Prevent shrinking below 25% */
              }}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={img}
                alt={`Property ${index + 1}`}
                className="img-fluid h-100 w-100"
                style={{ 
                  objectFit: "cover",
                  border: currentImageIndex === index ? "3px solid #0d6efd" : "none"
                }}
              />
              {currentImageIndex === index && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)"
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div> 
     <hr className="my-4 border-black" />

      {/* Main Content Layout */}
      <div className="row">
        {/* Left Content (80% width on desktop) */}
        <div className="col-lg-8">
          <div className="p-3 bg-light rounded me-lg-0">
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <div
                    className="search-section mb-5 p-9"
                    style={{
                      display: window.innerWidth < 576 ? 'block' : 'none',
                      fontWeight: 'bold',
                      padding: window.innerWidth < 576 ? '0.1rem' : 'inherit',
                      fontSize: window.innerWidth < 576 ? '19px' : 'inherit'
                    }}
                  >
                    {property.name}
                  </div>
                  <h3 className="text-xl font-heading font-semibold">
                    {property.name} hosted by Property Owner
                  </h3>
                  <div className="row mt-4">
                    <div className="col-12">
                      <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {property.description}</Typography>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-4 mb-3" style={{ fontWeight: '700', color: '#000000' }}>
                  <span>
                    <i className="bi bi-people me-1"></i>
                    {property.capacity?.adults} {property.capacity?.adults === 1 ? 'adult' : 'guests'}
                  </span>
                </div>
              </div>
            </div>

            <WishlistModal
              show={showModal}
              onClose={() => setShowModal(false)}
              userId={userId}
              propertyId={id}
              onWishlistUpdate={handleWishlistUpdate}
            />
            <hr className="my-4 border-black" />
            
            {/* Fixed Amenities Section */}
            <div className="amenities-section">
              <h5 className="mt-3 fs-5 fs-md-4">Amenities</h5>
              <div className="row mt-3">
                {property.amenities?.map((amenity, index) => {
                  const amenityIcons = {
                    "outdoor barbeque": "bi bi-fir"
                  };

                  const iconClass = amenityIcons[amenity.toLowerCase()] || "bi bi-check-circle";

                  return (
                    <div key={index} className="col-12 col-md-6 d-flex align-items-center mb-3">
                      <i className={`${iconClass} text-success me-2 fs-5`}></i>
                      <span className={`amenity-text ${amenity.includes("Not available") ? "text-decoration-line-through text-muted" : ""}`}>
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className="my-4 border-black" />
            <div className="row mt-5">
              <div className="col-12">
                <div className="p-4 rounded" style={{
                  backgroundColor: '#f8f9fa',
                  borderLeft: '4px solid #0d6efd'
                }}>
                  <h4 className="mb-4" style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: '600',
                    color: '#212529',
                    fontSize: '1.5rem'
                  }}>
                    <i className="bi bi-journal-text me-2"></i>
                    House Rules
                  </h4>

                  <div className="col-12">
                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                      {property.house_rules}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ratings Section */}
          <div className="ratings-section mt-5" ref={ratingsRef}>
            {ratings.length > 0 && (
              <div className="text-end">
                <div 
                  className="d-flex align-items-center justify-content-start p-2" 
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '8px',
                    display: 'inline-flex'
                  }}
                >
                  <span className="me-1">
                    <i 
                      className="bi bi-star-fill" 
                      style={{
                        color: '#000',
                        fontSize: '1.5rem'
                      }}
                    ></i>
                  </span>
                  
                  <span 
                    className="fw-bold me-1" 
                    style={{ 
                      fontSize: '1.4rem',
                      color: '#000'
                    }}
                  >
                    {(
                      ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
                    ).toFixed(2)}
                  </span>
                  
                  <span 
                    className="text-muted" 
                    style={{
                      fontSize: '1.1rem'
                    }}
                  >
                    · {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              </div>
            )}

            {ratings.length > 0 ? (
              <div className="row">
                {ratings.map((rating, index) => {
                  const firstLetter = rating.username ? rating.username.charAt(0).toUpperCase() : 'U';
                  const formattedDate = rating.month && rating.year ? `${rating.month} ${rating.year}` : '';

                  return (
                    <div key={index} className="col-12 col-md-6 mb-4">
                      <div className="review-card h-100 p-3">
                        <div className="d-flex">
                          <div className="d-flex align-items-center me-3">
                            <div 
                              className="profile-circle d-flex align-items-center justify-content-center"
                              style={{
                                backgroundColor: '#000',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%'
                              }}
                            >
                              <span className="text-white fw-bold fs-5">{firstLetter}</span>
                            </div>
                          </div>

                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <div>
                                <h6 className="fw-bold mb-0">{rating.username}</h6>
                                <small className="text-muted">
                                  {rating.durationOnPlatform || 'New member'}
                                </small>
                              </div>
                              <div className="text-warning">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <i
                                    key={i}
                                    className={`bi bi-star-fill`}
                                    style={{
                                      color: i < Math.floor(rating.rating) ? '#FFD700' : '#D3D3D3'
                                    }}
                                  ></i>
                                ))}
                              </div>
                            </div>

                            {formattedDate && (
                              <div className="text-muted small mb-2">
                                {formattedDate}
                              </div>
                            )}

                            <p className="mb-2">
                              {rating.description.length > 150 
                                ? `${rating.description.substring(0, 150)}...` 
                                : rating.description}
                              {rating.description.length > 150 && (
                                <button 
                                  className="btn btn-link p-0 text-decoration-none"
                                  onClick={() => {}}
                                >
                                  Show more
                                </button>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted">No reviews yet. Be the first to review!</p>
            )}
          </div>

          {/* Map Section */}
          <div className="mt-5">
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={mapCenter}
                zoom={15}
              >
                <Marker
                  position={mapCenter}
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`,
                      "_blank"
                    );
                  }}
                />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>

        {/* Right Sidebar (20% width on desktop) */}
        {!isMobile && (
          <div className="col-lg-4">
            <div
              className="reservation-box sticky-top"
              style={{
                top: '150px',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(54, 45, 45, 0.15)',
                padding: '16px',
                marginLeft: '10px'
              }}
            >
              <div className="reservation-header d-flex justify-content-between align-items-center mb-3">

              </div>
                <span className="price fw-bold" style={{ fontSize: '22px' }}>
                  {property.minPrice && property.maxPrice
                    ? `₹${property.minPrice} - ₹${property.maxPrice}`
                    : 'Price Range Not Available'}
                </span>
                <span
                  className="duration text-muted"
                  style={{
                    fontSize: '14px',
                    marginLeft: '8px'
                  }}
                >
                  / night
                </span>
              <div className="price-section mb-3">
                <h5 className="m-0 fw-bold" style={{ fontSize: '18px' }}>
                  
                </h5>
              </div>

              <div className="price-section mb-3">
                <h5 className="m-0 fw-bold" style={{ fontSize: '18px' }}>
                  Contact Host
                </h5>
              </div>

              <button
                className="whatsapp-reserve-btn w-100 py-2 border-0 rounded fw-bold text-white d-flex align-items-center justify-content-center pb-2"
                style={{
                  backgroundColor: '#6a11cb',
                  fontSize: '16px'
                }}
                onClick={openWhatsAppChat}
              >
                <FaWhatsapp className="me-2" style={{ fontSize: '1.2rem' }} />
                WhatsApp Booking
              </button>
              <button
                className="whatsapp-reserve-btn w-100 py-2 rounded fw-bold d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: 'white',
                  fontSize: '16px',
                  marginTop: "2px",
                  color: "black",
                  borderRadius: "5px",
                  border: "1px solid black"
                }}
                onClick={openCall}
              >
                <FaPhone className="me-2" style={{ fontSize: '1.2rem' }} />
                Call Host
              </button>

              <div
                className="text-center small mt-2 text-muted"
                style={{ fontSize: '12px' }}
              >
                Contact host directly for booking
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Reservation Box (shown between reviews and map) */}
      {isMobile && (
        <div
          className="reservation-box mt-4 mb-4"
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(54, 45, 45, 0.15)',
            padding: '16px'
          }}
        >
          <div className="reservation-header d-flex justify-content-between align-items-center mb-3">
            <span className="price fw-bold" style={{ fontSize: '22px' }}>
              {property.minPrice && property.maxPrice
                ? `₹${property.minPrice} - ₹${property.maxPrice}`
                : 'Price Range Not Available'}
            </span>
            <span
              className="duration text-muted"
              style={{
                fontSize: '14px',
                marginLeft: '8px'
              }}
            >
              / night
            </span>
          </div>

          <div className="price-section mb-3">
            <h5 className="m-0 fw-bold" style={{ fontSize: '18px' }}>
              Contact Host
            </h5>
          </div>

          <button
            className="whatsapp-reserve-btn w-100 py-2 border-0 rounded fw-bold text-white d-flex align-items-center justify-content-center pb-2"
            style={{
              backgroundColor: '#6a11cb',
              fontSize: '16px'
            }}
            onClick={openWhatsAppChat}
          >
            <FaWhatsapp className="me-2" style={{ fontSize: '1.2rem' }} />
            WhatsApp Host
          </button>
          <button
            className="whatsapp-reserve-btn w-100 py-2 rounded fw-bold d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: 'white',
              fontSize: '16px',
              marginTop: "2px",
              color: "black",
              borderRadius: "5px",
              border: "1px solid black"
            }}
            onClick={openCall}
          >
            <FaPhone className="me-2" style={{ fontSize: '1.2rem' }} />
            Call Host
          </button>

          <div
            className="text-center small mt-2 text-muted"
            style={{ fontSize: '12px' }}
          >
            Contact host directly for booking
          </div>
        </div>
      )}

      <Footer />

      {/* Image Modal */}
      {showAllImages && (
        <div className="modal-overlay" onClick={() => setShowAllImages(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowAllImages(false)}>×</button>
            <h3 className="text-center">All Property Images</h3>
            <div className="image-scroll-container">
              {property.images.map((img, index) => (
                <img key={index} src={img} alt={`Property ${index}`} className="scroll-image" />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>
        {` 
          .custom-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 10px;
            margin-top: 40px;
          }

          @media (min-width: 992px) {
            .custom-container {
              padding: 0 30px;
              margin-top: -10px;
            }
            .ratings-section .card {
              margin-left: 0;
              margin-right: auto;
            }
          }

          h1 {
            font-weight: 600;
            color: #333;
          }
          
          .btn-link {
            transition: all 0.2s ease;
          }
          
          .btn-link:hover {
            transform: scale(1.05);
          }
          
          .small {
            font-size: 0.75rem;
            font-weight: 500;
          }
                
          .text-start {
            text-align: left;
            padding-right: 20px;
          }
          .main-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
          }

          .side-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
          }

          .small-image {
            width: 49%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
          }

          .more-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            font-size: 24px;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 90%;
            max-width: 800px;
            text-align: center;
            position: relative;
          }

          .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            border: none;
            background: none;
            cursor: pointer;
          }

          .image-scroll-container {
            display: flex;
            overflow-x: auto;
            gap: 10px;
            padding: 10px;
            white-space: nowrap;
            max-width: 100%;
          }

          .image-scroll-container::-webkit-scrollbar {
            height: 8px;
          }

          .image-scroll-container::-webkit-scrollbar-thumb {
            background: #aaa;
            border-radius: 5px;
          }

          .scroll-image {
            height: 150px;
            width: auto;
            border-radius: 5px;
          }

          .amenity-text {
            font-size: 16px;
            font-weight: 500;
          }

          .amenities-section {
            margin-bottom: 2rem;
          }

          .amenities-section h5 {
            margin-bottom: 1.5rem;
            font-weight: 600;
          }

          .instagram-icon-container {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: radial-gradient(
              circle at 30% 107%, 
              #fdf497 0%, 
              #fdf497 5%, 
              #fd5949 45%, 
              #d6249f 60%, 
              #285AEB 90%
            );
            cursor: pointer;
            transition: transform 0.2s;
          }

          .instagram-icon-container:hover {
            transform: scale(1.1);
          }

          .instagram-icon {
            color: white;
            font-size: 1.5rem;
          }

          .ratings-section {
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
          }

          .card {
            border: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .card:hover {
            transform: translateY(-5px);
          }

          .profile-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.2rem;
          }

          .bi-star-fill, .bi-star-half {
            color: #ffc107;
          }

          .bi-star {
            color: #e4e5e9;
          }

          .house-rules-card {
            background-color: #f8f9fa;
            border-left: 4px solid #0d6efd;
            border-radius: 8px;
            padding: 1.5rem;
          }

          .house-rules-title {
            font-family: 'Playfair Display', serif;
            font-weight: 600;
            color: #212529;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .house-rules-list {
            font-family: 'Roboto', sans-serif;
            font-size: 1.05rem;
          }

          .house-rules-list li {
            margin-bottom: 1rem;
            display: flex;
            align-items: flex-start;
          }

          .house-rules-icon {
            color: #0d6efd;
            margin-right: 1rem;
            margin-top: 0.2rem;
          }

          .hover-underline:hover {
            text-decoration: underline !important;
          }
          
          .whatsapp-reserve-btn:hover {
            background-color: #128C7E !important;
          }

          @media (max-width: 768px) {
            .reservation-box {
              width: 100% !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PropertyDetails;