const mongoose = require("mongoose");

const feeBalanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Total fee liability for this academic session
    totalFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total amount paid during this session
    totalPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total discount given during this session
    totalDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Final amount pending when session is closed
    closingDue: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Whether this session has been closed
    isClosed: {
      type: Boolean,
      default: false,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// One balance record per student per academic year
feeBalanceSchema.index(
  { studentId: 1, academicYear: 1 },
  { unique: true }
);

module.exports = mongoose.model("FeeBalance", feeBalanceSchema);