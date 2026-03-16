const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    admissionNo: String,
    name: String,
    rollNumber: String,
    class: String,
    section: String,

    amount: Number,
    paid: Number,
    due: Number,

    paymentMethod: String,
    discount: Number,
    note: String,

    date: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Paid", "Partial", "Unpaid"],
      default: "Paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdmissionFee", feeSchema);