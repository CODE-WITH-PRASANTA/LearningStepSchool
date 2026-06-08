const mongoose = require("mongoose");

const studentGatePassSchema = new mongoose.Schema(
  {
    gatePassNo: {
      type: String,
      unique: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    visitorName: {
      type: String,
      required: true,
      trim: true,
    },

    relation: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    timeIn: {
      type: String,
      required: true,
    },

    timeOut: {
      type: String,
      default: "",
    },

    reason: {
      type: String,
      required: true,
    },

    remark: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudentGatePass",
  studentGatePassSchema
);