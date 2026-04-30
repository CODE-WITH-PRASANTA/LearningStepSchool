const mongoose = require("mongoose");
const Fee = require("../models/admissionfee.model");
const Counter = require("../models/counter.model");
const Wallet = require("../models/walletTransaction.model");

exports.collectFee = async (req, res) => {
  try {
    const {
      studentId,
      admissionNo,
      name,
      rollNumber,
      class: className,
      section,
      fees,
      paid,
      discount,
      paymentMethod,
      note,
      date,
    } = req.body;

    if (!studentId || !fees || fees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student and fees are required",
      });
    }

    const totalAmount = fees.reduce((sum, f) => sum + Number(f.amount || 0), 0);

    const discountPercent = Number(discount || 0);
    const discountAmount = (totalAmount * discountPercent) / 100;
    const finalAmount = totalAmount - discountAmount;

    const paidAmount = Number(paid || 0);
    const due = Math.max(finalAmount - paidAmount, 0); // ✅ FIX

    let status = "Paid";
    if (due > 0 && paidAmount > 0) status = "Partial";
    if (paidAmount === 0) status = "Unpaid";

    const counter = await Counter.findOneAndUpdate(
      { name: "receiptNo" },
      { $inc: { value: 1 } },
      { new: true, upsert: true },
    );

    const receiptNo = String(counter.value).padStart(4, "0");

    const fee = await Fee.create({
      receiptNo,
      studentId,
      admissionNo,
      name,
      rollNumber,
      class: className,
      section,
      fees,
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

    // ✅ WALLET CREDIT
    if (paidAmount > 0) {
      await Wallet.create({
        type: "credit",
        amount: paidAmount,
        source: "fee",
        referenceId: fee._id,
        description: `${fee.name} - ${fees[0]?.feeType || "Fee"}`
      });
    }

    res.status(201).json({
      success: true,
      message: "Fee collected successfully",
      data: fee,
    });
  } catch (error) {
    console.log("🔥 ERROR:", error);
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

exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    res.json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateFee = async (req, res) => {
  try {
    const feeId = req.params.id;

    const updatedFee = await Fee.findByIdAndUpdate(feeId, req.body, {
      new: true,
    });

    const walletTx = await Wallet.findOne({ referenceId: feeId });

    if (walletTx) {
      if (req.body.paid !== undefined) {
        walletTx.amount = updatedFee.paid;
      }

      walletTx.description = `Fee from ${updatedFee.name}`;
      walletTx.updatedAt = new Date();

      await walletTx.save();
    }

    res.json({ success: true, data: updatedFee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE FEE ================= */

exports.deleteFee = async (req, res) => {
  try {
    const feeId = req.params.id;

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    await Wallet.deleteOne({ referenceId: feeId });
    await Fee.findByIdAndDelete(feeId);

    res.json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
