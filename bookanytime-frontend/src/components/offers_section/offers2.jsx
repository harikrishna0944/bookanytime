import React, { useState, useEffect } from "react";
import banner from "../../../public/banner.jpg"
const banners = [
  {
    id: 1,
    title: "Big Savings on Electronics",
    subtitle: "Up to 50% off on selected gadgets",
    imageUrl:"/banner.jpg",
    cta: "Shop Now",
    ctaLink: "/electronics",
  },
  {
    id: 2,
    title: "Fashion Fest Sale",
    subtitle: "Up to 60% off on fashion brands",
        imageUrl:"/banner1.png",
    cta: "Explore",
    ctaLink: "/fashion",
  },
  {
    id: 3,
    title: "Daily Deals on Home & Kitchen",
    subtitle: "Great discounts on essentials",
        imageUrl:"/banner2.jpg",
    cta: "Check Offers",
    ctaLink: "/home-kitchen",
  },
];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchOffers();
  }, []);
    const fetchOffers = async () => {
      setLoading(true);
      setError("");
  
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/offers`);
        setOffers(response.data);
        console.log("data", response.data)
      } catch (error) {
        console.error("Error fetching offers:", error);
      }finally {
          setLoading(false);
        }
    };
  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
  };

  return (
  <div style={{ position: "relative", width: "100vw", height: 400, marginTop:"5px" }}>
      {/* Slide */}
          <div
      style={{
        position: "relative",
        width: "100vw",
        height: 400,
        backgroundImage: `url(${banners[currentIndex].imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "white",
        padding: 40,
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      }}
    >

        <h1 style={{ fontSize: "2.5rem", marginBottom: 10, fontWeight: "bold" }}>
          {/* {banners[currentIndex].title} */}
        </h1>
        {/* <p style={{ fontSize: "1.25rem", marginBottom: 20 }}>{banners[currentIndex].subtitle}</p> */}
        <a
          href={banners[currentIndex].ctaLink}
          style={{
            display: "inline-block",
            backgroundColor: "#febd69",
            color: "black",
            padding: "12px 25px",
            borderRadius: 5,
            fontWeight: "bold",
            textDecoration: "none",
            maxWidth: 150,
            textAlign: "center",
          }}
        >
          {banners[currentIndex].cta}
        </a>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        style={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.5)",
          border: "none",
          // borderRadius: "50%",
          color: "white",
          fontSize: 24,
          cursor: "pointer",
          padding: 10,
        }}
        aria-label="Previous Slide"
      >
        ‹
      </button>
      <button
        onClick={goToNext}
        style={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.5)",
          border: "none",
          // borderRadius: "50%",
          color: "white",
          fontSize: 24,
          cursor: "pointer",
          padding: 10,
        }}
        aria-label="Next Slide"
      >
        ›
      </button>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: 15,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: currentIndex === index ? "#febd69" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              border: "1px solid white",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
