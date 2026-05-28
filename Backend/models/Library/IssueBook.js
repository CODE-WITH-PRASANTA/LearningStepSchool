const mongoose = require("mongoose");

const issueBookSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["issued", "returned"],
      default: "issued",
    },
    fine: {
      type: Number,
      default: 0,
    },
    qty: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IssueBook", issueBookSchema);