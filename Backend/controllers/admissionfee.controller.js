
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
      amount,
      paid,
      discount,
      paymentMethod,
      note,
      feeType,
      date,
    } = req.body;

    if (!studentId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Student and amount are required",
      });
    }

    const totalAmount = Number(amount || 0);
    const paidAmount = Number(paid || 0);
    const discountPercent = Number(discount || 0);

    const discountAmount = (totalAmount * discountPercent) / 100;
    const finalAmount = totalAmount - discountAmount;

    const due = finalAmount - paidAmount;

    let status = "Paid";
    if (due > 0 && paidAmount > 0) status = "Partial";
    if (paidAmount === 0) status = "Unpaid";

    // 🔥 ORDER-WISE RECEIPT NUMBER (ATOMIC)
    const counter = await Counter.findOneAndUpdate(
      { name: "receiptNo" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    // 🔥 4 DIGIT FORMAT
    const receiptNo = String(counter.value).padStart(4, "0");

    const fee = new Fee({
      receiptNo, // ✅ IMPORTANT

      studentId,
      admissionNo,
      name,
      rollNumber,
      class: className,
      section,

      amount: totalAmount,
      paid: paidAmount,
      due,

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