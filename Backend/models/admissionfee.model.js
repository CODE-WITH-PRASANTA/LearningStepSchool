const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
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

    // ✅ NEW (IMPORTANT)
    fees: [
      {
        feeType: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],

    // ✅ CALCULATED FIELDS
    totalAmount: Number,
    paid: Number,
    due: Number,
    discount: Number,
    finalAmount: Number,

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank"],
      default: "Cash",
    },

    note: String,

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