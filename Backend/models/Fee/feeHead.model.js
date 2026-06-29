const mongoose = require("mongoose");

const feeHeadSchema = new mongoose.Schema(
  {
    feeGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeGroup",
      required: true,
    },

    installmentType: {
      type: String,
      required: true,
    },

    feeHeadName: {
      type: String,
      required: true,
      trim: true,
    },

    feeHeadShortName: {
      type: String,
      required: true,
      trim: true,
    },

    feeType: {
      type: String,
      enum: ["Day Scholar", "Hosteller"],
      default: "Day Scholar",
    },

    applyFor: {
      type: String,
      enum: ["Both", "New", "Old"],
      default: "Both",
    },

    gender: {
      type: String,
      enum: ["Both", "Male", "Female"],
      default: "Both",
    },

    refundable: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },

    certificate: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },

    priority: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FeeHead", feeHeadSchema);