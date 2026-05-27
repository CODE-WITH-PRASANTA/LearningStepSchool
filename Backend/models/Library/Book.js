const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookNo: { type: String, required: true, unique: true },
    barcode: { type: String },
    title: { type: String, required: true },

    author: { type: String, required: true },
    category: { type: String, required: true },
    publication: { type: String, required: true },

    edition: { type: String },
    volume: { type: String },
    className: { type: String },
    subject: { type: String, required: true },
    openQuantity: { type: Number, default: 0 },
    reorder: { type: Number, default: 0 },
    rate: { type: Number, required: true },
    remark: { type: String },

    pdf: { type: Boolean, default: false },
    audio: { type: Boolean, default: false },
    video: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
