const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {              
      type: String,
      required: true,
      trim: true,
    },

    review: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    photo: {
      type: String,
      required: true,
    },

    instagram: String,
    facebook: String,
    linkedin: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);