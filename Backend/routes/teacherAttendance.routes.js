const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getMonthlyAttendance,
  getAttendanceSummary,
  getAllAttendance,
  deleteAttendance,
  markAttendanceByAdmin,
} = require("../controllers/teacherAttendance.controller");

const auth = require("../middleware/authMiddleware");

// mark
router.post("/", auth, markAttendance);

// monthly
router.get("/monthly", auth, getMonthlyAttendance);

// summary
router.get("/summary", auth, getAttendanceSummary);

// admin
router.get("/", auth, getAllAttendance);

// admin mark
router.post("/admin", auth, markAttendanceByAdmin);

// delete
router.delete("/:id", auth, deleteAttendance);

module.exports = router;