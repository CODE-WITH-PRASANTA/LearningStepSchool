const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0, // ❗ prevent negative values
    },

    source: {
      type: String,
      enum: ["fee", "expense", "payroll"], // ✅ fixed
      required: true,
      index: true,
    },

    // 🔗 Strong reference instead of plain string
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // 🔐 Optional: who performed the action
    createdBy: {
      type: String,
      default: "Admin",
    },

    // 🕒 Keep both timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }, // auto createdAt + updatedAt
);

/* ⚡ Helpful indexes for reports */
walletTransactionSchema.index({ createdAt: -1 });
walletTransactionSchema.index({ type: 1, source: 1 });

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
