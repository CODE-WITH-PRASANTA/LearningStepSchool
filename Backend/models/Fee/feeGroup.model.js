const mongoose = require("mongoose");

const feeGroupSchema = new mongoose.Schema(
  {
    headGroup: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    priority: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FeeGroup", feeGroupSchema);