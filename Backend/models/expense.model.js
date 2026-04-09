const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    head: { type: String, required: true },
    accountType: String,
    accountName: String,
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    invoice: String,
    date: { type: Date, required: true },
    paymentMode: String,
    description: String,
    createdBy: { type: String, default: "Admin" },
    approvedBy: { type: String, default: "-" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);