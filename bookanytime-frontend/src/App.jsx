import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";  // Main Header
import Body from "./components/Body";  
import Search from "./components/Header/SearchBar"; 
import AdminPanel from "./components/admin_panel/AdminPanel"; 
import Properties from "./components/admin_panel/properties/Properties";
import AddProperty from "./components/admin_panel/properties/AddProperties";
import UpdatePropertyPage from "./components/admin_panel/properties/UpdatePropertyPage"; 
import Offers from "./components/admin_panel/offers/OffersPage";
import CategoryPage from "./components/categories/CategoryPage";
import PropertyDetails from "./components/categories/PropertyDetails";
import AuthPage from "./components/AuthPage";
import WishlistPage from "./components/WishList/WishlistPage";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin"); // Check if on Admin pages

  return (
    <>
      {!isAdminRoute && <Header />}  {/* Hide main header on admin pages */}

      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/:categoryName" element={<CategoryPage />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<AuthPage isSignup={false} />} />
        <Route path="/signup" element={<AuthPage isSignup={true} />} />
        <Route path="/wishlist" element={<WishlistPage />} />


              {/* Admin Panel - Always visible with nested routes */}
              <Route path="/admin" element={<AdminPanel />}>
          <Route path="properties" element={<Properties />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="update-property/:id" element={<UpdatePropertyPage />} />
          <Route path="offers" element={<Offers />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;