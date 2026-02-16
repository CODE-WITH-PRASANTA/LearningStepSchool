
const mongoose = require("mongoose");

const videoGallerySchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VideoGallery", videoGallerySchema);