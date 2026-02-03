const mongoose = require("mongoose");

const admissionSurveySchema = new mongoose.Schema(
  {
    parentName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },

    whatsapp: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },

    village: String,

    children: {
      type: Number,
      default: 1,
    },

    age: String,
    className: String,

    medium: {
      type: String,
      enum: ["English", "Hindi"],
      default: "English",
    },

    currentSchool: String,
    feeRange: String,

    transport: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    distance: String,
    interest: String,
    concern: String,

    applicationNo: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AdmissionSurvey",
  admissionSurveySchema
);
