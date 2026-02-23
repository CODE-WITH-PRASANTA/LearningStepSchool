const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    author: String,
    designation: String,
    category: String,
    content: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);