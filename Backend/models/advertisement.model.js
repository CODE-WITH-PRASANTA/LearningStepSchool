const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Advertisement image is required"],
      trim: true,
    },

    title: {
      type: String,
      trim: true,
      default: "",
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Advertisement", advertisementSchema);