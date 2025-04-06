import React from "react";
import Categories from "./categories/CategoriesList";
import RecentlyViewed from "./recently_viewed/RecentlyViewed";
import Offers from "./offers_section/newOffers";
import Maps from "./map/map";
import Footer from "../Footer"; // Adjust the path as needed

function Body() {
  return (
    <div className="body-container" style={{ paddingTop: "80px", marginTop: "20px", width: "100%" }}>
      <Categories />
      <RecentlyViewed />
      <Offers />
      <Maps />
      <Footer /> {/* Added Footer component */}
    </div>
  );
}

export default Body;