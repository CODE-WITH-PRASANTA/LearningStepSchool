const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getMyLeaves,
} = require("../../controllers/teacherController/TeacherLeave.controller");

const auth = require("../../middleware/authMiddleware");

// Apply leave
router.post("/leaves", auth, applyLeave);

// Get my leaves
router.get("/leaves", auth, getMyLeaves);

module.exports = router;