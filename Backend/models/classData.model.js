const mongoose = require("mongoose");

const classDataSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weekly: {
      type: String,
    },
    timeManagement: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassData", classDataSchema);