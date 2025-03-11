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
app.use("/api/offers", require("./routes/offerRoutes"));
app.use("/api/categories",require("./routes/categories"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"))
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/api.bookanytime.in/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/api.bookanytime.in/fullchain.pem"),
};
https.createServer(options, app).listen(5000, () => {
  console.log("HTTPS Server running on port 443");
});
