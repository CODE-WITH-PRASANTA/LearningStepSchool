
const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      unique: true,
    },

    minMileage: {
      type: Number,
      default: 0,
      min: 0,
    },

    dieselRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    minDailyKm: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxDailyKm: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Added description field
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SystemSetting", systemSettingSchema);
