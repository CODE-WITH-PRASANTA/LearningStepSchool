const mongoose = require("mongoose");

const feeEntrySchema = new mongoose.Schema(
  {
    receiptNo: {
      type: String,
      trim: true,
      index: true,
    },
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
    entryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Online", "Cheque", "DD", "UPI"],
      required: true,
    },
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
        amount: {
          type: Number,
          default: 0,
        },
      },
    ],
    grossAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    advanceAdjustment: {
      type: Number,
      default: 0,
    },
    advanceCreated: {
      type: Number,
      default: 0,
    },
    totalPayable: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    dueAmount: {
      type: Number,
      default: 0,
    },
    cashReceived: {
      type: Number,
      default: 0,
    },
    remark: {
      type: String,
      trim: true,
      default: "",
    },
    installmentMonth: {
      type: [String],
      default: [],
    },
    academicYear: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Partial", "Complete"],
      default: "Complete",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

feeEntrySchema.index({ studentId: 1 });
feeEntrySchema.index({ admissionNo: 1 });
feeEntrySchema.index({ entryDate: -1 });

module.exports = mongoose.model("FeeEntry", feeEntrySchema);
