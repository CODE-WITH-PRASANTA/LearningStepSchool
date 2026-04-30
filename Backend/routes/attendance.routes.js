const express = require("express");
const router = express.Router();

const {
  getAttendance,
  saveAttendance,
  exportAttendanceExcel, // ✅ ADD THIS
} = require("../controllers/attendance.controller");

// GET (load attendance)
router.get("/", getAttendance);

// POST (save attendance)
router.post("/", saveAttendance);

// 🔥 EXPORT EXCEL (IMPORTANT)
router.get("/export", exportAttendanceExcel);

module.exports = router;