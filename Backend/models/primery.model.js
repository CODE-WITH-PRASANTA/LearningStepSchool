const mongoose = require("mongoose");

const primerySchema = new mongoose.Schema(
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

module.exports = mongoose.model("Primery", primerySchema);