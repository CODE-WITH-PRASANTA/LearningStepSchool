const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
    unique: true,
  },

  minMileage: Number,
  dieselRate: Number,
  minDailyKm: Number,
  maxDailyKm: Number,
});

module.exports = mongoose.model("SystemSetting", systemSettingSchema);