const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  createLeaveByAdmin,
  updateLeaveStatus,
  deleteLeave,
} = require("../../controllers/teacherController/TeacherLeave.controller");

const auth = require("../../middleware/authMiddleware");

// 👨‍🏫 Teacher
router.post("/teacher/leaves", auth, applyLeave);
router.get("/teacher/leaves", auth, getMyLeaves);
router.delete("/teacher/leaves/:id", auth, deleteLeave);

// 👨‍💼 Admin
router.get("/admin/leaves", auth, getAllLeaves);
router.post("/admin/leaves", auth, createLeaveByAdmin);
router.put("/admin/leaves/:id", auth, updateLeaveStatus);
router.delete("/admin/leaves/:id", auth, deleteLeave);

module.exports = router;
