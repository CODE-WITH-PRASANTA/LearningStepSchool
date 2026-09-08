const mongoose = require("mongoose");

const feeEntrySchema = new mongoose.Schema(
  {
    /* =========================================================
       RECEIPT NUMBER
    ========================================================= */

    receiptNo: {
      type: String,
      trim: true,
      index: true,
    },

    /* =========================================================
       STUDENT
    ========================================================= */

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    admissionNo: {
      type: String,
      required: true,
      trim: true,
    },

    class: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================================================
       ENTRY DATE
    ========================================================= */

    entryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    /* =========================================================
       PAYMENT MODE
    ========================================================= */

    paymentMode: {
      type: String,

      enum: [
        "Cash",
        "Online",
        "Cheque",
        "DD",
        "UPI",
      ],

      required: true,
    },

    /* =========================================================
       PAYMENT TYPE
    =========================================================

       CURRENT_SESSION
         → Normal current academic-year payment

       PREVIOUS_SESSION
         → Payment against an old session's outstanding due

       ADVANCE
         → Money received as advance
    */

    paymentType: {
      type: String,

      enum: [
        "CURRENT_SESSION",
        "PREVIOUS_SESSION",
        "ADVANCE",
      ],

      default: "CURRENT_SESSION",

      index: true,
    },

    /* =========================================================
       ACADEMIC YEAR
    =========================================================

       This is the session in which the receipt/payment
       was created.

       Example:

       Student is currently in:

         2026-27

       Previous payment received now:

         academicYear = "2026-27"
    */

    academicYear: {
      type: String,

      required: true,

      trim: true,

      index: true,
    },

    /* =========================================================
       APPLIED ACADEMIC YEAR
    =========================================================

       This tells which academic year's fee this payment
       is actually paying.

       Normal current payment:

         academicYear = "2026-27"
         appliedAcademicYear = "2026-27"

       Previous payment:

         academicYear = "2026-27"
         appliedAcademicYear = "2025-26"
    */

    appliedAcademicYear: {
      type: String,

      trim: true,

      default: "",
    },

    /* =========================================================
       FEE HEADS
    ========================================================= */

    feeHeads: [
      {
        feeHeadId: {
          type: mongoose.Schema.Types.ObjectId,

          ref: "FeeHead",
        },

        feeHeadName: {
          type: String,

          trim: true,
        },

        /* =====================================================
           FEE STRUCTURE

           IMPORTANT:

           Do NOT put "Previous Session" here.

           Previous Session is a payment type, not a fee
           structure.

           Allowed values:
             Monthly
             Quarterly
             Half-Yearly
             Annually
        ===================================================== */

        structureType: {
          type: String,

          enum: [
            "Monthly",
            "Quarterly",
            "Half-Yearly",
            "Annually",
          ],

          default: null,
        },

        /* =====================================================
           ORIGINAL FEE AMOUNT
        ===================================================== */

        originalAmount: {
          type: Number,

          default: 0,
        },

        /* =====================================================
           ACTUAL AMOUNT ALLOCATED TO THIS FEE HEAD
        ===================================================== */

        amount: {
          type: Number,

          default: 0,
        },
      },
    ],

    /* =========================================================
       GROSS AMOUNT
    ========================================================= */

    grossAmount: {
      type: Number,

      default: 0,
    },

    /* =========================================================
       DISCOUNT
    ========================================================= */

    discountAmount: {
      type: Number,

      default: 0,
    },

    /* =========================================================
       ADVANCE ADJUSTMENT
    ========================================================= */

    advanceAdjustment: {
      type: Number,

      default: 0,
    },

    /* =========================================================
       ADVANCE CREATED
    ========================================================= */

    advanceCreated: {
      type: Number,

      default: 0,
    },

    /* =========================================================
       TOTAL PAYABLE
    ========================================================= */

    totalPayable: {
      type: Number,

      default: 0,
    },

    /* =========================================================
       PAID AMOUNT
    ========================================================= */

    paidAmount: {
      type: Number,

      default: 0,
    },

    /* =========================================================
       DUE AMOUNT
    ========================================================= */

    dueAmount: {
      type: Number,

      default: 0,
    },

    /* =========================================================
       CASH RECEIVED
    ========================================================= */

    cashReceived: {
      type: Number,

      default: 0,
    },

    /* =========================================================
       REMARK
    ========================================================= */

    remark: {
      type: String,

      trim: true,

      default: "",
    },

    /* =========================================================
       INSTALLMENT MONTH
    ========================================================= */

    installmentMonth: {
      type: [String],

      default: [],
    },

    /* =========================================================
       STATUS
    ========================================================= */

    status: {
      type: String,

      enum: [
        "Pending",
        "Partial",
        "Complete",
      ],

      default: "Complete",
    },

    /* =========================================================
       ACTIVE
    ========================================================= */

    isActive: {
      type: Boolean,

      default: true,
    },
  },

  {
    timestamps: true,
  }
);

/* =========================================================
   INDEXES
========================================================= */

feeEntrySchema.index({
  studentId: 1,
});

feeEntrySchema.index({
  admissionNo: 1,
});

feeEntrySchema.index({
  entryDate: -1,
});

feeEntrySchema.index({
  studentId: 1,
  academicYear: 1,
});

feeEntrySchema.index({
  studentId: 1,
  appliedAcademicYear: 1,
  paymentType: 1,
});

/* =========================================================
   MODEL
========================================================= */

module.exports = mongoose.model(
  "FeeEntry",
  feeEntrySchema
);