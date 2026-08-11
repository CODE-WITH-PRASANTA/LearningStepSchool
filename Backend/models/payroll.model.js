const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // PAYROLL MONTH / YEAR
    // ==========================================

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

    // ==========================================
    // DAYS
    // ==========================================

    totalDays: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
      Final paid/working days.

      Example:

      Present       = 1
      Late          = 1
      Half Day      = 0.5
      Leave         = 1
      Paid Holiday  = 1
      Absent        = 0
    */
    workingDays: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // ATTENDANCE
    // ==========================================

    presentDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    /*
      Number of Half Day attendance records.

      2 Half Days = 1 Working Day
    */
    halfDayCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    leaveDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // HOLIDAYS
    // ==========================================

    /*
      Total holidays in the attendance month.
    */
    holidayDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    /*
      Paid holidays are included
      in workingDays / salary calculation.
    */
    paidHolidayDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    /*
      Unpaid holidays are NOT included
      in paid working days.
    */
    unpaidHolidayDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // ABSENT
    // ==========================================

    absentDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // SALARY
    // ==========================================

    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
      Number of days used for salary calculation.

      Usually:
      30

      Example:

      Base Salary = ₹30,000
      Payroll Working Days = 30

      Per Day = 30,000 / 30
    */
    payrollWorkingDays: {
      type: Number,
      default: 30,
      min: 1,
    },

    // ==========================================
    // DEDUCTIONS
    // ==========================================

    deductionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // OVERTIME
    // ==========================================

    overtimeHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    overtimeRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    overtimeAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // ALLOWANCE
    // ==========================================

    allowance: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherDeduction: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // SALARY TOTALS
    // ==========================================

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

    // ==========================================
    // CITY
    // ==========================================

    city: {
      type: String,
      enum: ["metro", "non-metro"],
      default: "metro",
    },

    // ==========================================
    // PAYMENT
    // ==========================================

    payDate: {
      type: Date,
    },

    paymentMode: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    // ==========================================
    // SALARY BREAKDOWN
    // ==========================================

    salaryBreakdown: {
      earnings: {
        basic: {
          type: Number,
          default: 0,
        },

        hra: {
          type: Number,
          default: 0,
        },

        conveyance: {
          type: Number,
          default: 0,
        },

        lta: {
          type: Number,
          default: 0,
        },

        medical: {
          type: Number,
          default: 0,
        },

        overtime: {
          type: Number,
          default: 0,
        },

        allowance: {
          type: Number,
          default: 0,
        },
      },

      deductions: {
        pf: {
          type: Number,
          default: 0,
        },

        professionalTax: {
          type: Number,
          default: 0,
        },

        esi: {
          type: Number,
          default: 0,
        },

        incomeTax: {
          type: Number,
          default: 0,
        },

        monthlyDeduction: {
          type: Number,
          default: 0,
        },

        otherDeduction: {
          type: Number,
          default: 0,
        },
      },
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "Pending",
        "Completed",
        "Reject",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// UNIQUE PAYROLL
// ==========================================

// One teacher can have only one payroll
// for one month in one year.

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

module.exports =
  mongoose.models.Payroll ||
  mongoose.model(
    "Payroll",
    payrollSchema
  );