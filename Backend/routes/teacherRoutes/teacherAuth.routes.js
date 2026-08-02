const express = require("express");
const router = express.Router();

const auth = require("../../middleware/authMiddleware");

const {
  upload,
  convertToWebp,
} = require("../../middleware/upload");

// ==============================
// AUTH CONTROLLER
// ==============================

const {
  loginTeacher,
  logoutTeacher,
} = require("../../controllers/teacherController/auth.controller");

// ==============================
// TEACHER CONTROLLER
// ==============================

const {
  getMeTeacher,
  updateMyTeacherImage,
  getTeachers,
  searchTeachers,
} = require(
  "../../controllers/teacherController/createteacher.controller"
);

// ==============================
// AUTH
// ==============================

router.post("/login", loginTeacher);

router.post("/logout", logoutTeacher);

// ==============================
// GET ALL TEACHERS
// ==============================

router.get("/all", auth, getTeachers);

// ==============================
// SEARCH TEACHERS
// ==============================

router.get("/search", auth, searchTeachers);

// ==============================
// CURRENT TEACHER
// ==============================

router.get("/me", auth, getMeTeacher);

// ==============================
// UPDATE PROFILE IMAGE
// ==============================

router.put(
  "/me/image",
  auth,
  upload.single("image"),
  convertToWebp,
  updateMyTeacherImage
);

module.exports = router;