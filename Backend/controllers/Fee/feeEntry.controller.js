const FeeEntry = require("../../models/Fee/feeEntry.model");
const Student = require("../../models/sudentAdmission.model");
const Wallet = require("../../models/walletTransaction.model");
const FeeBalance = require("../../models/Fee/feeBalance.model");
const calculateTotals = ({
  feeHeads = [],
  discountAmount = 0,
  advanceUsed = 0,
  paidAmount = 0, // Cash received
  previousPaid = 0,
}) => {
  // Original fee amount
  const grossAmount = feeHeads.reduce(
    (sum, item) => sum + Number(item.originalAmount || item.amount || 0),
    0,
  );

  // Amount allocated to fee heads in this receipt
  const allocatedAmount = feeHeads.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  // Cash received
  const cashReceived = Number(paidAmount || 0);

  // Advance used
  const advanceApplied = Number(advanceUsed || 0);

  // Receipt total (Cash + Advance)
  const currentPaid = cashReceived + advanceApplied;

  // Amount payable after discount and advance adjustment
  const totalPayable =
    grossAmount - Number(discountAmount || 0) - advanceApplied;

  // Total paid till now against this fee
  const totalPaidTillNow = previousPaid + allocatedAmount;

  // Remaining due
  const dueAmount = Math.max(0, totalPayable - totalPaidTillNow);

  // Extra cash becomes advance wallet
  const advanceCreated = Math.max(0, cashReceived - allocatedAmount);

  // Status
  let status = "Pending";

  if (dueAmount <= 0) {
    status = "Complete";
  } else if (totalPaidTillNow > 0) {
    status = "Partial";
  }

  return {
    grossAmount,
    allocatedAmount,
    cashReceived,
    advanceApplied,
    currentPaid, // Display on receipt
    totalPayable,
    totalPaidTillNow,
    dueAmount,
    advanceCreated,
    status,
  };
};
const generateReceiptNo = async () => {
  const year = new Date().getFullYear();

  const lastReceipt = await FeeEntry.findOne({
    receiptNo: { $regex: `^RCP-${year}` },
  })
    .sort({ createdAt: -1 })
    .select("receiptNo");

  let nextNo = 1;

  if (lastReceipt?.receiptNo) {
    nextNo = parseInt(lastReceipt.receiptNo.split("-").pop(), 10) + 1;
  }

  return `RCP-${year}-${String(nextNo).padStart(4, "0")}`;
};

