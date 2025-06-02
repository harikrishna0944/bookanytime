import React from "react";
import Categories from "./categories/CategoriesList";
import RecentlyViewed from "./recently_viewed/RecentlyViewed";
import Offers from "./offers_section/offers2";
import Maps from "./map/map";
import Footer from "../Footer";
import HomePage from "./landing_page/HomePage";
import Host from "./Host/Host"
import WhyBookWithUs from "./why_book_withUs/WhyBook";
function Body() {
  return (
    <div
      className="body-container"
      style={{
        paddingTop: "0px",
        marginTop: "0px", // Make sure this is 0 to avoid overlap
        width: "100vw",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {/* Full-page landing section */}
      <HomePage />

      {/* Other sections below it */}
      <Offers />

      <Categories />

      <RecentlyViewed />+
      <Host />
      <WhyBookWithUs />

      {/* <Advertisement /> */}
      <Maps />
      <Footer />
    </div>
  );
}

export default Body;
