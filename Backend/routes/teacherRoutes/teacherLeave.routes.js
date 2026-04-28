const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../../controllers/teacherController/TeacherLeave.controller");

const auth = require("../../middleware/authMiddleware");

// 👨‍🏫 Teacher
router.post("/teacher/leaves", auth, applyLeave);
router.get("/teacher/leaves", auth, getMyLeaves);

// 👨‍💼 Admin
router.get("/admin/leaves", auth, getAllLeaves);
router.put("/admin/leaves/:id", auth, updateLeaveStatus);

module.exports = router;