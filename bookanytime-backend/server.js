const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/offers", require("./routes/offerRoutes"))
app.use("/api/categories",require("./routes/categories"))
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
