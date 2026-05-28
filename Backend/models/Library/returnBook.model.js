const mongoose = require("mongoose");

const returnBookSchema = new mongoose.Schema(
  {
    issueBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IssueBook",
      required: true,
    },
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
    returnDate: {
      type: Date,
      default: Date.now,
    },
    fine: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReturnBook", returnBookSchema);