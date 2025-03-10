const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  image: {
    type: [String], // Will store image URL
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
},
{ collection: "offers_collection" }

);

const Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;
