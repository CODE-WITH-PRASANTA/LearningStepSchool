const express = require("express");
const router = express.Router();

const {
  getStudentsByClass,
  getAttendance,
  saveAttendance,
  deleteAttendance,
} = require("../controllers/attendance.controller");

// ================= STUDENTS =================
router.get("/students", getStudentsByClass);

// ================= ATTENDANCE =================
router.get("/attendance", getAttendance);
router.post("/attendance", saveAttendance);
router.delete("/attendance/:id", deleteAttendance); // optional

module.exports = router;