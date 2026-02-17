const express = require("express");
const router = express.Router();

const {
  createTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacher.controller");

const { upload, convertToWebp } = require("../middleware/upload");

// Create
router.post(
  "/",
  upload.single("photo"),
  convertToWebp,
  createTeacher
);

// Get All
router.get("/", getTeachers);

// Update
router.put(
  "/:id",
  upload.single("photo"),
  convertToWebp,
  updateTeacher
);

// Delete
router.delete("/:id", deleteTeacher);

module.exports = router;