exports.createFeeEntry = async (req, res) => {
  try {
    const {
      studentId,
      academicYear,
      entryDate,
      paymentMode,
      feeHeads = [],
      discountAmount = 0,
      advanceUsed = 0,
      paidAmount = 0,
      remark = "",
      installmentMonth = [],
    } = req.body;

    // ==========================
    // GET STUDENT
    // ==========================

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const studentName =
      `${student.firstName || ""} ${student.lastName || ""}`.trim();

    // ==========================
    // GET PREVIOUS RECEIPTS
    // ==========================

    const existingEntries = await FeeEntry.find({
      studentId,
      academicYear,
      isActive: true,
    });

    let grossAmount = 0;
    let allocatedAmount = 0;
    let previousPaidTotal = 0;

    // ==========================
    // VALIDATION
    // ==========================

    for (const newFee of feeHeads) {
      const originalAmount = Number(
        newFee.originalAmount || newFee.amount || 0,
      );

      const currentAmount = Number(newFee.amount || 0);

      grossAmount += originalAmount;
      allocatedAmount += currentAmount;

      // ==========================
      // PREVIOUS PAID
      // ==========================

      const previousPaid = existingEntries.reduce((sum, entry) => {
        const fee = entry.feeHeads.find(
          (f) => String(f.feeHeadId) === String(newFee.feeHeadId),
        );

        return sum + Number(fee?.amount || 0);
      }, 0);

      previousPaidTotal += previousPaid;

      // ==========================
      // ANNUAL VALIDATION
      // ==========================

      if (newFee.structureType === "Annually") {
        if (previousPaid >= originalAmount) {
          return res.status(400).json({
            success: false,
            message: `${newFee.feeHeadName} already fully paid.`,
          });
        }

        continue;
      }

      // ==========================
      // MONTH VALIDATION
      // ==========================

      const duplicate = existingEntries.some((entry) => {
        const sameFee = entry.feeHeads.some(
          (fee) => String(fee.feeHeadId) === String(newFee.feeHeadId),
        );

        if (!sameFee) return false;

        return installmentMonth.some((month) =>
          (entry.installmentMonth || []).includes(month),
        );
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `${newFee.feeHeadName} already paid for selected months.`,
        });
      }
    }

    // ==========================
    // PREPARE FEE HEADS
    // ==========================
    //
    // IMPORTANT:
    // Save the fee structure information
    // inside the receipt itself.
    //
    // Old receipts remain unchanged.
    // New receipts will contain:
    //
    // structureType
    // originalAmount
    // amount
    //
    // ==========================

    const savedFeeHeads = feeHeads.map((fee) => ({
      feeHeadId: fee.feeHeadId,

      feeHeadName: fee.feeHeadName || "",

      structureType: fee.structureType || null,

      originalAmount: Number(fee.originalAmount || fee.amount || 0),

      amount: Number(fee.amount || 0),
    }));

    // ==========================
    // CALCULATIONS
    // ==========================

    const totalPayable =
      grossAmount - Number(discountAmount) - Number(advanceUsed);

    const totalPaidTillNow = previousPaidTotal + allocatedAmount;

    const dueAmount = Math.max(0, totalPayable - totalPaidTillNow);

    // ==========================
    // EXTRA CASH → ADVANCE
    // ==========================

    const advanceCreated = Math.max(0, Number(paidAmount) - allocatedAmount);

    // ==========================
    // STATUS
    // ==========================

    const status =
      dueAmount === 0
        ? "Complete"
        : totalPaidTillNow > 0
          ? "Partial"
          : "Pending";

    // ==========================
    // CALCULATE TOTALS
    // ==========================

    const totals = calculateTotals({
      feeHeads: savedFeeHeads,
      discountAmount,
      advanceUsed,
      paidAmount,
      previousPaid: previousPaidTotal,
    });

    // ==========================
    // RECEIPT NUMBER
    // ==========================

    const receiptNo = await generateReceiptNo();

    // ==========================
    // SAVE ENTRY
    // ==========================

    const feeEntry = await FeeEntry.create({
      studentId,

      academicYear,

      studentName,

      admissionNo: student.admissionNo || "",

      class: student.class || "",

      section: student.section || "",

      entryDate,

      receiptNo,

      paymentMode,

      // IMPORTANT
      feeHeads: savedFeeHeads,

      grossAmount: totals.grossAmount,

      discountAmount: Number(discountAmount),

      advanceAdjustment: totals.advanceApplied,

      advanceCreated: totals.advanceCreated,

      totalPayable: totals.totalPayable,

      paidAmount: totals.currentPaid,

      cashReceived: totals.cashReceived,

      dueAmount: totals.dueAmount,

      status: totals.status,

      remark,

      installmentMonth,
    });

    // ==========================
    // UPDATE ADVANCE WALLET
    // ==========================

    if (totals.advanceCreated > 0) {
      await Student.findByIdAndUpdate(studentId, {
        $inc: {
          advanceWallet: totals.advanceCreated,
        },
      });
    }

    if (advanceUsed > 0) {
      await Student.findByIdAndUpdate(studentId, {
        $inc: {
          advanceWallet: -Number(advanceUsed),
        },
      });
    }

    // ==========================
    // WALLET ENTRY
    // ==========================

    if (totals.cashReceived > 0) {
      await Wallet.create({
        type: "credit",

        amount: totals.cashReceived,

        source: "fee",

        referenceId: feeEntry._id,

        description: `Fee payment received from ${studentName}`,

        createdBy: studentId,
      });
    }

    // ==========================
    // RESPONSE
    // ==========================

    return res.status(201).json({
      success: true,
      message: "Fee entry saved successfully.",
      data: feeEntry,
    });
  } catch (error) {
    console.error("CREATE FEE ENTRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   CREATE PREVIOUS SESSION PAYMENT
=========================================================

   Example:

   Current Session:
      2026-27

   Previous Session:
      2025-26

   Previous Due:
      ₹5000

   Payment:
      ₹2000

   Result:
      Previous Due = ₹3000

   IMPORTANT:

   This payment is stored against the PREVIOUS academic year.

   It does NOT become a payment for the current session.
========================================================= */

exports.createPreviousPayment = async (req, res) => {
  try {
    const {
      studentId,
      academicYear,
      appliedAcademicYear,
      paidAmount,
      paymentMode = "Cash",
      remark = "",
    } = req.body;

    /* ======================================================
       VALIDATION
    ====================================================== */

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required",
      });
    }

    if (!academicYear) {
      return res.status(400).json({
        success: false,
        message: "Current academicYear is required",
      });
    }

    if (!appliedAcademicYear) {
      return res.status(400).json({
        success: false,
        message: "Previous academicYear is required",
      });
    }

    const amount = Number(paidAmount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid payment amount",
      });
    }

    /* ======================================================
       GET STUDENT
    ====================================================== */

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    /* ======================================================
       GET PREVIOUS FEE BALANCE
    ====================================================== */

    const previousBalance = await FeeBalance.findOne({
      studentId,

      academicYear: appliedAcademicYear,

      isActive: true,

      isClosed: true,
    });

    if (!previousBalance) {
      return res.status(404).json({
        success: false,
        message: `No closed fee balance found for ${appliedAcademicYear}`,
      });
    }

    /* ======================================================
       CURRENT PREVIOUS DUE
    ====================================================== */

    const previousDue = Number(previousBalance.closingDue || 0);

    if (previousDue <= 0) {
      return res.status(400).json({
        success: false,
        message: `${appliedAcademicYear} has no outstanding due`,
      });
    }

    /* ======================================================
       PAYMENT CANNOT EXCEED DUE
    ====================================================== */

    if (amount > previousDue) {
      return res.status(400).json({
        success: false,
        message: `Payment cannot be greater than previous due of ₹${previousDue.toFixed(
          2,
        )}`,
      });
    }

    /* ======================================================
       STUDENT NAME
    ====================================================== */

    const studentName = `${student.firstName || ""} ${
      student.lastName || ""
    }`.trim();

    /* ======================================================
       RECEIPT NUMBER
    ====================================================== */

    const receiptNo = await generateReceiptNo();

    /* ======================================================
       NEW PREVIOUS BALANCE
    ====================================================== */

    const newClosingDue = Math.max(0, previousDue - amount);

    const newTotalPaid = Number(previousBalance.totalPaid || 0) + amount;

    /* ======================================================
       CREATE PREVIOUS PAYMENT RECEIPT
    ======================================================

       Notice:

       academicYear = previous session

       Example:

       2025-26

       Therefore this receipt will NEVER be counted
       as a 2026-27 current-session payment.
    ====================================================== */

    const feeEntry = await FeeEntry.create({
      studentId,

      /*
    Session in which the payment is received.
    Example:
      Current student session = 2026-27
  */
      academicYear: academicYear,

      /*
    This is a previous-session payment.
  */
      paymentType: "PREVIOUS_SESSION",

      /*
    The old session whose due is being paid.
    Example:
      2025-26
  */
      appliedAcademicYear: appliedAcademicYear,

      studentName,

      admissionNo: student.admissionNo || "",

      class: student.class || "",

      section: student.section || "",

      entryDate: new Date(),

      receiptNo,

      paymentMode,

      /*
    No new fee is created here.

    This is only a payment against the
    already closed previous-session balance.

    IMPORTANT:
    structureType must be null because
    "Previous Session" is NOT a valid
    structureType enum value.
  */
      feeHeads: [
        {
          feeHeadId: null,

          feeHeadName: "Previous Session Payment",

          structureType: null,

          originalAmount: 0,

          amount: amount,
        },
      ],

      grossAmount: 0,

      discountAmount: 0,

      advanceAdjustment: 0,

      advanceCreated: 0,

      totalPayable: 0,

      paidAmount: amount,

      cashReceived: amount,

      dueAmount: 0,

      status: "Complete",

      remark: remark || `Previous session payment for ${appliedAcademicYear}`,

      installmentMonth: [],
    });

    /* ======================================================
       UPDATE PREVIOUS FEE BALANCE
    ====================================================== */

    previousBalance.totalPaid = newTotalPaid;

    previousBalance.closingDue = newClosingDue;

    await previousBalance.save();

    /* ======================================================
       WALLET TRANSACTION
    ====================================================== */

    await Wallet.create({
      type: "credit",

      amount,

      source: "fee",

      referenceId: feeEntry._id,

      description: `Previous session fee payment received from ${studentName} for ${appliedAcademicYear}`,

      createdBy: studentId,
    });

    /* ======================================================
       RESPONSE
    ====================================================== */

    return res.status(201).json({
      success: true,

      message: "Previous session payment saved successfully.",

      data: {
        receipt: feeEntry,

        currentSession: academicYear,

        appliedAcademicYear: appliedAcademicYear,

        paymentAmount: amount,

        previousDueBeforePayment: previousDue,

        previousDueAfterPayment: newClosingDue,

        totalPaid: newTotalPaid,
      },
    });
  } catch (error) {
    console.error("CREATE PREVIOUS PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,

      message: error.message || "Failed to save previous payment",
    });
  }
};

