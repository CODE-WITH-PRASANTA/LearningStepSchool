const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const { upload, convertToWebp } = require("../../middleware/upload");

const {
  loginTeacher,
  logoutTeacher,
} = require("../../controllers/teacherController/auth.controller");

const {
  getMeTeacher,
  updateMyTeacherImage,
  getTeachers,
} = require("../../controllers/teacherController/createteacher.controller");

// AUTH
router.post("/login", loginTeacher);
router.post("/logout", logoutTeacher);


router.get("/all", auth, getTeachers);
// CURRENT USER
router.get("/me", auth, getMeTeacher);

// CURRENT USER (PROFILE IMAGE ONLY)
router.put(
  "/me/image",
  auth,
  upload.single("image"),
  convertToWebp,
  updateMyTeacherImage
);

module.exports = router;