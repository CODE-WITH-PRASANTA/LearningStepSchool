const mongoose = require("mongoose");

const assignRouteSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportRoute",
      required: true,
      unique: true,
    },

    destinations: [
      {
        destinationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TransportDestination",
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
  "AssignRoute",
  assignRouteSchema
);
