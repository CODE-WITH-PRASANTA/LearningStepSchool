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
const ATTENDANCE_LOCATION = require("../config/attendanceLocation");

const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371000;

  const toRadians = (degree) => degree * (Math.PI / 180);

  const latitudeDifference = toRadians(lat2 - lat1);

  const longitudeDifference = toRadians(lon2 - lon1);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const validateAttendanceLocation = (latitude, longitude) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return {
      valid: false,
      message: "Current location is required.",
    };
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return {
      valid: false,
      message: "Invalid location coordinates.",
    };
  }

  const distance = calculateDistanceInMeters(
    lat,
    lng,
    ATTENDANCE_LOCATION.latitude,
    ATTENDANCE_LOCATION.longitude,
  );

  if (distance > ATTENDANCE_LOCATION.radiusMeters) {
    return {
      valid: false,
      distance,
      message: `You are ${Math.round(
        distance,
      )} meters away from the attendance location.`,
    };
  }

  return {
    valid: true,
    distance,
  };
};

/* =========================================================
   DATE HELPERS
========================================================= */

const INDIA_TIME_ZONE = "Asia/Kolkata";

/*
  Get Indian calendar date.

  Example:
  13 July India
  =>
  {
    year: 2026,
    month: 7,
    day: 13
  }
*/

const getIndiaDateParts = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const getValue = (type) => parts.find((item) => item.type === type)?.value;

  return {
    year: Number(getValue("year")),
    month: Number(getValue("month")),
    day: Number(getValue("day")),
  };
};

/*
  Logical attendance date.

  Indian July 13
  =>
  2026-07-13T00:00:00.000Z
*/

const getAttendanceDate = (date = new Date()) => {
  const { year, month, day } = getIndiaDateParts(date);

  return new Date(Date.UTC(year, month - 1, day));
};

/*
  Convert YYYY-MM-DD input to UTC logical date.
*/

const normalizeInputDate = (date) => {
  const dateString = String(date).split("T")[0];

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const normalizedDate = new Date(Date.UTC(year, month - 1, day));

  if (Number.isNaN(normalizedDate.getTime())) {
    return null;
  }

  return normalizedDate;
};

/*
  Build actual India shift Date.

  Example:
  2026-07-13 09:00 IST
*/

