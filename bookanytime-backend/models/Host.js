const mongoose = require("mongoose");

const hostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
});

const Host = mongoose.model("Host", hostSchema);
module.exports = Host;