exports.getStudentFeeEntries = async (req, res) => {
  try {
    const { studentId } = req.params;
    const entries = await FeeEntry.find({ studentId, isActive: true }).sort({
      entryDate: -1,
    });
    return res
      .status(200)
      .json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// GET CARRY FORWARD
// =====================================================
// Example:
// GET /fee-entry/carry-forward/STUDENT_ID/2026-27
//
// It calculates pending amount from previous academic years.
// Old receipts are NOT modified.
// =====================================================

exports.getCarryForward = async (req, res) => {
  try {
    const { studentId, academicYear } = req.params;

    // ==========================
    // VALIDATE STUDENT
    // ==========================

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ==========================
    // GET ALL FEE ENTRIES
    // ==========================

    const entries = await FeeEntry.find({
      studentId,
      isActive: true,
    }).sort({
      academicYear: 1,
      entryDate: 1,
    });

    // ==========================
    // FIND PREVIOUS YEARS
    // ==========================

    const previousEntries = entries.filter(
      (entry) => entry.academicYear !== academicYear,
    );

    // ==========================
    // CALCULATE PREVIOUS DUE
    // ==========================

    let previousDue = 0;

    const breakdownMap = {};

    for (const entry of previousEntries) {
      const year = entry.academicYear;

      /*
       * IMPORTANT:
       *
       * dueAmount in your existing receipt represents
       * the remaining amount for that receipt.
       *
       * We use it only as a starting point here.
       */

      const due = Number(entry.dueAmount || 0);

      if (!breakdownMap[year]) {
        breakdownMap[year] = 0;
      }

      breakdownMap[year] += due;
    }

    // ==========================
    // CREATE BREAKDOWN
    // ==========================

    const breakdown = Object.entries(breakdownMap).map(([year, due]) => ({
      academicYear: year,
      due: Number(due.toFixed(2)),
    }));

    previousDue = breakdown.reduce((sum, item) => sum + item.due, 0);

    // ==========================
    // RESPONSE
    // ==========================

    return res.status(200).json({
      success: true,
      studentId,
      academicYear,
      previousDue: Number(previousDue.toFixed(2)),
      breakdown,
    });
  } catch (error) {
    console.error("GET CARRY FORWARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET /fee-entry/advance/:studentId
exports.getAdvanceWallet = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).select("advanceWallet");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      advanceBalance: Number(student.advanceWallet || 0),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
