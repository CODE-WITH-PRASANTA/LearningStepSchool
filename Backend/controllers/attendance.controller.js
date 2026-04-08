// controllers/attendance.controller.js
const Attendance = require("../models/Attendance.model");


// ================= GET ATTENDANCE =================
exports.getAttendance = async (req, res) => {
  try {
    const { className, section, date } = req.query;

    const attendance = await Attendance.findOne({
      className,
      section,
      date,
    });

    res.status(200).json({
      success: true,
      data: attendance || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= SAVE / UPDATE =================
exports.saveAttendance = async (req, res) => {
  try {
    const { className, section, date, students } = req.body;

    let existing = await Attendance.findOne({
      className,
      section,
      date,
    });

    if (existing) {
      // update
      existing.students = students;
      await existing.save();

      return res.json({
        success: true,
        message: "Attendance Updated ✅",
      });
    }

    // create new
    const newAttendance = new Attendance({
      className,
      section,
      date,
      students,
    });

    await newAttendance.save();

    res.json({
      success: true,
      message: "Attendance Saved ✅",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};