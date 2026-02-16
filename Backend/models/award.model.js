const mongoose = require("mongoose");

const awardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String, // store file path
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Award", awardSchema);