const mongoose = require("mongoose");

const adminComplaintSchema = new mongoose.Schema(
  {
    complaintAgainst: {
      type: String,
      required: true,
      trim: true,
    },

    complaintBy: {
      type: String,
      default: "Admin",
    },

    againstType: {
      type: String,
      enum: ["Staff", "Student"],
      default: "Staff",
    },

    complaintType: {
      type: String,
      required: true,
      trim: true,
    },

    complaintMsg: {
      type: String,
      required: true,
      trim: true,
    },

    remark: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AdminComplaint",
  adminComplaintSchema
);