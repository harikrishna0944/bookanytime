import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";  // Main Header
import Body from "./components/Body";  
import Search from "./components/Header/SearchBar"; 
import AdminPanel from "./components/admin_panel/AdminPanel"; 
import Properties from "./components/admin_panel/properties/Properties";
import AddProperty from "./components/admin_panel/properties/AddProperties";
import UpdatePropertyPage from "./components/admin_panel/properties/UpdatePropertyPage"; 
import Offers from "./components/admin_panel/offers/OffersPage";
import TrackedData from "./components/admin_panel/tracked_data/TrackedData"
import CategoryPage from "./components/categories/CategoryPage";
import PropertyDetails from "./components/categories/PropertyDetails";
import AuthPage from "./components/AuthPage";
import WishlistPage from "./components/WishList/WishlistPage";
import WishlistDetailsPage from "./components/WishList/WishListDetailsPage";


// Protect admin routes
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if token exists
  return isAuthenticated ? children : <Navigate to="/login" />;
};

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
        <Route path="/wishlist/:wishlistId" element={<WishlistDetailsPage />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>}>
          <Route path="properties" element={<AdminRoute><Properties /></AdminRoute>} />
          <Route path="add-property" element={<AdminRoute><AddProperty /></AdminRoute>} />
          <Route path="update-property/:id" element={<AdminRoute><UpdatePropertyPage /></AdminRoute>} />
          <Route path="offers" element={<AdminRoute><Offers /></AdminRoute>} />
          <Route path="trackData" element={<AdminRoute><TrackedData /></AdminRoute>} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
