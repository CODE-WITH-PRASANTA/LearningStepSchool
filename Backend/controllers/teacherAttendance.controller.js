const Attendance = require("../models/teacherAttendance.model");
const mongoose = require("mongoose");

const {
  SHIFT_START_HOUR,
  SHIFT_START_MINUTE,
  SHIFT_END_HOUR,
  SHIFT_END_MINUTE,
  LATE_AFTER_MINUTES,
  HALF_DAY_HOUR,
  HALF_DAY_MINUTE,
  WORKING_HOURS,
} = require("../config/attendanceConfig");

/* ================= MARK ATTENDANCE ================= */

/* ================= PUNCH IN ================= */

exports.punchIn = async (req, res) => {
  try {
    const teacherId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Teacher",
      });
    }

    const now = new Date();

    // Today's Date
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let attendance = await Attendance.findOne({
      teacherId,
      date: today,
    });

    // Already punched in
    if (attendance && attendance.punchIn) {
      return res.status(400).json({
        success: false,
        message: "Already punched in today.",
      });
    }

    // Shift Start
    const shiftStart = new Date(today);
    shiftStart.setHours(SHIFT_START_HOUR, SHIFT_START_MINUTE, 0, 0);

    // Half Day Time
    const halfDay = new Date(today);
    halfDay.setHours(HALF_DAY_HOUR, HALF_DAY_MINUTE, 0, 0);

    let status = "Present";
    let lateMinutes = 0;

    if (now > halfDay) {
      status = "Half Day";
    } else if (now > shiftStart) {
      lateMinutes = Math.floor((now - shiftStart) / 60000);

      if (lateMinutes >= LATE_AFTER_MINUTES) {
        status = "Late";
      }
    }

    if (!attendance) {
      attendance = new Attendance({
        teacherId,
        date: today,
      });
    }

    attendance.punchIn = now;
    attendance.status = status;
    attendance.lateMinutes = lateMinutes;

    attendance.activities.push({
      type: "Punch In",
      time: now,
    });

    await attendance.save();

    res.json({
      success: true,
      message: "Punch In Successful",
      data: attendance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= BREAK START ================= */

exports.breakStart = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const reason = (req.body && req.body.reason) || "";

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const attendance = await Attendance.findOne({
      teacherId,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Please Punch In first.",
      });
    }

    if (!attendance.punchIn) {
      return res.status(400).json({
        success: false,
        message: "Please Punch In first.",
      });
    }

    if (attendance.punchOut) {
      return res.status(400).json({
        success: false,
        message: "Already Punched Out.",
      });
    }

    // Check if previous break is still open
    const lastBreak =
      attendance.breaks.length > 0
        ? attendance.breaks[attendance.breaks.length - 1]
        : null;

    if (lastBreak && !lastBreak.end) {
      return res.status(400).json({
        success: false,
        message: "Previous break is still running.",
      });
    }

    attendance.breaks.push({
      start: now,
      end: null,
      durationSeconds: 0,
      reason,
    });

    attendance.activities.push({
      type: "Break Start",
      time: now,
    });

    await attendance.save();

    res.json({
      success: true,
      message: "Break Started Successfully",
      data: attendance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* ================= BREAK END ================= */

exports.breakEnd = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const attendance = await Attendance.findOne({
      teacherId,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found.",
      });
    }

    if (!attendance.punchIn) {
      return res.status(400).json({
        success: false,
        message: "Please Punch In first.",
      });
    }

    if (attendance.punchOut) {
      return res.status(400).json({
        success: false,
        message: "Already Punched Out.",
      });
    }

    // No breaks found
    if (attendance.breaks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No break found.",
      });
    }

    // Last Break
    const currentBreak =
      attendance.breaks[attendance.breaks.length - 1];

    // Already ended
    if (currentBreak.end) {
      return res.status(400).json({
        success: false,
        message: "Current break already ended.",
      });
    }

    // End break
    currentBreak.end = now;

    // Calculate break duration
    const seconds = Math.floor(
      (currentBreak.end - currentBreak.start) / 1000
    );

    currentBreak.durationSeconds = seconds;

    // Add to total break time
    attendance.breakSeconds += seconds;

    // Activity
    attendance.activities.push({
      type: "Break End",
      time: now,
    });

    await attendance.save();

    res.json({
      success: true,
      message: "Break Ended Successfully",
      data: attendance,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

/* ================= PUNCH OUT ================= */

exports.punchOut = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const attendance = await Attendance.findOne({
      teacherId,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Punch In not found.",
      });
    }

    if (!attendance.punchIn) {
      return res.status(400).json({
        success: false,
        message: "Please Punch In first.",
      });
    }

    if (attendance.punchOut) {
      return res.status(400).json({
        success: false,
        message: "Already punched out.",
      });
    }

    attendance.punchOut = now;

    // Work Seconds
    const totalSeconds = Math.floor(
      (attendance.punchOut - attendance.punchIn) / 1000,
    );

    attendance.workSeconds = totalSeconds - attendance.breakSeconds;

    if (attendance.workSeconds < 0) {
      attendance.workSeconds = 0;
    }

    // Overtime
    const requiredSeconds = WORKING_HOURS * 60 * 60;

    attendance.overtimeSeconds = Math.max(
      attendance.workSeconds - requiredSeconds,
      0,
    );

    // Early Leaving
    const shiftEnd = new Date(today);

    shiftEnd.setHours(SHIFT_END_HOUR, SHIFT_END_MINUTE, 0, 0);

    if (attendance.punchOut < shiftEnd) {
      attendance.earlyLeavingMinutes = Math.floor(
        (shiftEnd - attendance.punchOut) / 60000,
      );
    }

    attendance.activities.push({
      type: "Punch Out",

      time: now,
    });

    await attendance.save();

    res.json({
      success: true,

      message: "Punch Out Successful",

      data: attendance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

/* ================= TODAY ATTENDANCE ================= */

exports.getTodayAttendance = async (req, res) => {
  try {

    const teacherId = req.user.id;

    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const attendance = await Attendance.findOne({
      teacherId,
      date: today,
    });

    if (!attendance) {

      return res.json({

        success: true,

        isPunchedIn: false,

        isOnBreak: false,

        attendance: null,

      });

    }

    // Current Break
    const lastBreak =
      attendance.breaks.length > 0
        ? attendance.breaks[attendance.breaks.length - 1]
        : null;

    const isOnBreak =
      lastBreak &&
      lastBreak.start &&
      !lastBreak.end;

    const isPunchedIn =
      attendance.punchIn &&
      !attendance.punchOut;

    res.json({

      success: true,

      isPunchedIn,

      isOnBreak,

      attendance,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};

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
    const utcDate = new Date(
      Date.UTC(
        dateObj.getUTCFullYear(),
        dateObj.getUTCMonth(),
        dateObj.getUTCDate(),
      ),
    );

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

exports.getAttendanceHistory = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const { period = "this-month", search = "" } = req.query;

    let startDate = new Date();

    if (period === "this-week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "three-months") {
      startDate.setMonth(startDate.getMonth() - 3);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const filter = {
      teacherId,
      date: {
        $gte: startDate,
      },
    };

    if (search) {
      filter.status = {
        $regex: search,
        $options: "i",
      };
    }

    const history = await Attendance.find(filter)
      .sort({ date: -1 });

    res.json({
      success: true,
      count: history.length,
      data: history,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

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
    const utcDate = new Date(
      Date.UTC(
        dateObj.getUTCFullYear(),
        dateObj.getUTCMonth(),
        dateObj.getUTCDate(),
      ),
    );

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
