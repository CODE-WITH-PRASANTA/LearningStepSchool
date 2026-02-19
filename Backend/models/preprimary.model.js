const mongoose = require("mongoose");

const prePrimarySchema = new mongoose.Schema(
  {
    hour: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrePrimary", prePrimarySchema);