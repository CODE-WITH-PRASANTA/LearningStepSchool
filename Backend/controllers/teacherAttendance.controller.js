const Attendance = require("../models/teacherAttendance.model");
const mongoose = require("mongoose");

/* ================= MARK ATTENDANCE ================= */
// Admin or teacher marks Present/Absent
exports.markAttendance = async (req, res) => {
  try {
    const { date, status } = req.body;
    const teacherId = req.user.id;

    if (!date || !status) {
      return res.status(400).json({
        message: "date and status required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacherId" });
    }

    // Normalize date to UTC midnight
    const dateObj = new Date(date);
    const utcDate = new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate()));

    const attendance = await Attendance.findOneAndUpdate(
      {
        teacherId,
        date: utcDate,
      },
      {
        teacherId,
        date: utcDate,
        status,
      },
      { upsert: true, new: true },
    );

    res.json({
      success: true,
      data: attendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    const teacherId = req.user.id;

    if (!month || !year) {
      return res.status(400).json({
        message: "month and year required",
      });
    }

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    const records = await Attendance.find({
      teacherId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendanceSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const teacherId = req.user.id;
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    const records = await Attendance.find({
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

    res.json({
      success: true,
      summary: {
        totalDays,
        present,
        leave,
        workingDays,
        absent: totalDays - workingDays,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;

    let filter = {};

    if (month && year) {
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));

      filter.date = { $gte: start, $lte: end };
    }

    const data = await Attendance.find(filter)
      .populate("teacherId", "name department email image")
      .sort({ date: -1 });

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= MARK ATTENDANCE BY ADMIN ================= */
exports.markAttendanceByAdmin = async (req, res) => {
  try {
    const { teacherId, date, status } = req.body;

    if (!teacherId || !date || !status) {
      return res.status(400).json({
        message: "teacherId, date and status required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacherId" });
    }

    // Normalize date to UTC midnight
    const dateObj = new Date(date);
    const utcDate = new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate()));

    const attendance = await Attendance.findOneAndUpdate(
      {
        teacherId,
        date: utcDate,
      },
      {
        teacherId,
        date: utcDate,
        status,
      },
      { upsert: true, new: true },
    );

    res.json({
      success: true,
      data: attendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
