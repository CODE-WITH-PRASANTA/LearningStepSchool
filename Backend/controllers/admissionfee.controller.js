const Fee = require("../models/admissionfee.model");

/* ================= COLLECT FEE ================= */



exports.collectFee = async (req, res) => {
  try {
    const {
      studentId,
      admissionNo,
      name,
      rollNumber,
      class: className,
      section,
      amount,
      paid,
      discount,
      paymentMethod,
      note,
      feeType,
      date,
    } = req.body;

    // ✅ VALIDATION
    if (!studentId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Student and amount are required",
      });
    }

    const totalAmount = Number(amount || 0);
    const paidAmount = Number(paid || 0);
    const discountPercent = Number(discount || 0);

    // ✅ APPLY DISCOUNT FIRST
    const discountAmount = (totalAmount * discountPercent) / 100;
    const finalAmount = totalAmount - discountAmount;

    // ✅ CORRECT DUE
    const due = finalAmount - paidAmount;

    // ✅ AUTO STATUS
    let status = "Paid";
    if (due > 0 && paidAmount > 0) status = "Partial";
    if (paidAmount === 0) status = "Unpaid";

    const fee = new Fee({
      studentId,
      admissionNo,
      name,
      rollNumber,
      class: className,
      section,

      amount: totalAmount,     // ✅ FULL AMOUNT
      paid: paidAmount,        // ✅ ACTUAL PAID
      due,                     // ✅ CORRECT DUE

      discount: discountPercent,
      paymentMethod,
      note,

      feeType,
      date,
      status,
    });

    await fee.save();

    res.status(201).json({
      success: true,
      message: "Fee collected successfully",
      data: fee,
    });

  } catch (error) {
    console.log("🔥 COLLECT FEE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ================= GET FEES ================= */

exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: fees,
    });
  } catch (error) {
    console.log("🔥 GET FEES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE FEE ================= */

exports.deleteFee = async (req, res) => {
  try {
    const feeId = req.params.id;

    const deletedFee = await Fee.findByIdAndDelete(feeId);

    if (!deletedFee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    res.json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    console.log("🔥 DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};