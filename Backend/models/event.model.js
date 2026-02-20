const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    review: String,
    rating: { type: Number, default: 0 },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);