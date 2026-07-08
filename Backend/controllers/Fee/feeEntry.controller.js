const FeeEntry = require("../../models/Fee/feeEntry.model");
const Student = require("../../models/sudentAdmission.model");
const Wallet = require("../../models/walletTransaction.model");

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

      grossAmount += originalAmount;

      allocatedAmount += Number(newFee.amount || 0);

      // Previous paid for same fee head
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
    // CALCULATIONS
    // ==========================

    const totalPayable =
      grossAmount - Number(discountAmount) - Number(advanceUsed);

    const totalPaidTillNow = previousPaidTotal + allocatedAmount;

    const dueAmount = Math.max(0, totalPayable - totalPaidTillNow);

    // Extra cash goes to advance wallet
    const advanceCreated = Math.max(0, Number(paidAmount) - allocatedAmount);

    const status =
      dueAmount === 0
        ? "Complete"
        : totalPaidTillNow > 0
          ? "Partial"
          : "Pending";

    const totals = calculateTotals({
      feeHeads,
      discountAmount,
      advanceUsed,
      paidAmount,
      previousPaid: previousPaidTotal,
    });

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

      feeHeads,

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
