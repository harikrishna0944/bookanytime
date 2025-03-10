const express = require("express");
const multer = require("multer");
const router = express.Router();
const Property = require("../models/properties");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in an 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Middleware to parse form fields properly
const parseFormData = (req, res, next) => {

  console.log("Raw req.body:", req.body); 
  req.body.price = Number(req.body.price) || 0;
  req.body.latitude = Number(req.body.latitude) || 0;
  req.body.longitude = Number(req.body.longitude) || 0;
  req.body.capacity = {
    adults: Number(req.body.adults) || 0,
    bedrooms: Number(req.body.bedrooms) || 0,
  };

  if (req.body.amenities) {
    req.body.amenities = req.body.amenities.split(",");
  }

  next();
};

// @route   POST /api/properties
// @desc    Add a new property with image upload
router.post("/", upload.array("images", 5), parseFormData, async (req, res) => {
  try {
    const { name, category, description, price, city, address, latitude, longitude, amenities, capacity, whatsappNumber } = req.body;

    // Generate image URLs from uploaded files
    const imageUrls = req.files.map((file) => `http://43.204.53.190:5000/uploads/${file.filename}`);

    const newProperty = new Property({
      name,
      category,
      description,
      price,
      city,
      address,
      latitude,
      longitude,
      amenities,
      capacity,
      images: imageUrls,
      whatsappNumber
    });

    const savedProperty = await newProperty.save();
    res.status(201).json({ message: "Property added successfully!", property: savedProperty });
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ message: "Failed to add property", error });
  }
});


// @desc   update the property
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log(propertyId)
    const { name, category, description, price, city, address, latitude, longitude, amenities, adults, bedrooms, whatsappNumber } = req.body;
    
    // Convert numeric fields
    const updatedData = {
      name,
      category,
      description,
      price: Number(price),
      city,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      amenities: amenities ? amenities.split(",") : [],
      adults: Number(adults),
      bedrooms: Number(bedrooms),
      whatsappNumber,
    };

    // Handle image uploads (if new images are provided)
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `uploads/${file.originalname}`); // Replace with actual cloud storage logic
      updatedData.images = imageUrls;
    }

    // Update property in MongoDB
    const updatedProperty = await Property.findByIdAndUpdate(propertyId, updatedData, { new: true });

    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({ message: "Property updated successfully!", property: updatedProperty });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Server error. Failed to update property." });
  }
});





// @desc    to get the property details on dropdwon to delete the property
// @desc    and to get all the propeties on click of any category in home page 
router.get("/", async (req, res) => {
  try {
    const { name, category } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive search by name
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" }; // Case-insensitive search by category
    }

    const properties = await Property.find(filter, "_id name address images price");

    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// @desc    to delete the property
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Search Properties by Name or Category
router.get("/search", async (req, res) => {
  try {
    const { query, categories } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const filter = {
      name: { $regex: query, $options: "i" }, // Case-insensitive search
    };

    if (categories && categories.length > 0) {
      filter.category = { $in: categories };
    }

    const properties = await Property.find(filter);
    res.json(properties);
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// api for search by location
router.get("/search-locations", async (req, res) => {
  try {
    const { query, propertyName, category } = req.query;

    let filters = {};

    // Case-insensitive search using regex
    if (propertyName) {
      filters.name = { $regex: propertyName, $options: "i" };
    }
    
    if (query) {
      filters.address = { $regex: query, $options: "i" }; // Match location
    }

   
    if (category && category !== "") {
      const selectedCategories = category.split(",");
      filters.category = { $in: selectedCategories }; // Supports multiple categories
    }
    const properties = await Property.find(filters);
    res.json(properties);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Server error" });
  }
});



// to fetch single property to display in update page
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Server error" });
  }
});






module.exports = router;
