const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    // 🔥 ADD THIS
    receiptNo: {
      type: Number,
      unique: true,
    },

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

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank"],
      default: "Cash",
    },

    discount: Number,
    note: String,

    feeType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Paid", "Partial", "Unpaid"],
      default: "Paid",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdmissionFee", feeSchema);