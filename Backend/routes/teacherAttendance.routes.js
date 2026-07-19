const express = require("express");
const router = express.Router();

const {
  punchIn,
  breakStart,
  breakEnd,
  punchOut,
  markAttendance,
  getTodayAttendance,
  getMonthlyAttendance,
  getAttendanceSummary,
  getAllAttendance,
  deleteAttendance,
  markAttendanceByAdmin,
  getAttendanceHistory,
  getAllTodayAttendance
} = require("../controllers/teacherAttendance.controller");

const auth = require("../middleware/authMiddleware");

// New API
router.post("/punch-in", auth, punchIn);


router.post("/break-start", auth, breakStart);

router.post("/break-end", auth, breakEnd);

router.post("/punch-out", auth, punchOut);

// Existing API
router.post("/", auth, markAttendance);


router.get("/today", auth, getTodayAttendance);

router.get("/admin/today", auth, getAllTodayAttendance);

// Monthly
router.get("/monthly", auth, getMonthlyAttendance);

// Summary
router.get("/summary", auth, getAttendanceSummary);
router.get("/history", auth, getAttendanceHistory);
// Admin
router.get("/", auth, getAllAttendance);

// Admin Mark
router.post("/admin", auth, markAttendanceByAdmin);

// Delete
router.delete("/:id", auth, deleteAttendance);

module.exports = router;