const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST /api/feedback
router.post("/", async (req, res) => {
  try {
    const { username, email, phone, description } = req.body;

    const newFeedback = new Feedback({
      username,
      email,
      phone,
      description,
    });

    await newFeedback.save();
    res.status(201).send("Feedback saved!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving feedback");
  }
});

module.exports = router;
