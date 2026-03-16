const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },

    teacher: {
      type: String,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    image: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);