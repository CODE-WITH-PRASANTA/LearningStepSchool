const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    ageGroup: {
      type: String,
      trim: true
    },

    classTime: {
      type: String,
      trim: true
    },

    classSize: {
      type: Number
    },

    tuitionFees: {
      type: String
    },

    description: {
      type: String
    },

    image: {
      type: String
    },

    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);