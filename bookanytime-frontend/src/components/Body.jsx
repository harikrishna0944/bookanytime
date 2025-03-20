import React from "react";
import Categories from "./categories/CategoriesList";
import RecentlyViewed from "./recently_viewed/RecentlyViewed";
import Offers from "./offers_section/OffersSection";
import Maps from "./map/map"; // Ensure this is a default export or adjust accordingly

function Body() {
  return (
    <div className="body-container" style={{ paddingTop: "80px", marginTop: "20px", width: "1350px" }}>
      <Categories />
      <RecentlyViewed />
      <Offers />
      <Maps /> {/* Added the Maps section */}
    </div>
  );
}

export default Body;
