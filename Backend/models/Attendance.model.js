// models/attendance.model.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  className: String,
  section: String,
  date: String,

  students: [
    {
      studentId: String,
      name: String,
      rollNumber: String,
      status: {
        type: String,
        enum: ["Present", "Absent", "Leave"],
        default: "Present",
      },
      note: String,
    },
  ],
});

// prevent duplicate same date attendance
attendanceSchema.index(
  { className: 1, section: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);