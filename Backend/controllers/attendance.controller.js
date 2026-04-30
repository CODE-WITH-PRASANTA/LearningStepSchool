const Attendance = require("../models/Attendance.model");
const ExcelJS = require("exceljs");

/* ================= GET ATTENDANCE ================= */
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
    console.error("GET ATTENDANCE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= SAVE / UPDATE ================= */
exports.saveAttendance = async (req, res) => {
  try {
    const { className, section, date, students } = req.body;

    if (!className || !section || !date || !students) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let existing = await Attendance.findOne({
      className,
      section,
      date,
    });

    if (existing) {
      // ✅ UPDATE
      existing.students = students;
      await existing.save();

      return res.json({
        success: true,
        message: "Attendance Updated ✅",
        data: existing,
      });
    }

    // ✅ CREATE NEW
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
      data: newAttendance,
    });
  } catch (error) {
    console.error("SAVE ATTENDANCE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.exportAttendanceExcel = async (req, res) => {
  try {
    const records = await Attendance.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance Report");

    worksheet.columns = [
      { header: "Student Name", key: "name", width: 25 },
      { header: "Roll No", key: "roll", width: 10 },
      { header: "Class", key: "className", width: 15 },
      { header: "Section", key: "section", width: 10 },
      { header: "Date", key: "date", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];

    records.forEach((record) => {
      record.students.forEach((stu) => {
        worksheet.addRow({
          name: stu.name || "N/A",
          roll: stu.rollNumber || "-",
          className: record.className,
          section: record.section,
          date: new Date(record.date).toLocaleDateString(),
          status: stu.status,
        });
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("EXPORT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};