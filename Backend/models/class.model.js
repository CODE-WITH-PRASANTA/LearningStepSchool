const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true
    },

    sectionName: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

classSchema.index({ className: 1, sectionName: 1 }, { unique: true });

module.exports = mongoose.model("Class", classSchema);