const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 0,
    },
    workingDays: {
      type: Number,
      required: true,
      min: 0,
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    overtimeHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    overtimeAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    grossSalary: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDeductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    city: {
      type: String,
      enum: ["metro", "non-metro"],
      default: "metro",
    },
    salaryBreakdown: {
      earnings: {
        basic: { type: Number, default: 0 },
        hra: { type: Number, default: 0 },
        conveyance: { type: Number, default: 0 },
        lta: { type: Number, default: 0 },
        medical: { type: Number, default: 0 },
        overtime: { type: Number, default: 0 },
      },
      deductions: {
        pf: { type: Number, default: 0 },
        professionalTax: { type: Number, default: 0 },
        esi: { type: Number, default: 0 },
        incomeTax: { type: Number, default: 0 },
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Reject"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate payroll for same teacher, month, year
payrollSchema.index({ teacherId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Payroll", payrollSchema);