const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema(
  {
    parentName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    whatsapp: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },

    village: {
      type: String,
      trim: true,
    },

    children: {
      type: Number,
      default: 1,
    },

    age: {
      type: String,
    },

    className: {
      type: String,
    },

    medium: {
      type: String,
      enum: ["English", "Hindi"],
      default: "English",
    },

    currentSchool: {
      type: String,
    },

    feeRange: {
      type: String,
    },

    transport: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    distance: {
      type: String,
    },

    interest: {
      type: String,
    },

    concern: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Survey", surveySchema);