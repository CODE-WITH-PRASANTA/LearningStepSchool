const mongoose = require("mongoose");

const destinationSchema =
  new mongoose.Schema(
    {
      routeId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "TransportRoute",
        required: true,
      },

      destination: {
        type: String,
        required: true,
      },

      distance: {
        type: Number,
        required: true,
      },

      fare: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "TransportDestination",
    destinationSchema
  );