const createIndiaShiftTime = (attendanceDate, hour, minute) => {
  const year = attendanceDate.getUTCFullYear();

  const month = String(attendanceDate.getUTCMonth() + 1).padStart(2, "0");

  const day = String(attendanceDate.getUTCDate()).padStart(2, "0");

  const hours = String(hour).padStart(2, "0");

  const minutes = String(minute).padStart(2, "0");

  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00+05:30`);
};

/* =========================================================
   PUNCH IN
========================================================= */

/* =========================================================
   PUNCH IN
========================================================= */

exports.punchIn = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const { latitude, longitude } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Teacher",
      });
    }

    /* ================= LOCATION CHECK ================= */

    const locationCheck = validateAttendanceLocation(latitude, longitude);

    if (!locationCheck.valid) {
      return res.status(403).json({
        success: false,
        message: locationCheck.message,
        distance:
          locationCheck.distance !== undefined
            ? Math.round(locationCheck.distance)
            : null,
        allowedRadius: ATTENDANCE_LOCATION.radiusMeters,
      });
    }

    /* ================= ATTENDANCE ================= */

    const now = new Date();

    const today = getAttendanceDate(now);

    let attendance = await Attendance.findOne({
      teacherId,
      date: today,
    });

    if (attendance?.punchIn) {
      return res.status(400).json({
        success: false,
        message: "Already punched in today.",
      });
    }

    const shiftStart = createIndiaShiftTime(
      today,
      SHIFT_START_HOUR,
      SHIFT_START_MINUTE,
    );

    const halfDayTime = createIndiaShiftTime(
      today,
      HALF_DAY_HOUR,
      HALF_DAY_MINUTE,
    );

    let status = "Present";
    let lateMinutes = 0;

    if (now > halfDayTime) {
      status = "Half Day";

      lateMinutes = Math.floor((now - shiftStart) / 60000);
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
    attendance.lateMinutes = Math.max(lateMinutes, 0);

    attendance.activities.push({
      type: "Punch In",
      time: now,
    });

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Punch In Successful",
      distance: Math.round(locationCheck.distance),
      location: ATTENDANCE_LOCATION.name,
      data: attendance,
    });
  } catch (err) {
    console.error("PUNCH IN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
/* =========================================================
   BREAK START
========================================================= */

exports.breakStart = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const reason = req.body?.reason?.trim() || "";

    const now = new Date();

    const today = getAttendanceDate(now);

    const attendance = await Attendance.findOne({
      teacherId,
      date: today,
    });

    if (!attendance?.punchIn) {
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

    return res.status(200).json({
      success: true,
      message: "Break Started Successfully",
      data: attendance,
    });
  } catch (err) {
    console.error("BREAK START ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   BREAK END
========================================================= */

exports.breakEnd = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const now = new Date();

    const today = getAttendanceDate(now);

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

    if (attendance.breaks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No break found.",
      });
    }

    const currentBreak = attendance.breaks[attendance.breaks.length - 1];

    if (currentBreak.end) {
      return res.status(400).json({
        success: false,
        message: "Current break already ended.",
      });
    }

    currentBreak.end = now;

    const seconds = Math.max(Math.floor((now - currentBreak.start) / 1000), 0);

    currentBreak.durationSeconds = seconds;

    /*
      Recalculate instead of +=.

      Prevents wrong duplicate total.
    */

    attendance.breakSeconds = attendance.breaks.reduce(
      (total, item) => total + Number(item.durationSeconds || 0),
      0,
    );

    attendance.activities.push({
      type: "Break End",
      time: now,
    });

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Break Ended Successfully",
      data: attendance,
    });
  } catch (err) {
    console.error("BREAK END ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   PUNCH OUT
========================================================= */

/* =========================================================
   PUNCH OUT
========================================================= */

exports.punchOut = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const { latitude, longitude } = req.body;

    /* ================= LOCATION CHECK ================= */

    const locationCheck = validateAttendanceLocation(latitude, longitude);

    if (!locationCheck.valid) {
      return res.status(403).json({
        success: false,
        message: locationCheck.message,
        distance:
          locationCheck.distance !== undefined
            ? Math.round(locationCheck.distance)
            : null,
        allowedRadius: ATTENDANCE_LOCATION.radiusMeters,
      });
    }

    /* ================= ATTENDANCE ================= */

    const now = new Date();

    const today = getAttendanceDate(now);

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

    const lastBreak =
      attendance.breaks.length > 0
        ? attendance.breaks[attendance.breaks.length - 1]
        : null;

    if (lastBreak && !lastBreak.end) {
      return res.status(400).json({
        success: false,
        message: "Please end your current break first.",
      });
    }

    attendance.punchOut = now;

    attendance.breakSeconds = attendance.breaks.reduce(
      (total, item) => total + Number(item.durationSeconds || 0),
      0,
    );

    const totalSeconds = Math.max(
      Math.floor((attendance.punchOut - attendance.punchIn) / 1000),
      0,
    );

    attendance.workSeconds = Math.max(
      totalSeconds - attendance.breakSeconds,
      0,
    );

    const requiredSeconds = Number(WORKING_HOURS) * 60 * 60;

    attendance.overtimeSeconds = Math.max(
      attendance.workSeconds - requiredSeconds,
      0,
    );

    const shiftEnd = createIndiaShiftTime(
      today,
      SHIFT_END_HOUR,
      SHIFT_END_MINUTE,
    );

    attendance.earlyLeavingMinutes = 0;

    if (attendance.punchOut < shiftEnd) {
      attendance.earlyLeavingMinutes = Math.max(
        Math.floor((shiftEnd - attendance.punchOut) / 60000),
        0,
      );
    }

    attendance.activities.push({
      type: "Punch Out",
      time: now,
    });

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Punch Out Successful",
      distance: Math.round(locationCheck.distance),
      location: ATTENDANCE_LOCATION.name,
      data: attendance,
    });
  } catch (err) {
    console.error("PUNCH OUT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
/* =========================================================
   TODAY ATTENDANCE
========================================================= */

exports.getTodayAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const today = getAttendanceDate(new Date());

    const attendance = await Attendance.findOne({
      teacherId,
      date: today,
    });

    if (!attendance) {
      return res.status(200).json({
        success: true,
        isPunchedIn: false,
        isOnBreak: false,
        attendance: null,
      });
    }

    const lastBreak =
      attendance.breaks.length > 0
        ? attendance.breaks[attendance.breaks.length - 1]
        : null;

    const isOnBreak = Boolean(lastBreak?.start && !lastBreak?.end);

    const isPunchedIn = Boolean(attendance.punchIn && !attendance.punchOut);

    return res.status(200).json({
      success: true,
      isPunchedIn,
      isOnBreak,
      attendance,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   MARK ATTENDANCE
========================================================= */

exports.markAttendance = async (req, res) => {
  try {
    const { date, status } = req.body;

    const teacherId = req.user.id;

    if (!date || !status) {
      return res.status(400).json({
        success: false,
        message: "date and status required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacherId",
      });
    }

    const attendanceDate = normalizeInputDate(date);

    if (!attendanceDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        teacherId,
        date: attendanceDate,
      },
      {
        $set: {
          teacherId,
          date: attendanceDate,
          status,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   MONTHLY ATTENDANCE
========================================================= */

exports.getMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;

    const teacherId = req.user.id;

    const monthNumber = Number(month);

    const yearNumber = Number(year);

    if (!monthNumber || !yearNumber || monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({
        success: false,
        message: "Valid month and year required",
      });
    }

    const start = new Date(Date.UTC(yearNumber, monthNumber - 1, 1));

    const end = new Date(Date.UTC(yearNumber, monthNumber, 1));

    const records = await Attendance.find({
      teacherId,

      date: {
        $gte: start,
        $lt: end,
      },
    }).sort({
      date: 1,
    });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   ATTENDANCE SUMMARY
========================================================= */

exports.getAttendanceSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const teacherId = req.user.id;

    const monthNumber = Number(month);

    const yearNumber = Number(year);

    if (!monthNumber || !yearNumber || monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({
        success: false,
        message: "Valid month and year required",
      });
    }

    const start = new Date(Date.UTC(yearNumber, monthNumber - 1, 1));

    const end = new Date(Date.UTC(yearNumber, monthNumber, 1));

    const records = await Attendance.find({
      teacherId,

      date: {
        $gte: start,
        $lt: end,
      },
    });

    const summary = {
      present: 0,
      leave: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
    };

    records.forEach((record) => {
      if (record.status === "Present") {
        summary.present += 1;
      }

      if (record.status === "Leave") {
        summary.leave += 1;
      }

      if (record.status === "Absent") {
        summary.absent += 1;
      }

      if (record.status === "Late") {
        summary.late += 1;
      }

      if (record.status === "Half Day") {
        summary.halfDay += 1;
      }
    });

    const totalDays = new Date(yearNumber, monthNumber, 0).getDate();

    return res.status(200).json({
      success: true,

      summary: {
        totalDays,

        ...summary,

        workingDays: records.length,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   ATTENDANCE HISTORY
========================================================= */

exports.getAttendanceHistory = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const { period = "this-month", search = "" } = req.query;

    const now = new Date();

    let startDate;

    if (period === "this-week") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "three-months") {
      startDate = new Date(now);

      startDate.setMonth(startDate.getMonth() - 3);
    } else {
      const { year, month } = getIndiaDateParts(now);

      startDate = new Date(Date.UTC(year, month - 1, 1));
    }

    const filter = {
      teacherId,

      date: {
        $gte: startDate,
      },
    };

    if (search.trim()) {
      filter.status = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const history = await Attendance.find(filter).sort({
      date: -1,
    });

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   GET ALL ATTENDANCE
========================================================= */

exports.getAllAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;

    const filter = {};

    if (month && year) {
      const monthNumber = Number(month);
      const yearNumber = Number(year);

      const start = new Date(Date.UTC(yearNumber, monthNumber - 1, 1));
      const end = new Date(Date.UTC(yearNumber, monthNumber, 1));

      filter.date = {
        $gte: start,
        $lt: end,
      };
    }

    const data = await Attendance.find(filter)
      .populate("teacherId")
      .sort({ date: 1 });

    console.log(JSON.stringify(data[0], null, 2));

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

/* =========================================================
   GET ALL TODAY ATTENDANCE - ADMIN
========================================================= */

exports.getAllTodayAttendance = async (req, res) => {
  try {
    const today = getAttendanceDate(new Date());

    const data = await Attendance.find({
      date: today,
    })
      .populate("teacherId", "name email image department")
      .sort({ punchIn: 1 });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("GET TODAY ATTENDANCE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   DELETE ATTENDANCE
========================================================= */

exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   MARK ATTENDANCE BY ADMIN
========================================================= */

exports.markAttendanceByAdmin = async (req, res) => {
  try {
    const { teacherId, date, status } = req.body;

    if (!teacherId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "teacherId, date and status required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacherId",
      });
    }

    const attendanceDate = normalizeInputDate(date);

    if (!attendanceDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        teacherId,
        date: attendanceDate,
      },
      {
        $set: {
          teacherId,
          date: attendanceDate,
          status,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
