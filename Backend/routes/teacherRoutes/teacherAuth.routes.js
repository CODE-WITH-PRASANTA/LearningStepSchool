const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");

const {
  loginTeacher,
  logoutTeacher,
} = require("../../controllers/teacherController/auth.controller");

const {
  getMeTeacher,
} = require("../../controllers/teacherController/createteacher.controller");

// AUTH
router.post("/login", loginTeacher);
router.post("/logout", logoutTeacher);

// CURRENT USER
router.get("/me", auth, getMeTeacher);

module.exports = router;