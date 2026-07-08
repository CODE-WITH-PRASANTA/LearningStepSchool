const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Keep month field
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

    presentDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    leaveDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    absentDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    payrollWorkingDays: {
      type: Number,
      default: 30,
    },

    deductionAmount: {
      type: Number,
      default: 0,
    },

    overtimeHours: {
      type: Number,
      default: 0,
    },

    overtimeRate: {
      type: Number,
      default: 0,
    },

    overtimeAmount: {
      type: Number,
      default: 0,
    },

    allowance: {
      type: Number,
      default: 0,
    },

    otherDeduction: {
      type: Number,
      default: 0,
    },

    grossSalary: {
      type: Number,
      default: 0,
    },

    totalDeductions: {
      type: Number,
      default: 0,
    },

    totalSalary: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      enum: ["metro", "non-metro"],
      default: "metro",
    },

    payDate: Date,

    paymentMode: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    salaryBreakdown: {
      earnings: {
        basic: Number,
        hra: Number,
        conveyance: Number,
        lta: Number,
        medical: Number,
        overtime: Number,
      },

      deductions: {
        pf: Number,
        professionalTax: Number,
        esi: Number,
        incomeTax: Number,
      },
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Reject"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// One teacher can have only one payroll for one month in one year
payrollSchema.index(
  {
    teacherId: 1,
    year: 1,
    month: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Payroll", payrollSchema);