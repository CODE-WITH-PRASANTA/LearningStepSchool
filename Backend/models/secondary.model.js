const mongoose = require("mongoose");

const secondarySchema = new mongoose.Schema(
  {
    hour: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/  // Ensures HH:MM format
    },
    activity: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Secondary", secondarySchema);