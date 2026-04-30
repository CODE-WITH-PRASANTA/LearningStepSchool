const mongoose = require("mongoose");
const Payroll = require("../models/payroll.model");
const Teacher = require("../models/techerModel/createteacher.model");
const Wallet = require("../models/walletTransaction.model");

/* ================= CREATE PAYROLL ================= */
exports.createPayroll = async (req, res) => {
  try {
    let {
      teacherId,
      month,
      year,
      totalDays,
      workingDays,
      baseSalary,
      overtimeAmount,
      status,
    } = req.body;

    // 🔥 VALIDATION
    if (!teacherId || !month || !year || !baseSalary) {
      return res.status(400).json({
        message: "teacherId, month, year, baseSalary are required",
      });
    }

    // 🔥 ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacherId" });
    }

    // 🔥 Check teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // 🔥 Safe numbers
    baseSalary = Number(baseSalary) || 0;
    overtimeAmount = Number(overtimeAmount) || 0;
    totalDays = Number(totalDays) || 0;
    workingDays = Number(workingDays) || 0;

    const totalSalary = baseSalary + overtimeAmount;

    const payroll = new Payroll({
      teacherId,
      month,
      year,
      totalDays,
      workingDays,
      baseSalary,
      overtimeAmount,
      totalSalary,
      status: status || "Pending",
    });

    await payroll.save();

    // 💰 Wallet credit
    if (payroll.status === "Completed") {
      await Wallet.create({
        type: "debit",
        amount: totalSalary,
        source: "payroll",
        referenceId: payroll._id,
        description: `Payroll for ${month}/${year}`,
        createdBy: req.user?.id || "Admin",
      });
    }

    res.status(201).json({
      success: true,
      data: payroll,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Payroll already exists for this teacher, month, and year",
      });
    }

    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= GET ALL PAYROLLS ================= */
exports.getPayrolls = async (req, res) => {
  try {
    const { month, year, status, teacherId } = req.query;

    let filter = {};

    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (status) filter.status = status;
    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) {
      filter.teacherId = teacherId;
    }

    const payrolls = await Payroll.find(filter)
      .populate("teacherId", "name department email image")
      .sort({ year: -1, month: -1, createdAt: -1 });

    res.json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE PAYROLL ================= */
exports.updatePayroll = async (req, res) => {
  try {
    const { status, ...updateData } = req.body;

    // 🔥 Safe number handling
    if (updateData.baseSalary !== undefined) {
      updateData.baseSalary = Number(updateData.baseSalary);
    }
    if (updateData.overtimeAmount !== undefined) {
      updateData.overtimeAmount = Number(updateData.overtimeAmount);
    }

    // 🔥 Recalculate salary
    if (
      updateData.baseSalary !== undefined ||
      updateData.overtimeAmount !== undefined
    ) {
      updateData.totalSalary =
        (updateData.baseSalary || 0) +
        (updateData.overtimeAmount || 0);
    }

    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { ...updateData, status },
      { new: true, runValidators: true }
    ).populate("teacherId", "name department email image");

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    // 💰 Wallet logic (FIXED)
    if (status === "Completed") {
      const existingTx = await Wallet.findOne({
        referenceId: payroll._id,
        source: "payroll",
      });

      if (!existingTx) {
        // ✅ CREATE
        await Wallet.create({
          type: "debit",
          amount: payroll.totalSalary,
          source: "payroll",
          referenceId: payroll._id,
          description: `Payroll for ${payroll.month}/${payroll.year}`,
          createdBy: req.user?.id || "Admin",
        });
      } else {
        // 🔥 UPDATE EXISTING (IMPORTANT FIX)
        existingTx.amount = payroll.totalSalary;
        existingTx.updatedAt = new Date();
        await existingTx.save();
      }
    } else if (status === "Reject" || status === "Pending") {
      // ❌ REMOVE TRANSACTION
      await Wallet.findOneAndDelete({
        referenceId: payroll._id,
        type: "debit",
        source: "payroll",
      });
    }

    res.json({
      success: true,
      data: payroll,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ================= DELETE PAYROLL ================= */
exports.deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    await Wallet.findOneAndDelete({
      referenceId: payroll._id,
     type: "debit",
      source: "payroll",
    });

    res.json({
      success: true,
      message: "Payroll deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
