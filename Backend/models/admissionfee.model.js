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

    class: String,   // ✅ FIXED
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
      required: true, // optional but recommended
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