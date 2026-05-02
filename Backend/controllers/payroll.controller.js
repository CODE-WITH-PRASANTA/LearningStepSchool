const mongoose = require("mongoose");
const Payroll = require("../models/payroll.model");
const Teacher = require("../models/techerModel/createteacher.model");
const Wallet = require("../models/walletTransaction.model");
const TeacherAttendance = require("../models/teacherAttendance.model");

/* ================= HELPER ================= */
const getAttendanceSummary = async (teacherId, month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const records = await TeacherAttendance.find({
    teacherId,
    date: { $gte: start, $lte: end },
  });

  let present = 0;
  let leave = 0;

  records.forEach((r) => {
    if (r.status === "Present") present++;
    if (r.status === "Leave") leave++;
  });

  const totalDays = end.getDate();
  const workingDays = present + leave;

  return {
    totalDays,
    workingDays,
    absent: totalDays - workingDays,
  };
};

/* ================= SALARY CALCULATION ================= */
const calculateSalary = (baseSalary, attendanceSummary, overtimeHours = 0, city = 'metro') => {
  const { totalDays, workingDays } = attendanceSummary;

  // Pro-rate basic salary based on attendance
  const proratedBasic = (baseSalary / totalDays) * workingDays;

  // HRA (House Rent Allowance) - 50% for metro cities, 40% for others
  const hraRate = city === 'metro' ? 0.5 : 0.4;
  const hra = proratedBasic * hraRate;

  // Conveyance Allowance (₹1,600 per month, pro-rated)
  const conveyance = (1600 / totalDays) * workingDays;

  // LTA (Leave Travel Allowance) - 1 month basic salary per year, pro-rated monthly
  const lta = (baseSalary / 12);

  // Medical Allowance (₹15,000 per year, pro-rated monthly)
  const medical = (15000 / 12);

  // Gross Salary
  const grossSalary = proratedBasic + hra + conveyance + lta + medical;

  // DEDUCTIONS

  // 1. Provident Fund (12% of basic salary)
  const pf = proratedBasic * 0.12;

  // 2. Professional Tax (varies by state and salary)
  let professionalTax = 0;
  if (proratedBasic > 21000) professionalTax = 2352 / 12; // Annual ₹2,352
  else if (proratedBasic > 15000) professionalTax = 1152 / 12; // Annual ₹1,152
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
  const exemptions = 50000 + (hra * 12) + 19200;
  annualTax = Math.max(0, annualTax - exemptions);
  const monthlyTax = annualTax / 12;

  // 5. Overtime calculation (basic salary / 30 days / 8 hours * 2 * overtime hours)
  const hourlyRate = (proratedBasic / 30) / 8;
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
      total: totalDeductions
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
        overtime: overtimePay
      },
      deductions: {
        pf,
        professionalTax,
        esi,
        incomeTax: monthlyTax
      }
    }
  };
};

/* ================= CREATE PAYROLL ================= */
exports.createPayroll = async (req, res) => {
  try {
    let { teacherId, month, year, baseSalary, overtimeHours, city, status } = req.body;

    if (!teacherId || !month || !year || !baseSalary) {
      return res.status(400).json({
        message: "teacherId, month, year, baseSalary are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacherId" });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    baseSalary = Number(baseSalary) || 0;
    overtimeHours = Number(overtimeHours) || 0;
    city = city || 'metro'; // Default to metro city

    // 🔥 ATTENDANCE CALCULATION
    const summary = await getAttendanceSummary(teacherId, month, year);

    // 🔥 INDUSTRY-STANDARD SALARY CALCULATION
    const salaryCalculation = calculateSalary(baseSalary, summary, overtimeHours, city);

    const payroll = new Payroll({
      teacherId,
      month,
      year,
      totalDays: summary.totalDays,
      workingDays: summary.workingDays,
      baseSalary,
      overtimeAmount: salaryCalculation.overtimePay,
      totalSalary: salaryCalculation.netSalary,
      status: status || "Pending",
      salaryBreakdown: salaryCalculation.breakdown,
      grossSalary: salaryCalculation.grossSalary,
      totalDeductions: salaryCalculation.deductions.total,
    });

    await payroll.save();

    // 💰 Wallet (DEBIT) - Only net salary
    if (payroll.status === "Completed") {
      await Wallet.create({
        type: "debit",
        amount: salaryCalculation.netSalary,
        source: "payroll",
        referenceId: payroll._id,
        description: `Payroll for ${month}/${year}`,
        createdBy: req.user?.id || "Admin",
      });
    }

    res.status(201).json({
      success: true,
      data: payroll,
      attendance: summary,
      salaryCalculation,
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
    const { status, baseSalary, overtimeHours, city, ...updateData } = req.body;

    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    // Update base salary if provided
    if (baseSalary !== undefined) {
      payroll.baseSalary = Number(baseSalary);
    }

    // Update overtime if provided
    if (overtimeHours !== undefined) {
      payroll.overtimeHours = Number(overtimeHours);
    }

    // Update city if provided
    if (city !== undefined) {
      payroll.city = city;
    }

    // Apply other updates
    Object.assign(payroll, updateData);

    if (status) payroll.status = status;

    // 🔥 RECALCULATE SALARY WITH INDUSTRY STANDARDS
    const summary = await getAttendanceSummary(
      payroll.teacherId,
      payroll.month,
      payroll.year
    );

    const salaryCalculation = calculateSalary(
      payroll.baseSalary,
      summary,
      payroll.overtimeHours || 0,
      payroll.city || 'metro'
    );

    // Update calculated fields
    payroll.totalDays = summary.totalDays;
    payroll.workingDays = summary.workingDays;
    payroll.overtimeAmount = salaryCalculation.overtimePay;
    payroll.totalSalary = salaryCalculation.netSalary;
    payroll.salaryBreakdown = salaryCalculation.breakdown;
    payroll.grossSalary = salaryCalculation.grossSalary;
    payroll.totalDeductions = salaryCalculation.deductions.total;

    await payroll.save();

    // 💰 Wallet logic
    if (payroll.status === "Completed") {
      const existingTx = await Wallet.findOne({
        referenceId: payroll._id,
        source: "payroll",
      });

      if (!existingTx) {
        await Wallet.create({
          type: "debit",
          amount: payroll.totalSalary,
          source: "payroll",
          referenceId: payroll._id,
          description: `Payroll for ${payroll.month}/${payroll.year}`,
          createdBy: req.user?.id || "Admin",
        });
      } else {
        existingTx.amount = payroll.totalSalary;
        existingTx.updatedAt = new Date();
        await existingTx.save();
      }
    } else if (payroll.status === "Reject" || payroll.status === "Pending") {
      await Wallet.findOneAndDelete({
        referenceId: payroll._id,
        type: "debit",
        source: "payroll",
      });
    }

    res.json({
      success: true,
      data: payroll,
      attendance: summary,
      salaryCalculation,
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