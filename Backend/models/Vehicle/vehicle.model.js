const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      required: true,
    },

    vehicleNo: {
      type: String,
      required: true,
      unique: true,
    },

    driver: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    pucDate: Date,

    regDate: Date,

    fitnessDate: Date,

    insuranceDate: Date,

    permitDate: Date,

    trackNo: String,

    trackApi: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Vehicle",
  vehicleSchema
);