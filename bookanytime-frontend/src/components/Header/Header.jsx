import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Avatar, Box, IconButton, Drawer, List, ListItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
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



          <Avatar alt="Profile" src="/profile.jpg" sx={{ width: 40, height: 40 }} />
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

            <ListItem button onClick={toggleDrawer}>
              <Avatar alt="Profile" src="/profile.jpg" sx={{ width: 40, height: 40 }} />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
