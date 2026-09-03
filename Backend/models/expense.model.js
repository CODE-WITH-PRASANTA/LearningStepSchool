const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    // =====================================================
    // EXPENSE HEAD
    // =====================================================

    head: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // ACCOUNT TYPE
    // =====================================================

    accountType: {
      type: String,
      enum: {
        values: [
          "Savings",
          "Current",
          "Salary",
          "Cash",
          "Bank",
          "UPI",
        ],
        message: "Invalid account type",
      },
      default: "Savings",
    },

    // =====================================================
    // ACCOUNT NAME
    // =====================================================

    accountName: {
      type: String,
      trim: true,
    },

    // =====================================================
    // EXPENSE NAME
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // AMOUNT
    // =====================================================

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // =====================================================
    // INVOICE NUMBER
    // =====================================================

    invoice: {
      type: String,
      trim: true,
    },

    // =====================================================
    // BILL UPLOAD
    // =====================================================

    bill: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // DATE
    // =====================================================

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // =====================================================
    // PAYMENT MODE
    // =====================================================

    paymentMode: {
      type: String,
      enum: [
        "Cash",
        "Card",
        "UPI",
        "Bank Transfer",
      ],
      default: "Cash",
    },

    // =====================================================
    // DESCRIPTION
    // =====================================================

    description: {
      type: String,
      trim: true,
    },

    // =====================================================
    // CREATED BY
    // =====================================================

    createdBy: {
      type: String,
      default: "Admin",
    },

    // =====================================================
    // APPROVED BY
    // =====================================================

    approvedBy: {
      type: String,
      default: "-",
    },

    // =====================================================
    // WALLET LINK
    // =====================================================

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

// =====================================================
// TEXT SEARCH INDEX
// =====================================================

expenseSchema.index({
  name: "text",
  description: "text",
  invoice: "text",
});

// =====================================================
// FILTER INDEX
// =====================================================

expenseSchema.index({
  date: -1,
  head: 1,
});

expenseSchema.index({
  paymentMode: 1,
});

module.exports = mongoose.model(
  "Expense",
  expenseSchema
);