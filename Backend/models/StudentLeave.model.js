const mongoose = require("mongoose");

const studentLeaveSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // 👈 your student collection
      required: true,
    },
    applyDate: {
      type: Date,
      default: Date.now,
    },
    leaveFrom: {
      type: Date,
      required: true,
    },
    leaveTo: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    file: {
      type: String, // store file path
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("StudentLeave", studentLeaveSchema);
