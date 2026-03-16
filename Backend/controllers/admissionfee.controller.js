const Fee = require("../models/admissionfee.model");

/* ================= COLLECT FEE ================= */

exports.collectFee = async (req, res) => {
  try {

    const {
      studentId,
      admissionNo,
      name,
      rollNumber,
      className,
      section,
      amount,
      paid,
      discount,
      paymentMethod,
      note,
      date
    } = req.body;

    const totalAmount = Number(amount || 0);
    const paidAmount = Number(paid || 0);
    const discountPercent = Number(discount || 0);

    const due = totalAmount - paidAmount;

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
      amount: totalAmount,
      paid: paidAmount,
      due,
      discount: discountPercent,
      paymentMethod,
      note,
      date,
      status
    });

    await fee.save();

    res.json({
      success: true,
      message: "Fee collected successfully",
      data: fee
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
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
        message: "Fee not found"
      });
    }

    res.json({
      success: true,
      message: "Fee deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};