const FeeEntry = require("../../models/Fee/feeEntry.model");
const Student = require("../../models/sudentAdmission.model");
const Wallet = require("../../models/walletTransaction.model");

const calculateTotals = ({
  feeHeads = [],
  discountAmount = 0,
  advanceAdjustment = 0,
  paidAmount = 0,
}) => {
  const grossAmount = feeHeads.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );
  const totalPayable =
    grossAmount - Number(discountAmount || 0) + Number(advanceAdjustment || 0);
  const dueAmount = totalPayable - Number(paidAmount || 0);
  const status =
    Number(paidAmount || 0) >= totalPayable
      ? "Complete"
      : Number(paidAmount || 0) > 0
        ? "Partial"
        : "Pending";

  return { grossAmount, totalPayable, dueAmount, status };
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
      feeHeads,
      discountAmount,
      advanceAdjustment,
      paidAmount,
      remark,
      installmentMonth,
    } = req.body;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ==========================
    // DUPLICATE PAYMENT CHECK
    // ==========================

    const existingEntries = await FeeEntry.find({
      studentId,
      academicYear,
      isActive: true,
    });

    for (const newFee of feeHeads) {
      for (const oldEntry of existingEntries) {
        for (const oldFee of oldEntry.feeHeads) {
          const sameFeeHead =
            oldFee.feeHeadId?.toString() === newFee.feeHeadId?.toString();

          if (!sameFeeHead) continue;

          // Annual Fee Validation
          if (newFee.structureType === "Annually") {
            return res.status(400).json({
              success: false,
              message: `${newFee.feeHeadName} already paid.`,
            });
          }

          // Monthly / Quarterly / Half-Yearly Validation
          const duplicateMonths = (installmentMonth || []).filter((month) =>
            (oldEntry.installmentMonth || []).includes(month),
          );

          if (duplicateMonths.length > 0) {
            return res.status(400).json({
              success: false,
              message: `${newFee.feeHeadName} already paid for ${duplicateMonths.join(", ")}`,
            });
          }
        }
      }
    }

    // ==========================
    // CALCULATE TOTALS
    // ==========================

    const totals = calculateTotals({
      feeHeads,
      discountAmount,
      advanceAdjustment,
      paidAmount,
    });

    const autoReceiptNo = await generateReceiptNo();

    // ==========================
    // SAVE ENTRY
    // ==========================

    const feeEntry = await FeeEntry.create({
      studentId,
      academicYear,
      studentName: student.studentName || student.firstName || "",
      admissionNo: student.admissionNo || "",
      class: student.class || "",
      section: student.section || "",
      entryDate,
      receiptNo: autoReceiptNo,
      paymentMode,
      feeHeads,
      discountAmount: Number(discountAmount || 0),
      advanceAdjustment: Number(advanceAdjustment || 0),
      paidAmount: Number(paidAmount || 0),
      remark,
      installmentMonth,
      ...totals,
    });

    // ==========================
    // CREATE WALLET TRANSACTION
    // ==========================
    if (Number(paidAmount) > 0) {
      await Wallet.create({
        type: "credit",
        amount: Number(paidAmount),
        source: "fee",
        referenceId: feeEntry._id,
        description: `Fee payment received from ${student.studentName || student.firstName} (${autoReceiptNo})`,
        createdBy: studentId,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Fee entry saved and wallet transaction recorded",
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
