const mongoose = require("mongoose");
const Payroll = require("../models/payroll.model");
const Teacher = require("../models/techerModel/createteacher.model");
const Wallet = require("../models/walletTransaction.model");
const TeacherAttendance = require("../models/teacherAttendance.model");
const Leave = require("../models/techerModel/teacherLeve.model");

/* ================= HELPER ================= */
const toUtcDay = (date) => {
  const value = new Date(date);
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
};

const getDateKey = (date) => toUtcDay(date).toISOString().slice(0, 10);
const getAttendanceMonth = (payrollMonth, payrollYear) => {
  let attendanceMonth = payrollMonth - 1;
  let attendanceYear = payrollYear;

  if (attendanceMonth === 0) {
    attendanceMonth = 12;
    attendanceYear -= 1;
  }

  return {
    month: attendanceMonth,
    year: attendanceYear,
  };
};
const getAttendanceSummary = async (teacherId, month, year) => {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
 
  const records = await TeacherAttendance.find({
    teacherId,
    date: { $gte: start, $lte: end },
  }).sort({ date: 1, updatedAt: 1 });

 
  const approvedLeaves = await Leave.find({
    teacher: teacherId,
    status: "approved",
    fromDate: { $lte: end },
    toDate: { $gte: start },
  });

  const attendanceByDate = new Map();
  records.forEach((record) => {
    attendanceByDate.set(getDateKey(record.date), record.status);
  });

  const leaveDates = new Set();
  approvedLeaves.forEach((leaveRecord) => {
    let cursor = toUtcDay(leaveRecord.fromDate);
    const leaveEnd = toUtcDay(leaveRecord.toDate);

    if (cursor < start) cursor = new Date(start);

    while (cursor <= leaveEnd && cursor <= end) {
      const key = getDateKey(cursor);
      const attendanceStatus = attendanceByDate.get(key);

      if (!attendanceStatus || attendanceStatus === "Leave") {
        leaveDates.add(key);
      }

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  });

  let present = 0;
  let leave = 0;
  let explicitAbsent = 0;

  attendanceByDate.forEach((status, key) => {
    if (status === "Present") present++;
    if (status === "Absent") explicitAbsent++;
    if (status === "Leave") {
      leave++;
      leaveDates.delete(key);
    }
  });

  leave += leaveDates.size;
  leave = Math.min(leave, Math.max(totalDays - present, 0));

  const workingDays = present + leave;
  const absent = Math.max(0, totalDays - workingDays);

  return {
    totalDays,
    present,
    leave,
    explicitAbsent,
    workingDays,
    absent,
  };
};

/* ================= SALARY CALCULATION ================= */
const calculateSalary = (
  baseSalary,
  attendanceSummary,
  overtimeHours = 0,
  city = "metro",
) => {
  const { totalDays, workingDays } = attendanceSummary;

  // Pro-rate basic salary based on attendance
  const proratedBasic = (baseSalary / totalDays) * workingDays;

  // HRA (House Rent Allowance) - 50% for metro cities, 40% for others
  const hraRate = city === "metro" ? 0.5 : 0.4;
  const hra = proratedBasic * hraRate;

  // Conveyance Allowance (₹1,600 per month, pro-rated)
  const conveyance = (1600 / totalDays) * workingDays;

  // LTA (Leave Travel Allowance) - 1 month basic salary per year, pro-rated monthly
  const lta = baseSalary / 12;

  // Medical Allowance (₹15,000 per year, pro-rated monthly)
  const medical = 15000 / 12;

  // Gross Salary
  const grossSalary = proratedBasic + hra + conveyance + lta + medical;

  // DEDUCTIONS

  // 1. Provident Fund (12% of basic salary)
  const pf = proratedBasic * 0.12;

  // 2. Professional Tax (varies by state and salary)
  let professionalTax = 0;
  if (proratedBasic > 21000)
    professionalTax = 2352 / 12; // Annual ₹2,352
  else if (proratedBasic > 15000)
    professionalTax = 1152 / 12; // Annual ₹1,152
  else if (proratedBasic > 12000) professionalTax = 552 / 12; // Annual ₹552

  // 3. ESI (Employee State Insurance) - 0.75% for salary < ₹21,000
  const esi = proratedBasic < 21000 ? proratedBasic * 0.0075 : 0;

  // 4. Income Tax calculation (simplified annual calculation, then monthly)
  const annualGross = grossSalary * 12;
  let annualTax = 0;

  if (annualGross > 1000000) {
    annualTax = (annualGross - 1000000) * 0.3 + 112500; // 30% on excess + previous slabs
  } else if (annualGross > 500000) {
    annualTax = (annualGross - 500000) * 0.2 + 12500; // 20% on excess + previous slabs
  } else if (annualGross > 250000) {
    annualTax = (annualGross - 250000) * 0.05; // 5% on excess
  }

  // Standard deduction ₹50,000, HRA exemption, Conveyance exemption ₹19,200
  const exemptions = 50000 + hra * 12 + 19200;
  annualTax = Math.max(0, annualTax - exemptions);
  const monthlyTax = annualTax / 12;

  // 5. Overtime calculation (basic salary / 30 days / 8 hours * 2 * overtime hours)
  const hourlyRate = proratedBasic / 30 / 8;
  const overtimePay = hourlyRate * 2 * overtimeHours;

  // Total Deductions
  const totalDeductions = pf + professionalTax + esi + monthlyTax;

  // Net Salary
  const netSalary = grossSalary - totalDeductions + overtimePay;

  return {
    proratedBasic,
    hra,
    conveyance,
    lta,
    medical,
    grossSalary,
    deductions: {
      pf,
      professionalTax,
      esi,
      incomeTax: monthlyTax,
      total: totalDeductions,
    },
    overtimePay,
    netSalary,
    breakdown: {
      earnings: {
        basic: proratedBasic,
        hra,
        conveyance,
        lta,
        medical,
        overtime: overtimePay,
      },
      deductions: {
        pf,
        professionalTax,
        esi,
        incomeTax: monthlyTax,
      },
    },
  };
};

const calculateModalSalary = (
  baseSalary,
  attendanceSummary,
  payrollInputs = {},
) => {
  const payrollWorkingDays = Math.max(
    Number(payrollInputs.payrollWorkingDays) ||
      attendanceSummary.totalDays ||
      1,
    1,
  );
  const paidDays = Math.min(
    attendanceSummary.workingDays || 0,
    payrollWorkingDays,
  );
  const perDaySalary = (Number(baseSalary) || 0) / payrollWorkingDays;
  const payableBasic = perDaySalary * paidDays;
  const deductionAmount = Number(payrollInputs.deductionAmount) || 0;
  const overtimeHours = Number(payrollInputs.overtimeHours) || 0;
  const overtimeRate = Number(payrollInputs.overtimeRate) || 0;
  const allowance = Number(payrollInputs.allowance) || 0;
  const otherDeduction = Number(payrollInputs.otherDeduction) || 0;
  const overtimePay = overtimeHours * overtimeRate;
  const grossSalary = payableBasic + allowance;
  const totalDeductions = deductionAmount + otherDeduction;
  const netSalary = Math.max(0, grossSalary + overtimePay - totalDeductions);

  return {
    payrollWorkingDays,
    paidDays,
    absentDays: Math.max(0, payrollWorkingDays - paidDays),
    perDaySalary,
    payableBasic,
    allowance,
    overtimePay,
    grossSalary,
    deductions: {
      monthlyDeduction: deductionAmount,
      otherDeduction,
      total: totalDeductions,
    },
    netSalary,
    breakdown: {
      earnings: {
        basic: payableBasic,
        hra: 0,
        conveyance: 0,
        lta: 0,
        medical: 0,
        overtime: overtimePay,
        allowance,
      },
      deductions: {
        pf: 0,
        professionalTax: 0,
        esi: 0,
        incomeTax: 0,
        monthlyDeduction: deductionAmount,
        otherDeduction,
      },
    },
  };
};

/* ================= CREATE PAYROLL ================= */
exports.createPayroll = async (req, res) => {
  try {
    let {
      teacherId,
      year,
      baseSalary,
      payrollWorkingDays,
      deductionAmount,
      overtimeHours,
      overtimeRate,
      allowance,
      otherDeduction,
      payDate,
      notes,
      city,
    } = req.body;

    if (!teacherId || !year || !baseSalary) {
      return res.status(400).json({
        message: "teacherId, year and baseSalary are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        message: "Invalid teacherId",
      });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // Check duplicate yearly payroll
    const exists = await Payroll.findOne({
      teacherId,
      year,
    });

    if (exists) {
      return res.status(400).json({
        message: "Payroll already generated for this year.",
      });
    }

    baseSalary = Number(baseSalary) || 0;
    payrollWorkingDays = Number(payrollWorkingDays) || 30;
    deductionAmount = Number(deductionAmount) || 0;
    overtimeHours = Number(overtimeHours) || 0;
    overtimeRate = Number(overtimeRate) || 0;
    allowance = Number(allowance) || 0;
    otherDeduction = Number(otherDeduction) || 0;
    city = city || "metro";

    const payrolls = [];

    for (let month = 1; month <= 12; month++) {
      const payroll = await Payroll.create({
        teacherId,

        month,

        year,

        totalDays: payrollWorkingDays,

        workingDays: 0,

        presentDays: 0,

        leaveDays: 0,

        absentDays: 0,

        baseSalary,

        payrollWorkingDays,

        deductionAmount,

        overtimeHours,

        overtimeRate,

        overtimeAmount: 0,

        allowance,

        otherDeduction,

        grossSalary: 0,

        totalDeductions: 0,

        totalSalary: 0,

        city,

        payDate,

        notes: notes || "",

        salaryBreakdown: {
          earnings: {
            basic: 0,
            hra: 0,
            conveyance: 0,
            lta: 0,
            medical: 0,
            overtime: 0,
          },
          deductions: {
            pf: 0,
            professionalTax: 0,
            esi: 0,
            incomeTax: 0,
          },
        },

        status: "Pending",
      });

      payrolls.push(payroll);
    }

    res.status(201).json({
      success: true,
      message: "Yearly payroll generated successfully.",
      count: payrolls.length,
      data: payrolls,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Payroll already exists.",
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

    const filter = {};

    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (status) filter.status = status;

    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) {
      filter.teacherId = teacherId;
    }

    const payrolls = await Payroll.find(filter)
      .populate("teacherId", "name department email image")
      .sort({
        year: -1,
        month: 1,
      });

    const payrollData = [];

    for (const payroll of payrolls) {
      // If salary already paid, return stored values
      if (payroll.status === "Completed") {
        payrollData.push(payroll);

        continue;
      }

      // Calculate attendance of selected month
      const attendance = getAttendanceMonth(payroll.month, payroll.year);

      const summary = await getAttendanceSummary(
        payroll.teacherId._id,
        attendance.month,
        attendance.year,
      );

      // Calculate salary
      const salaryCalculation = calculateModalSalary(
        payroll.baseSalary,
        summary,
        {
          payrollWorkingDays: payroll.payrollWorkingDays,
          deductionAmount: payroll.deductionAmount,
          overtimeHours: payroll.overtimeHours,
          overtimeRate: payroll.overtimeRate,
          allowance: payroll.allowance,
          otherDeduction: payroll.otherDeduction,
        },
      );

      // Convert mongoose document to object
      const item = payroll.toObject();

      item.totalDays = salaryCalculation.payrollWorkingDays;
      item.workingDays = salaryCalculation.paidDays;

      item.presentDays = summary.present;
      item.leaveDays = summary.leave;
      item.absentDays = salaryCalculation.absentDays;

      item.overtimeAmount = salaryCalculation.overtimePay;

      item.grossSalary = salaryCalculation.grossSalary;

      item.totalDeductions = salaryCalculation.deductions.total;

      item.totalSalary = salaryCalculation.netSalary;

      item.salaryBreakdown = salaryCalculation.breakdown;

      payrollData.push(item);
    }

    res.json({
      success: true,
      count: payrollData.length,
      data: payrollData,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
/* ================= UPDATE PAYROLL ================= */
exports.updatePayroll = async (req, res) => {
  try {
    const {
      status,
      paymentMode,
      payDate,
      notes,
      baseSalary,
      payrollWorkingDays,
      deductionAmount,
      overtimeHours,
      overtimeRate,
      allowance,
      otherDeduction,
      city,
    } = req.body;

    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll not found",
      });
    }

    // update editable fields

    if (baseSalary !== undefined) payroll.baseSalary = Number(baseSalary);

    if (payrollWorkingDays !== undefined)
      payroll.payrollWorkingDays = Number(payrollWorkingDays);

    if (deductionAmount !== undefined)
      payroll.deductionAmount = Number(deductionAmount);

    if (overtimeHours !== undefined)
      payroll.overtimeHours = Number(overtimeHours);

    if (overtimeRate !== undefined) payroll.overtimeRate = Number(overtimeRate);

    if (allowance !== undefined) payroll.allowance = Number(allowance);

    if (otherDeduction !== undefined)
      payroll.otherDeduction = Number(otherDeduction);

    if (city !== undefined) payroll.city = city;

    // ALWAYS calculate attendance

    const attendance = getAttendanceMonth(payroll.month, payroll.year);

    const summary = await getAttendanceSummary(
      payroll.teacherId,
      attendance.month,
      attendance.year,
    );

    const salaryCalculation = calculateModalSalary(
      payroll.baseSalary,
      summary,
      {
        payrollWorkingDays: payroll.payrollWorkingDays,
        deductionAmount: payroll.deductionAmount,
        overtimeHours: payroll.overtimeHours,
        overtimeRate: payroll.overtimeRate,
        allowance: payroll.allowance,
        otherDeduction: payroll.otherDeduction,
      },
    );

    payroll.totalDays = salaryCalculation.payrollWorkingDays;
    payroll.workingDays = salaryCalculation.paidDays;
    payroll.presentDays = summary.present;
    payroll.leaveDays = summary.leave;
    payroll.absentDays = salaryCalculation.absentDays;

    payroll.overtimeAmount = salaryCalculation.overtimePay;
    payroll.grossSalary = salaryCalculation.grossSalary;
    payroll.totalDeductions = salaryCalculation.deductions.total;
    payroll.totalSalary = salaryCalculation.netSalary;
    payroll.salaryBreakdown = salaryCalculation.breakdown;

    // now update payment information

    if (status) payroll.status = status;

    if (paymentMode !== undefined) payroll.paymentMode = paymentMode;

    if (payDate !== undefined) payroll.payDate = payDate;

    if (notes !== undefined) payroll.notes = notes;

    await payroll.save();

    // Wallet

    if (payroll.status === "Completed") {
      const wallet = await Wallet.findOne({
        referenceId: payroll._id,
        source: "payroll",
      });

      if (!wallet) {
        await Wallet.create({
          type: "debit",
          amount: payroll.totalSalary,
          source: "payroll",
          referenceId: payroll._id,
          description: `Payroll ${payroll.month}/${payroll.year}`,
          createdBy: req.user?.id || "Admin",
        });
      } else {
        wallet.amount = payroll.totalSalary;
        await wallet.save();
      }
    }

    res.json({
      success: true,
      data: payroll,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
/* ================= BULK PAY ================= */

exports.bulkPayPayrolls = async (req, res) => {
  try {
    const { ids, paymentMode, paymentDate, note } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        message: "No payroll selected.",
      });
    }

    const payrolls = await Payroll.find({
      _id: { $in: ids },
    });

    for (const payroll of payrolls) {
      // Ignore already completed payrolls
      if (payroll.status === "Completed") {
        continue;
      }

      payroll.status = "Completed";
      payroll.paymentMode = paymentMode;
      payroll.payDate = paymentDate;
      payroll.notes = note || "";

      await payroll.save();

      // Wallet Entry

      const wallet = await Wallet.findOne({
        referenceId: payroll._id,
        source: "payroll",
      });

      if (!wallet) {
        await Wallet.create({
          type: "debit",
          amount: payroll.totalSalary,
          source: "payroll",
          referenceId: payroll._id,
          description: `Payroll ${payroll.month}/${payroll.year}`,
          createdBy: req.user?.id || "Admin",
        });
      } else {
        wallet.amount = payroll.totalSalary;
        wallet.updatedAt = new Date();

        await wallet.save();
      }
    }

    res.json({
      success: true,

      message: "Bulk payment completed.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
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
