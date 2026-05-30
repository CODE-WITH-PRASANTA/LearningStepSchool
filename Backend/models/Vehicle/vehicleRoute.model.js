const mongoose = require("mongoose");

const vehicleRouteSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      unique: true,
    },

    routes: [
      {
        routeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TransportRoute",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "VehicleRoute",
  vehicleRouteSchema
);
