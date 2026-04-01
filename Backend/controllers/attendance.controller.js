const Attendance = require("../models/Attendance.model");
const Student = require("../models/sudentAdmission.model");

// ================= GET STUDENTS BY CLASS =================
exports.getStudentsByClass = async (req, res) => {
  try {
    const { className, section } = req.query;

    if (!className || !section) {
      return res.status(400).json({
        success: false,
        message: "Class and Section are required",
      });
    }

    const students = await Student.find({
      class: className,
      section: section,
    }).select("name rollNumber admissionNo class section");

    res.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ATTENDANCE =================
exports.getAttendance = async (req, res) => {
  try {
    const { className, section, date } = req.query;

    if (!className || !section || !date) {
      return res.status(400).json({
        success: false,
        message: "Class, Section and Date are required",
      });
    }

    const attendance = await Attendance.findOne({
      className,
      section,
      date,
    });

    res.json({
      success: true,
      data: attendance || null,
    });
  } catch (err) {
    console.error("GET ATTENDANCE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= SAVE / UPDATE ATTENDANCE =================
exports.saveAttendance = async (req, res) => {
  try {
    const { className, section, date, students } = req.body;

    if (!className || !section || !date || !students) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ format students (important)
    const formattedStudents = students.map((s) => ({
      studentId: s.studentId,
      name: s.name,
      rollNumber: s.rollNumber || "",
      status: s.status,
      note: s.note || "",
    }));

    // 🔥 UPSERT (create or update)
    const attendance = await Attendance.findOneAndUpdate(
      { className, section, date },
      { students: formattedStudents },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      success: true,
      message: "Attendance saved successfully",
      data: attendance,
    });
  } catch (err) {
    console.error("SAVE ATTENDANCE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= DELETE ATTENDANCE (OPTIONAL) =================
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    await Attendance.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Attendance deleted",
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};