const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "New", // New, Contacted, Closed
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);