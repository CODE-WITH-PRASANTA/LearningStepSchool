const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema(
  {
    minMileage: {
      type: Number,
      required: true,
    },

    dieselRate: {
      type: Number,
      required: true,
    },

    minDailyKm: {
      type: Number,
      required: true,
    },

    maxDailyKm: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SystemSetting",
  systemSettingSchema
);