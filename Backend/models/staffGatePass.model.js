const mongoose = require("mongoose");

const staffGatePassSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      default: "Teacher",
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    contact: {
      type: String,
      default: "",
      trim: true,
    },

    photo: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    time: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    remark: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("StaffGatePass", staffGatePassSchema);
