const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fine", fineSchema);