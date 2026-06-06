const mongoose = require("mongoose");

const staffComplaintSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },

    staffName: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    complaintType: {
      type: String,
      required: true,
      trim: true,
    },

    complaintText: {
      type: String,
      required: true,
      trim: true,
    },

    feedback: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Resolved",
        "Rejected",
      ],
      default: "Pending",
    },

    remark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StaffComplaint",
  staffComplaintSchema
);