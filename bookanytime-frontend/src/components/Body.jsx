import React from "react";
import Categories from "./categories/CategoriesList";
import RecentlyViewed from "./recently_viewed/RecentlyViewed";

function Body() {
  return (
    <div className="body-container" style={{paddingTop:"80px", marginTop:"20px"}}>
      <Categories />  {/* ✅ Categories should be inside here */}
      <RecentlyViewed />
    </div>
  );
}

export default Body;
