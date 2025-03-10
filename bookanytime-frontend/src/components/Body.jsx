import React from "react";
import Categories from "./categories/CategoriesList";
import RecentlyViewed from "./recently_viewed/RecentlyViewed";
import Offers from "./offers_section/OffersSection"
function Body() {
  return (
    <div className="body-container" style={{paddingTop:"80px", marginTop:"20px", width:"1350px"}}>
      <Categories />  {/* ✅ Categories should be inside here */}
      <RecentlyViewed />
      <Offers />
    </div>
  );
}

export default Body;
