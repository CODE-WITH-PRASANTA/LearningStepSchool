const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    head: {
      type: String,
      required: true,
      trim: true,
    },

    accountType: {
      type: String,
      enum: {
        values: ["Savings", "Current", "Salary", "Cash", "Bank", "UPI"],
        message: "Invalid account type",
      },
      default: "Savings",
    },

    accountName: {
      type: String,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0, // ❗ prevent negative values
    },

    invoice: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    paymentMode: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank Transfer"],
      default: "Cash",
    },

    description: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: String,
      default: "Admin",
    },

    approvedBy: {
      type: String,
      default: "-",
    },

    // 🔥 WALLET LINK TRACKING
    walletLinked: {
      type: Boolean,
      default: false,
    },

    walletTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalletTransaction",
    },
  },
  { timestamps: true },
);

/* 🔍 TEXT SEARCH INDEX (for your search API) */
expenseSchema.index({
  name: "text",
  description: "text",
});

/* 📊 FILTER INDEX (faster queries) */
expenseSchema.index({ date: -1, head: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
