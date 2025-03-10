const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");

// Get user wishlists
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlists = await Wishlist.find({ userId });
    res.json(wishlists);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new wishlist
router.post("/create", async (req, res) => {
  try {
    const { userId, wishlistName } = req.body;

    if (!userId || !wishlistName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingWishlist = await Wishlist.findOne({ userId, name: wishlistName });

    if (existingWishlist) {
      return res.status(400).json({ error: "Wishlist already exists" });
    }

    const newWishlist = new Wishlist({ userId, name: wishlistName, properties: [] });
    await newWishlist.save();

    res.status(201).json({ message: "Wishlist created successfully", wishlist: newWishlist });
  } catch (error) {
    console.error("Error creating wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add property to wishlist
router.post("/add", async (req, res) => {
  try {
    const { userId, propertyId, wishlistName } = req.body;
    let wishlist = await Wishlist.findOne({ userId, name: wishlistName });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, name: wishlistName, properties: [propertyId] });
    } else if (!wishlist.properties.includes(propertyId)) {
      wishlist.properties.push(propertyId);
    }

    await wishlist.save();
    res.json({ message: "Property added to wishlist" });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ DELETE: Remove property from wishlist
router.delete("/:userId/remove", async (req, res) => {
    try {
      const { userId } = req.params;
      const { propertyId, wishlistName } = req.body;
  
      console.log("Received DELETE request:", { userId, propertyId, wishlistName }); // ✅ Debugging Log
  
      if (!userId || !propertyId || !wishlistName) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      let wishlist = await Wishlist.findOne({ userId, name: wishlistName });
  
      if (!wishlist) {
        return res.status(404).json({ error: "Wishlist not found" });
      }
  
      // Remove the property from the wishlist
      wishlist.properties = wishlist.properties.filter(id => id.toString() !== propertyId);
      await wishlist.save();
  
      res.json({ message: "Property removed from wishlist" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

module.exports = router;
