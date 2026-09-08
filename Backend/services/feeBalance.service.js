const mongoose = require("mongoose");
const FeeBalance = require("../models/Fee/feeBalance.model");
const FeeEntry = require("../models/Fee/feeEntry.model");
const Student = require("../models/sudentAdmission.model");

// keep your existing helpers + calculateSessionBalance above

const closeStudentAcademicSession = async (
  studentId,
  academicYear
) => {
  if (!studentId || !academicYear) {
    throw new Error("studentId and academicYear are required");
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid studentId");
  }

  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  const balance = await calculateSessionBalance(
    studentId,
    academicYear
  );

  const feeBalance = await FeeBalance.findOneAndUpdate(
    {
      studentId,
      academicYear,
    },
    {
      $set: {
        studentId,
        academicYear,
        totalFee: balance.totalFee,
        totalPaid: balance.totalPaid,
        totalDiscount: balance.totalDiscount,
        closingDue: balance.closingDue,
        isClosed: true,
        closedAt: new Date(),
        isActive: true,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return {
    _id: feeBalance._id,
    studentId: feeBalance.studentId,
    academicYear: feeBalance.academicYear,
    totalFee: feeBalance.totalFee,
    totalPaid: feeBalance.totalPaid,
    totalDiscount: feeBalance.totalDiscount,
    closingDue: feeBalance.closingDue,
    isClosed: feeBalance.isClosed,
    closedAt: feeBalance.closedAt,
    receiptCount: balance.receiptCount,
  };
};

module.exports = {
  calculateSessionBalance,
  closeStudentAcademicSession,
};