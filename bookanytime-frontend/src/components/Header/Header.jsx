import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Avatar, Box, IconButton, Drawer, List, ListItem, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUserRole } from "../utils/auth"
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userRole = getUserRole(); // Get user role
  const navigate = useNavigate();

console.log("user roleeeee",userRole)
  // Toggle mobile menu
  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle Profile Dropdown
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("user"); // Clear user data
    navigate("/"); // Redirect to login page
    window.location.reload(); // Force reload to clear state
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(90deg, #6a11cb, #2575fc)",
        width: "100vw",
        zIndex: 1000,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <h3 className="text-white m-0">BookAnytime</h3>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
            flexWrap: "nowrap",
          }}
        >
          <Button color="inherit" component={Link} to="/search" sx={{ color: "white !important" }}>
            Search
          </Button>
          <Button color="inherit" component={Link} to="/list-property" sx={{ color: "white !important" }}>
            List Your Property
          </Button>
          <Button color="inherit" component={Link} to="/wishlist" startIcon={<FavoriteIcon />} sx={{ color: "white !important" }}>
            Wishlist
          </Button>

          {/* Profile Avatar with Dropdown */}
          <IconButton onClick={handleProfileClick}>
            <Avatar alt="Profile" src="/profile.jpg" sx={{ width: 40, height: 40 }} />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem component={Link} to="/login" onClick={handleClose}>
              Login / Signup
            </MenuItem>

<MenuItem
  component={Link}
  to="/admin"
  onClick={handleClose}
  style={{ display: getUserRole() === "admin" ? "block" : "none" }} // ✅ Hide if not admin
>
  Admin Panel
</MenuItem>
<MenuItem
  // component={Link}
  // to="/admin"
  onClick={handleLogout}
>
Logout
</MenuItem>

          </Menu>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          sx={{ display: { xs: "block", md: "none" }, color: "white" }}
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
          <List sx={{ width: 250 }}>
            <ListItem button component={Link} to="/search" onClick={toggleDrawer}>
              Search
            </ListItem>
            <ListItem button component={Link} to="/list-property" onClick={toggleDrawer}>
              List Your Property
            </ListItem>
            <ListItem button component={Link} to="/wishlist" onClick={toggleDrawer}>
              <FavoriteIcon sx={{ mr: 1 }} /> Wishlist
            </ListItem>

            {/* Profile Avatar in Mobile Menu */}
            <ListItem button onClick={handleProfileClick}>
              <Avatar alt="Profile" src="/profile.jpg" sx={{ width: 40, height: 40 }} />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
