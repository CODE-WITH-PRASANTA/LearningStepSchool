const mongoose = require("mongoose");

const preAdmissionSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: String,
    gender: String,
    dob: Date,

    contactNo: {
      type: String,
      required: true,
    },

    email: String,

    fatherName: String,
    motherName: String,

    className: String,

    fatherOccupation: String,
    motherOccupation: String,

    fatherAddress: String,

    previousSchool: String,

    remark: String,

    photo: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PreAdmission",
  preAdmissionSchema
);