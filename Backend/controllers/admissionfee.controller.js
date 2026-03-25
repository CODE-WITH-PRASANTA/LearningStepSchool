
const Fee = require("../models/admissionfee.model");
const Counter = require("../models/counter.model");


exports.collectFee = async (req, res) => {
  try {
    const {
      studentId,
      admissionNo,
      name,
      rollNumber,
      class: className,
      section,

      fees, // 🔥 NEW (array)

      paid,
      discount,
      paymentMethod,
      note,
      date,
    } = req.body;

    // ✅ VALIDATION
    if (!studentId || !fees || fees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student and fees are required",
      });
    }

    // 🔥 TOTAL CALCULATION
    const totalAmount = fees.reduce(
      (sum, f) => sum + Number(f.amount || 0),
      0
    );

    const discountPercent = Number(discount || 0);
    const discountAmount = (totalAmount * discountPercent) / 100;

    const finalAmount = totalAmount - discountAmount;

    const paidAmount = Number(paid || 0);
    const due = finalAmount - paidAmount;

    // 🔥 STATUS
    let status = "Paid";
    if (due > 0 && paidAmount > 0) status = "Partial";
    if (paidAmount === 0) status = "Unpaid";

    // 🔥 RECEIPT NUMBER (FIXED INCREMENT)
    const counter = await Counter.findOneAndUpdate(
      { name: "receiptNo" },
      { $inc: { value: 1 } }, // ✅ FIX (not 1000)
      { new: true, upsert: true }
    );

    const receiptNo = String(counter.value).padStart(4, "0");

    // 🔥 SAVE
    const fee = new Fee({
      receiptNo,

      studentId,
      admissionNo,
      name,
      rollNumber,
      class: className,
      section,

      fees, // ✅ IMPORTANT

      totalAmount,
      discount: discountPercent,
      finalAmount,

      paid: paidAmount,
      due,

      paymentMethod,
      note,
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
    const fees = await Fee.find().sort({ receiptNo: -1 }); // 🔥 IMPORTANT

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