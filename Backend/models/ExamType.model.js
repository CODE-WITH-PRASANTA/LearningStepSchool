const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const examTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = model("ExamType", examTypeSchema);