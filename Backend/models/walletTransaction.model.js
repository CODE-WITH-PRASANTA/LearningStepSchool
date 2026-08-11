const mongoose = require("mongoose");

/* =========================================================
   WALLET TRANSACTION SCHEMA
========================================================= */

const walletTransactionSchema = new mongoose.Schema(
  {
    /* =====================================================
       TRANSACTION TYPE
       credit = money coming in
       debit  = money going out
    ===================================================== */

    type: {
      type: String,

      enum: ["credit", "debit"],

      required: true,

      index: true,
    },

    /* =====================================================
       AMOUNT
    ===================================================== */

    amount: {
      type: Number,

      required: true,

      min: 0,
    },

    /* =====================================================
       SOURCE
    ===================================================== */

    source: {
      type: String,

      enum: ["fee", "expense", "payroll", "fuel", "otherIncome"],

      required: true,
    },
    /* =====================================================
       REFERENCE ID

       Examples:

       fee       -> Fee document ID
       expense   -> Expense document ID
       payroll   -> Payroll document ID
       otherIncome -> Income document ID
    ===================================================== */

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,

      index: true,
    },

    /* =====================================================
       DESCRIPTION
    ===================================================== */

    description: {
      type: String,

      trim: true,

      default: "",
    },

    /* =====================================================
       CREATED BY
    ===================================================== */

    createdBy: {
      type: String,

      default: "Admin",

      trim: true,
    },
  },

  {
    timestamps: true,
  },
);

/* =========================================================
   INDEXES
========================================================= */

/*
  Latest transactions first.
*/

walletTransactionSchema.index({
  createdAt: -1,
});

/*
  Useful for filtering:
  credit + fee
  debit + expense
  debit + payroll
*/

walletTransactionSchema.index({
  type: 1,
  source: 1,
});

/*
  Useful for finding the wallet transaction
  belonging to one particular expense/fee/payroll.

  Example:

  source = expense
  referenceId = expense._id
*/

walletTransactionSchema.index({
  source: 1,
  referenceId: 1,
});

/*
  IMPORTANT

  Prevent duplicate wallet transactions
  for the same source + reference.

  Example:

  expense ID = 123

  Only one:

  expense + 123

  can exist.
*/

walletTransactionSchema.index(
  {
    source: 1,
    referenceId: 1,
  },
  {
    unique: true,
  },
);

/* =========================================================
   MODEL
========================================================= */

module.exports =
  mongoose.models.WalletTransaction ||
  mongoose.model("WalletTransaction", walletTransactionSchema);
