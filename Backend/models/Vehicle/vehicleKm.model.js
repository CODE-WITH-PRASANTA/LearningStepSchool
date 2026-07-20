const mongoose = require("mongoose");

const vehicleKmSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    openingKm: {
      type: Number,
      required: true,
    },

    closingKm: {
      type: Number,
      required: true,
    },

    runningKm: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VehicleKm", vehicleKmSchema);