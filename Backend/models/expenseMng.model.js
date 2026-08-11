const mongoose = require("mongoose");

const expenseManagementSchema = new mongoose.Schema(
  {
    // Employee Name
    employeeName: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },

    // Expense Date
    expenseDate: {
      type: Date,
      required: [true, "Expense date is required"],
    },

    // Expense Purpose
    expenseFor: {
      type: String,
      required: [true, "Expense purpose is required"],
      trim: true,
    },

    // Amount
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    // Description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Payment Approval
    paymentApproval: {
      type: String,
      required: [true, "Payment approval is required"],
      enum: ["Manager", "Finance Head"],
    },

    // Approval Status
    approval: {
      type: String,
      enum: ["Pending", "Approved"],
      default: "Pending",
    },

    // Payment Status
    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Cash",
        "UPI",
        "Card",
        "Bank Transfer",
      ],
      default: "Pending",
    },

    // UPI Number
    upiNumber: {
      type: String,
      trim: true,
      default: "",
    },

    // Bill Path
    bill: {
      type: String,
      default: "",
    },

    // Original Bill Name
    billOriginalName: {
      type: String,
      default: "",
    },

    // Bill MIME Type
    billMimeType: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ExpenseManagement",
  expenseManagementSchema
);