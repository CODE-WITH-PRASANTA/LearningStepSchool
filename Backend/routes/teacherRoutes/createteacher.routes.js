const express = require("express");
const router = express.Router();

const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
 
} = require("../../controllers/teacherController/createteacher.controller");

const auth = require("../../middleware/authMiddleware");
const checkPermission = require("../../middleware/checkPermission");





// ================= ADMIN TEACHER MANAGEMENT =================

// CREATE
router.post(
  "/teachers",
  auth,
  checkPermission("CREATE_TEACHER"),
  createTeacher
);

// GET ALL
router.get(
  "/teachers",
  auth,
  checkPermission("VIEW_TEACHERS"),
  getTeachers
);

// GET ONE
router.get(
  "/teachers/:id",
  auth,
  checkPermission("VIEW_TEACHERS"),
  getTeacherById
);


// UPDATE
router.put(
  "/teachers/:id",
  auth,
  checkPermission("UPDATE_TEACHER"),
  updateTeacher
);

// DELETE
router.delete(
  "/teachers/:id",
  auth,
  checkPermission("DELETE_TEACHER"),
  deleteTeacher
);

module.exports = router;