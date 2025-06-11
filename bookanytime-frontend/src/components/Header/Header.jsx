import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import {
  AccountCircle,
  ExitToApp,
  Feedback,
  HelpOutline,
  AdminPanelSettings,
} from "@mui/icons-material";

import { getUserRole } from "../utils/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userRole = getUserRole();
  const navigate = useNavigate();

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const isLoggedIn = !!localStorage.getItem("token");

const handleLocationSearch = (value) => {
    setSearchTerm(value);
    navigate(`/search?location=${encodeURIComponent(value)}`);
  };


  // // Handle search submit
  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   if (searchTerm.trim()) {
  //     navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
  //   }
  // };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        width: "100vw",
        zIndex: 1000,
        boxShadow: "none",
        fontSize: "12px",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif !important',
      }}
    >
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h3 className="text m-0" style={{ color: "#6a11cb" }}>
              BookAnytime
            </h3>
          </Link>
        </Box>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
            flexWrap: "nowrap",
          }}
        >
          {/* Search box form */}
          <Box
            component="form"
            // onSubmit={handleSearchSubmit}
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              width: "300px",
            }}
          >
            <input
              type="text"
              placeholder="Search by location..."
              value={searchTerm}
                   onChange={(e) => handleLocationSearch(e.target.value)}


              style={{
                padding: "6px 36px 6px 12px",
                border: "1px solid #ccc",
                borderRadius: "20px",
                fontSize: "14px",
                outline: "none",
                width: "100%",
              }}
            />
            <SearchIcon
              // onClick={handleSearchSubmit}
              sx={{
                position: "absolute",
                right: 10,
                color: "#888",
                cursor: "pointer",
              }}
            />
          </Box>

          {/* Remove old Search button */}
          {/* <Button color="inherit" component={Link} to="/search" sx={{ color: "black !important" }}>
            Search
          </Button> */}

          <Button
            color="inherit"
            component={Link}
            to="/wishlist"
            startIcon={<FavoriteIcon />}
            sx={{ color: "black", borderRadius: "5px" }}
          >
            Wishlist
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/list-your-property"
            sx={{ color: "white !important", backgroundColor: "#6a11cb", borderRadius: "25px" }}
          >
            List Your Property
          </Button>

          {/* Profile Avatar with Dropdown */}
          <IconButton onClick={handleProfileClick}>
            <Avatar alt="Profile" src="/profile.jpg" sx={{ width: 40, height: 40 }} />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem component={Link} to="/signup" onClick={handleClose}>
              <AccountCircle style={{ marginRight: 8 }} />
              Signup
            </MenuItem>

            {!isLoggedIn && (
              <MenuItem component={Link} to="/login" onClick={handleClose}>
                <ExitToApp style={{ marginRight: 8 }} />
                Login
              </MenuItem>
            )}

            <MenuItem
              component={Link}
              to="/admin"
              onClick={handleClose}
              style={{ display: getUserRole() === "admin" ? "block" : "none" }}
            >
              <AdminPanelSettings style={{ marginRight: 8 }} />
              Admin Panel
            </MenuItem>

            <MenuItem
              component={Link}
              to="/feedback"
              onClick={handleClose}
              style={{ display: localStorage.getItem("token") ? "block" : "none" }}
            >
              <Feedback style={{ marginRight: 8 }} />
              Feedback
            </MenuItem>

            <MenuItem
              component={Link}
              to="/help-center"
              onClick={handleClose}
              style={{ display: localStorage.getItem("token") ? "block" : "none" }}
            >
              <HelpOutline style={{ marginRight: 8 }} />
              Help Center
            </MenuItem>

            {isLoggedIn && (
              <MenuItem onClick={handleLogout}>
                <ExitToApp style={{ marginRight: 8 }} />
                Logout
              </MenuItem>
            )}
          </Menu>
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleProfileClick}>
            <Avatar alt="Profile" src="/profile.jpg" sx={{ width: 30, height: 30 }} />
          </IconButton>
          <IconButton sx={{ color: "black" }} onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
          <List sx={{ width: 250 }}>
            <ListItem button component={Link} to="/search" onClick={toggleDrawer}>
              Search
            </ListItem>
            <ListItem button component={Link} to="/list-your-property" onClick={toggleDrawer}>
              List Your Property
            </ListItem>
            <ListItem button component={Link} to="/wishlist" onClick={toggleDrawer}>
              <FavoriteIcon sx={{ mr: 1 }} /> Wishlist
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
