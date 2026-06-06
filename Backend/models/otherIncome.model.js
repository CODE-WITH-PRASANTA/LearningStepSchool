const mongoose = require("mongoose");

const otherIncomeSchema = new mongoose.Schema(
  {
    incomeHead: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "BANK", "CARD"],
      default: "CASH",
    },

    receivedFrom: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    note: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },

    walletLinked: {
      type: Boolean,
      default: false,
    },

    walletTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalletTransaction",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OtherIncome",
  otherIncomeSchema
);
